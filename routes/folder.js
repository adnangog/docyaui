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
      user: req.session.userId,
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
  async.parallel([
    (callback) => {
      api.apiCall(req.session.token, "/folder", "POST", req.body.pagelimit, (result) => {
        callback(null, result);
      }
      );
    },
    (callback) => {
      api.apiCall(req.session.token, `/card`, "POST", req.body.pagelimit, (result) => {
        callback(null, result);
      });
    }
  ],
    (err, results) => {
      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/users", name: "Klasörler" }
      ];

      let total = results[0].info && results[0].info[0].count;


      helper.paging(req.body.page, req.body.limit, total, "folders", (paging) => {
        res.render("folders", {
          title: "Klasörler",
          addTitle: "Klasör Ekle",
          route: "folders",
          data: results[0],
          cards: results[1].data,
          // authSets: results[2].data,
          breadcrumb,
          paging
        });
      })
    });
});

// Folder GetById
router.get("/:folderId", (req, res, next) => {
  async.parallel([
    (callback) => {
      api.apiCall(req.session.token, "/folder", "POST", req.body.pagelimit, (result) => {
        callback(null, result);
      }
      );
    },
    (callback) => {
      api.apiCall(req.session.token, `/folder/${req.params.folderId}`, "GET", null, result => {
        callback(null, result);
      }
      );
    },
    (callback) => {
      api.apiCall(req.session.token, `/card`, "POST", req.body.pagelimit, (result) => {
        callback(null, result);
      });
    }
  ],
    (err, results) => {

      let total = results[0].info && results[0].info[0].count;;

      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/folders", name: "Klasörler" },
        {
          route: `/folders/${req.params.folderId}`,
          name: "Klasör Düzenle"
        }
      ];

      helper.paging(req.body.page, req.body.limit, total, "folders", paging => {
        res.render("folders", {
          title: "Klasörler",
          addTitle: "Klasör Ekle",
          editTitle: "Klasör Düzenle",
          edit: true,
          data: results[0],
          cards: results[2].data,
          folder: results[1],
          breadcrumb,
          paging,
          route: "folders"
        });
      });
    });
});
router.get("/:folderId", (req, res, next) => {

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
      parent: req.body.parent,
      card: req.body.card,
      user: req.session.userId,
      authSet: null,
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
