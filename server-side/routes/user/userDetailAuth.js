const express = require("express");
const router = express.Router();
require("../../db/conn");
const UserDetail = require("../../models/User/userDetailSchema");
const authController = require("../../controllers/authController")

router.post("/userdetail", authController.protect, authController.restrictTo("admin"), (req, res)=>{
    const {status, uId, createdOn, lastModified, createdBy, name, designation, email, mobile, degree, dob, gender, trading_exp, location, last_occupation, joining_date, role, userId, password} = req.body;
    console.log(req.body)
    if(!status || !uId || !createdOn || !lastModified || !createdBy || !name || !designation || !email || !mobile || !degree || !dob || !gender || !trading_exp || !location || !last_occupation || !joining_date || !role){
        console.log("data nhi h pura");
        return res.status(422).json({error : "plz filled the field..."})
    }

    UserDetail.findOne({email : email})
    .then((dateExist)=>{
        if(dateExist){
            console.log("data already");
            return res.status(422).json({error : "date already exist..."})
        }
        const userDetail = new UserDetail({status, uId, createdOn, lastModified, createdBy, name, designation, email, mobile, degree, dob, gender, trading_exp, location, last_occupation, joining_date, role, userId, password});
        console.log(userDetail)
        userDetail.save().then(()=>{
            res.status(201).json({massage : "data enter succesfully"});
        }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
    }).catch(err => {console.log(err, "fail")});
})

router.get("/readuserdetails", (req, res)=>{
    UserDetail.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    }).sort({$natural:-1})
})

router.get("/readuserdetails/:id", (req, res)=>{
    console.log(req.params)
    const {id} = req.params
    UserDetail.findOne({_id : id})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.put("/readuserdetails/:id", async (req, res)=>{
    console.log(req.params)
    console.log("this is body", req.body);
    try{
        const {id} = req.params
        const userDetail = await UserDetail.findOneAndUpdate({_id : id} , {
            $set:{
                lastModified: req.body.lastModified,
                name: req.body.Name,
                designation: req.body.Designation,
                degree: req.body.Degree,
                email: req.body.EmailID,
                mobile: req.body.MobileNo,
                dob: req.body.DOB,
                gender: req.body.Gender,
                trading_exp: req.body.TradingExp,
                location: req.body.Location,
                last_occupation: req.body.LastOccupation,
                joining_date: req.body.DateofJoining,
                role: req.body.Role,
                status: req.body.Status
            }
        })
        console.log("this is userdetail", userDetail);
        res.send(userDetail)
        // res.status(201).json({massage : "data edit succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.delete("/readuserdetails/:id", async (req, res)=>{
    console.log(req.params)
    try{
        const {id} = req.params
        const userDetail = await UserDetail.deleteOne({_id : id})
        console.log("this is userdetail", userDetail);
        // res.send(userDetail)
        res.status(201).json({massage : "data delete succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to delete data"});
    }

})

router.get("/readparticularuserdetails/:email", (req, res)=>{
    console.log(req.params)
    const {email} = req.params
    UserDetail.findOne({email : email})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

module.exports = router;


