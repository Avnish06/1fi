const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: 'dpeekfbgh',
  api_key: '161876947987348',
  api_secret: 'pgziIIsm8ukKh6lzPJaJmoPSuyk',
});

const imagesDir = path.join(__dirname, 'images');

async function uploadImages() {
  try {
    const files = fs.readdirSync(imagesDir);
    const urls = {};
    for (const file of files) {
      if (file.endsWith('.jpg') || file.endsWith('.png')) {
        const filePath = path.join(imagesDir, file);
        console.log(`Uploading ${file}...`);
        const result = await cloudinary.uploader.upload(filePath, { folder: 'emi-products' });
        urls[file] = result.secure_url;
      }
    }
    console.log(JSON.stringify(urls, null, 2));
  } catch (error) {
    console.error('Error uploading:', error);
  }
}

uploadImages();
