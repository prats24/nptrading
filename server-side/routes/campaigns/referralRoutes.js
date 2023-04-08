const express = require("express");
const router = express.Router();
// const multer = require('multer');
// const AWS = require('aws-sdk');
// const sharp = require('sharp');
// const axios = require('axios');
// const Contest = require('../../models/Contest/contestSchema');
const {createReferral, getReferral, editReferral, getReferrals, getActiveReferral, editReferralWithId} = require('../../controllers/referral');
const Authenticate = require('../../authentication/authentication');



router.route('/').post(Authenticate, createReferral).get(getReferrals)
.patch(Authenticate, editReferral);
router.route('/active').get(getActiveReferral)
router.route('/:id').patch(Authenticate, editReferralWithId).get(getReferral)
module.exports = router;