var express = require("express");
var router = express.Router();
const api = require("../api");
const helper = require("../helpers/index");
const async = require("async");

// Folder GetById
router.get("/add", (req, res, next) => {
  async.parallel([
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
        { route: "/flowTemplates", name: "İş Akışı Taslakları" },
        {
          route: `/flowTemplates/add`,
          name: "İş Akışı Taslağı Ekle"
        }
      ];

      helper.paging(req.body.page, req.body.limit, total, "flowTemplates", paging => {
        res.render("flowCreate", {
          title: "İş Akışı Taslakları",
          addTitle: "İş Akışı Taslağı Ekle",
          editTitle: "İş Akışı Taslağı Düzenle",
          edit: true,
          cards: results[0].data,
          flow:true,
          breadcrumb,
          paging,
          route: "flowTemplates",
          mainMenu:1,
          subMenu:13
        });
      });
    });
});

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
      api.apiCall(req.session.token, "/flowTemplate", "POST", req.body.pagelimit, (result) => {
        callback(null, result);
      }
      );
    }
  ],
    (err, results) => {
      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/flowTemplates", name: "İş Akışı Taslakları" }
      ];

      let total = results[0].count;

      helper.paging(req.body.page, req.body.limit, total, "flowTemplates", (paging) => {
        res.render("flowTemplates", {
          title: "İş Akışı Taslakları",
          addTitle: "İş Akışı Taslağı Ekle",
          route: "flowTemplates",
          data: total === undefined ? false : results[0],
          flow:true,
          breadcrumb,
          paging,
          mainMenu:1,
          subMenu:12
        });
      })
    });
});

// Folder GetById
router.get("/:flowTemplateId", (req, res, next) => {
  async.parallel([
    (callback) => {
      api.apiCall(req.session.token, `/flowtemplate/${req.params.flowTemplateId}`, "GET", null, result => {
        callback(null, result);
      }
      );
    }
  ],
    (err, results) => {

      let total = results[0].info && results[0].info[0].count;;

      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/flowtemplates", name: "İş Akışı Taslakları" },
        {
          route: `/folders/${req.params.folderId}`,
          name: "İş Akışı Taslağı Düzenle"
        }
      ];

      helper.paging(req.body.page, req.body.limit, total, "flowtemplates", paging => {
        res.render("flowCreate", {
          title: "İş Akışı Taslakları",
          addTitle: "İş Akışı Taslağı Ekle",
          editTitle: "İş Akışı Taslağı Düzenle",
          edit: true,
          flowtemplate: results[0],
          flow:true,
          breadcrumb,
          paging,
          route: "flowTemplates",
          mainMenu:1,
          subMenu:13
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
router.get("/delete/:flowTemplateId", (req, res, next) => {

  api.apiCall(
    req.session.token,
    `/flowtemplate/delete/${req.params.flowTemplateId}`,
    "GET",
    null,
    result => {
      res.redirect("/flowTemplates");
    }
  );
});

module.exports = router;
