job "NodeJS_Counter" {
  datacenters = [ "dc1" ]
  group "default" {
    count = 1
    task "count" {
      driver = "docker"
      resources {
        memory = 512
      }
      config {
        image = "node:8"
        command = "node"
        args = [
          "--eval",
          "let x = 0; setInterval(() => console.log(++x), 1000);"
        ]
      }
    }
  }
}
