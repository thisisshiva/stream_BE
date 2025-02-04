const { ApiError } = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler")
const User = require ('../models/user.model');
const uploadFileOnCloudinary = require("../utils/cloudinay");
const { ApiResponse } = require("../utils/apiResponse");
const jwt = require("jsonwebtoken");


const generateAccessAndRefreshTokens = async (userId) =>{
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })

        return {accessToken,refreshToken}

    }catch(err){
        throw new ApiError(500, "something went wrong while generating tokens" )
    }
}

const registerUser = asyncHandler( async (req,res) => {
    //getting data form the body
    //validate 
    //check if user already exists
    //check for user avatar or cover
    //if any than upload to cloudinary
    //creat the user entry into db
    //check the created usre
    const {fullname, username, email,password} = req.body;

    if([fullname,username,email,password].some((val)=>val?.trim()==="")){
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

const loginUser = asyncHandler( async (req,res) => {
    //req body se email and password
    //validate the eamil and pswd
    //check the user for the emailid
    //after checking get the user pswd and compare it 
    //login
    const {email, username,password} = req.body

    // if(!username && !email){
    //     throw new ApiError(400, "Invalid credentials, username or email is required")
    // }

    if (!(username || email)) {
        throw new ApiError(400, "username or email is required")
        
    }

    const user = await User.findOne({
        $or: [
            {username},{email}
        ]
    })
    if(!user){
        throw new ApiError(401, "User dosen't exists, Please Register")
    }
    
    const isPasswordCorrect = await user.isPasswordValid(password)
    if(!isPasswordCorrect){
        throw new ApiError(400, "Invaild Credential")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200,{user: loggedInUser,accessToken,refreshToken},'User loggedin successful')
    )
})

const logOutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async(req,res)=>{
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    
        if(!incomingRefreshToken){
            throw new ApiError(401,"unauthorized requrest")
        }
    
        const {_id} = await jwt.verify(incomingRefreshToken ,process.env.REFRESH_TOKEN_SECRETE)
    
        const user = await User.findById(_id)
    
        if(!user){
            throw new ApiError(401,"Invalid refresh token")
        }
    
        if(incomingRefreshToken !== user?.refrehToken){
            throw new ApiError(401,"Refresh token is used or expired")
        }
    
        const options = {
            httpOnly: true,
            secure: true,
        }
    
        const {accessToken,newrefrehToken} = generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie('accessToken', accessToken,options)
        .cookie('refreshToken',newrefrehToken,options)
        .json(new ApiResponse(200,{accessToken:accessToken,refreshToken :newrefrehToken}),"Access token refreshed successful")
    } catch (error) {
        throw new ApiError(400,error.message )
    }

})

module.exports = {registerUser,loginUser,logOutUser,refreshAccessToken}