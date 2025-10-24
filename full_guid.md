# Flowboard Backend Development Guide - Context & Concepts

## 📋 Table of Contents

1. [Project Overview & Architecture](#project-overview--architecture)
2. [Week 1-2: Authentication System](#week-1-2-authentication-system)
3. [Week 3-4: Projects & Tasks with Relationships](#week-3-4-projects--tasks-with-relationships)
4. [Week 5-6: Advanced Features](#week-5-6-advanced-features)
5. [Key Concepts & Best Practices](#key-concepts--best-practices)
6. [Testing Strategy](#testing-strategy)
7. [Deployment Considerations](#deployment-considerations)

---

## Project Overview & Architecture

### What You're Building

Flowboard is a team project management API that handles:

- User authentication and authorization
- Project creation and management
- Task tracking with statuses and assignments
- Team member collaboration
- Role-based permissions
- Real-time features (later weeks)

### Architecture Pattern: MVC (Model-View-Controller)

You'll use a clean separation of concerns:

- **Models**: Define data structure and business logic (MongoDB schemas)
- **Controllers**: Handle request/response logic (business operations)
- **Routes**: Define API endpoints and map them to controllers
- **Middleware**: Handle cross-cutting concerns (auth, validation, errors)
- **Utils**: Reusable helper functions

### Folder Structure Philosophy

```
src/
├── config/       → Database and app configuration
├── models/       → Mongoose schemas (data structure)
├── controllers/  → Business logic (what happens when endpoint is hit)
├── routes/       → API endpoint definitions (URL mapping)
├── middleware/   → Reusable functions that run before controllers
└── utils/        → Helper functions (token generation, email, etc.)
```

### RESTful API Design Principles

Your API will follow REST conventions:

- `GET` = Retrieve data (read-only)
- `POST` = Create new resources
- `PUT/PATCH` = Update existing resources
- `DELETE` = Remove resources

**URL Structure:**

- `/api/auth/register` - User registration
- `/api/auth/login` - User login
- `/api/projects` - List all projects (GET) or create (POST)
- `/api/projects/:id` - Get, update, or delete specific project
- `/api/projects/:id/tasks` - Tasks within a project
- `/api/tasks/:id` - Individual task operations

---

## Week 1-2: Authentication System

### Goal

Build a secure user authentication system that:

- Allows users to register with email/password
- Validates input data
- Hashes passwords (never store plain text!)
- Issues JWT tokens for session management
- Implements refresh token mechanism
- Protects routes that require authentication

### Core Concepts You'll Learn

#### 1. Password Security

**Why hash passwords?**

- Never store passwords in plain text in database
- If database is compromised, passwords are still safe
- Use bcrypt (industry standard) with salt rounds

**Flow:**

1. User submits password during registration
2. Your server hashes it with bcrypt (10+ salt rounds)
3. Store only the hash in database
4. During login, hash submitted password and compare hashes

#### 2. JWT (JSON Web Tokens)

**What are JWTs?**

- Stateless authentication (no session storage on server)
- Token contains user ID and expiration time
- Signed with a secret key to prevent tampering

**How it works:**

1. User logs in with email/password
2. Server validates credentials
3. Server creates JWT with user ID inside
4. Server sends token to client
5. Client stores token (localStorage or httpOnly cookie)
6. Client includes token in Authorization header for future requests
7. Server verifies token on protected routes

**JWT Structure:**

- Header: Token type and algorithm
- Payload: User data (ID, role, etc.)
- Signature: Prevents tampering

#### 3. Access vs Refresh Tokens

**Why two tokens?**

- **Access Token**: Short-lived (7 days), used for API requests
- **Refresh Token**: Long-lived (30 days), used to get new access token

**Benefits:**

- If access token is stolen, it expires quickly
- Refresh token is stored more securely
- Better security without forcing users to re-login constantly

**Flow:**

1. Login returns both access + refresh tokens
2. Client uses access token for requests
3. When access token expires, use refresh token to get new one
4. If refresh token is invalid/expired, user must login again

#### 4. Protected Routes (Middleware)

**What are middleware?**

- Functions that run BEFORE your controller
- Can check authentication, validate input, log requests, etc.
- Can block request or pass it to next function

**Authentication Middleware Flow:**

1. Client sends request with token in header: `Authorization: Bearer <token>`
2. Middleware extracts token from header
3. Middleware verifies token with JWT secret
4. If valid: decode token, get user ID, attach user to request object
5. If invalid: return 401 Unauthorized error
6. If valid: call `next()` to pass request to controller

#### 5. Input Validation

**Why validate?**

- Prevent malicious data from reaching database
- Provide clear error messages to users
- Security against injection attacks

**What to validate:**

- Email format (regex pattern)
- Password strength (minimum length, complexity)
- Required fields are present
- Data types are correct
- Sanitize input (remove malicious characters)

### API Endpoints to Build

#### POST `/api/auth/register`

**Purpose:** Create new user account
**Request body:** name, email, password
**Process:**

1. Validate input (email format, password length)
2. Check if email already exists
3. Hash password with bcrypt
4. Create user in database
5. Generate JWT tokens
6. Return user data (without password) + tokens

#### POST `/api/auth/login`

**Purpose:** Authenticate existing user
**Request body:** email, password
**Process:**

1. Find user by email
2. Compare submitted password with hashed password
3. If match: generate JWT tokens
4. Return user data + tokens
5. If no match: return 401 error

#### GET `/api/auth/me`

**Purpose:** Get currently logged-in user info
**Protected:** Yes (requires valid token)
**Process:**

1. Middleware verifies token and attaches user to request
2. Controller returns user data from request object

#### POST `/api/auth/refresh`

**Purpose:** Get new access token using refresh token
**Request body:** refreshToken
**Process:**

1. Verify refresh token
2. Check if token exists in user's database record
3. Generate new access token
4. Return new access token

#### POST `/api/auth/logout`

**Purpose:** Invalidate refresh token
**Process:**

1. Remove refresh token from user's database record
2. Client deletes tokens from storage

### Database Schema Design

**User Model Fields:**

- `name`: String, required, max 50 chars
- `email`: String, required, unique, lowercase, validated format
- `password`: String, required, min 6 chars, NOT returned by default
- `role`: Enum ['user', 'admin'], default 'user'
- `avatar`: String (URL), default placeholder
- `refreshToken`: String, NOT returned by default
- `createdAt`: Date (auto)
- `updatedAt`: Date (auto)

**Important Mongoose Features:**

- `select: false` on sensitive fields (password, refreshToken)
- Pre-save hook to hash password before saving
- Instance method to compare passwords
- Unique index on email for fast lookups and prevent duplicates

### Error Handling Strategy

**Centralized Error Middleware:**

- Catches all errors from controllers
- Formats consistent error responses
- Handles different error types (validation, authentication, database)
- Logs errors for debugging
- Doesn't expose sensitive info in production

**Error Response Format:**

```
{
  success: false,
  error: "Error message here",
  statusCode: 400
}
```

**Common Status Codes:**

- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized (not logged in or invalid token)
- 403: Forbidden (logged in but no permission)
- 404: Not Found
- 500: Server Error

### Environment Variables

**Why use .env?**

- Keep secrets out of code
- Different configs for dev/staging/production
- Easy to change without code changes

**Required variables:**

- `MONGO_URI`: Database connection string
- `JWT_SECRET`: Secret key for signing tokens
- `JWT_REFRESH_SECRET`: Different secret for refresh tokens
- `JWT_EXPIRE`: Access token expiration (e.g., "7d")
- `JWT_REFRESH_EXPIRE`: Refresh token expiration (e.g., "30d")
- `PORT`: Server port (e.g., 5000)
- `NODE_ENV`: development/production

### Security Best Practices

1. **Never commit .env to Git**

   - Add to .gitignore
   - Use .env.example as template

2. **Password Requirements**

   - Minimum 6 characters (8+ recommended)
   - Consider requiring: uppercase, lowercase, number, special char

3. **JWT Secret**

   - Use long, random string (64+ characters)
   - Different secrets for access/refresh tokens
   - Change in production

4. **CORS Configuration**

   - Only allow trusted origins
   - Configure properly for your frontend domain

5. **Rate Limiting**
   - Prevent brute force attacks on login
   - Limit requests per IP (e.g., 100/hour)

### Testing with Postman

**Collections to create:**

1. Auth Collection
   - Register (POST)
   - Login (POST)
   - Get Me (GET) - with token
   - Refresh Token (POST)
   - Logout (POST) - with token

**Environment Variables in Postman:**

- `{{URL}}` = <http://localhost:5000/api>
- `{{TOKEN}}` = (set automatically after login)

**Test Script Example (after login):**
Auto-save token from response to use in future requests

### Week 1-2 Milestones Checklist

- [ ] Project structure created
- [ ] MongoDB Atlas cluster created and connected
- [ ] User model created with password hashing
- [ ] Register endpoint working
- [ ] Login endpoint working and returns tokens
- [ ] JWT middleware protects routes
- [ ] Get current user endpoint working
- [ ] Refresh token endpoint working
- [ ] Logout endpoint working
- [ ] Input validation on all endpoints
- [ ] Error handling middleware working
- [ ] All endpoints tested in Postman
- [ ] Environment variables properly configured

---

## Week 3-4: Projects & Tasks with Relationships

### Goal

Build the core data models with proper relationships:

- Projects contain multiple tasks
- Tasks belong to one project
- Users can own projects
- Users can be members of projects
- Users can be assigned to tasks
- Implement full CRUD for projects and tasks

### Core Concepts You'll Learn

#### 1. MongoDB Relationships

**Three Types of Relationships:**

**a) Embedding (Nested Documents)**

- Store related data inside parent document
- Good for: Data that's always accessed together and doesn't grow unbounded
- Example: User settings inside User document

**b) Referencing (Foreign Keys)**

- Store ObjectId of related document
- Good for: One-to-many, many-to-many relationships
- Example: Task has project ObjectId

**c) Hybrid Approach**

- Combination of both
- Example: Store frequently accessed data embedded, full data referenced

**For Flowboard, you'll use:**

- Tasks reference their Project (projectId field)
- Tasks reference assigned User (assignedTo field)
- Projects store array of member UserIds
- Projects reference owner User (owner field)

#### 2. Mongoose Population

**What is population?**

- Automatically replaces ObjectId references with actual documents
- Like SQL JOINs but happens in application layer
- Makes it easy to fetch related data

**Example:**

```
// Without populate: Task has projectId: "507f1f77bcf86cd799439011"
// With populate: Task has project: { _id: "...", title: "Website Redesign", ... }
```

**When to populate:**

- GET single resource (need full details)
- LIST resources where you need related info
- Use `.select()` to limit populated fields (performance)

**When NOT to populate:**

- Performance-sensitive queries
- Only need IDs, not full documents
- Consider aggregation pipeline instead

#### 3. Mongoose Virtuals

**What are virtuals?**

- Computed properties that don't exist in database
- Calculated on-the-fly when you access them
- Useful for derived data

**Example use cases:**

- Project's `taskCount` (count of associated tasks)
- User's `fullName` (combines first + last name)
- Task's `isOverdue` (compares dueDate with today)

#### 4. Authorization vs Authentication

**Authentication:** "Who are you?"

- Already built in Weeks 1-2
- JWT token proves identity

**Authorization:** "What can you do?"

- Checking permissions after authentication
- Examples:
  - Only project owner can delete project
  - Only assigned user can mark task complete
  - Only project members can view project tasks

**Middleware Pattern:**

- First: Check authentication (valid token?)
- Second: Check authorization (allowed to do this?)
- If either fails: return 403 Forbidden

#### 5. Cascading Operations

**What is cascading?**

- When parent is deleted, also delete related children
- Maintains data consistency

**Example:**

- Delete project → also delete all its tasks
- Remove user from project → unassign them from all tasks in that project

**Implementation:**

- Use Mongoose middleware (pre/post hooks)
- `pre('remove')` hook to delete related documents
- Be careful: can't undo cascading deletes!

### Database Schema Design

#### Project Model Fields

- `title`: String, required, max 100 chars
- `description`: String, optional, max 500 chars
- `owner`: ObjectId ref to User, required (who created it)
- `members`: Array of ObjectId refs to Users (team members)
- `status`: Enum ['active', 'archived'], default 'active'
- `createdAt`: Date (auto)
- `updatedAt`: Date (auto)

**Indexes:**

- Index on `owner` for fast "my projects" queries
- Compound index on `owner + status`

**Virtuals:**

- `taskCount`: Count of tasks in this project
- `completedTaskCount`: Count of completed tasks

#### Task Model Fields

- `title`: String, required, max 100 chars
- `description`: String, optional, max 1000 chars
- `status`: Enum ['todo', 'in_progress', 'done'], default 'todo'
- `priority`: Enum ['low', 'medium', 'high'], default 'medium'
- `project`: ObjectId ref to Project, required
- `assignedTo`: ObjectId ref to User, optional
- `dueDate`: Date, optional
- `createdBy`: ObjectId ref to User, required
- `createdAt`: Date (auto)
- `updatedAt`: Date (auto)

**Indexes:**

- Compound index on `project + status` (for Kanban board queries)
- Index on `assignedTo` (for "my tasks" queries)
- Index on `dueDate` (for deadline queries)

### API Endpoints to Build

#### Project Endpoints

**GET `/api/projects`**

- List all projects user has access to
- Projects where user is owner OR member
- Support pagination (limit, page)
- Support filtering by status
- Populate owner and member names

**POST `/api/projects`**

- Create new project
- Set authenticated user as owner
- Validate title is present
- Optionally add initial members

**GET `/api/projects/:id`**

- Get single project details
- Check if user is owner or member (authorization)
- Populate owner, members, and task count
- Return 403 if user not authorized

**PUT `/api/projects/:id`**

- Update project details
- Only owner can update
- Can update: title, description, status
- Can add/remove members (if owner)

**DELETE `/api/projects/:id`**

- Delete project
- Only owner can delete
- Cascade delete all tasks in project
- Return 403 if not owner

**POST `/api/projects/:id/members`**

- Add member to project
- Only owner can add members
- Check if user exists
- Prevent duplicate members

**DELETE `/api/projects/:id/members/:userId`**

- Remove member from project
- Only owner can remove members
- Unassign member from all tasks in project

#### Task Endpoints

**GET `/api/projects/:projectId/tasks`**

- List all tasks in a project
- Check if user is project member
- Support filtering by: status, priority, assignedTo
- Support sorting by: createdAt, dueDate, priority
- Populate assignedTo user info

**POST `/api/projects/:projectId/tasks`**

- Create new task in project
- Check if user is project member
- Validate title is present
- Set createdBy to authenticated user
- If assignedTo provided, verify they're project member

**GET `/api/tasks/:id`**

- Get single task details
- Check if user is member of task's project
- Populate project, assignedTo, createdBy

**PUT `/api/tasks/:id`**

- Update task details
- Check authorization (project member)
- Can update: title, description, status, priority, assignedTo, dueDate
- If changing assignedTo, verify new user is project member

**DELETE `/api/tasks/:id`**

- Delete task
- Only task creator or project owner can delete
- Return 403 if not authorized

**GET `/api/tasks/my-tasks`**

- Get all tasks assigned to authenticated user
- Across all projects
- Support filtering and sorting

### Authorization Middleware Patterns

**Check Project Access:**

- Extract projectId from params
- Find project in database
- Check if req.user.\_id is owner or in members array
- If yes: call next()
- If no: return 403 error

**Check Project Ownership:**

- Same as access, but only owner allowed
- Used for: delete project, add/remove members

**Check Task Access:**

- Get task from database
- Populate task.project
- Check if user is project member
- If yes: call next()

### Query Optimization Tips

**Use `.select()` to limit fields:**

- Only return fields you need
- Reduce payload size
- Faster queries

**Use `.lean()` for read-only data:**

- Returns plain JS objects instead of Mongoose documents
- No overhead of Mongoose methods
- Faster performance

**Create compound indexes:**

- Index fields that are queried together
- Example: `{ project: 1, status: 1 }`
- Speeds up filtered queries

**Avoid N+1 queries:**

- Use populate instead of separate queries
- Or use aggregation pipeline
- Example: Don't loop through tasks and fetch project for each

### Data Validation

**Project Creation:**

- Title: required, 1-100 chars
- Description: optional, max 500 chars
- Members: must be valid user IDs that exist

**Task Creation:**

- Title: required, 1-100 chars
- Description: optional, max 1000 chars
- Status: must be one of allowed values
- Priority: must be one of allowed values
- AssignedTo: must be project member
- DueDate: must be future date (optional)

**Task Update:**

- Prevent changing task's project
- Validate new status/priority values
- Verify new assignee is project member

### Error Scenarios to Handle

- User tries to access project they're not member of
- User tries to delete project they don't own
- User tries to assign task to non-member
- User tries to create task in project they're not member of
- Project not found
- Task not found
- Invalid ObjectId format in params
- Trying to delete last owner from project

### Testing Strategy

**Postman Tests for Projects:**

1. Create project as User A (should succeed)
2. Get project as User A (should see it)
3. Get project as User B (should fail - not a member)
4. Add User B as member (User A does this)
5. Get project as User B (should now succeed)
6. Try to delete project as User B (should fail - not owner)
7. Delete project as User A (should succeed)

**Postman Tests for Tasks:**

1. Create task in Project X (should succeed if member)
2. Assign task to User B who's not member (should fail)
3. Add User B to project
4. Assign task to User B (should now succeed)
5. Update task as User B (should succeed)
6. Delete task as User C who's not member (should fail)

### Week 3-4 Milestones Checklist

- [ ] Project model created with relationships
- [ ] Task model created with relationships
- [ ] All project CRUD endpoints working
- [ ] All task CRUD endpoints working
- [ ] Authorization middleware protecting routes
- [ ] Only owners can delete projects
- [ ] Only members can see/edit project data
- [ ] Cascade delete works (delete project deletes tasks)
- [ ] Member management endpoints working
- [ ] Task assignment working with validation
- [ ] Population working correctly
- [ ] Indexes created for performance
- [ ] All endpoints tested in Postman
- [ ] Error handling for unauthorized access

---

## Week 5-6: Advanced Features

### Goal

Add professional-level features that mid-level developers are expected to know:

- Advanced filtering and search
- Pagination and sorting
- Role-based access control (RBAC)
- Query optimization
- Input sanitization
- Rate limiting

### Core Concepts You'll Learn

#### 1. Advanced Filtering

**Query Parameters:**
Users can filter results via URL query strings:

```
GET /api/tasks?status=in_progress&priority=high&assignedTo=userId
```

**Building Dynamic Queries:**

- Accept multiple query parameters
- Convert to Mongoose query object
- Handle different data types (string, number, date, boolean)
- Support operators (gt, gte, lt, lte, in)

**Filter Operators:**

- `status=done` → exact match
- `priority[in]=high,medium` → match any in array
- `dueDate[gte]=2024-01-01` → greater than or equal
- `dueDate[lt]=2024-12-31` → less than
- `createdAt[gte]=2024-01-01&createdAt[lte]=2024-12-31` → date range

**Implementation Pattern:**

- Create reusable query builder class
- Parse query string
- Remove non-filterable fields (page, limit, sort)
- Transform operators (gte, lte, gt, lt, in)
- Build Mongoose query object

#### 2. Search Functionality

**Text Search in MongoDB:**

- Create text index on searchable fields
- Use `$text` and `$search` operators
- Search across multiple fields simultaneously

**Fields to Search:**

- Project: title, description
- Task: title, description
- User: name, email (for member search)

**Search Query Example:**

```
GET /api/projects?search=website redesign
```

**How it works:**

- MongoDB text index tokenizes text
- Searches for any word in query
- Returns relevance score
- Can sort by relevance

**Implementation:**

- Add text index to model
- Accept `search` query parameter
- Use `$text: { $search: query }` in Mongoose
- Return results sorted by text score

#### 3. Pagination

**Why Pagination?**

- Don't return thousands of records at once
- Improves performance
- Better user experience
- Reduces bandwidth

**Two Approaches:**

**a) Offset Pagination (Simpler)**

```
GET /api/tasks?page=2&limit=20
```

- Skip: (page - 1) \* limit
- Limit: number of results
- Good for: Small to medium datasets
- Problem: Performance degrades with high page numbers

**b) Cursor Pagination (Better Performance)**

```
GET /api/tasks?cursor=lastItemId&limit=20
```

- Use last item's ID as starting point
- Better performance for large datasets
- Used by: Twitter, Facebook
- Problem: Can't jump to specific page

**Pagination Response Format:**

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "totalPages": 15,
    "totalResults": 289,
    "hasNextPage": true,
    "hasPrevPage": true
  }
}
```

#### 4. Sorting

**Allow Users to Sort Results:**

```
GET /api/tasks?sort=dueDate
GET /api/tasks?sort=-priority,createdAt  (descending priority, then ascending createdAt)
```

**Common Sort Fields:**

- `createdAt` / `-createdAt` (newest/oldest first)
- `updatedAt` / `-updatedAt`
- `dueDate` / `-dueDate`
- `priority` / `-priority` (with custom order: high > medium > low)
- `title` / `-title` (alphabetical)

**Implementation:**

- Parse sort parameter
- Convert to Mongoose sort object
- Apply to query
- Default sort if none provided

#### 5. Role-Based Access Control (RBAC)

**Roles in Flowboard:**

- **Admin**: Full system access, can manage all projects
- **Project Owner**: Full control over their projects
- **Project Manager**: Can manage project and tasks, but can't delete project
- **Developer**: Can update assigned tasks, view project
- **Viewer**: Read-only access to project

**Permission Matrix:**

| Action             | Admin | Owner | Manager | Developer | Viewer |
| ------------------ | ----- | ----- | ------- | --------- | ------ |
| Create Project     | ✅    | ✅    | ✅      | ✅        | ❌     |
| Delete Project     | ✅    | ✅    | ❌      | ❌        | ❌     |
| Add/Remove Members | ✅    | ✅    | ✅      | ❌        | ❌     |
| Create Task        | ✅    | ✅    | ✅      | ✅        | ❌     |
| Update Any Task    | ✅    | ✅    | ✅      | ❌        | ❌     |
| Update Own Task    | ✅    | ✅    | ✅      | ✅        | ❌     |
| Delete Task        | ✅    | ✅    | ✅      | ❌        | ❌     |
| View Project       | ✅    | ✅    | ✅      | ✅        | ✅     |

**Implementation:**

- Add `role` field to User model
- Add `projectRole` field when storing project members
- Create role-checking middleware
- Check both system role (admin) and project role

**Middleware Pattern:**

```
checkRole(['admin', 'owner'])
- Checks if user is admin OR project owner
- If yes: next()
- If no: 403 error
```

#### 6. API Features Class

**Reusable Query Builder:**
Create a utility class that handles:

- Filtering
- Searching
- Sorting
- Pagination
- Field selection

**Usage Pattern:**

```
// In controller:
const features = new APIFeatures(Task.find(), req.query)
  .filter()
  .search(['title', 'description'])
  .sort()
  .paginate();

