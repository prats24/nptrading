const express = require("express");
const router = express.Router();
require("../../db/conn");
const Lead = require("../../models/leads/leads");
const axios = require('axios');
const authentication = require("../../authentication/authentication")
const User = require("../../models/User/userDetailSchema")

router.post("/invite",authentication, async (req, res)=>{

    let date = new Date();
    console.log(req.body);
    // const id = req.user;

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
            await Lead.create({name:name, email:email ? email : undefined, mobile:mobile ? mobile : undefined, 
                invitedBy:req.user._id, status:'Invited'});
            
            res.status(201).json({message : "You invited your friend succesfully", data: lead, status: 201});
        }
        else{
            res.status(404).json({error : "Your friend has already joined the platform", data: lead, status: 404});
        }
    }catch(err){console.log(err);res.status(500).json({message:'Something went wrong',status:"error"})}
})



// router.get("/stockindex", (req, res)=>{
//     StockIndex.find({status: "Active"}, (err, data)=>{
//         if(err){
//             return res.status(500).send(err);
//         }else{
//             return res.status(200).send(data);
//         }
//     }).sort({$natural:-1})
// })

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