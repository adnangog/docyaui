var express = require("express");
var router = express.Router();
const api = require("../api");
const helper = require("../helpers/index");
const async = require("async");

// Authority Add
router.post("/", (req, res, next) => {
  api.apiCall(
    req.session.token,
    "/authority/add",
    "POST",
    {
      name: req.body.authorityName,
      rDate: Date.now()
    },
    (result) => {
      let opt = "";
      if (result.messageType == 1)
        opt = "?messageType=1&message=Kayıt Eklendi";
      res.redirect(`/authorities${opt}`);
    }
  );
});

// Authority List
router.get("/", (req, res, next) => {
  api.apiCall(req.session.token, "/authority", "POST", {
    page: parseInt(req.query.page) || 0,
    limit: parseInt(req.query.limit) || 1
  }, (data) => {
    let breadcrumb = [
      { route: "/", name: "Anasayfa" },
      { route: "/authorities", name: "Yetkiler" }
    ];
    let page = parseInt(req.query.page) || 0;
    let limit = req.query.limit || 1;
    let total = data.count;

    helper.paging(page, limit, total, "authorities", (paging) => {
      res.render("authorities", {
        title: "Yetkiler",
        addTitle: "Yetki Ekle",
        data,
        breadcrumb,
        paging,
        route: "authorities",
        messageType: req.query.messageType,
        message: req.query.message
      });
    })
  });
});

// Authority GetById
router.get("/:authorityId", (req, res, next) => {
  api.apiCall(req.session.token, "/authority", "POST", {
    page: parseInt(req.query.page) || 0,
    limit: req.query.limit || 1
  }, (data) => {
    api.apiCall(req.session.token, `/authority/${req.params.authorityId}`, "GET", null, (
      authority
    ) => {
      let page = parseInt(req.query.page) || 0;
      let limit = req.query.limit || 1;
      let total = data.count;

      helper.paging(page, limit, total, "authorities", (paging) => {
        let breadcrumb = [
          { route: "/", name: "Anasayfa" },
          { route: "/authorities", name: "Yetkiler" },
          {
            route: `/authorities/${req.params.authorityId}`,
            name: "Yetki Düzenle"
          }
        ];
        res.render("authorities", {
          title: "Yetkiler",
          addTitle: "Yetki Ekle",
          editTitle: "Yetki Düzenle",
          edit: true,
          data,
          authority,
          breadcrumb,
          paging,
          route: "authorities",
        });
      })

    });
  });
});

// Authority Update
router.post("/:authorityId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/authority/${req.params.authorityId}`,
    "PATCH",
    {
      name: req.body.authorityName
    },
    (result) => {
      let opt = "";
      if (result.nModified > 0)
        opt = "?messageType=1&message=İşlem Başarılı";
      res.redirect(`/authorities${opt}`);
    }
  );
});

// Authority Delete
router.get("/delete/:authorityId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/authorities/${req.params.authorityId}`,
    "DELETE",
    null,
    (result) => {
      res.redirect("/authorities");
    }
  );
});

module.exports = router;