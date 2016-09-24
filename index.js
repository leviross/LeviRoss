var dotenv = require('dotenv');
dotenv.load();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var sendgrid_username = process.env.SENDGRID_USERNAME;
var sendgrid_password = process.env.SENDGRID_PASSWORD;
var sendgrid_to_email = process.env.SENDGRID_TO_EMAIL;
var sendgrid = require('sendgrid')(sendgrid_username, sendgrid_password);
var router = express.Router();

// app.set("view engine", "html");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({ limit: '50mb', type: 'application/vnd.api+json' }));

app.use('/', router);


router.get('/', function (req, res) {
    res.sendFile('index.html', { root: __dirname + '/views' });
});

app.get("/nothing", function(req,res){
    res.render("index");
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
    
    console.log(req.body);
    var options = {
        service: "Gmail",
        auth: {
            user: sendgrid_username,
            pass: sendgrid_password
        }
    }
    var transporter = nodemailer.createTransport(smtpTransport(options));

    var mailOptions = {
        from: fromEmail,
        to: sendgrid_to_email,
        subject: 'New Email from leviross.com',
        text: message,
        html: "<h3>From: " + name + "</h3>" + "<h5>Email: " + fromEmail + "</h5>"
        + "<p>" + message + "</p>" 
    }

    transporter.sendMail(mailOptions, function (err, info) {
        if(err) {
            console.log(err);
            res.send(err);
        }else {
            console.log("Message sent: " + info);
            //res.json(info);
            res.redirect("/sent");
        }
    });

    router.post('/employment', function (req, res) {

        var email = new sendgrid.Email({
            to: sendgrid_to_email,
            subject: 'New Application from Allevahomecare.org',
            from: sendgrid_from_email,
            name: req.body.FirstName + req.body.Lastname,
            html: "<h4>You received a new application from " + req.body.FirstName + "</h4>"
        });

        var base64Data = req.body.Resume.replace(/^data(.*)base64,/, "");

        fs.writeFile(req.body.FileName, base64Data, 'base64', function (err) {
            if (err) {
                res.json({ Error: true, FSError: err });
            } else {

                email.addFile({
                    filename: req.body.FileName,
                    path: req.body.FileName
                });

                sendgrid.send(email, function (error, result) {
                    if (error) {
                        console.log("Error from Sendgrid sending the email:\n", error);
                        res.json(error);
                    } else {
                        fs.unlinkSync(req.body.FileName);
                        console.log(result);
                        res.send("Application Sent.");
                    }

                });
            }

        });

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
