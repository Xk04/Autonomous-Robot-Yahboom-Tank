from flask import Blueprint
from ....core.camera import AICamera


streaming_bp = Blueprint('camera', __name__)
camera = None


def load_camera(new_camera :AICamera):
    global camera
    camera = new_camera


@streaming_bp.route('/video')
def stream():
    if camera is not None:
        return camera.detection()
    else:
        print("Warning ! The camera is not define !")
        return None
