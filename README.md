# Blog Hub

A full-stack blogging platform with a Node.js/Express/MongoDB REST API backend and a React (Vite) frontend. Readers can browse and filter blog posts by category; registered users can like, dislike, and comment; admins get a dashboard to create, edit, and manage blogs and users.

## Features

### For Visitors
- Browse all blog posts on the homepage
- Filter blogs by category (Tech, Health, Business, Islamic)
- Read full blog posts with author info and publish date

### For Registered Users
- Sign up (with an optional profile picture) and log in
- Like / dislike blog posts (switching between like and dislike updates counts correctly)
- Add one comment per blog post, and edit it later
- Update profile (name and profile picture) and change password
- Forgot/reset password via emailed, time-limited token

### For Admins
- Admin signup gated behind a secret key
- Dashboard with tabs for managing **Blogs** and **Users**
- Create, edit, and delete blog posts with a thumbnail image upload
- Delete users and comments
- Confirmation dialogs before destructive actions

### Engineering Highlights
- JWT authentication (httpOnly cookie + Bearer token support) with role-based access control (`user` vs `admin`)
- Image uploads (profile pictures and blog thumbnails) handled via Multer → Cloudinary, with old images automatically deleted from Cloudinary when replaced
- Centralized error handling (`AppError` + `catchAsync`) with a global error middleware for Mongoose, validation, and JWT errors
- Axios instance with request/response interceptors: attaches the JWT automatically and force-logs-out on a 401
- Skeleton loading states, custom alert/confirm dialogs, and protected routes on the frontend

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router 6, Vite, Axios |
| Backend | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| Auth | JSON Web Tokens (JWT), bcrypt |
| Image Storage | Cloudinary (via Multer) |
| Email | Nodemailer |
| Security | Helmet, CORS, cookie-parser |

## Project Structure

```
.
├── backend/
│   ├── app.js                  # Express app, middleware, route mounting
│   ├── server.js                # Entry point, DB connection, server startup
│   ├── controllers/
│   │   ├── authController.js    # Signup/login, password reset, profile updates
│   │   ├── blogController.js    # Blog CRUD + topic filtering
│   │   ├── commentController.js # Comment CRUD (one per user per blog)
│   │   ├── reactionController.js# Like/dislike toggle logic
│   │   ├── userController.js    # Admin user management
│   │   └── errorControler.js    # Global error handler
│   ├── models/
│   │   ├── userModel.js
│   │   ├── blogModel.js
│   │   ├── commentModel.js
│   │   └── reactionModel.js
│   ├── routes/
│   │   ├── userRouter.js
│   │   ├── blogRouter.js
│   │   ├── commentRouter.js
│   │   └── reactionRouter.js
│   └── utils/
│       ├── appError.js          # Custom operational error class
│       ├── catchAsync.js        # Async error wrapper for controllers
│       ├── cloudinary.js        # Cloudinary config
│       ├── email.js             # Nodemailer transport + send helper
│       ├── generateToken.js     # JWT creation + cookie config
│       └── multer.js            # File upload middleware
└── frontend/
    ├── index.html
    ├── vite.config.js            # Dev server + API proxy config
    └── src/
        ├── App.jsx               # Route definitions
        ├── main.jsx
        ├── context/
        │   └── AuthContext.jsx   # Global auth state (login/signup/logout)
        ├── services/
        │   └── api.js            # Axios instance + all API calls
        ├── components/
        │   ├── BlogCard.jsx
        │   ├── CommentSection.jsx
        │   ├── ConfirmDialog.jsx
        │   ├── CustomAlert.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── Skeleton.jsx
        │   └── auth/             # Login, signup, password & profile modals
        └── pages/
            ├── HomePage.jsx
            ├── BlogDetailPage.jsx
            └── admin/
                ├── AdminDashboard.jsx
                ├── CreateBlog.jsx
                └── EditBlog.jsx
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A MongoDB instance (local or Atlas)
- A Cloudinary account (for image uploads)
- A Gmail account (or other SMTP provider) for sending emails via Nodemailer

### Installation

```bash
git clone https://github.com/M-Subhaaan/Blog_Hub.git
cd Blog_Hub
```

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd frontend
npm install
```

### Environment Variables

**Backend** — copy `backend/empty.env` to `backend/.env`:

