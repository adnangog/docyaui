var express = require("express");
var router = express.Router();
const api = require("../api");
const helper = require("../helpers/index");
const async = require("async");

// Authority set add form sayfası
router.get("/set/add", (req, res, next) => {
  async.parallel([
    (callback) => {
      api.apiCall(req.session.token, "/user", "POST", req.body.pagelimit, (result) => {
        callback(null, result);
      });
    },
    (callback) => {
      api.apiCall(req.session.token, `/group`, "POST", req.body.pagelimit, (result) => {
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
        { route: "/authorities/set", name: "Yetki Setleri" },
        {
          route: `/authorities/set/add`,
          name: "Yetki Seti Ekle"
        }
      ];

      let total = results[0].info && results[0].info[0].count;

      let owners = [];
      
      results[0].data && results[0].data.map(x => {
        owners.push({
          type: 1,
          ownerId: x[0],
          name: `${x[1]} ${x[2]}`,
          authorities: []
        });
      });

      results[1].data && results[1].data.map(x => {
        owners.push({
          type: 2,
          ownerId: x[0],
          name: x[1],
          authorities: []
        });
      });

      helper.paging(req.body.page, req.body.limit, total, "users", (paging) => {
        res.render("authSetAdd", {
          title: "Yetki Seti Ekle",
          route: "authorities/set",
          ownersJSON: JSON.stringify(owners),
          owners:owners,
          authorities: results[2].data,
          breadcrumb,
          paging,
          mainMenu: 1,
          subMenu: 10
        });
      })
    });
});

// Authority set Add post
router.post("/set/add", (req, res, next) => {
  api.apiCall(
    req.session.token,
    "/authority/set/add",
    "POST",
    {
      name: req.body.name,
      description: req.body.description,
      json: req.body.json,
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
  async.parallel([
    (callback) => {
      api.apiCall(req.session.token, "/user", "POST", req.body.pagelimit, (result) => {
        callback(null, result);
      });
    },
    (callback) => {
      api.apiCall(req.session.token, `/group`, "POST", req.body.pagelimit, (result) => {
        callback(null, result);
      });
    },
    (callback) => {
      api.apiCall(req.session.token, `/authority`, "POST", req.body.pagelimit, (result) => {
        callback(null, result);
      });
    },
    (callback) => {
      api.apiCall(req.session.token, `/authority/set/${req.params.authSetId}`, "GET", null, (result) => {
        callback(null, result);
      });
    }
  ],
    (err, results) => {

      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/authorities/set", name: "Yetki Setleri" },
        {
          route: `/authorities/set/add`,
          name: "Yetki Seti Düzenle"
        }
      ];

      let total = results[0].info && results[0].info[0].count;

      let owners = [];
      
      results[0].data && results[0].data.map(x => {
        owners.push({
          type: 1,
          ownerId: x[0],
          name: `${x[1]} ${x[2]}`,
          authorities: []
        });
      });

      results[1].data && results[1].data.map(x => {
        owners.push({
          type: 2,
          ownerId: x[0],
          name: x[1],
          authorities: []
        });
      });

      helper.paging(req.body.page, req.body.limit, total, "users", (paging) => {
        res.render("authSetAdd", {
          title: "Yetki Seti Düzenle",
          route: "authorities/set",
          ownersJSON: JSON.stringify(owners),
          edit:true,
          owners:owners,
          authorities: results[2].data,
          authSet:results[3],
          breadcrumb,
          paging,
          mainMenu: 1,
          subMenu: 10
        });
      })
    });
});

// Authority Update
router.post("/set/:authSetId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/authority/set/${req.params.authSetId}`,
    "PATCH",
    {
      name: req.body.name,
      description: req.body.description,
      json: req.body.json,
      rDate: Date.now()
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
router.get("/set/delete/:authSetId", (req, res, next) => {
  api.apiCall(req.session.token, `/authority/set/delete/${req.params.authSetId}`, "GET", null, (result) => {
    res.redirect("/authorities/set");
  });
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
  api.apiCall(req.session.token, `/authority/delete/${req.params.authorityId}`, "GET", null, (result) => {
    res.redirect("/authorities");
  });
});

module.exports = router;