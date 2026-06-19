declare module "nodemailer";
declare module "web-push";
declare module "pdfkit";
declare module "@excalidraw/excalidraw/index.css";
declare module "adm-zip" {
  export default class AdmZip {
    constructor(buffer?: Buffer | string);
    getEntry(name: string): AdmZipEntry | null;
    getEntries(): AdmZipEntry[];
  }
  interface AdmZipEntry {
    entryName: string;
    isDirectory: boolean;
    getData(): Buffer;
  }
}
