var express = require("express");
var router = express.Router();
const api = require("../api");
const helper = require("../helpers/index");
const async = require("async");

// Form GetById
router.get("/add", (req, res, next) => {
  let breadcrumb = [
    { route: "/", name: "Anasayfa" },
    { route: "/formTypes", name: "Form Tipleri" },
    {
      route: `/formTypes/add}`,
      name: "Form Tipi Oluştur"
    }
  ];
  res.render("formTypeCreate", {
    breadcrumb,
    route: "formTypes/add",
    fields:"[]",
    typeCreate:true,
    mainMenu:1,
    subMenu:15
  });
});

// Form Add
router.post("/add", (req, res, next) => {
  api.apiCall(
    req.session.token,
    "/formType/add",
    "POST",
    {
      name: req.body.formTypeName,
      items : JSON.parse(req.body.fields),
      user: req.session.userId,
      rDate: Date.now()
    },
    (result) => {
      let opt = "";
      if (result.messageType == 1)
        opt = "?messageType=1&message=Kayıt Eklendi";
      res.redirect(`/formTypes${opt}`);
    }
  );
});

// Form List
router.get("/", (req, res, next) => {
  api.apiCall(req.session.token, "/formType", "POST", req.body.pagelimit, (data) => {
    let breadcrumb = [
      { route: "/", name: "Anasayfa" },
      { route: "/formTypes", name: "Form Tipleri" }
      
    ];
    let total = data.count;

    helper.paging(req.body.page, req.body.limit, total, "formTypes", (paging) => {
      res.render("formTypes", {
        title: "Form Tipleri",
        addTitle: "Form Tipi Ekle",
        data: total === undefined ? false : data,
        breadcrumb,
        paging,
        route: "formTypes",
        messageType: req.query.messageType,
        message: req.query.message,
        mainMenu:1,
        subMenu:15
      });
    })
  });
});

// Form GetById
router.get("/:formTypeId", (req, res, next) => {
  api.apiCall(req.session.token, `/formType/${req.params.formTypeId}`, "GET", null, (
    formType
  ) => {
      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/formTypes", name: "Form Tipleri" },
        {
          route: `/formTypes/${req.params.formTypeId}`,
          name: "Form Tipi Düzenle"
        }
      ];
      res.render("formTypeCreate", {
        edit: true,
        formType,
        fields: JSON.stringify(formType.items),
        breadcrumb,
        typeCreate:true,
        mainMenu:1,
        subMenu:15
      });

  });
});

// Form Update
router.post("/:formTypeId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/formType/${req.params.formTypeId}`,
    "PATCH",
    {
      name: req.body.formTypeName,
      fields : JSON.parse(req.body.fields)
    },
    (result) => {
      let opt = "";
      if (result.nModified > 0)
        opt = "?messageType=1&message=İşlem Başarılı";
      res.redirect(`/formTypes${opt}`);
    }
  );
});

// Form Delete
router.get("/delete/:formTypeId", (req, res, next) => {
  res.redirect("/formTypes");

});

module.exports = router;