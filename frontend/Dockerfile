FROM node

# if left blank app will run with dev settings
# to build production image run:
# $ docker build ./frontend --build-args app_env=production
ENV NPM_CONFIG_LOGLEVEL warn
ARG app_env
ENV NODE_ENV $app_env

RUN mkdir -p /frontend
WORKDIR /frontend
COPY ./ ./

RUN npm install
RUN npm install child_process
RUN apt-get update && apt-get -y install unzip python python-pip python-tk latexmk texlive-latex-extra texlive-humanities
RUN pip install nltk pylatex
RUN python -m nltk.downloader punkt
RUN mkdir /usr/local/share/texmf/tex
RUN mkdir /usr/local/share/texmf/tex/latex
RUN cd /tmp && wget http://mirrors.ctan.org/graphics/pgf/contrib/tikz-qtree.zip && unzip tikz-qtree.zip -d /usr/local/share/texmf/tex/latex
RUN texhash && mktexlsr

# if dev settings will use create-react start script for hot code relaoding via docker-compose shared volume
# if production setting will build optimized static files and serve using http-server
CMD if [ ${NODE_ENV} = production ]; \
	then \
	npm install -g http-server && \
	npm run build && \
	cd build && \
	hs -p 3000; \
	else \
	npm run start; \
	fi

EXPOSE 3000
