import SupportingFile from './SupportingFile';

export default class GlobalSupportingFile extends SupportingFile {
    constructor(templateFile, folder, destinationFilename) {
        if (arguments.length < 3) {
            super(templateFile, folder);
        } else {
            super(templateFile, folder, destinationFilename);
        }
    }
}
