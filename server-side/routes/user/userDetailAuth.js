const express = require("express");
const otpGenerator = require('otp-generator')
const emailService = require("../../utils/emailService")
const router = express.Router();
require("../../db/conn");
const UserDetail = require("../../models/User/userDetailSchema");
const authController = require("../../controllers/authController");
const multer = require('multer');
const aws = require('aws-sdk');
const sharp = require('sharp');


const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
if (file.mimetype.startsWith("image/")) {
    cb(null, true);
} else {
    cb(new Error("Invalid file type"), false);
  }
}

const upload = multer({ storage, fileFilter }).single("profilePhoto");
const uploadMultiple = multer({ storage, fileFilter}).fields([{ name: 'profilePhoto', maxCount: 1 }, 
{ name: 'aadhaarCardFrontImage', maxCount: 1 }, { name: 'aadhaarCardBackImage', maxCount: 1 }, 
{ name: 'panCardFrontImage', maxCount: 1 }, { name: 'passportPhoto', maxCount: 1 },
{ name: 'addressProofDocument', maxCount: 1 }, { name: 'incomeProofDocument', maxCount: 1 } ]);

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const resizePhoto = async (req, res, next) => {
    console.log('resize func');
    if (!req.files) {
      // no file uploaded, skip to next middleware
      console.log('no file');
      next();
      return;
    }
    const { profilePhoto, aadhaarCardFrontImage, aadhaarCardBackImage, panCardFrontImage, 
        passportPhoto, addressProofDocument, incomeProofDocument } = (req.files);

    if (profilePhoto && profilePhoto[0].buffer) {
        const resizedProfilePhoto = await sharp(profilePhoto[0].buffer)
          .resize({ width: 500, height: 500 })
          .toBuffer();
        (req.files).profilePhotoBuffer = resizedProfilePhoto;
      }
    
      if (aadhaarCardFrontImage && aadhaarCardFrontImage[0].buffer) {
        const resizedAadhaarCardFrontImage = await sharp(aadhaarCardFrontImage[0].buffer)
          .resize({ width: 1000, height: 500 })
          .toBuffer();
          (req.files).aadhaarCardFrontImageBuffer = resizedAadhaarCardFrontImage;
      }
      if (aadhaarCardBackImage && aadhaarCardBackImage[0].buffer) {
        const resizedAadhaarCardBackImage = await sharp(aadhaarCardBackImage[0].buffer)
          .resize({ width: 1000, height: 500 })
          .toBuffer();
          (req.files).aadhaarCardBackImageBuffer = resizedAadhaarCardBackImage;
      }

      if (panCardFrontImage && panCardFrontImage[0].buffer) {
        const resizedPanCardFrontImage = await sharp(panCardFrontImage[0].buffer)
          .resize({ width: 1000, height: 500 })
          .toBuffer();
          (req.files).panCardFrontImageBuffer = resizedPanCardFrontImage;
      }
      if (passportPhoto && passportPhoto[0].buffer) {
        const resizedPassportPhoto = await sharp(passportPhoto[0].buffer)
          .resize({ width: 1000, height: 500 })
          .toBuffer();
          (req.files).passportPhotoBuffer = resizedPassportPhoto;
      }
      if (addressProofDocument && addressProofDocument[0].buffer) {
        const resizedAddressProofDocument = await sharp(addressProofDocument[0].buffer)
          .resize({ width: 1000, height: 500 })
          .toBuffer();
          (req.files).addressProofDocumentBuffer = resizedAddressProofDocument;
      }
      if (incomeProofDocument && incomeProofDocument[0].buffer) {
        const resizedIncomeProofDocument = await sharp(incomeProofDocument[0].buffer)
          .resize({ width: 1000, height: 500 })
          .toBuffer();
          (req.files).incomeProofDocumentBuffer = resizedIncomeProofDocument;
      }
      next();
}; 

