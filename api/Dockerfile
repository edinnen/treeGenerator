FROM golang

# if left blank app will run with dev settings
# to build production image run:
# $ docker build ./api --build-args app_env=production
ARG app_env
ENV APP_ENV $app_env

# it is okay to leave user/GoDoRP as long as you do not want to share code with other libraries
COPY . /go/src/github.com/user/GoDoRP/api
WORKDIR /go/src/github.com/user/GoDoRP/api

# Install Java/Python/LaTeX and script dependencies
RUN apt-get update && apt-get -y install wget unzip imagemagick default-jre default-jdk python python-pip python-tk latexmk texlive-latex-extra texlive-humanities
RUN pip install nltk pylatex
RUN python -m nltk.downloader punkt
# RUN mkdir /usr/local/share/texmf/tex
RUN mkdir -p /usr/local/share/texmf/tex/latex
RUN cd /tmp && wget http://mirrors.ctan.org/graphics/pgf/contrib/tikz-qtree.zip && unzip tikz-qtree.zip -d /usr/local/share/texmf/tex/latex
RUN texhash && mktexlsr

# added vendor services will need to be included here
RUN go get ./vendor/database

RUN go get ./
RUN go build

# if dev setting will use pilu/fresh for code reloading via docker-compose volume sharing with local machine
# if production setting will build binary
CMD if [ ${APP_ENV} = production ]; \
	then \
	api; \
	else \
	go get github.com/pilu/fresh && \
	fresh; \
	fi

EXPOSE 8080
