// src/Hooks/useDirectSpacesUpload.js

import { useState } from "react";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import imageCompression from "browser-image-compression";

const useDirectSpacesUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);

  // Configure the S3 client for DigitalOcean Spaces
  const getS3Client = () => {
    return new S3Client({
      region: "nyc3", 
      endpoint: import.meta.env.VITE_DO_SPACES_ENDPOINT,
      credentials: {
        accessKeyId: import.meta.env.VITE_DO_SPACES_KEY,
        secretAccessKey: import.meta.env.VITE_DO_SPACES_SECRET,
      },
    });
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      // Step 1: Compress and resize the image
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        fileType: "image/webp"
      };
      
      const compressedFile = await imageCompression(file, options);
      
      // Step 2: Generate a unique filename
      const fileName = `products/${Date.now()}-${file.name.replace(/\.[^/.]+$/, "")}.webp`;
      
      // Step 3: Prepare upload parameters
      const params = {
        Bucket: import.meta.env.VITE_DO_SPACES_BUCKET,
        Key: fileName,
        Body: compressedFile,
        ContentType: "image/webp",
        ACL: "public-read",
      };
      
      // Step 4: Create and execute multipart upload
      const upload = new Upload({
        client: getS3Client(),
        params: params,
      });
      
      // Step 5: Track upload progress
      upload.on("httpUploadProgress", (progress) => {
        const percent = Math.round((progress.loaded * 100) / progress.total);
        setUploadProgress(percent);
      });
      
      // Step 6: Complete upload
      await upload.done();
      
      // Step 7: Construct the CDN URL
      const cdnUrl = `${import.meta.env.VITE_DO_SPACES_CDN_ENDPOINT}/${fileName}`;
      
      setUploading(false);
      return cdnUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploading(false);
      throw error;
    }
  };
  
  const uploadMultipleImages = async (files) => {
    setTotalFiles(files.length);
    const uploadedUrls = [];
    
    try {
      setUploading(true);
      for (let i = 0; i < files.length; i++) {
        setCurrentFileIndex(i);
        const url = await uploadImage(files[i]);
        uploadedUrls.push(url);
      }
      return uploadedUrls;
    } catch (error) {
      throw error;
    } finally {
      setUploading(false);
      setCurrentFileIndex(0);
    }
  };
  
  return { 
    uploadImage, 
    uploadMultipleImages, 
    uploading, 
    uploadProgress, 
    currentFileIndex, 
    totalFiles 
  };
};

export default useDirectSpacesUpload;