const asyncHandler = require('express-async-handler');
const {cloudinaryUploadImg, cloudinaryDeleteImg} = require('../utils/cloudinary');
const fs = require('fs')

const uploadImagesProduct = asyncHandler(async(req, res) =>{
    try {
        const uploder = (path) => cloudinaryUploadImg(path, "images");
        const urls = [];
        const files =req.files;
        for(const file  of files){
            const {path} = file;
            const newPath = await uploder(path);
            urls.push(newPath);
            fs.unlinkSync(path);
        }
        const images = urls.map((file) =>{
            return file
        })
        res.json(images)
    } catch (error) {
        throw new Error(error);
    }
});

const deleteImagesProduct = asyncHandler(async(req, res) =>{
    const {id} = req.params;
    try {
        const deleted = cloudinaryDeleteImg(id, "images");
        res.json({message:"deleted"})
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {uploadImagesProduct, deleteImagesProduct}