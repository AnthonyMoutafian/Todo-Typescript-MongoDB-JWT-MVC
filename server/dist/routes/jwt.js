import express, {} from "express";
const router = express.Router();
router.post("/refresh", async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.status(401).json({
                success: false,
                message: "No refresh token",
            });
            return;
        }
        const accessToken = await req.app.locals.services.auth.refreshAccessToken(refreshToken);
        res.json({
            success: true,
            accessToken,
        });
    }
    catch (err) {
        res.status(401).json({
            success: false,
            message: "Invalid or expired refresh token",
        });
    }
});
export default router;
//# sourceMappingURL=jwt.js.map