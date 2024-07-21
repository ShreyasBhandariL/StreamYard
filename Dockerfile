FROM ubuntu:focal

# Use a better mirror for apt
RUN sed -i 's|http://archive.ubuntu.com/ubuntu/|http://mirrors.edge.kernel.org/ubuntu/|g' /etc/apt/sources.list

# Update, install curl, setup NodeSource, update again, upgrade and install nodejs and ffmpeg
RUN apt-get update && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y nodejs ffmpeg

WORKDIR /home/app

COPY . .

# Install nodemon globally
RUN npm install

# Command to run the application
CMD ["node", "index.js"]
