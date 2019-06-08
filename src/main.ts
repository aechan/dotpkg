import commander from 'commander';
import { CONFIG } from './config';
import cliprogress from 'cli-progress';
import { Installer } from './installer';

class App {
    progressBar: cliprogress.Bar;

    constructor() {
        this.progressBar = new cliprogress.Bar({}, cliprogress.Presets.shades_classic);
    }

    parseArgs() {
        commander.version(CONFIG.version, '-v, --version')
            .option('-h, --help', 'Display help');
        let needHelp = true;
        commander.command('install <pkg>')
            .description('Install given package from GitHub URL or by name.')
            .action((pkg: string) => {
                needHelp = true;
                this.installPkg(pkg);
            });

        commander.parse(process.argv);
        if (needHelp) {
            commander.help();
        }
    }

    private installPkg(pkg: string) {
        const installer = new Installer();
        
        installer.listenToProgress((progress: number) => {
            this.progressBar.update(progress);
            if (progress === 100) {
                this.progressBar.stop();
            }
        });
        
        installer.parseInstall(pkg, () => {
            console.log(`Installing from ${pkg}`);
            this.progressBar.start(100, 0);
        });
    }
}

new App().parseArgs();