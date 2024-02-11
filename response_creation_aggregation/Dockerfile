FROM python:3.11

WORKDIR /project

# Pick up some TF dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        tree \
        curl \
        libfreetype6-dev \
        libpng-dev \
        libzmq3-dev \
        pkg-config \
        rsync \
        software-properties-common \
        unzip \
        libgtk2.0-0 \
        git \
        tcl-dev \
        tk-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Pillow and it's dependencies
RUN apt-get install -y --no-install-recommends libjpeg-dev zlib1g-dev && \
    pip3 --no-cache-dir install Pillow

# Science libraries and other common packages
RUN pip3 --no-cache-dir install \
    numpy scipy scikit-learn scikit-image pandas matplotlib Cython requests

# Large Language Models
RUN pip3 install --upgrade pip
RUN pip3 install \
    sentencepiece \
    openai chromadb langchain \
    tiktoken 

RUN PROTOC_ZIP=protoc-3.15.8-linux-x86_64.zip && \
    curl -OL https://github.com/google/protobuf/releases/download/v3.15.8/$PROTOC_ZIP && \
    unzip -o $PROTOC_ZIP -d /usr/local bin/protoc && \
    unzip -o $PROTOC_ZIP -d /usr/local include/* && \
    rm -f $PROTOC_ZIP

RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y
RUN pip3 install flask flask_cors gunicorn

ENV PYTHONUNBUFFERED 1

COPY endpoint ./endpoint
COPY setup.py setup.py
COPY requirements.txt requirements.txt

ENV FLASK_APP ./endpoint/app.py 

RUN pip3 install -e .
# RUN pip3 install -r requirements.txt


ENTRYPOINT ["python", "/project/endpoint/app.py"]