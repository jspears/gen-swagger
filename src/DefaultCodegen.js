import ExampleGenerator from "./examples/ExampleGenerator";
import CliOption from "./CliOption";
import CodegenConstants from "./CodegenConstants";
import CodegenModelFactory from "./CodegenModelFactory";
import CodegenModelType from "./CodegenModelType";
import camelCase from "lodash/camelCase";
import {
    AbstractNumericProperty,
    ArrayProperty,
    BaseIntegerProperty,
    BinaryProperty,
    BooleanProperty,
    ByteArrayProperty,
    DateProperty,
    DateTimeProperty,
    DecimalProperty,
    DoubleProperty,
    FloatProperty,
    IntegerProperty,
    LongProperty,
    MapProperty,
    RefProperty,
    StringProperty,
    UUIDProperty
} from "./models/properties";
import {
    Parameter,
    BodyParameter,
    CookieParameter,
    FormParameter,
    HeaderParameter,
    PathParameter,
    QueryParameter
} from "./models/parameters";
import System from "./java/System";
import LoggerFactory from "./java/LoggerFactory";
import File from "./java/File";
import StringBuilder from "./java/StringBuilder";
import {Lists, Collections, newHashSet, newHashMap, HashMap, TreeSet, LinkedHashMap} from "./java/javaUtil";
import StringUtils from "./java/StringUtils";
import Json from "./java/Json";
import StringEscapeUtils from "./java/StringEscapeUtils";
import ArrayModel from "./models/ArrayModel";
import ComposedModel from "./models/ComposedModel";
import ModelImpl from "./models/ModelImpl";
import RefModel from "./models/RefModel";
import ApiKeyAuthDefinition from "./models/auth/ApiKeyAuthDefinition";
import BasicAuthDefinition from "./models/auth/BasicAuthDefinition";
import In from "./models/auth/In";
import PropertyBuilder from "./models/PropertyBuilder";

const _count2 = (_, i) => ++i;

export default class DefaultCodegen {
    /**
     * Default constructor.
     * This method will map between Swagger type and language-specified type, as well as mapping
     * between Swagger type and the corresponding import statement for the language. This will
     * also add some language specified CLI options, if any.
     *
     *
     * returns string presentation of the example path (it's a constructor)
     */
    constructor() {
        this.__outputFolder = "";
        this.__defaultIncludes = newHashSet();
        this.__typeMapping = newHashMap();
        this.__instantiationTypes = newHashMap();
        this.__reservedWords = newHashSet();
        this.__languageSpecificPrimitives = newHashSet();
        this.__importMapping = newHashMap();
        this.__modelPackage = "";
        this.__apiPackage = "";
        this.modelNamePrefix = "";
        this.modelNameSuffix = "";
        this.__testPackage = "";
        this.__apiTemplateFiles = newHashMap();
        this.__modelTemplateFiles = newHashMap();
        this.__apiTestTemplateFiles = newHashMap();
        this.__modelTestTemplateFiles = newHashMap();
        this.__apiDocTemplateFiles = newHashMap();
        this.__modelDocTemplateFiles = newHashMap();
        this.commonTemplateDir = "_common";
        this.__additionalProperties = newHashMap();
        this.__vendorExtensions = newHashMap();
        this.__supportingFiles = [];
        this.__cliOptions = [];
        this.__supportedLibraries = (new LinkedHashMap());
        this.sortParamsByRequiredFlag = true;
        this.ensureUniqueParams = true;
        this.specialCharReplacements = newHashMap();
        this.skipOverwrite = false;
        this.supportsInheritance = false;
        this.__defaultIncludes = newHashSet("double", "int", "long", "short", "char", "float", "String", "boolean", "Boolean", "Double", "Void", "Integer", "Long", "Float");
        this.__typeMapping = newHashMap();
        this.__typeMapping.put("array", "List");
        this.__typeMapping.put("map", "Map");
        this.__typeMapping.put("List", "List");
        this.__typeMapping.put("boolean", "Boolean");
        this.__typeMapping.put("string", "String");
        this.__typeMapping.put("int", "Integer");
        this.__typeMapping.put("float", "Float");
        this.__typeMapping.put("number", "BigDecimal");
        this.__typeMapping.put("DateTime", "Date");
        this.__typeMapping.put("long", "Long");
        this.__typeMapping.put("short", "Short");
        this.__typeMapping.put("char", "String");
        this.__typeMapping.put("double", "Double");
        this.__typeMapping.put("object", "Object");
        this.__typeMapping.put("integer", "Integer");
        this.__typeMapping.put("ByteArray", "byte[]");
        this.__typeMapping.put("binary", "byte[]");
        this.__instantiationTypes = newHashMap();
        this.__reservedWords = newHashSet();
        this.__importMapping = newHashMap();
        this.__importMapping.put("BigDecimal", "java.math.BigDecimal");
        this.__importMapping.put("UUID", "java.java.UUID");
        this.__importMapping.put("File", "java.io.File");
        this.__importMapping.put("Date", "java.java.Date");
        this.__importMapping.put("Timestamp", "java.sql.Timestamp");
        this.__importMapping.put("Map", "java.java.Map");
        this.__importMapping.put("HashMap", "java.java.HashMap");
        this.__importMapping.put("Array", "java.java.List");
        this.__importMapping.put("ArrayList", "java.java.ArrayList");
        this.__importMapping.put("List", "java.java.*");
        this.__importMapping.put("Set", "java.java.*");
        this.__importMapping.put("DateTime", "org.joda.time.*");
        this.__importMapping.put("LocalDateTime", "org.joda.time.*");
        this.__importMapping.put("LocalDate", "org.joda.time.*");
        this.__importMapping.put("LocalTime", "org.joda.time.*");
        this.__cliOptions.add(CliOption.newBoolean(CodegenConstants.SORT_PARAMS_BY_REQUIRED_FLAG, CodegenConstants.SORT_PARAMS_BY_REQUIRED_FLAG_DESC).defaultValue("true"));
        this.__cliOptions.add(CliOption.newBoolean(CodegenConstants.ENSURE_UNIQUE_PARAMS, CodegenConstants.ENSURE_UNIQUE_PARAMS_DESC).defaultValue("true"));
        this.initalizeSpecialCharacterMapping();
    }

    cliOptions() {
        return this.__cliOptions;
    }

    processOpts() {
        if (this.__additionalProperties.containsKey(CodegenConstants.TEMPLATE_DIR)) {
            this.setTemplateDir(this.__additionalProperties.get(CodegenConstants.TEMPLATE_DIR));
        }
        if (this.__additionalProperties.containsKey(CodegenConstants.MODEL_PACKAGE)) {
            this.setModelPackage(this.__additionalProperties.get(CodegenConstants.MODEL_PACKAGE));
        }
        if (this.__additionalProperties.containsKey(CodegenConstants.API_PACKAGE)) {
            this.setApiPackage(this.__additionalProperties.get(CodegenConstants.API_PACKAGE));
        }
        if (this.__additionalProperties.containsKey(CodegenConstants.SORT_PARAMS_BY_REQUIRED_FLAG)) {
            this.setSortParamsByRequiredFlag(Boolean(this.__additionalProperties.get(CodegenConstants.SORT_PARAMS_BY_REQUIRED_FLAG)));
        }
        if (this.__additionalProperties.containsKey(CodegenConstants.ENSURE_UNIQUE_PARAMS)) {
            this.setEnsureUniqueParams(Boolean(this.__additionalProperties.get(CodegenConstants.ENSURE_UNIQUE_PARAMS)));
        }
        if (this.__additionalProperties.containsKey(CodegenConstants.MODEL_NAME_PREFIX)) {
            this.setModelNamePrefix(this.__additionalProperties.get(CodegenConstants.MODEL_NAME_PREFIX));
        }
        if (this.__additionalProperties.containsKey(CodegenConstants.MODEL_NAME_SUFFIX)) {
            this.setModelNameSuffix(this.__additionalProperties.get(CodegenConstants.MODEL_NAME_SUFFIX));
        }
    }

    postProcessAllModels(objs) {
        if (this.supportsInheritance) {
            let allModels = newHashMap();
            for (let index137 = objs.entrySet().iterator(); index137.hasNext();) {
                let entry = index137.next();
                {
                    let modelName = this.toModelName(entry.getKey());
                    let inner = entry.getValue();
                    let models = inner.get("models");
                    for (let index138 = models.iterator(); index138.hasNext();) {
                        let mo = index138.next();
                        {
                            let cm = mo.get("model");
                            allModels.put(modelName, cm);
                        }
                    }
                }
            }
            for (let index139 = allModels.values().iterator(); index139.hasNext();) {
                let cm = index139.next();
                {
                    if (cm.parent != null) {
                        cm.parentModel = allModels.get(cm.parent);
                    }
                    if (cm.interfaces != null && !cm.interfaces.isEmpty()) {
                        cm.interfaceModels = cm.interfaces.concat();
                        for (let index140 = cm.interfaces.iterator(); index140.hasNext();) {
                            let intf = index140.next();
                            {
                                let intfModel = allModels.get(intf);
                                if (intfModel != null) {
                                    cm.interfaceModels.add(intfModel);
                                }
                            }
                        }
                    }
                }
            }
        }
        return objs;
    }

    postProcessModels(objs) {
        return objs;
    }

    /**
     * post process enum defined in model's properties
     *
     * @param objs Map of models
     * @return maps of models with better enum support
     */
    postProcessModelsEnum(objs) {
        let models = objs.get("models");
        for (const mo of models) {
            let cm = mo.get("model");
            if (cm.isEnum && cm.allowableValues != null) {
                let allowableValues = cm.allowableValues;
                let values = allowableValues.get("values");
                let enumVars = [];
                let commonPrefix = this.findCommonPrefixOfVars(values);
                let truncateIdx = commonPrefix.length;
                for (let index142 = values.iterator(); index142.hasNext();) {
                    let value = index142.next();
                    {
                        let enumVar = newHashMap();
                        let enumName;
                        if (truncateIdx === 0) {
                            enumName = value.toString();
                        }
                        else {
                            enumName = value.toString().substring(truncateIdx);
                            if (("" === enumName)) {
                                enumName = value.toString();
                            }
                        }
                        enumVar.put("name", this.toEnumVarName(enumName, cm.dataType));
                        enumVar.put("value", this.toEnumValue(value.toString(), cm.dataType));
                        enumVars.add(enumVar);
                    }
                }
                cm.allowableValues.put("enumVars", enumVars);
            }
            for (const _var of cm.vars) {
                this.updateCodegenPropertyEnum(_var);
            }
        }
        return objs;
    }

    /**
     * Returns the common prefix of variables for enum naming
     *
     * @param vars List of variable names
     * @return the common prefix for naming
     */
    findCommonPrefixOfVars(listStr) {
        try {
            let prefix = StringUtils.getCommonPrefix(listStr);
            return prefix.replace(new RegExp("[a-zA-Z0-9]+\\z", 'g'), "");
        }
        catch (e) {
            Log.trace(e);
            return "";
        }
    }

    /**
     * Return the enum default value in the language specifed format
     *
     * @param value enum variable name
     * @param datatype data type
     * @return the default value for the enum
     */
    toEnumDefaultValue(value, datatype) {
        return datatype + "." + value;
    }

