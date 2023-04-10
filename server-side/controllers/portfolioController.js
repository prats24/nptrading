const Portfolio = require('../models/userPortfolio/UserPortfolio');
const User = require('../models/User/userDetailSchema');
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

exports.createPortfolio = async(req, res, next)=>{
    console.log(req.body)
    const{portfolioName, portfolioValue, portfolioType, portfolioAccount, status
    } = req.body;
    if(await Portfolio.findOne({portfolioName})) return res.status(400).json({message:'This portfolio already exists.'});

    const portfolio = await Portfolio.create({portfolioName, portfolioValue, portfolioType, portfolioAccount, status, createdBy: req.user._id, lastModifiedBy: req.user._id});
    
    res.status(201).json({message: 'Portfolio successfully created.', data:portfolio});    
        

}

exports.getPortfolios = async(req, res, next)=>{
    try{
        const portfolio = await Portfolio.find({status: "Active"})
        
        res.status(201).json({status: 'success', data: portfolio, results: portfolio.length});    
    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
        
};

exports.getContestPortolios = async(req, res, next)=>{
    try{
        const portfolio = await Portfolio.find({portfolioType: "Contest",status: "Active"})
        
        res.status(201).json({status: 'success', data: portfolio, results: portfolio.length});    
    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
        
};

exports.getTradingPortolios = async(req, res, next)=>{
    try{
        const portfolio = await Portfolio.find({portfolioType: "Trading",status:"Active"})
        
        res.status(201).json({status: 'success', data: portfolio, results: portfolio.length});    
    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
        
};

exports.getInactivePortolios = async(req, res, next)=>{
    try{
        const portfolio = await Portfolio.find({status:"Inactive"})
        
        res.status(201).json({status: 'success', data: portfolio, results: portfolio.length});    
    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
        
};


exports.getPortfolio = async(req, res, next)=>{
    
    const id = req.params.id ? req.params.id : '';
    try{
    const portfolio = await Portfolio.findById(id) 

    res.status(201).json({message: "Portfolio Retrived",data: portfolio});    
    }
    catch{(err)=>{res.status(401).json({message: "New Portfolio", error:err}); }}  
};

exports.editPortfolio = async(req, res, next) => {
    console.log("in edit")
    const _id = req.params.id;
    console.log("id is", _id)
    const portfolio = await Portfolio.findById(_id);
    console.log(id, portfolio)
    const filteredBody = filterObj(req.body, "portfolioName", "portfolioValue", "portfolioType", "lastModifiedOn",
                          "status");

    filteredBody.lastModifiedBy = req.user._id;    

    await Portfolio.findByIdAndUpdate(_id, filteredBody);

    res.status(200).json({message: 'Successfully edited portfolio.'});
}

exports.editPortfolioWithName = async(req, res, next) => {
    console.log("in edit")
    // const _id = req.params.id;
    // console.log("id is", _id)
    const portfolio = await Portfolio.find({portfolioName: req.body.portfolioName});
    console.log(portfolio)
    const filteredBody = filterObj(req.body, "portfolioName", "portfolioValue", "portfolioType", "lastModifiedOn",
                          "status");

    filteredBody.lastModifiedBy = req.user._id;    

    await Portfolio.findOneAndUpdate({portfolioName: req.body.portfolioName}, filteredBody, {new: true});

    res.status(200).json({message: 'Successfully edited portfolio.'});
}


exports.myPortfolios = async(req,res,next) => {
    const userId = req.user._id;
    try{
        const myPortfolios = await Portfolio.find({"users.userId": userId});

        if(!myPortfolios){
            return res.status(404).json({status:'error', message: 'No portfolio found'});
        }

        res.status(200).json({status: 'success', data: myPortfolios, results: myPortfolios.length});

    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
}

exports.getUserPortfolio = async(req,res,next) => {
    
    try{
        const userId = req.user._id;

        const user = await User.findOne({_id: userId});
        const portfolioIds = user.portfolio.map(p => p.portfolioId);
        
        const myContests = await Contest.find({"participants.userId": userId, "participants.status": "Joined"});

        const filteredPortfolioIds = portfolioIds.filter(pid => !myContests.some(c => c.participants.some(p => p.portfolioId === pid)));

        const portfolios = await Portfolio.find({_id: {$in: filteredPortfolioIds}});



        res.status(200).json({status: 'success', data: portfolios, results: portfolios.length});

    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
}