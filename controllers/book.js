import { Book } from "../models/book.js";
import { Profile } from "../models/profile.js";

export {
  index,
  newBook as new,
  create,
  show,
  addToList,
  deleteBook as delete,
  edit,
  update,
};

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

function addToList(req, res) {
  Profile.findById(req.user.profile._id).then((profile) => {
    if (!profile.books.includes(req.params.id)) {
      profile.books.push(req.params.id);
    }
    profile.save(function (err) {
      if (err) {
        console.log(err);
        return res.redirect("/");
      }
      res.redirect(`/myreadinglist/${profile._id}`);
    });
  });
}

function deleteBook(req, res) {
  Book.findByIdAndDelete(req.params.id, function (err, book) {
    res.redirect("/book");
  });
}

function edit(req, res) {
  Book.findById(req.params.id, function (err, book) {
    res.render("book/edit", {
      book: book,
      title: "Edit Book",
    });
  });
}

function update(req, res) {
  for (let key in req.body) {
    if (req.body[key] === "") {
      delete req.body[key];
    }
  }
  Book.findByIdAndUpdate(req.params.id, req.body, function (err, book) {
    if (err) {
      res.send(err);
    } else {
      res.redirect(`/book/${book._id}`);
    }
  });
}
