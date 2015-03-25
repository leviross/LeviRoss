var express = require('express');
var dotenv = require('dotenv');
dotenv.load();
var app = express();
var bodyParser = require('body-parser');
var sendgrid_username = process.env.SENDGRID_USERNAME;
var sendgrid_password = process.env.SENDGRID_PASSWORD;
var sendgrid  = require('sendgrid')(sendgrid_username, sendgrid_password);

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:false}));

app.get("/", function(req,res){
    res.render("index");
    //res.send("Hello Levi");
});
app.get("/resume", function(req,res){
    res.render("resume");
});

app.get("/sent",function(req,res){
    res.render("sent");
});

app.get("/nosent",function(req,res){
    res.render("nosent");
})

app.post("/sendContact",function(req,res){
    var email = new sendgrid.Email();
    //needs body parse to work...
    var fromEmail = req.body.c_email;
    var message = req.body.c_message;
    var name = req.body.c_name;

    console.log(req.body);
    //todo: send e-mail using send grid here

    var payload = {
        to: 'levross@gmail.com',
        subject: 'New Email from leviross.com',
        from: fromEmail,
        name: name,
        text: message
    };
    sendgrid.send(payload, function(err, json) {
        if(err){
            //res.render('index',{error:err});
            res.redirect("/nosent");
            return console.error(err);
        }else{
            //redirecting to same page with new route, sweetalert pops up on load
            //total hack job, but does the trick
            console.log(json);
            res.redirect("/sent");
        }

    });
    //res.redirect("/");

});


app.listen(process.env.PORT || 3000);
