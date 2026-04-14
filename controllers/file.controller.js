const FileService = require("../services/file.service");

class FileController {
  static async uploadFile(req, res) {
    try {
      const result = await FileService.uploadFile(req, res);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = FileController;
