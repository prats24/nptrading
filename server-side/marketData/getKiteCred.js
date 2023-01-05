const Account =  require('../models/Trading Account/accountSchema');
const RequestToken = require("../models/Trading Account/requestTokenSchema");
exports.getAccess = async (req, res, next) => {
    const apiKey = await Account.find();
    const accessToken = await RequestToken.find();
    // console.log(accessToken);
    let getApiKey, getAccessToken;
    let date = new Date();
    let today = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
    for(let elem of accessToken){
        for(let subElem of apiKey){
         //  console.log("inside 2");
            if(elem.accountId === subElem.accountId && elem.generatedOn === today && elem.status === "Active" && subElem.status === "Active"){
                getAccessToken = elem.accessToken;
                getApiKey = subElem.apiKey
            }
        }
      }
    return {getApiKey, getAccessToken};
}