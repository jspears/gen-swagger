import CliOption from "../CliOption";
import CodegenConstants from "../CodegenConstants";
import CodegenType from "../CodegenType";
import DefaultCodegen from "../DefaultCodegen";
import SupportingFile from "../SupportingFile";
import {HashSet, HashMap, Arrays} from "../java/javaUtil";
import {ArrayProperty, MapProperty} from "../models/properties";
import StringUtils from "../java/StringUtils";
import File from "../java/File";
import {HeaderParameter} from '../models/parameters';
import {parseBoolean} from "../java/BooleanHelper";

const ArrayUtils = {
    contains(arr, val){
        return arr && arr.indexOf(val) > -1;
    }
};

export default class SwiftCodegen extends DefaultCodegen {
    constructor() {
        super();
        this.projectName = "SwaggerClient";
        this.responseAs = new Array(0);
        this.sourceFolder = "Classes" + File.separator + "Swaggers";
        this.unwrapRequired = false;
        this.swiftUseApiNamespace = false;
        this.__outputFolder = "generated-code" + File.separator + "swift";
        this.__modelTemplateFiles.put("model.mustache", ".swift");
        this.__apiTemplateFiles.put("api.mustache", ".swift");
        this.__embeddedTemplateDir = this.__templateDir = "swift";
        this.__apiPackage = File.separator + "APIs";
        this.__modelPackage = File.separator + "Models";
        this.__languageSpecificPrimitives = (new HashSet(Arrays.asList("Int", "Int32", "Int64", "Float", "Double", "Bool", "Void", "String", "Character", "AnyObject")));
        this.__defaultIncludes = (new HashSet(Arrays.asList("NSData", "NSDate", "NSURL", "NSUUID", "Array", "Dictionary", "Set", "Any", "Empty", "AnyObject")));
        this.__reservedWords = (new HashSet(Arrays.asList("Int", "Int32", "Int64", "Int64", "Float", "Double", "Bool", "Void", "String", "Character", "AnyObject", "class", "Class", "break", "as", "associativity", "deinit", "case", "dynamicType", "convenience", "enum", "continue", "false", "dynamic", "extension", "default", "is", "didSet", "func", "do", "nil", "final", "import", "else", "self", "get", "init", "fallthrough", "Self", "infix", "internal", "for", "super", "inout", "let", "if", "true", "lazy", "operator", "in", "COLUMN", "left", "private", "return", "FILE", "mutating", "protocol", "switch", "FUNCTION", "none", "public", "where", "LINE", "nonmutating", "static", "while", "optional", "struct", "override", "subscript", "postfix", "typealias", "precedence", "var", "prefix", "Protocol", "required", "right", "set", "Type", "unowned", "weak")));
        this.__typeMapping = (new HashMap());
        this.__typeMapping.put("array", "Array");
        this.__typeMapping.put("List", "Array");
        this.__typeMapping.put("map", "Dictionary");
        this.__typeMapping.put("date", "NSDate");
        this.__typeMapping.put("Date", "NSDate");
        this.__typeMapping.put("DateTime", "NSDate");
        this.__typeMapping.put("boolean", "Bool");
        this.__typeMapping.put("string", "String");
        this.__typeMapping.put("char", "Character");
        this.__typeMapping.put("short", "Int");
        this.__typeMapping.put("int", "Int32");
        this.__typeMapping.put("long", "Int64");
        this.__typeMapping.put("integer", "Int32");
        this.__typeMapping.put("Integer", "Int32");
        this.__typeMapping.put("float", "Float");
        this.__typeMapping.put("number", "Double");
        this.__typeMapping.put("double", "Double");
        this.__typeMapping.put("object", "AnyObject");
        this.__typeMapping.put("file", "NSURL");
        this.__typeMapping.put("binary", "NSData");
        this.__typeMapping.put("ByteArray", "NSData");
        this.__typeMapping.put("UUID", "NSUUID");
        this.__importMapping = (new HashMap());
        this.__cliOptions.add(new CliOption(SwiftCodegen.PROJECT_NAME, "Project name in Xcode"));
        this.__cliOptions.add(new CliOption(SwiftCodegen.RESPONSE_AS, "Optionally use libraries to manage response.  Currently " + StringUtils.join(SwiftCodegen.RESPONSE_LIBRARIES, ", ") + " are available."));
        this.__cliOptions.add(new CliOption(SwiftCodegen.UNWRAP_REQUIRED, "Treat \'required\' properties in response as non-optional (which would crash the app if api returns null as opposed to required option specified in json schema"));
        this.__cliOptions.add(new CliOption(SwiftCodegen.POD_SOURCE, "Source information used for Podspec"));
        this.__cliOptions.add(new CliOption(CodegenConstants.POD_VERSION, "Version used for Podspec"));
        this.__cliOptions.add(new CliOption(SwiftCodegen.POD_AUTHORS, "Authors used for Podspec"));
        this.__cliOptions.add(new CliOption(SwiftCodegen.POD_SOCIAL_MEDIA_URL, "Social Media URL used for Podspec"));
        this.__cliOptions.add(new CliOption(SwiftCodegen.POD_DOCSET_URL, "Docset URL used for Podspec"));
        this.__cliOptions.add(new CliOption(SwiftCodegen.POD_LICENSE, "License used for Podspec"));
        this.__cliOptions.add(new CliOption(SwiftCodegen.POD_HOMEPAGE, "Homepage used for Podspec"));
        this.__cliOptions.add(new CliOption(SwiftCodegen.POD_SUMMARY, "Summary used for Podspec"));
        this.__cliOptions.add(new CliOption(SwiftCodegen.POD_DESCRIPTION, "Description used for Podspec"));
        this.__cliOptions.add(new CliOption(SwiftCodegen.POD_SCREENSHOTS, "Screenshots used for Podspec"));
        this.__cliOptions.add(new CliOption(SwiftCodegen.POD_DOCUMENTATION_URL, "Documentation URL used for Podspec"));
        this.__cliOptions.add(new CliOption(SwiftCodegen.SWIFT_USE_API_NAMESPACE, "Flag to make all the API classes inner-class of {{projectName}}API"));
    }


