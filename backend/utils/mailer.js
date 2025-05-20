const nodemailer = require('nodemailer');
 
 
async function verifyMail({to, subject, htmlContent}) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'aasifmohamamd@gmail.com',
      pass: 'ppfv rzjv lxaj olhg'
    }
  });

  const mailOptions = {
    from: 'info.earn4u@gmail.com',
    to: to,
    subject: subject,
    html: htmlContent // This is where you put your HTML content
  };

  try {
    console.log(to)
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.log('Email sent error:', error);
  }
}

async function sendMail(to ,username, password) {
 
  const transporter =  nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'info.earn4u@gmail.com',
            pass: 'uqbw pffv ipot kfks'
        }
    })
    const mailOptions = {
      from: 'info.earn4u@gmail.com',
      to: to,
      subject: 'Welcome to Earn4u!',
      text: `Hi ${username},\n\nWelcome to Earn 4 You !\n\nWe're excited to have you join our community. Here are your login details:\n\nEmail: ${to}\nPassword: ${password}\n\nExplore our platform and take full advantage of all the tools and features available to you. If you have any questions, feel free to reach out to our support team.\n\nHappy Trading!\n\nThe Earn 4 You Team\nhttps://earn4u.info`
  };
  
 
    try {
      const result = await transporter.sendMail(mailOptions);
    //   console.log(result);
     
      console.log('Email sent successfully');
    } catch (error) {
        console.log('Email sent error:',error)
    }
 
 
}


async function sendResetPasswordEmail({email, resetUrl}) {
  console.log(email)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "info.earn4u@gmail.com",
      pass: "uqbw pffv ipot kfks",
    },
  });
  const mailOptions = {
    from: 'info.earn4u@gmail.com',
    to: email,
    subject: 'Welcome to Earn4u!',
    text: `Hello,

We received a request to reset your password for your Earn4u account. Click the link below to reset your password:

Reset Password Link: ${resetUrl}

If you did not request a password reset, please ignore this email or contact support if you have concerns.

This link will expire in 1 hour.

Best regards,
The Earn 4 You Team`,
  };

  try {
    await transporter.sendMail(mailOptions); // Send the email
     // Return the token for logging/debugging purposes
  } catch (error) {
    console.log(error);
    
    console.error("Error sending reset password email:", error);
    throw new Error("Failed to send reset password email"); // Throw an error if sending fails
  }
}

module.exports = {
  sendMail,
  sendResetPasswordEmail,
  verifyMail
};

 