    /**
     * Return the enum value in the language specifed format
     * e.g. status becomes "status"
     *
     * @param value enum variable name
     * @param datatype data type
     * @return the sanitized value for enum
     */
    toEnumValue(value, datatype) {
        if (((o1, o2) => o1.toUpperCase() === (o2 === null ? o2 : o2.toUpperCase()))("number", datatype)) {
            return value;
        }
        else {
            return "\"" + this.escapeText(value) + "\"";
        }
    }

    /**
     * Return the sanitized variable name for enum
     *
     * @param value enum variable name
     * @param datatype data type
     * @return the sanitized variable name for enum
     */
    toEnumVarName(value, datatype) {
        let __var = value.replace(new RegExp("\\W+", 'g'), "_").toUpperCase();
        if (__var.matches("\\d.*")) {
            return "_" + __var;
        }
        else {
            return __var;
        }
    }

    postProcessOperations(objs) {
        return objs;
    }

    postProcessSupportingFileData(objs) {
        return objs;
    }

    postProcessModelProperty(model, property) {
    }

    postProcessParameter(parameter) {
    }

    preprocessSwagger(swagger) {
    }

    processSwagger(swagger) {
    }

    escapeText(input) {
        if (input == null) {
            return input;
        }
        return this.escapeUnsafeCharacters(/* replace */ /* replace */ /* replaceAll */ StringEscapeUtils.unescapeJava(/* replace */ StringEscapeUtils.escapeJava(input).split("\\/").join("/")).replace(new RegExp("[\\t\\n\\r]", 'g'), " ").split("\\").join("\\\\").split("\"").join("\\\""));
    }

    /**
     * override with any special text escaping logic to handle unsafe
     * characters so as to avoid code injection
     * @param input String to be cleaned up
     * @return string with unsafe characters removed or escaped
     */
    escapeUnsafeCharacters(input) {
        Log.warn("escapeUnsafeCharacters should be overriden in the code generator with proper logic to escape unsafe characters");
        return input;
    }

    /**
     * Escape single and/or double quote to avoid code injection
     * @param input String to be cleaned up
     * @return string with quotation mark removed or escaped
     */
    escapeQuotationMark(input) {
        Log.warn("escapeQuotationMark should be overriden in the code generator with proper logic to escape single/double quote");
        return input.split("\"").join("\\\"");
    }

    defaultIncludes() {
        return this.__defaultIncludes;
    }

    typeMapping() {
        return this.__typeMapping;
    }

    instantiationTypes() {
        return this.__instantiationTypes;
    }

    reservedWords() {
        return this.__reservedWords;
    }

    languageSpecificPrimitives() {
        return this.__languageSpecificPrimitives;
    }

    importMapping() {
        return this.__importMapping;
    }

    testPackage() {
        return this.__testPackage;
    }

    modelPackage() {
        return this.__modelPackage;
    }

    apiPackage() {
        return this.__apiPackage;
    }

    fileSuffix() {
        return this.__fileSuffix;
    }

    templateDir() {
        return this.__templateDir;
    }

    embeddedTemplateDir() {
        if (this.__embeddedTemplateDir != null) {
            return this.__embeddedTemplateDir;
        }
        else {
            return this.__templateDir;
        }
    }

    getCommonTemplateDir() {
        return this.commonTemplateDir;
    }

    setCommonTemplateDir(commonTemplateDir) {
        this.commonTemplateDir = commonTemplateDir;
    }

    apiDocTemplateFiles() {
        return this.__apiDocTemplateFiles;
    }

    modelDocTemplateFiles() {
        return this.__modelDocTemplateFiles;
    }

    apiTestTemplateFiles() {
        return this.__apiTestTemplateFiles;
    }

    modelTestTemplateFiles() {
        return this.__modelTestTemplateFiles;
    }

    apiTemplateFiles() {
        return this.__apiTemplateFiles;
    }

    modelTemplateFiles() {
        return this.__modelTemplateFiles;
    }

    apiFileFolder() {
        return this.__outputFolder + "/" + this.apiPackage().split('.').join('/');
    }

    modelFileFolder() {
        return this.__outputFolder + "/" + this.modelPackage().split('.').join('/');
    }

    apiTestFileFolder() {
        return this.__outputFolder + "/" + this.testPackage().split('.').join('/');
    }

    modelTestFileFolder() {
        return this.__outputFolder + "/" + this.testPackage().split('.').join('/');
    }

    apiDocFileFolder() {
        return this.__outputFolder;
    }

    modelDocFileFolder() {
        return this.__outputFolder;
    }

    additionalProperties() {
        return this.__additionalProperties;
    }

    vendorExtensions() {
        return this.__vendorExtensions;
    }

    supportingFiles() {
        return this.__supportingFiles;
    }

    outputFolder() {
        return this.__outputFolder;
    }

    setOutputDir(dir) {
        this.__outputFolder = dir;
    }

    getOutputDir() {
        return this.outputFolder();
    }

    setTemplateDir(templateDir) {
        this.__templateDir = templateDir;
    }

    setModelPackage(modelPackage) {
        this.__modelPackage = modelPackage;
    }

    setModelNamePrefix(modelNamePrefix) {
        this.modelNamePrefix = modelNamePrefix;
    }

    setModelNameSuffix(modelNameSuffix) {
        this.modelNameSuffix = modelNameSuffix;
    }

    setApiPackage(apiPackage) {
        this.__apiPackage = apiPackage;
    }

    setSortParamsByRequiredFlag(sortParamsByRequiredFlag) {
        this.sortParamsByRequiredFlag = sortParamsByRequiredFlag;
    }

    setEnsureUniqueParams(ensureUniqueParams) {
        this.ensureUniqueParams = ensureUniqueParams;
    }

    /**
     * Return the regular expression/JSON schema pattern (http://json-schema.org/latest/json-schema-validation.html#anchor33)
     *
     * @param pattern the pattern (regular expression)
     * @return properly-escaped pattern
     */
    toRegularExpression(pattern) {
        return this.escapeText(pattern);
    }

    /**
     * Return the file name of the Api Test
     *
     * @param name the file name of the Api
     * @return the file name of the Api
     */
    toApiFilename(name) {
        return this.toApiName(name);
    }

    /**
     * Return the file name of the Api Documentation
     *
     * @param name the file name of the Api
     * @return the file name of the Api
     */
    toApiDocFilename(name) {
        return this.toApiName(name);
    }

    /**
     * Return the file name of the Api Test
     *
     * @param name the file name of the Api
     * @return the file name of the Api
     */
    toApiTestFilename(name) {
        return this.toApiName(name) + "Test";
    }

    /**
     * Return the variable name in the Api
     *
     * @param name the varible name of the Api
     * @return the snake-cased variable name
     */
    toApiVarName(name) {
        return this.snakeCase(name);
    }

    /**
     * Return the capitalized file name of the model
     *
     * @param name the model name
     * @return the file name of the model
     */
    toModelFilename(name) {
        return this.initialCaps(name);
    }

    /**
     * Return the capitalized file name of the model test
     *
     * @param name the model name
     * @return the file name of the model
     */
    toModelTestFilename(name) {
        return this.initialCaps(name) + "Test";
    }

    /**
     * Return the capitalized file name of the model documentation
     *
     * @param name the model name
     * @return the file name of the model
     */
    toModelDocFilename(name) {
        return this.initialCaps(name);
    }

    /**
     * Return the operation ID (method name)
     *
     * @param operationId operation ID
     * @return the sanitized method name
     */
    toOperationId(operationId) {
        if (StringUtils.isEmpty(operationId)) {
            throw new Error("Empty method name (operationId) not allowed");
        }
        return operationId;
    }

    /**
     * Return the variable name by removing invalid characters and proper escaping if
     * it's a reserved word.
     *
     * @param name the variable name
     * @return the sanitized variable name
     */
    toVarName(name) {
        if (this.__reservedWords.contains(name)) {
            return this.escapeReservedWord(name);
        }
        else {
            return name;
        }
    }

    /**
     * Return the parameter name by removing invalid characters and proper escaping if
     * it's a reserved word.
     *
     * @param name Codegen property object
     * @return the sanitized parameter name
     */
    toParamName(name) {
        name = this.removeNonNameElementToCamelCase(name);
        if (this.__reservedWords.contains(name)) {
            return this.escapeReservedWord(name);
        }
        return name;
    }

    /**
     * Return the Enum name (e.g. StatusEnum given 'status')
     *
     * @param property Codegen property
     * @return the Enum name
     */
    toEnumName(property) {
        return StringUtils.capitalize(property.name) + "Enum";
    }

    /**
     * Return the escaped name of the reserved word
     *
     * @param name the name to be escaped
     * @return the escaped reserved word
     *
     * throws Runtime exception as reserved word is not allowed (default behavior)
     */
    escapeReservedWord(name) {
        throw new Error("reserved word " + name + " not allowed");
    }

    /**
     * Return the fully-qualified "Model" name for import
     *
     * @param name the name of the "Model"
     * @return the fully-qualified "Model" name for import
     */
    toModelImport(name) {
        if (("" === this.modelPackage())) {
            return name;
        }
        else {
            return this.modelPackage() + "." + name;
        }
    }

    /**
     * Return the fully-qualified "Api" name for import
     *
     * @param name the name of the "Api"
     * @return the fully-qualified "Api" name for import
     */
    toApiImport(name) {
        return this.apiPackage() + "." + name;
    }

    /**
     * Initalize special character mapping
     */
    initalizeSpecialCharacterMapping() {
        this.specialCharReplacements.put("$", "Dollar");
        this.specialCharReplacements.put("^", "Caret");
        this.specialCharReplacements.put("|", "Pipe");
        this.specialCharReplacements.put("=", "Equal");
        this.specialCharReplacements.put("*", "Star");
        this.specialCharReplacements.put("-", "Minus");
        this.specialCharReplacements.put("&", "Ampersand");
        this.specialCharReplacements.put("%", "Percent");
        this.specialCharReplacements.put("#", "Hash");
        this.specialCharReplacements.put("@", "At");
        this.specialCharReplacements.put("!", "Exclamation");
        this.specialCharReplacements.put("+", "Plus");
        this.specialCharReplacements.put(":", "Colon");
        this.specialCharReplacements.put(">", "Greater_Than");
        this.specialCharReplacements.put("<", "Less_Than");
        this.specialCharReplacements.put(".", "Period");
        this.specialCharReplacements.put("_", "Underscore");
        this.specialCharReplacements.put("<=", "Less_Than_Or_Equal_To");
        this.specialCharReplacements.put(">=", "Greater_Than_Or_Equal_To");
        this.specialCharReplacements.put("!=", "Not_Equal");
    }

    /**
     * Return the symbol name of a symbol
     *
     * @param input Symbol (e.g. $)
     * @return Symbol name (e.g. Dollar)
     */
    getSymbolName(input) {
        return this.specialCharReplacements.get(input);
    }

