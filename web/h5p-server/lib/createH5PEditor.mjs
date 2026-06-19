import * as H5P from "@lumieducation/h5p-server";

export default async function createH5PEditor(
  config,
  urlGenerator,
  permissionSystem,
  localLibraryPath,
  localContentPath,
  localTemporaryPath,
  localContentUserDataPath,
  translationCallback
) {
  const contentUserDataStorage = new H5P.fsImplementations.FileContentUserDataStorage(
    localContentUserDataPath
  );

  return new H5P.H5PEditor(
    new H5P.cacheImplementations.CachedKeyValueStorage("kvcache"),
    config,
    new H5P.fsImplementations.FileLibraryStorage(localLibraryPath),
    new H5P.fsImplementations.FileContentStorage(localContentPath),
    new H5P.fsImplementations.DirectoryTemporaryFileStorage(localTemporaryPath),
    translationCallback,
    urlGenerator,
    {
      enableHubLocalization: true,
      enableLibraryNameLocalization: true,
      permissionSystem,
      // Hub API rejects local_id longer than 15 chars (node-machine-id hash is 64).
      getLocalIdOverride: () => {
        const raw = String(config.uuid ?? "freegeny").replace(/-/g, "");
        return raw.slice(0, 15) || "freegeny";
      },
    },
    contentUserDataStorage
  );
}
