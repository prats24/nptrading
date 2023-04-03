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
    console.log(req.body)
    const{contestName, contestStartDate, contestEndDate, entryOpeningDate, entryClosingDate, 
        stockType, contestOn, contestRule, rewards, entryFee, instruments, maxParticipants, 
        minParticipants,status
    } = req.body;
    if(await Contest.findOne({contestName})) return res.status(400).json({message:'This contest already exists.'});

    const contest = await Contest.create({contestName, contestStartDate, contestEndDate, entryOpeningDate, entryClosingDate, 
        stockType, contestOn, contestRule, rewards, entryFee, instruments, maxParticipants, 
        minParticipants, createdBy: req.user._id, lastModifiedBy: req.user._id,status});
    
    res.status(201).json({message: 'Contest successfully created.', data:contest});    
        

}

exports.getContests = async(req, res, next)=>{

    const contests = await Contest.find().populate('contestRule','ruleName'); 
    
    res.status(201).json({data: contests});    
        
};

exports.getContest = async(req, res, next)=>{
    
    const id = req.params.id ? req.params.id : '';
    try{
    const contest = await Contest.findById(id).populate('contestRule','ruleName'); 

    res.status(201).json({message: "Contest Retrived",data: contest});    
    }
    catch{(err)=>{res.status(401).json({message: "New Contest", error:err}); }}  
};

exports.editContest = async(req, res, next) => {
    const id = req.params.id;

    const contest = await Contest.findById(id);

    const filteredBody = filterObj(req.body, "contestName", "contestStartDate", "contestEndDate", "entryOpeningDate", "entryClosingDate", 
        "stockType", "contestOn", "contestRule", "entryFee", "instruments", "maxParticipants", 
        "minParticipants","status");
    if(req.body.rewards)filteredBody.rewards=[...contest.rewards,
        {rankStart:req.body.rewards.rankStart,
            rankEnd:req.body.rewards.rankEnd,
            reward:req.body.rewards.reward,
            currency:req.body.rewards.currency}]
    filteredBody.lastModifiedBy = req.user._id;    

    await Contest.findByIdAndUpdate(id, filteredBody);

    res.status(200).json({message: 'Successfully edited contest.'});
}