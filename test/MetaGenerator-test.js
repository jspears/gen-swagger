import MetaGenerator from "../src/MetaGenerator";
import util from "./support/test-util";


describe('MetaGenerator', function () {
    const {
        runBefore, runAfter, cwd
    } = util(__dirname);

    before(runBefore);
    after(runAfter);

    it('should help', function () {

        MetaGenerator.main(['-h']);
        MetaGenerator.main(['--help']);

    });
    it('should generate', function () {
        const mg = MetaGenerator.main(['-p', 'superduper',
            '-o', cwd(),
            '-n', 'SuperDuper',
            '-l', 'Super'
        ]);
    });

});
