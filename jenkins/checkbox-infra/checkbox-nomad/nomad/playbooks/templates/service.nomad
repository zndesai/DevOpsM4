job "checkBox" {
  datacenters = [ "dc1" ]
  group "default" {
    task "deploy" {
      driver = "docker"
      resources {
        memory = 512
        network {
      mbits = 20
      port "node" {}
    }

      }
      config {
        image = "rmehta4/cbox:latest"
        port_map {
         node = 8080
       }
      command = "/bin/bash"
      args = ["-c", "node server.js"]
      }

    }
  }
}

