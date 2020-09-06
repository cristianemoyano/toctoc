const cloudinary = require('cloudinary').v2;
const validator = require('validator');
const Video = require('../models/Video');
const url = require('url');
const { notification } = require('paypal-rest-sdk');

function fullUrl(req, pathname) {
  return url.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname
  });
}

/**
 * GET /
 * Upload video page.
 */
exports.getUpload = (req, res) => {
  res.render('video/index', {
    title: 'Upload video'
  });
};

/**
 * POST /uploader
 * Video uploader
 */
exports.postUpload = (req, res, next) => {
  const validationErrors = [];
  const { title } = req.body;
  const { file } = req;

  console.log(file, title);

  if (validator.isEmpty(title) ? title : '') validationErrors.push({ msg: 'Please enter a video title.' });
  if (file === undefined) validationErrors.push({ msg: 'Please select a video.' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/upload');
  }

  const notificationPath = '/webhook/video/uploaded';

  const fullNotificationURL = fullUrl(req, notificationPath);

  console.log(fullNotificationURL);

  cloudinary.uploader.upload(file.path,
    {
      resource_type: 'video',
      eager_notification_url: fullNotificationURL
    },
    (error, result) => {
      if (result) {
        console.log(result);

        const video = new Video({
          public_id: result.public_id,
          version: result.version,
          signature: result.signature,
          width: result.width,
          height: result.height,
          format: result.format,
          resource_type: result.resource_type,
          created_at: result.created_at,
          bytes: result.bytes,
          type: result.type,
          url: result.url,
          secure_url: result.secure_url,
          user_email: req.user.email
        });

        video.save((err) => {
          if (err) { return next(err); }
          console.log('Your video has been saved.');
        });
      } else {
        console.log(error);
      }

      return next(error);
    });
  req.flash('info', { msg: 'Your video is been proccessed.' });
  res.redirect('/upload');
};

/**
 * POST /webhook/video/uploaded
 * Video uploader
 */
exports.uploaded = (req, res, next) => {
  const video = new Video(req.body);

  video.save((err) => {
    if (err) { return next(err); }
    req.flash('info', { msg: 'Your video has been proccessed.' });
    res.redirect('/');
  });
};
