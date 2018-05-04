var AWS = require('aws-sdk');
AWS.config.update({region:'us-west-2'});
AWS.config.accessKeyId = "redacted";
AWS.config.secretAccessKey = "redacted";
var fs = require("fs");
fs.appendFile("inventory", "\n[nodes]\n", function(err){console.log("wrote inventory!");});
var ec2 = new AWS.EC2();


var params = {
        ImageId: 'ami-718c6909',
        MinCount: 1,
        MaxCount: 1,
        KeyName: 'DevOp',
        SecurityGroups: ['DevOps'],
        InstanceType: 't2.micro'
};

var id;
var ip;

function createInstance(count){
        ec2.runInstances(params, function(err, data){
                if(err) {
                        console.error(err.toString());
                }else{
                        for(var i in data.Instances){
                                var instance = data.Instances[i];
                                console.log(instance.InstanceId + ' is initiated');
                                printIp(instance.InstanceId,count);
                        }
                }
        });
}

for(var i=0;i<3;i++){
	createInstance(i);
}

function printIp(isntance_id,count){
          ec2.waitFor('instanceRunning', {InstanceIds: [isntance_id]}, function(err, data) {
          if (err) return console.error(err);
	  global.ip = data.Reservations[0].Instances[0].PublicIpAddress;
          console.log("Instance created with ip : " + global.ip);

          // writing the inventory
          //var content = "aws_server"+count+"   ansible_ssh_host=" + global.ip + "  ansible_ssh_user=ubuntu ansible_ssh_private_key_file=DevOp.pem\n";
	  var content = "nomad" + (count+1) +"nomad_node_role=server consul_node_role=bootstrap consul_client_address="+global.ip +" ansible_host="+global.ip+"ansible_user=ubuntu ansible_ssh_private_key_file=DevOp.pem";
          fs.appendFile("inventory", content, function(err){console.log("wrote inventory!");});
        });
}


