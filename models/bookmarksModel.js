  const mongoose = require('mongoose');

  const bookmarksSchema = mongoose.Schema({
      id: {
          type: String,
          required: true,
          unique: true
      },
      title: {
          type: String,
          required: true,
      },
      description: {
          type: String,
          required: true
      },
      url: {
          type: String,
          required: true
      },
      rating: {
          type: Number,
          required: true
      }
  })

  const bookmarksCollection = mongoose.model('bookmarks', bookmarksSchema);

  const bookmarks = {
      getBookmarks: function() {
          return bookmarksCollection
              .find()
              .then(allBookmarks => {
                  return allBookmarks;
              })
              .catch(err => {
                  return err;
              });
      },
      getBookmark: function(bookTitle) {
          return bookmarksCollection
              .find(bookTitle)
              .then(foundBookmarks => {
                  return foundBookmarks;
              })
              .catch(err => {
                  return err;
              });
      },
      createBookmark: function(newBookmark) {
          return bookmarksCollection
              .create(newBookmark)
              .then(createdBookmark => {
                  return createdBookmark;
              })
              .catch(err => {
                  return err;
              });
      },
      deleteBookmark: function(bookmarkId) {
          return bookmarksCollection
              .deleteOne(bookmarkId)
              .then(deletedBookmarks => {
                  return deletedBookmarks;
              })
              .catch(err => {
                  return err;
              });
      },
      updateBookmark: function(bookmarkId, bookmark) {
          return bookmarksCollection
              .update(bookmarkId, bookmark)
              .then(updatedBookmarks => {
                  return updatedBookmarks;
              })
              .catch(err => {
                  return err;
              });
      }
  }

  module.exports = { bookmarks };