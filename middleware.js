
const jwt = require("jsonwebtoken");
function authMiddleware(req, res, next) {
    const authHeader = req.headers.token;
    if (!authHeader) {
        res.status(401).json({
            message: "Unauthorized"
        })
        return;
    };
    try {
        const decoded = jwt.verify(authHeader, "PRIVATE_KEY");
        const userId = decoded.userId;
        if(userId){
        req.userId = userId;
        next();
    }
    else{
        res.status(401).json({
            message: "Unauthorized"
        })
    }
    }
    catch(err){
        res.status(401).json({
            message: "Unauthorized"
        })
    }
}
exports.authMiddleware = authMiddleware;