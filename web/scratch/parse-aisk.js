const fs = require("fs");
const path = require("path");
const h = fs.readFileSync(path.join(process.env.TEMP, "aisk.html"), "utf8");
const css = h.match(/href="([^"]+\.css[^"]*)"/g) || [];
console.log("CSS:", [...new Set(css)].slice(0, 5));
const idx = h.indexOf("button-bg");
console.log(h.slice(idx - 200, idx + 500));
