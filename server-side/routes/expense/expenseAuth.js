const express = require("express");
const router = express.Router();
require("../../db/conn");
const Expense = require("../../models/Expense/expenseSchema");

router.post("/expense", async (req, res)=>{ 
    try{
        let {expense_date, sub_category, category, amount, gst, total_amount, description, payment_status, expense_by, created_by, invoice_upload, createdOn, lastmodified_by, lastmodifiedOn, uId} = req.body;
        console.log(req.body);

        if(!expense_date || !sub_category || !category || !amount || !total_amount || !description || !payment_status || !expense_by || !created_by || !createdOn || !lastmodified_by || !lastmodifiedOn || !uId){
            return res.status(422).json({error : "Please enter all the mandatory fields."})
        }
    
        Expense.findOne({uId : uId})
        .then((dateExist)=>{
            if(dateExist){
                console.log("Data already exists");
                return res.status(422).json({error : "Data already exists"})
            }
            const expense = new Expense({expense_date, sub_category, category, amount, gst, total_amount, description, payment_status, expense_by, created_by, invoice_upload, createdOn, lastmodified_by, lastmodifiedOn, uId});
            console.log("Expense", expense)
            expense.save().then(async()=>{
                res.status(201).json({massage : "Data entered succesfully"});
            }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
        }).catch(err => {console.log(err, "fail")});

    } catch(err) {
        res.status(500).json({error:"Failed to enter data"});
        return new Error(err);
    }
})

router.get("/readExpenseDetails", (req, res)=>{
    Expense.find((err, data)=>{
        if(err){
            return res.status(500).send(err);
        }else{
            return res.status(200).send(data);
        }
    }).sort({$natural:-1})
})

router.get("/readExpenseDetails/:id", (req, res)=>{
    console.log(req.params)
    const {id} = req.params
    Expense.findOne({_id : id})
    .then((data)=>{
        return res.status(200).send(data);
    })
    .catch((err)=>{
        return res.status(422).json({error : "date not found"})
    })
})

router.put("/readExpenseDetails/:id", async (req, res)=>{
    console.log(req.params)
    console.log( req.body)
    let {expense_date, sub_category, category, amount, gst, total_amount, description, payment_status, expense_by, invoice_upload, lastmodified_by, lastmodifiedOn} = req.body;

    try{ 
        const {id} = req.params
        const expense = await Expense.findOneAndUpdate({_id : id}, {
            $set:{ 
                expense_date, sub_category, category, amount, gst, total_amount, description, payment_status, expense_by, invoice_upload, lastmodified_by, lastmodifiedOn  
            }
        })
        console.log("Edited Expense: ", expense);          
        res.send(expense)
    } catch (e){
        res.status(500).json({error:"Failed to edit data Check"});
    }
})

router.delete("/readExpenseDetails/:id", async (req, res)=>{
    console.log(req.params)
    try{
        const {id} = req.params
        const expenseDetail = await Expense.findOne({_id : id})
        const expense = await Expense.deleteOne({_id : id})
        console.log("Expense Details: ", expense, expenseDetail);
        res.status(201).json({massage : "Data deleted succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to delete data"});
    }
})

module.exports = router;