class Motors {
  constructor(socket) {
    this.socket = socket;
    this.FREQUENCE = 50;
    this.socketFlow = null;

    this.forward = document.getElementById("forward");
    this.turnLeft = document.getElementById("turn-left");
    this.brake = document.getElementById("brake");
    console.log(this.brake);
    this.turnRight = document.getElementById("turn-right");
    this.spinLeft = document.getElementById("spin-left");
    this.backward = document.getElementById("backward");
    this.spinRight = document.getElementById("spin-right");
  }

  sendSocket(socketName) {
    console.log("Envoi d'un paquet socket...");
    this.socket.emit(socketName);
  }

  stopFlow() {
    if (this.socketFlow) {
      clearInterval(this.socketFlow);
      this.socketFlow = null;
      console.log("Flux arrêté.");
    }
  }

  init(btn, socketName) {
    btn.addEventListener("mouseup", this.stopFlow());
    btn.addEventListener("mouseleave", this.stopFlow());
    btn.addEventListener("mousedown", () => {
      this.sendSocket(socketName);
      this.socketFlow = setInterval(
        this.sendSocket(socketName),
        this.FREQUENCE,
      );
    });
  }

  initRemoteController() {
    this.init(this.forward, "forward");
    this.init(this.turnLeft, "turn_left");
    this.init(this.brake, "brake");
    this.init(this.turnRight, "turn_right");
    this.init(this.spinLeft, "spin_left");
    this.init(this.backward, "backward");
    this.init(this.spinLeft, "spin_right");
    
  }
}

/*
  init(btn, socketName) {
    btn.addEventListener("click", this.sendSocket(socketName));
  }
*/
