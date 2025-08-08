const fs = require('fs');
const path = require('path');

// Define the path to the uploads directory
const publicDir = path.join(process.cwd(), 'public');
const uploadsDir = path.join(publicDir, 'uploads');

// Check if the uploads directory exists, create it if it doesn't
if (!fs.existsSync(uploadsDir)) {
  console.log('Creating uploads directory...');
  
  // Create the public directory if it doesn't exist
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }
  
  // Create the uploads directory
  fs.mkdirSync(uploadsDir);
  console.log('Uploads directory created successfully!');
} else {
  console.log('Uploads directory already exists.');
}