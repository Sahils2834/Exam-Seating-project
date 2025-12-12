Backend for Exam Seating System (MongoDB, Express)

Commands:
- npm install
- node server.js

.env:
PORT=5000
MONGO_URI=mongodb://localhost:27017/examdb
JWT_SECRET=anything

Routes:
POST   /api/auth/register
POST   /api/auth/login
POST   /api/exams
GET    /api/exams
GET    /api/exams/:id
PUT    /api/exams/:id/seats
POST   /api/exams/:id/import-csv
GET    /api/exams/:id/export-csv
