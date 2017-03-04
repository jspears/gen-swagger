import Mustache from "./java/Mustache";
import File from "./java/File";
import {newHashMap} from "./java/javaUtil";
import ServiceLoader from "./java/ServiceLoader";
import FileUtils from "./java/FileUtils";
import {HelpFormatter, Options, BasicParser} from "./java/cli";
import LogFactory from './java/LoggerFactory';
import SupportingFile from './SupportingFile';
/**
 * @deprecated use instead {@link io.swagger.codegen.DefaultGenerator}
 * or cli interface from https://github.com/swagger-api/swagger-codegen/pull/547
 */
import AbstractGenerator from "./AbstractGenerator";

export default class MetaGenerator extends AbstractGenerator {
    config = newHashMap();

    formatter = new HelpFormatter();

    static main(args) {
        return new MetaGenerator().generate(args);
    }

    static getExtensions() {
        return ServiceLoader.load("io.swagger.codegen.CodegenConfig");
    }

    usage(options) {
        this.formatter.printHelp("MetaGenerator. Generator for creating a new template set and configuration for Codegen.  The output will be based on the language you specify, and includes default templates to include.", options);
    }

    getConfig(name) {
        return this.config.get(name);
    }

    getConfigString() {
        if (!this._configString) {
            const extensions = MetaGenerator.getExtensions();
            const names = [];
            for (const config of extensions) {
                names.push(config.getName());
                this.config.put(config.getName(), config);
            }
            this._configString = names.join(', ');
        }
        return this._configString;
    }

    generate(args) {
        let outputFolder = null;
        let name = null;
        let targetPackage = "io.swagger.codegen";
        let templateDir = "codegen";
        let options = new Options();
        options.addOption("h", "help", false, "shows this message");
        options.addOption("l", "lang", false, "client language to generate. Available languages include: [" + this.getConfigString() + "]");
        options.addOption("o", "output", true, "where to write the generated files");
        options.addOption("n", "name", true, "the human-readable name of the generator");
        options.addOption("p", "package", true, "the package to put the main class into (defaults to io.swagger.codegen");
        let cmd = null;
        try {
            const parser = new BasicParser();
            cmd = parser.parse(options, args);
            if (cmd.hasOption("h")) {
                this.usage(options);
                return;
            }
            if (cmd.hasOption("n")) {
                name = cmd.getOptionValue("n");
            }
            else {
                console.info("name is required");
                this.usage(options);
                return;
            }
            if (cmd.hasOption("l")) {
            }
            if (cmd.hasOption("p")) {
                targetPackage = cmd.getOptionValue("p");
            }
            if (cmd.hasOption("o")) {
                outputFolder = cmd.getOptionValue("o");
            }
            else {
                console.info("output folder is required");
                this.usage(options);
                return;
            }
        }
        catch (e) {
            this.usage(options);
            return;
        }
        Log.info("writing to folder " + outputFolder);
        let outputFolderLocation = new File(outputFolder);
        if (!outputFolderLocation.exists()) {
            outputFolderLocation.mkdirs();
        }
        let sourceFolder = new File(outputFolder + File.separator + "src/main/java/" + targetPackage.split('.').join(File.separatorChar));
        if (!sourceFolder.exists()) {
            sourceFolder.mkdirs();
        }
        let resourcesFolder = new File(outputFolder + File.separator + "src/main/resources/META-INF/services");
        if (!resourcesFolder.exists()) {
            resourcesFolder.mkdirs();
        }
        let mainClass = name[0].toUpperCase() + name.substring(1) + "Generator";
        let supportingFiles = [
            new SupportingFile("pom.mustache", "", "pom.xml"),
            new SupportingFile("generatorClass.mustache", "src/main/java/" + File.separator + targetPackage.split('.').join(File.separatorChar), mainClass + ".java"),
            new SupportingFile("README.mustache", "", "README.md"),
            new SupportingFile("api.template", "src/main/resources" + File.separator + name, "api.mustache"),
            new SupportingFile("model.template", "src/main/resources" + File.separator + name, "model.mustache"),
            new SupportingFile("services.mustache", "src/main/resources/META-INF/services", "io.swagger.codegen.CodegenConfig")
        ];
        let files = [];
        let data = newHashMap(
            ["generatorPackage", targetPackage],
            ["generatorClass", mainClass],
            ["name", name],
            ["fullyQualifiedGeneratorClass", targetPackage + "." + mainClass]
        );
        for (const support of supportingFiles) {
            try {
                let destinationFolder = outputFolder;
                if (support.folder != null && !("" === support.folder)) {
                    destinationFolder += File.separator + support.folder;
                }
                let of = new File(destinationFolder);
                if (!of.isDirectory()) {
                    of.mkdirs();
                }
                let outputFilename = destinationFolder + File.separator + support.destinationFilename;
                if (support.templateFile.endsWith(".mustache")) {
                    let template = this.readTemplate(templateDir + File.separator + support.templateFile);
                    let tmpl = Mustache.compiler().withLoader(new TemplateLoader(this, templateDir)).defaultValue("").compile(template);
                    this.writeToFile(outputFilename, tmpl.execute(data));
                    files.add(new File(outputFilename));
                }
                else {
                    let template = this.readTemplate(templateDir + File.separator + support.templateFile);
                    FileUtils.writeStringToFile(new File(outputFilename), template);
                    Log.info("copying file to " + outputFilename);
                    files.add(new File(outputFilename));
                }
            }
            catch (e) {
                Log.trace(e);
            }
        }
    }


}


const Log = LogFactory.getLogger(MetaGenerator);

class TemplateLoader {
    constructor(__parent, templateDir) {
        this.templateDir = templateDir;
        this.__parent = __parent;
    }

    getTemplate(name) {
        return this.__parent.getTemplateReader(this.templateDir + File.separator + name + ".mustache");
    }
}
if (require.main == module) {
    MetaGenerator.main(process.argv);
}