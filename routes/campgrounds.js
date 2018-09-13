var express    = require("express"),
    router     = express.Router({mergeParams:true}),
    Campground = require("../models/campground"),
    middleware = require("../middleware");

//index route

router.get("/",function (req,res) {
  Campground.find({},function (err,allCampgrounds) {
    if (err) {
      console.log(err);
    }else {
      res.render("./campgrounds/campgrounds",{campgrounds:allCampgrounds,
        currentUser : req.user});
    }
  });
});

//new route
router.get("/new",middleware.isLoggedIn,function (req,res) {
  res.render("./campgrounds/new");
});

router.post("/",middleware.isLoggedIn,function (req,res) {
  //author from user database, name of the log in user
  var author = {
    id : req.user._id,
    username : req.user.username
  };
  Campground.create({
    adTitle       : req.body.adTitle,
    category      : req.body.category,
    contactNumber : req.body.contactNumber,
    college       : req.body.college,
    name          : req.body.name,
    image         : req.body.image,
    description   : req.body.description,
    price         : req.body.price,
    author        : author
  },function (err,campground) {
    if (err) {
      req.flash("error","Can't create Campground");
      res.redirect("back");
    }else {
      res.redirect("/campgrounds");
      console.log(campground);
    }
  });

});

//show route

router.get("/show/:id",function (req,res) {

  Campground.findById(req.params.id,function (err,campground) {

    if (err) {
      req.flash("error","Can't find Campground");
      res.redirect("back");
    }else {
      res.render("./campgrounds/show",{campground:campground});
    }
  });

});

//edit campground

router.get("/:id/edit",middleware.checkCampgroundOwnership,function (req,res) {
    Campground.findById(req.params.id,function (err,foundCampground) {
      console.log(foundCampground);
      if (err) {
        req.flash("error","Can't find Campground");
        res.redirect("back");
      }else {
          res.render("./campgrounds/edit",{campground : foundCampground});
        }
    });
});

//update campground

router.put("/:id",middleware.checkCampgroundOwnership,function (req,res) {
  console.log(req.body.campground);
  Campground.findByIdAndUpdate(req.params.id,req.body.campground,
    function (err,updatedCampground) {
    if (err) {
      req.flash("error","Campground was not be Updated!");
      res.redirect("/campgrounds");
    }else {
      req.flash("success","Campground Updated!");
      res.redirect("show/" + req.params.id);
    }
  });
});

//delete campgrounds

router.delete("/:id",middleware.checkCampgroundOwnership,function (req,res) {
  Campground.findByIdAndRemove(req.params.id,function (err) {
    if (err) {
      req.flash("error","Campground was not deletd !");
      res.redirect("/campgrounds");
    }
    else {
      req.flash("success","Campground Deleted!");
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
