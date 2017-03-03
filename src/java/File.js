import fs from "fs";
import path from "path";
import {sync as mkdirsSync} from "mkdirp";
function canAccess(file) {
    try {
        fs.accessSync(file);
        return true;
    } catch (e) {
    }
    return false;
}
const toString = String.valueOf();

export default class File {
    static separator = path.sep;
    static separatorChar = path.sep;

    constructor(...args) {
        this._filename = path.join(...args.map(toString));
    }

    toAbsolutePath() {
        return this.toAbsolute().getPath();
    }

    getAbsolutePath() {
        return this.toAbsolutePath();
    }

    toAbsolute() {
        if (this.__filename.startsWith("/")) {
            return this;
        }
        return new File(path.join(process.cwd(), this._filename));
    }

    canRead() {
        return this.exists() && canAccess(this._filename);
    }

    exists() {
        return fs.existsSync(this._filename);
    }

    getName() {
        return this._filename;
    }

    getParentFile() {
        if (this._parent) {
            return this._parent;
        }
        this._parent = new File(path.resolve(this._filename, '..'));
        return this._parent;
    }

    getPath() {
        return this._filename;
    }

    _() {
        if (!this._stat) {
            if (!this.exists()) return false;
            this._stat = fs.statSync(this._filename);
        }
        return this._stat;
    }

    isDirectory() {
        const s = this._();
        return s && s.isDirectory();
    }

    isFile() {
        const s = this._();
        return s && s.isFile();
    }

    mkdirs() {
        return mkdirsSync(this._filename);
    }

    toString() {
        return this._filename
    }
}
