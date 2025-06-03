/**
 * CSRF Protection Middleware
 */

exports.validateCSRF = (req, res, next) => {
    const token = req.headers['x-csrf-token'];
    const formToken = req.body._csrf;
    
    if (!token || !formToken || token !== formToken) {
        return res.status(403).json({
            success: false,
            message: 'Invalid CSRF token'
        });
    }
    
    next();
}; 