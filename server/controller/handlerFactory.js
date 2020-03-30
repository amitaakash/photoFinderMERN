const catchAsync = require('../utils/catchAsync');
const ApiErrors = require('../utils/apiErrors');
const ApiFeatures = require('../utils/apiFeature');

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    console.log(doc);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    // Execute Query
    const features = new ApiFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    //const docs = await features.query.explain(); // explain query performance
    const docs = await features.query;

    // send response
    res.status(200).json({
      status: 'success',
      dataCount: docs.length,
      data: docs
    });
  });

exports.getOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      return next(
        new ApiErrors(`No tour found with ID: ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      status: 'success',
      data: doc
    });
  });
exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!doc) {
      return next(
        new ApiErrors(`No document found with ID: ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      status: 'success',
      data: doc
    });
  });

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(
        new ApiErrors(`No document found with ID: ${req.params.id}`, 404)
      );
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  });
