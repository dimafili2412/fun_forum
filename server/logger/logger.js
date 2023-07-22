/*
    TODO: Write logs to file
*/
module.exports = {
    info: (...messages) => {
        messages.forEach((message) => console.log(message));
    },
    error: (...messages) => {
        messages.forEach((message) => console.error(message));
    },
};
