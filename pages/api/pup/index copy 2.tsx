import puppeteer from 'puppeteer';
import '../../../app/globals.css';

// Launch the browser once at the top-level scope
let browserPromise = puppeteer.launch({
  headless: true, // Ensure it's running in headless mode
  args: ['--no-sandbox', '--disable-setuid-sandbox'], // Additional options for serverless environments
});

export default async function handler(req, res) {
  const { html } = req.body; // Get HTML content from the request body

  if (!html) {
    res.status(400).json({ error: 'HTML content is required' });
    return;
  }

  try {
    // Reuse the browser instance
    const browser = await browserPromise;
    const page = await browser.newPage();

    // Set the HTML content
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    // Add your style tags
    await page.addStyleTag({
      url: 'https://fonts.googleapis.com/css2?family=Kode+Mono:wght@400..700&display=swap',
    });
    await page.addStyleTag({
      content: `
        @font-face {
          font-family: 'Press Start 2P';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: url(https://fonts.gstatic.com/s/pressstart2p/v15/e3t4euO8T-267oIAQAu6jDQyK3nWivNm4I81PZQ.woff2) format('woff2');
          unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;
        }
        .grid-wrapper {
          width: 300px;
          height: 300px;
          zoom: 5;
          overflow: hidden;
          background: black;
          position: relative;
          color: white;
        }
        .grid-container {
          display: inline-flex;
          flex-direction: column;
          position: relative;
          gap: 0; /* Remove gaps to avoid double-spacing */
          user-select: none;
          transform: scale(0.7);
          transform-origin: center top;
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
          font-size: 6px;
          position: relative;
        }
        .grid-cell.filled {
          background-color: black;
          color: black;
          display: flex;
          align-content: center;
          flex-wrap: wrap;
          justify-content: center;
        }
        .grid-cell .cellIndex {
          color: white;
          top: 1px;
          left: 1px;
          font-size: 5px;
          position: absolute;
          font-family: 'Kode Mono';
        }
        .grid-cell.filled .cellIndex {
          color: black;
        }
        .draggableShapes-container {
          z-index: 99999;
          position: absolute;
          bottom: 0px;
          left: 0;
          background: ;
          display: flex;
          flex-wrap: wrap;
          width: 100%;
          height: 100px;
          color: white;
        }
        .shape {
          text-align: left;
          line-height: 0;
          position: absolute;
        }
        .shape_outer {
          width: calc(33.3%);
          align-items: center;
          justify-content: center;
          display: flex;
          zoom: 0.3;
        }
        .shape_outer .tooltip {
          height: auto;
          clear: both;
          position: absolute;
          bottom: 0;
          font-family: 'Press Start 2P';
          font-size: 20px;
        }
        .shape .inner {
          transform-origin: center;
        }
        .active {
          border: 5px red solid;
        }
        .score {
          color: white;
          font-family: 'Press Start 2P';
          font-size: 6px;
          position: absolute;
          transform: rotate(90deg) translate(-50%, -50%);
          transform-origin: top left;
          top: 50%;
          left: 20px;
        }
      `,
    });

    // Capture a screenshot
    const el = await page.$('div.grid-wrapper');
    const screenshot = await el.screenshot({
      type: 'png',
      encoding: 'base64', // specify the file extension
    });

    // Close the page instead of the browser
    await page.close();

    // Send the response
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Content-Length': screenshot.length,
    });
    res.end(JSON.stringify({ image: `data:image/png;base64,${screenshot}` }));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while taking a screenshot' });
  }
}
