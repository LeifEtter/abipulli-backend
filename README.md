# README.md Backend

This codebase comprises the Backend of the "AbiPulli.com", a gradutation merchandise Web Application where users can bring their own ideas onto Pullovers using generative AI and in-house Design tools.

The repository includes the Express.JS Backend, using Drizzle and JWT, and accesses the OpenAI and Ideogram API's.

→ Try out th API at [https://api.etter.app](https://etter.app)

---

### Tech Stack

| Layer               | Tech                                     |
| ------------------- | ---------------------------------------- |
| Language            | Typescript                               |
| Framework           | Express                                  |
| Database Management | Drizzle ORM + PostgreSQL                 |
| Image Handling      | Multer, S3 (with Hetzner Object Storage) |
| Auth                | JWT, bcrypt                              |
| Forms & Validation  | Zod, sanitize-html                       |
| Build Tool          | Vite, tsup                               |
| Testing             | Vitest                                   |
| Logging             | Pino                                     |
| Documentation       | TSDoc                                    |

---

### Project Structure

```other
src/
├── controllers/         # Route handlers
├── services/            # Business logic (Mostly interaction with DB)
├── routes/              # Express route definitions
├── middleware/          # Auth, validation, file, error handlers
├── db/                  # Drizzle ORM schemas and seeding
├── lib/                 # External APIs, storage, utilities
├── configs/             # API configuration
├── types/               # Backend specific Type definitions
├── error/               # Custom error class
├── index.ts             # Server entrypoint
```

---

### Getting Started

1. Clone Repo

```other
git clone https://github.com/LeifEtter/abipulli-backend
cd abipulli-frontend
```

2. Create `.env` with following Keys, also viewable in .example.env (note: ZOHO creds can be skipped when running project in dev mode):

```other
JWT_SECRET=some-secret-string-that-nobody-should-ever-see
PORT=8080
DATABASE_URL=postgresql://goodUserName:strongPassword123@localhost:5432/abipulli
GOOGLE_CLIENT_ID=id-provided-by-google-for-sso
HETZNER_ACCESS_KEY=accesskeyforstoragebucket
HETZNER_SECRET_KEY=secretkeyforstoragebucket
OPENAPI_KEY=keyforchatgpt
IDEOGRAM_KEY=keyforideogram
ZOHO_EMAIL=leif@etter.app
ZOHO_PASS=some app key
```

3. Install dependencies

```other
npm i
```

4. Run the docker container to start the local db:

```other
docker compose up -d
```

5. Run Seed File for generating Roles

```bash
npm run seed-dev
```

6. Run Dummy Generation to fill db with test data:

```bash
npm run gen-dummies-dev
```

---

### Authentication/Authorization

Auth is managed with JWT. Users can login with email and password, and JWT token is attached to httpOnly token.

To evaluate, whether a user is allowed to access a route, a role-based authorization is used.
The roles and corresponding power values:

| Role       | Id  | Power |
| ---------- | --- | ----- |
| anonymous  | 1   | 0     |
| registered | 2   | 1     |
| admin      | 3   | 10    |

### Testing

To run all tests use following command:

```other
npx vitest
```

---

### Hosting

The Web is hosted on VPS.
A Pull request triggers a test build, and upon merging into main, the code will be built using Docker and automatically pushed to the VPS.

Live version is hosted at:

→ [https://api.etter.app](https://etter.app)

---

### Known Issues

- Logging out doesnt remove httpOnly token, and token is not invalidated in backend. So sessions might persist unwantedly