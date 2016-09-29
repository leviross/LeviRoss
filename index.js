var dotenv = require('dotenv');
dotenv.load();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');


var sendgrid_username = process.env.SENDGRID_USERNAME;
var sendgrid_password = process.env.SENDGRID_PASSWORD;
var sendgrid_to_email = process.env.SENDGRID_TO_EMAIL;


var sendgrid_api_key = process.env.SENDGRID_API_KEY;// Don't think we need this in app code, this is for the app to actually be able to access Sendgrid in general. 
var sendgrid = require('sendgrid')(sendgrid_username, sendgrid_password);


var router = express.Router();


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

app.post("/sendContactOLD",function(req, res){

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

});

router.post('/sendContact', function (req, res) {

    var email = new sendgrid.Email({
        to: sendgrid_to_email,
        subject: "LeviRoss.com - New message from " + req.body.c_name,
        from: sendgrid_to_email,
        name: req.body.c_name,
        html: "<h4>LeviRoss.com - New message from " + req.body.c_name + " </h4><p>" + req.body.c_message + "</p><br /><p>" + req.body.c_email + "</p>"
    });

    sendgrid.send(email, function (error, result) {
        if (error) {
            console.log("Error from Sendgrid sending the email:\n", error);
            res.json(false);
        } else {
            console.log("Email was successful!\n", result);
            res.json({ status: 1, message: "Thank you for contacting me! I will reply back shortly."});
        }

    }); 
    

    // To allow attachments, use this below code
    //var base64Data = req.body.Resume.replace(/^data(.*)base64,/, "");

    //fs.writeFile(req.body.FileName, base64Data, 'base64', function (err) {
    //    if (err) {
    //        res.json({ Error: true, FSError: err });
    //    } else {

    //        email.addFile({
    //            filename: req.body.FileName,
    //            path: req.body.FileName
    //        });

    //        sendgrid.send(email, function (error, result) {
    //            if (error) {
    //                console.log("Error from Sendgrid sending the email:\n", error);
    //                res.json(error);
    //            } else {
    //                fs.unlinkSync(req.body.FileName);
    //                console.log(result);
    //                res.send("Application Sent.");
    //            }

    //        });
    //    }

    //});

});


app.listen(process.env.PORT || 3000);
