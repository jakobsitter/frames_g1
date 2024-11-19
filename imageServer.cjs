const express = require('express');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const app = express();
const port = process.env.PORT || 3001;
const compressImage = async (buffer, maxSize) => {
  let quality = 100; // Start high and reduce
  let compressedBuffer = buffer;

  while (compressedBuffer.length > maxSize && quality > 10) {
    compressedBuffer = await sharp(buffer)
      .jpeg({ quality })
      .toBuffer();
    quality -= 10; // Lower quality and try again
  }
  return compressedBuffer;
};
// Use bodyParser to parse JSON request bodies
app.use(bodyParser.json());

// Launch the browser once at the top-level scope
let browserPromise = puppeteer.launch({
  headless: true, // Ensure it's running in headless mode
  args: ['--no-sandbox', '--disable-setuid-sandbox'], // Additional options for serverless environments
});

app.post('/screenshot', async (req, res) => {
  const { html } = req.body; // Get HTML content from the request body
  
  if (!html) {
    res.status(400).json({ error: 'HTML content is required' });
    return;
  }

  try {
    // Reuse the browser instance
    const browser = await browserPromise;
    const page = await browser.newPage();
    const cssFilePath = path.join(__dirname, 'app/globals.css'); // Replace 'styles.css' with your CSS file path
    const cssContent = fs.readFileSync(cssFilePath, 'utf8');
    // Set the HTML content
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    // Preload fonts before adding style tags
    await page.evaluate(() => {
      const preloadLink = document.createElement('link');
      preloadLink.href = 'https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&family=Press+Start+2P&display=swap';
      preloadLink.rel = 'preload';
      preloadLink.as = 'style';
      document.head.appendChild(preloadLink);
    });
    await page.addStyleTag({
      content: cssContent,
    });
    // Capture a compressed screenshot
    const el = await page.$('div.grid-wrapper');
    if (!el) {
      throw new Error('Element div.grid-wrapper not found in the page.');
    }
    const screenshotBuffer = await el.screenshot({ type: 'jpeg', quality: 100 });
    const finalBuffer = await compressImage(screenshotBuffer, 200 * 1024); // Target: 200 KB
    // Close the page instead of the browser
    await page.close();

    // Send the response
    res.json({ image: `data:image/jpeg;base64,${finalBuffer.toString('base64')}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while taking a screenshot' });
  }
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
