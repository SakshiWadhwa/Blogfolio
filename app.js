var express = require("express");
var bodyparser = require("body-parser");
var url = require("url");
var mysql = require("mysql");
var session = require("express-session");
var formidable = require('formidable');
var fs = require('fs-extra');
var random = require("random-key")

var app = express();
app.use(bodyparser.urlencoded({extended:true}));
app.use(session({secret:'hello'}));
app.use('/static',express.static('static'));
app.set("view engine", "ejs");

var con = mysql.createConnection({
	host:"localhost",
	user:"root",
	password:"",
	database:"blogfolio"
});

app.get('/', function(req, res)
{
	var blog = "select * from blog";
	con.query(blog, function(err, blog_result)
	{
		res.render('frontend/index',{data_blog:blog_result});	
	});
});

app.get('/blog_post', function(req, res)
{
	var q = 'select * from blog';
	con.query(q, function(err, blog_post_result)
	{
		res.render('frontend/blog', {blog_post_data:blog_post_result});
	});
		
});

app.get('/blog_page_link/:title/:id', function(req, res)
{
	var q = 'select * from blog';
	con.query(q, function(err, blog_page_result)
	{
		res.render('frontend/blog_page', {blog_page_data:blog_page_result, blog_page_title:req.params.title, blog_page_id:req.params.id});
		// console.log(blog_page_result);
	});
});


/*-------------------------------------------SERVER--------------------------------------------------------------*/
app.get('/login', function(req,res)
{
	if(req.session.name)
	{
		res.redirect("/dashboard");
	}
	else
	{
		res.render('login');
	}
});

app.post('/login_page', function(req,res)
{
	var email = req.body.emailfield;
	var password = req.body.passwordfield;
	var status = req.body.sel;

	var q = "select count (email) as val from admin where email = '" + email + "' and password = '" + password + "' and status = 'active'";
	con.query(q, function(err,result)
	{
		if(err)
		{
			throw err;
		}
		if(result[0].val == 1)
		{
			req.session.name = email;
			res.redirect('/dashboard');
		}
		else
		{
			res.render('login');
		}
	});
});

app.get("/dashboard", function(req,res)
{
	if(req.session.name)
	{
		res.render('dashboard');
	}
	else 
	{
		res.redirect('/login');
	}
});

app.get("/add_blog", function(req,res)
{
	res.render('Blog/add_blog');
})

/*------------------insert data into table----------------------------*/
app.post("/addBlog", function(req,res)
{
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files)
	{
		var test, desig, review, img, desc, status;
		title = fields.blg_title;
		date = fields.blg_date;
		author = fields.blg_author;
		img = files.blg_img.path;
		desc = fields.blg_description;
		status = fields.blg_status;

		var newpath = "/static/" + files.blg_img.name;
		fs.copy(img, newpath, function(err)
		{
			if(err) throw err;
			console.log("file renamed");
		});

		var q = "insert into blog (blog_title, blog_date, blog_author, blog_img, blog_description, blog_status) values ('" + title + "', ' " + date + "', '" + author + "', '" + newpath + "', '" + desc + "', '" + status + "' )";
		con.query(q, function(err, result)
		{
			if(err)
			{
				throw err;
			}
			console.log("blog inserted; ");
			res.end('<a href = "/viewblog">' + 'View Blogs' + '</a>');
		});
	});
	
});

/*-------------------view through id---------------------------------*/
app.get("/view_blg_data/:id", function(req,res)
{
	if(req.session.name)
	{
		var q = "select * from blog where blog_id = '" + req.params.id + "'";
		con.query(q, function(err,result)
		{
			if(err)
			{
				throw err;
			}
			res.render("Blog/viewBlogEntry", {data:result});
		});
	}
	else
	{
		res.redirect('/');
	}
});

/*-----------------update project--------------------------------*/
app.get("/update_blg_data/:blg_id", function(req,res)
{
	if(req.session.name)
	{
		var q = "select * from blog where blog_id = '" + req.params.blg_id + "'";

		con.query(q, function(err,result)
		{
			if(err)
			{
				throw err;
			}
			res.render("Blog/add_blog", {data:result});
		});
	}
	else
	{
		res.redirect('/');
	}
	
});

