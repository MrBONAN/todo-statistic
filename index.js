const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function extractTODO() {
    let comments = [];
    const todoConst = '//' + ' TODO';
    for (const fileContent of files) {
        const lines = fileContent.split('\n');
        for (const line of lines) {
            if (line.includes(todoConst)) {
                comments.push(line.split(todoConst)[1].trim());
            }
        }
    }
    return comments;
}

function exctractImportant(comments) {
    let important = [];
    for (const comment of comments) {
        if (comment.includes("!")) {
            important.push(comment);
        }
    }
    return important;
}

function filterByUser(user, comments) {
    const userLowerCase = user.toLowerCase();
    return comments.filter((comment) => comment.toLowerCase().startsWith(userLowerCase + ';'));
}

function filterByImportant(comments) {
    return comments.sort((cmnt1, cmnt2) => cmnt2.split('!').length - cmnt1.split('!').length);
}

function sortComments(flag, comments) {
    switch (flag) {
        case 'importance':
            return filterByImportant(comments);
        case 'user':
            return filterByUsers(comments);
        case 'date':
            return filterByDate(comments);
    }
}

function filterByDate(comments) {
    let arr = [];
    for (const comment of comments) {
        let date = new Date(comment.split(";")[1]);
        arr.push({date, comment});
    }
    arr.sort((a, b) => b.date - a.date);
    return arr.map(x => x.comment);
}

function filterByUsers(comments) {
    let arr = [];
    for (const comment of comments) {
        let username = comment.split(";")[0].toLowerCase();
        arr.push({username, comment});
    }
    arr.sort((a, b) => a.username.localeCompare(b.username));
    return arr.map(x => x.comment);
}


function processCommand(command) {
    let [commandName, ...args] = command.split(' ');
    const comments = extractTODO()
    switch (commandName) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(comments);
            break;
        case 'important':
            console.log(exctractImportant(comments));
            break;
        case 'user':
            console.log(filterByUser(args[0], comments));
            break;
        case 'sort':
            console.log(sortComments(args[0], comments));
            break;
        default:
            console.log('wrong command');
            break;
    }
}