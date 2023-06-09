import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import passport from "passport";
import https from "https";
import http from "http";
import fs from "fs";
import os from "os";
import { router as indexRouter } from "./routes/index.js";
import { router as authRouter } from "./routes/auth.js";
import { router as profileRouter } from "./routes/profile.js";
import { router as bookRouter } from "./routes/books.js";
import("./config/passport.js");
import("./config/database.js");
import methodOverride from "method-override";

// set up dotenv path
dotenv.config({ path: ".env" });

const app = express();

app.use(methodOverride("_method"));

// set up view engine
app.set(
  "views",
  path.join(path.dirname(fileURLToPath(import.meta.url)), "views")
);
app.set("view engine", "ejs");

// set up public folder as static to the server
app.use(
  express.static(
    path.join(path.dirname(fileURLToPath(import.meta.url)), "public")
  )
);

let server;

if (process.env.NODE_ENV !== "production") {
  //os.homedir to get path of the home directory for the current user
  const homedir = os.homedir();
  const options = {
    key: fs.readFileSync(`${homedir}/certs/localhost/localhost.key`),
    cert: fs.readFileSync(`${homedir}/certs/localhost/localhost.crt`),
  };
  server = https.createServer(options, app);
} else {
  server = http.createServer(app);
}

const port = 3000;
server.listen(port, () => {
  console.log(`app running on port ${port}...`);
});

//session middleware
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "lax",
    },
  })
);

// mount passport after session middleware and before routes
app.use(passport.initialize());
//as the user navigates from page to page, the session itself can be authenticated
//using the built-in session strategy
app.use(passport.session());

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/myreadinglist", profileRouter);
app.use("/book", bookRouter);
