var express = require("express");
var router = express.Router();
const api = require("../api");
const helper = require("../helpers/index");
const async = require("async");

// Card Add
router.post("/", (req, res, next) => {
  api.apiCall(
    req.session.token,
    "/card/add",
    "POST",
    {
      name: req.body.name,
      rDate: Date.now()
    },
    (result) => {
      let opt = "";
      if (result.messageType == 1)
        opt = "?messageType=1&message=Kayıt Eklendi";
      res.redirect(`/cards${opt}`);
    }
  );
});

// Card List
router.get("/", (req, res, next) => {
  api.apiCall(req.session.token, "/card", "POST", {
    page: parseInt(req.query.page) || 0,
    limit: parseInt(req.query.limit) || 1
  }, (data) => {
    let breadcrumb = [
      { route: "/", name: "Anasayfa" },
      { route: "/cards", name: "Dosya Kartları" }
    ];
    let page = parseInt(req.query.page) || 0;
    let limit = req.query.limit || 1;
    let total = data.count || 0;

    helper.paging(page, limit, total, "cards", (paging) => {
      res.render("cards", {
        title: "Dosya Kartları",
        addTitle: "Dosya Kartı Ekle",
        data,
        breadcrumb,
        paging,
        route: "cards",
        messageType: req.query.messageType,
        message: req.query.message
      });
    })
  });
});

// Card GetById
router.get("/:cardId", (req, res, next) => {
  api.apiCall(req.session.token, "/card", "POST", {}, (data) => {
    api.apiCall(req.session.token, `/card/${req.params.cardId}`, "GET", null, (
      card
    ) => {
      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/cards", name: "Dosya Kartları" },
        {
          route: `/cards/${req.params.cardId}`,
          name: "Dosya Kartı"
        }
      ];

      let page = parseInt(req.query.page) || 0;
      let limit = req.query.limit || 1;
      let total = data.count;


      helper.paging(page, limit, total, "cards", (paging) => {
        res.render("cards", {
          title: "Dosya Kartları",
          addTitle: "Dosya Kartı Ekle",
          editTitle: "Dosya Kartı Düzenle",
          edit: true,
          route: "cards",
          data,
          card,
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
    `/card/${req.params.cardId}`,
    "PATCH",
    {
      name: req.body.name
    },
    (result) => {
      let opt = "";
      if (result.nModified > 0)
        opt = "?messageType=1&message=İşlem Başarılı";
      res.redirect(`/cards${opt}`);
    }
  );
});

// Card Delete
router.get("/delete/:cardId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/cards/${req.params.cardId}`,
    "DELETE",
    null,
    (result) => {
      res.redirect("/cards");
    }
  );
});

module.exports = router;