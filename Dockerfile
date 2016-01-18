FROM ubuntu:trusty
MAINTAINER David Nunez <arizonatribe@gmail.com>

# Default locations for Node Version Manager and version of Node to be installed
ENV NODE_VERSION 0.10.18
ENV NVM_DIR /.nvm

EXPOSE 5000

VOLUME ['/src']
ADD . /src
WORKDIR /src

RUN apt-get update

# Install general dependencies
RUN apt-get install -y \
    jq \
    tar \
    git \
    curl \
    vim \
    wget \
    make \
    dialog \
    net-tools \
    build-essential

# Install Python-specific tools
RUN apt-get install -y \
    python \
    python-dev \
    python-distribute \
    python-pip

RUN pip install flask

# Default version of Node to be installed; can be overridden
RUN git clone https://github.com/creationix/nvm.git $NVM_DIR
RUN echo ". $NVM_DIR/nvm.sh" >> /etc/bash.bashrc

# Install node.js
RUN /bin/bash -c ". $NVM_DIR/nvm.sh && nvm install v$NODE_VERSION && nvm use v$NODE_VERSION && nvm alias default v$NODE_VERSION && ln -s $NVM_DIR/v$NODE_VERSION/bin/node /usr/bin/node && ln -s $NVM_DIR/v$NODE_VERSION/bin/npm /usr/bin/npm"

# Global npm CLI tools that are used in the scripts block of package.json
RUN npm install -g uglify-js@2.6.1 less@2.5.3 jade-cli@0.1.1 lodash-cli@3.10.1

# Execute the chain of build steps outlined in the scripts block of package.json
RUN npm run build

CMD ["python", "app/server/app.py"]
