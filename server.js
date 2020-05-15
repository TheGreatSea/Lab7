const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const uuid = require('uuid');
const morgan = require('morgan');
const authorization = require('./middleware/authorization');
const app = express();
//const cors = require('./middleware/cors');
const { DATABASE_URL, PORT } = require('./config');
const mongoose = require('mongoose')
const { bookmarks } = require('./models/bookmarksModel');

//app.use(cors);
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(authorization);

app.get('/bookmarks', (req, res) => {
    bookmarks
        .getBookmarks()
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(err => {
            res.statusMessage = "Error with the database";
            return res.status(500).end();
        });
});

app.get('/bookmark', (req, res) => {
    console.log("Getting a student by title using the integrated param.");
    console.log(req.params);
    let title = req.query.title;

    if (!title) {
        res.statusMesagge = "Title is required";
        return res.status(406).end();
    }

    bookmarks
        .getBookmark({ title })
        .then(result => {
            if (result.lengtj === 0) {
                res.statusMesagge = `${title} not found`;
                return res.status(404).end();
            }
            return res.status(200).json(result);
        })
        .catch(err => {
            res.statusMessage = "Error with the database";
            return res.status(500).end();
        });
});

app.post('/bookmarks', jsonParser, (req, res) => {
    console.log("Adding a new bookmark");
    console.log("Body ", req.body);
    let { title, description, url, rating } = req.body;
    if (!title || !description || !url || !rating) {
        res.statusMessage = "Missing Fields";
        res.status(406).end();
    }

    let newBookmark = {
        id: uuid.v4(),
        title: title,
        description: description,
        url: url,
        rating: rating
    }
    bookmarks
        .createBookmark(newBookmark)
        .then(result => {
            if (result.errmsg) {
                res.statusMessage = "The book is already on the bookmarks" +
                    result.errmsg;
                return res.status(409).end();
            }
            return res.status(201).json(result);
        })
        .catch(err => {
            res.statusMessage = "Error with the database";
            return res.status(500).end();
        });
});

app.delete('/bookmark/:id', (req, res) => {
    let id = req.params.id;
    console.log(id)
    if (!id) {
        res.statusMessage = "Missing id";
        return res.status(406).end();
    }
    bookmarks
        .deleteBookmark({ id })
        .then(result => {
            if (result.deletedCount === 0) {
                res.statusMessage = "The id of the book was not found on the list of the bookmarks";
                return res.status(404).end();
            }
            return res.status(200).json(result);
        })
        .catch(err => {
            res.statusMessage = "Error with the database";
            return res.status(500).end();
        });
});

app.patch('/bookmark/:id', jsonParser, (req, res) => {
    console.log(req.body);
    let { id, title, description, url, rating } = req.body;
    let paramsID = req.params.id;
    console.log(id);
    if (!id) {
        res.statusMessage = "id was not sent in request";
        return res.status(406).end();
    }
    if (id !== paramsID) {
        res.statusMessage = "The ids do not match";
        return res.status(409).end();
    }
    let Bookmark = {
        id: String(id)
    }

    if (title) {
        Bookmark['title'] = String(title);
    }
    if (description) {
        Bookmark['description'] = String(description);
    }
    if (url) {
        Bookmark['url'] = String(url);
    }
    if (rating) {
        Bookmark['rating'] = parseInt(rating);
    }
    console.log(Bookmark);

    bookmarks
        .updateBookmark({ id: id }, Bookmark)
        .then(result => {
            return res.status(202).json(result);
        })
        .catch(err => {
            res.statusMessage = "Error with the database";
            return res.status(500).end();
        });

});

app.listen(PORT, () => {
    console.log("this server is running on port 27017");
    new Promise((resolve, reject) => {
            const settings = {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            };
            mongoose.connect(DATABASE_URL, settings, (err) => {
                if (err) {
                    return reject(err);
                } else {
                    console.log("Database connected successfully.");
                    return resolve();
                }
            })
        })
        .catch(err => {
            console.log(err);
        })

});

// Base URL : http://localhost:27017/
// GET endpoint : http://localhost:27017/bookmarks
// GET endpoint : http://localhost:27017/bookmark?title=value
// POST endpoint : http://localhost:27017/bookmarks
// DELETE endpoint : http://localhost:27017/bookmark/id 
// PATCH endpoint: http://localhost:27017/bookmark/id