const express = require('express');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const app = express();
const port = process.env.PORT || 3001;

const compressImage = async (buffer, maxSize) => {
  let quality = 100;
  let compressedBuffer = buffer;

  while (compressedBuffer.length > maxSize && quality > 10) {
    compressedBuffer = await sharp(buffer)
      .jpeg({ quality })
      .toBuffer();
    quality -= 10;
  }
  return compressedBuffer;
};

app.use(bodyParser.json());

let browserPromise = puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

app.post('/screenshot', async (req, res) => {
  const { html } = req.body;
  
  if (!html) {
    res.status(400).json({ error: 'HTML content is required' });
    return;
  }

  try {
    const browser = await browserPromise;
    const page = await browser.newPage();
    const cssFilePath = path.join(__dirname, 'app/globals.css');
    const cssContent = fs.readFileSync(cssFilePath, 'utf8');

    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    await page.evaluate(() => {
      const preloadLink = document.createElement('link');
      preloadLink.href = 'https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&family=Press+Start+2P&display=swap';
      preloadLink.rel = 'preload';
      preloadLink.as = 'style';
      document.head.appendChild(preloadLink);
    });

    await page.addStyleTag({ content: cssContent });
    await page.evaluateHandle('document.fonts.ready');

    const el = await page.$('div.grid-wrapper');
    if (!el) {
      throw new Error('Element div.grid-wrapper not found in the page.');
    }

    const screenshotBuffer = await el.screenshot({ type: 'png' });
    await page.close();

    // Define the output directory and filename
    const outputDir = path.join(__dirname, 'public/screenshots/');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    const filename = `screenshot_${Date.now()}.png`;
    const filePath = path.join(outputDir, filename);

    // Write the screenshot to a file
    fs.writeFileSync(filePath, screenshotBuffer);

    // Send the file path in the response
    res.json({ imagePath: `http://localhost:3000/screenshots/${filename}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while taking a screenshot' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
