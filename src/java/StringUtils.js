import _snakeCase from "lodash/snakeCase";
const EMPTY = "";
const INDEX_NOT_FOUND = -1;

function indexOfDifference(cs1, cs2) {
    if (cs1 == cs2) {
        return INDEX_NOT_FOUND;
    }
    if (cs1 == null || cs2 == null) {
        return 0;
    }
    let i = 0
    for (; i < cs1.length && i < cs2.length; ++i)
        if (cs1[i] != cs2[i])
            break;


    if (i < cs2.length || i < cs1.length) return i;

    return INDEX_NOT_FOUND;
}

export function getCommonPrefix(...strs) {
    if (strs.length == 0) {
        return EMPTY;
    }
    const smallestIndexOfDiff = indexOfDifference(strs);
    if (smallestIndexOfDiff == INDEX_NOT_FOUND) {
        // all strings were identical
        if (strs[0] == null) {
            return EMPTY;
        }
        return strs[0];
    } else if (smallestIndexOfDiff == 0) {
        // there were no common initial characters
        return EMPTY;
    } else {
        // we found a common initial character sequence
        return strs[0].substring(0, smallestIndexOfDiff);
    }
}

export function isEmpty(str) {
    return (str == null || str === "" || str.length == 0);
}
export function isNotEmpty(str) {
    return !isEmpty(str);
}
export function capitalize(str) {
    if (isEmpty(str)) {
        return "";
    }
    return str[0].toUpperCase() + str.substring(1);
}
export function isBlank(str) {
    return isEmpty(str) || str.trim().length === 0;
}
export function isNotBlank(str) {
    return !isBlank(str);
}
export function join(arr, char) {
    return char ? arr.join(char) : arr.join();
}

export function lowerFirst(word) {
    if (isBlank(word))return word;
    return word[0].toLowerCase() + word.substring(1);
}
export function camelize(word, lowerFirst) {
    if (isBlank(word))return word;

    const ret = word.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, i) => lowerFirst && i == 0 ? letter.toLowerCase() : letter.toUpperCase()).replace(/\s+/g, '');
    return ret;
}
export const snakeCase = _snakeCase;
export const compareTo = (value, anotherString) => {
    if (value == null && anotherString == null) return 0;
    if (value != null && anotherString == null) return 1;
    if (value == null && anotherString != null) return -1;

    const len1 = value.length;
    const len2 = anotherString.length;

    for (let k = 0, lim = Math.min(value.length, anotherString.length); k < lim; k++) {
        const c1 = value[k];
        const c2 = anotherString[k];
        if (c1 != c2) {
            return c1 - c2;
        }
    }
    return len1 - len2;
};

export default ({
    compareTo,
    join,
    snakeCase,
    camelize,
    lowerFirst,
    getCommonPrefix,
    isEmpty,
    isNotEmpty,
    capitalize,
    isBlank,
    isNotBlank,
    indexOfDifference
})
