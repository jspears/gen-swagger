import MetaGenerator from "../src/MetaGenerator";


describe('MetaGenerator', function () {
    it('should help', function () {
        const mg = new MetaGenerator();

        mg.generate(['-h']);
        mg.generate(['--help']);

    });
    it('should generate', function () {
        const mg = new MetaGenerator();

        mg.generate(['-p', 'superduper',
            '-o', 'generated-code/meta',
            '-n', 'SuperDuper',
            '-l', 'Super'
        ]);


    })

});