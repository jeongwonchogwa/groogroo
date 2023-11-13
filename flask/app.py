import openai
from openai import OpenAI as open_module
import requests
import urllib.request
from flask import Flask, jsonify, request, url_for, render_template_string
from flask_cors import CORS

from dotenv import load_dotenv
import os
import sys
import base64       # 이미지 인코딩하기 위해
import time
import json

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
# def hello():
#     return 'Hello!'

@app.route(context_path + '/hello', methods=['GET'])
def hello_world():
    return 'Hello, Flask Server on :)'

def checkValidation(user_input):
    # 금칙어 필터링
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

@app.route(context_path + '/image', methods=['POST'])
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
                    with open(image_path, "wb") as f:
                        f.write(image_data)
                    ###############################################################################
                    # url 을 보내는 방식
                    # image_url = url_for("static", filename=f"images/cat.jpg", _external=True)
                    # return jsonify({'image_url': image_url}), 200
                    ###############################################################################
                    # 이미지 파일을 열고 base64로 인코딩
                    # with open(image_path, "rb") as image_file:
                    #     encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
                    encoded_string = base64.b64encode(image_data).decode('utf-8')
                    # base64 인코딩된 이미지 데이터를 JSON으로 변환하여 반환
                    return jsonify({ 'image_data': encoded_string }), 200
                except openai.error as e:
                    return jsonify({ 'error': e }), 400;
            
        else:
            print('유저 입력 데이터 없음!!')
 
    else:
        print('잘못된 요청')
        return
        ###########################################################################
        # DALL-E 2 사용 코드
        # response 3차원 배열 사용, 요청 보내는 함수도 create로 다름
        # image_url = response["data"][0]["url"]
        # image_data = requests.get(image_url).content
        # image_filename = f"gen_img_{cnt}.jpg"
        # image_path = os.path.join("static", "images", image_filename)
        # with open(image_path, "wb") as f:
        #     f.write(image_data)
        # cnt += 1
        # image_html = f'<img src="{url_for("static", filename=f"images/{image_filename}")}">'
        # prompt_html = f'<p>{prompt}</p>'
        ###########################################################################

        
        # return f'<img src="{url_for("static", filename="images/gen_img_.jpg")}">'


# from googletrans import Translator

# @app.route('/translate')
# def translate():
#     translator = Translator()
#     # text1 = '안녕하세요, 이것은 나무입니다.'
#     text2 = 'I am a LemonTree'

#     # trans_result1 = translator.translate(text1, dest='en')
#     trans_result2 = translator.translate(text2, dest='ko')

#     # {trans_result1.text} & 
#     print(trans_result2)
#     return f'번역 결과: {trans_result2.text}'


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)