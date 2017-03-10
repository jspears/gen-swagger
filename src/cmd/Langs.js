import ServiceLoader from "../java/ServiceLoader";
import {Command, Help} from '../java/cli';
export default class Langs {
    static Usage = new Command({name: "langs", description: "Shows available langs"}, [
        {name: ["-h", "--help"], title: "help", description: "verbose mode"}
    ]);


    run() {
        const langs = ServiceLoader.load("io.swagger.codegen.CodegenConfig").map(v => v.getName());
        return "Available languages: " + langs;
    }
}
