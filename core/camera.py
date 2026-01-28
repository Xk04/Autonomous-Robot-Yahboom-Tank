from picamera2 import Picamera2
from ultralytics import YOLO
from flask import Response
from flask_socketio import SocketIO
import time
import cv2


class AICamera:

    def __init__(self, socketio :SocketIO, cameraId :int=0, model_name :str="yolo26n.pt"):
        self.camera = Picamera2()
        config = self.camera.create_video_configuration(main={"size": (640, 480)})
        self.camera.configure(config)
        self.camera.start()
        self.cnn_model = self.init_cnn_model(model_name)
        self.socketio = socketio


    def init_cnn_model(self, model_name :str):
        try:
            cnn = YOLO(model_name)
            print("> CNN model loaded succesfully")
            return cnn

        except Exception as exc:
            print("> Error during the CNN model import:")
            print("| Details:", exc)


    def catch_object(self):
        while True:
            try:
                frame = self.camera.capture_array()
                if frame is None or frame.size == 0:
                    print("> No frame captured, retrying...")
                    time.sleep(0.3)
                    continue
                    
                results = self.cnn_model(frame, verbose=False)
                annotated = results[0].plot()

                if len(results[0].boxes) > 0:
                    detected_classes = [self.cnn_model.names[int(box.cls[0])] for box in results[0].boxes]
                    self.socketio.emit('detections', {
                        'num': len(detected_classes),
                        'classes': detected_classes
                    })

                # Encode en JPEG
                success, jpeg = cv2.imencode('.jpg', annotated)
                if not success:
                    print("> JPEG encoding failed")
                    continue

                yield (b'--frame\r\n'
                    b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n')

            except Exception as e:
                print(f"> Erreur dans la boucle capture: {e}")
                time.sleep(1)


    def detection(self)->Response:
        return Response(self.catch_object(), mimetype='multipart/x-mixed-replace; boundary=frame')