const uploadToS3 = async (req, res, next) => {
    if (!req.files) {
      // no file uploaded, skip to next middleware
      console.log('no files bro');
      next();
      return;
    }
  
    try {
      if ((req.files).profilePhoto) {
        let userName;
        const user = await UserDetail.findById(req.params.id);
        userName = `${user?.first_name}`+`${user?.last_name}`+ `${user?.name}` + `${user?._id}` ;
        const key = `users/${userName}/photos/display/${Date.now() + (req.files).profilePhoto[0].originalname}`;
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          Body: (req.files).displayPhotoBuffer,
          ContentType: (req.files).profilePhoto.mimetype,
          ACL: 'public-read',
        };
  
        // upload image to S3 bucket
        const s3Data = await s3.upload(params).promise();
        console.log('file uploaded');
        console.log(s3Data.Location);
        (req).profilePhotoUrl = s3Data.Location;
      }
  
      if ((req.files).aadhaarCardFrontImage) {
        let userName;
        const user = await UserDetail.findById(req.params.id);
        userName = `${user?.first_name}`+`${user?.last_name}`+ `${user?.name}`+`${user?._id}` ;
        const key = `users/${userName}/photos/aadharFront/${Date.now() + (req.files).aadhaarCardFrontImage[0].originalname}`;
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          Body: (req.files).aadhaarCardFrontImageBuffer,
          ContentType: (req.files).aadhaarCardFrontImage.mimetype,
          ACL: 'public-read',
        };
  
        // upload image to S3 bucket
        const s3Data = await s3.upload(params).promise();
        console.log('file uploaded');
        console.log(s3Data.Location);
        (req).aadhaarCardFrontImageUrl = s3Data.Location;
      }

      if ((req.files).aadhaarCardBackImage) {
        let userName;
        const user = await UserDetail.findById(req.params.id);
        userName = `${user?.first_name}`+`${user?.last_name}`+ `${user?.name}`+`${user?._id}` ;
        const key = `users/${userName}/photos/aadharBack/${Date.now() + (req.files).aadhaarCardBackImage[0].originalname}`;
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          Body: (req.files).aadhaarCardBackImageBuffer,
          ContentType: (req.files).aadhaarCardBackImage.mimetype,
          ACL: 'public-read',
        };
  
        // upload image to S3 bucket
        const s3Data = await s3.upload(params).promise();
        console.log('file uploaded');
        console.log(s3Data.Location);
        (req).aadhaarCardBackImageUrl = s3Data.Location;
      }
      if ((req.files).panCardFrontImage) {
        let userName;
        const user = await UserDetail.findById(req.params.id);
        userName = `${user?.first_name}`+`${user?.last_name}`+ `${user?.name}`+`${user?._id}` ;
        const key = `users/${userName}/photos/panFront/${Date.now() + (req.files).panCardFrontImage[0].originalname}`;
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          Body: (req.files).panCardFrontImageBuffer,
          ContentType: (req.files).panCardFrontImage.mimetype,
          ACL: 'public-read',
        };
  
        // upload image to S3 bucket
        const s3Data = await s3.upload(params).promise();
        console.log('file uploaded');
        console.log(s3Data.Location);
        (req).panCardFrontImageUrl = s3Data.Location;
      }
      if ((req.files).passportPhoto) {
        let userName;
        const user = await UserDetail.findById(req.params.id);
        userName = `${user?.first_name}`+`${user?.last_name}`+ `${user?.name}`+`${user?._id}` ;
        const key = `users/${userName}/photos/passport/${Date.now() + (req.files).passportPhoto[0].originalname}`;
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          Body: (req.files).passportPhotoBuffer,
          ContentType: (req.files).passportPhoto.mimetype,
          ACL: 'public-read',
        };
  
        // upload image to S3 bucket
        const s3Data = await s3.upload(params).promise();
        console.log('file uploaded');
        console.log(s3Data.Location);
        (req).passportPhotoUrl = s3Data.Location;
      }
      if ((req.files).addressProofDocument) {
        let userName;
        const user = await UserDetail.findById(req.params.id);
        userName = `${user?.first_name}`+`${user?.last_name}`+ `${user?.name}`+`${user?._id}` ;
        const key = `users/${userName}/photos/addressProof/${Date.now() + (req.files).addressProofDocument[0].originalname}`;
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          Body: (req.files).addressProofDocumentBuffer,
          ContentType: (req.files).addressProofDocument.mimetype,
          ACL: 'public-read',
        };
  
        // upload image to S3 bucket
        const s3Data = await s3.upload(params).promise();
        console.log('file uploaded');
        console.log(s3Data.Location);
        (req).addressProofDocumentUrl = s3Data.Location;
      }
      if ((req.files).incomeProofDocument) {
        let userName;
        const user = await UserDetail.findById(req.params.id);
        userName = `${user?.first_name}`+`${user?.last_name}`+ `${user?.name}`+`${user?._id}` ;
        const key = `users/${userName}/photos/incomeProof/${Date.now() + (req.files).incomeProofDocument[0].originalname}`;
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          Body: (req.files).incomeProofDocumentBuffer,
          ContentType: (req.files).incomeProofDocument.mimetype,
          ACL: 'public-read',
        };
  
        // upload image to S3 bucket
        const s3Data = await s3.upload(params).promise();
        console.log('file uploaded');
        console.log(s3Data.Location);
        (req).incomeProofDocumentUrl = s3Data.Location;
      }
  
      console.log('calling next of s3 upload func');
      next();
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Error uploading to S3' });
    }
  };


