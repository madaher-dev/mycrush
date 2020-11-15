const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async options => {
  let result = { success: false, error: null };
  try {
    await client.messages.create({
      // from: '+15005550006', Testing number
      from: process.env.TWILIO_PHONE_NUMBER,
      to: options.number,
      body: options.message
    });
    result.success = true;
    return result;
  } catch (error) {
    console.log(error);
    result.error = error;
    return result;
  }
};
module.exports = sendSMS;
