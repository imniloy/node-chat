const jwt = require("jsonwebtoken");

const checkLogin = function (req, res, next) {
  let cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;
  if (cookies) {
    try {
      token = cookies[process.env.COOKIE_NAME];
      const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decode;
    } catch (e) {}
  }
};
