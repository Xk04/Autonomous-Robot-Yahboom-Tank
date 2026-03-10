import threading

import cv2
from flask import Response
from picamera2 import Picamera2
from ultralytics import YOLO


class AICamera:
    def __init__(self, socketio, model_name="yolo26n.pt"):
        self.camera = Picamera2()
        # On limite le FPS la source
        config = self.camera.create_video_configuration(main={"size": (160, 120)})
        self.camera.configure(config)
        self.camera.start()

        self.cnn_model = YOLO(model_name)

        self.socketio = socketio

        self.latest_frame = None
        self.lock = threading.Lock()

        # Lancer un thread qui lit la camra en continu
        threading.Thread(target=self._update_camera, daemon=True).start()

        self.frame_count = 0
        self.cnn_frame = 1
        self.socket_frame = 15

    def _update_camera(self):
        while True:
            frame = self.camera.capture_array()
            with self.lock:
                self.latest_frame = frame

    def catch_object(self):
        while True:
            with self.lock:
                if self.latest_frame is not None:
                    frame = self.latest_frame.copy()
                    self.frame_count += 1

                    if self.frame_count % self.cnn_frame == 0:
                        results = self.cnn_model(
                            frame, imgsz=160, verbose=False, half=True
                        )  # half=True si GPU/NPU dispo

                        annotated = results[0].plot(
                            line_width=1,
                            font_size=0.6,
                            labels=True,
                        )

                        if (self.frame_count % self.socket_frame == 0) and len(
                            results[0].boxes
                        ) > 0:
                            detected_classes = [
                                self.cnn_model.names[int(box.cls[0])]
                                for box in results[0].boxes
                            ]
                            self.socketio.emit(
                                "detections",
                                {
                                    "num": len(detected_classes),
                                    "classes": detected_classes,
                                },
                            )
                        frame = annotated

                        success, jpeg = cv2.imencode(".png", frame)
                        if success:
                            yield (
                                b"--frame\r\n"
                                b"Content-Type: image/png\r\n\r\n"
                                + jpeg.tobytes()
                                + b"\r\n"
                            )

    def detection(self) -> Response:
        return Response(
            self.catch_object(), mimetype="multipart/x-mixed-replace; boundary=frame"
        )
