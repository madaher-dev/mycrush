const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

//@route  POST api/v1/users/
//@desc Register - login - forget password - reset password for a user
//@access Public
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/checkResetToken/:token', authController.checkEmailToken);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/confirm/:token', authController.confirmEmail);
router.get('/deleteCookie', authController.deleteCookie);
router.post('/resendEmail', authController.resendEmail);

//Protect all routes after this middleware
router.use(authController.protect);

router.patch(
  '/updateMyPassword',

  authController.updatePassword
);

router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);

//Restrict all the middleware after this point to admin
router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
