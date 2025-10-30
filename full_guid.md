# Week 1: Authentication System

**Goal:**
Build a secure system that allows users to **register, log in, and stay authenticated** safely. This is the foundation for everything else.

---

## Key Tasks & Concepts

### 1. User Registration
- Users provide **name, email, and password**.
- **Validate input**:
  - Email format
  - Password strength
  - Required fields
- **Hash passwords** before storing.
  - Never save plain text passwords.
- Store the user in the database.

### 2. User Login
- Users provide email and password.
- Verify email exists.
- Compare submitted password with stored hash.
- If correct, generate **authentication tokens**.

### 3. JWT Tokens
- **Access Token**:
  - Short-lived, used for API requests.
  - Contains user ID (and optionally role).
- **Refresh Token**:
  - Long-lived, used to get a new access token.
  - Stored securely.
- Tokens allow **stateless authentication**.

### 4. Protected Routes
- Middleware checks for a valid token.
- If token valid → allow request; else → **401 Unauthorized**.

### 5. Refresh & Logout
- **Refresh token endpoint**: get a new access token.
- **Logout endpoint**: invalidate the refresh token.

### 6. Input Validation & Security
- Validate and sanitize input to prevent attacks:
  - NoSQL injection
  - XSS
- Examples:
  - Ensure email format
  - Password strength
  - Remove suspicious characters

### 7. Database Schema (User Model)
Key fields:
- `name`
- `email` (unique)
- `password` (hashed)
- `role` (`user`/`admin`)
- `avatar` (optional)
- `refreshToken`
- Timestamps: `createdAt`, `updatedAt`

**Notes:**
- Sensitive fields (password, refreshToken) should **not be returned**.
- Enforce unique emails at database level.

### 8. Error Handling
- Centralize errors in middleware.
- Return consistent responses:
```json
{
  "success": false,
  "error": "Invalid credentials",
  "statusCode": 401
}
Avoid exposing sensitive info.

9. Environment Variables
Store secrets/config outside code:

JWT_SECRET, JWT_REFRESH_SECRET

MONGO_URI

Token expiration times

Do not commit .env to Git.

10. Testing
Test endpoints in Postman:

Register user

Log in

Access protected route

Refresh token

Logout

Verify tokens work and errors are correct.

✅ Summary
Week 1 focuses on secure authentication:

Password hashing

JWT-based login

Protected API routes

Input validation and sanitization

User model with proper fields

Centralized error handling

Environment variable management

This setup is the foundation for all future features like projects, tasks, and team collaboration.
