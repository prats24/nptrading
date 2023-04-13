const Carousel = require('../models/carousel/carouselSchema');
const multer = require('multer');
const AWS = require('aws-sdk');
const sharp = require('sharp');






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
  
const upload = multer({ storage, fileFilter }).single("carouselImage");
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

console.log(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);

exports.uploadMulter = upload;

exports.resizePhoto = (req, res, next) => {
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

exports.uploadToS3 = async(req, res, next) => {
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
  

  exports.createCarousel =async (req, res, next) => {
    const{carouselName, description, carouselStartDate, carouselEndDate, objectType, objectId, status,} = req.body;
    const carouselImage = (req).uploadUrl;

    console.log(req.body);
    //Check for required fields 
    if(!(carouselName))return res.status(400).json({status: 'error', message: 'Enter all mandatory fields.'})
    try{
      //Check if user exists
      // if(await carousel.findOne({isDeleted: false, email})) return res.json({})('User with this email already exists. Please login with existing email.', 401));
      const carousel = await Carousel.create({carouselName, description, carouselStartDate, carouselEndDate, objectType, status,
        objectId, createdBy: (req).user._id, carouselImage});
  
      if(!carousel) return res.status(400).json({status: 'error', message: 'Couldn\'t create carousel'});
  
      res.status(201).json({status: "success", data:carousel});
    }catch(e){
      console.log(e);
      res.status(500).json({status:'error', message: 'Something went wrong.'});
    }
    
};

exports.getCarousels = async (req, res, next)=>{
  try{
    const carousels = await Carousel.find({isDeleted: false}).populate('objectId').sort({carouselEndDate:-1});
  
  
      if(!carousels) return res.json({status:'error', message:'No carousels found.'});
      
      res.status(200).json({status:"success", data: carousels, results: carousels.length});
  }catch(e){
      console.log(e);
      res.status(500).json({status:'error', message: 'Something went wrong.'});
  }  

};
exports.deleteCarousel = async (req, res, next) => {
    const {id} = req.params;

    const filter = { _id: id };
    const update = { isDeleted: true };

    try{
        const carousel = await Carousel.findByIdAndUpdate(id, update);
        res.status(200).json({message : "data delete succesfully"});
    } catch (e){
      console.log(e);
      res.status(500).json({status:'error', message: 'Something went wrong.'});
    }    
    
};

exports.getCarousel = async (req, res, next) => {
    const id = req.params.id;
    try{
      const carousel = await Carousel.findOne({_id: id, isDeleted: false}).select('-__v -password').
      populate('objectId');
  
      if(!carousel) return res.status(404).json({status: 'error', message: 'No such carousel found.'});
      
      res.status(200).json({status:"success", data: carousel});
    }catch(e){
      console.log(e);
      res.status(500).json({status:'error', message: 'Something went wrong.'});
    }

};


exports.editCarousel = async (req, res, next) => {
    const id = req.params.id;
    try{

      const carousel = await Carousel.findOne({_id: id}).select('-__v -password -role');
  
      if(!carousel) return res.status(404).json({status: 'error', message: 'No such carousel found.'});
  
      const filteredBody = filterObj(req.body, 'carouselName', 'description', 'carouselEndDate', 
      'status', 'ObjectType', 'ObjectId', 'carouselStartDate','lastModifiedBy');
      
      filteredBody.lastModifiedBy = id;
      console.log((req).uploadUrl);
      if ((req).file) filteredBody.carouselImage = (req).uploadUrl;
  
      
      const updatedCarousel = await Carousel.findByIdAndUpdate(id, filteredBody, {
          new: true,
          runValidators: true
        }).select('-__v');
      res.status(200).json({status: "success", data:updatedCarousel});
    }catch(e){
      console.log(e);
      res.status(500).json({status:'error', message: 'Something went wrong.'});
    }

};

exports.getActiveCarousels = async (req, res, next)=>{
  let date = new Date();
  const carousels = await Carousel.find({isDeleted: false, carouselStartDate : {$gte : date}, endDate :{$lte : date}})
  .populate('objectId').sort({endDate:-1});

  if(!carousels) return res.status(404).json({status: 'error' ,message:'No carousels found.'});
  
  res.status(200).json({status:"success", data: carousels, results: carousels.length});

};
