const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirectory = path.join(
  __dirname,
  "../uploads/evidence"
);

/* Create folder automatically */

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true
  });
}

/* Storage */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },

  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);

    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1000000) +
      extension;

    cb(null, uniqueName);
  }
});

/* Allowed files */

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
  "video/mp4",
  "video/webm",
  "application/pdf"
];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, PNG, WEBP, MP4, WEBM and PDF files are allowed"
      ),
      false
    );
  }
};

/* Upload */

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 50 * 1024 * 1024
  }
});

module.exports = upload;