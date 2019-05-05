var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/' , function(req,res){
	res.render("login",{title:'User Login'});
})

router.post('/', function(req,res){
	//get User info
	var User = global.dbHandle.getModel('user');
	var uname = req.body.uname;
	User.findOne({name:uname},function(err,doc){
		if(err){
			res.send(500);
			console.log(err);
		}else if(!doc){
			req.session.error = '用户名不存在';
			res.send(404);
		//	res.redirect("/login");
		}else{ 
			if(req.body.upwd != doc.password){
				req.session.error = "密码错误";
				res.send(404);
			//	res.redirect("/login");
			}else{
				req.session.user = doc;
				res.send(200);
			//	res.redirect("/home");
			}
		}
	});
});

module.exports = router;