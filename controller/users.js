var Database = require("../database");
var multer = require("multer");
var path = require("path");
var encrypt = require("bcrypt");
var { verify } = require("../authentication/auth.varification");
const salt = 10;
module.exports = function (router) {
  router.get("/getalluser", verify, (req, res) => {
    Database.User.findAll().then((result) => {
      res.json(result);
    }).catch((err) => {
      console.log(err);
    });
  });
  router.get("/userbyid/:id", verify, (req, res) => {
    const id = req.params.id;
    if (id) {
      Database.User.findOne({ where: { id: id } }).then((result) => {
        res.json(result);
      }).catch((err) => {
        console.log(err);
      });
    }
  });
  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'Images');
    },
    filename: (req, file, callback) => {
      callback(null, Date.now() + path.extname(file.originalname));
    }
  });
  const upload = multer({ storage: storage });

  router.post("/create", upload.single('file'), verify, (req, res) => {
    const bodyData = req.body;
    Database.User.findAll({ where: { email: bodyData.email }, }).then((result) => {
      if (result.length !== 0) {
        res.json({ code: 501, message: 'Data is already exits' });
      }
      else {
        const saltEncrypt = encrypt.genSaltSync(salt);
        const encryptPassword = encrypt.hashSync(bodyData.password, saltEncrypt);
        Database.User.create({ firstname: bodyData.firstname, lastname: bodyData.lastname, email: bodyData.email, password: encryptPassword, image: req.file.filename }).then((result) => {
          if (result) {
            res.json({ code: 200, message: 'Insert Successfully' });
          }
          else {
            res.json({ code: 502, message: `Some problem ${result}` });
          }
        }).catch((err) => {
          console.log(err);
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  });
  router.post("/update", upload.single('file'), verify, (req, res) => {
    const bodyData = req.body;
    if (bodyData.id) {
      const saltEncrypt = encrypt.genSaltSync(salt);
      const encryptPassword = encrypt.hashSync(bodyData.password, saltEncrypt);
      Database.User.update({ firstname: bodyData.firstname, lastname: bodyData.lastname, email: bodyData.email, password: encryptPassword, image: req.file.filename }, { where: { id: bodyData.id } }).then((result) => {
        if (result[0]) {
          res.json({ code: 200, message: 'Update Successfully' });
        }
        else {
          res.json({ code: 501, message: "Already exits" });
        }
      }).catch((err) => {
        console.log(err);
      });
    }
  });
  router.get("/delete/:id", verify, (req, res) => {
    const id = req.params.id;
    if (id) {
      Database.User.destroy({ where: { id: id } }).then((result) => {
        if (result) {
          res.json({ code: 200, message: 'Delete Successfully' });
        }
        else {
          res.json({ code: 501, message: "Already deleted" });
        }
      }).catch((err) => {
        console.log(err);
      });
    }
  });

  router.get('/file/:path', (req, res) => {
    if (req.params.path) {
      res.download('./Images/' + req.params.path);
    }
  });
};
