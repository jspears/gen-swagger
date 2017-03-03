import Mustache from "./java/Mustache";
import StringBuilder from './java/StringBuilder';

import File from "./java/File";
import {ArrayList} from "./java/javaUtil";
import {HashMap} from "./java/javaUtil";
import ServiceLoader from './java/ServiceLoader';
import FileUtils from './java/FileUtils'

/**
 * @deprecated use instead {@link io.swagger.codegen.DefaultGenerator}
 * or cli interface from https://github.com/swagger-api/swagger-codegen/pull/547
 */
import AbstractGenerator from './AbstractGenerator';
import {Options, BasicParser} from './java/cli';

export default class MetaGenerator extends AbstractGenerator {
    static config = newHashMap();

    static main(args) {
        return new MetaGenerator().generate(args);
    }

    static getExtensions() {
        let loader = ServiceLoader.load("io.swagger.codegen.CodegenConfig");
        let output = []
        for (const load of loader) {
            output.push(load);
        }
        return output;
    }

    static usage(options) {
        // let formatter = new HelpFormatter();
        //formatter.printHelp("MetaGenerator. Generator for creating a new template set and configuration for Codegen.  The output will be based on the language you specify, and includes default templates to include.", options);
    }

    static getConfig(name) {
        if (MetaGenerator.config.containsKey(name)) {
            return MetaGenerator.config.get(name);
        }
        return null;
    }

    generate(args) {
        let outputFolder = null;
        let name = null;
        let targetPackage = "io.swagger.codegen";
        let templateDir = "codegen";
        let options = new Options();
        options.addOption("h", "help", false, "shows this message");
        options.addOption("l", "lang", false, "client language to generate.\nAvailable languages include:\n\t[" + MetaGenerator.configString + "]");
        options.addOption("o", "output", true, "where to write the generated files");
        options.addOption("n", "name", true, "the human-readable name of the generator");
        options.addOption("p", "package", true, "the package to put the main class into (defaults to io.swagger.codegen");
        let cmd = null;
        try {
            let parser = new BasicParser();
            cmd = parser.parse(options, args);
            if (cmd.hasOption("h")) {
                MetaGenerator.usage(options);
                return;
            }
            if (cmd.hasOption("n")) {
                name = cmd.getOptionValue("n");
            }
            else {
                console.info("name is required");
                MetaGenerator.usage(options);
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
                MetaGenerator.usage(options);
                return;
            }
        }
        catch (e) {
            MetaGenerator.usage(options);
            return;
        }
        ;
        MetaGenerator.Log().info("writing to folder " + outputFolder);
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
        let mainClass = javaemul.internal.CharacterHelper.toUpperCase(name.charAt(0)) + name.substring(1) + "Generator";
        let supportingFiles = (new ArrayList());
        supportingFiles.add(new codegen.SupportingFile("pom.mustache", "", "pom.xml"));
        supportingFiles.add(new codegen.SupportingFile("generatorClass.mustache", "src/main/java/" + File.separator + targetPackage.split('.').join(File.separatorChar), mainClass + ".java"));
        supportingFiles.add(new codegen.SupportingFile("README.mustache", "", "README.md"));
        supportingFiles.add(new codegen.SupportingFile("api.template", "src/main/resources" + File.separator + name, "api.mustache"));
        supportingFiles.add(new codegen.SupportingFile("model.template", "src/main/resources" + File.separator + name, "model.mustache"));
        supportingFiles.add(new codegen.SupportingFile("services.mustache", "src/main/resources/META-INF/services", "io.swagger.codegen.CodegenConfig"));
        let files = (new ArrayList());
        let data = (new HashMap());
        data.put("generatorPackage", targetPackage);
        data.put("generatorClass", mainClass);
        data.put("name", name);
        data.put("fullyQualifiedGeneratorClass", targetPackage + "." + mainClass);
        for (let index257 = supportingFiles.iterator(); index257.hasNext();) {
            let support = index257.next();
            {
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
                    if (((str, searchString) => {
                            let pos = str.length - searchString.length;
                            let lastIndex = str.indexOf(searchString, pos);
                            return lastIndex !== -1 && lastIndex === pos;
                        })(support.templateFile, "mustache")) {
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


}
(function () {
    let extensions = MetaGenerator.getExtensions();
    let sb = new StringBuilder();
    for (const config of extensions) {

        if (sb.toString().length !== 0) {
            sb.append(", ");
        }
        sb.append(config.getName());
        MetaGenerator.config.put(config.getName(), config);
    }
    MetaGenerator.configString = sb.toString();
})();

class TemplateLoader {
    constructor(__parent, templateDir) {
        this.templateDir = templateDir;
        this.__parent = __parent;
    }

    getTemplate(name) {
        return this.__parent.getTemplateReader(this.templateDir + File.separator + name + ".mustache");
    }
}
