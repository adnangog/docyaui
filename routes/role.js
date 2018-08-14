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
  async.parallel([
    (callback) => {
      api.apiCall(req.session.token, "/role", "POST", req.body.pagelimit, (result) => {
        callback(null, result);
      });
    },
    (callback) => {
      api.apiCall(req.session.token, `/authority`, "POST", req.body.pagelimit, (result) => {
        callback(null, result);
      });
    }
  ],
    (err, results) => {

      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/roles", name: "Roller" }
      ];

      let total = results[0].count;

      helper.paging(req.body.page, req.body.limit, total, "roles", (paging) => {
        res.render("roles", {
          title: "Roller",
          addTitle: "Rol Ekle",
          data: total === undefined ? false : results[0],
          authorities: results[1].data,
          breadcrumb,
          paging,
          route: "roles",
          messageType: req.query.messageType,
          message: req.query.message,
          mainMenu: 1,
          subMenu: 3
        });
      })
    });
});

// Role GetById
router.get("/:roleId", (req, res, next) => {
  api.apiCall(req.session.token, "/role", "POST", req.body.pagelimit, (data) => {
    api.apiCall(req.session.token, `/role/${req.params.roleId}`, "GET", null, (role) => {

      let total = data.count;

      helper.paging(req.body.page, req.body.limit, total, "roles", (paging) => {
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
          mainMenu: 1,
          subMenu: 3
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