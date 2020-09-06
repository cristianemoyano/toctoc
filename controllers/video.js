/**
 * GET /
 * Upload video page.
 */
exports.index = (req, res) => {
  res.render('video/index', {
    title: 'Upload video'
  });
};
