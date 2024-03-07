const cloudinary = require("cloudinary");
const config = require("../config/config") 
cloudinary.config({ 
    cloud_name: config.cloudinary.cloud_name, 
    api_key: config.cloudinary.api_key, 
    api_secret: config.cloudinary.sec_key 
  });

  const cloudinaryUploadImg = async(fileToUploads) =>{
    return new Promise((resolve) =>{
        cloudinary.uploader.upload(fileToUploads, (result) =>{
            resolve({
                url: result.secure_url,
                asset_id : result.asset_id,
                public_id:result.public_id,
            },{
                resource_type: "auto"
            })
        })
    })
  }
  const cloudinaryDeleteImg = async(fileToDelete) =>{
    return new Promise((resolve) =>{
        cloudinary.uploader.destroy(fileToDelete, (result) =>{
            resolve({
                url: result.secure_url,
                asset_id : result.asset_id,
                public_id:result.public_id,
            },{
                resource_type: "auto"
            })
        })
    })
  }

  module.exports = {cloudinaryUploadImg, cloudinaryDeleteImg};