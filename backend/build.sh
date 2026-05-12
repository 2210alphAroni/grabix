#!/bin/bash

npm install

pip install -U yt-dlp

apt-get update
apt-get install -y ffmpeg python3 python3-pip curl

curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs