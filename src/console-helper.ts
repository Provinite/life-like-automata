/**
* Options object type for use with `ConsoleHelper.prompt`
*/
type PromptOptions = {
    /**
    * The message to prompt the user with.
    */
    message: string,
    
    /**
    * The default value to return if no input is given.
    */
    defaultValue ?: any,
    
    /**
    * The character to stop reading input on. Defaults to `"\n"`
    */
    terminateOn ?: string,
    
    /**
    * Validator function to approve or reject responses. This will be called
    * each time the user submits a response. Defaults to `() => true` (approve all).
    * If the response is judged invalid, the user will be prompted again. 
    */
    validator ?: (string) => boolean,
    
    /**
    * Flag to indicate whether the prompt should be formatted.
    * If true, the prompt will be displayed as `message: ` or `message [defaultValue]: `
    * If false, the prompt will be exactly `message`
    * Defaults to `true`
    */
    format ?: boolean
};

/**
* Console Helper class designed to assist in interactive console application development
* @author Collin Driscoll
*/
export class ConsoleHelper {
    /**
    * ReadStream from which user input is read.
    */
    private stdin : NodeJS.ReadStream;
    /**
    * WriteStream upon which output is written.
    */
    private stdout : NodeJS.WriteStream;
    
    /**
    * Creates a new ConsoleHelper and sets the specified `stdin` to flowing mode.
    * @param {ReadStream} stdin - The stream from which user input should be gathered.
    * @param {WriteStream} stdout - The stream to which output should be sent.
    */
    constructor(stdin = process.stdin, stdout = process.stdout) {
        this.stdin = stdin;
        this.stdout = stdout;
        stdin.setEncoding("utf8");
        stdin.resume();
    }
    
    /**
    * TTY escape sequence constant.
    */
    private static readonly ESC : string = "\x1B[";
    
    /**
    * Some constants to improve readability when sending escape sequences.
    */
    private static readonly terminalCommands = {
        moveUp: "A",
        moveDown: "B",
        moveLeft: "D",
        moveRight: "C",
        eraseToEOL: `${ConsoleHelper.ESC}K`,
    }
    
    /**
    * Moves the TTY cursor up the specified number of rows
    * @param {number} numRows - The number of rows to move the cursor upward.
    */
    moveUp(numRows : number = 1) : void {
        this.stdout.write(`${ConsoleHelper.ESC}${numRows}${ConsoleHelper.terminalCommands.moveUp}`);
    }
    
    /**
    * Moves the TTY cursor left the specified number of columns
    * @param {number} numCols - The number of columns to move the cursor left.
    */
    moveLeft(numCols : number = 1) : void {
        this.stdout.write(`${ConsoleHelper.ESC}${numCols}${ConsoleHelper.terminalCommands.moveLeft}`)
    }
    
    /**
    * Erases all text from the cursor to the end of the current line
    */
    eraseToEOL() : void {
        this.stdout.write(ConsoleHelper.terminalCommands.eraseToEOL);
    }
    
    /**
    * Prompts the user with a given message and default value (if provided) and
    * return the response. @see PromptOptions for configuration details.
    * @param {string} message - The message to prompt with.
    * @param {any} defaultValue - The default value to return if no input is given.
    * @param {PromptOptions} options - @see PromptOptions documentation for details.
    * @returns A promise which will resolve with the response once user interaction is complete.
    */
    async prompt(message : string, defaultValue ?: any) : Promise<any>;
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
            options = {
                message: optionsOrMessage,
                defaultValue : defaultValue
            };
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
    
    /**
    * Simple helper method to display a menu and allow a user to select from several choices
    * Formatting is very basic, so displaying more than 9 menu options will look bad.
    * User will be re-prompted on an invalid selection.
    * @param {string} title - The name of the menu (displayed along the top row).
    * @param {string[]} options - The choices to present to the user.
    * @param {number} defaultValue - The index of the default option.
    * @returns A promise which will resolve to the index of the selected option once user interactino is complete.
    */
    async menu(title : string, options : string[], defaultValue ?: number) : Promise<number> {
        this.stdout.write(`  | ${title}\n`);
        this.stdout.write(`--|-------------------------\n`);
        for (let option : number = 0; option < options.length; option++) {
            this.stdout.write(`${option + 1} | ${options[option]}\n`);
        }
        this.stdout.write("\n");
        let validator : (string)=>boolean = (response : string) => !Number.isNaN(+response) && +response <= options.length;
        return +await this.prompt({
            message: "Selection",
            defaultValue: defaultValue,
            terminateOn: "\n",
            validator: validator
        }) - 1;
    }

}
