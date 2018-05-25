'use strict';

const env = require('get-env')({
    staging: 'staging',
    test: 'test',
    hirundo: 'hirundo'
});
module.exports = require('./' + env);
