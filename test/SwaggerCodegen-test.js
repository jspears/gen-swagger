import SwaggerCodegen from "../src/SwaggerCodegen";
import {expect} from "chai";
const compare = (to, description) => {
    return function (resp) {
        expect(resp, description).to.eql(to)
    }
};
function execTest(resolve = console.log, reject = console.error) {

    return async function () {
        const ret = await SwaggerCodegen.main(this.test.title.split(' '));
        resolve && resolve(ret || '');

    };

}
describe('SwaggerCodegen', function () {

    it('-h', execTest(compare(`swagger-codegen-cli
Swagger code generator CLI. More info on swagger.io
	config-help     - Config help for chosen lang
	generate        - Generate code with chosen lang
	help            - This helpful message.
	langs           - Shows available langs
	meta            - MetaGenerator. Generator for creating a new template set and configuration for Codegen.  The output will be based on the language you specify, and includes default templates to include.
`)));
    it('--help', execTest(compare(`swagger-codegen-cli
Swagger code generator CLI. More info on swagger.io
	config-help     - Config help for chosen lang
	generate        - Generate code with chosen lang
	help            - This helpful message.
	langs           - Shows available langs
	meta            - MetaGenerator. Generator for creating a new template set and configuration for Codegen.  The output will be based on the language you specify, and includes default templates to include.
`)));

    it('', execTest(compare('Available languages: android,javascript,swift')));
    it('langs', execTest(compare('Available languages: android,javascript,swift')));
    it('config-help -l android', execTest());
    it('config-help -l swift', execTest());
    it('config-help -l javascript', execTest());

    it('generate -l android --output tmp/android/petstore -h  -i ./test/fixtures/petstore.json', execTest());
    it('generate -l android --output tmp/android/petstore  -i ./test/fixtures/uber.json', execTest());


});
