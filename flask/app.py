import openai
from openai import OpenAI as open_module
import requests
import urllib.request
from flask import Flask, jsonify, request, url_for, render_template_string
from flask_cors import CORS

from dotenv import load_dotenv
import os, io, sys
import base64       # 이미지 인코딩하기 위해
import time
import json

from PIL import Image
from rembg import remove

##########################################################
#   배경 제거 및 이미지 resize
##########################################################
def remove_background(image_src, image_path, image_filename):
    # 이미지 데이터를 바이트 스트림으로 변환
    image_byte_array = io.BytesIO(image_src)
    # Pillow 이미지로 변환
    origin_image = Image.open(image_byte_array)
    # 128x128 나무 크기로 조정
    resized_image = origin_image.resize((128,128), Image.NEAREST)
    # 배경 제거
    output_image = remove(
            resized_image,
            alpha_matting=True,
            alpha_matting_foreground_threshold=120,
            alpha_matting_background_threshold=10,
            alpha_matting_erode_structure_size=10,
            alpha_matting_base_size=1300,
            # I = αF + (1−α)B
        )

    output_image.save(f'{image_path}', 'png')

##########################################################
#   금칙어 필터링
##########################################################
def checkValidation(user_input):
    encText = urllib.parse.quote(user_input)
    url = "https://openapi.naver.com/v1/search/adult.json?query=" + encText
    request = urllib.request.Request(url)
    request.add_header("X-Naver-Client-Id", os.environ.get("NAVER_API_CLIENT_ID"))
    request.add_header("X-Naver-Client-Secret", os.environ.get("NAVER_API_CLIENT_SECRET"))
    response = urllib.request.urlopen(request)
    rescode = response.getcode()

    if(rescode==200):
        response_data = json.loads(response.read().decode('utf-8'))
        print(response_data)
        result = response_data.get("adult")
        if result == 1:
            print("금칙어임")
            return False
        else:
            print("금칙어 아님")
            return True

    else:
        print("Error Code:" + rescode)
        print(response)
        return True

##########################################################
#   번역(한글 -> 영어)
##########################################################
def translateWord(user_input):
    encText = urllib.parse.quote(user_input)
    data = "source=ko&target=en&text=" + encText
    url = "https://openapi.naver.com/v1/papago/n2mt"
    request = urllib.request.Request(url)
    request.add_header("X-Naver-Client-Id", os.environ.get("NAVER_API_CLIENT_ID"))
    request.add_header("X-Naver-Client-Secret", os.environ.get("NAVER_API_CLIENT_SECRET"))
    response = urllib.request.urlopen(request, data=data.encode("utf-8"))
    rescode = response.getcode()
    if(rescode==200):
        response_data = json.loads(response.read().decode('utf-8'))
        print(response_data)
        result = response_data.get("message").get("result").get("translatedText")
        print(result)
        return result
    else:
        print("Error Code:" + rescode)



##########################################################  메인 함수 부분
# .env 파일에서 api_key 불러오기
load_dotenv()
client = open_module(
    api_key = os.environ.get("OPENAI_API_KEY"),
)

app = Flask(__name__)
CORS(app)
# CORS(app, supports_credentials=True, origins='*',allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Credentials"])

context_path = '/flask'

# @app.route(context_path + '/')
@app.route(context_path + '/hello', methods=['GET'])
def hello_world():
    return 'Hello, Flask Server on :)'

@app.route(context_path + '/remove_bg', methods=['POST'])
def remove_bg():
    if request.method == 'POST' or request.method == 'GET':
        data = request.get_json()
        # # print(data)
        user_image = data.get('image')
        user_id = data.get('id')
        # param_foreground = data.get('foreground')
        # param_background = data.get('background')
        print('요청 들어옴: ', user_image, user_id)

        # user_image_path = './static/images/resized_image.png'
        # with open(user_image_path, "rb") as image_file:
        #     image_data = image_file.read()

        image_data = user_image
        image_filename = f"gen_img_{user_id}_{time.localtime().tm_year}_{time.localtime().tm_mon}_{time.localtime().tm_mday}_{time.localtime().tm_hour}{time.localtime().tm_min}{time.localtime().tm_sec}.jpg"
        image_path = os.path.join("static", "images", image_filename)

        remove_background(image_data, image_path, image_filename)

        with open(image_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')

        # 임시 저장된 파일 삭제
        os.remove(image_path)

        return jsonify({ 'image_data': encoded_string, 'image_name': image_filename }), 200

    else:
        print('잘못된 요청: remove_background')
        return


@app.route(context_path + '/make_image', methods=['POST'])
def make_image():
    # 입력 폼에서 프롬프트 입력받으면, 
    if request.method == 'POST':
        # prompt = request.form['prompt']
        # prompt += ' with a thick black line at its boundary, animation, Pixel art, no background, no fruits'
        # print('입력받은 데이터: ', prompt)
        data = request.get_json()
        print(data)
        user_input = data.get('text')
        user_id = data.get('id')

        if user_input:
            if checkValidation(user_input):

                translatedWord = translateWord(user_input)

                prompt = 'please create simple animation-styled pixel art image of a '
                # 입력값이 '나무'로 끝나지 않으면 '나무'를 추가합니다.
                if not translatedWord.endswith('tree'):
                    translatedWord += ' tree'
                
                prompt += translatedWord
                prompt += ' without any fruits on this image and with a white background'

                print("=====================")
                print('입력받은 데이터: ', prompt)
                print("=====================")

                # 테스트용 리턴
                # return jsonify ({ 'image_data': 'makeImage' }), 200;
                
                # prompt = "Image of a tree with a burning dot art feel"
                try:
                    response = client.images.generate(
                        model="dall-e-3",
                        prompt=prompt,
                        n=1,    # default는 1이며 1개당 토큰이 나가고 그 이상은 돈이 개수만큼 나간다.
                        size="1024x1024",
                        quality="hd",
                        # response_format="url"
                    )
                    image_url = response.data[0].url
                    image_data = requests.get(image_url).content
                    image_filename = f"gen_img_{user_id}_{time.localtime().tm_year}_{time.localtime().tm_mon}_{time.localtime().tm_mday}_{time.localtime().tm_hour}{time.localtime().tm_min}{time.localtime().tm_sec}.jpg"
                    image_path = os.path.join("static", "images", image_filename)

                    # with open(image_path, "wb") as f:
                    #     f.write(image_data)
                    remove_background(image_data, image_path, image_filename)

                    # 이미지 파일을 열고 base64로 인코딩
                    with open(image_path, "rb") as image_file:
                        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
                    # encoded_string = base64.b64encode(image_data).decode('utf-8')
                    # base64 인코딩된 이미지 데이터를 JSON으로 변환하여 반환

                    # 임시 저장된 파일 삭제
                    os.remove(image_path)

                    return jsonify({ 'image_data': encoded_string, 'image_name': image_filename }), 200
                except openai.error as e:
                    return jsonify({ 'error': e }), 400;
            
        else:
            print('유저 입력 데이터 없음!!')
    else:
        print('잘못된 요청')
        return

###############################################################################
# url 을 보내는 방식
# image_url = url_for("static", filename=f"images/cat.jpg", _external=True)
# return jsonify({'image_url': image_url}), 200
###############################################################################


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)