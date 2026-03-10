class App {
  constructor() {
    this.socket = io();
    this.info = new Informations();
    this.map = new Minimap("minimap-canvas");
    this.detectionFlow = new DetectionFlow();
    this.camera = new CameraFeed();
    this.motors = new Motors(this.socket);
  }

  init() {
    this.info.setState(this.info.panel, true);
    this.map.draw();
    this.info.setState(this.info.map, true);
    this.initSocket();
  }

  initSocket() {
    this.socket.on("connect", () => {
      this.socket.emit("ping_server", { value: 42 });
      this.info.setState(this.info.robotConnection, true);
      {
        this.socket.on("message", (msg) => {
          console.log("Connected ?", msg.data);
        });

        this.socket.on("pong_client", (msg) => {
          console.log("Here ?", msg.data);
        });

        this.socket.on("disconnect", () => {
          this.info.setState(this.info.imageFlow, false);
          this.info.setState(this.info.robotConnection, false);
        });
      }
      this.motors.initRemoteController();
      this.info.setState(this.info.motors, true);
      this.camera.start();
      this.detectionSocket();
    });
  }

  detectionSocket() {
    this.info.setState(this.info.imageFlow, true);
    this.socket.on("detections", (data) => {
      this.info.setState(this.info.detectionFlow, true);
      try {
        this.detectionFlow.addDetection(data);
      } catch (e) {
        console.warn("Failed to update detection UI:", e);
      }
    });
  }
}

// Initialisation
let app;
document.addEventListener("DOMContentLoaded", function () {
  app = new App();
  app.init();
});
