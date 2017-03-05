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
        },
        length(){
            return _str.length;
        },
        charAt(idx){
            return _str[idx];
        },
        setCharAt(idx, ch){
            _str[idx] = ch;
            return ret;
        },
        replace(start, end, str){
            const before = str.substring(0, start);
            const after = str.substring(end);
            _str = before + str + after;
            return ret;
        },
        codePointAt(at){
            return _str.codePointAt(at);
        }
    };

    ret.append(...strs);

    return ret;
}
