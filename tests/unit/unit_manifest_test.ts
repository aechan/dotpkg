import 'mocha';
import { expect } from 'chai';
import { Manifest } from '../../src/manifest';

describe('Manifest Unit Tests', () => {
    it('Should fail on undefined or null', () => {
        const manifest = new Manifest(undefined);
        expect(manifest.valid).to.be.false;
        const manifest2 = new Manifest(null);
        expect(manifest2.valid).to.be.false;
    });

    it('Should properly parse all properties of valid manifest', () => {
        const data = {
            name: 'Test manifest',
            author: 'Alec Chan',
            version: '0.0.1',
            filemap: [
                {
                    relativePath: "./dots/testFile",
                    localPath: "~/.bashrc"
                }
            ]
        }
        const manifest = new Manifest(data);
        expect(manifest.valid).to.be.true;
        expect(manifest.author).to.be.equal(data.author);
        expect(manifest.name).to.be.equal(data.name);
        expect(manifest.version).to.be.equal(data.version);
        expect(manifest.filemap[0]).to.be.equal(data.filemap[0]);
    });
});