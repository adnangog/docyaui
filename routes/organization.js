var express = require("express");
var router = express.Router();
const api = require("../api");
const helper = require("../helpers/index");
const async = require("async");

router.get("/add", (req, res, next) => {
  let breadcrumb = [
    { route: "/", name: "Anasayfa" },
    { route: "/organizations", name: "Organizasyon Şemaları" },
    {
      route: `/organization/add}`,
      name: "Organizasyon Şeması Oluştur"
    }
  ];
  res.render("organizationCreate", {
    breadcrumb,
    route: "organizations/add",
    tree:"[]",
    organization:true,
    mainMenu:1,
    subMenu:14
  });
});

// Organization Add
router.post("/", (req, res, next) => {
  api.apiCall(
    req.session.token,
    "/organization/add",
    "POST",
    {
      name: req.body.organizationName,
      tree : JSON.parse(req.body.tree),
      rDate: Date.now()
    },
    (result) => {
      let opt = "";
      if (result.messageType == 1)
        opt = "?messageType=1&message=Kayıt Eklendi";
      res.redirect(`/organizations${opt}`);
    }
  );
});

// Organization List
router.get("/", (req, res, next) => {
  api.apiCall(
    req.session.token,
    "/organization", "POST", req.body.pagelimit, data => {
      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/organizations", name: "Organizasyon Şemaları" }
      ];

      let total = data.count;

      helper.paging(req.body.page, req.body.limit, total, "organizations", paging => {
        res.render("organizations", {
          title: "Organizasyon Şemaları",
          addTitle: "Organizasyon Şeması Ekle",
          data: total === undefined ? false : data,
          breadcrumb,
          paging,
          route: "organizations",
          messageType: req.query.messageType,
          message: req.query.message,
          mainMenu:1,
          subMenu:14
        });
      });
    }
  );
});

// Organization GetById
router.get("/:organizationId", (req, res, next) => {
  api.apiCall(req.session.token, "/organization", "POST", req.body.pagelimit, data => {
    api.apiCall(
      req.session.token,
      `/organization/${req.params.organizationId}`,
      "GET",
      null,
      organization => {

        let total = data.count;

        helper.paging(req.body.page, req.body.limit, total, "organizations", (paging) => {
          let breadcrumb = [
            { route: "/", name: "Anasayfa" },
            { route: "/organizations", name: "Organizasyon Şemaları" },
            {
              route: `/organization/${req.params.groupId}`,
              name: "Organizasyon Şeması Düzenle"
            }
          ];
          res.render("organizationCreate", {
            title: "Organizasyon Şemaları",
            addTitle: "Organizasyon Şeması Ekle",
            editTitle: "Organizasyon Şeması Düzenle",
            edit: true,
            data,
            organization,
            breadcrumb,
            paging,
            route: "organizations",
            mainMenu:1,
            subMenu:14
          });
        })
      }
    );
  });
});

// Organization Update
router.post("/:organizationId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/organization/${req.params.organizationId}`,
    "PATCH",
    {
      name: req.body.organizationName
    },
    result => {
      let opt = "";
      if (result.nModified > 0)
        opt = "?messageType=1&message=İşlem Başarılı";
      res.redirect(`/organizations${opt}`);
    }
  );
});

// Organization Delete
router.get("/delete/:organizationId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/organization/delete/${req.params.organizationId}`,
    "GET",
    null,
    result => {
      res.redirect("/organizations");
    }
  );
});

module.exports = router;
