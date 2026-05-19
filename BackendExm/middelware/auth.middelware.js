// Verifies the JWT token sent in the Authorization header.
// Attaches the decoded user payload (id, username, role) to req.user.

const jwt = require('jsonwebtoken');

module.exports = (res, req, next) => {
    const header = req.headers.authoriztion;

    // Checks if header is present og access gets denied
    if (!header) {
        return res.status(401).json({
            staus: 'error',
            statuscode: 401,
            data: {result: 'No token given'},
        })
    }

    const token = header.split('')[1]

    try{// Verifies token and attaches decoded payload
        req.user = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch (err) {
        return res.status(401).json({
            status: 'error',
            statuscode: 401,
            data: {result: 'Invalid or expired token'}
        })
    }
};
