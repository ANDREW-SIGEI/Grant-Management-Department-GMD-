const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Load models
const User = require('../models/User');
const News = require('../models/News');
const Resource = require('../models/Resource');
const Contact = require('../models/Contact');

// Connect to database
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/kemri-gmd', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Read JSON files
const users = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'users.json'), 'utf-8')
);

const news = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'news.json'), 'utf-8')
);

const resources = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'resources.json'), 'utf-8')
);

// Hash passwords for users
const hashPasswords = async (usersArray) => {
  const salt = await bcrypt.genSalt(10);
  
  return Promise.all(
    usersArray.map(async (user) => {
      user.password = await bcrypt.hash(user.password, salt);
      return user;
    })
  );
};

// Import data into database
const importData = async () => {
  try {
    // Hash passwords first
    const hashedUsers = await hashPasswords(users);
    
    // Clear existing data
    await User.deleteMany();
    await News.deleteMany();
    await Resource.deleteMany();
    await Contact.deleteMany();
    
    // Import new data
    await User.create(hashedUsers);
    await News.create(news);
    await Resource.create(resources);
    
    console.log('Data Imported Successfully');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete all data from database
const deleteData = async () => {
  try {
    await User.deleteMany();
    await News.deleteMany();
    await Resource.deleteMany();
    await Contact.deleteMany();
    
    console.log('Data Deleted Successfully');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Check command arguments to determine what operation to run
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please specify operation: -i (import) or -d (delete)');
  process.exit();
} 