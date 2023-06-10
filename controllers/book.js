import { Book } from "../models/book.js";
import { Profile } from "../models/profile.js";
import axios from "axios";

export {
  index,
  newBook as new,
  create,
  show,
  apibookshow,
  addToList,
  removefromlist,
  deleteBook as delete,
  edit,
  update,
  search,
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

function apibookshow(req, res) {
  //use googleBookId to check if searched book already exists in database
  //use book._id to render book.show page
  Book.findOne({ googleBookId: req.params.id }).then((book) => {
    if (book) {
      //to make sure use book._id to render, not googleBookId
      res.redirect(`/book/${book._id}`);
    } else {
      axios
        .get(
          `https://www.googleapis.com/books/v1/volumes/${req.params.id}?key=${process.env.API_KEY}`
        )
        .then((response) => {
          const newBook = new Book({
            googleBookId: req.params.id,
            name: response.data.volumeInfo.title,
            img: response.data.volumeInfo.imageLinks?.thumbnail,
            author: response.data.volumeInfo.authors[0]
              ? response.data.volumeInfo.authors[0]
              : "",
            description: response.data.volumeInfo.description,
          });
          newBook.save(function (err) {
            if (err) {
              console.log(err);
              return res.redirect("/");
            }
            res.redirect(`/book/${newBook._id}`);
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/");
        });
    }
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

function removefromlist(req, res) {
  Profile.findById(req.user.profile._id).then((profile) => {
    if (profile.books.includes(req.params.id)) {
      const filteredBooks = profile.books.filter(
        (book) => book._id != req.params.id
      );
      profile.books = filteredBooks;
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

function search(req, res) {
  if (!req.body.search) {
    res.redirect("/");
  }
  axios
    .get(
      `https://www.googleapis.com/books/v1/volumes?q=${req.body.search}:keyes&key=${process.env.API_KEY}`
    )
    .then((response) => {
      // POST method is done at /book/search
      //res.render doesn't change url
      res.render("book/showsearch", {
        title: "Search results",
        results: response.data.items,
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
}
