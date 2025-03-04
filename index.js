const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function extractTODO(){
    let comments = [];
    for (const fileContent of files) {
        const lines = fileContent.split('\n');
        for (const line of lines) {
            if (line.includes("// TODO")){
                comments.push(line.split("// TODO")[1].trim());
            };
        }
    }
    return comments;
}

function exctractImportant(comments){
    let important = [];
    for (const comment of comments){
        if (comment.includes("!")){
            important.push(comment);
        }
    }
    return important;
}


function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(extractTODO());
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
