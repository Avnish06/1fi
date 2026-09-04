// Force Google DNS to fix ISP SRV lookup blocks
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const path = require('path');
const Product = require('./models/Product');
const fs = require('fs');

cloudinary.config({
  cloud_name: 'dy1flnpei',
  api_key: '741736922123177',
  api_secret: 'NS73gtaeEGyu9TKmUXgsJiyGHbU',
});

const imagesDir = path.join(__dirname, 'images');

async function migrateImages() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected!');

    const products = await Product.find();
    const uploadCache = {};

    for (const product of products) {
      let modified = false;
      for (const variant of product.variants) {
        const currentImageUrl = variant.image;
        if (currentImageUrl && !currentImageUrl.includes('cloudinary.com')) {
          // Extract filename from the URL, assuming it ends with the filename
          const filename = currentImageUrl.substring(currentImageUrl.lastIndexOf('/') + 1);
          const localPath = path.join(imagesDir, filename);

          if (fs.existsSync(localPath)) {
            if (!uploadCache[filename]) {
              console.log(`Uploading ${filename}...`);
              const result = await cloudinary.uploader.upload(localPath, {
                folder: 'emi-products',
                resource_type: 'image',
                use_filename: true,
                unique_filename: false,
                overwrite: true,
              });
              uploadCache[filename] = result.secure_url;
              console.log(`✅ Uploaded ${filename} -> ${result.secure_url}`);
            }
            variant.image = uploadCache[filename];
            modified = true;
          } else {
            console.warn(`⚠️ File not found locally: ${localPath}`);
          }
        }
      }

      if (modified) {
        await product.save();
        console.log(`💾 Saved updated product: ${product.name}`);
      }
    }

    console.log('🎉 Migration complete!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

migrateImages();
