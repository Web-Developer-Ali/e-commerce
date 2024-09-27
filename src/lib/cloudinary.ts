import cloudinary from 'cloudinary';
import fs from 'fs';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define the types for the result and error parameters
type UploadResult = {
  public_id: string;
  secure_url: string;
};

const uploadOnCloudinary = async (filePath: string, folder: string) => {
  return new Promise<UploadResult>((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: folder,
      },
      (err, result) => {
        if (err) {
          console.log(err);
          return reject(err);
        } else if (result) {
          return resolve(result);
        } else {
          return reject(new Error('Unknown error occurred during upload'));
        }
      }
    ).end(fs.readFileSync(filePath));
  });
};

export default uploadOnCloudinary;