    /**
     * Return the example path
     *
     * @param path the path of the operation
     * @param operation Swagger operation object
     * @return string presentation of the example path
     */
    generateExamplePath(path, operation) {
        let sb = new StringBuilder();
        sb.append(path);
        if (operation.getParameters() != null) {
            let count = 0;
            for (const param of operation.getParameters()) {
                {
                    if (param != null && param instanceof QueryParameter) {
                        let paramPart = new StringBuilder();
                        let qp = param;
                        if (count === 0) {
                            paramPart.append("?");
                        }
                        else {
                            paramPart.append(",");
                        }
                        count += 1;
                        if (!param.getRequired()) {
                            paramPart.append("[");
                        }
                        paramPart.append(param.getName()).append("=");
                        paramPart.append("{");
                        if (qp.getCollectionFormat() != null) {
                            paramPart.append(param.getName() + "1");
                            if (("csv" === qp.getCollectionFormat())) {
                                paramPart.append(",");
                            }
                            else if (("pipes" === qp.getCollectionFormat())) {
                                paramPart.append("|");
                            }
                            else if (("tsv" === qp.getCollectionFormat())) {
                                paramPart.append("\t");
                            }
                            else if (("multi" === qp.getCollectionFormat())) {
                                paramPart.append("&").append(param.getName()).append("=");
                                paramPart.append(param.getName() + "2");
                            }
                        }
                        else {
                            paramPart.append(param.getName());
                        }
                        paramPart.append("}");
                        if (!param.getRequired()) {
                            paramPart.append("]");
                        }
                        sb.append(paramPart.toString());
                    }
                }
            }
        }
        return sb.toString();
    }

    /**
     * Return the instantiation type of the property, especially for map and array
     *
     * @param p Swagger property object
     * @return string presentation of the instantiation type of the property
     */
    toInstantiationType(p) {
        if (p != null && p instanceof MapProperty) {
            let ap = p;
            let additionalProperties2 = ap.getAdditionalProperties();
            let type = additionalProperties2.getType();
            if (null == type) {
                Log.error("No Type defined for Additional Property " + additionalProperties2 + "\n\tIn Property: " + p);
            }
            let inner = this.getSwaggerType(additionalProperties2);
            return this.__instantiationTypes.get("map") + "<String, " + inner + ">";
        }
        else if (p != null && p instanceof ArrayProperty) {
            let ap = p;
            let inner = this.getSwaggerType(ap.getItems());
            return this.__instantiationTypes.get("array") + "<" + inner + ">";
        }
        else {
            return null;
        }
    }

    /**
     * Return the example value of the parameter.
     *
     * @param p Swagger property object
     */
    setParameterExampleValue(p) {
    }

    /**
     * Return the example value of the property
     *
     * @param p Swagger property object
     * @return string presentation of the example value of the property
     */
    toExampleValue(p) {
        if (p.getExample() != null) {
            return p.getExample().toString();
        }
        if (p != null && p instanceof StringProperty) {
            return "null";
        }
        else if (p != null && p instanceof BooleanProperty) {
            return "null";
        }
        else if (p != null && p instanceof DateProperty) {
            return "null";
        }
        else if (p != null && p instanceof DateTimeProperty) {
            return "null";
        }
        else if (p != null && p instanceof DoubleProperty) {
            let dp = p;
            if (dp.getExample() != null) {
                return dp.getExample().toString();
            }
            return "null";
        }
        else if (p != null && p instanceof FloatProperty) {
            let dp = p;
            if (dp.getExample() != null) {
                return dp.getExample().toString();
            }
            return "null";
        }
        else if (p != null && p instanceof IntegerProperty) {
            let dp = p;
            if (dp.getExample() != null) {
                return dp.getExample().toString();
            }
            return "null";
        }
        else if (p != null && p instanceof LongProperty) {
            let dp = p;
            if (dp.getExample() != null) {
                return dp.getExample().toString();
            }
            return "null";
        }
        else {
            return "null";
        }
    }

    /**
     * Return the default value of the property
     *
     * @param p Swagger property object
     * @return string presentation of the default value of the property
     */
    toDefaultValue(p) {
        if (p != null && p instanceof StringProperty) {
            return "null";
        }
        else if (p != null && p instanceof BooleanProperty) {
            return "null";
        }
        else if (p != null && p instanceof DateProperty) {
            return "null";
        }
        else if (p != null && p instanceof DateTimeProperty) {
            return "null";
        }
        else if (p != null && p instanceof DoubleProperty) {
            let dp = p;
            if (dp.getDefault() != null) {
                return dp.getDefault().toString();
            }
            return "null";
        }
        else if (p != null && p instanceof FloatProperty) {
            let dp = p;
            if (dp.getDefault() != null) {
                return dp.getDefault().toString();
            }
            return "null";
        }
        else if (p != null && p instanceof IntegerProperty) {
            let dp = p;
            if (dp.getDefault() != null) {
                return dp.getDefault().toString();
            }
            return "null";
        }
        else if (p != null && p instanceof LongProperty) {
            let dp = p;
            if (dp.getDefault() != null) {
                return dp.getDefault().toString();
            }
            return "null";
        }
        else {
            return "null";
        }
    }

    /**
     * Return the property initialized from a data object
     * Useful for initialization with a plain object in Javascript
     *
     * @param name Name of the property object
     * @param p Swagger property object
     * @return string presentation of the default value of the property
     */
    toDefaultValueWithParam(name, p) {
        return " = data." + name + ";";
    }

    /**
     * returns the swagger type for the property
     * @param p Swagger property object
     * @return string presentation of the type
     */
    getSwaggerType(p) {
        let datatype = null;
        if ((p != null && p instanceof StringProperty) && ("number" === p.getFormat())) {
            datatype = "BigDecimal";
        }
        else if (p != null && p instanceof StringProperty) {
            datatype = "string";
        }
        else if (p != null && p instanceof ByteArrayProperty) {
            datatype = "ByteArray";
        }
        else if (p != null && p instanceof BinaryProperty) {
            datatype = "binary";
        }
        else if (p != null && p instanceof BooleanProperty) {
            datatype = "boolean";
        }
        else if (p != null && p instanceof DateProperty) {
            datatype = "date";
        }
        else if (p != null && p instanceof DateTimeProperty) {
            datatype = "DateTime";
        }
        else if (p != null && p instanceof DoubleProperty) {
            datatype = "double";
        }
        else if (p != null && p instanceof FloatProperty) {
            datatype = "float";
        }
        else if (p != null && p instanceof IntegerProperty) {
            datatype = "integer";
        }
        else if (p != null && p instanceof LongProperty) {
            datatype = "long";
        }
        else if (p != null && p instanceof MapProperty) {
            datatype = "map";
        }
        else if (p != null && p instanceof DecimalProperty) {
            datatype = "number";
        }
        else if (p != null && p instanceof UUIDProperty) {
            datatype = "UUID";
        }
        else if (p != null && p instanceof RefProperty) {
            try {
                let r = p;
                datatype = r.get$ref();
                if (datatype.indexOf("#/definitions/") === 0) {
                    datatype = datatype.substring("#/definitions/".length);
                }
            }
            catch (e) {
                Log.warn("Error obtaining the datatype from RefProperty:" + p + ". Datatype default to Object");
                Log.trace(e);
                datatype = "Object";
            }
        }
        else {
            if (p != null) {
                datatype = p.getType();
            }
        }
        return datatype;
    }

    /**
     * Return the snake-case of the string
     *
     * @param name string to be snake-cased
     * @return snake-cased string
     */
    snakeCase(name) {
        return (name.length > 0) ? (name[0].toLowerCase() + name.substring(1)) : "";
    }

    /**
     * Capitalize the string
     *
     * @param name string to be capitalized
     * @return capitalized string
     */
    initialCaps(name) {
        return StringUtils.capitalize(name);
    }

    /**
     * Output the type declaration of a given name
     *
     * @param name name
     * @return a string presentation of the type
     */
    getTypeDeclaration(name) {
        if (name == null || typeof name === 'string') {
            return name;
        }
        let swaggerType = this.getSwaggerType(name);
        if (this.__typeMapping.containsKey(swaggerType)) {
            swaggerType = this.__typeMapping.get(swaggerType);
        }
        return swaggerType;
    }


    /**
     * Output the API (class) name (capitalized) ending with "Api"
     * Return DefaultApi if name is empty
     *
     * @param name the name of the Api
     * @return capitalized Api name ending with "Api"
     */
    toApiName(name) {
        if (name.length === 0) {
            return "DefaultApi";
        }
        return this.initialCaps(name) + "Api";
    }

    /**
     * Output the proper model name (capitalized)
     *
     * @param name the name of the model
     * @return capitalized model name
     */
    toModelName(name) {
        return this.initialCaps(this.modelNamePrefix + name + this.modelNameSuffix);
    }

    /**
     * Convert Swagger Model object to Codegen Model object
     *
     * @param name the name of the model
     * @param model Swagger Model object
     * @param allDefinitions a map of all Swagger models from the spec
     * @return Codegen Model object
     */
    fromModel(name, model, allDefinitions = null) {
        let m = CodegenModelFactory.newInstance(CodegenModelType.MODEL);
        if (this.__reservedWords.contains(name)) {
            m.name = this.escapeReservedWord(name);
        }
        else {
            m.name = name;
        }
        m.description = this.escapeText(model.getDescription());
        m.unescapedDescription = model.getDescription();
        m.classname = this.toModelName(name);
        m.classVarName = this.toVarName(name);
        m.classFilename = this.toModelFilename(name);
        m.modelJson = Json.pretty(model);
        m.externalDocs = model.getExternalDocs();
        m.vendorExtensions = model.getVendorExtensions();
        if (model != null && model instanceof ModelImpl) {
            m.discriminator = model.getDiscriminator();
        }
        if (model != null && model instanceof ArrayModel) {
            let am = model;
            let arrayProperty = new ArrayProperty(am.getItems());
            m.hasEnums = false;
            m.isArrayModel = true;
            m.arrayModelType = this.fromProperty(name, arrayProperty).complexType;
            this.addParentContainer(m, name, arrayProperty);
        }
        else if (model != null && model instanceof RefModel) {
        }
        else if (model != null && model instanceof ComposedModel) {
            let composed = model;
            let properties = (new LinkedHashMap());
            let required = [];
            let allProperties;
            let allRequired;
            if (this.supportsInheritance) {
                allProperties = (new LinkedHashMap());
                allRequired = [];
                m.allVars = [];
            }
            else {
                allProperties = null;
                allRequired = null;
            }
            let parent = composed.getParent();
            if (composed.getInterfaces() != null) {
                if (m.interfaces == null)
                    m.interfaces = [];
                for (let index145 = composed.getInterfaces().iterator(); index145.hasNext();) {
                    let _interface = index145.next();
                    {
                        let interfaceModel = null;
                        if (allDefinitions != null) {
                            interfaceModel = allDefinitions.get(_interface.getSimpleRef());
                        }
                        if (parent == null && (interfaceModel != null && interfaceModel instanceof ModelImpl) && interfaceModel.getDiscriminator() != null) {
                            parent = _interface;
                        }
                        else {
                            let interfaceRef = this.toModelName(_interface.getSimpleRef());
                            m.interfaces.add(interfaceRef);
                            this.addImport(m, interfaceRef);
                            if (allDefinitions != null) {
                                if (this.supportsInheritance) {
                                    this.addProperties(allProperties, allRequired, interfaceModel, allDefinitions);
                                }
                                else {
                                    this.addProperties(properties, required, interfaceModel, allDefinitions);
                                }
                            }
                        }
                    }
                }
            }
            if (parent != null) {
                let parentRef = parent.getSimpleRef();
                m.parentSchema = parentRef;
                m.parent = this.toModelName(parent.getSimpleRef());
                this.addImport(m, m.parent);
                if (allDefinitions != null) {
                    let parentModel = allDefinitions.get(m.parentSchema);
                    if (this.supportsInheritance) {
                        this.addProperties(allProperties, allRequired, parentModel, allDefinitions);
                    }
                    else {
                        this.addProperties(properties, required, parentModel, allDefinitions);
                    }
                }
            }
            let child = composed.getChild();
            if (child != null && (child != null && child instanceof RefModel) && allDefinitions != null) {
                let childRef = child.getSimpleRef();
                child = allDefinitions.get(childRef);
            }
            if (child != null && (child != null && child instanceof ModelImpl)) {
                this.addProperties(properties, required, child, allDefinitions);
                if (this.supportsInheritance) {
                    this.addProperties(allProperties, allRequired, child, allDefinitions);
                }
            }
            this.addVars(m, properties, required, allProperties, allRequired);
        }
        else {
            let impl = model;
            if (impl.getEnum() != null && impl.getEnum().length > 0) {
                m.isEnum = true;
                m.allowableValues = newHashMap();
                m.allowableValues.put("values", impl.getEnum());
                let p = PropertyBuilder.build(impl.getType(), impl.getFormat(), null);
                m.dataType = this.getSwaggerType(p);
            }
            if (impl.getAdditionalProperties() != null) {
                this.addAdditionPropertiesToCodeGenModel(m, impl);
            }
            this.addVars(m, impl.getProperties(), impl.getRequired());
        }
        if (m.vars != null) {
            for (const prop of m.vars) {
                this.postProcessModelProperty(m, prop);
            }
        }
        return m;
    }

