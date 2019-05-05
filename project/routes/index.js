var express = require('express');
var router = express.Router();

/* GET index page. */
router.get('/', function(req, res,next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get("/home",function(req,res){ 
	if(!req.session.user){
		req.session.error = "请先登录"
		res.redirect("/login");
	}
	res.render("home",{title:'Home'});
});

/* GET logout page. */
router.get("/logout",function(req,res){
	req.session.user = null;
	req.session.error = null;
	res.redirect("/");
});

module.exports = router;