    static PATH_PARAM_PATTERN_$LI$() {
        if (SwiftCodegen.PATH_PARAM_PATTERN == null)
            SwiftCodegen.PATH_PARAM_PATTERN = new RegExp("\\{[a-zA-Z_]+\\}");
        return SwiftCodegen.PATH_PARAM_PATTERN;
    }
    ;

    getTag() {
        return CodegenType.CLIENT;
    }

    getName() {
        return "swift";
    }

    getHelp() {
        return "Generates a swift client library.";
    }

    processOpts() {
        super.processOpts();
        if (this.__additionalProperties.containsKey(SwiftCodegen.PROJECT_NAME)) {
            this.setProjectName(this.__additionalProperties.get(SwiftCodegen.PROJECT_NAME));
        }
        else {
            this.__additionalProperties.put(SwiftCodegen.PROJECT_NAME, this.projectName);
        }
        this.sourceFolder = this.projectName + File.separator + this.sourceFolder;
        if (this.__additionalProperties.containsKey(SwiftCodegen.UNWRAP_REQUIRED)) {
            this.setUnwrapRequired(parseBoolean(this.__additionalProperties.get(SwiftCodegen.UNWRAP_REQUIRED)));
        }
        this.__additionalProperties.put(SwiftCodegen.UNWRAP_REQUIRED, this.unwrapRequired);
        if (this.__additionalProperties.containsKey(SwiftCodegen.RESPONSE_AS)) {
            let responseAsObject = this.__additionalProperties.get(SwiftCodegen.RESPONSE_AS);
            if (typeof responseAsObject === 'string') {
                this.setResponseAs(responseAsObject.split(","));
            }
            else {
                this.setResponseAs(responseAsObject);
            }
        }
        this.__additionalProperties.put(SwiftCodegen.RESPONSE_AS, this.responseAs);
        if (ArrayUtils.contains(this.responseAs, SwiftCodegen.LIBRARY_PROMISE_KIT)) {
            this.__additionalProperties.put("usePromiseKit", true);
        }
        if (this.__additionalProperties.containsKey(SwiftCodegen.SWIFT_USE_API_NAMESPACE)) {
            this.swiftUseApiNamespace = parseBoolean(this.__additionalProperties.get(SwiftCodegen.SWIFT_USE_API_NAMESPACE));
        }
        this.__additionalProperties.put(SwiftCodegen.SWIFT_USE_API_NAMESPACE, this.swiftUseApiNamespace);
        if (!this.__additionalProperties.containsKey(SwiftCodegen.POD_AUTHORS)) {
            this.__additionalProperties.put(SwiftCodegen.POD_AUTHORS, SwiftCodegen.DEFAULT_POD_AUTHORS);
        }
        this.__supportingFiles.add(new SupportingFile("Podspec.mustache", "", this.projectName + ".podspec"));
        this.__supportingFiles.add(new SupportingFile("Cartfile.mustache", "", "Cartfile"));
        this.__supportingFiles.add(new SupportingFile("APIHelper.mustache", this.sourceFolder, "APIHelper.swift"));
        this.__supportingFiles.add(new SupportingFile("AlamofireImplementations.mustache", this.sourceFolder, "AlamofireImplementations.swift"));
        this.__supportingFiles.add(new SupportingFile("Extensions.mustache", this.sourceFolder, "Extensions.swift"));
        this.__supportingFiles.add(new SupportingFile("Models.mustache", this.sourceFolder, "Models.swift"));
        this.__supportingFiles.add(new SupportingFile("APIs.mustache", this.sourceFolder, "APIs.swift"));
        this.__supportingFiles.add(new SupportingFile("git_push.sh.mustache", "", "git_push.sh"));
        this.__supportingFiles.add(new SupportingFile("gitignore.mustache", "", ".gitignore"));
    }

