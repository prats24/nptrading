const fastTwoSms = require("fast-two-sms")


function sendSMS(numbers, message){
    const options = {
        authorization : process.env.SMS_AUTH , 
        message : message,  
        numbers : numbers,
        sender_id: 'NPTR'
    } 
    let res = 'abc';
    
    const sendMessage = async (options)=>{
        const result = await fastTwoSms.sendMessage(options);
        return result;
    }

    sendMessage(options).then((result)=>console.log(result));

}

module.exports = sendSMS;

