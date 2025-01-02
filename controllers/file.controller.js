const { upload } = require("../utils/filer");

class FileController {
  static async uploadFile(req, res) {
    upload(req, res, function (err) {
      console.log(req.file.filename);
      if (err) {
        res.status(400).json({ message: err });
      } else {
        res.status(200).json({ message: "Upload is successful" });
      }
    });
  }
}

module.exports = FileController;
