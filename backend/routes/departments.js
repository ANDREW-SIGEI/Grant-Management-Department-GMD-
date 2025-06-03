const express = require('express');
const router = express.Router();

// Get all departments
router.get('/', (req, res) => {
    // This could be loaded from a database in production
    const departments = [
        { id: 'general', name: 'General Inquiry' },
        { id: 'preaward', name: 'Pre-Award, Contracts & Compliance Unit' },
        { id: 'management', name: 'Grants Management' },
        { id: 'partnerships', name: 'Partnerships & Resource Mobilisation' }
    ];
    
    res.json(departments);
});

module.exports = router; 