
const {Transform} = require('stream');
const ts = require('typescript');

const defaultCompilerOptions = {
    charset: 'utf8',
    target: ts.ScriptTarget.Latest
};
const overridedCompilerOptions = {
    allowNonTsExtensions: true,
    allowJs: true,
    checkJs: false,
    skipLibCheck: true,
    declaration: false,
    noResolve: true,
    emitBOM: false,
    inlineSourceMap: false,
    module: ts.ModuleKind.CommonJS,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    noEmit: false,
    sourceMap: false,
    jsx: ts.JsxEmit.React,
    jsxFactory: "h",
    suppressOutputPathCheck: true
};

let program = null;

class Tscriptifier extends Transform {
    constructor(filePath, compilerOptions = {}) {
        compilerOptions = Object.assign({},
            defaultCompilerOptions,
            compilerOptions,
            overridedCompilerOptions
        )
        super({encoding: compilerOptions.charset});
        this.filePath = filePath;
        this.compilerOptions = compilerOptions;
        this.sourceText = '';

        
    }

    _transform(data, encoding, callback) {
        this.sourceText += data.toString();
        callback(null);
    }

    _flush(callback) {
        const normalizedFilePath = ts.normalizePath(this.filePath);
        let outputText = '';

        const sourceFile = ts.createSourceFile(
            normalizedFilePath,
            this.sourceText,
            this.compilerOptions.target,
            false,
            ts.getScriptKindFromFileName(normalizedFilePath)
        );

        const defaultCompilerHost = ts.createCompilerHost(this.compilerOptions);
        const compilerHost = {
            ...defaultCompilerHost,
            fileExists: filePath => normalizedFilePath === filePath ? true : defaultCompilerHost.fileExists(filePath),
            getSourceFile: filePath => normalizedFilePath === filePath ? sourceFile : defaultCompilerHost.getSourceFile(filePath),
            readFile: filePath => normalizedFilePath === filePath ? this.sourceText : defaultCompilerHost.readFile(filePath),
            writeFile: (filePath, text) => outputText = text

        };

        program = ts.createProgram(
            [this.filePath],
            this.compilerOptions,
            compilerHost,
            program
        );

        program.emit(sourceFile);

        //ts.transpile(this, this.compilerOptions)

        callback(null, outputText);
    }
}

const tscriptify = (filePath, compilerOptions) => {
    return new Tscriptifier(filePath, compilerOptions);
};

tscriptify.Tscriptifier = Tscriptifier;

module.exports = tscriptify;
