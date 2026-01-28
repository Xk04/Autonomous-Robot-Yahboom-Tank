from flask_socketio import SocketIO


socketio = None     # just to init


def init_handlers(new_sio :SocketIO):
    
    global socketio
    socketio = new_sio


    @socketio.on('connect')
    def handle_connection():
        try:
            socketio.emit('message', {'data': 'Successfully connected'})
        except Exception as exc:
            print("> Error during the socket connection:")
            print("> Details:", exc)
        print("\n---> New user connected\n")


    @socketio.on('disconnect')
    def handle_disconnection():
        print("\n---> A user has left the server\n")


    @socketio.on('ping_server')
    def handle_ping(data):
        print("\n---> Ping receive:", data)
        print()
        try:
            socketio.emit('pong_client', {'data': 'yes'})
        except Exception as err:
            print("> Error during the ping checking:")
            print("| Details:", err)