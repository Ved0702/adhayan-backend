const nodemailer=require("nodemailer");
require('dotenv').config();

const transporter=nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port:process.env.SMTP_PORT,
    secure:false,
    requireTLS:true,
    auth:{
        user:process.env.SMTP_MAIL,
        pass:process.env.SMTP_PASSWORD
    }
});

const sendMail=async(email,subject,content)=>{
    try {
        var mailOption={
            from:process.env.SMTP_MAIL,
            to:email,
            subject:subject,
            html:content
        };
         // Await the sendMail function
                let info = await transporter.sendMail(mailOption);

                // Log the messageId to confirm that the mail has been sent
                console.log("Mail Sent:", info.messageId);
    } catch (err) {
        console.log(err);
        
    }
};
module.exports=sendMail;