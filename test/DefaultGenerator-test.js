import DefaultGenerator from "../src/DefaultGenerator";
import ClientOptInput from "../src/ClientOptInput";
import ClientOpts from "../src/ClientOpts";
import path from "path";
import AndroidClientCodegen from "../src/languages/AndroidClientCodegen";
import JavascriptClientCodegen from "../src/languages/JavascriptClientCodegen";
import SwiftCodegen from "../src/languages/SwiftCodegen";
import Swagger from "../src/java/swagger";
import util from "./support/test-util";


describe('DefaultGenerator', function () {
    const {compare, runBefore, cwd, runAfter} = util(__dirname);

    beforeEach(runBefore);
    afterEach(runAfter);

    function generate(file, configer) {
        const thens = [];
        const f = function () {
            console.log(`Working in ${cwd('.')} using ${file}`);
            const definition = path.join(__dirname, 'fixtures', file);
            let p = Swagger.create({definition}).then(swagger => {
                const config = configer();
                config.setOutputDir(cwd('.'));
                const opts = new ClientOptInput().swagger(swagger).config(config).opts(new ClientOpts());
                const c = new DefaultGenerator();
                const dg = c.opts(opts);
                return dg.generate();
            });
            for (let args of thens) p = p.then(...args);

            return p;
        };
        f.then = (...args) => {
            thens.push(args);
            return f;
        };

        return f;
    }

    it("should generate: android 'uber.json' for 'android'", generate('uber.json', () => new AndroidClientCodegen())
        .then(compare('', 'fixtures/uber/android'))
    );

    it("should generate: android 'uber.json' for 'javascript'", generate('uber.json', () => new JavascriptClientCodegen())
        .then(compare('', 'fixtures/uber/js'))
    );

    it("should generate: android 'uber.json' for 'swift'", generate('uber.json', () => new SwiftCodegen())
        .then(compare('', 'fixtures/uber/swift')));

});
