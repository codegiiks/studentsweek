FROM node:current

COPY package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /var/lib/jenkins/workspace/studentsweek && cp -a /tmp/node_modules /var/lib/jenkins/workspace/studentsweek

WORKDIR /opt/app
COPY . /opt/app

EXPOSE 3000
