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
        }
    };

    ret.append(...strs);

    return ret;
}
