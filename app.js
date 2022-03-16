const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mailchimp = require("@mailchimp/mailchimp_marketing");

require("dotenv").config();


app.use(express.static("public")); // to render static content css and pictures
app.use(bodyParser.urlencoded({ extended: true }));

const audienceId = process.env.AUDIENCE_ID;
const apiString = process.env.API_KEY;
const serverID = process.env.SERVER_ID;



app.get("/", function(req, res) {

    res.sendFile(__dirname + "/signup.html");
})


app.post("/", function(req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    // console.log(firstName, lastName, email);
    const statusCode = res.statusCode;

    const data = {
        members: [{
            update_existing: true,
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            },

        }]
    };

    mailchimp.setConfig({
        apiKey: apiString,
        server: serverID
    });

    const run = async() => {
        const response = await mailchimp.lists.batchListMembers(audienceId, data);
        console.log(response);
    };

    run();

    //Redircting to 
    if (statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
    } else {
        res.sendFile(__dirname + "/failure.html");
    }


})

app.listen(process.env.PORT || 3000, function() {
    console.log('listening on 3000');
})