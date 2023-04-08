const express = require("express");
const router = express.Router();
require("../../db/conn");
const Lead = require("../../models/leads/leads");
const axios = require('axios');
const authentication = require("../../authentication/authentication")
const User = require("../../models/User/userDetailSchema")
const emailService = require("../../utils/emailService")
const smsService = require("../../utils/smsService")

router.post("/invite",authentication, async (req, res)=>{

    let date = new Date();
    console.log(req.body);
    // const id = req.user;

    function validateMobileNumber(mobileNumber) {
        const regex = /^\d{10}$/;
        return regex.test(mobileNumber);
      }
    
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    function isEmailValid(email) {
 
    if(email.length>254)
        return false;

    var valid = emailRegex.test(email);
    if(!valid)
        return false;

    // Further checking of some things regex can't handle
    var parts = email.split("@");
    if(parts[0].length>64)
        return false;

    var domainParts = parts[1].split(".");
    if(domainParts.some(function(part) { return part.length>63; }))
        return false;

    return true;
    }
    
    if(req.body.mobile){
        console.log(!validateMobileNumber(req.body.mobile))
        if (!validateMobileNumber(req.body.mobile)) 
        {
            return res.status(400).json({error : "Please enter a valid 10 digit mobile number."})
        }
    }

    if(req.body.email){
        console.log(!isEmailValid(req.body.email))
        console.log("isEmailValid return value:", isEmailValid(req.body.email));
        console.log("!isEmailValid(req.body.email) value:", !isEmailValid(req.body.email));
        if (!isEmailValid((req.body.email).toString())) 
        {
            return res.status(400).json({error : "Please enter a valid email address."})
        }
        }

    try{
        let {name, email, mobile} = req.body;
        const id = req.user._id;

        if(!name){
            return res.status(422).json({error : "Please enter the name of your friend in the name field."})
        }

        if(!mobile && !email){
            return res.status(422).json({error : "Please enter eithe the mobile no. or the email id of your friend."})
        }
    
        const lead = await Lead.findOne({ $or: [{ email: email }, { mobile: mobile }] })
        console.log("Lead Data: ",lead);
        if(!lead){
            
            if(email){
                let subject = `${req.user.first_name} ${req.user.last_name} invited you to join StoxHero`
                let message = `
                Hello Join StoxHero
                `
                emailService(email, subject, message);
                console.log("Email sent successfully!");
              } 
          

            if(mobile){
        
            smsService([mobile.toString()], `Your friend ${req.user.first_name} ${req.user.last_name} has invited you to join StoxHero. Click to join www.stoxhero.com`);
            console.log("SMS sent successfully!");
            
            }

            await Lead.create({name:name, email:email ? email : undefined, mobile:mobile ? mobile : undefined, 
                invitedBy:req.user._id, status:'Invited'});
            

            return res.status(201).json({message : "You invited your friend succesfully", data: lead, status: 201});
        }
        else{
            return res.status(404).json({error : "Your friend has already joined the platform", data: lead, status: 404});
        }
    }catch(err){console.log(err);res.status(500).json({message:'Something went wrong',status:"error"})}
})



router.get("/leadsinvited", (req, res)=>{
  const response = Lead.find({status: "Invited"}, (err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send({data:data,count:data.length});
        }
    }).sort({$natural:-1})
})

router.get("/leadsinvited/:id", (req, res)=>{
    const {id} = req.params
    const response = Lead.find({invitedBy:id}, (err, data)=>{
          if(err){
              return res.status(500).send(err);
          }else{
              return res.status(200).send({data:data,count:data.length});
          }
      }).sort({$natural:-1})
  })

router.get("/leadsjoined/:id", (req, res)=>{
const {id} = req.params
const response = Lead.find({status: "Joined",invitedBy:id}, (err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send({data:data,count:data.length});
        }
    }).sort({$natural:-1})
})

router.get("/leadsjoined", (req, res)=>{
    const response = Lead.find({status: "Invited"}, (err, data)=>{
          if(err){
              return res.status(500).send(err);
          }else{
              return res.status(200).send({data:data,count:data.length});
          }
      }).sort({$natural:-1})
  })

// router.put("/stockindex/:id",authentication, (req, res)=>{
//     const {id} = req.params;
//     let {displayName, exchange, instrumentSymbol, status} = req.body;
//     const modifiedBy = req.user._id;
//     const modifiedOn = new Date();
//     // console.log(displayName, exchange, instrumentSymbol, status)

//     StockIndex.findOneAndUpdate({_id : id}, 
//         {displayName:displayName, exchange:exchange, instrumentSymbol:instrumentSymbol,status:status, lastModifiedBy:modifiedBy, lastModifiedOn:modifiedOn}, 
//         {new: true})
//     .then((data)=>{
//         return res.status(200).send(data);
//     })
//     .catch((err)=>{
//         console.log(err)
//         return res.status(422).json({error : "data not found"})
//     })
// })

// router.get("/stockindex/:id", (req, res)=>{
//     const {id} = req.params;

//     StockIndex.find({ _id: id })
//     .populate('lastModifiedBy', { first_name: 1, last_name: 1 })
//     .then((data) => {
//         if (!data) {
//             return res.status(404).json({ error: "data not found" });
//         }
//         return res.status(200).send(data);
//     })
//     .catch((err) => {
//         return res.status(500).json({ error: err.message });
//     })
// })


module.exports = router;