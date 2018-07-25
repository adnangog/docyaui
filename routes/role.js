var express = require("express");
var router = express.Router();
const api = require("../api");
const helper = require("../helpers/index");
const async = require("async");

// Role Add
router.post("/", (req, res, next) => {
  api.apiCall(
    req.session.token,
    "/role/add",
    "POST",
    {
      name: req.body.roleName,
      authorities: [],
      rDate: Date.now()
    },
    (result) => {
      let opt = "";
      if (result.messageType == 1)
        opt = "?messageType=1&message=Kayıt Eklendi";
      res.redirect(`/roles${opt}`);
    }
  );
});

// Role List
router.get("/", (req, res, next) => {
  api.apiCall(req.session.token, "/role", "POST", {
    page: parseInt(req.query.page) || 0,
    limit: parseInt(req.query.limit) || 1
  }, (data) => {
    let breadcrumb = [
      { route: "/", name: "Anasayfa" },
      { route: "/roles", name: "Roller" }
    ];
    let page = parseInt(req.query.page) || 0;
    let limit = req.query.limit || 1;
    let total = data.count;

    helper.paging(page, limit, total, "roles", (paging) => {
      res.render("roles", {
        title: "Roller",
        addTitle: "Rol Ekle",
        data,
        breadcrumb,
        paging,
        route: "roles",
        messageType: req.query.messageType,
        message: req.query.message
      });
    })
  });
});

// Role GetById
router.get("/:roleId", (req, res, next) => {
  api.apiCall(req.session.token, "/role", "POST", {
    page: parseInt(req.query.page) || 0,
    limit: parseInt(req.query.limit) || 1
  }, (data) => {
    api.apiCall(req.session.token, `/role/${req.params.roleId}`, "GET", null, (role) => {
      let page = parseInt(req.query.page) || 0;
      let limit = req.query.limit || 1;
      let total = data.count;

      helper.paging(page, limit, total, "roles", (paging) => {
        let breadcrumb = [
          { route: "/", name: "Anasayfa" },
          { route: "/roles", name: "Roller" },
          { route: `/role/${req.params.roleId}`, name: "Rol Düzenle" }
        ];
        res.render("roles", {
          title: "Roller",
          addTitle: "Rol Ekle",
          editTitle: "Rol Düzenle",
          edit: true,
          data,
          role,
          breadcrumb,
          paging,
          route: "roles",
        });
      })
    });
  });
});

// Role Update
router.post("/:roleId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/role/${req.params.roleId}`,
    "PATCH",
    {
      name: req.body.roleName
    },
    (result) => {
      let opt = "";
      if (result.nModified > 0)
        opt = "?messageType=1&message=İşlem Başarılı";
      res.redirect(`/roles${opt}`);
    }
  );
});

// Role Delete
router.get("/delete/:roleId", (req, res, next) => {
  api.apiCall(req.session.token, `/role/${req.params.roleId}`, "DELETE", null, (result) => {
    res.redirect("/roles");
  });
});

module.exports = router;