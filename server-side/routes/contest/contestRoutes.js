const express = require("express");
const router = express.Router({mergeParams: true});
const multer = require('multer');
const AWS = require('aws-sdk');
const sharp = require('sharp');
const axios = require('axios');
const Contest = require('../../models/Contest/contestSchema');
const {createContest, getContests, editContest, getActiveContests, getContest, joinContest} = require('../../controllers/contestController');
const Authenticate = require('../../authentication/authentication');


const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("application/")) {
    cb(null, true);
} else {
    cb(new Error("Invalid file type"), false);
  }
}

const upload = multer({ storage, fileFilter 
  // limits: {
  // fileSize: 1024 * 1024 * 10,
  // files: 1} 
  }).single("profilePhoto");
const uploadMultiple = multer({ storage, fileFilter,
  limits: {
    fieldSize: 1024 * 1024 * 10, // 10MB maximum file size
  }
}).fields([{ name: 'profilePhoto', maxCount: 1 }, 
{ name: 'aadhaarCardFrontImage', maxCount: 1 }, { name: 'aadhaarCardBackImage', maxCount: 1 }, 
{ name: 'panCardFrontImage', maxCount: 1 }, { name: 'passportPhoto', maxCount: 1 },
{ name: 'addressProofDocument', maxCount: 1 }, { name: 'incomeProofDocument', maxCount: 1 } ]);

const uploadArray = multer({storage, fileFilter, limits: {
    fieldSize: 1024 * 1024 * 10, // 10MB maximum file size
  } 
}).array('icons');


const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const resizePhoto = async (req, res, next) => {
    console.log('resize func');
    console.log(req.files,req.body)
    if (!req.files) {
      // no file uploaded, skip to next middleware
      console.log('no file');
      next();
      return;
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
        userName = `${user?.first_name}`+`${user?.last_name}` + `${user?._id}` ;
        const key = `users/${userName}/photos/display/${Date.now() + (req.files).profilePhoto[0].originalname}`;
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          region: process.env.AWS_REGION,
          Body: (req.files).profilePhotoBuffer,
          ContentType: (req.files).profilePhoto.mimetype,
          ACL: 'public-read',
        };
  
        // upload image to S3 bucket
        const s3Data = await s3.upload(params).promise();
        console.log('file uploaded');
        console.log(s3Data.Location);
        (req).profilePhotoUrl = s3Data.Location;
      }
      for(file in req.files){
        
      }
  
      console.log('calling next of s3 upload func');
      next();
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Error uploading to S3' });
    }
  };

router.route('/').post(Authenticate, uploadArray, resizePhoto, uploadToS3, createContest).get(getContests).
patch(Authenticate, editContest);
router.route('/active').get(getActiveContests)
router.route('/:id').get(getContest).post(Authenticate, joinContest).patch(Authenticate, editContest)
module.exports = router;