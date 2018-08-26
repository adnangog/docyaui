var express = require("express");
var router = express.Router();
const api = require("../api");
const helper = require("../helpers/index");
const async = require("async");

// bu bolum tamamlanmamistir. ihtiyaca gore guncellenecektir.

// Note Add
router.post("/", (req, res, next) => {
  console.log(req.body)
  api.apiCall(
    req.session.token,
    "/note/add",
    "POST",
    {
      note: req.body.note,
      user: req.session.userId,
      document: req.body.document,
      folder: req.body.folder,
      version: req.body.version,
      rDate: Date.now()
    },
    (result) => {
      console.log(result)
      let opt = "";
      if (result.messageType == 1)
        opt = "?messageType=1&message=Kayıt Eklendi";
      res.redirect(`/cards/${req.body.cardtemplate}/${req.body.card}${opt}`);
    }
  );
});

// Note List
router.get("/", (req, res, next) => {
  api.apiCall(
    req.session.token,
    "/note", "POST", req.body.pagelimit, data => {
      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/notes", name: "Notlar" }
      ];

      let total = data.count;

      helper.paging(req.body.page, req.body.limit, total, "notes", paging => {
        res.render("notes", {
          title: "Notlar",
          addTitle: "Not Ekle",
          data: total === undefined ? false : data,
          breadcrumb,
          paging,
          route: "notes",
          messageType: req.query.messageType,
          message: req.query.message,
          mainMenu: 1,
          subMenu: 5
        });
      });
    }
  );
});

// Note GetById
router.get("/:noteId", (req, res, next) => {
  api.apiCall(req.session.token, "/note", "POST", req.body.pagelimit, data => {
    api.apiCall(
      req.session.token,
      `/note/${req.params.noteId}`,
      "GET",
      null,
      note => {

        let total = data.count;

        helper.paging(req.body.page, req.body.limit, total, "notes", (paging) => {
          let breadcrumb = [
            { route: "/", name: "Anasayfa" },
            { route: "/notes", name: "Notlar" },
            {
              route: `/note/${req.params.roleId}`,
              name: "Not Düzenle"
            }
          ];
          res.render("notes", {
            title: "Notlar",
            addTitle: "Not Ekle",
            editTitle: "Not Düzenle",
            edit: true,
            data,
            note,
            breadcrumb,
            paging,
            route: "notes",
            mainMenu: 1,
            subMenu: 5
          });
        })
      }
    );
  });
});

// Note Update
router.post("/:noteId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/note/${req.params.noteId}`,
    "PATCH",
    {
      name: req.body.noteName
    },
    result => {
      let opt = "";
      if (result.nModified > 0)
        opt = "?messageType=1&message=İşlem Başarılı";
      res.redirect(`/notes${opt}`);
    }
  );
});

// Note Delete
router.get("/delete/:noteId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/note/delete/${req.params.noteId}`,
    "GET",
    null,
    result => {
      res.redirect("/notes");
    }
  );
});

module.exports = router;
