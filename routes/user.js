var express = require("express");
var router = express.Router();
const api = require("../api");
const helper = require("../helpers/index");
const async = require("async");

  // User GetById
  router.get("/settings", (req, res, next) => {
    async.parallel([
      (callback) => {
        api.apiCall(req.session.token, `/user/${req.params.userId}`, "GET", null, (result) => {
          callback(null, result);
        });
      }
    ],
      (err, results) => {
        
        let breadcrumb = [
          { route: "/", name: "Anasayfa" },
          { route: `/users/settings`, name: "Kullanıcı Ayarları" }
        ];
  

        res.render("settings", {
          title: "Kullanıcı Ayarları",
          user: results[0],
          breadcrumb,
          mainMenu:5,
          subMenu:11
        });
      });
  });

// User Add
router.post("/", (req, res, next) => {
    api.apiCall(
      req.session.token,
      "/user/add",
      "POST",
      {
        fName: req.body.fName,
        lName: req.body.lName,
        email: req.body.email,
        username: req.body.email,
        password: req.body.password,
        title:req.body.title,
        position:req.body.position,
        source:req.body.source,
        status: 1,
        rDate: Date.now()
      },
      (result) => {
        console.log(result);
        let opt = "";
        if (result.messageType == 1)
          opt = "?messageType=1&message=Kayıt Eklendi";
        res.redirect(`/users${opt}`);
      }
    );
  });
  
  // User List
  router.get("/", (req, res, next) => {
    async.parallel([
      (callback) => {
        api.apiCall(req.session.token, "/user", "POST", req.body.pagelimit, (result) => {
          callback(null, result);
        });
      },
      (callback) => {
        api.apiCall(req.session.token, `/role`, "POST", req.body.pagelimit, (result) => {
          callback(null, result);
        });
      }
    ],
      (err, results) => {
        
        let breadcrumb = [
          { route: "/", name: "Anasayfa" },
          { route: "/users", name: "Kullanıcılar" }
        ];
  
        let total = results[0].info && results[0].info[0].count;
  
      helper.paging(req.body.page, req.body.limit, total, "users", (paging) => {
        res.render("users", {
          title: "Kullanıcılar",
          addTitle: "Kullanıcı Ekle",
          route:"users",
          data: results[0],
          roles: results[1].data,
          breadcrumb,
          paging,
          mainMenu:1,
          subMenu:1
        });
      })
      });
  });
  
  // User GetById
  router.get("/:userId", (req, res, next) => {
    async.parallel([
      (callback) => {
        api.apiCall(req.session.token, "/user", "POST", req.body.pagelimit, (result) => {
          callback(null, result);
        });
      },
      (callback) => {
        api.apiCall(req.session.token, `/user/${req.params.userId}`, "GET", null, (result) => {
          callback(null, result);
        });
      },
      (callback) => {
        api.apiCall(req.session.token, `/role`, "POST", req.body.pagelimit, (result) => {
          callback(null, result);
        });
      }
    ],
      (err, results) => {
        
        let breadcrumb = [
          { route: "/", name: "Anasayfa" },
          { route: "/users", name: "Kullanıcılar" },
          { route: `/users/${req.params.userId}`, name: "Kullanıcı Düzenle" }
        ];
  
        let total = results[0].info && results[0].info[0].count;
  
      helper.paging(req.body.page, req.body.limit, total, "users", (paging) => {
        res.render("users", {
          title: "Kullanıcılar",
          addTitle: "Kullanıcı Ekle",
          editTitle: "Kullanıcı Düzenle",
          route:"users",
          edit: true,
          data: results[0],
          user: results[1],
          roles: results[2].data,
          breadcrumb,
          paging,
          mainMenu:1,
          subMenu:1
        });
      })
      });
  });
  
  // User Update
  router.post("/:userId", (req, res, next) => {
    api.apiCall(
      req.session.token,
      `/user/${req.params.userId}`,
      "PATCH",
      {
        fName: req.body.fName,
        lName: req.body.lName,
        email: req.body.email,
        username: req.body.email,
        role: req.body.role
      },
      function (result) {
        let opt="";
        if(result.nModified>0)
          opt="?messageType=1&message=İşlem Başarılı";
        res.redirect(`/users${opt}`);
      }
    );
  });
  
  // User Delete
  router.get("/delete/:userId", (req, res, next) => {
    api.apiCall(req.session.token, `/user/delete/${req.params.userId}`, "GET", null, (result) => {
      res.redirect("/users");
    });
  });

  module.exports = router;