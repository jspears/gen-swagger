import DefaultGenerator from "../src/DefaultGenerator";
import ClientOptInput from "../src/ClientOptInput";
import ClientOpts from "../src/ClientOpts";
import path from "path";
import AndroidClientCodegen from "../src/languages/AndroidClientCodegen";
import Swagger from "../src/java/swagger";

function generate(file) {
    return async function () {
        console.log('Using File', file);
        const definition = path.join(__dirname, 'fixtures', file);
        const swagger = await Swagger.create({definition});

        const config = new AndroidClientCodegen();
        config.setTemplateDir(path.join(__dirname, '..', 'resources'));
        const opts = new ClientOptInput().swagger(swagger).config(config).opts(new ClientOpts());
        const c = new DefaultGenerator();
        const dg = c.opts(opts);
        dg.generate()

    }
}
describe('DefaultGenerator', function () {


//    it("should generate: android 'petstore-minimal.json'", generate('petstore-minimal.json'));
    it("should generate: android 'uber.json'", generate('uber.json'));

});
