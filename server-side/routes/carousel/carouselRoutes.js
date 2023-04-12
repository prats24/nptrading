import express, {Router} from 'express';
import Authenticate from '../../authentication/authentication';
import {getCarousels, getCarousel, editCarousel, deleteCarousel, createCarousel, 
    uploadMulter, uploadToS3, resizePhoto, getActiveCarousels} from '../../controllers/carouselController';
import Carousel from '../../models/carousel/carouselSchema';
import User from '../models/User';

const router = express.Router();
const currentUser = (req,res,next) =>{
    req.params.id = (req).user._id;
    next(); 
}
router.route('/').get(getCarousels).post(Authenticate,uploadMulter, resizePhoto, uploadToS3 ,createCarousel);
router.route('/active').get(getActiveCarousels)
router.route('/:id').get(protect(User), getCarousel).patch(Authenticate,uploadMulter, resizePhoto, 
uploadToS3,editCarousel).delete(Authenticate, deleteCarousel);


export default router;