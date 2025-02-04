const jwt  = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/user.model");
const { ApiError } = require("../utils/apiError");

const userAuth = asyncHandler(async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","").trim()
    
        // console.log("Cookies:", req.cookies);
        // console.log("Authorization Header:", req.header("Authorization"));
        // console.log("Extracted Token:", token);

        if (!token || typeof token !== "string") {
            throw new ApiError(401, "Invalid or missing token");
        }
    
        const {_id} = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRETE)
    
        const user = await User.findById(_id).select("-password -refreshToken")
    
        if (!user) {    
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401,error.message || "Invalid access Token")
    }
})

module.exports = userAuth