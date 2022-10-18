require("dotenv").config();
const nodemailer = require("nodemailer");
const Cryptr = require('cryptr');
const db = require("../models");
const User = db.User;
const Role = db.Role;

async function sendEmail(emailTo, subjectt, content) {
  try {
    const smtpEndpoint = "smtp.sendgrid.net";
    const port = 465;
    const senderAddress = "SMF POC <vinothfspasd@gmail.com>";
    var toAddress = emailTo;
    const smtpUsername = "apikey";
    const smtpPassword = process.env.SG_APIKEY;
    var subject = subjectt; //"Verify your email"
    // The body of the email for recipients
    var body_html = `<!DOCTYPE> 
    <html>
      <body>
        ${content}
      </body>
    </html>`;

    // Create the SMTP transport.
    var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: "587",
        //secure: true, // true for 587, false for other ports
        service: "Gmail",
        auth: {
            user: "vinothfsp@gmail.com",
            pass: "vinothfsp@123"
        }
    });
    
        // let transporter = nodemailer.createTransport({
    //   host: smtpEndpoint,
    //   port: port,
    //   secure: true, // true for 465, false for other ports
    //   auth: {
    //     user: smtpUsername,
    //     pass: smtpPassword,
    //   },
    // });

    // Specify the fields in the email.
    let mailOptions = {
      from: senderAddress,
      to: toAddress,
      subject: subject,
      html: body_html,
    };
    let info = await transporter.sendMail(mailOptions);
    return { error: false };
  } catch (error) {
    console.error("send-email-error", error);
    return {
      error: true,
      message: "Cannot send email",
    };
  }
}

const userInvite = async(req,user,role)=>{
  var cryptr = new Cryptr(process.env.CRYPTR_SECRET); 
  var encryptedUserId = cryptr.encrypt(user._id);
  var inviteLink=`${req.protocol}://${req.get('host')}/accept/${encryptedUserId}`;
  var inviteMailContent = `<b>Hello!</b><br/>`;
  if(role=='Principal')
  inviteMailContent += `<p>You have been invited to register with the Small Moves Principal Emergency Fund as a Principal.</p>`;
  else
  inviteMailContent += `<p>You have been invited to register with the Small Moves Principal Emergency Fund as a Secondary Contact for your Principal..</p>`;

  inviteMailContent += `<p>Use this link to accept and continue. <a href="${inviteLink}"> ${inviteLink} </a></p>`;
  var invite = await sendEmail(user.email, "Principal Invitation", inviteMailContent);
  if (invite.error) {
      return {
        error: true,
        message: "Couldn't send verification email.",
      };
    }
}

const adminInvite = async(req,user,role)=>{
  var cryptr = new Cryptr(process.env.CRYPTR_SECRET); 
  var encryptedUserId = cryptr.encrypt(user._id);
  var inviteLink=`${req.protocol}://${req.get('host')}/admin-accept/${encryptedUserId}`;
  var inviteMailContent = `<b>Hello!</b><br/>`;
  inviteMailContent += `<p>You have been invited to register with the Small Moves Principal Emergency Fund as a Admin.</p>`;

  inviteMailContent += `<p>Use this link to accept and continue. <a href="${inviteLink}"> ${inviteLink} </a></p>`;
  var invite = await sendEmail(user.email, "Admin Invitation", inviteMailContent);
  if (invite.error) {
      return {
        error: true,
        message: "Couldn't send verification email.",
      };
    }
}

const resetPassword = async(req,user)=>{
  var cryptr = new Cryptr(process.env.CRYPTR_SECRET); 
  var encryptedUserId = cryptr.encrypt(user._id);
  user.resetPasswordToken = encryptedUserId;
  user.resetPasswordExpires = Date.now() + 60 * 1000 * 15;
  await user.save();

  var inviteLink=`${req.protocol}://${req.get('host')}/reset-password/${encryptedUserId}`;
  var inviteMailContent = `<b>Hello!</b><br/>`;
  inviteMailContent += `<p>You are receiving this email because we received a password reset request for your account.</p>`;


  inviteMailContent += `<p>Use this link to reset your password. <a href="${inviteLink}"> ${inviteLink} </a></p>`;
  
  
  var invite = await sendEmail(user.email, "Reset Password Notification", inviteMailContent);
  if (invite.error) {
      return {
        error: true,
        message: "Couldn't send reset link.",
      };
    }


}

const requestPaymentInfo = async(req,fund)=>{
  var cryptr = new Cryptr(process.env.CRYPTR_SECRET); 
  var encryptedRequestId = cryptr.encrypt(fund._id);

  var requestPaymentLink=`${req.protocol}://${req.get('host')}/request/payment-info/${encryptedRequestId}`;
  var inviteMailContent = `<b>Dear ${fund.beneficiary.beneficiary_name},</b><br/>`;
  inviteMailContent += `<p>We at the Small Moves Foundation heard from your child’s school that you needed some support with ${fund.request_demand_reason}. We would like to provide the enclosed gift of $${fund.amount} to you and your family in order to help cover these costs.</p>`;
  inviteMailContent += `<p>In order to receive these funds, please complete the request here.</p>`;

  inviteMailContent += `<p>If you’re having trouble clicking the "Complete Request" button, copy and paste the URL below into your web browser: <a href="${requestPaymentLink}"> ${requestPaymentLink} </a></p>`;
  
  
  var requestPayment = await sendEmail(fund.beneficiary.email, `Emergency fund request #${fund.request_id} confirmation`, inviteMailContent);
  if (requestPayment.error) {
      return {
        error: true,
        message: "Couldn't send reset link.",
      };
    }


}

