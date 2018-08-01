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
      authSet:null,
      user:req.session.userId,
      type:req.body.type,
      form:req.body.form,
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
  api.apiCall(req.session.token, "/cardtemplate", "POST", req.body.pagelimit, (data) => {
    let breadcrumb = [
      { route: "/", name: "Anasayfa" },
      { route: "/cardtemplates", name: "Kart Taslakları" }
    ];
    let total = data.count || 0;

    helper.paging(req.body.page, req.body.limit, total, "cardtemplates", (paging) => {
      res.render("cardtemplates", {
        title: "Kart Taslakları",
        addTitle: "Kart Taslağı Ekle",
        data,
        breadcrumb,
        paging,
        route: "cardtemplates",
        messageType: req.query.messageType,
        message: req.query.message
      });
    })
  });
});

// Card GetById
router.get("/:cardId", (req, res, next) => {
  api.apiCall(req.session.token, "/cardtemplate", "POST", req.body.pagelimit, (data) => {
    api.apiCall(req.session.token, `/cardtemplate/${req.params.cardId}`, "GET", null, (
      cardtemplate
    ) => {
      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/cardtemplates", name: "Kart Taslakları" },
        {
          route: `/cardtemplates/${req.params.cardId}`,
          name: "Kart Taslakları"
        }
      ];
      let total = data.count;

      helper.paging(req.body.page, req.body.limit, total, "cardtemplates", (paging) => {
        res.render("cardtemplates", {
          title: "Kart Taslakları",
          addTitle: "Kart Taslağı Ekle",
          editTitle: "Kart Taslağı Düzenle",
          edit: true,
          route: "cardtemplates",
          data,
          cardtemplate,
          breadcrumb,
          paging
        });
      })
    });
  });
});

// Card Update
router.post("/:cardId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/cardtemplate/${req.params.cardId}`,
    "PATCH",
    {
      name: req.body.name,
      authSet:null,
      type:req.body.type,
      form:req.body.form
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
    `/cardtemplates/${req.params.cardId}`,
    "DELETE",
    null,
    (result) => {
      res.redirect("/cardtemplates");
    }
  );
});

module.exports = router;