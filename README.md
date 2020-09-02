# ЕБУК

Online book-review tool.

This repo is a dockerized web application with Express.js on the back-end the Alpine.js on the front-end.

## Installation

To run, firstly add the environment variables. Create `.env` file in the root with the similar content:

```
MONGO_URL=mongodb://url-to-your-mongodb-database
```

Then, just run:

```bash
$ docker-compose up
```

You can see the app at the [localhost/](http://localhost/), and the API at the [localhost:8080/](http://localhost:8080/)