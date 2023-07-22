/*
    TODO: Write logs to file
*/
const log = {
    info: (...messages) => {
        messages.forEach((message) => console.log(message));
    },
    error: (...messages) => {
        messages.forEach((message) => console.error(message));
    },
};

module.exports = log;