    addAdditionPropertiesToCodeGenModel(codegenModel, swaggerModel) {
        let mapProperty = new MapProperty(swaggerModel.getAdditionalProperties());
        this.addParentContainer(codegenModel, codegenModel.name, mapProperty);
    }

    addProperties(properties, required, model, allDefinitions) {
        if (model != null && model instanceof ModelImpl) {
            let mi = model;
            if (mi.getProperties() != null) {
                properties.putAll(mi.getProperties());
            }
            if (mi.getRequired() != null) {
                required.addAll(mi.getRequired());
            }
        }
        else if (model != null && model instanceof RefModel) {
            let interfaceRef = model.getSimpleRef();
            let interfaceModel = allDefinitions.get(interfaceRef);
            this.addProperties(properties, required, interfaceModel, allDefinitions);
        }
        else if (model != null && model instanceof ComposedModel) {
            for (let index147 = model.getAllOf().iterator(); index147.hasNext();) {
                let component = index147.next();
                {
                    this.addProperties(properties, required, component, allDefinitions);
                }
            }
        }
    }

    /**
     * Camelize the method name of the getter and setter
     *
     * @param name string to be camelized
     * @return Camelized string
     */
    getterAndSetterCapitalize(name) {
        if (name == null || name.length === 0) {
            return name;
        }
        return DefaultCodegen.camelize(this.toVarName(name));
    }

    /**
     * Convert Swagger Property object to Codegen Property object
     *
     * @param name name of the property
     * @param p Swagger property object
     * @return Codegen Property object
     */
    fromProperty(name, p) {
        if (p == null) {
            Log.error("unexpected missing property for name " + name);
            return null;
        }
        let property = CodegenModelFactory.newInstance(CodegenModelType.PROPERTY);
        property.name = this.toVarName(name);
        property.baseName = name;
        property.nameInCamelCase = DefaultCodegen.camelize(property.name, false);
        property.description = this.escapeText(p.getDescription());
        property.unescapedDescription = p.getDescription();
        property.getter = "get" + this.getterAndSetterCapitalize(name);
        property.setter = "set" + this.getterAndSetterCapitalize(name);
        property.example = this.toExampleValue(p);
        property.defaultValue = this.toDefaultValue(p);
        property.defaultValueWithParam = this.toDefaultValueWithParam(name, p);
        property.jsonSchema = Json.pretty(p);
        property.isReadOnly = p.getReadOnly();
        property.vendorExtensions = p.getVendorExtensions();
        let type = this.getSwaggerType(p);
        if (p != null && p instanceof AbstractNumericProperty) {
            let np = p;
            property.minimum = np.getMinimum();
            property.maximum = np.getMaximum();
            property.exclusiveMinimum = np.getExclusiveMinimum();
            property.exclusiveMaximum = np.getExclusiveMaximum();
            if (property.minimum != null || property.maximum != null || property.exclusiveMinimum != null || property.exclusiveMaximum != null)
                property.hasValidation = true;
            let allowableValues = newHashMap();
            if (np.getMinimum() != null) {
                allowableValues.put("min", np.getMinimum());
            }
            if (np.getMaximum() != null) {
                allowableValues.put("max", np.getMaximum());
            }
            if (!allowableValues.isEmpty()) {
                property.allowableValues = allowableValues;
            }
        }
        if (p != null && p instanceof StringProperty) {
            let sp = p;
            property.maxLength = sp.getMaxLength();
            property.minLength = sp.getMinLength();
            property.pattern = this.toRegularExpression(sp.getPattern());
            if (property.pattern != null || property.minLength != null || property.maxLength != null)
                property.hasValidation = true;
            property.isString = true;
            if (sp.getEnum() != null) {
                let _enum = sp.getEnum();
                property._enum = _enum;
                property.isEnum = true;
                let allowableValues = newHashMap();
                allowableValues.put("values", _enum);
                property.allowableValues = allowableValues;
            }
        }
        if ((p != null && p instanceof BaseIntegerProperty) && !(p != null && p instanceof IntegerProperty) && !(p != null && p instanceof LongProperty)) {
            let sp = p;
            property.isInteger = true;
        }
        if (p != null && p instanceof IntegerProperty) {
            let sp = p;
            property.isInteger = true;
            if (sp.getEnum() != null) {
                let _enum = sp.getEnum();
                property._enum = [];
                for (let index148 = _enum.iterator(); index148.hasNext();) {
                    let i = index148.next();
                    {
                        property._enum.add(i.toString());
                    }
                }
                property.isEnum = true;
                let allowableValues = newHashMap();
                allowableValues.put("values", _enum);
                property.allowableValues = allowableValues;
            }
        }
        if (p != null && p instanceof LongProperty) {
            let sp = p;
            property.isLong = true;
            if (sp.getEnum() != null) {
                let _enum = sp.getEnum();
                property._enum = [];
                for (let index149 = _enum.iterator(); index149.hasNext();) {
                    let i = index149.next();
                    {
                        property._enum.add(i.toString());
                    }
                }
                property.isEnum = true;
                let allowableValues = newHashMap();
                allowableValues.put("values", _enum);
                property.allowableValues = allowableValues;
            }
        }
        if (p != null && p instanceof BooleanProperty) {
            property.isBoolean = true;
        }
        if (p != null && p instanceof BinaryProperty) {
            property.isBinary = true;
        }
        if (p != null && p instanceof UUIDProperty) {
            property.isString = true;
        }
        if (p != null && p instanceof ByteArrayProperty) {
            property.isByteArray = true;
        }
        if ((p != null && p instanceof DecimalProperty) && !(p != null && p instanceof DoubleProperty) && !(p != null && p instanceof FloatProperty)) {
            let sp = p;
            property.isFloat = true;
        }
        if (p != null && p instanceof DoubleProperty) {
            let sp = p;
            property.isDouble = true;
            if (sp.getEnum() != null) {
                let _enum = sp.getEnum();
                property._enum = [];
                for (let index150 = _enum.iterator(); index150.hasNext();) {
                    let i = index150.next();
                    {
                        property._enum.add(i.toString());
                    }
                }
                property.isEnum = true;
                let allowableValues = newHashMap();
                allowableValues.put("values", _enum);
                property.allowableValues = allowableValues;
            }
        }
        if (p != null && p instanceof FloatProperty) {
            let sp = p;
            property.isFloat = true;
            if (sp.getEnum() != null) {
                let _enum = sp.getEnum();
                property._enum = [];
                for (let index151 = _enum.iterator(); index151.hasNext();) {
                    let i = index151.next();
                    {
                        property._enum.add(i.toString());
                    }
                }
                property.isEnum = true;
                let allowableValues = newHashMap();
                allowableValues.put("values", _enum);
                property.allowableValues = allowableValues;
            }
        }
        if (p != null && p instanceof DateProperty) {
            let sp = p;
            property.isDate = true;
            if (sp.getEnum() != null) {
                let _enum = sp.getEnum();
                property._enum = [];
                for (let index152 = _enum.iterator(); index152.hasNext();) {
                    let i = index152.next();
                    {
                        property._enum.add(i.toString());
                    }
                }
                property.isEnum = true;
                let allowableValues = newHashMap();
                allowableValues.put("values", _enum);
                property.allowableValues = allowableValues;
            }
        }
        if (p != null && p instanceof DateTimeProperty) {
            let sp = p;
            property.isDateTime = true;
            if (sp.getEnum() != null) {
                let _enum = sp.getEnum();
                property._enum = [];
                for (let index153 = _enum.iterator(); index153.hasNext();) {
                    let i = index153.next();
                    {
                        property._enum.add(i.toString());
                    }
                }
                property.isEnum = true;
                let allowableValues = newHashMap();
                allowableValues.put("values", _enum);
                property.allowableValues = allowableValues;
            }
        }
        property.datatype = this.getTypeDeclaration(p);
        property.dataFormat = p.getFormat();
        if (property.isEnum) {
            property.datatypeWithEnum = this.toEnumName(property);
            property.enumName = this.toEnumName(property);
        }
        else {
            property.datatypeWithEnum = property.datatype;
        }
        property.baseType = this.getSwaggerType(p);
        if (p != null && p instanceof ArrayProperty) {
            property.isContainer = true;
            property.isListContainer = true;
            property.containerType = "array";
            property.baseType = this.getSwaggerType(p);
            let ap = p;
            let cp = this.fromProperty(property.name, ap.getItems());
            this.updatePropertyForArray(property, cp);
        }
        else if (p != null && p instanceof MapProperty) {
            property.isContainer = true;
            property.isMapContainer = true;
            property.containerType = "map";
            property.baseType = this.getSwaggerType(p);
            let ap = p;
            let cp = this.fromProperty("inner", ap.getAdditionalProperties());
            this.updatePropertyForMap(property, cp);
        }
        else {
            this.setNonArrayMapProperty(property, type);
        }
        return property;
    }

    /**
     * Update property for array(list) container
     * @param property Codegen property
     * @param innerProperty Codegen inner property of map or list
     */
    updatePropertyForArray(property, innerProperty) {
        if (innerProperty == null) {
            Log.warn("skipping invalid array property " + Json.pretty(property));
        }
        else {
            if (!this.__languageSpecificPrimitives.contains(innerProperty.baseType)) {
                property.complexType = innerProperty.baseType;
            }
            else {
                property.isPrimitiveType = true;
            }
            property.items = innerProperty;
            if (this.isPropertyInnerMostEnum(property)) {
                property.isEnum = true;
                this.updateDataTypeWithEnumForArray(property);
                property.allowableValues = this.getInnerEnumAllowableValues(property);
            }
        }
    }

