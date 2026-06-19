/**
 * Crée un EPUB minimal valide pour tests lecteur.
 * Usage: node scripts/create-sample-epub.js
 */
const fs = require("fs");
const path = require("path");
const JSZip = require("jszip");

const outDir = path.join(__dirname, "..", "public", "test");
const outFile = path.join(outDir, "sample.epub");

fs.mkdirSync(outDir, { recursive: true });

const zip = new JSZip();

zip.file("mimetype", "application/epub+zip", { compression: "STORE" });

zip.file(
  "META-INF/container.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`
);

zip.file(
  "OEBPS/content.opf",
  `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="uid">freegeny-sample</dc:identifier>
    <dc:title>FreeGeny — Livre test</dc:title>
    <dc:language>fr</dc:language>
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="chapter" href="chapter.xhtml" media-type="application/xhtml+xml"/>
  </manifest>
  <spine>
    <itemref idref="chapter"/>
  </spine>
</package>`
);

zip.file(
  "OEBPS/nav.xhtml",
  `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head><title>Navigation</title></head>
<body><nav epub:type="toc"><ol><li><a href="chapter.xhtml">Chapitre</a></li></ol></nav></body>
</html>`
);

zip.file(
  "OEBPS/chapter.xhtml",
  `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>Chapitre 1</title></head>
<body>
  <h1>Bienvenue dans la bibliothèque FreeGeny</h1>
  <p>Ceci est un livre de test très court pour vérifier le lecteur EPUB.</p>
  <p>Si vous lisez ce texte, tout fonctionne.</p>
</body>
</html>`
);

zip
  .generateAsync({ type: "nodebuffer", compression: "DEFLATE", compressionOptions: { level: 9 } })
  .then((data) => {
    fs.writeFileSync(outFile, data);
    console.log("OK —", outFile, fs.statSync(outFile).size, "bytes");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
