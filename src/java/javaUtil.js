import SortedMap from "collections/sorted-map";

/**
 * This provides a bunch of Java like classes.  Collections, HashMap, HashSet
 * TreeMap and a few conviences.   Attention has been paid to make it look very
 * similar, however they are not identically. Specifically "size" is not a function
 * it still a property.   This is mostly due to fear, of what will break if we change
 * that value.
 *
 * It should be useful for Java programmers coming to JS and for porting code from JS->JavaScript
 *
 * These classes are meant to be convient hence iteration.
 *
 */

function makeCompare(obj) {
    const compare = makeSort(obj);
    return compare ? (a, b) => compare(a, b) === 0 : null;
}
function makeSort(obj) {
    return obj && obj.compare.bind(obj);
}
/**
 * Makes a Java style iterator from a JS style iterator.
 * @returns {*}
 * @private
 */
const _iterator = function () {
    const itr = this[Symbol.iterator]();
    let c = itr.next();
    return {
        next(){
            const value = c.value;
            c = itr.next();
            return value;
        },
        hasNext(){
            return !c.done;
        }
    };
};

export class TreeMap extends SortedMap {
    iterator = _iterator;

    //(new SortedMap(null, (a, b) => sorter.compare(a, b) == 0, sorter.compare)
    constructor(map, comparator) {
        super(comparator ? map : null, makeCompare(comparator || map), makeSort(comparator || map));
    }

    put(k, v) {
        this.set(k, v);

    }

    putAll(itr) {
        for (const i in itr) {
            this.set(...it);
        }
    }

    isEmpty() {
        return this.size === 0;
    }

    keySet() {
        const hs = new HashSet();
        for (const [key] of this) {
            hs.add(key);
        }
        return hs;
    }

    [Symbol.iterator]() {
        return this.entries();
    }
}

export class HashMap extends Map {

    put(key, value) {
        this.set(key, value);
    }

    containsKey(key) {
        return this.has(key);
    }

    containsValue(value) {
        for (const v of this.values()) {
            if (v === value) return true;
        }
        return false;
    }

    putAll(itr) {
        for (const [key, val] of itr) {
            this.set(key, val);
        }
    }

    toJSON() {
        const ret = {};
        for (const [key, value] of this) {
            ret[key] = value;
        }
        return ret;
    }

    isEmpty() {
        return this.size == 0;
    }

    keySet() {
        return new HashSet(this.keys());
    }

    entrySet() {
        const ret = new HashSet();
        for (const e of this) {
            e.getKey = () => e[0];
            e.getValue = () => e[1];
            ret.add(e);
        }
        return ret;
    }

    toString() {
        return JSON.stringify(this.toJSON())
    }
}

export class HashSet extends Set {
    iterator = _iterator;

    contains(value) {
        return this.has(value);
    }

    isEmpty() {
        return this.size == 0;
    }

    add(val) {
        const size = this.size;
        return super.add(val).size !== size;
    }

    addAll(itr) {
        const size = this.size;
        for (const val of itr) this.add(val);
        return size != this.size;
    }

    containsAll(itr) {
        for (const val of itr) if (!this.has(val)) return false;
        return true;
    }

    remove(val) {
        return this.delete(val);
    }

    removeAll(itr) {
        const size = this.size;
        for (const val of itr) this.delete(val);
        return size != this.size;
    }

    retainAll(itr) {
        const set = itr instanceof Set ? itr : new Set(itr);
        const size = this.size;
        for (const val of this) if (!set.has(val)) this.remove(val);

        return size != this.size;
    }

    toArray() {
        return Array.from(this);
    }

    toJSON() {
        const ret = [];
        for (const value of this) ret.push(value);
        return ret;
    }

    toString() {
        return JSON.stringify(this.toJSON())
    }


}


export const Collections = {
    sort(arr, comparator){
        return arr && arr.sort(comparator);
    },
    emptyList(){
        return EMPTY_LIST;
    },
    emptySet(){
        return HASH_SET
    },
    emptyHashMap(){
        return HASH_MAP;
    }
};

export const Arrays = {
    asList(...args)
    {
        return args;
    }
};

export const Lists = {
    transform(arr, fn){
        return arr.map(fn);
    },
    newArrayList(arr){
        return arr ? arr.concat() : [];
    }
};

const MATCHES_CACHE = {};

export const matches = (str, pattern, opts) => {
    return (MATCHES_CACHE[pattern] || (MATCHES_CACHE[pattern] = new RegExp(pattern, opts))).test(str);
};

export const LinkedHashMap = HashMap;
export const LinkedHashSet = HashSet;
export const newHashMap = (...args) => new HashMap(args);
export const newHashSet = (...args) => new HashSet(args);

const EMPTY_LIST = Object.freeze([]);
const HASH_SET = Object.freeze(newHashSet());
const HASH_MAP = Object.freeze(newHashMap());