app.post("/update_blog/:blg_title", function(req,res)
{
	var title, date, author, img, desc, status;
	title = req.params.blg_title;

	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files)
	{
		date = fields.blg_date;
		author = fields.blg_author;
		img = files.blg_img.path;
		desc = fields.blg_description;
		status = fields.blg_status;

		var newpath = "/static/" + files.blg_img.name;
		fs.copy(img, newpath, function(err)
		{
			if(err) throw err;
			console.log("file renamed after updated");
		});

		var q = "UPDATE blog SET blog_img= '" + newpath + "', blog_status = '" + status + "' where blog_title = '" + title + "'";
		con.query(q, function(err,result)
		{
			if(err)
			{
				throw err;
			}
			console.log("record updated");
			res.redirect('/viewblog');
		});	
	});
	
});

/*--------------------------delete project------------------------------------*/
app.get('/viewblog', function(req,res)
{
	if(req.session.name)
	{
		var q = "select * from blog";
		con.query(q, function(err,result)
		{
			if(err)
			{
				throw err;
			}
			res.render('Blog/delete_blog', {data:result});
		});
	}
	else
	{
		res.redirect('/');
	}
	
});

app.get("/delete_blg_data/:id", function(req,res)
{
	if(req.session.name)
	{
		var q = "delete from blog where blog_id = '" + req.params.id + "'";
		con.query(q, function(err,result)
		{
			if(err)
			{
				throw err;
			}
			res.redirect('/viewblog');
		});
	}
	else
	{
		res.redirect('/');
	}
	
});

app.post('/deleteblog',function(req,res)  
{
	var ch = req.body.check;
	if(typeof ch == "string")    										//single delete through checks
	{
		var q= "delete from blog where blog_id='"+ch+"'";
		con.query(q, function(err,result)
		{
			console.log('deleted');
      	});
	}	
	else	                   											//multiple delete's
	{
		for( var i = 0; i < ch.length; i++) 
		{
			var h= "delete from blog where blog_id='"+ch[i]+"'";
			con.query(h,function(err,result)
			{
				console.log('deleted');
	      	});
		}
	}
	res.redirect('/viewblog');
});

/*----------------------------------------------USER--------------------------------------------------------------------*/
app.get("/add_user", function(req,res)
{
	res.render('User/add_user');
})

/*------------------insert data into table----------------------------*/
app.post("/adduser", function(req,res)
{
	var firstname, lastname, email, pswd, status;
	firstname = req.body.us_firstname;
	lastname = req.body.us_lastname;
	email = req.body.us_email;
	pswd = req.body.us_password;
	status = req.body.us_status;

	var q = "insert into user set user_firstname = '" + firstname + "', user_lastname = '" + lastname + "', user_email = '" + email + "', user_password = '" + pswd + "', user_status = '" + status + "'";

	con.query(q, function(err, result)
	{
		if(err)
		{
			throw err;
		}
		console.log("user inserted; ");
		res.end('<a href = "/viewuser">' + 'View Users' + '</a>');
	});
});

/*-------------------view through id---------------------------------*/
app.get("/view_us_data/:id", function(req,res)
{
	if(req.session.name)
	{
		var q = "select * from user where user_id = '" + req.params.id + "'";
		con.query(q, function(err,result)
		{
			if(err)
			{
				throw err;
			}
			res.render("User/viewUsEntry", {data:result});
		});
	}
	else
	{
		res.redirect('/');
	}
});

/*-----------------update project--------------------------------*/
app.get("/update_us_data/:us_id", function(req,res)
{
	if(req.session.name)
	{
		var q = "select * from user where user_id = '" + req.params.us_id + "'";

		con.query(q, function(err,result)
		{
			if(err)
			{
				throw err;
			}
			res.render("User/add_user", {data:result});
		});
	}
	else
	{
		res.redirect('/');
	}
	
});