const tasks = await features.query;
const pagination = features.getPaginationInfo();
```

**Benefits:**

- DRY (Don't Repeat Yourself)
- Consistent API across all endpoints
- Easy to maintain and extend
- Clean controller code

#### 7. Input Sanitization

**Why Sanitize?**

- Prevent NoSQL injection attacks
- Prevent XSS (Cross-Site Scripting)
- Clean user input
- Validate data types

**What to Sanitize:**

- Remove MongoDB operators from input (`$`, `.`)
- Trim whitespace
- Escape HTML characters
- Convert to appropriate types

**Examples of Attacks:**

```
// NoSQL Injection attempt:
{ "email": { "$ne": null }, "password": { "$ne": null } }
// Would match any user!

// XSS attempt:
{ "name": "<script>alert('hacked')</script>" }
// Would execute JavaScript if rendered
```

**Protection:**

- Use express-mongo-sanitize
- Use express-validator
- Validate/sanitize all user input
- Never trust client data

#### 8. Rate Limiting

**Why Rate Limit?**

- Prevent brute force attacks (password guessing)
- Prevent API abuse
- Protect server resources
- Fair usage across users

**Where to Apply:**

- Login endpoint (prevent password guessing)
- Registration endpoint (prevent spam accounts)
- All API endpoints (general protection)

**Rate Limit Strategies:**

- Per IP address: 100 requests per 15 minutes
- Per user: 1000 requests per hour
- Stricter on auth endpoints: 5 login attempts per 15 minutes

**Response When Limited:**

```json
{
  "success": false,
  "error": "Too many requests, please try again later",
  "retryAfter": 900 // seconds until limit resets
}
```

### Advanced Query Examples

**Complex Filtering:**

```
GET /api/tasks?status=in_progress&priority[in]=high,medium&dueDate[gte]=2024-01-01&assignedTo=userId&sort=-priority,dueDate&page=1&limit=20
```

This should:

- Filter: status is "in_progress"
- Filter: priority is either "high" or "medium"
- Filter: dueDate is on or after Jan 1, 2024
- Filter: assigned to specific user
- Sort: by priority (descending), then dueDate (ascending)
- Paginate: page 1, 20 items per page

**Search + Filter:**

```
GET /api/projects?search=website&status=active&sort=-updatedAt&limit=10
```

This should:

- Search: title/description contains "website"
- Filter: only active projects
- Sort: most recently updated first
- Limit: 10 results

### Performance Optimization

**Indexing Strategy:**

- Single field indexes on frequently queried fields
- Compound indexes for common filter combinations
- Text indexes for search
- Monitor slow queries with explain()

**Recommended Indexes:**

```
Project:
- { owner: 1, status: 1 }
- { members: 1 }
- { title: "text", description: "text" }

