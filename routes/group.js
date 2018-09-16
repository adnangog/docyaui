var express = require("express");
var router = express.Router();
const api = require("../api");
const helper = require("../helpers/index");
const async = require("async");

// Group Add
router.post("/", (req, res, next) => {
  api.apiCall(
    req.session.token,
    "/group/add",
    "POST",
    {
      name: req.body.groupName,
      rDate: Date.now()
    },
    (result) => {
      let opt = "";
      if (result.messageType == 1)
        opt = "?messageType=1&message=Kayıt Eklendi";
      res.redirect(`/groups${opt}`);
    }
  );
});

// Group List
router.get("/", (req, res, next) => {
  async.parallel([
    (callback) => {
      api.apiCall(req.session.token, "/group", "POST", req.body.pagelimit, (result) => {
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
        { route: "/groups", name: "Roller" }
      ];

      let total = results[0].count;

      helper.paging(req.body.page, req.body.limit, total, "groups", (paging) => {
        res.render("groups", {
          title: "Roller",
          addTitle: "Rol Ekle",
          data: total === undefined ? false : results[0],
          authorities: results[1].data,
          breadcrumb,
          paging,
          route: "groups",
          messageType: req.query.messageType,
          message: req.query.message,
          mainMenu: 1,
          subMenu: 3
        });
      })
    });
});

// Group GetById
router.get("/:groupId", (req, res, next) => {
  api.apiCall(req.session.token, "/group", "POST", req.body.pagelimit, (data) => {
    api.apiCall(req.session.token, `/group/${req.params.groupId}`, "GET", null, (group) => {

      let total = data.count;

      helper.paging(req.body.page, req.body.limit, total, "groups", (paging) => {
        let breadcrumb = [
          { route: "/", name: "Anasayfa" },
          { route: "/groups", name: "Roller" },
          { route: `/group/${req.params.groupId}`, name: "Rol Düzenle" }
        ];
        res.render("groups", {
          title: "Roller",
          addTitle: "Rol Ekle",
          editTitle: "Rol Düzenle",
          edit: true,
          data,
          group,
          breadcrumb,
          paging,
          route: "groups",
          mainMenu: 1,
          subMenu: 3
        });
      })
    });
  });
});

// Group Update
router.post("/:groupId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/group/${req.params.groupId}`,
    "PATCH",
    {
      name: req.body.groupName
    },
    (result) => {
      let opt = "";
      if (result.nModified > 0)
        opt = "?messageType=1&message=İşlem Başarılı";
      res.redirect(`/groups${opt}`);
    }
  );
});

// Group Delete
router.get("/delete/:groupId", (req, res, next) => {
  api.apiCall(req.session.token, `/group/delete/${req.params.groupId}`, "GET", null, (result) => {
    res.redirect("/groups");
  });
});

module.exports = router;