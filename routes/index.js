var express = require('express');
var router = express.Router();
const puppeteer = require('puppeteer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


router.get('/generate-pdf', async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log(req.body.url);
    await page.goto(req.body.url);
    await page.waitForSelector('body', { timeout: 30000 });
    await page.waitForFunction(() => {
      const text = document.querySelector('body').textContent;
      return text.includes('รายการ');
    }, { timeout: 30000 });
    // sleep(10000)
    const pdfBuffer = await page.pdf({ format: 'A4', landscape: false, scale: 1 });
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="page.pdf"');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
});


module.exports = router;
