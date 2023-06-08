import { Profile } from "../models/profile.js";

function show(req, res) {
  Profile.findById(req.params.id)
    .populate("books")
    .exec(function (err, profile) {
      res.render("profile/show", {
        title: "My Reading List",
        profile: profile,
      });
    });
}

export { show };