Task:
- { project: 1, status: 1 }
- { assignedTo: 1, status: 1 }
- { dueDate: 1 }
- { title: "text", description: "text" }

User:
- { email: 1 } (unique)
```

**Query Optimization Tips:**

- Use projection to limit fields returned
- Use lean() for read-only queries
- Avoid populating unnecessary fields
- Cache frequent queries (later with Redis)
- Use aggregation for complex calculations

### API Documentation

**Why Document?**

- Helps frontend developers use your API
- Portfolio piece (shows professionalism)
- Makes testing easier
- Future you will thank you

**What to Document:**

- All endpoints (URL, method)
- Required/optional parameters
- Request body format
- Response format
- Error responses
- Authentication requirements
- Example requests/responses

**Tools:**

- Postman (export collection)
- Swagger/OpenAPI
- README with examples

### Week 5-6 Milestones Checklist

- [ ] API Features class created and working
- [ ] Filtering working on all list endpoints
- [ ] Search working on projects and tasks
- [ ] Pagination working with correct metadata
- [ ] Sorting working with multiple fields
- [ ] RBAC system implemented
- [ ] Role middleware protecting appropriate routes
- [ ] Permission matrix enforced
- [ ] Input sanitization on all endpoints
- [ ] Rate limiting implemented
- [ ] Indexes created for performance
- [ ] Complex queries tested in Postman
- [ ] API documentation created
- [ ] All edge cases handled

---

## Key Concepts & Best Practices

### Security Checklist

**Authentication & Authorization:**

- [ ] Passwords hashed with bcrypt (10+ rounds)
- [ ] JWT secrets are long and random
- [ ] Tokens have reasonable expiration times
- [ ] Refresh token rotation implemented
- [ ] Protected routes check token validity
- [ ] Authorization checks before sensitive operations

**Input Validation:**

- [ ] All user input validated
- [ ] NoSQL injection protection (sanitize $ and .)
- [ ] XSS protection (escape HTML)
- [ ] SQL injection protection (use parameterized queries)
- [ ] File upload validation (if implemented)
- [ ] Request size limits

**General Security:**

- [ ] CORS configured properly
- [ ] Security headers set (helmet.js)
- [ ] Rate limiting on all endpoints
- [ ] HTTPS in production
- [ ] Environment variables for secrets
- [ ] Error messages don't leak sensitive info
- [ ] Dependencies up to date
