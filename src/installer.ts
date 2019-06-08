import { Clone } from 'nodegit';
import { CONFIG } from './config';
import { Manifest } from './manifest';

import mkdirp from 'mkdirp';
import path from 'path';
import fs from 'fs';

type progressListener = (progress: number) => void;

export class Installer {
    private gitRegex: RegExp = /(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/;
    private tempDirName: string = '.temp';
    private tempPath: string = path.join(CONFIG.installPath, this.tempDirName);
    private manifest?: Manifest;
    private progressListeners: progressListener[];

    constructor() {
        this.testInstallPath();
        this.progressListeners = [];
    }

    public parseInstall(pkg: string, successCb: () => void) {
        if (this.gitRegex.test(pkg)) {
            successCb();
            this.installRepo(pkg);
        } else {
            console.error("Could not parse package identifier!");
            process.exit(-1);
        }
    }

    public listenToProgress(listener: progressListener) {
        this.progressListeners.push(listener);
    }

    private updateProgressListeners(progress: number) {
        this.progressListeners.forEach((lis) => {
            lis(progress);
        });
    }

    private installRepo(repo: string) {
        Clone.clone(repo, this.tempPath).then((repo) => {
            this.updateProgressListeners(30);
            this.manifest = Manifest.parseManifest(fs.readFileSync(path.join(this.tempPath, 'ricemanifest.json')));
            this.updateProgressListeners(35);
            if (this.manifest.valid) {
                this.doLocalInstall();
            }
        });
    }

    private doLocalInstall() {
        if (!this.manifest) return false;
        const pkgPath = path.join(CONFIG.installPath, this.manifest.name);
        fs.mkdirSync(pkgPath);
        this.updateProgressListeners(50);
        fs.renameSync(this.tempPath, pkgPath);
        this.updateProgressListeners(75);
        this.linkFileMap();
    }

    private linkFileMap() {
        this.updateProgressListeners(100);
    }

    private testInstallPath() {
        mkdirp(CONFIG.installPath, (err) => {
            if (err) {
                console.error(`Could not create or access configured install path: ${CONFIG.installPath}`);
                console.error(err);
                process.exit(-1);
            }
        });
    }
}