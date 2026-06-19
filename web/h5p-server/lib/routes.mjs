import express from "express";

const CORE_BOOTSTRAP_LIBRARIES = [
  "H5P.QuestionSet",
  "H5P.Blanks",
  "H5P.DragQuestion",
  "H5P.TrueFalse",
  "H5P.Flashcards",
  "H5P.InteractiveVideo",
];

async function getHubMachineNames(h5pEditor) {
  await h5pEditor.contentTypeCache.updateIfNecessary().catch(() => h5pEditor.contentTypeCache.forceUpdate());
  const cache = await h5pEditor.contentTypeCache.get();
  if (!Array.isArray(cache) || cache.length === 0) return CORE_BOOTSTRAP_LIBRARIES;
  return cache.map((t) => t.machineName).filter((n) => typeof n === "string" && n.startsWith("H5P."));
}

async function fetchHubTypeCatalog(h5pEditor) {
  await h5pEditor.contentTypeCache.updateIfNecessary().catch(() => h5pEditor.contentTypeCache.forceUpdate());
  const cache = await h5pEditor.contentTypeCache.get();
  if (!Array.isArray(cache)) return [];
  return cache.map((t) => ({
    machineName: t.machineName,
    title: t.title || t.machineName,
    summary: t.summary || "",
    description: t.description || t.summary || "",
    icon: t.icon || null,
    restricted: false,
  }));
}

async function resolveLibraryName(h5pEditor, machineName) {
  const installed = await h5pEditor.libraryManager.listInstalledLibraries(machineName);
  const libs = installed[machineName];
  if (libs?.length) {
    const lib = libs[0];
    return `${lib.machineName} ${lib.majorVersion}.${lib.minorVersion}`;
  }
  return machineName;
}

async function ensureLibraryInstalled(h5pEditor, machineName, user, retries = 3) {
  let libName = await resolveLibraryName(h5pEditor, machineName);
  if (libName.includes(" ")) return libName;

  for (let attempt = 0; attempt < retries && !libName.includes(" "); attempt++) {
    try {
      await h5pEditor.installLibraryFromHub(machineName, user);
    } catch (err) {
      console.warn("Install retry", machineName, attempt + 1, err.message);
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
    }
    libName = await resolveLibraryName(h5pEditor, machineName);
  }
  return libName;
}

async function bootstrapLibraries(h5pEditor, user, machineNames) {
  const installed = [];
  const failed = [];
  await h5pEditor.contentTypeCache.updateIfNecessary().catch(() => h5pEditor.contentTypeCache.forceUpdate());

  for (const machineName of machineNames) {
    try {
      const libName = await ensureLibraryInstalled(h5pEditor, machineName, user, 3);
      if (libName.includes(" ")) installed.push(libName);
      else failed.push(machineName);
    } catch (err) {
      console.warn("Bootstrap skip", machineName, err.message);
      failed.push(machineName);
    }
  }
  return { installed, failed };
}

