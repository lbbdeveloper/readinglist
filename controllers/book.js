import { Book } from "../models/book.js";
import { Profile } from "../models/profile.js";

export { index, newBook as new };

function index(req, res) {
  Book.find({}, function (err, book) {
    res.render("book/show", {
      book: book,
      title: "All Book",
    });
  });
}

function newBook(req, res) {
  res.render("book/new", {
    title: "Add Book",
  });
}