    /**
     * Update property for map container
     * @param property Codegen property
     * @param innerProperty Codegen inner property of map or list
     */
    updatePropertyForMap(property, innerProperty) {
        if (innerProperty == null) {
            Log.warn("skipping invalid map property " + Json.pretty(property));
            return;
        }
        else {
            if (!this.__languageSpecificPrimitives.contains(innerProperty.baseType)) {
                property.complexType = innerProperty.baseType;
            }
            else {
                property.isPrimitiveType = true;
            }
            property.items = innerProperty;
            if (this.isPropertyInnerMostEnum(property)) {
                property.isEnum = true;
                this.updateDataTypeWithEnumForMap(property);
                property.allowableValues = this.getInnerEnumAllowableValues(property);
            }
        }
    }

    /**
     * Update property for map container
     * @param property Codegen property
     * @return True if the inner most type is enum
     */
    isPropertyInnerMostEnum(property) {
        let currentProperty = property;
        while (currentProperty != null && (currentProperty.isMapContainer || currentProperty.isListContainer)) {
            currentProperty = currentProperty.items;
        }

        return currentProperty.isEnum;
    }

    getInnerEnumAllowableValues(property) {
        let currentProperty = property;
        while ((currentProperty != null && ((currentProperty.isMapContainer) || (currentProperty.isListContainer)))) {
            currentProperty = currentProperty.items;
        }
        ;
        return currentProperty.allowableValues;
    }

    /**
     * Update datatypeWithEnum for array container
     * @param property Codegen property
     */
    updateDataTypeWithEnumForArray(property) {
        let baseItem = property.items;
        while ((baseItem != null && ((baseItem.isMapContainer) || (baseItem.isListContainer)))) {
            baseItem = baseItem.items;
        }
        ;
        property.datatypeWithEnum = property.datatypeWithEnum.split(baseItem.baseType).join(this.toEnumName(baseItem));
        property.enumName = this.toEnumName(property);
        if (property.defaultValue != null) {
            property.defaultValue = property.defaultValue.split(baseItem.baseType).join(this.toEnumName(baseItem));
        }
    }

    /**
     * Update datatypeWithEnum for map container
     * @param property Codegen property
     */
    updateDataTypeWithEnumForMap(property) {
        let baseItem = property.items;
        while ((baseItem != null && ((baseItem.isMapContainer) || (baseItem.isListContainer)))) {
            baseItem = baseItem.items;
        }
        ;
        property.datatypeWithEnum = property.datatypeWithEnum.split(", " + baseItem.baseType).join(", " + this.toEnumName(baseItem));
        property.enumName = this.toEnumName(property);
        if (property.defaultValue != null) {
            property.defaultValue = property.defaultValue.split(", " + property.items.baseType).join(", " + this.toEnumName(property.items));
        }
    }

    setNonArrayMapProperty(property, type) {
        property.isNotContainer = true;
        if (this.languageSpecificPrimitives().contains(type)) {
            property.isPrimitiveType = true;
        }
        else {
            property.complexType = property.baseType;
        }
    }

    /**
     * Override with any special handling of response codes
     * @param responses Swagger Operation's responses
     * @return default method response or <tt>null</tt> if not found
     */
    findMethodResponse(responses) {
        let code = null;
        let resp;
        for (const [responseCode, response] of responses) {
            if (('' + responseCode).startsWith("2") || (responseCode === "default")) {
                if (code == null || StringUtils.compareTo(responseCode, code) > 0) {
                    code = responseCode;
                    resp = response;
                }
            }
        }

        return resp;
    }

    /**
     * Convert Swagger Operation object to Codegen Operation object
     *
     * @param path the path of the operation
     * @param httpMethod HTTP method
     * @param operation Swagger operation object
     * @param definitions a map of Swagger models
     * @param swagger a Swagger object representing the spec
     * @return Codegen Operation object
     */
    fromOperation(path, httpMethod, operation, definitions, swagger = null) {
        let op = CodegenModelFactory.newInstance(CodegenModelType.OPERATION);
        let imports = newHashSet();
        op.vendorExtensions = operation.getVendorExtensions();
        let operationId = this.getOrGenerateOperationId(operation, path, httpMethod);
        operationId = this.removeNonNameElementToCamelCase(operationId);
        op.path = path;
        op.operationId = this.toOperationId(operationId);
        op.summary = this.escapeText(operation.getSummary());
        op.unescapedNotes = operation.getDescription();
        op.notes = this.escapeText(operation.getDescription());
        op.tags = operation.getTags();
        op.hasConsumes = false;
        op.hasProduces = false;
        let consumes = [];
        if (operation.getConsumes() != null) {
            if (operation.getConsumes().length > 0) {
                consumes = operation.getConsumes();
            }
            else {
            }
        }
        else if (swagger != null && swagger.getConsumes() != null && swagger.getConsumes().length > 0) {
            consumes = swagger.getConsumes();
            Log.debug("No consumes defined in operation. Using global consumes (" + swagger.getConsumes() + ") for " + op.operationId);
        }
        if (consumes != null && consumes.length) {
            let c = [];
            let count = 0;
            for (let index155 = consumes.iterator(); index155.hasNext();) {
                let key = index155.next();
                {
                    let mediaType = newHashMap();
                    mediaType.put("mediaType", this.escapeText(this.escapeQuotationMark(key)));
                    count += 1;
                    if (count < consumes.length) {
                        mediaType.put("hasMore", "true");
                    }
                    else {
                        mediaType.put("hasMore", null);
                    }
                    c.add(mediaType);
                }
            }
            op.consumes = c;
            op.hasConsumes = true;
        }
        let produces = [];
        if (operation.getProduces() != null) {
            if (operation.getProduces().length > 0) {
                produces = operation.getProduces();
            }
            else {
            }
        }
        else if (swagger != null && swagger.getProduces() != null && swagger.getProduces().length > 0) {
            produces = swagger.getProduces();
            Log.debug("No produces defined in operation. Using global produces (" + swagger.getProduces() + ") for " + op.operationId);
        }
        if (produces != null && produces.length > 0) {
            let c = [];
            let count = 0;
            for (const key of produces) {

                let mediaType = newHashMap(["mediaType", this.escapeText(this.escapeQuotationMark(key))]);
                count += 1;
                if (count < produces.length) {
                    mediaType.put("hasMore", "true");
                }
                else {
                    mediaType.put("hasMore", null);
                }
                c.push(mediaType);

            }
            op.produces = c;
            op.hasProduces = true;
        }

        const responses = operation.getResponses();
        if (responses != null && !responses.isEmpty()) {
            let methodResponse = this.findMethodResponse(responses);
            for (const [key, response] of operation.getResponses()) {
                let r = this.fromResponse(key, response);
                r.hasMore = true;
                if (r.baseType != null && !this.__defaultIncludes.contains(r.baseType) && !this.__languageSpecificPrimitives.contains(r.baseType)) {
                    imports.add(r.baseType);
                }
                r.isDefault = response === methodResponse;
                op.responses.add(r);
                if (r.isBinary && r.isDefault) {
                    op.isResponseBinary = true;
                }
            }
            op.responses[op.responses.length - 1].hasMore = false;
            if (methodResponse != null) {
                if (methodResponse.getSchema() != null) {
                    let cm = this.fromProperty("response", methodResponse.getSchema());
                    let responseProperty = methodResponse.getSchema();
                    if (responseProperty != null && responseProperty instanceof ArrayProperty) {
                        let ap = responseProperty;
                        let innerProperty = this.fromProperty("response", ap.getItems());
                        op.returnBaseType = innerProperty.baseType;
                    }
                    else {
                        if (cm.complexType != null) {
                            op.returnBaseType = cm.complexType;
                        }
                        else {
                            op.returnBaseType = cm.baseType;
                        }
                    }
                    op.examples = new ExampleGenerator(definitions).generate(methodResponse.getExamples(), operation.getProduces(), responseProperty);
                    op.defaultResponse = this.toDefaultValue(responseProperty);
                    op.returnType = cm.datatype;
                    op.hasReference = definitions != null && definitions.containsKey(op.returnBaseType);
                    if (definitions != null) {
                        let m = definitions.get(op.returnBaseType);
                        if (m != null) {
                            let cmod = this.fromModel(op.returnBaseType, m, definitions);
                            op.discriminator = cmod.discriminator;
                        }
                    }
                    if (cm.isContainer != null) {
                        op.returnContainer = cm.containerType;
                        if (("map" === cm.containerType)) {
                            op.isMapContainer = true;
                        }
                        else if (((o1, o2) => o1.toUpperCase() === (o2 === null ? o2 : o2.toUpperCase()))("list", cm.containerType)) {
                            op.isListContainer = true;
                        }
                        else if (((o1, o2) => o1.toUpperCase() === (o2 === null ? o2 : o2.toUpperCase()))("array", cm.containerType)) {
                            op.isListContainer = true;
                        }
                    }
                    else {
                        op.returnSimpleType = true;
                    }
                    if (this.languageSpecificPrimitives().contains(op.returnBaseType) || op.returnBaseType == null) {
                        op.returnTypeIsPrimitive = true;
                    }
                }
                this.addHeaders(methodResponse, op.responseHeaders);
            }
        }
        let parameters = operation.getParameters();
        let bodyParam = null;
        let allParams = [];
        let bodyParams = [];
        let pathParams = [];
        let queryParams = [];
        let headerParams = [];
        let cookieParams = [];
        let formParams = [];
        if (parameters != null) {
            for (const param of parameters) {
                let p = this.fromParameter(param, imports);
                if (this.ensureUniqueParams) {
                    while ((true)) {
                        let exists = false;
                        for (const cp of allParams) {
                            if ((p.paramName === cp.paramName)) {
                                exists = true;
                                break;
                            }
                        }
                        if (exists) {
                            p.paramName = DefaultCodegen.generateNextName(p.paramName);
                        }
                        else {
                            break;
                        }
                    }

                }
                allParams.push(p);
                if (param != null && param instanceof QueryParameter) {
                    queryParams.push(p.copy());
                }
                else if (param != null && param instanceof PathParameter) {
                    pathParams.push(p.copy());
                }
                else if (param != null && param instanceof HeaderParameter) {
                    headerParams.push(p.copy());
                }
                else if (param != null && param instanceof CookieParameter) {
                    cookieParams.push(p.copy());
                }
                else if (param != null && param instanceof BodyParameter) {
                    bodyParam = p;
                    bodyParams.add(p.copy());
                }
                else if (param != null && param instanceof FormParameter) {
                    formParams.add(p.copy());
                }
                if (p.required == null || !p.required) {
                    op.hasOptionalParams = true;
                }
            }
        }
        for (let index160 = imports.iterator(); index160.hasNext();) {
            let i = index160.next();
            {
                if (this.needToImport(i)) {
                    op.imports.add(i);
                }
            }
        }
        op.bodyParam = bodyParam;
        op.httpMethod = httpMethod.toUpperCase();
        if (this.sortParamsByRequiredFlag) {
            Collections.sort(allParams, (one, another) => {
                let oneRequired = one.required == null ? false : one.required;
                let anotherRequired = another.required == null ? false : another.required;
                if (oneRequired === anotherRequired)
                    return 0;
                else if (oneRequired)
                    return -1;
                else
                    return 1;
            });
        }
        op.allParams = DefaultCodegen.addHasMore(allParams);
        op.bodyParams = DefaultCodegen.addHasMore(bodyParams);
        op.pathParams = DefaultCodegen.addHasMore(pathParams);
        op.queryParams = DefaultCodegen.addHasMore(queryParams);
        op.headerParams = DefaultCodegen.addHasMore(headerParams);
        op.formParams = DefaultCodegen.addHasMore(formParams);
        op.nickname = op.operationId;
        if (op.allParams.length > 0) {
            op.hasParams = true;
        }
        op.externalDocs = operation.getExternalDocs();
        op.__isRestfulShow = op.isRestfulShow();
        op.__isRestfulIndex = op.isRestfulIndex();
        op.__isRestfulCreate = op.isRestfulCreate();
        op.__isRestfulUpdate = op.isRestfulUpdate();
        op.__isRestfulDestroy = op.isRestfulDestroy();
        op.__isRestful = op.isRestful();
        return op;
    }

