const express = require("express");
const router = express.Router();
require("../../db/conn");
const Role = require("../../models/User/everyoneRoleSchema");

router.post("/everyonerole", (req, res)=>{
    const {uId, createdOn, lastModified, createdBy, roleName, instruments, tradingAccount, APIParameters, users, algoBox, reports} = req.body;
    //console.log(req.body)
    if(!uId || !createdOn || !lastModified || !createdBy || !roleName || !instruments || !tradingAccount || !APIParameters || !users || !algoBox || !reports){
        //console.log("data nhi h pura");
        return res.status(422).json({error : "plz filled the field..."})
    }

    Role.findOne({uId : uId})
    .then((dateExist)=>{
        if(dateExist){
            //console.log("data already");
            return res.status(422).json({error : "date already exist..."})
        }
        const role = new Role({uId, createdOn, lastModified, createdBy, roleName, instruments, tradingAccount, APIParameters, users, algoBox, reports});
        role.save().then(()=>{
            res.status(201).json({massage : "data enter succesfully"});
        }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
    }).catch(err => {console.log( "fail in role auth")});
})

router.get("/readeveryonerole", (req, res)=>{
    Role.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    }).sort({$natural:-1})
})

router.get("/readeveryonerole/:id", (req, res)=>{
    //console.log(req.params)
    const {id} = req.params
    Role.findOne({_id : id})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.put("/readeveryonerole/:id", async (req, res)=>{
    //console.log(req.params)
    //console.log("this is body", req.body);
    try{
        const {id} = req.params
        const role = await Role.findOneAndUpdate({_id : id}, {
            $set:{ //roleName, instruments, tradingAccount, APIParameters, users, algoBox, reports 
                lastModified: req.body.lastModified,
                roleName: req.body.roleName1,
                instruments: req.body.instruments1,
                tradingAccount: req.body.tradingAccount,
                APIParameters: req.body.APIParameters,
                users: req.body.users1,
                algoBox: req.body.algoBox1,
                reports: req.body.reports1
            }
        })
        //console.log("this is role", role);
        res.send(role)
        // res.status(201).json({massage : "data edit succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.delete("/readeveryonerole/:id", async (req, res)=>{
    //console.log(req.params)
    try{
        const {id} = req.params
        const role = await Role.deleteOne({_id : id})
        //console.log("this is userdetail", role);
        // res.send(userDetail)
        res.status(201).json({massage : "data delete succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to delete data"});
    }

})


module.exports = router;