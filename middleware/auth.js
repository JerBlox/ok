const jwt = require('jsonwebtoken');
const asyncFunc = require("./async");
const User = require("../models").User;
const ErrorResponse = require("../utils/ErrorResponse");

exports.protect = asyncFunc(async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token){
        return next(new ErrorResponse("Unauthorized", 401));
    }

    let decoded;
    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err){
        return next(new ErrorResponse("Unauthorized", 401));
    }

    req.user = await User.findByPk(decoded.id);
    if(!req.user){
        return next(new ErrorResponse("Unauthorized", 401));
    }
    next();
})