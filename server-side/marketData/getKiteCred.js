const Account =  require('../models/Trading Account/accountSchema');
const RequestToken = require("../models/Trading Account/requestTokenSchema");
exports.getAccess = async (req, res, next) => {
    const apiKey = await Account.find({status: "Active"});
    const accessToken = await RequestToken.find({status: "Active"});
    // console.log(accessToken);
    console.log("in kite cred")
    let getApiKey, getAccessToken;
    let date = new Date();
    let today = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())}`
    for(let elem of accessToken){
        for(let subElem of apiKey){
         //  console.log("inside 2");
            if(elem.accountId === subElem.accountId && elem.generatedOn === today){
                getAccessToken = elem.accessToken;
                getApiKey = subElem.apiKey
            }
        }
      }
    return {getApiKey, getAccessToken};
}