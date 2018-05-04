var http = require('http');
var redis = require('redis');
var httpProxy = require('http-proxy');
var lb = require('./pollingAgent');
var exec = require('child_process').exec;

var request = require("request");
var client = redis.createClient(6379, '127.0.0.1', {})
//IP for AppServer[s] and CanaryServer[s] must be hardcoded in

var servers = ['http://52.89.69.9/','http://34.215.240.138/'];

//Manage - Simulate weights for the server

var weights = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1] // 40% - 60% ratio

//Returns a random integer between min (inclusive) and max (inclusive)

function getRandomInt(min, max) {

	return Math.floor(Math.random() * (max - min + 1)) + min;

}

var infrastructure = {

	setup: function() {

		// Proxy.
                //weights = client.get("weight");
                
		var options = {};

		var proxy = httpProxy.createProxyServer(options);

                //console.log(weights);
		var server = http.createServer(function(req, res) {
                        //var weights = lb.weights;
 			var ranNum = getRandomInt(0, 9) // weight smimulation
			var serverIndex = lb.weights[ranNum]
			var serverIP = servers[serverIndex]
			proxy.web(req, res, {

				target: serverIP

			});
			console.log("proxy redirected to " + serverIP + "\n");
		});

		console.log("Proxy server listening on port 8080 \n")

		server.listen(8080);

	},

	teardown: function() {

		exec('forever stopall', function() {

			console.log("infrastructure shutdown");

			process.exit();

		});

	},

}



infrastructure.setup();



// Make sure to clean up.

process.on('exit', function() {

	infrastructure.teardown();

});

process.on('SIGINT', function() {

	infrastructure.teardown();

});

process.on('uncaughtException', function(err) {

	console.error(err);

	infrastructure.teardown();

});
