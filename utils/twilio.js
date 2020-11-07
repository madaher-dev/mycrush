const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID_TEST,
  process.env.TWILIO_AUTH_TOKEN_TEST
);

const sendSMS = async options => {
  let result = { success: false, error: null };
  try {
    await client.messages.create({
      from: '+15005550006',
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
