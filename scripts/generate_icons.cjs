const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outDir = path.join(__dirname, '../public/icons');
const sourceFile = path.join(__dirname, '../src/assets/logo-source.svg');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const bgPath = "M256 128H768C838.69 128 896 185.31 896 256V768C896 838.69 838.69 896 768 896H256C185.31 896 128 838.69 128 768V256C128 185.31 185.31 128 256 128Z";
const logoPath = "M384 512L480 608L640 416M320 320V704H704";

async function createSVGAndPNG(filename, defs, bgFill, logoStroke, logoFilter = '') {
    const svg = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
<defs>${defs}</defs>
<path d="${bgPath}" fill="${bgFill}"/>
<g ${logoFilter ? `filter="${logoFilter}"` : ''}>
<path d="${logoPath}" stroke="${logoStroke}" stroke-width="80" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</g>
</svg>`;
    
    const svgPath = path.join(outDir, filename);
    fs.writeFileSync(svgPath, svg);
    
    // Generate multiple sizes for PWA
    const sizes = [192, 512];
    for (const size of sizes) {
        const sizedPngPath = path.join(outDir, `${path.basename(filename, '.svg')}-${size}.png`);
        await sharp(Buffer.from(svg))
            .resize(size, size)
            .png()
            .toFile(sizedPngPath);
    }
    
    console.log(`Created ${filename} and PNG variations`);
}

async function run() {
    // V1: Primary Blue Gradient
    const defsV1 = `<linearGradient id="grad_blue" x1="128" y1="128" x2="896" y2="896" gradientUnits="userSpaceOnUse"><stop stop-color="#3B82F6" /><stop offset="1" stop-color="#1D4ED8" /></linearGradient>`;
    await createSVGAndPNG('icon-v1.svg', defsV1, 'url(#grad_blue)', 'white');

    // V2: Comfort Dark (Slate/Blue)
    const defsV2 = `<linearGradient id="grad_dark" x1="128" y1="128" x2="896" y2="896" gradientUnits="userSpaceOnUse"><stop stop-color="#1E293B" /><stop offset="1" stop-color="#0F172A" /></linearGradient>`;
    await createSVGAndPNG('icon-v2.svg', defsV2, 'url(#grad_dark)', '#60A5FA');

    // V3: Clean White
    const defsV3 = `<filter id="shadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="15" stdDeviation="20" flood-color="#000000" flood-opacity="0.1"/></filter>`;
    await createSVGAndPNG('icon-v3.svg', defsV3, '#ffffff', '#0F172A', 'url(#shadow)');

    // V4: Favicon (Simple)
    const sizes = [16, 32, 48];
    for (const size of sizes) {
        const favPath = path.join(outDir, `favicon-${size}.png`);
        await sharp(path.join(outDir, 'icon-v1-192.png'))
            .resize(size, size)
            .toFile(favPath);
    }

    console.log('Icon generation complete!');
}

run().catch(console.error);