export default function restExpressRoutes(h5pEditor, h5pPlayer, languageOverride = "auto") {
  const router = express.Router();

  const FREEGENY_EDITOR_STYLES = `
    .h5p-tutorial-url,.h5p-example-url{display:none!important}
    .important-description-example,.important-description-show{display:none!important}
    .h5peditor-form-manager-head,.h5p-hub-page-header{display:none!important}
    .h5peditor-copy-paste-buttons{display:none!important}
    #h5p-content-form{text-align:left;margin:0;padding:0}
    .h5p-create{min-height:420px;width:100%}
    .h5p-editor{min-height:420px;width:100%}
    .h5p-editor-iframe{min-height:480px!important;height:72vh!important}
    #save-h5p{display:none;margin:1rem auto 1.5rem;padding:.75rem 2.5rem;background:#0d9488;color:#fff;border:none;border-radius:12px;font-weight:800;font-size:14px;cursor:pointer}
    #save-h5p.fg-ready{display:block}
    #save-h5p:hover{background:#0f766e}
    body{margin:0;padding:.5rem;background:#fff}
  `;

  const FREEGENY_EDITOR_BOOT = `
<script>
(function(){
  var form=document.getElementById('h5p-content-form');
  if(form&&!form.querySelector('input[name="library"]')){
    var lib=document.createElement('input');lib.type='hidden';lib.name='library';form.appendChild(lib);
    var par=document.createElement('input');par.type='hidden';par.name='parameters';form.appendChild(par);
  }
  var btn=document.getElementById('save-h5p');
  var box=document.querySelector('.h5p-create');
  if(btn&&box)box.appendChild(btn);
  function markReady(){
    if(!btn)return;
    var ed=document.querySelector('.h5p-editor iframe,.h5p-editor .h5peditor-form,.h5p-editor .h5p-hub');
    if(ed&&(ed.offsetHeight>60||ed.classList.contains('h5peditor-form')))btn.classList.add('fg-ready');
  }
  var n=0,t=setInterval(function(){markReady();if(++n>24)clearInterval(t);},500);
})();
</script>`;

  function dedupeScriptTags(html) {
    const seen = new Set();
    return html.replace(/<script src="([^"?]+[^"]*)"><\/script>/g, (match, src) => {
      const key = src.split("?")[0];
      if (seen.has(key)) return "";
      seen.add(key);
      return match;
    });
  }

  function bustAssetCache(html) {
    return html.replace(/\?version=1\.28\.0(?:-fg\d*)?/g, "?version=1.28.0-fg3");
  }

  const FREEGENY_HEAD_GUARD = `
<script>
(function(){
  window.H5PIntegration=window.H5PIntegration||{};
  if(!window.H5PIntegration.l10n)window.H5PIntegration.l10n={H5P:{}};
  window.H5PEditor=window.H5PEditor||{};
  if(!window.H5PEditor.language)window.H5PEditor.language={};
})();
</script>`;

  function fixH5pEditorHtml(html, language = "fr") {
    let out = bustAssetCache(dedupeScriptTags(html))
      .replace(/window\.H5PIntegration = parent\.H5PIntegration \|\|/g, "window.H5PIntegration =")
      .replace(
        /H5PEditor\.enableContentHub = H5PIntegration\.editor\.enableContentHub/g,
        "H5PEditor.enableContentHub = (H5PIntegration.editor && H5PIntegration.editor.enableContentHub)"
      )
      .replace(
        /window\.location\.href = '\/ix\/play\/' \+ parsedResult\.contentId;/g,
        "if(window.parent!==window){window.parent.postMessage({type:'freegeny-h5p-saved',contentId:parsedResult.contentId},'*');}else{window.location.href='/ix/'+parsedResult.contentId+'/play';}"
      )
      .replace(
        /window\.location\.href = '\/ix\/' \+ parsedResult\.contentId \+ '\/play';/g,
        "if(window.parent!==window){window.parent.postMessage({type:'freegeny-h5p-saved',contentId:parsedResult.contentId},'*');}else{window.location.href='/ix/'+parsedResult.contentId+'/play';}"
      )
      .replace(/value="Create"/g, 'value="Enregistrer"')
      .replace(
        /type: 'POST'\s*\}\)\.then\(\(result\) => \{/g,
        "type: 'POST', url: window.location.pathname }).then((result) => {"
      )
      .replace(
        /(<script src="\/ix\/editor\/scripts\/h5peditor\.js[^"]*"><\/script>)/,
        `$1<script>window.H5PEditor=window.H5PEditor||{};if(!window.H5PEditor.language)window.H5PEditor.language={};if(window.H5PIntegration&&!window.H5PIntegration.editor)window.H5PIntegration.editor={enableContentHub:false};if(!window.H5PIntegration.l10n)window.H5PIntegration.l10n={H5P:{}};</script>`
      )
      .replace(/new ns\.Editor\(/g, "new H5PEditor.Editor(")
      .replace(
        "$(document).ready(H5PEditor.init);",
        "$(document).ready(function(){var run=function(){if(typeof H5PEditor.Editor==='function'){H5PEditor.init();}else if((run.tries=(run.tries||0)+1)<40){setTimeout(run,50);}};run();});"
      );

    if (language === "ar") {
      out = out
        .replace(/\/editor\/language\/fr\.js/g, "/editor/language/ar.js")
        .replace(/\/editor\/language\/en\.js/g, "/editor/language/ar.js");
    } else if (language !== "en") {
      out = out.replace(/\/editor\/language\/en\.js/g, "/editor/language/fr.js");
    }

    return out
      .replace("</head>", `${FREEGENY_HEAD_GUARD}<style>${FREEGENY_EDITOR_STYLES}</style></head>`)
      .replace("</body>", `${FREEGENY_EDITOR_BOOT}</body>`);
  }

  const FREEGENY_PLAYER_BOOT = `
<script>
(function(){
  window.H5P = window.H5P || {};
  if (window.self !== window.parent) {
    try {
      if (!window.parent.H5P || !window.parent.H5P.externalDispatcher) {
        window.H5P.isFramed = false;
        window.H5P.externalEmbed = false;
      }
    } catch (e) {
      window.H5P.isFramed = false;
      window.H5P.externalEmbed = false;
    }
  }
})();
</script>`;

  function fixH5pPlayerHtml(html, language = "fr") {
    let out = bustAssetCache(dedupeScriptTags(html))
      .replace(/"exportUrl"\s*:\s*"[^"]*"/g, '"exportUrl":""')
      .replace(/"export"\s*:\s*true/g, '"export": false')
      .replace(/"copy"\s*:\s*true/g, '"copy": false')
      .replace(/<a[^>]*href="[^"]*\/download\/[^"]*"[^>]*>[\s\S]*?<\/(?:a|button)>/gi, "");

    if (language === "ar") {
      out = out.replace(/"download"\s*:\s*"Download"/g, '"download":"تنزيل"');
    }

    const playerStyles = `
      .h5p-action-bar,.h5p-export-button,.h5p-download-button,.h5p-embed-button,.h5p-copyright-button{display:none!important}
      html,body{margin:0;padding:0;background:#fff}
      .h5p-iframe-wrapper,.h5p-content{border:none!important}
    `;

    const playerBridge = `
<script>
(function(){
  if(!window.H5PIntegration)window.H5PIntegration={};
  if(!window.H5PIntegration.l10n)window.H5PIntegration.l10n={H5P:{}};
  function notify(detail){
    try{window.parent.postMessage(Object.assign({type:'freegeny-h5p-finished'},detail||{}),'*');}catch(e){}
  }
  function hook(){
    if(!window.H5P)return;
    if(H5P.externalDispatcher){
      H5P.externalDispatcher.on('xAPI',function(evt){
        var v=evt&&evt.getVerb&&evt.getVerb();
        if(v==='completed'||v==='answered'){
          var s=evt.getScore&&evt.getScore();
          notify({verb:v,score:s?s.raw:undefined,maxScore:s?s.max:undefined});
        }
      });
    }
    if(H5P.setFinished&&!H5P.setFinished.__fg){
      var orig=H5P.setFinished;
      H5P.setFinished=function(contentId,score,maxScore,time){
        orig.apply(this,arguments);
        notify({contentId:contentId,score:score,maxScore:maxScore,time:time});
      };
      H5P.setFinished.__fg=true;
    }
  }
  function ensureInit(){
    if(!window.H5P||!H5P.init)return;
    if(!H5P.instances||!H5P.instances.length){
      H5P.init(document.body);
    }
    hook();
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',function(){hook();setTimeout(ensureInit,400);});
  }else{
    hook();
    setTimeout(ensureInit,400);
  }
  setTimeout(hook,1500);
})();
</script>`;

    out = out.replace(
      /(<script src="\/ix\/core\/js\/h5p\.js[^"]*"><\/script>)/,
      `$1${FREEGENY_PLAYER_BOOT}`
    );

    return out
      .replace("</head>", `${FREEGENY_HEAD_GUARD}<style>${playerStyles}</style></head>`)
      .replace("</body>", `${playerBridge}</body>`);
  }

  function resolveLanguage(req) {
    const q = String(req.query?.language || req.query?.lang || "").trim().toLowerCase();
    if (q === "ar") return "ar";
    if (languageOverride !== "auto") return languageOverride;
    const detected = String(req.language || "fr").toLowerCase();
    if (detected.startsWith("ar")) return "ar";
    return "fr";
  }

  router.get("/download/:contentId", (_req, res) => {
    res.status(403).type("text/plain").send("Download disabled.");
  });

  async function saveContent(req, res, contentId) {
    if (!req.user) {
      res.status(401).send("Unauthorized");
      return;
    }

    const library = String(req.body.library || "").trim();
    if (!library) {
      res.status(400).send("Malformed request");
      return;
    }

    let contentParams;
    let metadata;

    if (
      req.body.params &&
      typeof req.body.params === "object" &&
      req.body.params.params !== undefined &&
      req.body.params.metadata !== undefined
    ) {
      contentParams = req.body.params.params;
      metadata = req.body.params.metadata;
    } else if (req.body.params && typeof req.body.params === "object") {
      contentParams = req.body.params;
      metadata = {
        title: String(req.body.title || req.body.metadata?.title || "Activité"),
        license: "U",
        ...(req.body.metadata && typeof req.body.metadata === "object" ? req.body.metadata : {}),
      };
    } else {
      res.status(400).send("Malformed request");
      return;
    }

    const { id: savedId, metadata: savedMeta } = await h5pEditor.saveOrUpdateContentReturnMetaData(
      contentId ? String(contentId) : undefined,
      contentParams,
      metadata,
      library,
      req.user
    );
    res.status(200).json({ contentId: savedId, id: savedId, metadata: savedMeta });
  }

  router.get("/play/:contentId", (req, res) => {
    res.redirect(302, `${req.baseUrl}/${req.params.contentId}/play`);
  });

  router.get("/:contentId/play", async (req, res) => {
    try {
      const language = resolveLanguage(req);
      const html = await h5pPlayer.render(req.params.contentId, req.user, language, {
        showCopyButton: false,
        showDownloadButton: false,
        showEmbedButton: false,
        showFrame: false,
        showH5PIcon: false,
        showLicenseButton: false,
      });
      res.status(200).type("html").send(fixH5pPlayerHtml(html, language));
    } catch (error) {
      console.error(error);
      res.status(error.httpStatusCode ?? 500).send(error.message);
    }
  });

  router.get("/:contentId/edit", async (req, res) => {
    try {
      const language = resolveLanguage(req);
      const contentId =
        !req.params.contentId || req.params.contentId === "undefined"
          ? undefined
          : req.params.contentId;
      const html = await h5pEditor.render(contentId, language, req.user);
      res.status(200).type("html").send(fixH5pEditorHtml(html, language));
    } catch (error) {
      console.error(error);
      res.status(error.httpStatusCode ?? 500).send(error.message);
    }
  });

  router.post("/:contentId/edit", async (req, res) => {
    try {
      await saveContent(req, res, req.params.contentId);
    } catch (error) {
      console.error(error);
      res.status(error.httpStatusCode ?? 500).send(error.message);
    }
  });

  router.post("/", async (req, res) => {
    try {
      await saveContent(req, res, undefined);
    } catch (error) {
      console.error(error);
      res.status(error.httpStatusCode ?? 500).send(error.message);
    }
  });

  router.patch("/:contentId", async (req, res) => {
    try {
      await saveContent(req, res, req.params.contentId);
    } catch (error) {
      console.error(error);
      res.status(error.httpStatusCode ?? 500).send(error.message);
    }
  });

  router.delete("/:contentId", async (req, res) => {
    try {
      await h5pEditor.deleteContent(req.params.contentId, req.user);
      res.status(200).send(`Content ${req.params.contentId} deleted.`);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  });

  router.get("/", async (req, res) => {
    try {
      const contentIds = await h5pEditor.contentManager.listContent(req.user);
      const contentObjects = await Promise.all(
        contentIds.map(async (id) => ({
          content: await h5pEditor.contentManager.getContentMetadata(id, req.user),
          id,
        }))
      );
      res.status(200).send(
        contentObjects.map((o) => ({
          contentId: o.id,
          id: o.id,
          title: o.content.title,
          mainLibrary: o.content.mainLibrary,
        }))
      );
    } catch (error) {
      res.status(error.httpStatusCode ?? 500).send(error.message);
    }
  });

  return router;
}

export function internalBootstrapRouter(h5pEditor) {
  const router = express.Router();

  router.get("/types", async (_req, res) => {
    try {
      const catalog = await fetchHubTypeCatalog(h5pEditor);
      const installedMap = await h5pEditor.libraryManager.listInstalledLibraries();
      const types = catalog.map((t) => {
        const libs = installedMap[t.machineName];
        const installed = Boolean(libs?.length);
        const version = installed ? `${libs[0].majorVersion}.${libs[0].minorVersion}` : null;
        return { ...t, installed, version };
      });
      res.json({ ok: true, types, count: types.length });
    } catch (error) {
      res.status(500).json({ error: error.message ?? "types_failed" });
    }
  });

  router.post("/", async (req, res) => {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: "unauthorized" });
      return;
    }
    try {
      const all = req.query.all === "1" || req.query.all === "true";
      const machineNames = all ? await getHubMachineNames(h5pEditor) : CORE_BOOTSTRAP_LIBRARIES;
      const { installed, failed } = await bootstrapLibraries(h5pEditor, user, machineNames);
      res.json({ ok: true, installed, failed, total: machineNames.length });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message ?? "bootstrap_failed" });
    }
  });

  router.get("/resolve/:machineName", async (req, res) => {
    try {
      const machineName = String(req.params.machineName || "").trim();
      if (!machineName) {
        res.status(400).json({ error: "machine_required" });
        return;
      }
      const library = await ensureLibraryInstalled(h5pEditor, machineName, req.user, 3);
      res.json({ library, installed: library.includes(" ") });
    } catch (error) {
      res.status(500).json({ error: error.message ?? "resolve_failed" });
    }
  });

  return router;
}