router.post("/userdetail", authController.protect, authController.restrictTo("admin"), (req, res)=>{
    const {status, uId, createdOn, lastModified, createdBy, name, cohort, designation, email, mobile, degree, dob, gender, trading_exp, location, last_occupation, joining_date, role, userId, password, employeeId} = req.body;
    console.log(req.body)
    if(!status || !uId || !createdOn || !lastModified || !createdBy || !name || !cohort || !designation || !email || !mobile || !degree || !dob || !gender || !trading_exp || !location || !last_occupation || !joining_date || !role){
        //console.log("data nhi h pura");
        return res.status(422).json({error : "plz filled the field..."})
    }

    UserDetail.findOne({email : email})
    .then((dateExist)=>{
        if(dateExist){
            //console.log("data already");
            return res.status(422).json({error : "data already exist..."})
        }
        const userDetail = new UserDetail({status, uId, createdOn, lastModified, createdBy, name, cohort, designation, email, mobile, degree, dob, gender, trading_exp, location, last_occupation, joining_date, role, userId, password, employeeid: employeeId});
        //console.log(userDetail)
        userDetail.save().then(()=>{
            res.status(201).json({massage : "data enter succesfully"});
        }).catch((err)=> res.status(500).json({error:"Failed to enter data"}));
    }).catch(err => {console.log("fail in   userAuth")});
})

router.patch("/resetpassword", async (req, res)=>{
    const {email, resetPasswordOTP, confirm_password, password} = req.body;
    console.log(req.body)
    
    let resetuser = await UserDetail.findOne({email : email})
    if(!resetuser)
    {
        return res.status(404).json({error : "User doesn't exist"})
    }

    if(resetPasswordOTP != resetuser.resetPasswordOTP)
    {
        return res.status(401).json({message : "OTP doesn't match, please try again!"})
    }

    if(password != confirm_password)
    {
        return res.status(401).json({message : "Password & Confirm Password didn't match."})
    }
            //console.log("data already");
        
        resetuser.password = password
        await resetuser.save({validateBeforeSave:false})
        return res.status(200).json({message : "Password Reset Done"})
})

router.patch("/generateOTP", async (req, res)=>{
    const {email} = req.body
    const resetuser = await UserDetail.findOne({email: email})
    if(!resetuser)
    {
        return res.status(404).json({
            message: "User with this email doesn't exist"
        })
    }
    let email_otp = otpGenerator.generate(6, { upperCaseAlphabets: true,lowerCaseAlphabets: false, specialChars: false });
    let subject = "Password Reset ninepointer";
    let message = `Your OTP for password reset is: ${email_otp}`
    resetuser.resetPasswordOTP = email_otp
        await resetuser.save({validateBeforeSave:false});
        res.status(200).json({
            message: "Password Reset OTP Resent"
        })
    emailService(email,subject,message);
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

});

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
      if (allowedFields.includes(el) && obj[el] !== null && obj[el] !== undefined && obj[el] !== '') {
        newObj[el] = obj[el];
      }
    });
    return newObj;
  };
  
const currentUser = (req,res, next) =>{
    req.params.id = req.user._id;
    next();
};

router.patch('/userdetail/me', authController.protect, currentUser, uploadMultiple, resizePhoto, uploadToS3, async(req,res,next)=>{

    try{
        const user = await UserDetail.findById(req.user._id);
    
        if(!user) return res.status(404).json({message: 'No such user found.'});
    
        const filteredBody = filterObj(req.body, 'name', 'first_name', 'lastName', 'email', 'mobile', 
        'whatsApp_number', 'dob', 'address', 'city', 'state', 'country', 'last_occupation', 'family_yearly_income',
        'employeed', 'upiID','googlePay_number','payTM_number','phonePay_number','bankName','nameAsPerBankAccount','accountNumber',
        'ifscCode','profilePhoto', 'addressProofDocument', 'incomeProofDocument',
        );

        filteredBody.lastModifiedBy = req.user._id;
        if((req).profilePhotoUrl) filteredBody.profilePhoto = (req).profilePhotoUrl;
        if((req).aadhaarCardFrontImageUrl) filteredBody.aadhaarCardFrontImage = (req).aadhaarCardFrontImageUrl;
        if((req).aadhaarCardBackImageUrl) filteredBody.aadhaarCardBackImage = (req).aadhaarCardBackImageUrl;
        if((req).panCardFrontImageUrl) filteredBody.panCardFrontImage = (req).panCardFrontImageUrl;
        if((req).passportPhotoUrl) filteredBody.passportPhoto = (req).passportPhotoUrl;
        if((req).addressProofDocumentUrl) filteredBody.addressProofDocument = (req).addressProofDocumentUrl;
        if((req).incomeProofDocumentUrl) filteredBody.incomeProofDocument = (req).incomeProofDocumentUrl;
    
        await UserDetail.findByIdAndUpdate(user._id, filteredBody);
    
        res.status(200).json({message:'Edit successful'});

    }catch(e){
        res.status(500).json({
            message: 'Something went wrong. Try again.'
        })
    }



});

module.exports = router;


