const puppeteer = require("puppeteer");
const KiteConnect = require('kiteconnect').KiteConnect;
const AccessAndRequestToken = require("../models/Trading Account/requestTokenSchema");
const {disconnectTicker, createNewTicker}  = require('../marketData/kiteTicker');
const getKiteCred = require('../marketData/getKiteCred');

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }


function zerodhaLogin(ApiKey,SecretKey,UserId,Password,Pin, otherCredentials, resp) {
    const {accountId, status, generatedOn, lastModified, createdBy, uId} = otherCredentials;
    (async () => {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto(
          `https://kite.trade/connect/login?api_key=${ApiKey}&v=3`
        );
        await sleep(2000);
        await page.type("input[type=text]", UserId);
        await page.type("input[type=password]", Password);
        await page.keyboard.press("Enter");
        await sleep(2000);
        await page.focus("input[type=text]").then((value) => console.log(value));
        await page.keyboard.type(Pin);
        await page.keyboard.press("Enter");
        await page.waitForNavigation();
        const reqUrl = page.url();
        console.log("Page URL:", page.url());
        const requestToken = new URL(reqUrl).searchParams.get('request_token');
        console.log("Request Token: ", requestToken);
        await browser.close();
        try{
          const kc = new KiteConnect({
            api_key: ApiKey,
          });
          const response = await kc.generateSession(requestToken, SecretKey);
          const accessToken = response.access_token;
          console.log("Access Token: ",accessToken);

          AccessAndRequestToken.findOne({uId : uId})
          .then((accountIdExist)=>{
              if(accountIdExist){
                  //console.log("accountId already");
                  return resp.status(422).json({error : "account Id already exist..."})
              }
              const requestTokens = new AccessAndRequestToken({accountId, accessToken, requestToken, status, generatedOn, lastModified, createdBy, uId});
      
              requestTokens.save().then(()=>{
      
                  disconnectTicker();
                  getKiteCred.getAccess().then((data) => {
                      //console.log(data);
                      createNewTicker(data.getApiKey, data.getAccessToken);
                  });
                  
                  resp.status(201).json({massage : "data enter succesfully"});
              }).catch((err)=> resp.status(500).json({error:"Failed to enter data"}));
          }).catch(err => {console.log("fail in accesstoken auth")});
      
        //   return [requestToken, accessToken]
        }catch (e){
          console.error(e);
        }
        
      })();
}
module.exports = zerodhaLogin
