const express = require("express");
const router = express.Router();
require("../../db/conn");
const UserDetail = require("../../models/User/userDetailSchema");
const authController = require("../../controllers/authController")

router.post("/userdetail", authController.protect, authController.restrictTo("admin"), (req, res)=>{
    const {status, uId, createdOn, lastModified, createdBy, name, cohort, designation, email, mobile, degree, dob, gender, trading_exp, location, last_occupation, joining_date, role, userId, password, employeeId} = req.body;
    //console.log(req.body)
    if(!status || !uId || !createdOn || !lastModified || !createdBy || !name || !cohort || !designation || !email || !mobile || !degree || !dob || !gender || !trading_exp || !location || !last_occupation || !joining_date || !role){
        //console.log("data nhi h pura");
        return res.status(422).json({error : "plz filled the field..."})
    }

    UserDetail.findOne({email : email})
    .then((dateExist)=>{
        if(dateExist){
            //console.log("data already");
            return res.status(422).json({error : "date already exist..."})
        }
        const userDetail = new UserDetail({status, uId, createdOn, lastModified, createdBy, name, cohort, designation, email, mobile, degree, dob, gender, trading_exp, location, last_occupation, joining_date, role, userId, password, employeeid: employeeId});
        //console.log(userDetail)
        userDetail.save().then(()=>{
            res.status(201).json({massage : "data enter succesfully"});
        }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
    }).catch(err => {console.log("fail in   userAuth")});
})

router.get("/readuserdetails", (req, res)=>{
    UserDetail.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    }).sort({joining_date:1})
})

router.get("/readuserdetails/:id", (req, res)=>{
    //console.log(req.params)
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
    //console.log(req.params)
    //console.log("this is body", req.body);

    try{
        const {id} = req.params
        //console.log(id)

        const user = await UserDetail.findOne({_id: id})
        //console.log("user", user)

        if(req.body.userPassword){
            user.lastModified = req.body.lastModified,
            user.name = req.body.Name,
            user.cohort = req.body.Cohort,
            user.designation = req.body.Designation,
            user.degree = req.body.Degree,
            user.email = req.body.EmailID,
            user.mobile = req.body.MobileNo,
            user.dob = req.body.DOB,
            user.gender = req.body.Gender,
            user.trading_exp = req.body.TradingExp,
            user.location = req.body.Location,
            user.last_occupation = req.body.LastOccupation,
            user.joining_date = req.body.DateofJoining,
            user.role = req.body.Role,
            user.status = req.body.Status,
            user.password = req.body.userPassword,
            user.employeeid = req.body.employeeId
        } else{
            user.lastModified = req.body.lastModified,
            user.name = req.body.Name,
            user.cohort = req.body.Cohort,
            user.designation = req.body.Designation,
            user.degree = req.body.Degree,
            user.email = req.body.EmailID,
            user.mobile = req.body.MobileNo,
            user.dob = req.body.DOB,
            user.gender = req.body.Gender,
            user.trading_exp = req.body.TradingExp,
            user.location = req.body.Location,
            user.last_occupation = req.body.LastOccupation,
            user.joining_date = req.body.DateofJoining,
            user.role = req.body.Role,
            user.status = req.body.Status,
            user.employeeid = req.body.employeeId
        }

        await user.save();
        res.status(201).json({massage : "data edit succesfully"});

    } catch (e){
        console.log(e)
        res.status(500).json({error:"Failed to edit data"});
    }
})

router.delete("/readuserdetails/:id", async (req, res)=>{
    //console.log(req.params)
    try{
        const {id} = req.params
        const userDetail = await UserDetail.deleteOne({_id : id})
        //console.log("this is userdetail", userDetail);
        // res.send(userDetail)
        res.status(201).json({massage : "data delete succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to delete data"});
    }

})

router.get("/readparticularuserdetails/:email", (req, res)=>{
    //console.log(req.params)
    const {email} = req.params
    UserDetail.findOne({email : email})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/getAdmins/", (req, res)=>{
    UserDetail.find({role : "admin" })
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.get("/getallbatch", async(req, res)=>{

    let batch = await UserDetail.aggregate([
        {
          $group:
            {
              _id: "$cohort",
            },
        },
        {
          $sort:
            {
              _id: -1,
            },
        },
      ])
            

        res.status(201).json(batch);

})

module.exports = router;


