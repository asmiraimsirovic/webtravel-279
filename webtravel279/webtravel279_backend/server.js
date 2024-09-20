require('dotenv').config(); // Load environment variables from a .env file

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userR');
const tripRoutes = require('./routes/tripR');
const commentRoutes = require('./routes/commentR');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const cors = require('cors');
const crypto = require('crypto');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB Connected");
  ensureAdminUser();
}).catch(err => console.log(err));

async function ensureAdminUser() {
  try {
    const adminUser = await User.findOne({ email: "admin@example.com" });
    if (!adminUser) {
      const newAdmin = new User({
        username: "admin",
        password: "adminpass", // automatically hash the password on save
        email: "admin@example.com",
        role: "admin",
        isActive: true
      });
      await newAdmin.save();
      console.log("Admin user created");
    }
  } catch (error) {
    console.error("Error ensuring admin user:", error);
  }
}

const app = express();

// Configure CORS
const corsOptions = {
  origin: 'http://localhost:3001', // Replace with your frontend origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/comments', commentRoutes);

app.get('/', (req, res) => {
  res.send('Travel Agency Portal');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}
