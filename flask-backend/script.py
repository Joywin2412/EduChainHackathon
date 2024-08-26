import face_recognition
import cv2
import numpy as np

from flask import *
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
import tensorflow as tf
import keras
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from sklearn.decomposition import PCA

# use it later
from imgaug import augmenters as iaaz

# ica
from sklearn.decomposition import FastICA

import subprocess

# import rs decoder
from reedsolo import RSCodec, ReedSolomonError
# goign to vary this
rsc = RSCodec(53)
# Replace your url with this
joywin_uri = "mongodb+srv://joy:ryHVuNxW2ATaMtyy@cluster0.vffdptk.mongodb.net/EduchainSecurity()?retryWrites=true&w=majority"
uri = joywin_uri

from tensorflow.keras.models import load_model
# model = load_model('model.keras')
# from keras.models import Model
# second_last_layer_model = Model(inputs=model.input, outputs=model.layers[-2].output)

client = MongoClient(uri, server_api=ServerApi('1'))

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client["Security"]
users_collection = db["User"]

# FingerPrint cnn model


@app.route('/')
def index():
    return render_template("index.html")

@app.route('/registerFace', methods=['GET'])
def register_face():
    # Initialize the camera
    cap = cv2.VideoCapture(0)
    frame = ""
    while True:
        ret, frame = cap.read()
        # cv2.imshow("Capture Photo", frame)
        
        face_encodings = face_recognition.face_encodings(frame)
    # Extract face encodings from the photo
    
        if not face_encodings:
            continue
        else:
            face_encodings = face_recognition.face_encodings(frame, num_jitters=100)
        # Store user data in the database
        return jsonify({"face_encodings": face_encodings[0].tolist()})
        
    return jsonify({"error": "No face found in the captured image."})
    # Release the camera
   
    # frame = cv2.imread("Image_db.png")
    


# @app.route('/inputFinger', methods=['GET'])
# def input_Finger():
#     print("Finger")
#     exe_path = 'C:\\Program Files\\Mantra\\MFS100\\Driver\\MFS100Test\\MANTRA.MFS100.Test.exe'

#     try:
#         subprocess.run(f'"{exe_path}"', shell=True)

#     except Exception as e:
#         print(f"An error occurred: {str(e)}")

#     return "yo"

from tensorflow.keras.models import Model
import keras
# model = keras.models.load_model('fingerprint_model.keras')

# @app.route('/registerFinger', methods=['GET'])
# def register_Finger():
    # try:
        # minitae points
        # fingerprint_database_image = cv2.imread("download.jpeg")
        # fingerprint_database_image = cv2.cvtColor(fingerprint_database_image, cv2.COLOR_BGR2GRAY)
        # fingerprint_database_image = cv2.resize(fingerprint_database_image, (160, 160))
        # fingerprint_database_image = fingerprint_database_image.reshape(-1, 160, 160, 1).astype('float32') / 255.0
        # global model
        # # Predict the fingerprint features
        # x = model.layers[-2].output
        # model = Model(inputs=model.inputs, outputs=x)
        # # fingerprint_database_image2 = cv2.imread("now.
        # # fingerprint_database_image2 = cv2.cvtColor(fingerprint_database_image2, cv2.COLOR_BGR2GRAY)
        # # fingerprint_database_image2 = cv2.resize(fingerprint_database_image2, (160, 160))
        # # fingerprint_database_image2 = fingerprint_database_image2.reshape(-1, 160, 160, 1).astype('float32') / 255.0
        
        # fc2 = model.predict(fingerprint_database_image)
        # print(fc2[0][:20])
        # return jsonify({"fingerprint_encodings":fc2[0].tolist()})
        # sift = cv2.SIFT_create()
        
        # keypoints_1, descriptors_1 = sift.detectAndCompute(fingerprint_database_image, None)
        
        # descriptors_list = descriptors_1.tolist()

        # # Create a document with keypoints and descriptors
        # fingerprint_data = {
        #     "keypoints": [{"x": kp.pt[0], "y": kp.pt[1], "size": kp.size, "angle": kp.angle, "response": kp.response, "octave": kp.octave, "class_id": kp.class_id} for kp in keypoints_1],
        #     "descriptors": descriptors_list
        # }

    # Return the fingerprint data
        # return jsonify(fingerprint_data)

    # except Exception as e:
    #     print("Hello")
    #     return jsonify({"error": str(e)})
    
    
