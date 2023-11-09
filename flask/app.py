import openai
import requests
from flask import Flask, request, url_for, render_template_string

from dotenv import load_dotenv
import os


# .env 파일에서 api_key 불러오기
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

cnt = 0

app = Flask(__name__)
# CORS(app)

context_path = '/flask'

@app.route(context_path + '/')
def hello():
    return 'Hello!'

@app.route(context_path + '/hello', methods=['GET'])
def hello_world():
    return 'Hello World!'

@app.route('/image', methods=['GET', 'POST'])
def make_image():
    global cnt
    # 입력 폼에서 프롬프트 입력받으면, 
    if request.method == 'POST':
        prompt = request.form['prompt']
        print('입력받은 데이터: ', prompt)
        # prompt = "Image of a tree with a burning dot art feel"
        response = openai.Image.create(
            prompt=prompt,
            n=1,    # default는 1이며 1개당 토큰이 나가고 그 이상은 돈이 개수만큼 나간다.
            size="256x256",
            # response_format="url"
        )
        print('결과: ', response)
        image_url = response["data"][0]["url"]
        image_data = requests.get(image_url).content
        image_filename = f"gen_img_{cnt}.jpg"
        image_path = os.path.join("static", "images", image_filename)
        with open(image_path, "wb") as f:
            f.write(image_data)
        cnt += 1
        image_html = f'<img src="{url_for("static", filename=f"images/{image_filename}")}">'
        prompt_html = f'<p>{prompt}</p>'
        return prompt_html + image_html + render_template_string('''
            <form method="POST">
                Prompt: <input type="text" name="prompt">
                <input type="submit" value="Generate Image">
            </form>
        ''')
        # return f'<img src="{url_for("static", filename="images/gen_img_.jpg")}">'
    # GET 요청이 들어오면 입력 폼 렌더링
    return '''
    <form method="POST">
        Prompt: <input type="text" name="prompt">
        <input type="submit" value="Generate Image">
    </form>
    '''

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
    app.run(host='0.0.0.0', port=5000)