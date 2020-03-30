const express = require('express');
const authController = require('../controller/authController');
const userController = require('../controller/userController');

const Router = express.Router();

Router.route('/signup').post(authController.signUp);
Router.route('/activate/').post(authController.resendActivationToken);
Router.route('/activate/:token').patch(authController.activateAccount);
Router.route('/login').post(authController.logIn);
Router.route('/logout').post(authController.logout);
Router.route('/forgotpassword').post(authController.forgotPassword);
Router.route('/resetpassword/:token').patch(authController.resetPassword);
Router.use(
  authController.isLoggedIn,
  authController.restrictTo('admin', 'user')
);
Router.get('/me', userController.getMe, userController.getUser);
Router.patch('/updatemypassword', authController.updatePassword);
Router.patch('/temp', userController.uploadUserPhoto)
Router.patch(
  '/updateme',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

Router.use(authController.protect, authController.restrictTo('admin'));
Router.get('/', userController.getAllUsers);
Router.get('/:id', userController.getUser);

module.exports = Router;
