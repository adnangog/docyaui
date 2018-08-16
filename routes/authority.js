var express = require("express");
var router = express.Router();
const api = require("../api");
const helper = require("../helpers/index");
const async = require("async");

// Authority set add
router.get("/set/add", (req, res, next) => {
  let breadcrumb = [
    { route: "/", name: "Anasayfa" },
    { route: "/authorities/set", name: "Yetki Setleri" },
    {
      route: `/authorities/set/add`,
      name: "Yetki Seti Ekle"
    }
  ];
  res.render("authSetAdd", {
    title: "Yetki Seti Ekle",
    edit: true,
    breadcrumb,
    route: "authorities/set",
    mainMenu: 1,
    subMenu: 10
  });
});

// Authority set Add post
router.post("/set/add", (req, res, next) => {
  api.apiCall(
    req.session.token,
    "/authority/set/add",
    "POST",
    {
      _id: req.body.id,
      name: req.body.authorityName,
      rDate: Date.now()
    },
    (result) => {
      let opt = "";
      if (result.messageType == 1)
        opt = "?messageType=1&message=Kayıt Eklendi";
      res.redirect(`/authorities/set${opt}`);
    }
  );
});

// Authority List
router.get("/set/", (req, res, next) => {
  api.apiCall(req.session.token, "/authority/set", "POST", req.body.pagelimit, (data) => {
    let breadcrumb = [
      { route: "/", name: "Anasayfa" },
      { route: "/authorities/set", name: "Yetki Setleri" }
    ];
    let total = data.count;

    helper.paging(req.body.page, req.body.limit, total, "authorities/set", (paging) => {
      res.render("authSets", {
        title: "Yetki Setleri",
        addTitle: "Yetki Seti Ekle",
        data: total === undefined ? false : data,
        breadcrumb,
        paging,
        route: "authorities/set",
        mainMenu: 1,
        subMenu: 10,
        messageType: req.query.messageType,
        message: req.query.message
      });
    })
  });
});

// Authority GetById
router.get("/set/:authSetId", (req, res, next) => {
  api.apiCall(req.session.token, "/authority/set", "POST", req.body.pagelimit, (data) => {
    api.apiCall(req.session.token, `/authority/set/${req.params.authSetId}`, "GET", null, (
      authority
    ) => {
      let total = data.count;

      helper.paging(req.body.page, req.body.limit, total, "authorities/set", (paging) => {
        let breadcrumb = [
          { route: "/", name: "Anasayfa" },
          { route: "/authorities/set", name: "Yetki Setleri" },
          {
            route: `/authorities/set/${req.params.authSetId}`,
            name: "Yetki Seti Düzenle"
          }
        ];
        res.render("authSets", {
          title: "Yetki Setleri",
          addTitle: "Yetki Seti Ekle",
          editTitle: "Yetki Seti Düzenle",
          edit: true,
          data,
          authority,
          breadcrumb,
          paging,
          route: "authorities/set",
          mainMenu: 1,
          subMenu: 10
        });
      })

    });
  });
});

// Authority Update
router.post("/set/:authSetId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/authority/set/${req.params.authSetId}`,
    "PATCH",
    {
      id: req.body._id,
      name: req.body.authorityName
    },
    (result) => {
      let opt = "";
      if (result.nModified > 0)
        opt = "?messageType=1&message=İşlem Başarılı";
      res.redirect(`/authorities/set${opt}`);
    }
  );
});

// Authority Delete
router.get("/delete/set/:authSetId", (req, res, next) => {
  next();
  res.redirect("/authorities/set");

});


// Authority Add
router.post("/", (req, res, next) => {
  api.apiCall(
    req.session.token,
    "/authority/add",
    "POST",
    {
      _id: req.body.id,
      name: req.body.authorityName,
      rDate: Date.now()
    },
    (result) => {
      let opt = "";
      if (result.messageType == 1)
        opt = "?messageType=1&message=Kayıt Eklendi";
      res.redirect(`/authorities${opt}`);
    }
  );
});

// Authority List
router.get("/", (req, res, next) => {
  api.apiCall(req.session.token, "/authority", "POST", req.body.pagelimit, (data) => {
    let breadcrumb = [
      { route: "/", name: "Anasayfa" },
      { route: "/authorities", name: "Yetkiler" }
    ];
    let total = data.count;

    helper.paging(req.body.page, req.body.limit, total, "authorities", (paging) => {
      res.render("authorities", {
        title: "Yetkiler",
        addTitle: "Yetki Ekle",
        data: total === undefined ? false : data,
        breadcrumb,
        paging,
        route: "authorities",
        mainMenu: 1,
        subMenu: 2,
        messageType: req.query.messageType,
        message: req.query.message
      });
    })
  });
});

// Authority GetById
router.get("/:authorityId", (req, res, next) => {
  api.apiCall(req.session.token, "/authority", "POST", req.body.pagelimit, (data) => {
    api.apiCall(req.session.token, `/authority/${req.params.authorityId}`, "GET", null, (
      authority
    ) => {
      let total = data.count;

      helper.paging(req.body.page, req.body.limit, total, "authorities", (paging) => {
        let breadcrumb = [
          { route: "/", name: "Anasayfa" },
          { route: "/authorities", name: "Yetkiler" },
          {
            route: `/authorities/${req.params.authorityId}`,
            name: "Yetki Düzenle"
          }
        ];
        res.render("authorities", {
          title: "Yetkiler",
          addTitle: "Yetki Ekle",
          editTitle: "Yetki Düzenle",
          edit: true,
          data,
          authority,
          breadcrumb,
          paging,
          route: "authorities",
          mainMenu: 1,
          subMenu: 2
        });
      })

    });
  });
});

// Authority Update
router.post("/:authorityId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/authority/${req.params.authorityId}`,
    "PATCH",
    {
      id: req.body._id,
      name: req.body.authorityName
    },
    (result) => {
      let opt = "";
      if (result.nModified > 0)
        opt = "?messageType=1&message=İşlem Başarılı";
      res.redirect(`/authorities${opt}`);
    }
  );
});

// Authority Delete
router.get("/delete/:authorityId", (req, res, next) => {
  next();
  res.redirect("/authorities");

});

module.exports = router;