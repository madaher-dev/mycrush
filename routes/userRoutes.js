const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const fbController = require('../controllers/fbController');

//@route  POST api/v1/users/
//@desc Register - login - forget password - reset password for a user
//@access Public
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.get('/checkResetToken/:token', authController.checkEmailToken);
router.patch('/resetPassword/:token', authController.resetPassword);
router.get('/confirm/:token', authController.confirmEmail);
router.get('/deleteCookie', authController.deleteCookie);
router.post('/resendEmail', authController.resendEmail);

router.post('/fb', fbController.signup);
router.post('/insta', authController.protect, fbController.insta);
router.post('/instaDisc', authController.protect, fbController.instaDisconnect);
router.post('/fb/:id', fbController.connect);
router.get('/fb/:id', fbController.disconnect);

//Protect all routes after this middleware
router.use(authController.protect);

router.get(
  '/notifications',
  userController.clearNotifications,
  userController.getNotifications
);
router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);

router.patch(
  '/updateMyPassword',

  authController.updatePassword
);

//Restrict all the middleware after this point to admin
router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
