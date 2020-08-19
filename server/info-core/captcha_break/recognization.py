import os
import numpy as np
from tensorflow.keras.models import *
import matplotlib.image as mpimg
from tensorflow.keras.utils import Sequence
import string

characters = string.digits + string.ascii_uppercase
width, height, n_len, n_class = 128, 64, 4, len(characters)

model = load_model('cnn.h5')


def preprocess(path):
    from PIL import Image
    img_file = list(filter(lambda x: x.endswith('.jpg'), os.listdir(path)))[0]

    im = Image.open('%s%s' % (path, img_file))
    out = im.resize((128, 64))
    out.save('resize_input.jpg')


def get_pic(filename):
    img_x = np.zeros((height, width, 3), dtype=np.float32)
    img = mpimg.imread(filename)
    img_x = np.expand_dims(np.array(img) / 255.0, 0)

    return img_x


def decode(y):
    y = np.argmax(np.array(y), axis=2)[:, 0]
    return ''.join([characters[x] for x in y])


def captcha_break(img_dir) -> str:
    if not img_dir.endswith('/'):
        img_dir = img_dir + '/'
    preprocess(img_dir)
    data_x = get_pic('%sresize_input.jpg' % img_dir)
    y_pred = model.predict(data_x)

    return decode(y_pred)