export function internalContentRouter(h5pEditor, apiKey) {
  const router = express.Router();

  router.use((req, res, next) => {
    if (!apiKey) return next();
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
    if (token !== apiKey) {
      res.status(401).json({ error: "unauthorized" });
      return;
    }
    next();
  });

  router.get("/:contentId/exists", async (req, res) => {
    const user = req.user;
    const contentId = String(req.params.contentId || "").trim();
    if (!user || !contentId) {
      res.status(400).json({ exists: false });
      return;
    }
    try {
      await h5pEditor.contentManager.getContentMetadata(contentId, user);
      res.json({ exists: true, contentId });
    } catch {
      res.json({ exists: false, contentId });
    }
  });

  router.post("/", async (req, res) => {
    const user = req.user;
    let library = String(req.body.library || "").trim();
    const title = String(req.body.title || req.body.params?.metadata?.title || "Activité").trim();
    if (!library || !user) {
      res.status(400).json({ error: "library_required" });
      return;
    }
    try {
      if (!library.includes(" ")) {
        library = await ensureLibraryInstalled(h5pEditor, library, user, 3);
      }
      if (!library.includes(" ")) {
        res.status(400).json({ error: "library_not_installed", library });
        return;
      }
      const { id: contentId, metadata } = await h5pEditor.saveOrUpdateContentReturnMetaData(
        undefined,
        req.body.params?.params ?? {},
        {
          title,
          license: "U",
          ...(req.body.params?.metadata ?? {}),
        },
        library,
        user
      );
      res.status(200).json({ contentId, id: contentId, metadata });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message ?? "create_failed" });
    }
  });

  router.patch("/:contentId", async (req, res) => {
    const user = req.user;
    let library = String(req.body.library || "").trim();
    const title = String(req.body.title || req.body.params?.metadata?.title || "Activité").trim();
    const contentId = String(req.params.contentId || "").trim();
    if (!library || !user || !contentId) {
      res.status(400).json({ error: "invalid_request" });
      return;
    }
    try {
      if (!library.includes(" ")) {
        library = await ensureLibraryInstalled(h5pEditor, library, user, 3);
      }
      if (!library.includes(" ")) {
        res.status(400).json({ error: "library_not_installed", library });
        return;
      }
      const { id: savedId, metadata } = await h5pEditor.saveOrUpdateContentReturnMetaData(
        contentId,
        req.body.params?.params ?? {},
        {
          title,
          license: "U",
          ...(req.body.params?.metadata ?? {}),
        },
        library,
        user
      );
      res.status(200).json({ contentId: savedId, id: savedId, metadata });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message ?? "update_failed" });
    }
  });

  router.delete("/:contentId", async (req, res) => {
    const user = req.user;
    const contentId = String(req.params.contentId || "").trim();
    if (!user || !contentId) {
      res.status(400).json({ error: "invalid_request" });
      return;
    }
    try {
      await h5pEditor.deleteContent(contentId, user);
      res.status(200).json({ ok: true, contentId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message ?? "delete_failed" });
    }
  });

  return router;
}
