const {spawn} = require("child_process");
const path = require("path");


const DB_NAME = "DrugStore";
const DB_PATH = path.join(__dirname,'public',`${DB_NAME}.gzip`);


const getBackup= () => {
    try {
        console.log("in getBackup")
        const child = spawn('mongodump',[
            `--db=${DB_NAME}`,
            `--archive=${DB_PATH}`,
            '--gzip'
        ])
        child.stdout.on('data',(data) => {
            console.log("stdout:\n",data);
        })
        child.stderr.on('data',(data) => {
            console.log("stderr:\n",data);
        })
        child.on('error',(error) => {
            console.log("error:\n",error);
        })
        child.on('exit',(code,signal) => {
            if (code) console.log("process exit with code : " + code);
            else if (signal) console.log("process killed by signal : " + signal);
            else console.log("backup is done");
        })
    } catch (e) {
       console.log(e)
    }
}

exports.getBackup = getBackup;