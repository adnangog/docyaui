const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const decoded = jwt.verify(
            req.session.token,
            process.env.JWT_KEY
        );
        next();
    } catch (error) {
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        res.redirect("/login?url="+fullUrl);
    }
};