const express = require("express");
const router = express.Router();
require("../../db/conn");
const Category = require("../../models/Expense/categorySchema");

router.post("/category", async (req, res)=>{ 
    try{
        let {sub_category, category, isCategory, created_by, createdOn, lastmodified_by, lastmodifiedOn, uId} = req.body;
        console.log(req.body);

        if(!sub_category || !category || !isCategory || !created_by || !createdOn || !lastmodified_by || !lastmodifiedOn || !uId){
            return res.status(422).json({error : "Please enter all the mandatory fields."})
        }
    
        Category.findOne({uId : uId})
        .then((dateExist)=>{
            if(dateExist){
                console.log("Data already exists");
                return res.status(422).json({error : "Data already exists"})
            }
            const categoryDetail = new Category({sub_category, category, isCategory, created_by, createdOn, lastmodified_by, lastmodifiedOn, uId});
            console.log("Category", categoryDetail)
            categoryDetail.save().then(async()=>{
                res.status(201).json({massage : "Data entered succesfully"});
            }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
        }).catch(err => {console.log(err, "fail")});

    } catch(err) {
        res.status(500).json({error:"Failed to enter data"});
        return new Error(err);
    }
})

router.get("/readCategoryDetails", (req, res)=>{
    Category.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    }).sort({$natural:-1})
})

router.get("/readCategoryDetails/:id", (req, res)=>{
    console.log(req.params)
    const {id} = req.params
    Category.findOne({_id : id})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.put("/readCategoryDetails/:id", async (req, res)=>{
    console.log(req.params)
    console.log( req.body)
    let {sub_category, category, isCategory, lastmodified_by, lastmodifiedOn} = req.body;

    try{ 
        const {id} = req.params
        const categoryDetail = await Category.findOneAndUpdate({_id : id}, {
            $set:{ 
                sub_category, category, isCategory, lastmodified_by, lastmodifiedOn  
            }
        })
        console.log("Edited category: ", categoryDetail);          
        res.send(categoryDetail)
    } catch (e){
        res.status(500).json({error:"Failed to edit data Check"});
    }
})

router.delete("/readCategoryDetails/:id", async (req, res)=>{
    console.log(req.params)
    try{
        const {id} = req.params
        const categoryDetail = await Category.findOne({_id : id})
        const category = await Category.deleteOne({_id : id})
        console.log("Category Details: ", category, categoryDetail);
        res.status(201).json({massage : "Data deleted succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to delete data"});
    }
})

module.exports = router;