module.exports = (req, res, next) => {
    req.body.page = parseInt(req.query.page) || 0;
    req.body.limit = parseInt(req.query.limit) || 25;
    req.body.pagelimit = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 25
      }
    next();
};