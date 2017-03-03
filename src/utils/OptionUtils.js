import {isNotEmpty} from '../java/StringUtils';
import {ArrayList} from "./java/javaUtil";
import Pair from '../java/Pair';

export const parseCommaSeparatedTuples = (input) => {
    let results = [];
    for (const tuple of splitCommaSeparatedList(input)) {
        const [name, value] =  tuple.split('=', 2);
        if (name != null && value != null) {
            results.push(Pair.of(name, value));
        }
    }
    return results;
};

export const splitCommaSeparatedList = (input) => {
    const results = [];
    if (isNotEmpty(input))
        for (const value of input.split(",")) {
            if (isNotEmpty(value))
                results.push(value);
        }
    return results;
};
export  default ({parseCommaSeparatedTuples, splitCommaSeparatedList});
