var express = require("express");
var router = express.Router();
const api = require("../api");
const helper = require("../helpers/index");
const async = require("async");

// Card Add
router.post("/", (req, res, next) => {
  api.apiCall(
    req.session.token,
    "/cardtemplate/add",
    "POST",
    {
      name: req.body.name,
      authSet: null,
      user: req.session.userId,
      authSet: req.body.authSet,
      type: req.body.type,
      form: req.body.form,
      rDate: Date.now()
    },
    (result) => {
      let opt = "";
      if (result.messageType == 1)
        opt = "?messageType=1&message=Kayıt Eklendi";
      res.redirect(`/cardtemplates${opt}`);
    }
  );
});

// Card List
router.get("/", (req, res, next) => {
  async.parallel([
    (callback) => {
      api.apiCall(req.session.token, "/cardtemplate", "POST", req.body.pagelimit, (result) => {
        callback(null, result);
      });
    },
    (callback) => {
      api.apiCall(req.session.token, `/form`, "POST", req.body.pagelimit, (result) => {
        callback(null, result);
      });
    },
    (callback) => {
      api.apiCall(req.session.token, `/authority/set`, "POST", req.body.pagelimit, (result) => {
        callback(null, result);
      });
    }
  ],
    (err, results) => {

      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/cardtemplates", name: "Kart Taslakları" }
      ];

      let total = results[0].count;

      helper.paging(req.body.page, req.body.limit, total, "cardtemplates", (paging) => {
        res.render("cardtemplates", {
          title: "Kart Taslakları",
          addTitle: "Kart Taslağı Ekle",
          route: "cardtemplates",
          data: total === undefined ? false : results[0],
          forms: results[1].data,
          authSets: results[2].data,
          breadcrumb,
          paging,
          mainMenu:1,
          subMenu:9
        });
      })
    });
});

// Card GetById
router.get("/:cardtemplateId", (req, res, next) => {
  async.parallel([
    (callback) => {
      api.apiCall(req.session.token, "/cardtemplate", "POST", req.body.pagelimit, (result) => {
        callback(null, result);
      });
    },
    (callback) => {
      api.apiCall(req.session.token, `/cardtemplate/${req.params.cardtemplateId}`, "GET", null, (result) => {
        callback(null, result);
      });
    },
    (callback) => {
      api.apiCall(req.session.token, `/form`, "POST", req.body.pagelimit, (result) => {
        callback(null, result);
      });
    },
    (callback) => {
      api.apiCall(req.session.token, `/authority/set`, "POST", req.body.pagelimit, (result) => {
        console.log(result);
        callback(null, result);
      });
    }
  ],
    (err, results) => {

      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/cardtemplates", name: "Kart Taslakları" },
        { route: `/cardtemplates/${req.params.cardtemplateId}`, name: "Kart Taslakları"}
      ];

      let total = results[0].info && results[0].info[0].count;

      helper.paging(req.body.page, req.body.limit, total, "cardtemplates", (paging) => {
        res.render("cardtemplates", {
          title: "Kart Taslakları",
          addTitle: "Kart Taslağı Ekle",
          editTitle: "Kart Taslağı Düzenle",
          route: "cardtemplates",
          edit: true,
          data: results[0],
          cardtemplate: results[1],
          forms: results[2].data,
          authSets: results[3].data,
          breadcrumb,
          paging,
          mainMenu:1,
          subMenu:9
        });
      })
    });
});

// Card Update
router.post("/:cardtemplateId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/cardtemplate/${req.params.cardtemplateId}`,
    "PATCH",
    {
      name: req.body.name,
      authSet: req.body.authSet,
      type: req.body.type,
      form: req.body.form
    },
    (result) => {
      let opt = "";
      if (result.nModified > 0)
        opt = "?messageType=1&message=İşlem Başarılı";
      res.redirect(`/cardtemplates${opt}`);
    }
  );
});

// Card Delete
router.get("/delete/:cardId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/cardtemplates/delete/${req.params.cardId}`,
    "GET",
    null,
    (result) => {
      res.redirect("/cardtemplates");
    }
  );
});

module.exports = router;