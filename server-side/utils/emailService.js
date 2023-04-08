// const nodemailer = require('nodemailer');

// function mailSender(to,subject,message){
//     console.log("Inside Email Service")
//     console.log("Password: ",process.env.STOXHEROEMAILPASSWORD)
//     let transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//               user: 'team@stoxhero.com',
//               pass: process.env.STOXHEROEMAILPASSWORD              //password here
//             }
//     });
//     console.log('Transporter: ',transporter)
//     const mailOptions = { 
//                   from: 'team@stoxhero.com',      // sender address
//                   to: to,       // reciever address 
//                   subject: subject,  
//                   html: message // plain text body
//     };
  
//     transporter.sendMail(mailOptions, function (err, info) {
//       if(err) 
//         console.log(err);
//       else
//         console.log("mail sent");
//     });
//   }

// module.exports = mailSender;


const nodemailer = require('nodemailer');

function mailSender(to, subject, message) {
  return new Promise((resolve, reject) => {
    console.log("Inside Email Service")
    console.log("Password: ",process.env.STOXHEROEMAILPASSWORD)
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'team@stoxhero.com',
        pass: process.env.STOXHEROEMAILPASSWORD              //password here
      }
    });
    console.log('Transporter: ',transporter)
    const mailOptions = { 
      from: 'team@stoxhero.com',      // sender address
      to: to,       // receiver address 
      subject: subject,  
      html: message // plain text body
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if(err) {
        console.log(err);
        reject(false); // Return false if email sending fails
      }
      else {
        console.log("mail sent");
        resolve(true); // Return true if email sending succeeds
      }
    });
  });
}

module.exports = mailSender;
