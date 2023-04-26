const express=require("express");
const request=require("request");
const bodyParser=require("body-parser");
const https=require("https");

require('dotenv').config();

const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname+"/signup.html");
})

app.post("/", function(req, res){
    const first=req.body.fName;
    const last=req.body.lName;
    const email=req.body.email;
    const apiKey=process.env.API_KEY;
    const listId=process.env.list_id;
    const data={
        members:[
            {
            email_address: email,
            status: "subscribed",
            merge_fields:{
                FNAME: first,
                LNAME: last
            }
        }]
        

    }
    const jsonData=JSON.stringify(data);
    const url=`https://us21.api.mailchimp.com/3.0/lists/${listId}`;
    const options={
        method: "POST",
        auth: `anon1:${apiKey}`
    }

    const request = https.request(url, options, function(response) {
        let data = "";
        response.on("data", function(chunk) {
          data += chunk;
        });
        response.on("end", function() {
          const responseData = JSON.parse(data);
          if (response.statusCode === 200) {
            if (responseData.error_count > 0) {
                res.status(400).json({ message: 'Invalid email. Please go back to try again.' });
            } else {
              res.sendFile(__dirname + "/success.html");
              console.log(responseData);
            }
          } else {
            res.sendFile(__dirname + "/failure.html");
          }
        });
      });
      
      request.write(jsonData);
      request.end();
})

app.post("/failure", function(req, res){
    res.redirect("/");
})

app.post("/success", function(req, res){
    res.redirect("https://crypto-live-viewer.onrender.com");
})

app.listen(process.env.PORT || 3000, function(){
    var url="http://localhost:3000";
    console.log("App is listening on port 3000: "+url);
})