    /**
     * Convert Swagger Response object to Codegen Response object
     *
     * @param responseCode HTTP response code
     * @param response Swagger Response object
     * @return Codegen Response object
     */
    fromResponse(responseCode, response) {
        let r = CodegenModelFactory.newInstance(CodegenModelType.RESPONSE);
        if (("default" === responseCode)) {
            r.code = "0";
        }
        else {
            r.code = responseCode;
        }
        r.message = this.escapeText(response.getDescription());
        r.schema = response.getSchema();
        r.examples = this.toExamples(response.getExamples());
        r.jsonSchema = Json.pretty(response);
        this.addHeaders(response, r.headers);
        if (r.schema != null) {
            let responseProperty = response.getSchema();
            responseProperty.setRequired(true);
            let cm = this.fromProperty("response", responseProperty);
            if (responseProperty != null && responseProperty instanceof ArrayProperty) {
                let ap = responseProperty;
                let innerProperty = this.fromProperty("response", ap.getItems());
                r.baseType = innerProperty.baseType;
            }
            else {
                if (cm.complexType != null) {
                    r.baseType = cm.complexType;
                }
                else {
                    r.baseType = cm.baseType;
                }
            }
            r.dataType = cm.datatype;
            r.isBinary = this.isDataTypeBinary(cm.datatype);
            if (cm.isContainer != null) {
                r.simpleType = false;
                r.containerType = cm.containerType;
                r.isMapContainer = ("map" === cm.containerType);
                r.isListContainer = ("list" === cm.containerType || "array" === this.containerType);
            }
            else {
                r.simpleType = true;
            }
            r.primitiveType = (r.baseType == null || this.languageSpecificPrimitives().contains(r.baseType));
        }
        if (r.baseType == null) {
            r.isMapContainer = false;
            r.isListContainer = false;
            r.primitiveType = true;
            r.simpleType = true;
        }
        return r;
    }

    /**
     * Convert Swagger Parameter object to Codegen Parameter object
     *
     * @param param Swagger parameter object
     * @param imports set of imports for library/package/module
     * @return Codegen Parameter object
     */
    fromParameter(param, imports) {
        let p = CodegenModelFactory.newInstance(CodegenModelType.PARAMETER);
        p.baseName = param.getName();
        p.description = this.escapeText(param.getDescription());
        p.unescapedDescription = param.getDescription();
        if (param.getRequired()) {
            p.required = param.getRequired();
        }
        p.jsonSchema = Json.pretty(param);
        if (System.getProperty("debugParser") != null) {
            Log.info("working on Parameter " + param);
        }
        if (param != null && param instanceof QueryParameter) {
            p.defaultValue = param.getDefaultValue();
        }
        else if (param != null && param instanceof HeaderParameter) {
            p.defaultValue = param.getDefaultValue();
        }
        else if (param != null && param instanceof FormParameter) {
            p.defaultValue = param.getDefaultValue();
        }
        p.vendorExtensions = param.getVendorExtensions();
//        if (param != null && (param["__interfaces"] != null && param["__interfaces"].indexOf("io.swagger.models.parameters.SerializableParameter") >= 0 || param.constructor != null && param.constructor["__interfaces"] != null && param.constructor["__interfaces"].indexOf("io.swagger.models.parameters.SerializableParameter") >= 0)) {
        if (param && param instanceof Parameter) {
            let qp = param;
            let property = null;
            let collectionFormat = null;
            let type = qp.getType();
            if (null == type) {
                Log.warn("Type is NULL for Serializable Parameter: " + param);
            }
            if (("array" === type)) {
                let inner = qp.getItems();
                if (inner == null) {
                    Log.warn("warning!  No inner type supplied for array parameter \"" + qp.getName() + "\", using String");
                    inner = new StringProperty().description("//TODO automatically added by swagger-codegen");
                }
                property = new ArrayProperty(inner);
                collectionFormat = qp.getCollectionFormat();
                if (collectionFormat == null) {
                    collectionFormat = "csv";
                }
                let pr = this.fromProperty("inner", inner);
                p.baseType = pr.datatype;
                p.isContainer = true;
                p.isListContainer = true;
                imports.add(pr.baseType);
            }
            else if (("object" === type)) {
                let inner = qp.getItems();
                if (inner == null) {
                    Log.warn("warning!  No inner type supplied for map parameter \"" + qp.getName() + "\", using String");
                    inner = new StringProperty().description("//TODO automatically added by swagger-codegen");
                }
                property = new MapProperty(inner);
                collectionFormat = qp.getCollectionFormat();
                let pr = this.fromProperty("inner", inner);
                p.baseType = pr.datatype;
                p.isContainer = true;
                p.isMapContainer = true;
                imports.add(pr.baseType);
            }
            else {
                let format = qp.getFormat();
                property = PropertyBuilder.build(type, format, newHashMap(["enum", qp.getEnum()]));
            }
            if (property == null) {
                Log.warn("warning!  Property type \"" + type + "\" not found for parameter \"" + param.getName() + "\", using String");
                property = new StringProperty().description("//TODO automatically added by swagger-codegen.  Type was " + type + " but not supported");
            }
            property.setRequired(param.getRequired());
            let cp = this.fromProperty(qp.getName(), property);
            this.setParameterBooleanFlagWithCodegenProperty(p, cp);
            p.dataType = cp.datatype;
            p.dataFormat = cp.dataFormat;
            if (cp.isEnum) {
                p.datatypeWithEnum = cp.datatypeWithEnum;
            }
            this.updateCodegenPropertyEnum(cp);
            p.isEnum = cp.isEnum;
            p._enum = cp._enum;
            p.allowableValues = cp.allowableValues;
            if (cp.items != null && cp.items.isEnum) {
                p.datatypeWithEnum = cp.datatypeWithEnum;
                p.items = cp.items;
            }
            p.collectionFormat = collectionFormat;
            if (collectionFormat != null && (collectionFormat === "multi")) {
                p.isCollectionFormatMulti = true;
            }
            p.paramName = this.toParamName(qp.getName());
            if (cp.complexType != null) {
                imports.add(cp.complexType);
            }
            p.maximum = qp.getMaximum();
            p.exclusiveMaximum = qp.isExclusiveMaximum();
            p.minimum = qp.getMinimum();
            p.exclusiveMinimum = qp.isExclusiveMinimum();
            p.maxLength = qp.getMaxLength();
            p.minLength = qp.getMinLength();
            p.pattern = this.toRegularExpression(qp.getPattern());
            p.maxItems = qp.getMaxItems();
            p.minItems = qp.getMinItems();
            p.uniqueItems = qp.isUniqueItems();
            p.multipleOf = qp.getMultipleOf();
            if (p.maximum != null || p.exclusiveMaximum != null || p.minimum != null || p.exclusiveMinimum != null || p.maxLength != null || p.minLength != null || p.maxItems != null || p.minItems != null || p.pattern != null) {
                p.hasValidation = true;
            }
        }
        else {
            if (!(param != null && param instanceof BodyParameter)) {
                Log.error("Cannot use Parameter " + param + " as Body Parameter");
            }
            let bp = param;
            let model = bp.getSchema();
            if (model != null && model instanceof ModelImpl) {
                let impl = model;
                let cm = this.fromModel(bp.getName(), impl);
                if (cm.emptyVars != null && cm.emptyVars === false) {
                    p.dataType = this.getTypeDeclaration(cm.classname);
                    imports.add(p.dataType);
                }
                else {
                    let prop = PropertyBuilder.build(impl.getType(), impl.getFormat(), null);
                    prop.setRequired(bp.getRequired());
                    let cp = this.fromProperty("property", prop);
                    if (cp != null) {
                        p.baseType = cp.baseType;
                        p.dataType = cp.datatype;
                        p.isPrimitiveType = cp.isPrimitiveType;
                        p.isBinary = this.isDataTypeBinary(cp.datatype);
                    }
                    this.setParameterBooleanFlagWithCodegenProperty(p, cp);
                }
            }
            else if (model != null && model instanceof ArrayModel) {
                let impl = model;
                let ap = new ArrayProperty().items(impl.getItems());
                ap.setRequired(param.getRequired());
                let cp = this.fromProperty("inner", ap);
                if (cp.complexType != null) {
                    imports.add(cp.complexType);
                }
                imports.add(cp.baseType);
                p.dataType = cp.datatype;
                p.baseType = cp.complexType;
                p.isPrimitiveType = cp.isPrimitiveType;
                p.isContainer = true;
                p.isListContainer = true;
                this.setParameterBooleanFlagWithCodegenProperty(p, cp);
            }
            else {
                let sub = bp.getSchema();
                if (sub != null && sub instanceof RefModel) {
                    let name = sub.getSimpleRef();
                    if (this.__typeMapping.containsKey(name)) {
                        name = this.__typeMapping.get(name);
                    }
                    else {
                        name = this.toModelName(name);
                        if (this.__defaultIncludes.contains(name)) {
                            imports.add(name);
                        }
                        imports.add(name);
                        name = this.getTypeDeclaration(name);
                    }
                    p.dataType = name;
                    p.baseType = name;
                }
            }
            p.paramName = this.toParamName(bp.getName());
        }
        if (p.vendorExtensions && p.vendorExtensions.containsKey("x-example")) {
            p.example = p.vendorExtensions.get("x-example") + '';
        }
        else if ((p.isString)) {
            p.example = p.paramName + "_example";
        }
        else if ((p.isBoolean)) {
            p.example = new String("true");
        }
        else if ((p.isLong)) {
            p.example = new String("789");
        }
        else if ((p.isInteger)) {
            p.example = new String("56");
        }
        else if ((p.isFloat)) {
            p.example = new String("3.4");
        }
        else if ((p.isDouble)) {
            p.example = new String("1.2");
        }
        else if ((p.isBinary)) {
            p.example = new String("BINARY_DATA_HERE");
        }
        else if ((p.isByteArray)) {
            p.example = new String("B");
        }
        else if ((p.isDate)) {
            p.example = new String("2013-10-20");
        }
        else if ((p.isDateTime)) {
            p.example = new String("2013-10-20T19:20:30+01:00");
        }
        else if ((param != null && param instanceof FormParameter) && (((o1, o2) => o1.toUpperCase() === (o2 === null ? o2 : o2.toUpperCase()))("file", param.getType()) || ("file" === p.baseType))) {
            p.isFile = true;
            p.example = new String("/path/to/file.txt");
        }
        this.setParameterExampleValue(p);
        if (param != null && param instanceof QueryParameter) {
            p.isQueryParam = true;
        }
        else if (param != null && param instanceof PathParameter) {
            p.required = true;
            p.isPathParam = true;
        }
        else if (param != null && param instanceof HeaderParameter) {
            p.isHeaderParam = true;
        }
        else if (param != null && param instanceof CookieParameter) {
            p.isCookieParam = true;
        }
        else if (param != null && param instanceof BodyParameter) {
            p.isBodyParam = true;
            p.isBinary = this.isDataTypeBinary(p.dataType);
        }
        else if (param != null && param instanceof FormParameter) {
            if (((o1, o2) => o1.toUpperCase() === (o2 === null ? o2 : o2.toUpperCase()))("file", param.getType())) {
                p.isFile = true;
            }
            else if (("file" === p.baseType)) {
                p.isFile = true;
            }
            else {
                p.notFile = true;
            }
            p.isFormParam = true;
        }
        this.postProcessParameter(p);
        return p;
    }

