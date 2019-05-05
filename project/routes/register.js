var express = require('express');
var router = express.Router();

router.get('/', function(req,res){
	res.render("register",{title:'User register'});
})

router.post('/', function(req,res){ 
	var User = global.dbHandel.getModel('user');
	var uname = req.body.uname;
	var upwd = req.body.upwd;
	User.findOne({name: uname},function(err,doc){
		if(err){ 
			res.send(500);
			req.session.error =  '网络异常错误！';
			console.log(err);
		}else if(doc){ 
            req.session.error = '用户名已存在！';
            console.log(err);
			res.send(500);
		}else{ 
			User.create({
				name: uname,
				password: upwd
			},function(err,doc){ 
				 if (err) {
                        res.send(500);
                        console.log(err);
                    } else {
                        req.session.error = '用户名创建成功！';
                        res.send(200);
                    }
                  });
		}
	});
});

module.exports = router;