app.post("/update_us/:us_nam", function(req,res)
{
	var name, email, status;
	name = req.params.us_nam;
	pswd = req.body.us_password;
	status = req.body.us_status;


	var q = "UPDATE user SET user_password = '" + pswd + "', user_status = '" + status + "' where user_email = '" + name + "'";
	// q += "update category set category_description = '" + desc + "' where category_name = '" + cat + "'";
	con.query(q, function(err,result)
	{
		if(err)
		{
			throw err;
		}
		console.log("user updated");
		res.redirect('/viewuser');
	});	
});

/*--------------------------delete project------------------------------------*/
app.get('/viewuser', function(req,res)
{
	if(req.session.name)
	{
		var q = "select * from user";
		con.query(q, function(err,result)
		{
			if(err)
			{
				throw err;
			}
			res.render('User/delete_user', {data:result});
		});
	}
	else
	{
		res.redirect('/');
	}
	
});

app.get("/delete_us_data/:id", function(req,res)
{
	if(req.session.name)
	{
		var q = "delete from user where user_id = '" + req.params.id + "'";
		con.query(q, function(err,result)
		{
			if(err)
			{
				throw err;
			}
			res.redirect('/viewuser');
		});
	}
	else
	{
		res.redirect('/');
	}
	
});

app.post('/deleteuser',function(req,res)  
{
	var ch = req.body.check;
	if(typeof ch == "string")    										//single delete through checks
	{
		var q= "delete from user where user_id='"+ch+"'";
		con.query(q, function(err,result)
		{
			console.log('deleted');
      	});
	}	
	else	                   											//multiple delete's
	{
		for( var i = 0; i < ch.length; i++) 
		{
			var h= "delete from user where user_id='"+ch[i]+"'";
			con.query(h,function(err,result)
			{
				console.log('deleted');
	      	});
		}
	}
	res.redirect('/viewuser');
});

app.get("/change_password", function(req,res)
{
	if(req.session.name)
	{
		var q='select email,password from admin where email = "'+req.session.name+'"';
		// var q = "select * from admin;"

		 con.query(q, function(err, result)
		 {
		 	if(err)
		 	{
		 		throw err;
	 		}	
		 	res.render('profile/change_password', {data:result});
		 });
	 } 
	 else 
	 {
	 	res.redirect('/');	
	 }
});

app.get("/passwordChange/:email", function(req,res)
{
	if(req.session.name)
	{
		var q = "select * from admin where email = '" + req.params.email + "'";

		con.query(q, function(err,result)
		{
			if(err)
			{
				throw err;
			}
			res.render("profile/change_password", {data:result});
		});
	} 
	else 
	{
		res.redirect('/');
	}
});

app.post("/set_password", function(req,res)
{
	var mail,current,new_pswd,re;
	var mail = req.body.user;
	current = req.body.current_password;
	new_pswd = req.body.new_password;
	re = req.body.re_password;

	if((current != new_pswd) && (new_pswd == re))
	{
		var q = "UPDATE admin SET password = '" + re + "' where email = '" + mail + "'";

		con.query(q, function(err,result)
		{
			if(err)
			{
				throw err;
			}
			console.log("record updated");
			req.session.destroy(function(err)
			{
				if(err)
				{
					throw err;
				}
				res.redirect('/');
			});
		});	
		console.log("tue");
	}
	else
	{
		res.redirect('/change_password');
		console.log("flse");
	}
	
});

/*-------------------------------------------------button to come back to dashboard-------------------------------------*/
app.post("/dash/:email", function(req,res)
{
	res.render('dashboard');
})

/*--------------------------------------------------Logout---------------------------------------------------------------*/
app.get('/logout', function(req,res)
{
	// delete req.session.name;
	// res.redirect('/login');

	if(req.session.name)
	{
		req.session.destroy(function(err)
		{
			if(err)
			{
				throw err;
			}
			else
			{
				console.log("expired");
				res.redirect('/');
			}
		});
	}
	else
	{
		res.redirect('/');
	}
});

app.listen(7890);

