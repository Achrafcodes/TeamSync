Task Management Backend (MERN)
📌 Overview

This is a RESTful backend API for a Task Management system built with Node.js, Express, and MongoDB (Mongoose).
It supports CRUD operations on tasks, user authentication, and role-based authorization for admin and regular users.

The backend is modular, easy to scale, and ready to connect with any frontend application.

🚀 Features

Tasks CRUD

Create, Read, Update, Delete tasks

Partial updates using PATCH

User Management

Register, login, and manage users

Role-based permissions (admin vs regular user)

Authentication & Authorization

JWT-based authentication

Protected routes for admin-only operations

Validation & Error Handling

Validates requests and sends meaningful error messages

Utilities

Logger for tracking API activity

Ready for production

Structured folders, clear separation of concerns

📁 Project Structure
.
├── server.js              # Entry point
├── package.json
├── src
│   ├── controllers        # Handles request logic
│   │   ├── auth
│   │   │   ├── auth.controllers.js
│   │   │   └── refresh.controllers.js
│   │   ├── tasks
│   │   │   ├── addNewTask.controller.js
│   │   │   ├── updateTask.controller.js
│   │   │   ├── deleteTask.controller.js
│   │   │   ├── getTasks.controller.js
│   │   │   ├── findTaskbyId.controller.js
│   │   │   └── admin.controller.js
│   │   └── user
│   │       └── user.controllers.js
│   ├── middlewares       # Authentication & permission checks
│   │   ├── verifyToken.js
│   │   └── verifyPermission.js
│   ├── model             # Mongoose models
│   │   ├── tasks.model.js
│   │   └── users.model.js
│   ├── routes            # Express routes
│   │   ├── auth.routes.js
│   │   ├── admin.routes.js
│   │   ├── user.routes.js
│   │   └── index.js
│   └── utils             # Utilities like logging
│       └── logger.js

⚡ Installation

Clone the repository:

git clone https://github.com/Achrafcodes/TeamSync/
cd TeamSync


Install dependencies:

npm install


Create a .env file with:

MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret-key>
PORT=5000


Start the server:

npm run dev


Server will run on http://localhost:5000.

🛠️ API Endpoints
Auth

POST /auth/register → Create a new user

POST /auth/login → Login and get JWT token

POST /auth/refresh → Refresh token

Tasks

GET /tasks → Get all tasks (admin) or user’s tasks

GET /tasks/:id → Get task by ID

POST /tasks → Create a new task

PATCH /tasks/:id → Update task partially

DELETE /tasks/:id → Delete a task

Users

GET /users → Get all users (admin only)

GET /users/:id → Get user by ID

PATCH /users/:id → Update user info (admin or self)

🛡️ Security

JWT-based authentication

Role-based access control (admin vs regular users)

Data validation and error handling

🔧 Technologies Used

Node.js & Express

MongoDB & Mongoose

JWT for authentication

Nodemon for development

Winston / custom logger for logging

📝 Notes

Designed to work with any frontend (React, Next.js, Vue, etc.)

Modular structure for easy scalability

Ready for further enhancements like notifications, filtering, pagination, and analytics
