import puppeteer from 'puppeteer-core';
import fs from 'fs';

(async () => {
    const paths = [
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    ];
    let execPath = null;
    for (const p of paths) {
        if (fs.existsSync(p)) { execPath = p; break; }
    }

    if (!execPath) {
        console.log("No browser found");
        process.exit(1);
    }

    const browser = await puppeteer.launch({
        executablePath: execPath,
        headless: 'new'
    });
    const page = await browser.newPage();

    console.log("Navigating...");
    try {
        await page.goto('http://localhost:3001/about', { waitUntil: 'networkidle0', timeout: 20000 });
    } catch (e) { }

    await new Promise(r => setTimeout(r, 4000));

    const html = await page.evaluate(() => document.body.innerHTML);
    fs.writeFileSync('dom-dump.html', html);
    console.log("DOM dumped to dom-dump.html");

    await browser.close();
})();
