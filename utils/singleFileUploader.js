const createHttpError = require("http-errors");
const multer = require("multer");
const path = require("path");

function uploader(
  subfolder_path,
  allowed_files_types,
  max_files_size,
  err_msg
) {
  const upload_folder = `${__dirname}/../public/uploads/${subfolder_path}/`;
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, upload_folder);
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, "")
          .toLowerCase()
          .split(" ")
          .join("-") +
        "-" +
        Date.now();

      cb(null, fileName + fileExt);
    },
  });

  // prepare the multer object...

  const upload = multer({
    storage,
    limits: {
      fileSize: max_files_size,
    },
    fileFilter: (req, file, cb) => {
      if (allowed_files_types.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(createHttpError(err_msg));
      }
    },
  });
  return upload;
}

module.exports = uploader;
