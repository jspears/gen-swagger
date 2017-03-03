export default function StringBuilder(...strs) {
    let _str = "";
    const ret = {
        append(...strs) {
            for (const str of strs) {
                _str += str;
            }
            return ret;
        },
        toString() {
            return _str;
        }
    };

    ret.append(...strs);

    return ret;
}
