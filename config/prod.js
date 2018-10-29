/*******************************************************************************
 * Put Server and Plugins configs here
 * ENV: Production
 ******************************************************************************/
const path = require('path');
const projectName = 'MVP Hirundo';
const port = 5050;
const apiUrl = 'http://52.209.187.183:5051';
// const apiUrl = 'http://18.202.197.218:5051';

module.exports = {
    env: 'production',
    server: {
        host: '127.0.0.1',
        port: port
    },
    product: {
        name: projectName+' Admin Web Server'
    },
    key: {
        privateKey: 'BbZJjyoXAdr8BUZuiKKARWimKfrSmQ6fv8kZ7OFfc'
    },
    apiUrl: apiUrl+'/api/',
    adminApiUrl: apiUrl+'/admin/api/',
    socketUrl: apiUrl
};
