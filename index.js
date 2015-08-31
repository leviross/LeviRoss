var dotenv = require('dotenv');
dotenv.load();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var sendgrid_username = process.env.SENDGRID_USERNAME;
var sendgrid_password = process.env.SENDGRID_PASSWORD;
var sendgrid_to_email = process.env.SENDGRID_TO_EMAIL;
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

app.post("/sendContact",function(req, res){

    //var email = new sendgrid.Email();
    var fromEmail = req.body.c_email;
    var message = req.body.c_message;
    var name = req.body.c_name;

    var transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: sendgrid_to_email,
            pass: sendgrid_password
        }
    });

    var mailOptions = {
        from: fromEmail,
        to: sendgrid_to_email,
        subject: 'New Email from leviross.com',
        text: message,
        html: ""
    }

    transporter.sendMail(mailOptions, function (err, info) {
        if(err) console.log(err);
        console.log("Message sent: " + info);
        //res.json(info);
        res.redirect("/sent");
    });


    

    // var payload = {
    //     to: sendgrid_to_email,
    //     subject: 'New Email from leviross.com',
    //     from: fromEmail,
    //     name: name,
    //     text: message
    // };
    // sendgrid.send(payload, function(err, json) {
    //     if(err){
    //         console.log(err);
    //         //res.redirect("/nosent");
    //         res.json(err);
    //     }else{
    //         //redirecting to same page with new route, sweetalert pops up on load
    //         //total hack job, but does the trick
    //         console.log(json);
    //         res.redirect("/sent");
    //     }

    // });

});


app.listen(process.env.PORT || 3000);
