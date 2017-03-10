import SwaggerCodegen from '../src/SwaggerCodegen';
import {expect} from 'chai';

function execTest(resolve, reject) {

    return async function () {
        try {
            const ret = await SwaggerCodegen.main(this.test.title.split(' '));
            resolve(ret);
        } catch (e) {
            reject(e);
        }
    };

}
describe('SwaggerCodegen', function () {

    it('should parse empty', function () {
        const m = SwaggerCodegen.main();
        expect(m).to.eql(`Available languages: android,javascript,swift`);
    });
    it('should take a lang as a command', () => {

        const m = SwaggerCodegen.main(['langs']);

    });
    it('should take a -h as a command', () => {

        let m = SwaggerCodegen.main(['-h']);
        expect(m).to.eql(`Available languages: android,javascript,swift`);
        m = SwaggerCodegen.main(['--help']);
        expect(m).to.eql(`Available languages: android,javascript,swift`);
    });
    it('config-help -l android', () => {
        let m = SwaggerCodegen.main(['config-help', '-l', 'android']);
        console.log(m);
    });

    it('generate -l android --output tmp/android/petstore -h  -i ./test/fixtures/petstore.json', execTest(console.log))
    it('generate -l android --output tmp/android/petstore  -i ./test/fixtures/uber.json', execTest(console.log))

});
