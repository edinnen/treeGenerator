# Linguistic Syntax Tree Generator

This app allows you to submit a sentence for analysis into a linguistic syntax tree representation.

## Features

* Golang as an API
* React as a frontend
* Postgres as a database to store the sentence string and base64 encoded .png
* Docker for development and production
* Trees are generated with Python. Python takes in a string, uses NLTK to tokenize and analyze, applies a custom RegEx parser, generates a LaTeX file, creates a .png, and returns a base64 encoded string

## To Run
* Requires [docker-compose](https://docs.docker.com/compose/install/)

```bash
$ git clone https://github.com/edinnen/treeGenerator
$ docker-compose up
```

Navigate to localhost:3000 to see the app. The RESTful GoLang API is located at localhost:5000

To build production images run:

```bash
$ docker build ./api --build-arg app_env=production
$ docker build ./frontend --build-arg app_env=production
$ docker build ./db
```
