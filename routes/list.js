var express = require("express");
var router = express.Router();
const api = require("../api");
const helper = require("../helpers/index");
const async = require("async");

// List Add
router.post("/", (req, res, next) => {
  api.apiCall(
    req.session.token,
    "/list/add",
    "POST",
    {
      name: req.body.listName,
      items: req.body.items,
      rDate: Date.now()
    },
    (result) => {
      let opt = "";
      if (result.messageType == 1)
        opt = "?messageType=1&message=Kayıt Eklendi";
      res.redirect(`/lists${opt}`);
    }
  );
});

// List List
router.get("/", (req, res, next) => {
  api.apiCall(
    req.session.token,
    "/list", "POST", req.body.pagelimit, data => {
      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/lists", name: "Listeler" }
      ];

      let total = data.count;

      helper.paging(req.body.page, req.body.limit, total, "lists", paging => {
        res.render("lists", {
          title: "Listeler",
          addTitle: "Liste Ekle",
          data: total === undefined ? false : data,
          breadcrumb,
          paging,
          route: "lists",
          messageType: req.query.messageType,
          message: req.query.message,
          mainMenu:1,
          subMenu:16
        });
      });
    }
  );
});

// List GetById
router.get("/:listId", (req, res, next) => {
  api.apiCall(req.session.token, "/list", "POST", req.body.pagelimit, data => {
    api.apiCall(
      req.session.token,
      `/list/${req.params.listId}`,
      "GET",
      null,
      list => {

        let total = data.count;

        helper.paging(req.body.page, req.body.limit, total, "lists", (paging) => {
          let breadcrumb = [
            { route: "/", name: "Anasayfa" },
            { route: "/lists", name: "Listeler" },
            {
              route: `/list/${req.params.groupId}`,
              name: "Liste Düzenle"
            }
          ];
          res.render("lists", {
            title: "Listeler",
            addTitle: "Liste Ekle",
            editTitle: "Liste Düzenle",
            edit: true,
            data,
            list,
            breadcrumb,
            paging,
            route: "lists",
            mainMenu:1,
            subMenu:16
          });
        })
      }
    );
  });
});

// List Update
router.post("/:listId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/list/${req.params.listId}`,
    "PATCH",
    {
      name: req.body.listName
    },
    result => {
      let opt = "";
      if (result.nModified > 0)
        opt = "?messageType=1&message=İşlem Başarılı";
      res.redirect(`/lists${opt}`);
    }
  );
});

// List Delete
router.get("/delete/:listId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/list/delete/${req.params.listId}`,
    "GET",
    null,
    result => {
      res.redirect("/lists");
    }
  );
});

module.exports = router;
