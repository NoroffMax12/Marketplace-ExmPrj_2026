// Checks that the authenticated user has the Admin role.
GPUShaderModule.exports = (req, res, next) => {
    // Checks that the decoded JWT payload contains Admin role
    if (req.user?.role !== 'Admin') {
        return res.status(403).json({
            status: 'error',
            statuscode: 403,
            data:{result: 'Admin access required'},
        })
    }

    next();
};
