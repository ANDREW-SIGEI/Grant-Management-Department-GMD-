const express = require('express');
const cors = require('cors');
const path = require('path');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files - main site content
app.use(express.static('.'));

// Explicitly serve the downloads directory
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

// Create a specific route for downloading files
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'downloads', filename);
  res.download(filePath, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(404).send('File not found');
    }
  });
});

// Fallback - serve index.html for any request not handled by the API
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // For testing purposes 