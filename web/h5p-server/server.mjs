/**
 * Serveur activités interactives FreeGeny (stack Lumi Education).
 */
import bodyParser from "body-parser";
import express from "express";
import fileUpload from "express-fileupload";
import i18next from "i18next";
import i18nextFsBackend from "i18next-fs-backend";
import i18nextHttpMiddleware from "i18next-http-middleware";
import session from "express-session";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import * as H5P from "@lumieducation/h5p-server";
import {
  contentTypeCacheExpressRouter,
  h5pAjaxExpressRouter,
  libraryAdministrationExpressRouter,
} from "@lumieducation/h5p-express";
import createH5PEditor from "./lib/createH5PEditor.mjs";
import ExamplePermissionSystem from "./lib/ExamplePermissionSystem.mjs";
import ExampleUser from "./lib/ExampleUser.mjs";
import restExpressRoutes, { internalContentRouter, internalBootstrapRouter } from "./lib/routes.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.H5P_PORT || "8088", 10);
const BASE_URL = (process.env.H5P_BASE_URL || `http://localhost:${PORT}`).replace(/\/$/, "");
const API_KEY = process.env.H5P_API_KEY || "";

const h5pPaths = {
  core: resolve(__dirname, "h5p/core"),
  editor: resolve(__dirname, "h5p/editor"),
  libraries: resolve(__dirname, "h5p/libraries"),
  content: resolve(__dirname, "h5p/content"),
  temp: resolve(__dirname, "h5p/temp"),
  userData: resolve(__dirname, "h5p/user-data"),
};

async function main() {
  const translationFunction = await i18next
    .use(i18nextFsBackend)
    .use(i18nextHttpMiddleware.LanguageDetector)
    .init({
      backend: {
        loadPath: join(
          __dirname,
          "node_modules/@lumieducation/h5p-server/build/assets/translations/{{ns}}/{{lng}}.json"
        ),
      },
      defaultNS: "server",
      fallbackLng: "fr",
      preload: ["fr", "en", "ar"],
      ns: ["client", "hub", "library-metadata", "metadata-semantics", "server"],
    });

  const config = await new H5P.H5PConfig(
    new H5P.fsImplementations.JsonStorage(resolve(__dirname, "config.json"))
  ).load();

  // @lumieducation/h5p-server 10.0.4 still defaults to core API 1.27; hub libraries require 1.28.
  config.coreApiVersion = { major: 1, minor: 28 };
  config.h5pVersion = "1.28.0";

  const urlGenerator = new H5P.UrlGenerator(config, {
    queryParamGenerator: () => ({ name: "", value: "" }),
    protectAjax: false,
    protectContentUserData: false,
    protectSetFinished: false,
  });

  const permissionSystem = new ExamplePermissionSystem();
  const h5pEditor = await createH5PEditor(
    config,
    urlGenerator,
    permissionSystem,
    h5pPaths.libraries,
    h5pPaths.content,
    h5pPaths.temp,
    h5pPaths.userData,
    (key, language) => translationFunction(key, { lng: language })
  );
  const h5pPlayer = new H5P.H5PPlayer(
    h5pEditor.libraryStorage,
    h5pEditor.contentStorage,
    config,
    undefined,
    urlGenerator,
    undefined,
    { permissionSystem },
    h5pEditor.contentUserDataStorage
  );
  const app = express();

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "freegeny-interactive" });
  });

  app.use(bodyParser.json({ limit: "500mb" }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(
    fileUpload({
      limits: { fileSize: h5pEditor.config.maxTotalSize },
      useTempFiles: true,
      tempFileDir: h5pPaths.temp,
    })
  );
  app.use(
    session({
      secret: process.env.H5P_SESSION_SECRET || "freegeny-h5p-dev-secret",
      resave: false,
      saveUninitialized: false,
    })
  );

  app.use((req, res, next) => {
    req.user = new ExampleUser(
      "freegeny-teacher",
      "Enseignant FreeGeny",
      "teacher@freegeny.local",
      "teacher"
    );
    next();
  });

  app.use(i18nextHttpMiddleware.handle(i18next));

  // Bloque les téléchargements .h5p (élèves cliquaient export → fichier .h5p).
  app.use(`${h5pEditor.config.baseUrl}/download`, (_req, res) => {
    res.status(403).type("text/plain").send("Download disabled.");
  });

  app.use(
    h5pEditor.config.baseUrl,
    h5pAjaxExpressRouter(h5pEditor, h5pPaths.core, h5pPaths.editor, undefined, "auto")
  );

  app.use(h5pEditor.config.baseUrl, restExpressRoutes(h5pEditor, h5pPlayer, "auto"));

  app.use(
    `${h5pEditor.config.baseUrl}/libraries`,
    libraryAdministrationExpressRouter(h5pEditor)
  );

  app.use(
    `${h5pEditor.config.baseUrl}/content-type-cache`,
    contentTypeCacheExpressRouter(h5pEditor.contentTypeCache)
  );

  app.use("/internal/content", internalContentRouter(h5pEditor, API_KEY));
  app.use("/internal/bootstrap", internalBootstrapRouter(h5pEditor));

  app.listen(PORT, async () => {
    console.log(`FreeGeny activités interactives → ${BASE_URL} (port ${PORT})`);
    try {
      await h5pEditor.contentTypeCache.updateIfNecessary();
      console.log("Types d'activités — cache hub à jour.");
    } catch (e) {
      console.warn("Hub cache:", e.message);
    }
  });
}

main().catch((err) => {
  console.error("Interactive server failed:", err);
  process.exit(1);
});
