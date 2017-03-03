import shell from 'shelljs';

export default ({

    copy(src, out){
        const fsrc = new File(src), fout = new File(out);
        fout.getParent().mkdirs();
        shell.copy('-f', fsrc.getPath(), fout.getPath());
    }
})
