# Task Manager API

A RESTful API for managing tasks with user authentication, role-based access control, and comprehensive task operations.

## Features

- 🔐 User authentication with JWT tokens
- 🔄 Token refresh mechanism
- ✅ CRUD operations for tasks
- 👥 Role-based access control (User/Admin)
- 🛡️ Middleware-based authorization
- 📝 Request logging

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens)

## Project Structure

```
├── server.js              # Application entry point
├── package.json           # Dependencies and scripts
└── src
    ├── controllers        # Business logic handlers
    │   ├── auth           # Authentication controllers
    │   ├── tasks          # Task management controllers
    │   └── user           # User management controllers
    ├── middlewares        # Auth & permission middleware
    ├── model              # Database schemas
    ├── routes             # API route definitions
    └── utils              # Helper utilities
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
```

4. Start the server:
```bash
npm start
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/refresh` | Refresh access token |

### Tasks

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks` | Get all tasks | ✅ |
| GET | `/api/tasks/:id` | Get task by ID | ✅ |
| POST | `/api/tasks` | Create new task | ✅ |
| PUT | `/api/tasks/:id` | Update task | ✅ |
| DELETE | `/api/tasks/:id` | Delete task | ✅ |

### Admin

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/tasks` | Get all tasks (admin) | ✅ Admin |
| GET | `/api/admin/users` | Get all users | ✅ Admin |

### User

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/user/profile` | Get user profile | ✅ |
| PUT | `/api/user/profile` | Update user profile | ✅ |

## Middleware

### `verifyToken`
Validates JWT tokens and attaches user information to the request object.

### `verifyPermission`
Checks user roles and permissions for protected routes.

## Models

### User Model
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  role: String (user/admin),
  createdAt: Date
}
```

### Task Model
```javascript
{
  title: String,
  description: String,
  status: String,
  userId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

## Development

### Run in development mode:
```bash
npm run dev
```

### Project Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm test` - Run tests

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Token refresh mechanism
- Role-based access control
- Request validation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please open an issue in the repository.
