const isValidString = (arg) => {
    if (arg == null) return false;
    if (arg.trim().isEmpty()) return false;
    return true;
};

export default class Pair {

    static to = (left, right) => new Pair(left, right);

    constructor(left, right) {
        this.left = left;
        this.right = right;
    }

    getLeft() {
        return this.left;
    }

    getRight() {
        return this.right;
    }

}
