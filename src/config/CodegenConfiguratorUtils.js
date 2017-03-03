import  OptionUtils  from '../utils/OptionUtils';
import {newHashMap} from '../java/javaUtil';

/**
 * Contains shared logic for applying key-value pairs and CSV strings
 * to specific settings in CodegenConfigurator.
 *
 * <p>
 * This class exists to facilitate testing. These methods could be applied
 * to CodegenConfigurator, but this complicates things when mocking CodegenConfigurator.
 * </p>
 */
export function applySystemPropertiesKvp(systemProperties, configurator) {
    for (const [key, value] of createMapFromKeyValuePairs(systemProperties)) {
        configurator.addSystemProperty(key, value);
    }
}

export function applyInstantiationTypesKvp(instantiationTypes, configurator) {
    for (const [key, value] of createMapFromKeyValuePairs(instantiationTypes)) {
        configurator.addInstantiationType(key, value);
    }
}

export function applyImportMappingsKvp(importMappings, configurator) {
    for (const [key, value] of createMapFromKeyValuePairs(importMappings)) {
        configurator.addImportMapping(key, value);
    }
}

export function applyTypeMappingsKvp(typeMappings, configurator) {
    for (const [key, value] of createMapFromKeyValuePairs(typeMappings)) {
        configurator.addTypeMapping(key, value);
    }
}

export function applyAdditionalPropertiesKvp(additionalProperties, configurator) {
    for (let entry of createMapFromKeyValuePairs(additionalProperties)) {
        configurator.addAdditionalProperty(entry.getKey(), entry.getValue());
    }
}

export function applyLanguageSpecificPrimitivesCsv(languageSpecificPrimitives, configurator) {
    for (const item of createSetFromCsvList(languageSpecificPrimitives)) {
        configurator.addLanguageSpecificPrimitive(item);
    }
}

export function createSetFromCsvList(csvProperty) {
    return newHashMap(OptionUtils.splitCommaSeparatedList(csvProperty));
}

export function createMapFromKeyValuePairs(commaSeparatedKVPairs) {
    const result = newHashMap();
    for (const pair of OptionUtils.parseCommaSeparatedTuples(commaSeparatedKVPairs)) {
        result.put(pair.getLeft(), pair.getRight());
    }
    return result;
}

export default ({
    applySystemPropertiesKvp,
    applyInstantiationTypesKvp,
    applyImportMappingsKvp,
    applyTypeMappingsKvp,
    applyAdditionalPropertiesKvp,
    applyLanguageSpecificPrimitivesCsv,
    createSetFromCsvList,
    createMapFromKeyValuePairs
})
