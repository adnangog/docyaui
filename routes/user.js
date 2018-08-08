var express = require("express");
var router = express.Router();
const api = require("../api");
const helper = require("../helpers/index");
const async = require("async");

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
        status: 1,
        authorities: [],
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
    api.apiCall(req.session.token, "/user", "POST", req.body.pagelimit, (data) => {
      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/users", name: "Kullanıcılar" }
      ];
  
      let total = data.count;
  
      helper.paging(req.body.page, req.body.limit, total, "users", (paging) => {
        res.render("users", {
          title: "Kullanıcılar",
          addTitle: "Kullanıcı Ekle",
          data: total === undefined ? false : data,
          breadcrumb,
          paging,
          route:"users",
          messageType:req.query.messageType,
          message:req.query.message
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
          paging
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
    api.apiCall(req.session.token, `/user/${req.params.userId}`, "DELETE", null, (result) => {
      res.redirect("/users");
    });
  });

  module.exports = router;