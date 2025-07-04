# 📚 Library Management System API

A RESTful API for managing books and borrow operations in a digital library system.

---

## 🚀 Technologies Used

| Technology      | Description                                      | Docs                                      |
| --------------- | ------------------------------------------------ | ----------------------------------------- |
| **Node.js**     | JavaScript runtime for building server-side apps | https://nodejs.org/en/docs                |
| **Express.js**  | Web framework for Node.js                        | https://expressjs.com/                    |
| **TypeScript**  | Strongly typed JavaScript                        | https://www.typescriptlang.org/docs/      |
| **Mongoose**    | MongoDB ODM for data modeling                    | https://mongoosejs.com/docs/              |
| **MongoDB**     | NoSQL database                                   | https://www.mongodb.com/docs              |
| **Zod**         | Schema validation for request data               | https://zod.dev/                          |
| **ts-node-dev** | Live reloading TypeScript development server     | https://www.npmjs.com/package/ts-node-dev |
| **dotenv**      | Load environment variables                       | https://www.npmjs.com/package/dotenv      |

---

## ⚙️ Setup

1. Clone repo
2. Run `npm install`
3. Setup `.env` with DB user and password
4. Run `npm run dev` to start the server

## API Endpoints

### Create Book

- POST `/api/book/`
- Body:

```bash
{
  "title": "1984",
  "author": "George Orwell",
  "genre": "FICTION",
  "isbn": "9780451524935",
  "copies": 5
}
```

### Get Books

- GET `/api/book?filter=&sortBy=&sort=&limit=`

### Borrow Book

- POST `/api/borrow`
- Body:

```bash
{
  "book": "bookObjectId",
  "quantity": 2,
  "dueDate": "2025-07-18T00:00:00.000Z"
}
```

### Borrow Summary

- GET `/api/borrow`

### Delete Book

- DELETE `/api/book/:bookId`

## Error Handling

- 400 for validation errors
- 404 if book not found
- 500 for server errors

## Business Logic

- Borrowing deducts copies, disables availability if 0 copies left
