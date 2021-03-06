const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmailVerificationMail = (email, name, host, token) => {
  sgMail.send({
    to: email,
    from: 'Admin <admin@examclub.io>',
    subject: 'Exam Club - Verification Email',
    text: `Hi ${name}! 
        This email is to verify your email id.
        Please click on the link below or copy and paste it in the browser to verify your email address.
        http://${host}/email-verification/${token}. 
        Thank You and welcome to the ExamClub!`.replace(/	    /g, ''),
    //   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  })
};

const sendPasswordResetMail = (email, name, host, token) => {
  sgMail.send({
    to: email,
    from: 'Admin <admin@examclub.io>',
    subject: 'Exam Club - Forgot Password/Reset',
    text: `Hi ${name}! You are receiving this because you (or someone else) has requested for the reset of your account password.
	    Please click on the following link, or copy and paste it into your browser to complete the process:
	    http://${host}/reset/${token}. If you did not request this, please ignore this email and your password will remain unchanged.`.replace(/	    /g, ''),
    //   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  })
};

const sendPasswordResetConfirmationMail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'Admin <admin@examclub.io>',
    subject: 'Exam Club - Succesful Password Reset',
    text: `Hi ${name}! Your password has been succesfully reset.`
    //   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  })
};



module.exports = {
  sendPasswordResetMail,
  sendPasswordResetConfirmationMail,
  sendEmailVerificationMail,
}