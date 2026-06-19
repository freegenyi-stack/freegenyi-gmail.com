const fs = require("fs");
const css = fs.readFileSync("C:/Users/Yousr/.cursor/projects/c-Users-Yousr-freegonya/agent-tools/dd352189-7fcb-4f80-82a7-cd7cade8ddc6.txt", "utf8");
for (const pat of ["button-bg", "gradient-btn", "primary-500", "primary-600", "--color-primary", "font-inter", "Inter"]) {
  let i = 0;
  while ((i = css.indexOf(pat, i)) !== -1) {
    console.log("\n---", pat, "---");
    console.log(css.slice(i, i + 200));
    i += pat.length;
    if (i > 500000) break;
  }
}
