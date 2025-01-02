const express = require("express");
const router = express.Router();

const FileController = require("../controllers/file.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/upload", authMiddleware.authenticate, FileController.uploadFile);

module.exports = router;
