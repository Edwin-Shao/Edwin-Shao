import { readFile, writeFile } from 'node:fs/promises';

const readmePath = new URL('../README.md', import.meta.url);
const city = 'Ningbo, China';
const time = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Shanghai',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
}).format(new Date());

const response = await fetch('https://wttr.in/Ningbo?format=%c+%t', {
  headers: { 'User-Agent': 'profile-status-updater' },
});

if (!response.ok) {
  throw new Error(`Weather request failed: ${response.status}`);
}

const weather = (await response.text()).trim().replace(/\s+/g, ' ');
const status = `📍 ${city} · ${time} CST · ${weather}`;
const readme = await readFile(readmePath, 'utf8');
const updated = readme.replace(
  /<!-- status:start -->[\s\S]*?<!-- status:end -->/,
  `<!-- status:start -->\n${status}\n<!-- status:end -->`,
);

if (updated === readme) {
  throw new Error('Status markers were not found in README.md');
}

await writeFile(readmePath, updated);
