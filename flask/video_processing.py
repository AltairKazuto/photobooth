import cv2
import base64
import io
from PIL import Image
import numpy as np
from flask_socketio import emit, SocketIO
from flask import Flask, render_template

app = Flask(__name__, template_folder="templates")
sio = SocketIO(app,cors_allowed_origins="*")

@sio.on('image')
def image(data_image):
    _, encoded_data = data_image.split(',', 1)
    data_bytes = encoded_data.encode()
    b = base64.b64decode(data_bytes)
    byte_stream = io.BytesIO(b)
    pimg = Image.open(byte_stream)

    # DO WHATEVER IMAGE PROCESSING HERE{
    frame = cv2.bitwise_not(np.array(pimg))
    frame = cv2.flip(frame, flipCode=0)
    imgencode = cv2.imencode('.jpg', frame)[1]
    #}

    stringData = base64.b64encode(imgencode).decode('utf-8')
    b64_src = 'data:image/jpeg;base64,'
    stringData = b64_src + stringData
    emit('response_back', stringData)

@app.route("/")
@app.route("/home")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    sio.run(app, debug=True)