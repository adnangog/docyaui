var express = require("express");
var router = express.Router();
const api = require("../api");
const helper = require("../helpers/index");
const async = require("async");

// Folder Add
router.post("/", (req, res, next) => {
  api.apiCall(
    req.session.token,
    "/folder/add",
    "POST",
    {
      name: req.body.name,
      description: req.body.description,
      parent: req.body.parent,
      card: req.body.card,
      user: req.body.user,
      authSet: null,
      rDate: Date.now()
    },
    (result) => {
      let opt = "";
      if (result.messageType == 1)
        opt = "?messageType=1&message=Kayıt Eklendi";
      res.redirect(`/folders${opt}`);
    }
  );
});

// Folder List
router.get("/", (req, res, next) => {
  api.apiCall(
    req.session.token,
    "/folder",
    "POST",
    {
      page: parseInt(req.query.page) || 0,
      limit: parseInt(req.query.limit) || 1
    },
    data => {
      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/folders", name: "Klasörler" }
      ];
      let page = parseInt(req.query.page) || 0;
      let limit = req.query.limit || 1;
      let total = data.count;

      helper.paging(page, limit, total, "folders", paging => {
        res.render("folders", {
          title: "Klasörler",
          addTitle: "Klasör Ekle",
          data,
          breadcrumb,
          paging,
          route: "folders",
          messageType: req.query.messageType,
          message: req.query.message
        });
      });
    }
  );
});

// Folder GetById
router.get("/:folderId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    "/folder",
    "POST",
    {
      page: parseInt(req.query.page) || 0,
      limit: parseInt(req.query.limit) || 1
    },
    data => {
      api.apiCall(
        req.session.token,
        `/folder/${req.params.folderId}`,
        "GET",
        null,
        folder => {
          let page = parseInt(req.query.page) || 0;
          let limit = req.query.limit || 1;
          let total = data.count;

          helper.paging(page, limit, total, "folders", paging => {
            let breadcrumb = [
              { route: "/", name: "Anasayfa" },
              { route: "/folders", name: "Klasörler" },
              {
                route: `/folders/${req.params.folderId}`,
                name: "Klasör"
              }
            ];
            res.render("folders", {
              title: "Klasörler",
              addTitle: "Klasör Ekle",
              editTitle: "Klasör Düzenle",
              edit: true,
              data,
              folder,
              breadcrumb,
              paging,
              route: "folders"
            });
          });
        }
      );
    }
  );
});

// Folder Update
router.post("/:folderId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/folder/${req.params.folderId}`,
    "PATCH",
    {
      name: req.body.name,
      description: req.body.description,
      authSet: null,
      card: "5b54e836db7f91048cb5ae2b"
    },
    result => {
      let opt = "";
      if (result.nModified > 0) opt = "?messageType=1&message=İşlem Başarılı";
      res.redirect(`/folders${opt}`);
    }
  );
});

// Folder Delete
router.get("/delete/:folderId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/folder/${req.params.folderId}`,
    "DELETE",
    null,
    result => {
      res.redirect("/folders");
    }
  );
});

module.exports = router;
