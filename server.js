const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const uuid = require('uuid');
const morgan = require('morgan');
const authorization = require('./middleware/authorization');
const app = express();

app.use(morgan('dev'));
app.use(authorization);

const books = [{
        id: uuid.v4(),
        title: "Paintings",
        description: "Books about paintings and hotcakes",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        rating: 10
    },
    {
        id: uuid.v4(),
        title: "RickRoll",
        description: "How to master the art of reddit trolling",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        rating: 10
    },
    {
        id: uuid.v4(),
        title: "Tanuki",
        description: "The invastigation on one of the best brands of jeans",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        rating: 9
    },
    {
        id: uuid.v4(),
        title: "Screws",
        description: "A compendium of Terry Crews photos",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        rating: 10
    }
]


app.get('/bookmarks', (req, res) => {
    return res.status(200).json(books)
});

app.get('/bookmark', (req, res) => {
    console.log("Getting a student by title using the integrated param.");
    console.log(req.params);
    let title = req.query.title;

    if (!title) {
        res.statusMesagge = "Title is required";
        return res.status(406).end();
    }
    let result = books.find((book) => {
        if (book.title == title) {
            return book
        }
    });
    if (!result) {
        res.statusMesagge = `${title} not found`;
        return res.status(404).end();
    }
    return res.status(200).json(result);
});

app.post('/bookmarks', jsonParser, (req, res) => {
    console.log("Adding a new bookmark");
    console.log("Body ", req.body);
    let { title, description, url, rating } = req.body;
    if (!title || !description || !url || !rating) {
        res.statusMessage = "Missing Fields";
        res.status(406).end();
    }
    let flag = true;
    for (let i = 0; i < books.length; i++) {
        if (books[i].title === title) {
            flag = !flag;
            break;
        }
    }

    if (!flag) {
        res.statusMessage = "The book is already on the bookmarks";
        return res.status(409).end();
    }

    let newBookmark = {
        id: uuid.v4(),
        title: title,
        description: description,
        url: url,
        rating: rating
    }
    books.push(newBookmark);
    return res.status(201).json(newBookmark);
});

app.delete('/bookmark/:id', (req, res) => {
    let id = req.params.id;
    console.log(id)
    if (!id) {
        res.statusMessage = "Missing id";
        return res.status(406).end();
    }
    let bookToRemove = books.findIndex((book) => {
        if (book.id == id) {
            return true;
        }
    });
    if (bookToRemove < 0) {
        res.statusMessage = "The id of the book was not found on the list of the bookmarks";
        return res.status(404).end();
    }
    books.splice(bookToRemove, 1);
    return res.status(200).end();
});

app.patch('/bookmark/:id', jsonParser, (req, res) => {
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
    let result = books.find((book) => {
        if (book.id == id) {
            return book
        }
    });
    if (!result) {
        res.statusMessage = "The id given was not found";
        return res.status(404).end();
    }
    if (title) {
        result.title = title;
    }
    if (description) {
        result.description = description;
    }
    if (url) {
        result.url = url;
    }
    if (rating) {
        result.rating = Number(rating);
    }
    res.status(202).json(result);
});

app.listen(8025, () => {
    console.log("Server on port 8025 is running");
});

// Base URL : http://localhost:8025/
// GET endpoint : http://localhost:8025/bookmarks
// GET endpoint : http://localhost:8025/bookmark?title=value
// POST endpoint : http://localhost:8025/bookmarks
// DELETE endpoint : http://localhost:8025/bookmark/id 
// PATCH endpoint: http://localhost:8025/bookmark/id