    isReservedWord(word) {
        return word != null && this.__reservedWords.contains(word);
    }

    escapeReservedWord(name) {
        return "_" + name;
    }

    modelFileFolder() {
        return this.__outputFolder + File.separator + this.sourceFolder + this.modelPackage().split('.').join(File.separatorChar);
    }

    apiFileFolder() {
        return this.__outputFolder + File.separator + this.sourceFolder + this.apiPackage().split('.').join(File.separatorChar);
    }

    getTypeDeclaration(p) {
        if (p != null && p instanceof ArrayProperty) {
            let ap = p;
            let inner = ap.getItems();
            return "[" + this.getTypeDeclaration(inner) + "]";
        }
        else if (p != null && p instanceof MapProperty) {
            let mp = p;
            let inner = mp.getAdditionalProperties();
            return "[String:" + this.getTypeDeclaration(inner) + "]";
        }
        return super.getTypeDeclaration(p);
    }

    getSwaggerType(p) {
        let swaggerType = super.getSwaggerType(p);
        let type = null;
        if (this.__typeMapping.containsKey(swaggerType)) {
            type = this.__typeMapping.get(swaggerType);
            if (this.__languageSpecificPrimitives.contains(type) || this.__defaultIncludes.contains(type))
                return type;
        }
        else
            type = swaggerType;
        return this.toModelName(type);
    }

    isDataTypeBinary(dataType) {
        return dataType != null && (dataType === "NSData");
    }

    /**
     * Output the proper model name (capitalized)
     *
     * @param name the name of the model
     * @return capitalized model name
     */
    toModelName(name) {
        name = this.sanitizeName(name);
        if (!StringUtils.isEmpty(this.modelNameSuffix)) {
            name = name + "_" + this.modelNameSuffix;
        }
        if (!StringUtils.isEmpty(this.modelNamePrefix)) {
            name = this.modelNamePrefix + "_" + name;
        }
        name = DefaultCodegen.camelize(name);
        if (this.isReservedWord(name)) {
            let modelName = "Model" + name;
            DefaultCodegen.Log().warn(name + " (reserved word) cannot be used as model name. Renamed to " + modelName);
            return modelName;
        }
        if (name.match("^\\d.*")) {
            let modelName = "Model" + name;
            DefaultCodegen.Log().warn(name + " (model name starts with number) cannot be used as model name. Renamed to " + modelName);
            return modelName;
        }
        return name;
    }