    isDataTypeBinary(dataType) {
        return ((str, searchString, position = 0) => str.substr(position, searchString.length) === searchString)(dataType.toLowerCase(), "byte");
    }

    /**
     * Convert map of Swagger SecuritySchemeDefinition objects to a list of Codegen Security objects
     *
     * @param schemes a map of Swagger SecuritySchemeDefinition object
     * @return a list of Codegen Security objects
     */
    fromSecurity(schemes) {
        if (schemes == null) {
            return Collections.emptyList();
        }
        let secs = [];
        for (let it = schemes.entrySet().iterator(); it.hasNext();) {
            let entry = it.next();
            let schemeDefinition = entry.getValue();
            let sec = CodegenModelFactory.newInstance(CodegenModelType.SECURITY);
            sec.name = entry.getKey();
            sec.type = schemeDefinition.getType();
            sec.isCode = sec.isPassword = sec.isApplication = sec.isImplicit = false;
            if (schemeDefinition != null && schemeDefinition instanceof ApiKeyAuthDefinition) {
                let apiKeyDefinition = schemeDefinition;
                sec.isBasic = sec.isOAuth = false;
                sec.isApiKey = true;
                sec.keyParamName = apiKeyDefinition.getName();
                sec.isKeyInHeader = apiKeyDefinition.getIn() === In.HEADER;
                sec.isKeyInQuery = !sec.isKeyInHeader;
            }
            else if (schemeDefinition != null && schemeDefinition instanceof BasicAuthDefinition) {
                sec.isKeyInHeader = sec.isKeyInQuery = sec.isApiKey = sec.isOAuth = false;
                sec.isBasic = true;
            }
            else {
                let oauth2Definition = schemeDefinition;
                sec.isKeyInHeader = sec.isKeyInQuery = sec.isApiKey = sec.isBasic = false;
                sec.isOAuth = true;
                sec.flow = oauth2Definition.getFlow();
                switch ((sec.flow)) {
                    case "accessCode":
                        sec.isCode = true;
                        break;
                    case "password":
                        sec.isPassword = true;
                        break;
                    case "application":
                        sec.isApplication = true;
                        break;
                    case "implicit":
                        sec.isImplicit = true;
                        break;
                    default:
                        throw new Error("unknown oauth flow: " + sec.flow);
                }
                sec.authorizationUrl = oauth2Definition.getAuthorizationUrl();
                sec.tokenUrl = oauth2Definition.getTokenUrl();
                if (oauth2Definition.getScopes() != null) {
                    let scopes = [];
                    let count = 0;
                    let numScopes = oauth2Definition.getScopes().size;
                    for (let index161 = oauth2Definition.getScopes().entrySet().iterator(); index161.hasNext();) {
                        let scopeEntry = index161.next();
                        {
                            let scope = newHashMap();
                            scope.put("scope", scopeEntry.getKey());
                            scope.put("description", scopeEntry.getValue());
                            count += 1;
                            if (count < numScopes) {
                                scope.put("hasMore", "true");
                            }
                            else {
                                scope.put("hasMore", null);
                            }
                            scopes.add(scope);
                        }
                    }
                    sec.scopes = scopes;
                }
            }
            sec.hasMore = it.hasNext();
            secs.add(sec);
        }
        return secs;
    }

    setReservedWordsLowerCase(words) {
        this.__reservedWords = newHashSet();
        for (const word of words) {
            this.__reservedWords.add(word.toLowerCase());
        }
    }

    isReservedWord(word) {
        return word != null && this.__reservedWords.contains(word.toLowerCase());
    }

    /**
     * Get operationId from the operation object, and if it's blank, generate a new one from the given parameters.
     *
     * @param operation the operation object
     * @param path the path of the operation
     * @param httpMethod the HTTP method of the operation
     * @return the (generated) operationId
     */
    getOrGenerateOperationId(operation, path, httpMethod) {
        let operationId = operation.getOperationId();
        if (StringUtils.isBlank(operationId)) {
            let tmpPath = path;
            tmpPath = tmpPath.replace(new RegExp("\\{", 'g'), "");
            tmpPath = tmpPath.replace(new RegExp("\\}", 'g'), "");
            let parts = (tmpPath + "/" + httpMethod).split("/");
            let builder = new StringBuilder();
            if (("/" === tmpPath)) {
                builder.append("root");
            }
            for (let i = 0; i < parts.length; i++) {
                let part = parts[i];
                if (part.length > 0) {
                    if (builder.toString().length === 0) {
                        part = part[0].toLowerCase() + part.substring(1);
                    }
                    else {
                        part = this.initialCaps(part);
                    }
                    builder.append(part);
                }
            }
            operationId = this.sanitizeName(builder.toString());
            Log.warn("Empty operationId found for path: " + httpMethod + " " + path + ". Renamed to auto-generated operationId: " + operationId);
        }
        return operationId;
    }

    /**
     * Check the type to see if it needs import the library/module/package
     *
     * @param type name of the type
     * @return true if the library/module/package of the corresponding type needs to be imported
     */
    needToImport(type) {
        return !this.__defaultIncludes.contains(type) && !this.__languageSpecificPrimitives.contains(type);
    }

    toExamples(examples) {
        if (examples == null) {
            return null;
        }
        let output = [];
        for (const [contentType, example] of examples) {
            output.push(newHashMap(["contentType", contentType, example], ["example", example]));
        }
        return output;
    }

    addHeaders(response, target) {
        if (response.getHeaders() != null) {
            for ([key, value] of response.getHeaders()) {
                target.add(this.fromProperty(key, value));
            }
        }
    }

    static addHasMore(objs) {

        if (objs == null) return;

        if (Array.isArray(objs)) {
            for (let i = 0, l = objs.length, lm = l - 1; i < l; i++) {
                if (i > 0) {
                    objs[i].secondaryParam = true;
                }
                if (i < lm) {
                    objs[i].hasMore = true;
                }
            }
            return objs;
        }
        //what? insanity
        for (let i = 0; i < objs.size - 1; i++) {
            if (i > 0) {
                objs.put("secondaryParam", true);
            }
            if (i < objs.size - 1) {
                objs.put("hasMore", true);
            }
        }
        return objs;
    }

    /**
     * Add operation to group
     *
     * @param tag name of the tag
     * @param resourcePath path of the resource
     * @param operation Swagger Operation object
     * @param co Codegen Operation object
     * @param operations map of Codegen operations
     */
    addOperationToGroup(tag, resourcePath, operation, co, operations) {
        let opList = operations.get(tag);
        if (opList == null) {
            opList = [];
            operations.put(tag, opList);
        }
        let uniqueName = co.operationId;
        let counter = 0;
        for (const op of opList) {
            if ((uniqueName === op.operationId)) {
                uniqueName = co.operationId + "_" + counter;
                counter++;
            }
        }
        if (!(co.operationId === uniqueName)) {
            Log.warn("generated unique operationId `" + uniqueName + "`");
        }
        co.operationId = uniqueName;
        co.operationIdLowerCase = uniqueName.toLowerCase();
        opList.add(co);
        co.baseName = tag;
    }

    addParentContainer(m, name, property) {
        let tmp = this.fromProperty(name, property);
        this.addImport(m, tmp.complexType);
        m.parent = this.toInstantiationType(property);
        let containerType = tmp.containerType;
        let instantiationType = this.__instantiationTypes.get(containerType);
        if (instantiationType != null) {
            this.addImport(m, instantiationType);
        }
        let mappedType = this.__typeMapping.get(containerType);
        if (mappedType != null) {
            this.addImport(m, mappedType);
        }
    }

    /**
     * Underscore the given word.
     * Copied from Twitter elephant bird
     * https://github.com/twitter/elephant-bird/blob/master/core/src/main/java/com/twitter/elephantbird/util/Strings.java
     *
     * @param word The word
     * @return The underscored version of the word
     */
    static underscore(word) {
        let firstPattern = "([A-Z]+)([A-Z][a-z])";
        let secondPattern = "([a-z\\d])([A-Z])";
        let replacementPattern = "$1_$2";
        word = word.replace(new RegExp("\\.", 'g'), "/");
        word = word.replace(new RegExp("\\$", 'g'), "__");
        word = word.replace(new RegExp(firstPattern, 'g'), replacementPattern);
        word = word.replace(new RegExp(secondPattern, 'g'), replacementPattern);
        word = word.split('-').join('_');
        word = word.toLowerCase();
        return word;
    }

    /**
     * Dashize the given word.
     *
     * @param word The word
     * @return The dashized version of the word, e.g. "my-name"
     */
    dashize(word) {
        return DefaultCodegen.underscore(word).replace(new RegExp("[_ ]", 'g'), "-");
    }

    /**
     * Generate the next name for the given name, i.e. append "2" to the base name if not ending with a number,
     * otherwise increase the number by 1. For example:
     * status    => status2
     * status2   => status3
     * myName100 => myName101
     *
     * @param name The base name
     * @return The next name for the base name
     */
    static generateNextName(name) {
        const re = /(\d{1,})/;
        if (re.test(name)) {
            return name.replace(re, _count2);
        }
        return name + '2';
    }

    addImport(m, type) {
        if (type != null && this.needToImport(type)) {
            m.imports.add(type);
        }
    }

    addVars(m, properties, required, allProperties, allRequired) {
        if (arguments.length > 4) {
            m.hasRequired = false;
            if (properties != null && !properties.isEmpty()) {
                m.hasVars = true;
                m.hasEnums = false;
                let mandatory = required == null ? Collections.emptySet() : new TreeSet(required);
                this.addVars(m, m.vars, properties, mandatory);
                m.allMandatory = m.mandatory = mandatory;
            }
            else {
                m.emptyVars = true;
                m.hasVars = false;
                m.hasEnums = false;
            }
            if (allProperties != null) {
                let allMandatory = allRequired == null ? Collections.emptySet() : new TreeSet(allRequired);
                this.addVars(m, m.allVars, allProperties, allMandatory);
                m.allMandatory = allMandatory;
            }
        }
        else if (arguments.length > 3) {
            return this._addVars(m, properties, required, allProperties);
        }
        else {
            return this.addVars(m, properties, required, null, null);
        }
    }

