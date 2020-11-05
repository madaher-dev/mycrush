// const User = require('./../models/userModel');
// const { Crush } = require('./../models/crushModel');
// const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');

// const twilio = require('twilio')(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// exports.verify = catchAsync(async (req, res, next) => {
//   // const currentUser = await User.findOne({ email: req.body.email });
//   // if (!currentUser) {
//   const newUser = await User.create({
//     name: req.body.name,
//     email: req.body.email,
//     password: req.body.password,
//     passwordConfirm: req.body.passwordConfirm
//   });

//   const confirmToken = newUser.createEmailConfirmToken();
//   await newUser.save({ validateBeforeSave: false });

//   // 3) Send it to user's email
//   const confirmtURL = `${req.protocol}://${req.get(
//     'host'
//   )}/confirm/${confirmToken}`;
//   const message =
//     'Please click on the following link, or paste this into your browser to confirm your email:\n\n' +
//     `${confirmtURL}.\n`;

//   const html_message =
//     `<p> Please click on the following link, or paste this into your browser to confirm your email:\n\n` +
//     `<a href="${confirmtURL}">${confirmtURL}</a>\n`;

//   try {
//     await sendEmail({
//       email: newUser.email,
//       subject: 'Confirm your Email',
//       message,
//       html_message
//     });

//     newUser.password = undefined;

//     // Label self in all matching crushes - can be removed for reset password actions
//     labelSelf(newUser);

//     res.status('200').json({
//       status: 'success',
//       data: {
//         user: newUser
//       }
//     });
//   } catch (err) {
//     await newUser.remove();

//     return next(
//       new AppError('There was an error sending the email. Try again later!'),
//       500
//     );
//   }
// });
