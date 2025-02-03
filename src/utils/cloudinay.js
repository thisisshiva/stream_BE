const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRETE,
});

const uploadFileOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // upload file on cloudinary
    const res = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" });
    //file uploaded 

    console.log("file uploaded successful on cloudinary",res.url);
    
    return res;
    
  } catch (error){
        fs.unlinkSync(localFilePath) //remove the localy saved temporary file 
        return null 
  }
};

module.exports = uploadFileOnCloudinary
