const nodemailer = require('nodemailer');

function mailSender(to,subject,message){
    console.log("Inside Email Service")
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
              user: 'team@ninepointer.in',
              pass: process.env.NINEPOINTEREMAILPASSWORD              //password here
            }
    });
    
    const mailOptions = { 
                  from: 'team@ninepointer.in',      // sender address
                  to: to,       // reciever address 
                  subject: subject,  
                  html: message // plain text body
    };
  
    transporter.sendMail(mailOptions, function (err, info) {
      if(err) 
        console.log(err);
      else
        console.log("mail sent");
    });
  }

module.exports = mailSender;