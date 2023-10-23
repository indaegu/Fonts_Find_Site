import os
import torch
import torch.nn as nn
import torch.optim as optim
import torchvision
from torchvision import datasets, models, transforms
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image
import pandas as pd
import time

# CUDA 지원 여부 확인
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

# matplotlib 한글 폰트 설정
from matplotlib import font_manager, rc
font_name = font_manager.FontProperties(fname="c:/Windows/Fonts/malgun.ttf").get_name()
rc('font', family=font_name)

def find_classes(dir):
    classes = [d for d in os.listdir(dir) if os.path.isdir(os.path.join(dir, d)) and not d.startswith('.')]
    classes.sort()
    class_to_idx = {classes[i]: i for i in range(len(classes))}
    return classes, class_to_idx

def imshow(input, title):
    input = input.numpy().transpose((1, 2, 0))
    mean = np.array([0.485, 0.456, 0.406])
    std = np.array([0.229, 0.224, 0.225])
    input = std * input + mean
    input = np.clip(input, 0, 1)
    plt.imshow(input)
    plt.title(title)
    plt.show()

# main 코드 시작
if __name__ == '__main__':
    transforms_train = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    transforms_test = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    data_dir = 'C:/Code/mon/gp/글꼴'
    train_datasets = datasets.ImageFolder(os.path.join(data_dir, 'train'), transforms_train)
    test_datasets = datasets.ImageFolder(os.path.join(data_dir, 'test'), transforms_test)
    train_dataloader = torch.utils.data.DataLoader(train_datasets, batch_size=4, shuffle=True, num_workers=4)
    test_dataloader = torch.utils.data.DataLoader(test_datasets, batch_size=4, shuffle=True, num_workers=4)

    print('학습 데이터셋 크기:', len(train_datasets))
    print('테스트 데이터셋 크기:', len(test_datasets))
    class_names = train_datasets.classes
    print('클래스:', class_names)

    iterator = iter(train_dataloader)
    inputs, classes = next(iterator)
    out = torchvision.utils.make_grid(inputs)
    imshow(out, title=[class_names[x] for x in classes])

    # 중단 예정인 코드
    model = models.resnet34(pretrained=True)
    num_features = model.fc.in_features
    model.fc = nn.Linear(num_features, 9)
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.SGD(model.parameters(), lr=0.001, momentum=0.9)

    model = torch.load('C:/Code/mon/gp/model.pt')
    model = model.to(device)  # CUDA 지원 여부를 확인하여 GPU 또는 CPU로 이동

    num_epochs = 50
    model.train()
    start_time = time.time()
    loss_graph = []

    for epoch in range(num_epochs):
        running_loss = 0.
        running_corrects = 0
        for inputs, labels in train_dataloader:
            inputs = inputs.to(device)
            labels = labels.to(device)
            optimizer.zero_grad()
            outputs = model(inputs)
            _, preds = torch.max(outputs, 1)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            running_loss += loss.item() * inputs.size(0)
            running_corrects += torch.sum(preds == labels.data)
        epoch_loss = running_loss / len(train_datasets)
        epoch_acc = running_corrects / len(train_datasets) * 100.
        loss_graph.append(epoch_loss)
        print('#{} Loss: {:.4f} Acc: {:.4f}% Time: {:.4f}s'.format(epoch, epoch_loss, epoch_acc, time.time() - start_time))

    plt.plot(loss_graph)
    plt.ylim(0,1)
    plt.show()

    model.eval()
    start_time = time.time()

    with torch.no_grad():
        running_loss = 0.
        running_corrects = 0
        for inputs, labels in test_dataloader:
            inputs = inputs.to(device)
            labels = labels.to(device)
            outputs = model(inputs)
            _, preds = torch.max(outputs, 1)
            loss = criterion(outputs, labels)
            running_loss += loss.item() * inputs.size(0)
            running_corrects += torch.sum(preds == labels.data)
            print(f'[예측 결과: {class_names[preds[0]]}] (실제 정답: {class_names[labels.data[0]]})')
            imshow(inputs.cpu().data[0], title='예측 결과: ' + class_names[preds[0]])
        epoch_loss = running_loss / len(test_datasets)
        epoch_acc = running_corrects / len(test_datasets) * 100.
        print('[Test Phase] Loss: {:.4f} Acc: {:.4f}% Time: {:.4f}s'.format(epoch_loss, epoch_acc, time.time() - start_time))

    path = 'C:/Code/mon/gp/글꼴/test'
    path_list = os.listdir(path)
    for k in path_list:
        print(k)
        df = pd.DataFrame()
        class_list = []
        prob_list = []
        for i in [26, 27, 28, 29, 30]:
            image = Image.open(path + '{}/{}{}.png'.format(k, k, i)).convert('RGB')
            image = transforms_test(image).unsqueeze(0).to(device)
            with torch.no_grad():
                outputs = model(image)
                _, preds = torch.max(outputs, 1)
                softmax = nn.Softmax(dim=1)
                probabilities = softmax(outputs)
                top_probability, top_class = probabilities.topk(5, dim=1)
            imshow(image.cpu().data[0], title='inputs')
            for j in [0,1,2]:
                class_list.append(class_names[top_class[0][j]])
                prob_list.append(top_probability[0][j].item())
        df = pd.concat([pd.Series(class_list), pd.Series(prob_list)], axis=1)
        df.to_csv('C:/Code/mon/gp/유사 글꼴/유사확률_{}.csv'.format(k), encoding='cp949')
