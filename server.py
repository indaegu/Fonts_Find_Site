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
# Flask 앱에 CORS (Cross-Origin Resource Sharing)을 설정합니다.
# 이를 통해 다른 도메인에서의 요청을 허용하게 됩니다.
CORS(app)

# 업로드될 이미지들을 저장할 디렉토리명을 설정합니다.
UPLOAD_FOLDER = 'uploads'
# 해당 디렉토리가 존재하지 않으면 생성합니다.
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# 사용할 디바이스(CPU 또는 GPU)를 설정합니다.
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

# ResNet-34 모델을 불러옵니다.
model = models.resnet34(pretrained=True)
# 모델의 마지막 레이어를 9개의 클래스로 분류하도록 변경합니다.
num_features = model.fc.in_features
model.fc = nn.Linear(num_features, 9)
# 모델을 지정한 디바이스로 옮깁니다.
model = model.to(device)

# 사전 학습된 모델을 불러옵니다.
model_path = 'C:/Code/mon/model_231024.pt'  # 본인 파일경로 주의@@@@@@
model = torch.load(model_path, map_location=device)  # map_location 파라미터 추가
# 모델을 평가 모드로 설정합니다.
model.eval()

# 이미지 전처리를 위한 변환(transform)을 정의합니다.
transforms_test = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# 학습 데이터셋의 경로를 설정하고 클래스 이름을 가져옵니다.
data_dir = 'C:/Code/mon/font-similarity-app/public/Fonts'  # 본인의 경로로 앞부분 수정할것
train_datasets = datasets.ImageFolder(os.path.join(data_dir), transforms_test)
class_names = train_datasets.classes


# '/predict' 엔드포인트에 대한 처리를 정의합니다.
@app.route('/predict', methods=['POST'])
def predict():
    # 요청에서 파일이 포함되어 있는지 확인합니다.
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    # 파일 이름이 비어있는지 확인합니다.
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        # 안전한 파일 이름을 생성합니다.
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        # 파일을 서버에 저장합니다.
        file.save(filepath)

        # 저장된 이미지를 열고 전처리합니다.
        image = Image.open(filepath).convert('RGB')
        image = transforms_test(image).unsqueeze(0).to(device)
        # 모델을 사용하여 예측합니다.
        with torch.no_grad():
            outputs = model(image)
            softmax = nn.Softmax(dim=1)
            probabilities = softmax(outputs)
            top_probability, top_class = probabilities.topk(4, dim=1)

        # 예측 결과를 저장할 리스트를 초기화합니다.
        font_data = []
        for i in range(4):
            # 다운로드 링크를 위한 확장자를 찾습니다.
            font_folder_path = os.path.join(data_dir, class_names[top_class[0][i]])
            download_file = next((f for f in os.listdir(font_folder_path) if f.endswith(('.ttf', '.zip', '.otf', '.TTF'))), None)

            if not download_file:
                continue  # 해당 확장자를 가진 파일이 없으면 다음 폰트로 넘어갑니다.

            font_info = {
                "fontName": class_names[top_class[0][i]],
                "similarity": f"{top_probability[0][i].item() * 100:.2f}%",  # 유사도
                "fontImage": f"/Fonts/{class_names[top_class[0][i]]}/{class_names[top_class[0][i]]}.png",
                "fontDownloadLink": f"/Fonts/{class_names[top_class[0][i]]}/{download_file}",
            }
            font_data.append(font_info)

        # 최종 결과를 딕셔너리 형태로 저장합니다.
        result = {
            'fonts': font_data
        }
        # 결과를 JSON 형태로 반환합니다.
        return jsonify(result)


# Flask 앱을 실행합니다.
if __name__ == '__main__':
    app.run(debug=True)
