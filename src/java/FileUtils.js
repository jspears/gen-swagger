import fs from 'fs';
export default ({
    writeStringToFile(file, content){
        fs.writeFileSync(file.getPath(), content, 'utf-8');
    }
})
