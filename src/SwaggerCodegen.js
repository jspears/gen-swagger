#!/usr/bin/env node
import ConfigHelp from './cmd/ConfigHelp';
import Generate from './cmd/Generate';
import Langs from './cmd/Langs';
import Meta from './cmd/Meta';
import {Cli, Help} from './java/cli';
/**
 * <p>
 * Command line interface for swagger codegen
 * use `swagger-codegen-cli.jar help` for more info
 *
 * @since 2.1.3-M1
 */
export default class SwaggerCodegen {
    static main(args) {
        let builder = Cli.builder("swagger-codegen-cli").withDescription("Swagger code generator CLI. More info on swagger.io").withDefaultCommand(Langs).withCommands(Generate, Meta, Langs, Help, ConfigHelp);
        return builder.build().parse(args);
    }
}
if (require.main === module) {
    SwaggerCodegen.main(process.argv.slice(2)).then(console.log)
}