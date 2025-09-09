import cv2
import base64
import io
from PIL import Image
import numpy as np
from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from filters import old_film_filter, bw_tv_filter, vhs_filter, pop_art_filter_v2, neon_filter
from multiprocessing import Pool, cpu_count


sio = SocketIO()

def create_app():
    app = Flask(__name__)
    sio.init_app(app, cors_allowed_origins="*")
    return app

@sio.on('message')
def handle_message(data):
    print("received message: " + data["data"])


@sio.on('image')
def image(data_image):
    emit('response_back', image_formation(data_image["sc"], data_image["filter"]))


@sio.on('list_image')
def process_list_image(data_images):
    newList = []
    for i in data_images["sc"]:
        newList.append(image_formation(i, data_images["filter"]))
    emit('list', newList)


def image_formation(data_image, filter):

    _, encoded_data = data_image.split(',', 1)
    data_bytes = encoded_data.encode()
    b = base64.b64decode(data_bytes)
    byte_stream = io.BytesIO(b)
    pimg = Image.open(byte_stream)
    matrix = np.array(pimg)
    frame = cv2.resize(matrix, (640, 480))

#     num_processes = cpu_count()
#     chunk_size = 40
#     chunks = [frame[i*chunk_size:(i+1)*chunk_size] for i in range(num_processes)]


    if filter == 'Old_School':
#         with Pool(processes = num_processes) as pool:
#             processed_chunks = pool.map(old_film_filter, chunks)
#         frame = np.vstack(processed_chunks)
        frame = old_film_filter(frame)
    elif filter == "TV":
        frame = bw_tv_filter(frame)
    elif filter == "Pop_Art":
        frame = pop_art_filter_v2(frame)
    elif filter == "VHS":
        frame = vhs_filter(frame)
    elif filter == "Neon":
        print('here')
        frame = neon_filter(frame)
    else:
        frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
    
    imgencode = cv2.imencode('.jpg', frame, [int(cv2.IMWRITE_JPEG_QUALITY), 50])[1]
    print("here", cv2.cuda.getCudaEnabledDeviceCount(), cpu_count())
    stringData = base64.b64encode(imgencode).decode('utf-8')
    b64_src = 'data:image/jpeg;base64,'

    return b64_src + stringData

if __name__ == '__main__':
    app = create_app()
    sio.run(app)