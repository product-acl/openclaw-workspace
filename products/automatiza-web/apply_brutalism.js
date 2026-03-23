const fs = require('fs');
const path = '/home/ubuntu/.openclaw/workspace/products/automatiza-web/app/page.tsx';

let content = fs.readFileSync(path, 'utf8');

// Replace backgrounds
content = content.replace(/bg-slate-950/g, 'bg-black');
content = content.replace(/bg-gray-950/g, 'bg-black');
content = content.replace(/bg-gray-900\/50/g, 'bg-black');
content = content.replace(/bg-gray-900/g, 'bg-zinc-950');
content = content.replace(/bg-gradient-to-b from-gray-900 to-gray-950/g, 'bg-zinc-900');

// Replace button gradients with Brutalist Green
content = content.replace(/bg-gradient-to-r from-blue-600 to-purple-600/g, 'bg-[#00FF66] text-black hover:bg-[#00CC52]');
content = content.replace(/from-blue-600 to-purple-600/g, 'bg-[#00FF66] text-black');

// Replace text colors
content = content.replace(/text-blue-400/g, 'text-[#00FF66]');
content = content.replace(/text-purple-400/g, 'text-[#00FF66]');
content = content.replace(/text-blue-500/g, 'text-[#00FF66]');

// Replace border colors
content = content.replace(/border-blue-600/g, 'border-[#00FF66]');
content = content.replace(/shadow-blue-900\/20/g, 'shadow-[#00FF66]\/10');

// Replace specific SVG icons colors
content = content.replace(/text-green-400/g, 'text-[#00FF66]');

fs.writeFileSync(path, content);
console.log("Brutalism applied!");
