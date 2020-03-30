const User = require('../model/userModel');
const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../utils/catchAsync');
const ApiErrors = require('../utils/apiErrors');
const factory = require('./handlerFactory');

/* const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assets/img/users/');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    const filename = `user-${req.user.id}-${Date.now()}.${ext}`;
    // console.log('file ==>', file);
    cb(null, filename);
  }
}); */

const multerStorage = multer.memoryStorage();

const multerFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new ApiErrors('Not an image format, please upload an image', 400),
      false
    );
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFileFilter });

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/assets/img/users/${req.file.filename}`);
  next();
});
exports.uploadUserPhoto = upload.single('photo');

exports.getMe = (req, res, next) => {
  console.log(req.user);
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1. if user wants to update password from this link

  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new ApiErrors(
        'This route is not for updating the password. Please use /updatemypassword to update ypor password',
        400
      )
    );
  }

  // 2. Update the user data
  const permittedData = filterObj(req.body, 'name', 'email');
  if (req.file) permittedData.photo = req.file.filename;
  const updatedUser = await User.findByIdAndUpdate(req.user.id, permittedData, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: 'success',
    data: {
      updatedUser
    }
  });
});

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.createUser = factory.createOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
