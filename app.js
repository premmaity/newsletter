const express=require("express");
const bodyparser=require("body-parser");
const request=require("request");
const https=require("https");

const app=express();
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true})); 

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
    var firstname=req.body.fname;
    var lastname=req.body.lname;
    var email=req.body.email;
    console.log(firstname," ", lastname, " ",email);

    var data={
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME :firstname ,
                    LNAME:lastname
                }
            }
        ]
    };
    var jsonData = JSON.stringify(data) ;  //converting to string so that we can send it as a post reqest in the
    const url="https://us21.api.mailchimp.com/3.0/lists/09c2790ffa";
    const options={
        method:"POST",
        auth:"prem:c321e574c1dc7bdc8f1734e3b1a91607-us21"

    }

    const request=https.request(url,options,function(response){
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end(); 

});
app.post("/failure",function(req,res){
    res.redirect("/");
});
app.listen(3000,function(){
    console.log("server is live on port 3000");
});
//c321e574c1dc7bdc8f1734e3b1a91607-us21-api//audience id- 09c2790ffa.