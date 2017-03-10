import SwaggerCodegen from "../src/SwaggerCodegen";
import {expect} from "chai";

function execTest(resolve, reject) {

    return async function () {
        try {
            const ret = await SwaggerCodegen.main(this.test.title.split(' '));
            resolve && resolve(ret);
        } catch (e) {
            reject && reject(e);
        }
    };

}
describe('SwaggerCodegen', function () {

    it('should parse empty', async function () {
        const m = await  SwaggerCodegen.main();
        expect(m).to.eql(`Available languages: android,javascript,swift`);
    });
    it('should take a lang as a command', async() => {

        const m = await SwaggerCodegen.main(['langs']);

    });
    it('should take a -h as a command', async() => {

        let m = await SwaggerCodegen.main(['-h']);
        expect(m).to.eql(`swagger-codegen-cli
Swagger code generator CLI. More info on swagger.io
	config-help     - Config help for chosen lang
	generate        - Generate code with chosen lang
	help            - This helpful message.
	langs           - Shows available langs
	meta            - MetaGenerator. Generator for creating a new template set and configuration for Codegen.  The output will be based on the language you specify, and includes default templates to include.
`);
        m = await SwaggerCodegen.main(['--help']);
        expect(m).to.eql(`swagger-codegen-cli
Swagger code generator CLI. More info on swagger.io
	config-help     - Config help for chosen lang
	generate        - Generate code with chosen lang
	help            - This helpful message.
	langs           - Shows available langs
	meta            - MetaGenerator. Generator for creating a new template set and configuration for Codegen.  The output will be based on the language you specify, and includes default templates to include.
`);
    });
    it('config-help -l android', () => {
        let m = SwaggerCodegen.main(['config-help', '-l', 'android']);
        console.log(m);
    });

    it('generate -l android --output tmp/android/petstore -h  -i ./test/fixtures/petstore.json', execTest(console.log, console.trace));
    //   it('generate -l android --output tmp/android/petstore  -i ./test/fixtures/uber.json', execTest(console.log));

});
