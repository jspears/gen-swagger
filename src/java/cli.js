import StringBuilder from '../java/StringBuilder';
import pad from 'lodash/padEnd';
import camelCase from 'lodash/camelCase';
const SORT_CMDS = (a, b) => a.Usage.name.localeCompare(b.Usage.name);
const SORT_OPTS = (b, a) => {
    if (a.required && !b.required) {
        return 1;
    }
    if (b.required && !a.required) {
        return -1;
    }
    let ret = a.name[0].replace(PREFIX, '').localeCompare(b.name[0].replace(PREFIX, ''));
    if (ret == 0 && a.name.length > 1) {
        if (b.name.length < 2)return 1;
        ret = a.name[1].repalce(PREFIX, '').localeCompare(b.name[1].replace(PREFIX, ''));
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
}
export class CommandUsage {
    constructor(values, meta, cmd) {
        this.values = values;
        this.cmd = cmd;
        this.meta = meta;
    }

    run() {
        const {name, options, description} = this.cmd.Usage;
        const {values} = this;
        let str = `Command ${name} has the following options:\n${description}`;
        for (const opt of options.sort(SORT_OPTS)) {
            const property = opt.property || camelCase(values[opt.title]);
            const value = (values[property] || opt.title);
            const short = opt.name.length > 1 ? opt.name[0] : '';
            const long = opt.name.length > 1 ? opt.name[1] : opt.name[0];
            str = `${str}
\t${pad(opt.required ? '* ' : '', 2)}${pad(short, 5)} ${pad(long, 25)} ${pad(opt.hasArg ? `[${value}]` : '', 20)}\v${opt.description}`
        }
        return str;
    }
}

export class Help {
    static Usage = new Command({name: "help", description: "This helpful message."}, []);

    constructor(values, opts) {
        this.values = values;
        this.opts = opts;
    }

    run() {
        const {name, description, commands = []} = this.opts;
        console.log(`${name}\n${description}`);
        for (const cmd of commands.sort(SORT_CMDS)) {
            console.log(`\t${pad(cmd.Usage.name, 20)} - ${cmd.Usage.description}`);
        }
    }
}
class CliError extends Error {
    constructor(message, cmd, opt) {
        super(message);
        this.cmd = cmd;
        this.opt = opt;
    }
}
class CommandErrorHandler {
    constructor(values, meta, cmd) {
        this.values = values;
        this.meta = meta;
        this.cmd = cmd;
    }

    handle(message) {
        if (this.meta.commandUsage) {
            const help = new this.meta.commandUsage(this.values, this.meta).run();
            throw new CliError(`${message}\n${help}`);
        }
    }
}
export class Cli {
    static builder(name) {
        const opts = {name, commandHelp: Help, commandUsage: CommandUsage, commandErrorHandler: CommandErrorHandler};
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
            withCommandsHelp(commandHelp){
                opts.commandHelp = commandHelp;
                return w;
            },
            withCommandUsage(commandUsage){
                opts.commandUsage = commandUsage;
                return w;
            },
            withCommandErrorHandler(errorHandler){
                opts.commandErrorHandler = errorHandler;
                return w;
            },
            build(){
                return {
                    parse(args = []){
                        const isHelp = args.indexOf('-h') > -1 || args.indexOf('--help') > -1;

                        const values = {};
                        let Command = opts.defaultCommand;
                        for (const c of opts.commands) {
                            if (c.Usage.name === args[0]) {
                                Command = c;
                                break;
                            }
                        }
                        if (!Command) {
                            new opts.commandErrorHandler(values, opts, Command).handle(args.length ? `Unknown Command  ${args[0]}` : 'No Command given');
                        }
                        if (isHelp && Command == opts.defaultCommand) {
                            return new opts.commandHelp(values, opts).run();
                        }
                        for (const opt of Command.Usage.options) {
                            let _check;
                            let idx;
                            NAMES: for (const name of opt.name) {
                                idx = args.indexOf(name);
                                if (idx > -1) {
                                    _check = opt;
                                    break NAMES;
                                }
                            }
                            if (_check) {
                                const property = opt.property || camelCase(opt.title);
                                if (_check.hasArg) {
                                    if (idx + 1 > args.length) {
                                        return new opts.commandErrorHandler(values, opts, Command).handle(`${_check.name} requires a value`);

                                    }
                                    values[property] = args[idx + 1];
                                } else {
                                    values[property] = true;
                                }
                            } else {
                                if (opt.required) {
                                    new opts.commandErrorHandler(values, opts, Command).handle(`${args[0]} requires a option for ${opt.description}`);
                                }
                            }
                        }
                        if (isHelp) {
                            return new opts.commandUsage(values, opts, Command).run();
                        }

                        return new Command(values, opts).run();
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

    /**  OptionType type() default OptionType.COMMAND;

     String title() default "";

     String[] name();

     String description() default "";

     boolean required() default false;

     int arity() default -2147483648;

     boolean hidden() default false;

     String[] allowedValues() default {};**/
    add({name:[short, long], title, description, has, arg, required, allowedValues}) {
        this.options.push({
            short,
            long,
            title,
            message: description,
            required,
            allowedValues
        })
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
