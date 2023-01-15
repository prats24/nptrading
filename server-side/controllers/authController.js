const UserDetail = require("../models/User/userDetailSchema");
const jwt = require("jsonwebtoken");
const {promisify} = require("util")

exports.protect = async (req, res, next)=>{
    // console.log("req.cookies", req.cookies)
    // console.log(req.headers)
    let token;
    // if (
    //     req.headers.authorization &&
    //     req.headers.authorization.startsWith('Bearer')
    //   ) {
    //     token = req.headers.authorization.split(' ')[1];
    //   }

      if (req.cookies) {
        token = req.cookies.jwtoken;
      }
      if (!token) {
        return res.status(403).json({error:"Please login again"})
      }
    
      const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
    
      const freshUser = await UserDetail.findById(decoded._id);
    
      if (!freshUser) return res.status(403).json({error:"User no longer loggedIn"});
      //Implement changed password after request
    
      req.user = freshUser;
      next();
}

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({error:"Not Authorized"});
      }
      next();
    };
  };