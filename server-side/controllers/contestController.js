const Contest = require('../models/Contest/contestSchema');
const Payment = require('../models/Payment/payment');
const User = require('../models/User/userDetailSchema');


const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
      if (allowedFields.includes(el) && obj[el] !== null && obj[el] !== undefined && obj[el] !== '') {
        newObj[el] = obj[el];
      }
    });
    return newObj;
  };

exports.createContest = async(req, res, next)=>{

    const{contestName, contestStartDate, contestEndDate, entryOpeningDate, entryClosingDate, 
        StockType, ContestOn, contestRules, rewards, entryFee, instruments, maxParticipants, 
        minParticipants
    } = req.body;
    if(await Contest.findOne({contestName, contestEndDate})) return res.status(400).json({message:'This contest already exists.'});

    await Contest.create({contestName, contestStartDate, contestEndDate, entryOpeningDate, entryClosingDate, 
        StockType, ContestOn, contestRules, rewards, entryFee, instruments, maxParticipants, 
        minParticipants, createdBy: req.user._id, lastModifiedBy: req.user._id});
    
    res.status(201).json({message: 'Contest successfully created.'});    
        

}

exports.getContests = async(req, res, next)=>{
    try{
        const contests = await Contest.find(); 
        
        res.status(201).json({data: contests});    
    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
        
};
exports.getActiveContests = async(req, res, next)=>{
    try {
        const contests = await Contest.find({ contestEndDate: { $lt: new Date() } }); 
    
        res.status(201).json({data: contests}); 
        
    } catch (e) {
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
       
        
};

exports.editContest = async(req, res, next) => {
    const id = req.params.id;

    const contest = await Contest.findById(id);

    const filteredBody = filterObj(req.body, contestName, contestStartDate, contestEndDate, entryOpeningDate, entryClosingDate, 
        StockType, ContestOn, contestRules, rewards, entryFee, instruments, maxParticipants, 
        minParticipants);

    filteredBody.lastModifiedBy = req.user._id;    

    await res.findByIdAndUpdate(id, filteredBody);

    res.status(200).json({message: 'Successfully edited contest.'});
}

exports.joinContest = async(req, res, next) => {
    const userId = req.user._id;
    const contestId = req.params.id;
    const {paymentId} = req.body;

    try{
        const contest = await Contest.findById(contestId);
        if(!contest){
            return res.status(404).json({
                status: 'error',
                message: 'No such contest exixts.'
            });
        }
        
        //Check if the contest end date hasn't passed.
        if(Date.now()>Date.parse(contest.contestEndDate)){
            return res.status(400).json({
                status: 'error',
                message: 'The contest has expired. Join an active contest.'
            });
        }

        //Check if the contest has reached maxParticipants
        if(contest.participants.length == contest.maxParticipants){
            return res.status(400).json({
                status: 'error',
                message: 'The contest is full. Join another contest'
            });
        }

        //Check if the user has already joined the room
        if (contest.participants.some(elem => elem.userId == userId)) {
            return res.status(400).json({
              status: 'error',
              message: 'You have already registered for this contest.'
            });
          }

        // if(!paymentId){
        //     return res.status(401).json({
        //         status: 'error',
        //         message: 'Transcation not complete. Please complete your transaction'
        //       });
        // }
        // //Check if the paymentId is valid
        // const payment = await Payment.findOne({paymentId});
        // if(!payment){
        //     return res.status(401).json({
        //         status: 'error',
        //         message: 'Transcation not complete. Please complete your transaction'
        //       });
        // }
        
        // //Check if the payment status is successful
        // if(payment.paymentStatus != 'succeeded'){
        //     return res.status(401).json({
        //         status: 'error',
        //         message: 'Transcation not complete. Please complete your transaction'
        //       });
        // }
        
        contest.participants.push({userId, registeredOn: Date.now(), paymentId});
        await contest.save();
        const user = await User.findById(userId);
        user.contests.push(contest._id);
    
        await user.save();

        res.status(200).json({status:'success', message:'Joined contest.'});


    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }

}

exports.getContest = async (res,res,next) => {
    const {id} = req.params;
    try{
        const contest = await Contest.findById(id);
        if(!contest){
            return res.status(404).json({status: 'error', message: 'Contest not found.'});
        }
        return res.status(200).json({status: 'success', message:'Successful', data:contest});

    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
}