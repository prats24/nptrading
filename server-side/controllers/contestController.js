const Contest = require('../models/Contest/contestSchema');



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

    const contests = await Contest.find(); 
    
    res.status(201).json({data: contests});    
        
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