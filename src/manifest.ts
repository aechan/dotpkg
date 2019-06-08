import { fstat } from "fs";

export class Manifest {
    private _version: string;
    private _name: string;
    private _author?: string;
    private _authorURL?: string;
    private _image?: string;
    private _dependencies?: { name: string, version: string }[];
    private _filemap: { relativePath: string, localPath: string }[];
    private _valid: boolean;

    constructor (file: any) {
        this._version = "";
        this._name = "";
        this._image = undefined;
        this._dependencies = undefined;
        this._filemap = [];
        this._author = undefined;
        this._authorURL = undefined;
        
        this._valid = this.tryParseManifest(file);
    }

    /** The name of this manifest. */
    public get name() { return this._name; }

    /** The version of the manifest. */
    public get version() { return this._version; }

    /** [optional] Image for this manifest (for previews) */
    public get image() { return this._image; }

    /** A map of dependency names and versions for this manifest. */
    public get dependencies() { return this._dependencies; }

    /** A map between a file's location relative to this repo and it's desired location in the user's filesystem. */
    public get filemap() { return this._filemap; }

    /** Check the validity of this manifest file */
    public get valid() { return this._valid; }

    /** Author of this manifest. */
    public get author() { return this._author; }

    /** Author's URL (twitter, website, linkedin, etc..) */
    public get authorURL() { return this._authorURL; }

    /** Eventually we move to a legit JSON schema
     * to make parsing not disgusting. But this works
     * for now.
     */
    private tryParseManifest(file: any): boolean {
        if (!file) {
            return this.abortParse("Null or undefined manifest file.");
        }
        
        if (file.version) {
            this._version = file.version;
        } else {
            return this.abortParse("No manifest version specified.");
        }

        if (file.name) {
            this._name = file.name;
        } else {
            return this.abortParse("No manifest name specified.");
        }

        if (file.image) {
            this._image = file.image;
        }

        if (file.dependencies) {
            this._dependencies = file.dependencies;
        }

        if (file.filemap) {
            this._filemap = file.filemap;
        } else {
            return this.abortParse("No file map specified.");
        }

        if (file.author) {
            this._author = file.author;
        }

        if (file.authorURL) {
            this._authorURL = file.authorURL;
        }

        return true;
    }

    private abortParse(msg?: string) {
        console.error("Could not parse manifest file!");
        if (msg) {
            console.error(msg);
        }
        
        return false;
    }

    public static parseManifest(file: any): Manifest {
        return new Manifest(file);
    }
}