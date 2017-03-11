import camelCase from "lodash/camelCase";
import pad from "lodash/padEnd";

const SORT_CMDS = (a, b) => a.Usage.name.localeCompare(b.Usage.name);
const SORT_OPTS = (b, a) => {
    let ret = a.name[0].replace(PREFIX, '').localeCompare(b.name[0].replace(PREFIX, ''));
    if (ret === 0 && (a.name.length > 1 && b.name.length > 1)) {
        ret = a.name[1].replace(PREFIX, '').localeCompare(b.name[1].replace(PREFIX, ''));
    }
    if (ret == 0) {
        ret = a.name.length - b.name.length;
    }
    return ret;
};

const PREFIX = /^-+?/;
export class Command {
    constructor({name, description}, options = []) {
        this.name = name;
        this.description = description;
        this.options = options;
    }

    help(values) {
        let str = `${this.name}\n${this.description}\n`;
        for (const {name, title, required, hasArg, description, property} of this.options.sort(SORT_OPTS)) {
            const val = values[property] || values[camelCase(name)] || 'value';

            str += `\t${pad(name[0], 5)} ${pad(name[1], 20)} ${pad(required ? `[${val}]` : hasArg ? `<${val}>` : 'bool', 30)}\v ${description}\n`
        }
        return str;
    }
}
export class Help {
    static Usage = new Command({name: "help", description: "This helpful message."}, []);

    constructor(values, globalMeta) {
        this.values = values;
        this.meta = globalMeta;
    }

    run() {
        let str = `${this.meta.name}\n${this.meta.description}\n`;
        for (const cmd of this.meta.commands.sort(SORT_CMDS)) {
            str += `\t${pad(cmd.Usage.name, 15)} - ${cmd.Usage.description}\n`;
        }
        return str;
    }
}
class CliError extends Error {
    constructor(message, cmd, opt) {
        super(message);
        this.cmd = cmd;
        this.opt = opt;
    }
}
export class Cli {
    static builder(name) {
        const opts = {name};
        const w = {
            withDescription(description){
                opts.description = description;
                return w;
            },
            withDefaultCommand(command){
                opts.defaultCommand = command;
                return w;
            },
            withCommands(...commands){
                opts.commands = commands;
                return w;
            },
            build(){
                return {
                    async parse(args = []){
                        const values = {};
                        const isHelp = args.indexOf('-h') > -1 || args.indexOf("--help") > -1;

                        if (args.length == 0 || (args.length === 1 && isHelp)) {
                            return new Help(values, opts).run();
                        }

                        let Command = opts.defaultCommand;

                        for (const c of opts.commands) {
                            if (c.Usage.name === args[0]) {
                                Command = c;
                                break;
                            }
                        }
                        if (!Command) {
                            throw new CliError(args.length ? `Unknown Command  ${args[0]}` : 'No Command given');
                        }
                        for (const opt of Command.Usage.options) {
                            let _check;
                            let idx;
                            for (const name of opt.name) {
                                idx = args.indexOf(name);
                                if (idx > -1) {
                                    _check = opt;
                                    break;
                                }
                            }
                            if (_check) {
                                const property = opt.property || camelCase(opt.title);
                                if (_check.hasArg) {
                                    if (idx + 1 > args.length) {
                                        throw new CliError(`${_check.name} requires a value`, Command, opt, values);
                                    }
                                    values[property] = args[idx + 1];
                                } else {
                                    values[property] = true;
                                }
                            } else {
                                if (opt.required) {
                                    throw new CliError(`${args[0]} requires a option for ${opt.name[0]}`, Command, opt, values);
                                }
                            }
                        }

                        if (isHelp) {
                            return Command.Usage.help(values, opts);
                        }
                        return await new Command(values, opts).run();
                    }
                }
            }
        };
        return w;
    }
}


export class Options {
    options = [];
    parser = new BasicParser(this);

    parse(args) {
        return this.parser.parse(args);

    }

    addOption(short, long, hasArg = false, message = '') {
        long = long || short;
        this.options.push({short, long, hasArg, message});
    }
}


export class HelpFormatter {
    formatHelp(help, options = {options: []}) {
        help = help.split('.\n').join('\n');

        help += '\n';
        for (const {short = '', long = '', hasArg = false, message = ''} of options.options) {
            const pshort = pad(short ? `-${short}` : '', 3);
            const plong = pad(long ? `--${long}` : '', 12);
            const parg = pad(hasArg ? `[${long}]` : '', 20);
            help += `\t\v${pshort}\t${plong}\t${parg}\t${message}\n`;
        }
        return help;
    }

    printHelp(message, options) {
        console.error(this.formatHelp(message, options));
    }
}

export class BasicParser {
    values = {};
    formatter = new HelpFormatter();

    constructor(Options) {
        this.options = Options;
    }

    usage() {
        this.formatter.printHelp("MetaGenerator. Generator for creating a new template set and configuration for Codegen.  The output will be based on the language you specify, and includes default templates to include.", this.options);
    }

    parse(args) {
        for (const {short, long, hasArg, message} of this.options.options) {
            let idx = args.indexOf(`-${short}`);
            if (idx < 0) idx = args.indexOf(`--${long}`);
            if (idx < 0) continue;
            let val = true;
            if (hasArg) {
                if (idx + 1 > args.length) {
                    throw new Error(`${long} needs an argument: ${message}`)
                }
                val = args[idx + 1];
            }

            this.values[long] = this.values[short] = val;
        }
        return this;
    }

    static parse(options, args) {
        return new BasicParser(options).parse(args);
    }

    getOptionValue(k) {
        return this.values[k];
    }

    hasOption(short) {
        return (short in this.values)
    }

}
