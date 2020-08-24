import requests as req
from io import BytesIO
import os
import numpy as np
from tensorflow.keras.models import *
import matplotlib.image as mpimg
from tensorflow.keras.utils import Sequence
from PIL import Image
import string

characters = string.digits + string.ascii_uppercase
width, height, n_len, n_class = 128, 64, 4, len(characters)

model = load_model('captcha_break/cnn.h5')


def preprocess(path):
    img_file = list(filter(lambda x: x.endswith('.jpg'), os.listdir(path)))[0]

    im = Image.open('%s%s' % (path, img_file))
    out = im.resize((128, 64))
    out.save('%sresize_input.jpg' % path)


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


def captcha_break_from_url(target_url):
    response = req.get(target_url)
    im = Image.open(BytesIO(response.content))
    out = im.resize((128, 64))
    if 'img_tmp' not in os.listdir('./'):
        os.mkdir('img_tmp')
    out.save('img_tmp/download.jpg')
    result = captcha_break('img_tmp')

    for file in os.listdir('img_tmp/'):
        os.remove('img_tmp/%s' % file)

    return result