@app.route('/registerUser', methods=['POST'])
def register_user():
    # try:
        # print('hello')
        import json
        user_data = request.get_json()
        # print(user_data1)
        # user_data = json.loads(user_data)
        # print(user_data['faceEncodings'])
        # print(user_data['fingerData'])
        faceEncodings = user_data['faceEncodings']
        # fingerEncodings = fingerEncodings['fingerprint_encodings']
        private_message = ""
        for val in faceEncodings:
            private_message+=(str(int(val)))
            # lc_count = lc_count + 1
        
                
        # private_message = private_message.encode('utf8')
        import rsa
        import random_string
        import random
        import hashlib
        special_string = random_string.get_random_string(len(faceEncodings)).encode('utf-8')
        hashed = hashlib.sha256(special_string).hexdigest()
        encoded_private_message = rsc.encode(special_string)
        # This extra error part must be kept safe
        print("Encoded which I will use after")
        print(encoded_private_message)
        print(private_message)
        for i in range(len(private_message),len(encoded_private_message)):
            private_message+='0'
        # padding
        private_message = private_message.encode('utf8')
        def byte_xor(ba1, ba2):
            return bytes([_a ^ _b for _a, _b in zip(ba1, ba2)])
        xr = byte_xor(private_message , encoded_private_message )
        import rsa
        
        
        obj = {}
        obj['name'] = user_data["name"]
        obj['hash'] = hashed
        obj['xor'] = xr
        obj['walletAddress'] = user_data["walletAddress"]
        result = users_collection.insert_one(obj)
        if result.acknowledged:
            return jsonify({"message": "User data stored in MongoDB."})
        else:
            return jsonify({"error": "Failed to store user data."})
    # except Exception as e:
    #     print("Error")
        return jsonify({"error": "hi"})

# Function to capture a user's photo and perform login
@app.route('/login', methods=['POST'])
def login_user():
    name = request.get_json()['name']
    faceEncodings = request.get_json()['faceEncodings']
    
    if not faceEncodings:
        return "No face found in the captured image."
    
    user_data = users_collection.find_one({"name": name})
    print('hap')
    if not user_data:
        return "User not found."

    hashed_enroll = user_data.get("hash")
    xor_data = user_data.get("xor")
   
        # print(count1)
   
    private_message = ""
    for val in faceEncodings:
        private_message+=(str(int(val)))
        # lc_count = lc_count + 1
    
    # get the xored data to be sent to decoder

    

    for i in range(len(private_message),len(xor_data)):
        private_message += '0'

    def byte_xor(ba1, ba2):
            return bytes([_a ^ _b for _a, _b in zip(ba1, ba2)])
    private_message = private_message.encode('utf8')
    encoded_message = byte_xor(private_message,xor_data)
    print("This message is what I need. When conversion of this takes place.")
    print(encoded_message)
    import rsa
    import random_string
    
    print(encoded_message)
    decoded_message = rsc.decode(encoded_message)[0]
    print("The actual decoded message which was the random string is : ")
    print(decoded_message)
    import hashlib
    hashed_auth = hashlib.sha256(decoded_message).hexdigest()
    print("hashed something")
    print(hashed_auth)
    print(hashed_enroll)
    
    if hashed_auth == hashed_enroll:
        return jsonify({"message": "Login Successful."})
    else:
        return "Face recognition failed. Login unsuccessful."


# Example usage
if __name__ == "__main__":
    app.run(debug=True)
