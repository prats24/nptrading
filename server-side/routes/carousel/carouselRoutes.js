const express = require("express")
// import express, {Router} from 'express';
const Authenticate = require('../../authentication/authentication');
const {getCarousels, getCarousel, editCarousel, deleteCarousel, createCarousel, 
    uploadMulter, uploadToS3, resizePhoto, getActiveCarousels} = require('../../controllers/carouselController');
const Carousel = require('../../models/carousel/carouselSchema');
const User = require('../../models/User/userDetailSchema');
const authController = require("../../controllers/authController");

const router = express.Router();
const currentUser = (req,res,next) =>{
    req.params.id = (req).user._id;
    next(); 
}
router.route('/').get(getCarousels).post(Authenticate,uploadMulter, resizePhoto, uploadToS3 ,createCarousel);
router.route('/active').get(getActiveCarousels)
router.route('/:id').get(authController.protect(User), getCarousel).patch(Authenticate,uploadMulter, resizePhoto, 
uploadToS3,editCarousel).delete(Authenticate, deleteCarousel);

module.exports = router;