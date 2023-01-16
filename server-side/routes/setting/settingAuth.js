const express = require("express");
const router = express.Router();
require("../../db/conn");
const Setting = require("../../models/settings/setting");

router.post("/settings", (req, res)=>{
    const {modifiedOn, modifiedBy, isAppLive} = req.body;
    console.log(req.body)
    if(!modifiedOn || !modifiedBy){
        console.log("data nhi h pura");
        return res.status(422).json({error : "Please fill all the fields..."})
    }

    // Permission.findOne({_id})
    // .then((dateExist)=>{
    //     if(dateExist){
    //         console.log("data already");
    //         return res.status(422).json({error : "date already exist..."})
    //     }
        const setting = new Setting({modifiedOn, modifiedBy, isAppLive});
        setting.save().then(()=>{
            res.status(201).json({massage : "data enter succesfully"});
        }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
    // }).catch(err => {console.log(err, "fail")});
})

router.get("/readsetting", (req, res)=>{
    Setting.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    })
})

router.get("/readsetting/:id", (req, res)=>{
    console.log(req.params)
    const {id} = req.params
    Setting.findOne({_id : id})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

// router.put("/readpermission/:id", async (req, res)=>{
//     console.log(req.params)
//     console.log("this is body", req.body);
//     try{
//         const {id} = req.params
//         const permission = await Permission.findOneAndUpdate({_id : id}, {
//             $set:{ 
//                 modifiedOn: req.body.modifiedOn,
//                 modifiedBy: req.body.modifiedBy,
//                 userName: req.body.userName,
//                 userId: req.body.userId,
//                 isTradeEnable: req.body.isTradeEnable,
//                 algoName: req.body.algoName,
//                 isRealTradeEnable: req.body.isRealTradeEnable,
//             }
//         })
//         console.log("this is role", permission);
//         res.send(permission)
//         // res.status(201).json({massage : "data edit succesfully"});
//     } catch (e){
//         res.status(500).json({error:"Failed to edit data"});
//     }
// })

router.patch("/applive/:id", async (req, res)=>{
    console.log(req.params)
    console.log("this is body", req.body);
    try{ 
        const {id} = req.params
        const setting = await Setting.findOneAndUpdate({_id : id}, {
            $set:{ 
                modifiedOn: req.body.modifiedOn,
                modifiedBy: req.body.modifiedBy,
                isAppLive: req.body.isAppLive,
            }
        })
        console.log("this is role", setting);
        res.send(setting)
        // res.status(201).json({massage : "data edit succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to edit data"});
    }
})


// router.delete("/readpermission/:id", async (req, res)=>{
//     console.log(req.params)
//     try{
//         const {id} = req.params
//         const permission = await Permission.deleteOne({_id : id})
//         console.log("this is userdetail", permission);
//         // res.send(userDetail)
//         res.status(201).json({massage : "data delete succesfully"});
//     } catch (e){
//         res.status(500).json({error:"Failed to delete data"});
//     }
// })




module.exports = router;

