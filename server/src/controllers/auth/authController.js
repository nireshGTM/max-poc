import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from '../../models';
import {respondWithError, respondWithSuccess} from '../../common/helper';

const jwt_access_secret = process.env.JWT_ACCESS_SECRET;
const jwt_refresh_secret = process.env.JWT_REFRESH_SECRET;
const User = db.User;


exports.apiLogin = (req, res) => {
  console.log("apiLogin")
  User.findOne({
    username: req.body.username
  })
    .populate("role", "-__v")
    .exec((err, user) => {
      
      if (err) {
        console.log(err)
        console.log("apiLogin exec")
        res.status(500).send({ message: err });
        return;
      }
      //console.log(user.role)
      if (!user) {
        return respondWithError(res,{ errorCode:404, message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return respondWithError(res,{ errorCode:401, message: "Invalid Password!" });
      }
      
      var accessToken = jwt.sign({
        id: user.id, 
        username: user.username 
      }, jwt_access_secret, {
        expiresIn: '3600m' // 10 minutes
      });

      const refreshToken = jwt.sign({
        username: user.username,
      }, jwt_refresh_secret, { expiresIn: '1d' });
      
      // Assigning refresh token in http-only cookie 
      res.cookie('jwt', refreshToken, { httpOnly: true, 
        sameSite: 'None', secure: true, 
        maxAge: 24 * 60 * 60 * 1000 });
      
      return respondWithSuccess(res, "logging", "success", {
        id: user._id,
        username: user.username,
        email: user.email,
        roles: user.role,
        accessToken: accessToken,
        refreshToken: refreshToken
      })
    })
};

exports.refreshToken = (req, res) => {
  if (req.cookies?.jwt) {

      // Destructuring refreshToken from cookie
      const refreshToken = req.cookies.jwt;

      // Verifying refresh token
      jwt.verify(refreshToken, jwt_refresh_secret, 
      (err, decoded) => {
          if (err) {

              // Wrong Refesh Token
              return res.status(406).json({ message: 'Unauthorized' });
          }
          else {
              // Correct token we send a new access token
              const accessToken = jwt.sign({
                  id: decoded.id, 
                  username: decoded.username
              }, jwt_access_secret, {
                  expiresIn: '10m'
              });
              return res.json({ accessToken });
          }
      })
  } else {
      return res.status(406).json({ message: 'Unauthorized' });
  }
};