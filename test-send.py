import requests
import json

url = "http://localhost:3000/api/v1/notify/send"
headers = {
    "Content-Type": "application/json; charset=utf-8",
    "X-API-Key": "nb_e52fbfd25f6e2be642ee44e93a5edf98309df4ad3e31a3b5"
}
data = {
    "channel": "FEISHU",
    "title": "测试通知",
    "content": "这是一个来自Notify Bridge的测试消息"
}

try:
    response = requests.post(url, headers=headers, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")