const jwt = require("jsonwebtoken");

module.exports = {
    verify: (req, res, next) => {
        let token = req.get("authorization");
        if (token) {
            token = token.slice(7);
            jwt.verify(token, "prakarsh@123", (err, decoded) => {
                if (err) {
                    res.json({ code: 500, message: 'Invalid token' });
                }
                else {
                    next();
                }
            });
        }
        else {
            res.json({ code: 501, message: 'Unauthorized user' });
        }
    }
}