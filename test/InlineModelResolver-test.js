import InlineModelResolver from "../src/InlineModelResolver";
import Swagger from "../src/java/Swagger";
import path from "path";

describe('InlineModelResolver', function () {
    it('should flatten', async function () {
        const definition = path.join(__dirname, 'fixtures', 'uber.json');
        const swagger = await Swagger.create({definition});
        const imr = new InlineModelResolver();
        imr.flatten(swagger);
        console.log('img', imr);
        const defs = swagger.getDefinitions();

        console.log(JSON.stringify(defs, null, 2));
    });
});