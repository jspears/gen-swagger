import MetaGenerator from "../src/MetaGenerator";


describe('MetaGenerator', function () {
    it('should help', function () {
        MetaGenerator.main(['-h']);
        MetaGenerator.main(['--help']);

    });
    it('should generate', function () {
        const mg = MetaGenerator.main(['-p', 'superduper',
            '-o', 'generated-code/meta',
            '-n', 'SuperDuper',
            '-l', 'Super'
        ]);


    })

});