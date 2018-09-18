var express = require("express");
var router = express.Router();
const helper = require("../helpers/index");
const api = require("../api");

// AJAX page
// UI uzerindeki tum ajax istekleri bu sayfa uzerinden api'ye iletilir.
router.post("/", (req, res, next) => {
  let route = "";
  let type = "POST";
  let params = req.body.pagelimit;
  let cb = function () { };

  switch (req.body.process) {
    case "sendDoc":
      route = `/user/document/add`;
      params.from = req.session.userId;
      params.to = req.body.user;
      params.document = req.body.document;
      params.rDate = Date.now();
      params.message = req.body.message;
      break;
    case "sendMail":
      route = `/mail/add`;
      params.mail = req.body.mail;
      params.userId = req.session.userId;

      var mail = JSON.parse(req.body.mail);

      helper.sendMail(
        mail.From,
        mail.To,
        mail.Subject,
        mail.Message,
        mail.Attachments
      );
      break;
    case "getAuthSets":
      route = `/authority/set`;
      break;
    case "getUsers":
      route = `/user`;
      params.userId = req.session.userId;
      break;
    case "getUsersByAuthSetId":
      route = `/user/authset/${req.body.authsetId}`;
      break;
    case "getTree":
      route = `/folder/card/${req.body.card}`;
      params.userId = req.session.userId;
      break;
    case "getNote":
      route = "/note";
      params.document = req.body.document;
      params.folder = req.body.folder;
      break;
    case "addNote":
      route = "/note/add";
      params.note = req.body.note;
      params.user = req.session.userId;
      params.document = req.body.document;
      params.folder = req.body.folder;
      params.version = req.body.version;
      params.rDate = Date.now();
      break;
    case "addDocument":
      route = "/document/adds";
      params.json = req.body.json;
      params.rDate = Date.now();
      params.user = req.session.userId;
      params.folder = req.body.folder;
      params.card = req.body.card;
      params.status = 1;

      JSON.parse(req.body.json).map(f => {
        helper.moveFile(
          "./uploads/" + f.filename,
          "./uploads/documents/" + f.filename,
          () => { }
        );
      });

      break;
    case "renameDocument":
      route = `/document/${req.body.document}`;
      params.name = req.body.documentname;
      type = "PATCH";
      break;
    case "addFolder":
      route = "/folder/add";
      params.name = req.body.foldername;
      params.description = req.body.description;
      params.parent = req.body.folder;
      params.card = req.body.card;
      params.user = req.session.userId;
      params.authSet = null;
      params.rDate = Date.now();
      break;
    case "renameFolder":
      route = `/folder/${req.body.folder}`;
      params.name = req.body.foldername;
      type = "PATCH";
      break;
    case "deleteDocument":
      api.apiCall(
        req.session.token,
        `/document/version/${req.body.document}`,
        "GET",
        params,
        data => {
          if (data.messageType === 1) {
            data.data.map(x => {
              helper.deleteFile("./uploads/documents/" + x.file);
            });
          }
        }
      );
      route = `/document/delete/${req.body.document}`;
      type = "GET";
      break;
  }

  api.apiCall(req.session.token, route, type, params, data => {
    cb();
    // bu kisim apiden gelen message type gore cevap verir hale getirelecek.
    // bunun icin api her response'a bir message ve messageType parametresi donmeli.

    res.status(201).json(data);
  });
});

module.exports = router;
