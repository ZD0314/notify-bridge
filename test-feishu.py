import requests
import json

url = "http://localhost:3000/api/v1/notify/send"
headers = {
    "X-API-Key": "nb_dcabda0c4bb01e44f1ba0b15cd7bfef3a3d7d58b75078bb3",
    "Content-Type": "application/json; charset=utf-8"
}
data = {
    "channel": "FEISHU",
    "title": "测试标题",
    "content": "Hello Feishu!"
}

response = requests.post(url, headers=headers, json=data)
print(f"Status: {response.status_code}")
print(f"Response: {response.text}")
