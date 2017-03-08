import {expect, assert} from "chai";
import _tmp from "tmp";
import fs from "fs";
import {exec, execSync} from "child_process";
import dirCompare from "dir-compare";
import path from "path";
import shell from "shelljs";


/**
 * Sets up an environment for tests.
 *
 * @param workingCwd - It tries to resolve your test directory.  You are better off passing __dirname from your test
 * so that it will work regardless of the directory it is invoked.  This is a best guess and should work most times.
 * @param - excludeFilter - a function that will pass in an object and exclude it if the function returns true.  Used when doing a compare
 * @param - log - a function for logging.
 * @returns {*}
 */
const EMPTY_FUNC = () => {
};
const excludeFilterRe = /node_modules(\/|$)|yarn\.lock|gradle\.build|API\.xcodeproj|.DS_Store/;
const _excludeFilter = ({name1, name2, relativePath}) => excludeFilterRe.test(relativePath) || excludeFilterRe.test(name2) || excludeFilterRe.test(name1);

export default function setup(workingCwd = path.join(process.cwd(), 'test'), log = EMPTY_FUNC) {
    let tmpDir, clean;


    const runBefore = function () {
        return new Promise((resolve, reject) => _tmp.dir({
            mode: '0750',
            keep: true,
            prefix: 'ern_test'
        }, (e, _tmpDir, _clean) => {
            if (e) return reject(e);
            api.log(`tmpDir`, _tmpDir, '\n\n');
            tmpDir = _tmpDir;
            clean = _clean;
            resolve();
        }));
    };

    const runAfter = function (done) {
           tmpDir && shell.rm('-rf', tmpDir);
        return done();
    };

    const cwd = (...args) => {
        return path.resolve(tmpDir, ...args);
    };
    const compare = (src, dest, excludeFilter = _excludeFilter) => () => {
        dest = path.join(workingCwd, dest);
        src = api.cwd(src);
        console.log(`
        
        
Comparing ${src} to ${dest};


`);
        if (!fs.existsSync(dest)) {
            shell.mkdir('-p', path.join(dest, '..'));
            shell.cp('-r', src, dest);
            return Promise.resolve(true);
        } else {
            return dirCompare.compare(src, dest, {
                compareDate: false,
                dateTolerance: 500000,
                compareContent: true
            }).then((resp = {diffSet: []}) => {
                const {diffSet} = resp;

                for (const diff of diffSet) {
                    if (!diff.name2) {
                        assert(false, `${diff.relativePath} is missing ${diff.name1}`)
                    }
                    const nf = `${diff.path1}/${diff.name1}`;
                    const of = `${dest}/${diff.relativePath.replace(/^\//, '')}/${diff.name2}`
                    if (!excludeFilter(diff) && diff.state != 'equal') {
                        const cmd = `git diff --ignore-blank-lines --ignore-space-at-eol -b -w ${nf} ${of}`;
                        try {
                            execSync(cmd);
                        } catch (e) {
                            console.log(`ERROR:\n file ${nf}\n`, cmd)
                            const diffOut = e.output.filter(Boolean).map(v => v + '').join('\n');
                            assert(false, `Not the same ${diff.relativePath.replace(/^\//, '')}/${diff.name2} ${diff.path1}/${diff.name1}
${diffOut}  
`);
                            execSync(`pbcopy`, {})
                        }
                    }
                }
                return true;
            });
        }
    };
    const exists = (file) => () => assert(fs.existsSync(api.cwd(file)), `Expected "${file}" to exist`);
    const execIn = (cmd, opts) => new Promise((resolve, reject) => {
        exec(cmd, Object.assign({}, opts, {cwd: api.cwd(cmd.cwd)}), (err, stdout, stderr) => {
            if (err) return reject(err);
            resolve({stdout, stderr});
        });
    });

    const gradle = (project, cmd = 'build') => () => new Promise((resolve, reject) => {
        exec(`${api.cwd(project, 'android', 'gradlew')} ${cmd}`, {cwd: api.cwd(project, 'android')}, (err, stdout, stderr) => {
            if (err) return reject(err);
            /BUILD SUCCESSFUL/.test(stdout);
            resolve();
        });
    });

    const json = (file, _test) => () => {
        assert(fs.existsSync(api.cwd(file)), `File should exist ${api.cwd(file)}`);
        const ret = JSON.parse(fs.readFileSync(api.cwd(file), 'utf8'));
        if (_test) {
            if (typeof _test === 'function') {
                return _test(ret)
            }
            expect(ret, `Compare to "${file}" `).to.contain(_test);
        }
        return ret;
    };
    const has = (src) => (result) => {
        expect(result).to.contain(src);
        return result;
    };

    const api = {
        log,
        execIn,
        runBefore,
        runAfter,
        gradle,
        compare,
        exists,
        json,
        has,
        cwd,
        fail(message = `This should fail if executed`){
            return () => {
                throw new Error(message)
            };
        }
    };
    return api;
}
