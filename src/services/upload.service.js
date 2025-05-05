import s3 from '../config/aws.js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

//Upload an image to S3
const uploadImageToS3 = async (file) => {
  try {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${fileName}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read' // Make the file publicly readable
    };
    
    const uploadResult = await s3.upload(params).promise();
    
    return uploadResult.Location;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Image upload failed');
  }
};

// Delete an image from S3
const deleteImageFromS3 = async (imageUrl) => {
  try {
    // Extract the key from the URL
    const urlParts = imageUrl.split('/');
    const key = urlParts.slice(3).join('/');
    
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key
    };
    
    await s3.deleteObject(params).promise();
    return true;
  } catch (error) {
    console.error('Error deleting from S3:', error);
    throw new Error('Image deletion failed');
  }
};

export {
  uploadImageToS3,
  deleteImageFromS3
};