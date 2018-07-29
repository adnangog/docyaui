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
      authSet:[],
      user:req.session.userId,
      type:req.body.type,
      form:req.body.form,
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
  api.apiCall(req.session.token, "/card", "POST", req.body.pagelimit, (data) => {
    let breadcrumb = [
      { route: "/", name: "Anasayfa" },
      { route: "/cards", name: "Kart Taslakları" }
    ];
    let total = data.count || 0;

    helper.paging(req.body.page, req.body.limit, total, "cards", (paging) => {
      res.render("cards", {
        title: "Kart Taslakları",
        addTitle: "Kart Taslağı Ekle",
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
  api.apiCall(req.session.token, "/card", "POST", req.body.pagelimit, (data) => {
    api.apiCall(req.session.token, `/card/${req.params.cardId}`, "GET", null, (
      card
    ) => {
      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/cards", name: "Kart Taslakları" },
        {
          route: `/cards/${req.params.cardId}`,
          name: "Kart Taslakları"
        }
      ];
      
      let total = data.count;

      helper.paging(req.body.page, req.body.limit, total, "cards", (paging) => {
        res.render("cards", {
          title: "Kart Taslakları",
          addTitle: "Kart Taslağı Ekle",
          editTitle: "Kart Taslağı Düzenle",
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