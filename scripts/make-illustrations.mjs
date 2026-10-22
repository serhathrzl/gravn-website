// Erzeugt die Website-Illustrationen aus den Originalen in "Bilder Website/":
// Graustufen (ohne Messing) und KI-Label "KI / AUTOMATISIERUNG" statt "AI / AUTOMATION".
// Aufruf: node scripts/make-illustrations.mjs
import sharp from 'sharp';

const SRC = 'Bilder Website';
const OUT = 'src/assets/illustrations';
const files = { websites: 'gravn-01-websites4x.png', marketing: 'gravn-02-marketing4x.png', ki: 'gravn-03-ki4x.png' };

// Position des Labels oben rechts im 3200x2400-Bild (rechtsbündig, vor dem Plus-Zeichen).
const LABEL = { text: 'KI / AUTOMATISIERUNG', right: 2992, baseline: 173, cover: { x: 2300, y: 135, w: 695, h: 55 } };

const labelSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="3200" height="2400">
  <rect x="${LABEL.cover.x}" y="${LABEL.cover.y}" width="${LABEL.cover.w}" height="${LABEL.cover.h}" fill="#ffffff"/>
  <text x="${LABEL.right}" y="${LABEL.baseline}" text-anchor="end" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="36" letter-spacing="10" fill="#9e9e9e">${LABEL.text}</text>
</svg>`;

for (const [name, file] of Object.entries(files)) {
  let img = sharp(`${SRC}/${file}`).grayscale();
  if (name === 'ki') img = sharp(await img.png().toBuffer()).composite([{ input: Buffer.from(labelSvg) }]);
  await img.png({ compressionLevel: 9 }).toFile(`${OUT}/${name}.png`);
  console.log(name, 'ok');
}