```env
NODE_ENV=development
PORT=3000
MONGO_DB_URL=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_SECRET_EXPIRES_IN=90d
COOKIE_EXPIRES=90
ADMIN_SECRET_KEY=your_admin_signup_secret
FRONTEND_URL=http://localhost:5173

EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` or `production` (controls error verbosity & cookie security) |
| `PORT` | Port the backend server listens on |
| `MONGO_DB_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `JWT_SECRET_EXPIRES_IN` | JWT expiry (e.g. `90d`) |
| `COOKIE_EXPIRES` | Cookie expiry in days |
| `ADMIN_SECRET_KEY` | Required key to register an admin account |
| `FRONTEND_URL` | Used to build the password-reset link sent via email |
| `EMAIL_USERNAME` / `EMAIL_PASSWORD` | Gmail credentials used by Nodemailer |
| `CLOUDINARY_CLOUD_NAME` / `CLOUD_API_KEY` / `CLOUD_API_SECRET` | Cloudinary credentials for image uploads |

**Frontend** — copy `frontend/empty.env` to `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

### Running the App

**Backend** (from `backend/`):

```bash
npm run dev
```

The API will be available at `http://localhost:<PORT>/api/v1`.

**Frontend** (from `frontend/`):

```bash
npm run dev
```

The app will be available at `http://localhost:5173`. The Vite dev server is pre-configured to proxy `/api` requests to `http://localhost:3000` (see `vite.config.js`).

## API Reference

All routes are mounted under `/api/v1`. Routes marked **Protected** require a valid JWT (cookie or `Authorization: Bearer <token>`). Routes marked **Admin** or **User** are further restricted by role.

### Users — `/api/v1/users`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a new user (optional profile picture) |
| POST | `/admin/signup` | Public | Register a new admin (requires `secretKey`) |
| POST | `/login` | Public | Log in and receive a JWT |
| POST | `/forget-password` | Public | Request a password reset email |
| PATCH | `/resetpassword/:token` | Public | Reset password using emailed token |
| PATCH | `/updatepassword` | Protected | Change password while logged in |
| PATCH | `/updateprofile` | Protected | Update name/profile picture |
| POST | `/logout` | Protected | Log out (clears auth cookie) |
| GET | `/` | Admin | List all users |
| DELETE | `/delete-user/:id` | Admin | Delete a user |

### Blogs — `/api/v1/blogs`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List all blogs |
| GET | `/:id` | Public | Get a single blog |
| GET | `/topic/:topic` | Public | List blogs by topic (tech/health/business/islamic) |
| POST | `/` | Admin | Create a blog (with thumbnail upload) |
| PATCH | `/updateblog/:id` | Admin | Update a blog (optionally replace thumbnail) |
| DELETE | `/deleteblog/:id` | Admin | Delete a blog |

### Comments — `/api/v1/comments`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/blog/:id/comments` | Public | List comments on a blog |
| POST | `/blog/:id/comment` | User | Add a comment (one per user per blog) |
| PATCH | `/blog/:id/comment` | User | Edit your own comment on a blog |
| DELETE | `/:id` | Admin | Delete any comment |

### Reactions — `/api/v1/reactions`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/blog/:id/like` | User | Like a blog (or switch from dislike to like) |
| POST | `/blog/:id/dislike` | User | Dislike a blog (or switch from like to dislike) |
| DELETE | `/blog/:id/reaction` | User | Remove your reaction |

## Frontend Routes

| Path | Page | Access |
|---|---|---|
| `/` | Home — blog feed with category filter | Public |
| `/blog/:id` | Blog detail — full post, likes/dislikes, comments | Public |
| `/forgot-password` | Request a password reset | Public |
| `/reset-password/:token` | Set a new password | Public |
| `/admin/dashboard` | Manage blogs and users | Admin only |
| `/admin/blog/new` | Create a new blog | Admin only |
| `/admin/blog/edit/:id` | Edit an existing blog | Admin only |

## Error Handling

Errors are returned as JSON in a consistent shape:

```json
{
  "status": "fail",
  "message": "Email Already Exists"
}
```

In development mode, responses include the full stack trace. In production, only operational errors expose their message; unexpected errors return a generic 500 response.

## License

ISC

## Author

M Subhan