    _addVars(m, vars, properties, mandatory) {
        let propertyList = Array.from(properties.entrySet());
        let totalCount = propertyList.length;
        for (let i = 0; i < totalCount; i++) {
            let entry = propertyList[i]
            let key = entry.getKey();
            let prop = entry.getValue();
            if (prop == null) {
                Log.warn("null property for " + key);
            }
            else {
                let cp = this.fromProperty(key, prop);
                cp.required = mandatory.contains(key) ? true : null;
                m.hasRequired = ( m.hasRequired) || ( cp.required);
                if (cp.isEnum) {
                    m.hasEnums = true;
                }
                if (!( cp.isReadOnly)) {
                    m.hasOnlyReadOnly = false;
                }
                if (i + 1 !== totalCount) {
                    cp.hasMore = true;
                    if (!(propertyList[i + 1].getValue().getReadOnly())) {
                        cp.hasMoreNonReadOnly = true;
                    }
                }
                if (cp.isContainer != null) {
                    this.addImport(m, this.__typeMapping.get("array"));
                }
                this.addImport(m, cp.baseType);
                let innerCp = cp;
                while ((innerCp != null)) {
                    this.addImport(m, innerCp.complexType);
                    innerCp = innerCp.items;
                }

                vars.add(cp);
                if (cp.required) {
                    m.requiredVars.add(cp);
                }
                else {
                    m.optionalVars.add(cp);
                }
                if (( cp.isReadOnly)) {
                    m.readOnlyVars.add(cp);
                }
                else {
                    m.readWriteVars.add(cp);
                }
            }
        }
    }

    /**
     * Remove characters that is not good to be included in method name from the input and camelize it
     *
     * @param name string to be camelize
     * @param nonNameElementPattern a regex pattern of the characters that is not good to be included in name
     * @return camelized string
     */
    removeNonNameElementToCamelCase(name, nonNameElementPattern = "[-_:;#]") {
        let result = StringUtils.join(Lists.transform(Lists.newArrayList(name.split(nonNameElementPattern)), (input) => StringUtils.capitalize(input)), "");
        if (result.length > 0) {
            result = result.substring(0, 1).toLowerCase() + result.substring(1);
        }
        return result;
    }

    /**
     * Camelize name (parameter, property, method, etc)
     *
     * @param word string to be camelize
     * @param lowercaseFirstLetter lower case for first letter if set to true
     * @return camelized string
     */
    static camelize(word, lowercaseFirstLetter = false) {
        word = camelCase(word);
        return word && word[0][lowercaseFirstLetter ? 'toLowerCase' : 'toUpperCase']() + word.substring(1);

    }

    apiFilename(templateName, tag) {
        let suffix = this.apiTemplateFiles().get(templateName);
        return this.apiFileFolder() + '/' + this.toApiFilename(tag) + suffix;
    }

    /**
     * Return the full path and API documentation file
     *
     * @param templateName template name
     * @param tag tag
     *
     * @return the API documentation file name with full path
     */
    apiDocFilename(templateName, tag) {
        let suffix = this.apiDocTemplateFiles().get(templateName);
        return this.apiDocFileFolder() + '/' + this.toApiDocFilename(tag) + suffix;
    }

    /**
     * Return the full path and API test file
     *
     * @param templateName template name
     * @param tag tag
     *
     * @return the API test file name with full path
     */
    apiTestFilename(templateName, tag) {
        let suffix = this.apiTestTemplateFiles().get(templateName);
        return this.apiTestFileFolder() + '/' + this.toApiTestFilename(tag) + suffix;
    }

    shouldOverwrite(filename) {
        return !(this.skipOverwrite && new File(filename).exists());
    }

    isSkipOverwrite() {
        return this.skipOverwrite;
    }

    setSkipOverwrite(skipOverwrite) {
        this.skipOverwrite = skipOverwrite;
    }

    /**
     * All library templates supported.
     * (key: library name, value: library description)
     * @return the supported libraries
     */
    supportedLibraries() {
        return this.__supportedLibraries;
    }

    /**
     * Set library template (sub-template).
     *
     * @param library Library template
     */
    setLibrary(library) {
        if (library != null && !this.__supportedLibraries.containsKey(library))
            throw new Error("unknown library: " + library);
        this.library = library;
    }

    /**
     * Library template (sub-template).
     *
     * @return Library template
     */
    getLibrary() {
        return this.library;
    }

    /**
     * Set Git user ID.
     *
     * @param gitUserId Git user ID
     */
    setGitUserId(gitUserId) {
        this.gitUserId = gitUserId;
    }

    /**
     * Git user ID
     *
     * @return Git user ID
     */
    getGitUserId() {
        return this.gitUserId;
    }

    /**
     * Set Git repo ID.
     *
     * @param gitRepoId Git repo ID
     */
    setGitRepoId(gitRepoId) {
        this.gitRepoId = gitRepoId;
    }

    /**
     * Git repo ID
     *
     * @return Git repo ID
     */
    getGitRepoId() {
        return this.gitRepoId;
    }

    /**
     * Set release note.
     *
     * @param releaseNote Release note
     */
    setReleaseNote(releaseNote) {
        this.releaseNote = releaseNote;
    }

    /**
     * Release note
     *
     * @return Release note
     */
    getReleaseNote() {
        return this.releaseNote;
    }

    /**
     * Set HTTP user agent.
     *
     * @param httpUserAgent HTTP user agent
     */
    setHttpUserAgent(httpUserAgent) {
        this.httpUserAgent = httpUserAgent;
    }

    /**
     * HTTP user agent
     *
     * @return HTTP user agent
     */
    getHttpUserAgent() {
        return this.httpUserAgent;
    }

    buildLibraryCliOption(supportedLibraries) {
        let sb = new StringBuilder("library template (sub-template) to use:");
        for (let index167 = supportedLibraries.keySet().iterator(); index167.hasNext();) {
            let lib = index167.next();
            {
                sb.append("\n").append(lib).append(" - ").append(supportedLibraries.get(lib));
            }
        }
        return new CliOption("library", sb.toString());
    }

    /**
     * Sanitize name (parameter, property, method, etc)
     *
     * @param name string to be sanitize
     * @return sanitized string
     */
    sanitizeName(name) {
        if (name == null) {
            Log.error("String to be sanitized is null. Default to ERROR_UNKNOWN");
            return "ERROR_UNKNOWN";
        }
        if (("$" === name)) {
            return "value";
        }
        name = name.replace(new RegExp("\\[\\]", 'g'), "");
        name = name.replace(new RegExp("\\[", 'g'), "_");
        name = name.replace(new RegExp("\\]", 'g'), "");
        name = name.replace(new RegExp("\\(", 'g'), "_");
        name = name.replace(new RegExp("\\)", 'g'), "");
        name = name.replace(new RegExp("\\.", 'g'), "_");
        name = name.replace(new RegExp("-", 'g'), "_");
        name = name.replace(new RegExp(" ", 'g'), "_");
        return name.replace(new RegExp("[^a-zA-Z0-9_]", 'g'), "");
    }

    /**
     * Sanitize tag
     *
     * @param tag Tag
     * @return Sanitized tag
     */
    sanitizeTag(tag) {
        let parts = tag.split(" ");
        let buf = new StringBuilder();
        for (let index168 = 0; index168 < parts.length; index168++) {
            let part = parts[index168];
            {
                if (StringUtils.isNotEmpty(part)) {
                    buf.append(StringUtils.capitalize(part));
                }
            }
        }
        return buf.toString().replace(new RegExp("[^a-zA-Z ]", 'g'), "");
    }

    /**
     * Only write if the file doesn't exist
     *
     * @param outputFolder Output folder
     * @param supportingFile Supporting file
     */
    writeOptional(outputFolder, supportingFile) {
        let folder = "";
        if (outputFolder != null && !("" === outputFolder)) {
            folder += outputFolder + File.separator;
        }
        folder += supportingFile.folder;
        if (!("" === folder)) {
            folder += File.separator + supportingFile.destinationFilename;
        }
        else {
            folder = supportingFile.destinationFilename;
        }
        if (!new File(folder).exists()) {
            this.__supportingFiles.add(supportingFile);
        }
        else {
            Log.info("Skipped overwriting " + supportingFile.destinationFilename + " as the file already exists in " + folder);
        }
    }

    /**
     * Set CodegenParameter boolean flag using CodegenProperty.
     *
     * @param parameter Codegen Parameter
     * @param property  Codegen property
     */
    setParameterBooleanFlagWithCodegenProperty(parameter, property) {
        if (parameter == null) {
            Log.error("Codegen Parameter cannnot be null.");
            return;
        }
        if (property == null) {
            Log.error("Codegen Property cannot be null.");
            return;
        }
        if (( property.isString)) {
            parameter.isString = true;
            parameter.isPrimitiveType = true;
        }
        else if (( property.isBoolean)) {
            parameter.isBoolean = true;
            parameter.isPrimitiveType = true;
        }
        else if (( property.isLong)) {
            parameter.isLong = true;
            parameter.isPrimitiveType = true;
        }
        else if (( property.isInteger)) {
            parameter.isInteger = true;
            parameter.isPrimitiveType = true;
        }
        else if (( property.isDouble)) {
            parameter.isDouble = true;
            parameter.isPrimitiveType = true;
        }
        else if (( property.isFloat)) {
            parameter.isFloat = true;
            parameter.isPrimitiveType = true;
        }
        else if (( property.isByteArray)) {
            parameter.isByteArray = true;
            parameter.isPrimitiveType = true;
        }
        else if (( property.isBinary)) {
            parameter.isByteArray = true;
            parameter.isPrimitiveType = true;
        }
        else if (( property.isDate)) {
            parameter.isDate = true;
            parameter.isPrimitiveType = true;
        }
        else if (( property.isDateTime)) {
            parameter.isDateTime = true;
            parameter.isPrimitiveType = true;
        }
        else {
            Log.debug("Property type is not primitive: " + property.datatype);
        }
    }

    /**
     * Update codegen property's enum by adding "enumVars" (with name and value)
     *
     * @param var list of CodegenProperty
     */
    updateCodegenPropertyEnum(__var) {
        let allowableValues = __var.allowableValues;
        if (__var.items != null) {
            allowableValues = __var.items.allowableValues;
        }
        if (allowableValues == null) {
            return;
        }
        let values = allowableValues.get("values");
        if (values == null) {
            return;
        }
        let enumVars = []
        let commonPrefix = this.findCommonPrefixOfVars(values);
        let truncateIdx = commonPrefix.length;
        for (const value of values) {
            let enumVar = newHashMap();
            let enumName;
            if (truncateIdx === 0) {
                enumName = value.toString();
            }
            else {
                enumName = value.toString().substring(truncateIdx);
                if (("" === enumName)) {
                    enumName = value.toString();
                }
            }
            enumVar.put("name", this.toEnumVarName(enumName, __var.datatype));
            enumVar.put("value", this.toEnumValue(value.toString(), __var.datatype));
            enumVars.push(enumVar);
        }
        allowableValues.put("enumVars", enumVars);
        if (__var.defaultValue != null) {
            let enumName = null;
            for (const enumVar of enumVars) {
                if ((this.toEnumValue(__var.defaultValue, __var.datatype) === enumVar.get("value"))) {
                    enumName = enumVar.get("name");
                    break;
                }
            }
            if (enumName != null) {
                __var.defaultValue = this.toEnumDefaultValue(enumName, __var.datatypeWithEnum);
            }
        }
    }
}
const Log = LoggerFactory.getLogger(DefaultCodegen);
