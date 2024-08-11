import google.generativeai as genai
from config import Config

genai.configure(api_key="AIzaSyDD8RGgCLS6F8yArsncoVFVtJCKFLeHkQg")

response = genai.generate_text(
model='gemini-pro',
prompt=f"이 아이디어를 세부적인 6개의 새로운 창의적인 아이디어로 분할: 여름방학에 하기 좋은 활동",
max_tokens=500
)
splits = response.generations[0].text.split('\n')
print(splits)
