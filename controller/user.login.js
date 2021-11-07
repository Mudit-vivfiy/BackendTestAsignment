var Database = require("../database");
var encrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
module.exports = function (router) {
    router.post('/login', (req, res) => {
        const bodyData = req.body;
        Database.User.findOne({ where: { email: bodyData.email } }).then((result) => {
            if (result) {
                const compare = encrypt.compareSync(bodyData.password, result.password);
                if (compare) {
                    result.password = undefined;
                    const tokenJWT = jwt.sign({ result: result }, "prakarsh@123", { expiresIn: "1h" });
                    res.json({ code: 200, message: 'Login Successfully', token: tokenJWT });
                }
                else {
                    res.json({ code: 501, message: 'Please enter correct email id and password' });
                }
            }
            else {
                res.json({ code: 502, message: 'Please enter correct email id and password' });
            }
        });
    });
}