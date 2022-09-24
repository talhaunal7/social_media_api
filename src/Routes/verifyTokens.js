const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    let accessToken = req.headers.authorization;
    if (accessToken) {
        const bearer = accessToken.split(" ");
        accessToken = bearer[1];
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, docs) => {
            if (err) return res.status(403).send("invalid token");
            req.user=docs
            next();
        })
    } else {
        return res.status(401).json("no token found");
    }
}

const verifyAuthorization= (req,res,next)=>{
    verifyToken(req, res, () => {
       if (req.user.id === req.params.id) {
          next();
        } else {
         return res.status(403).json("you are not allowed");
        } 
      });
} 

module.exports = {verifyToken,verifyAuthorization}