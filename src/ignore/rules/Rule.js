import IgnoreToken from "./IgnoreToken";
import StringBuilder from "../../java/StringBuilder";
export class Rule {
    static Operation = {
        EXCLUDE: 0,
        INCLUDE: 1,
        NOOP: 2,
        EXCLUDE_AND_TERMINATE: 3
    };

    constructor(syntax, definition) {
        this.syntax = syntax;
        this.definition = definition;
    }

    getDefinition() {
        return this.definition;
    }

    getPattern() {
        if (this.syntax == null)
            return this.definition;
        const sb = new StringBuilder();
        for (const current of this.syntax) {

            const token = current.getToken();

            switch (token.name) {
                case IgnoreToken.MATCH_ALL.name:
                case IgnoreToken.MATCH_ANY.name:
                case IgnoreToken.ESCAPED_EXCLAMATION.name:
                case IgnoreToken.ESCAPED_SPACE.name:
                case IgnoreToken.PATH_DELIM.name:
                case IgnoreToken.TEXT.name:
                case IgnoreToken.DIRECTORY_MARKER.name:
                    sb.append(current.getValue());
                    break;
                case IgnoreToken.NEGATE.name:
                case IgnoreToken.ROOTED_MARKER.name:
                case IgnoreToken.COMMENT.name:
                    break;
            }
        }
        return sb.toString();
    }

    /**
     * Whether or not the rule should be negated. !foo means foo should be removed from previous matches.
     * Example: **\/*.bak excludes all backup. Adding !/test.bak will include test.bak in the project root.
     * <p>
     * NOTE: It is not possible to re-include a file if a parent directory of that file is excluded.
     */
    getNegated() {
        const negated = this.syntax != null && this.syntax.length > 0 && this.syntax[0].getToken().equals(IgnoreToken.NEGATE);
        return negated;
    }

    evaluate(relativePath) {
        if (this.matches(relativePath)) {
            if (this.getNegated()) {
                return this.getIncludeOperation();
            }
            return this.getExcludeOperation();
        }
        return Rule.Operation.NOOP;
    }

    getIncludeOperation() {
        return Rule.Operation.INCLUDE;
    }

    getExcludeOperation() {
        return Rule.Operation.EXCLUDE;
    }


}
