import puppeteer from 'puppeteer';
import '../../../app/globals.css'
export default async function handler(req, res) {
  const { html } = req.body; // Get HTML content from the request body

  if (!html) {
    res.status(400).json({ error: 'HTML content is required' });
    return;
  }

  try {
    // Launch the browser
    const browser = await puppeteer.launch({
      headless: true, // Ensure it's running in headless mode
      args: ['--no-sandbox', '--disable-setuid-sandbox'] // Additional options for serverless environments
    });
    const page = await browser.newPage();

    // Set the HTML content

    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await page.addStyleTag({ content: `
      .grid-container {
        display: inline-flex;
        flex-direction: column;
        position: relative;
        gap: 0; /* Remove gaps to avoid double-spacing */
        user-select: none;
        zoom: 5;
      }
      .grid-container #gridlines {
        position: absolute;
        display: none;
      }
      .grid-row {
        display: flex;
        gap: 0; /* Remove gaps to avoid double-spacing */
      }
      
      .grid-cell {
        width: 30px;
        height: 30px;
        background-color: black;
        outline: 0.5px dashed gray; /* Use outline for dashed lines */
        box-sizing: border-box; /* Ensure borders are included in the element's size */
        font-family: 'Press Start 2P';
        font-size: 8px;
      }
      
      .grid-cell.filled {
        background-color: black;
        color: black;
        display: flex;
        align-content: center;
        flex-wrap: wrap;
        justify-content: center;
      }
    ` });
    // Capture a screenshot
    const boundingBox = await page.evaluate(() => {
      const componentElement = document.querySelector('.grid-container');
      return componentElement.getBoundingClientRect();
    });
    const el = await page.$("div.grid-container");
    const screenshot = await el.screenshot({
      type: "png",
      encoding: "base64" // specify the file extension
      
    });
    // Close the browser
    await browser.close();
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Content-Length': screenshot.length
    });
    //res.end({'image': "data:image/png;base64,"+screenshot});
    res.end(JSON.stringify({ image: `data:image/png;base64,${screenshot}` }));

    // Set the response type and send the screenshot as a base64-encoded string
    //res.setHeader('Content-Type', 'image/png');
    //res.send(screenshot.toString('base64'));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while taking a screenshot' });
  }
}