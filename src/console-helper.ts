type PromptOptions = {
    message: string,
    defaultValue ?: any,
    terminateOn ?: string,
    validator ?: (string) => boolean,
    format ?: boolean
};

export class ConsoleHelper {
    private stdin;
    private stdout;
    
    constructor(stdin = process.stdin, stdout = process.stdout) {
        this.stdin = stdin;
        this.stdout = stdout;
        stdin.setEncoding("utf8");
        stdin.resume();
    }
    
    private static readonly ESC : string = "\x1B[";
    private static readonly terminalCommands = {
        moveUp: "A",
        moveDown: "B",
        moveLeft: "D",
        moveRight: "C",
        saveCursor: `${ConsoleHelper.ESC}s`,
        restoreCursor: `${ConsoleHelper.ESC}u`,
        eraseToEOL: `${ConsoleHelper.ESC}K`,
    }
    
    moveUp(numRows : number = 1) : void {
        this.stdout.write(`${ConsoleHelper.ESC}${numRows}${ConsoleHelper.terminalCommands.moveUp}`);
    }
    
    moveLeft(numRows : number = 1) : void {
        this.stdout.write(`${ConsoleHelper.ESC}${numRows}${ConsoleHelper.terminalCommands.moveLeft}`)
    }
    
    eraseToEOL() : void {
        this.stdout.write(ConsoleHelper.terminalCommands.eraseToEOL);
    }
    
    saveCursor() : void {
        this.stdout.write(ConsoleHelper.terminalCommands.saveCursor);
    }
    
    restoreCursor() : void {
        this.stdout.write(ConsoleHelper.terminalCommands.restoreCursor);
    }
    
    async prompt(message : string, defaultValue : any) : Promise<any>;
    async prompt(options : PromptOptions) : Promise<any>;
    async prompt(optionsOrMessage : string | PromptOptions, defaultValue ?: any) : Promise<any> {
        let options : PromptOptions;
        let defaults : PromptOptions = {
            message: "",
            defaultValue: undefined,
            terminateOn: "\n",
            validator: () => true,
            format: true
        };
                
        if (typeof optionsOrMessage == "string") {
            options = {message: optionsOrMessage};
        } else {
            options = optionsOrMessage;
        }

        for (let option in defaults) {
            if (!options.hasOwnProperty(option)) {
                options[option] = defaults[option];
            }
        }
        
        let promptMessage : string;
        if (options.defaultValue === undefined) {
            promptMessage = `${options.message}: `;
        } else {
            promptMessage = `${options.message} [${options.defaultValue}]: `;
        }

        if (options.format == false) {
            promptMessage = options.message;
        }
        
        this.stdout.write(promptMessage);
        
        return new Promise<any>((resolve) => {
            let buf = [];
            let dataHandler = (data : string) => {
                if (data.indexOf(options.terminateOn) < 0) {
                    buf.push(data)
                } else {
                    data = data.substring(0, data.indexOf(options.terminateOn));
                    buf.push(data);
                    let result : string = buf.join("");
                    if (result == "" && options.defaultValue != undefined) {
                        this.stdin.removeListener("data", dataHandler);
                        resolve(options.defaultValue);
                        return;
                    }
                    if (options.validator(result)) {
                        this.stdin.removeListener("data", dataHandler);
                        resolve(result);
                        return;
                    } else {
                        buf = [];
                        this.stdin.pause()
                        this.stdout.write(`That response (${result}) is invalid.\n`);
                        this.stdout.write(promptMessage);
                        this.stdin.resume()
                    }
                }
            }
            this.stdin.on("data", dataHandler);
        });
    }
    
    //keep options to one digit
    async menu(title : string, options : string[], defaultValue ?: number) {
        this.stdout.write(`  | ${title}\n`);
        this.stdout.write(`--|-------------------------\n`);
        for (let option : number = 0; option < options.length; option++) {
            this.stdout.write(`${option + 1} | ${options[option]}\n`);
        }
        this.stdout.write("\n");
        let validator : (string)=>boolean = (response : string) => !Number.isNaN(+response) && +response <= options.length;
        return +await this.prompt({
            message: "Selection",
            defaultValue: defaultValue == undefined ? undefined : defaultValue.toString(),
            terminateOn: "\n",
            validator: validator
        }) - 1;
    }

}
