import jwt from "jsonwebtoken";
const jwt_access_secret = process.env.JWT_ACCESS_SECRET;
const jwt_refresh_secret = process.env.JWT_REFRESH_SECRET;

const verifyJwToken = (req, res, next) => {
    let token = req.headers['authorization'];
    let accessToken = token.replace("Bearer ","")
    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }
  
    jwt.verify(accessToken, jwt_access_secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
      }
      req.user = {
        id: decoded.id, 
        username: decoded.username
    };
      next();
    });
  };

  const refreshJwToken = (req, res, next) => {
    // Verifying refresh token
    let refreshToken = req.headers['x-refresh-token'];
    if (refreshToken) {
      jwt.verify(refreshToken, jwt_refresh_secret, 
        (err, decoded) => {
            if (err) {
    
                // Wrong Refesh Token
                return res.status(406).json({ message: 'Unauthorized' });
            }
            else {
                // Correct token we send a new access token
                const accessToken = jwt.sign({
                    id: req.user.id, 
                    username: req.user.username
                }, jwt_access_secret, {
                    expiresIn: '10m'
                });
                next();
            }
        })
    }
    else
    return res.status(403).send({ message: "No refresh provided!" });
    
    
  };


  module.exports = {verifyJwToken,refreshJwToken};