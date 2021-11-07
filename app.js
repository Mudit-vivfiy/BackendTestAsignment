var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var app = express();
const router = new express.Router();
var port = 3000;
app.use(cors());
app.options('*', cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.get("/", (req, res, next) => {
  res.send("Hello World!");
  next();
});
require("./database");
require("./controller/users")(app);
require("./controller/user.login")(app);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
