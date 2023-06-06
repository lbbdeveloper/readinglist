import mongoose from "mongoose";

mongoose
  .connect(process.env.DATABASE_URL, {
    // no longer needed for current version

    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("connected");
  });

// const db = mongoose.connection;

// db.on("connected", function () {
//   console.log(`Connected to MongoDB ${db.name} at ${db.host}:${db.port}`);
// });
