const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI;

async function ensureAdmin() {
  const User = require('./models/User');
  const bcrypt = require('bcryptjs');
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPass = process.env.ADMIN_PASS || 'Admin@123';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    const hashed = await bcrypt.hash(adminPass, 10);
    admin = await new User({ name: 'Administrator', email: adminEmail, password: hashed, role: 'admin' }).save();
    console.log('Seeded admin user:', adminEmail, 'password:', adminPass);
  } else {
    console.log('Admin exists:', adminEmail);
  }
}

mongoose.connect(MONGO, { })
  .then(async () => {
    console.log('MongoDB connected');
    await ensureAdmin();
    app.listen(PORT, () => console.log('Server listening on', PORT));
  })
  .catch(err => {
    console.error('MongoDB connection error', err);
  });

console.log("Exam Controller:", require("./controllers/examController"));
