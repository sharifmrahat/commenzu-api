# CommenZu | API

A post and comment system with nested replies, reactions (like/dislike), and JWT-based authentication.

## 🔗 Important Links

- API Documentation: https://documenter.getpostman.com/view/21772045/2sB3HhsMxT

## 🛠️ Setup Instructions

#### Step-1: Clone the repo

```bash
git clone https://github.com/sharifmrahat/commenzu-api.git
cd commenzu-apis
```

#### Step-2: Install dependencies

```bash
npm install
```

#### Step-3: Setup environment variables

Create a .env file and configure your database + JWT secret:

```bash
DATABASE_URL=

NODE_ENV="development"
PORT=5000

BCRYPT_SALT_ROUNDS=
JWT_SECRET_ACCESS=
JWT_SECRET_EXPIRY="30d"
```

#### Step-4: Run database migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

#### Step-5: Start the server

```bash
npm run dev
```

Server will run at `http://localhost:5000`

## 📑 API Endpoints

App Url: `http://localhost:5000/api/v1`

| Method | Endpoint            | Description                 | Auth / Role            |
| ------ | ------------------- | --------------------------- | ---------------------- |
| POST   | `/auth/signup`      | Sign up new user            | Public                 |
| POST   | `/auth/login`       | Login with credentials      | Public                 |
| GET    | `/users`            | Get All Users               | Admin                  |
| GET    | `/users/:id`        | Find one user               | Admin, Moderator       |
| GET    | `/users/profile`    | Get Profile with token      | Admin, Moderator, User |
| PATCH  | `/users/profile`    | Update Profile with token   | Admin, Moderator, User |
| GET    | `/posts`            | Get all posts               | Public                 |
| POST   | `/posts`            | Create post                 | Admin, Moderator, User |
| POST   | `/posts`            | Create post                 | Admin, Moderator, User |
| GET    | `/posts/:id`        | Get post by ID              | Public                 |
| POST   | `/posts/:id`        | Update post status          | Admin, Moderator, User |
| PATCH  | `/posts/:id`        | Update post approval status | Admin, Moderator       |
| DELETE | `/posts/:id`        | Delete post by ID           | Admin, Moderator       |
| POST   | `/comments`         | Write comment               | Admin, Moderator, User |
| POST   | `/comments/:id`     | Edit comment                | Admin, Moderator, User |
| GET    | `/comments?postId=` | Get all comments by Post ID | Admin, Moderator, User |
| POST   | `/comments/reply`   | Create reply                | Admin, Moderator, User |
| POST   | `/comments/react`   | Add/Update react            | Admin, Moderator, User |
| DELETE | `/comments/:id`     | Delete comment by ID        | Admin, Moderator, User |

## ✨ Features

- 📝 Create and manage posts
- 💬 Nested comments and threaded replies
- 👍👎 Like/Dislike reactions (1 reaction per user per comment)
- 📊 Auto-updated like/dislike counts
- 🔐 Secure APIs with JWT Bearer token authentication

## 🚀 Technology Used

- Node.js + Express.js – Backend framework
- Prisma ORM – Database ORM
- PostgreSQL – Database
- TypeScript – Strong typing
- JWT – Authentication
- Supabase – For DB Hosting

## 🔮 Areas of Enhancement

- 🏷️ Support hashtags and mentions in posts
- 🔔 Implement notifications for replies & reactions
- 📱 Build a user role based dashboard
- 📈 Add analytics (most liked, most commented posts)
