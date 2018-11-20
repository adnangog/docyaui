const api = require("../api");
const async = require("async");

module.exports = (req, res, next) => {
    var _render = res.render;

    async.parallel([
        (callback) => {
            api.apiCall(req.session.token, "/cardtemplate", "POST", req.body.pagelimit, (result) => {
                callback(null, result);
            });
        },
        (callback) => {
            api.apiCall(req.session.token, "/flowtemplate", "POST", req.body.pagelimit, (result) => {
                callback(null, result);
            });
        }
    ],
        (err, results) => {

            res.render = function (view, options, fn) {
                if (typeof options == 'object') {
                    options.menucards = results[0];
                    options.menuflowtemplates = results[1];
                }
                _render.call(this, view, options, fn);
            }

            next();

        });

};