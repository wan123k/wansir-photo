const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, 'images');
const OUTPUT_FILE = path.join(__dirname, 'placeholders.json');

async function generate() {
  const files = fs.readdirSync(IMAGES_DIR).filter(f => /\.jpg$/i.test(f));
  const placeholders = {};

  for (const file of files) {
    const inputPath = path.join(IMAGES_DIR, file);
    // Resize to 30px wide, blur, and output as base64
    const buffer = await sharp(inputPath)
      .resize(30)
      .blur(5)
      .jpeg({ quality: 30 })
      .toBuffer();
    placeholders[file] = 'data:image/jpeg;base64,' + buffer.toString('base64');
    console.log(`${file}: ${(buffer.length/1024).toFixed(1)}KB base64`);
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(placeholders));
  const totalSize = fs.statSync(OUTPUT_FILE).size;
  console.log(`\nPlaceholders saved to ${OUTPUT_FILE} (${(totalSize/1024).toFixed(1)}KB total)`);
}

generate().catch(err => { console.error(err); process.exit(1); });
