import { Request, Response, NextFunction } from 'express';
import Carousel from '../models/Carousel';
import {createCustomError} from '../errors/customError';
import CatchAsync from '../middlewares/CatchAsync';
import multer from 'multer';
import AWS from 'aws-sdk';
import sharp from 'sharp';



const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
if (file.mimetype.startsWith("image/")) {
    cb(null, true);
} else {
    cb(new Error("Invalid file type"), false);
}
}
// AWS.config.update({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: process.env.AWS_REGION
//     // accessKeyId: "AKIASR77BQMICZATCLPV",
//     // secretAccessKey: "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",
  
//   });
  
const upload = multer({ storage, fileFilter }).single("carouselPhoto");
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

console.log(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);

export const uploadMulter = upload;

export const resizePhoto = (req, res, next) => {
    if (!req.file) {
      // no file uploaded, skip to next middleware
      console.log('no file');
      next();
      return;
    }
    sharp(req.file.buffer).resize({ width: 600}).toBuffer()
    .then((resizedImageBuffer) => {
      req.file.buffer = resizedImageBuffer;
      next();
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Error resizing photo" });
    });
}; 

export const uploadToS3 = async(req, res, next) => {
    if (!req.file) {
      // no file uploaded, skip to next middleware
      next();
      return;
    }
  
    // create S3 upload parameters
    let carouselName;
    if(req.body.carouselName){
        carouselName = req.body.carouselName;
    }else{
        let carousel = await Carousel.findById(req.params.id);
        carouselName = `${carousel?.carouselName}` ;
    }
    const key = `carousels/${carouselName}/photos/${(Date.now()) + req.file.originalname}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read',
    };
  
    // upload image to S3 bucket
    
    s3.upload((params)).promise()
      .then((s3Data) => {
        console.log('file uploaded');
        console.log(s3Data.Location);
        (req).uploadUrl = s3Data.Location;
        next();
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({ message: "Error uploading to S3" });
      });
  };


  const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
      if (
        allowedFields.includes(el) &&
        obj[el] !== null &&
        obj[el] !== undefined &&
        obj[el] !== ''
      ) {
        newObj[el] = obj[el];
      }
    });
    return newObj;
  };
  

  export const createCarousel =CatchAsync(async (req, res, next) => {
    const{carouselName, description, carouselStartDate, carouselEndDate, objectType, objectId, status} = req.body;
    const carouselImage = (req).uploadUrl;

    console.log('kitchens', kitchens);
    console.log(req.body);
    //Check for required fields 
    if(!(carouselName))return next(createCustomError('Enter all mandatory fields.', 400));

    //Check if user exists
    // if(await carousel.findOne({isDeleted: false, email})) return next(createCustomError('User with this email already exists. Please login with existing email.', 401));
    const carousel = await Carousel.create({carouselName, description, startDate, endDate, kitchens,
      createdBy: (req).user._id, carouselImage});

    if(!carousel) return next(createCustomError('Couldn\'t create carousel', 400));

    res.status(201).json({status: "success", data:carousel});
    
});

export const getCarousels = CatchAsync(async (req, res, next)=>{
    const carousels = await Carousel.find({isDeleted: false}).populate({path: 'kitchens', populate:{path:'society', model:'Society'}}).sort({endDate:-1});


    if(!carousels) return next(createCustomError('No users found.', 404));
    
    res.status(200).json({status:"success", data: carousels, results: carousels.length});

});
export const deleteCarousel = CatchAsync(async (req, res, next) => {
    const {id} = req.params;

    const filter = { _id: id };
    const update = { isDeleted: true };

    try{
        const userDetail = await Carousel.findByIdAndUpdate(id, update);
        console.log("this is userdetail", userDetail);
        res.status(200).json({massage : "data delete succesfully"});
    } catch (e){
        res.status(500).json({error:"Failed to delete data"});
    }    
    
});

export const getCarousel = CatchAsync(async (req, res, next) => {
    const id = req.params.id;

    const user = await Carousel.findOne({_id: id, isDeleted: false}).select('-__v -password').
    populate({path: 'kitchens', populate:{path:'society', model:'Society'}});

    if(!user) return next(createCustomError('No such carousel found.', 404));
    
    res.status(200).json({status:"success", data: user});

});


export const editCarousel = CatchAsync(async (req, res, next) => {
    const id = req.params.id;
    const carousel = await Carousel.findOne({_id: id}).select('-__v -password -role');

    if(!carousel) return next(createCustomError('No such carousel found.', 404));

    const filteredBody = filterObj(req.body, 'carouselName', 'description', 'endDate', 'startDate', 'lastModifiedBy');
    
    filteredBody.lastModifiedBy = id;
    console.log((req).puploadUrl);
    if ((req).file) filteredBody.carouselPhoto = (req).uploadUrl;

    
    const updatedCarousel = await Carousel.findByIdAndUpdate(id, filteredBody, {
        new: true,
        runValidators: true
      }).select('-__v -password -role');
    res.status(200).json({status: "success", data:updatedCarousel});

});

export const getActiveCarousels = CatchAsync(async (req, res, next)=>{
  let date = new Date();
  const carousels = await Carousel.find({isDeleted: false, startDate : {$gte : date}, endDate :{$lte : date}})
  .populate({path: 'kitchens', populate:{path:'society', model:'Society'}}).sort({endDate:-1});

  if(!carousels) return next(createCustomError('No users found.', 404));
  
  res.status(200).json({status:"success", data: carousels, results: carousels.length});

});
