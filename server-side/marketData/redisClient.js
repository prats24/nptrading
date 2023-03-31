const redis = require('redis');
client = redis.createClient(6379, 'http://127.0.0.1:8081/');

module.exports = client;

