from flask_socketio import SocketIO

socketio = None  # just to init


def init_handlers(new_sio: SocketIO, new_motors):

    global socketio, motors
    socketio = new_sio
    motors = new_motors

    @socketio.on("connect")
    def handle_connection():
        try:
            socketio.emit("message", {"data": "Successfully connected"})
        except Exception as exc:
            print("> Error during the socket connection:")
            print("> Details:", exc)
        print("\n---> New user connected\n")

    @socketio.on("disconnect")
    def handle_disconnection():
        print("\n---> A user has left the server\n")

    @socketio.on("ping_server")
    def handle_ping(data):
        print("\n---> Ping receive:", data)
        print()
        try:
            socketio.emit("pong_client", {"data": "yes"})
        except Exception as err:
            print("> Error during the ping checking:")
            print("| Details:", err)

    @socketio.on("forward")
    def handle_forward():
        print("---> Moving forward")
        motors.move_forward()

    @socketio.on("backward")
    def handle_backward():
        print("---> Moving backward")
        motors.move_backward()

    @socketio.on("turn_right")
    def handle_turn_right():
        print("---> Turning on the right")
        motors.turn_right()

    @socketio.on("turn_left")
    def handle_turn_left():
        print("---> Turning on the left")
        motors.turn_left()
        
    @socketio.on("spin_right")
    def handle_spin_right():
        print("---> Turning on the right")
        motors.spin_right()
        
    @socketio.on("spin_left")
    def handle_spin_left():
        print("---> Turning on the right")
        motors.spin_left()
        
    @socketio.on("brake")
    def handle_brake():
        print("---> brake")
        motors.brake()
