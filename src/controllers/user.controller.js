const { ApiError } = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler")
const User = require ('../models/user.model');
const uploadFileOnCloudinary = require("../utils/cloudinay");
const { ApiResponse } = require("../utils/apiResponse");

const registerUser = asyncHandler( async (req,res) => {
    //getting data form the body
    //validate 
    //check if user already exists
    //check for user avatar or cover
    //if any than upload to cloudinary
    //creat the user entry into db
    //check the created usre
    const {fullname, username, email,password} = req.body;

    if([fullname,username,email,password].some((val)=>val.trim()==="")){
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [
            {email},{username}
        ]
    })
    if(existedUser){
        throw new ApiError(409,'Allready a existing user')
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverLocalPath = req.files?.coverImage[0]?.path
    let coverLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError(400, 'avatar is required')
    }
    
    const avatar = await uploadFileOnCloudinary(avatarLocalPath)
    const coverImage = await uploadFileOnCloudinary(coverLocalPath)
    
    if(!avatar){
        throw new ApiError(400, 'avatar is required')
    }

    const user = await User.create({
        fullname,
        username,
        password,
        email,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
    })
    
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    
    if(!createdUser){
        throw new ApiError(500, 'something went wrong while add a user')
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,'User registered successfully'))


})

module.exports = {registerUser}