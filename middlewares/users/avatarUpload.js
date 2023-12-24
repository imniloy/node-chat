function avatarUpload(req, res, next) {
  const upload = uploader(
    "avatars",
    ["image/png", "image/jpg", "image/jpeg"],
    3000000,
    "Only jpg, jpeg, and png are allowed"
  );

  upload.any()(req, res, (err) => {
    if (err) {
      res.status(500).json({
        errors: {
          avatar: {
            msg: err.message,
          },
        },
      });
    } else {
      next();
    }
  });
}

module.exports = avatarUpload;
