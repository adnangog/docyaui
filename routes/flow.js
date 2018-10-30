var express = require("express");
var router = express.Router();
const api = require("../api");
const helper = require("../helpers/index");
const async = require("async");

// Folder Add
router.post("/", (req, res, next) => {
  let items = {};
  let url = "";
  if(req.body.isCard){ // dosya karti v.s sayfalardan geliyorsa
    items = {
      name: req.body.foldername,
      description: req.body.description,
      parent: req.body.folder,
      card: req.body.card,
      user: req.session.userId,
      authSet: null,
      rDate: Date.now()
    };
    url= `/cards/${req.body.cardtemplate}/${req.body.card}`;
  }else{ // edit formundan geliyorsa
    items = {
      name: req.body.name,
      description: req.body.description,
      parent: req.body.parent,
      card: req.body.card,
      user: req.session.userId,
      authSet: null,
      rDate: Date.now()
    };
    url= "/folders";
  }
  api.apiCall(
    req.session.token,
    "/folder/add",
    "POST",
    items,
    (result) => {
      let opt = "";
      if (result.messageType == 1)
        opt = "?messageType=1&message=Kayıt Eklendi";
      res.redirect(`${url}${opt}`);
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
        { route: "/flows", name: "Is Akislari" }
      ];

      let total = results[0].count;

      helper.paging(req.body.page, req.body.limit, total, "flows", (paging) => {
        res.render("flowCreate", {
          title: "Is Akislari",
          addTitle: "Is Akisi Ekle",
          route: "flows",
          data: total === undefined ? false : results[0],
          cards: results[1].data,
          // authSets: results[2].data,
          flow:true,
          breadcrumb,
          paging,
          mainMenu:1,
          subMenu:13
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
          route: "folders",
          mainMenu:1,
          subMenu:4
        });
      });
    });
});

// Folder Update
router.post("/:folderId", (req, res, next) => {
  let items = {};
  let url = "";
  if(req.body.isCard){ // dosya karti v.s sayfalardan geliyorsa
    items = {
      name: req.body.foldername,
    };
    url= `/cards/${req.body.cardtemplate}/${req.body.card}`;
  }else{ // edit formundan geliyorsa
    items = {
      name: req.body.name,
      description: req.body.description,
      parent: req.body.parent,
      card: req.body.card,
      user: req.session.userId,
      authSet: null,
    };
    url= "/folders";
  }
  api.apiCall(
    req.session.token,
    `/folder/${req.params.folderId}`,
    "PATCH",
    items,
    result => {
      let opt = "";
      if (result.nModified > 0) opt = "?messageType=1&message=İşlem Başarılı";
      res.redirect(`${url}${opt}`);
    }
  );
});

// Folder Delete
router.get("/delete/:folderId", (req, res, next) => {

  // dokuman ya da klasor varsa buna ait silinemez.

  api.apiCall(
    req.session.token,
    `/folder/delete/${req.params.folderId}`,
    "GET",
    null,
    result => {
      res.redirect("/folders");
    }
  );
});

module.exports = router;
