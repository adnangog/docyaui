const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const decoded = jwt.verify(
            req.session.token,
            process.env.JWT_KEY
        );
        next();
    } catch (error) {
        res.redirect("/login");
    }
};