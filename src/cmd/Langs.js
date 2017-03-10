import ServiceLoader from "../java/ServiceLoader";
import {Command} from "../java/cli";
export default class Langs {
    static Usage = new Command({name: "langs", description: "Shows available langs"});

    constructor({help = false}, meta) {
        this.isHelp = help;
        this.meta = meta;
    }

    run() {
        const langs = ServiceLoader.load("io.swagger.codegen.CodegenConfig").map(v => v.getName());

        return "Available languages: " + langs;
    }
}
