const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

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

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      institution,
      department,
      subject,
      message
    } = req.body;

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'Dsppgm@kemri.go.ke', // KEMRI's email address
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Institution:</strong> ${institution}</p>
        <p><strong>Department:</strong> ${department}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <h3>Message:</h3>
        <p>${message}</p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send auto-reply to user
    const autoReplyOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting KEMRI Grant Management Department',
      html: `
        <h2>Thank you for contacting us</h2>
        <p>Dear ${name},</p>
        <p>We have received your message regarding "${subject}". Our team will review your inquiry and respond within 2 business days.</p>
        <p>For urgent matters, please contact us directly at:</p>
        <ul>
          <li>Phone: +254 020 2722541</li>
          <li>Email: Dsppgm@kemri.go.ke</li>
        </ul>
        <p>Best regards,<br>KEMRI Grant Management Department</p>
      `
    };

    await transporter.sendMail(autoReplyOptions);

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Error sending message. Please try again.' });
  }
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