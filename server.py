# 필요한 라이브러리 및 모듈들을 임포트합니다.
from flask_cors import CORS
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import torch
import torch.nn as nn
from torchvision import datasets, models, transforms
from PIL import Image

# Flask 앱을 초기화합니다.
app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

model = models.resnet34(pretrained=True)
num_features = model.fc.in_features
model.fc = nn.Linear(num_features, 9)
model = model.to(device)

model_path = 'C:/Code/mon/model_231024.pt'
model = torch.load(model_path, map_location=device)
model.eval()

transforms_test = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

data_dir = 'C:/Code/mon/font-similarity-app/public/Fonts'
train_datasets = datasets.ImageFolder(os.path.join(data_dir), transforms_test)
class_names = train_datasets.classes

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    image = Image.open(filepath).convert('RGB')
    image = transforms_test(image).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(image)
        softmax = nn.Softmax(dim=1)
        probabilities = softmax(outputs)
        top_probability, top_class = probabilities.topk(4, dim=1)

    font_data = []
    for i in range(4):
        font_folder_path = os.path.join(data_dir, class_names[top_class[0][i]])

        # 유료 폰트일 경우 .txt 파일의 링크를 가져옴
        if "_" in class_names[top_class[0][i]]:
            download_file = next((f for f in os.listdir(font_folder_path) if f.endswith('.txt')), None)
            if download_file:
                with open(os.path.join(font_folder_path, download_file), 'r', encoding='utf-8') as txt_file:
                    download_link = txt_file.read().strip()
            else:
                download_link = None
        # 무료 폰트일 경우
        else:
            download_file = next((f for f in os.listdir(font_folder_path) if f.endswith(('.ttf', '.zip', '.otf', '.TTF'))), None)
            download_link = f"/Fonts/{class_names[top_class[0][i]]}/{download_file}" if download_file else None

        font_info = {
            "fontName": class_names[top_class[0][i]],
            "similarity": f"{top_probability[0][i].item() * 100:.2f}%",
            "fontImage": f"/Fonts/{class_names[top_class[0][i]]}/{class_names[top_class[0][i]]}.png",
            "fontDownloadLink": download_link,
            "isPaid": True if "_" in class_names[top_class[0][i]] else False
        }
        print("isPaid:", font_info["isPaid"])  # 유료 여부 출력
        print("fontImage path:", font_info["fontImage"])  # 이미지 경로 출력
        print("fontDownloadLink path:", font_info["fontDownloadLink"])  # 다운로드 링크 출력
        if download_link:  # 다운로드 링크가 있을 경우에만 추가
            font_data.append(font_info)
    paid_font_detected = any(font["isPaid"] for font in font_data)
    result = {
        'fonts': font_data,
        'paidFontDetected': paid_font_detected  # 유료 폰트 포함 여부
    }
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
