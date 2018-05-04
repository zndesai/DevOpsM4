# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure(2) do |config| 
  config.vm.box = "ubuntu/trusty64"

  config.vm.define "jenkins" do |machine|
    config.vm.synced_folder "~/Documents/DevOps/M2/jenkins", "/home/vagrant/jenkins" ,type: "rsync"
    machine.vm.network "private_network", ip: "172.17.177.21"
    machine.vm.provider :virtualbox do |vb|
          vb.customize ["modifyvm", :id, "--memory", "2048"]
          vb.customize ["modifyvm", :id, "--cpus", "2"]
      end
  end

  config.vm.define 'controller' do |machine|
    config.vm.synced_folder "~/Documents/DevOps/M2/ansible", "/home/vagrant/ansible" ,type: "rsync"
    machine.vm.network "private_network", ip: "172.17.177.11"
  end

  end
