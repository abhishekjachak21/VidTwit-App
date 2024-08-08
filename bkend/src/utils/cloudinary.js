import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
  
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});



// here we are trying to upload the file from our local server to cloudinary and when uploading is successfull then we just removes or deletes the file from our local server this process in terms of operatig system is called as "unlink" -> term for deleting file in O.S(Operating Systems's file processing/file system).

// this process may result in too many errors or requires reuploading therefore use "try-catch" and also this process may take time so use "async-await"...
const uploadOnCloudinary = async (localFilePath) => {
  try {
      if (!localFilePath) return null;

      // Upload the file to Cloudinary
      const response = await cloudinary.uploader.upload(localFilePath, {
          resource_type: "auto"
      });

      // Delete the local file after successful upload
      if (fs.existsSync(localFilePath)) {
          fs.unlinkSync(localFilePath);
      } else {
          console.warn(`File not found: ${localFilePath}`);
      }

      return response;
  } catch (error) {
      console.error("Error uploading to Cloudinary:", error);

      // Cleanup in case of error
      if (fs.existsSync(localFilePath)) {
          fs.unlinkSync(localFilePath);
      } else {
          console.warn(`File not found for cleanup: ${localFilePath}`);
      }

      return null;
  }
};


const deleteFromCloudinary = async(publicId, resource_type = "image") => {
    try {
      if(!publicId) return null;
  
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: `${resource_type}`
      })
    } catch (error) {
      return error
      console.log("Error while deleting file on cloudinary", error);
    }
  
  }


export {uploadOnCloudinary, deleteFromCloudinary}