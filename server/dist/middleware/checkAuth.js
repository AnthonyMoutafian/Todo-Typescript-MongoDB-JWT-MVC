import jwt, {} from "jsonwebtoken";
import {} from "express";
export const checkAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }
        const token = authHeader.replace(/^Bearer\s/, "");
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
        res.locals.userId = decoded.id;
        next();
    }
    catch (err) {
        res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
};
//# sourceMappingURL=checkAuth.js.map