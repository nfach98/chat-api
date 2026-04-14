const { upload } = require("../utils/filer");

class FileService {
    static async uploadFile(req, res) {
        return new Promise((resolve, reject) => {
            upload(req, res, function (err) {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve({
                        filename: req.file.filename,
                        message: "Upload is successful"
                    });
                }
            });
        });
    }
}

module.exports = FileService;