FROM ubuntu:24.04

RUN apt-get update

RUN apt-get install -y \
    curl \
    git \
    ca-certificates \
    build-essential 

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]