const newRequest = async(req,fund)=>{

  var adminRole = await Role.findOne({name:'Admin'}).distinct('_id');
  var admin = await User.findOne({role:adminRole});
  var inviteLink=`${req.protocol}://${req.get('host')}/request`;
  var inviteMailContent = `<b>Hello!</b><br/>`;
  inviteMailContent += `<p>Funding request ${fund.request_id} has been created. <a href="${inviteLink}"> See Here! </a> </p>`;

  var invite = await sendEmail(admin.email, "New funding request received", inviteMailContent);
  if (invite.error) {
      return {
        error: true,
        message: "Couldn't send reset link.",
      };
    }


}

const completeRequest = async(req,fund,beneficiary)=>{
  var cryptr = new Cryptr(process.env.CRYPTR_SECRET); 
  var encryptedRequestId = cryptr.encrypt(fund._id);

  var sendTo = beneficiary.email;
  var requestPaymentLink=`${req.protocol}://${req.get('host')}/request/payment-info/${encryptedRequestId}`;
  var inviteMailContent = `<b>Dear ${beneficiary.beneficiary_name},</b><br/>`;
  inviteMailContent += `<p>We at the Small Moves Foundation heard from your child’s school that you needed some support with Housing insecurity. We would like to provide the enclosed gift of $${fund.amount} to you and your family in order to help cover these costs. </p>`;

  inviteMailContent += `<p> In order to receive these funds, please complete the request here. </p>`;
  inviteMailContent += `<p>Use this link to complete. <a href="${requestPaymentLink}"> ${requestPaymentLink} </a></p>`;

  var invite = await sendEmail(sendTo, `Emergency fund request #${fund.request_id} confirmation`, inviteMailContent);
  if (invite.error) {
      return {
        error: true,
        message: "Couldn't send reset link.",
      };
    }


}

const confirmRequest = async(req,fund)=>{
  var adminRole = await Role.findOne({name:'Admin'}).distinct('_id');
  var admin = await User.findOne({role:adminRole});

  var sendTo = admin.email;
  var inviteMailContent = `<b>Hello,</b><br/>`;
  inviteMailContent += `<p>Funding request #${fund.request_id} is waiting to be paid out. <a href="${req.protocol}://${req.get('host')}/request-payment">See here</a></p>`;

  var invite = await sendEmail(sendTo, `Emergency fund request #${fund.request_id} waiting for Payout`, inviteMailContent);
  if (invite.error) {
      return {
        error: true,
        message: "Couldn't send reset link.",
      };
    }


}

const approveRequest = async(req,fund)=>{
  var userInfo = await User.findOne({_id:fund.user})
  .populate('principal',"email")
  .populate('secondaryContact',"email") //is a virtual relation added in schema

  var sendTo = userInfo.email;
  if(userInfo.principal)
  sendTo += ","+userInfo.principal.email;
  
  if(userInfo.secondaryContact)
  sendTo += ","+userInfo.secondaryContact.email;

  var inviteLink=`${req.protocol}://${req.get('host')}/dashboard/${fund._id}`;
  var inviteMailContent = `<b>Dear ${userInfo.first_name},</b><br/>`;
  inviteMailContent += `<p>Your request for ${fund.request_id}  to ${fund.beneficiary.beneficiary_name} has been approved and is in process.</p>`;

  inviteMailContent += `<p>To move forward, please alert the recipient that your request on their behalf has been approved! Please also enter the recipient’s contact and address information <a href="${inviteLink}">Here</a> after you have notified the recipient.</p>`;
  inviteMailContent += `<p>We will be reaching out to the recipient via email or text message to complete this gift.</p>`;

  var invite = await sendEmail(sendTo, `Your fund request #${fund.request_id} has been approved`, inviteMailContent);
  if (invite.error) {
      return {
        error: true,
        message: "Couldn't send reset link.",
      };
    }
}

const rejectRequest = async(req,fund)=>{
  var userInfo = await User.findOne({_id:fund.user})
  .populate('principal',"email")
  .populate('secondaryContact',"email") //is a virtual relation added in schema

  var sendTo = userInfo.email;
  if(userInfo.principal)
  sendTo += ","+userInfo.principal.email;
  
  if(userInfo.secondaryContact)
  sendTo += ","+userInfo.secondaryContact.email;

  var inviteLink=`${req.protocol}://${req.get('host')}/dashboard/${fund._id}`;
  var inviteMailContent = `<b>Dear ${userInfo.first_name},</b><br/>`;
  inviteMailContent += `<p>Your request for ${fund.request_id}  to ${fund.beneficiary.beneficiary_name} has been denied for the following reason:</p>`;

  inviteMailContent += `<p>${fund.rejection_reason}</p>`;
  inviteMailContent += `<p>We will be reaching out to the recipient via email or text message to complete this gift.</p>`;

  var invite = await sendEmail(sendTo, `Your fund request #${fund.request_id} has been denied`, inviteMailContent);
  if (invite.error) {
      return {
        error: true,
        message: "Couldn't send reset link.",
      };
    }
}

module.exports = { userInvite, adminInvite, resetPassword, newRequest, approveRequest, completeRequest, rejectRequest, requestPaymentInfo, confirmRequest };