    /**
     * Return the capitalized file name of the model
     *
     * @param name the model name
     * @return the file name of the model
     */
    toModelFilename(name) {
        return this.toModelName(name);
    }

    toDefaultValue(p) {
        return null;
    }

    toInstantiationType(p) {
        if (p != null && p instanceof MapProperty) {
            let ap = p;
            let inner = this.getSwaggerType(ap.getAdditionalProperties());
            return "[String:" + inner + "]";
        }
        else if (p != null && p instanceof ArrayProperty) {
            let ap = p;
            let inner = this.getSwaggerType(ap.getItems());
            return "[" + inner + "]";
        }
        return null;
    }

    fromProperty(name, p) {
        let codegenProperty = super.fromProperty(name, p);
        if ((codegenProperty.isContainer)) {
            return codegenProperty;
        }
        if (codegenProperty.isEnum) {
            let swiftEnums = (new ArrayList());
            let values = codegenProperty.allowableValues.get("values");
            for (let index256 = values.iterator(); index256.hasNext();) {
                let value = index256.next();
                {
                    let map = (new HashMap());
                    map.put("enum", this.toSwiftyEnumName(/* valueOf */ new String(value).toString()));
                    map.put("raw", /* valueOf */ new String(value).toString());
                    swiftEnums.add(map);
                }
            }
            codegenProperty.allowableValues.put("values", swiftEnums);
            codegenProperty.datatypeWithEnum = this.toEnumName(codegenProperty);
            if (this.isReservedWord(codegenProperty.datatypeWithEnum) || (this.toVarName(name) === codegenProperty.datatypeWithEnum)) {
                codegenProperty.datatypeWithEnum = codegenProperty.datatypeWithEnum + "Enum";
            }
        }
        return codegenProperty;
    }

    toSwiftyEnumName(value) {
        if (value.match("[A-Z][a-z0-9]+[a-zA-Z0-9]*")) {
            return value;
        }
        let separators = ['-', '_', ' ', ':'];
        return WordUtils.capitalizeFully.apply(null, [StringUtils.lowerCase(value)].concat(separators)).replace(new RegExp("[-_  :]", 'g'), "");
    }

    toApiName(name) {
        if (name.length === 0)
            return "DefaultAPI";
        return this.initialCaps(name) + "API";
    }

    toOperationId(operationId) {
        operationId = DefaultCodegen.camelize(this.sanitizeName(operationId), true);
        if (StringUtils.isEmpty(operationId)) {
            throw new Error("Empty method name (operationId) not allowed");
        }
        if (this.isReservedWord(operationId)) {
            let newOperationId = DefaultCodegen.camelize(("call_" + operationId), true);
            DefaultCodegen.Log().warn(operationId + " (reserved word) cannot be used as method name. Renamed to " + newOperationId);
            return newOperationId;
        }
        return operationId;
    }

    toVarName(name) {
        name = this.sanitizeName(name);
        if (name.match("^[A-Z_]*$")) {
            return name;
        }
        name = DefaultCodegen.camelize(name, true);
        if (this.isReservedWord(name) || name.match("^\\d.*")) {
            name = this.escapeReservedWord(name);
        }
        return name;
    }

    toParamName(name) {
        name = this.sanitizeName(name);
        name = name.replace(new RegExp("-", 'g'), "_");
        if (name.match("^[A-Z_]*$")) {
            return name;
        }
        name = DefaultCodegen.camelize(name, true);
        if (this.isReservedWord(name) || name.match("^\\d.*")) {
            name = this.escapeReservedWord(name);
        }
        return name;
    }

