var redis = require('redis')
var http = require('http')
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})
module.exports.weights = [0,0,0,0,0,0,0,0,0,0];
var polling_agent = setInterval(function () {

	var request = http.get('http://34.215.240.138', function (res) {
	})
        request.setTimeout(5000, function() {  
            console.log('timed out');
            module.exports.weights = [0,0,0,0,0,0,0,0,0,0];
            console.log(module.exports.weights);
       });
	request.on('error', function (e) {
		console.log("ALERT - Canary Died");
                module.exports.weights = [0,0,0,0,0,0,0,0,0,0];
                console.log(module.exports.weights);
		//client.setmodule.exports.weights("weight","[0,0,0,0,0,0,0,0,0,0]");
		/*client.sismember("serverset", 8081, function (err, reply) {
			if (err) throw err;
			if (reply) {
				client.srem("serverset", 8081);
				client.lrem("serverlist", -1, 8081);
				console.log('Removing Canary from Load Balancer');
			}
		});*/

	});
	request.on('response', function (res) {
		console.log("NO ALERT - Canary Running");
                module.exports.weights = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1];
                console.log(module.exports.weights);
                //client.setmodule.exports.weights("weight","[0, 0, 0, 0, 0, 0, 1, 1, 1, 1]");
		/*client.sismember("serverset", 8081, function (err, reply) {
			if (err) throw err;
			if (!reply) {
				console.log('Adding Canary in Load Balancer');
				client.sadd("serverset", 8081);
				client.lpush("serverlist", 8081);
			}
		});*/

	});
}, 3000);
