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

    page.on('response', response => {
        if (response.status() === 404) {
            console.log('\n[404 ERROR URL]:', response.url());
        }
    });

    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('\n[BROWSER ERROR]:', msg.text());
        }
    });

    page.on('pageerror', err => {
        console.log('\n[BROWSER PAGE ERROR]:', err.toString());
    });

    console.log("Navigating...");
    try {
        await page.goto('http://localhost:3001/about', { waitUntil: 'networkidle0', timeout: 20000 });
    } catch (e) { }

    await new Promise(r => setTimeout(r, 2000));
    await browser.close();
})();
