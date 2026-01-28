from flask import Flask
from flask_socketio import SocketIO
import os


class App:

    def __init__(self):
        self.app = None
        self.socketio = None
        self.camera = None


    def create_app(self):
        base_dir = os.path.dirname(os.path.dirname(__file__))
        self.app = Flask(
                            __name__,
                            template_folder=os.path.join(base_dir, "templates"),
                            static_folder=os.path.join(base_dir, "static")
                        )
        self.app.config.update(
                                SECRET_KEY="1234"
                            )
        self.socketio = SocketIO(self.app,
                                 cors_allowed_origins="*",
                                 async_mode="threading"
                                 )
        self.camera = self.init_camera()
        self.init_blueprints()
        self.init_socket()
        print("> App created")
        return self.app
        
        
    def init_blueprints(self):
        from .blueprints.web.routes import main_bp
        from .blueprints.api.video import streaming_bp, load_camera

        self.app.register_blueprint(main_bp)
        self.app.register_blueprint(streaming_bp, url_prefix="/camera")
        load_camera(self.camera)
        print("> Blueprints loaded")


    def init_camera(self):
        from ..core.camera import AICamera

        new_camera = AICamera(self.socketio)
        print("> AI Camera loaded")
        return new_camera


    def init_socket(self):
        from .socket.handlers import init_handlers

        init_handlers(self.socketio)
        print("> SocketIO created")

    def run(self):
        if self.socketio is None or self.app is None:
            raise RuntimeError("App not created yet")
        self.socketio.run(
                            self.app,
                            host="0.0.0.0",
                            port=8000,
                            debug=False,
                            use_reloader=False,
                            allow_unsafe_werkzeug=True
                        )
