const User = require("../../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");
function authController() {
  return {
    login: function(req, res) {
      res.render("auth/login");
    },
    postlogin(req, res, next) {
      const { email, password } = req.body;
      //validate request
      if (!email || !password) {
        req.flash("error", "All fields are required!! ");
        req.flash("email", email);
        return res.redirect("/login");
      }
      passport.authenticate("local", (err, user, info) => {
        if (err) {
          req.flash("error", info.message);
          return next(err);
        }
        if (!user) {
          req.flash("error", info.message);
          return res.redirect("/login");
        }
        req.login(user, () => {
          if (err) {
            req.flash("error", info.message);
            return next(err);
          }
          return res.redirect("/");
        });
      })(req, res, next);
    },
    logout(req, res) {
      req.logout();
      res.redirect("/");
    },
    register(req, res) {
      res.render("auth/register");
    },
    async postregister(req, res) {
      const { name, email, password } = req.body;
      //validate rrequest
      if (!name || !email || !password) {
        req.flash("error", "All fields are required!!");
        req.flash("name", name);
        req.flash("email", email);
        return res.redirect("/register");
      }
      //check email exixts
      User.exists({ email: email }, (err, result) => {
        if (result) {
          req.flash("error", "Email already exists");
          req.flash("name", name);
          req.flash("email", email);
          return res.redirect("/register");
        }
      });
      //hashpassword
      const hashedpassword = await bcrypt.hash(password, 10);
      //create user
      const user = new User({
        name: name,
        email: email,
        password: hashedpassword,
      });
      user
        .save()
        .then((re) => {
          //login
          return res.redirect("/");
        })
        .catch((err) => {
          console.log(err);
          req.flash("error", "something went wrong");
          return res.redirect("/register");
        });
    },
  };
}
module.exports = authController;
