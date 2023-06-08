import { Book } from "../models/book.js";
import { Profile } from "../models/profile.js";

export { index, newBook as new, create, show };

function index(req, res) {
  Book.find({}, function (err, book) {
    res.render("book/index", {
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

function create(req, res) {
  for (let key in req.body) {
    if (req.body[key] === "") delete req.body[key];
  }
  const book = new Book(req.body);
  book.save(function (err) {
    if (err) {
      console.log(err);
      return res.redirect("/book/new");
    }
    res.redirect(`/book/${book._id}`);
  });
}

function show(req, res) {
  Book.findById(req.params.id).then((book) => {
    res.render("book/show", {
      title: "Book Detail",
      book: book,
    });
  });
}
