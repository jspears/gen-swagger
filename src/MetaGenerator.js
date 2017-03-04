import Mustache from "./java/Mustache";
import File from "./java/File";
import {newHashMap} from "./java/javaUtil";
import ServiceLoader from "./java/ServiceLoader";
import FileUtils from "./java/FileUtils";
import {Options} from "./java/cli";
import LogFactory from "./java/LoggerFactory";
import SupportingFile from "./SupportingFile";
/**
 * @deprecated use instead {@link io.swagger.codegen.DefaultGenerator}
 * or cli interface from https://github.com/swagger-api/swagger-codegen/pull/547
 */
import AbstractGenerator from "./AbstractGenerator";

export default class MetaGenerator extends AbstractGenerator {

    static main(args) {
        const options = new Options();
        options.addOption("h", "help", false, "shows this message");
        options.addOption("l", "lang", false, "client language to generate. Available languages include: [" + MetaGenerator.getConfigString() + "]");
        options.addOption("o", "output", true, "where to write the generated files");
        options.addOption("n", "name", true, "the human-readable name of the generator");
        options.addOption("p", "package", true, "the package to put the main class into (defaults to io.swagger.codegen");
        const cmd = options.parse(args);
        if (cmd.hasOption("h")) {
            cmd.usage();
            return;
        }
        let opts = {};
        if (cmd.hasOption("n")) {
            opts.name = cmd.getOptionValue("n");
        } else {
            cmd.usage("name is required");
            return;
        }
        if (cmd.hasOption("p")) {
            opts.targetPackage = cmd.getOptionValue("p");
        }
        if (cmd.hasOption("o")) {
            opts.outputFolder = cmd.getOptionValue("o");
        }
        else {
            console.info("output folder is required");
            cmd.usage();
            return;
        }
        return new MetaGenerator().generate(opts);
    }

    static getExtensions() {
        return ServiceLoader.load("io.swagger.codegen.CodegenConfig");
    }


    static getConfigString() {
        if (!this._configString) {
            const extensions = MetaGenerator.getExtensions();
            const names = [];
            for (const config of extensions) {
                names.push(config.getName());
            }
            this._configString = names.join(', ');
        }
        return this._configString;
    }

    generate({name, targetPackage = "io.swagger.codegen", outputFolder}) {
        let templateDir = "codegen";
        Log.info("writing to folder " + outputFolder);

        const sourceFolder = new File(outputFolder, "src", "main", "java/", ...targetPackage.split('.'));
        if (!sourceFolder.exists()) {
            sourceFolder.mkdirs();
        }
        const resourcesFolder = new File(outputFolder, "src/main/resources/META-INF/services");
        if (!resourcesFolder.exists()) {
            resourcesFolder.mkdirs();
        }
        const mainClass = name[0].toUpperCase() + name.substring(1) + "Generator";
        const supportingFiles = [
            new SupportingFile("pom.mustache", "", "pom.xml"),
            new SupportingFile("generatorClass.mustache", "src/main/java/" + File.separator + targetPackage.split('.').join(File.separatorChar), mainClass + ".java"),
            new SupportingFile("README.mustache", "", "README.md"),
            new SupportingFile("api.template", "src/main/resources" + File.separator + name, "api.mustache"),
            new SupportingFile("model.template", "src/main/resources" + File.separator + name, "model.mustache"),
            new SupportingFile("services.mustache", "src/main/resources/META-INF/services", "io.swagger.codegen.CodegenConfig")
        ];
        const files = [];
        const data = newHashMap(
            ["generatorPackage", targetPackage],
            ["generatorClass", mainClass],
            ["name", name],
            ["fullyQualifiedGeneratorClass", targetPackage + "." + mainClass]
        );
        for (const support of supportingFiles) {
            try {
                const outputFilename = new File(outputFolder, support.folder, support.destinationFilename);
                const templateFile = new File(templateDir, support.templateFile).getPath();
                if (support.templateFile.endsWith(".mustache")) {
                    const template = this.readTemplate(templateFile);
                    const tmpl = Mustache.compiler().withLoader(new TemplateLoader(this, templateDir)).defaultValue("").compile(template);
                    this.writeToFile(outputFilename, tmpl.execute(data));
                    files.push(outputFilename);
                }
                else {
                    const template = this.readTemplate(templateFile);
                    FileUtils.writeStringToFile(outputFilename, template);
                    Log.info("copying file to " + outputFilename);
                    files.push(outputFilename);
                }
            }
            catch (e) {
                Log.trace(e);
            }
        }
        return this;
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