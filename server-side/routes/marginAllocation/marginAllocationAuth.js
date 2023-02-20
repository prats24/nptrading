const express = require("express");
const router = express.Router();
require("../../db/conn");
const Margin = require("../../models/marginAllocation/marginAllocationSchema");
const UserDetail = require("../../models/User/userDetailSchema");

router.post("/setmargin", async (req, res)=>{
    const {traderName, amount, lastModifiedBy, uId, userId, createdBy} = req.body;

    if(!traderName || !amount){
        //console.log("data nhi h pura");
        return res.status(422).json({error : "Please fill all the feilds"})
    }

   
    const margin = new Margin({traderName, amount, lastModifiedBy, uId, userId, createdBy});

    margin.save().then(()=>{
        
        res.status(201).json({massage : "data enter succesfully"});
    }).catch((err)=> console.log(err, "in adding fund"));

    const userdetail = await UserDetail.findOne({email: userId});
    let fund = (userdetail.fund ? userdetail.fund : 0);
    fund = Number(fund) + Number(amount);
   await userdetail.updateOne({fund: fund});
    
})

router.get("/readApiExchange", (req, res)=>{
    ApiExchange.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    })
})

router.get("/getUserMarginDetails/:email", (req, res)=>{
    const {email} = req.params
    Margin.find({userId: {$regex: email}}).sort({creditedOn: -1})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/getUserMarginDetailsAll", (req, res)=>{
    Margin.find().sort({creditedOn: -1})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})


router.get("/getUserTotalCreditDetails", async(req, res)=>{

    let pnlDetails = await Margin.aggregate([
        {
          $group: {
            _id: {userId : "$userId", traderName : "$traderName"},
            totalCredit: {
              $sum: "$amount",
            },
          },
        },
        {
            $sort: {
                totalCredit : -1
            }
        }
      ])
            
       // //console.log(pnlDetails)

        res.status(201).json(pnlDetails);
 
})

module.exports = router;