    fromOperation(path, httpMethod, operation, definitions, swagger) {
        if (arguments.length > 4) {
            path = SwiftCodegen.normalizePath(path);
            let parameters = operation.getParameters();
            parameters = parameters.filter(isHeader);//Lists.newArrayList(Iterators.filter(parameters.iterator(), new SwiftCodegen.SwiftCodegen$0(this)));
            operation.setParameters(parameters);
            return super.fromOperation(path, httpMethod, operation, definitions, swagger);
        }
        return this.fromOperation$java_lang_String$java_lang_String$io_swagger_models_Operation$java_util_Map(path, httpMethod, operation, definitions);
    }

    static normalizePath(path) {
        //todo figure this out.
        return path;
    }

    setProjectName(projectName) {
        this.projectName = projectName;
    }

    setUnwrapRequired(unwrapRequired) {
        this.unwrapRequired = unwrapRequired;
    }

    setResponseAs(responseAs) {
        this.responseAs = responseAs;
    }

    toEnumValue(value, datatype) {
        if (("int" === datatype) || ("double" === datatype) || ("float" === datatype)) {
            return value;
        }
        else {
            return "\'" + this.escapeText(value) + "\'";
        }
    }

    toEnumDefaultValue(value, datatype) {
        return datatype + "_" + value;
    }

    toEnumVarName(name, datatype) {
        if (("int" === datatype) || ("double" === datatype) || ("float" === datatype)) {
            let varName = new String(name);
            varName = varName.replace(new RegExp("-", 'g'), "MINUS_");
            varName = varName.replace(new RegExp("\\+", 'g'), "PLUS_");
            varName = varName.replace(new RegExp("\\.", 'g'), "_DOT_");
            return varName;
        }
        let enumName = this.sanitizeName(DefaultCodegen.underscore(name).toUpperCase());
        enumName = enumName.replaceFirst("^_", "");
        enumName = enumName.replaceFirst("_$", "");
        if (enumName.match("\\d.*")) {
            return "_" + enumName;
        }
        else {
            return enumName;
        }
    }

    toEnumName(property) {
        let enumName = this.toModelName(property.name);
        if (enumName.match("\\d.*")) {
            return "_" + enumName;
        }
        else {
            return enumName;
        }
    }

    postProcessModels(objs) {
        return this.postProcessModelsEnum(objs);
    }

    escapeQuotationMark(input) {
        return input.split("\"").join("");
    }

    escapeUnsafeCharacters(input) {
        return input.split("*/").join("*_/").split("/*").join("/_*");
    }
}
SwiftCodegen.PROJECT_NAME = "projectName";
SwiftCodegen.RESPONSE_AS = "responseAs";
SwiftCodegen.UNWRAP_REQUIRED = "unwrapRequired";
SwiftCodegen.POD_SOURCE = "podSource";
SwiftCodegen.POD_AUTHORS = "podAuthors";
SwiftCodegen.POD_SOCIAL_MEDIA_URL = "podSocialMediaURL";
SwiftCodegen.POD_DOCSET_URL = "podDocsetURL";
SwiftCodegen.POD_LICENSE = "podLicense";
SwiftCodegen.POD_HOMEPAGE = "podHomepage";
SwiftCodegen.POD_SUMMARY = "podSummary";
SwiftCodegen.POD_DESCRIPTION = "podDescription";
SwiftCodegen.POD_SCREENSHOTS = "podScreenshots";
SwiftCodegen.POD_DOCUMENTATION_URL = "podDocumentationURL";
SwiftCodegen.SWIFT_USE_API_NAMESPACE = "swiftUseApiNamespace";
SwiftCodegen.DEFAULT_POD_AUTHORS = "Swagger Codegen";
SwiftCodegen.LIBRARY_PROMISE_KIT = "PromiseKit";
SwiftCodegen["__class"] = "io.swagger.codegen.languages.SwiftCodegen";
SwiftCodegen["__interfaces"] = ["io.swagger.codegen.CodegenConfig"];
SwiftCodegen.RESPONSE_LIBRARIES = [SwiftCodegen.LIBRARY_PROMISE_KIT];

const isHeader = (parameter) => !(parameter != null && parameter instanceof HeaderParameter)
