const session = require('express-session');

const sessionParser = session({
    saveUninitialized: false,
    resave: false,
    secret: 'skddsffjhdksfj',
});

module.exports = sessionParser;