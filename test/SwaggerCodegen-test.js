import SwaggerCodegen from '../src/SwaggerCodegen';
import {expect} from 'chai';

function execTest(resolve=console.log, reject=console.error) {

    return async function () {
        try {
            const ret = await SwaggerCodegen.main(this.test.title.split(' '));
            resolve && resolve(ret || '');
        } catch (e) {
            reject && reject(e);
        }
    };

}
describe('SwaggerCodegen', function () {

    it('should parse empty', execTest());
    it('langs', execTest());
    it('-h', execTest());
    it('config-help -l android', execTest());
    it('config-help -l swift', execTest());
    it('config-help -l javascript', execTest());

    it('generate -l android --output tmp/android/petstore -h  -i ./test/fixtures/petstore.json', execTest());
    it('generate -l android --output tmp/android/petstore  -i ./test/fixtures/uber.json', execTest());

});
