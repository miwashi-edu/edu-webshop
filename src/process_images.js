const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');

// Load product data
const products = require('../public/data/products.json');

// Output directory
const outputDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

const sizes = {
    tiny: 50,
    small: 150,
    medium: 300,
    large: 600,
};

async function downloadAndProcessImage(url, name) {
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'arraybuffer',
        });

        const buffer = Buffer.from(response.data);
        const metadata = await sharp(buffer).metadata();
        const ext = metadata.format === 'jpeg' ? 'jpg' : metadata.format;

        const baseFilename = path.join(outputDir, name.replace(/\s+/g, '_'));

        // Crop to square (centered)
        const minDim = Math.min(metadata.width, metadata.height);
        const cropped = sharp(buffer)
            .extract({
                width: minDim,
                height: minDim,
                left: Math.floor((metadata.width - minDim) / 2),
                top: Math.floor((metadata.height - minDim) / 2),
            });

        // Save each size
        for (const [label, size] of Object.entries(sizes)) {
            const outPath = `${baseFilename}_image_${label}.${ext}`;
            await cropped.resize(size, size).toFile(outPath);
            console.log(`Saved: ${outPath}`);
        }
    } catch (err) {
        console.error(`Failed for ${name}: ${err.message}`);
    }
}

(async () => {
    for (const product of products) {
        const url = product['Product-image-url'];
        const name = product['Product-title'];
        await downloadAndProcessImage(url, name);
    }
})();
