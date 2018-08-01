var express = require("express");
var router = express.Router();
const api = require("../api");
const helper = require("../helpers/index");
const async = require("async");

// Form GetById
router.get("/add", (req, res, next) => {
  let breadcrumb = [
    { route: "/", name: "Anasayfa" },
    { route: "/forms", name: "Formlar" },
    {
      route: `/forms/add}`,
      name: "Form Oluştur"
    }
  ];
  res.render("create", {
    breadcrumb,
    route: "forms/create",
    fields:"[]"
  });
});

// Form Add
router.post("/add", (req, res, next) => {
  api.apiCall(
    req.session.token,
    "/form/add",
    "POST",
    {
      name: req.body.formName,
      fields : JSON.parse(req.body.fields),
      user: req.session.userId,
      rDate: Date.now()
    },
    (result) => {
      let opt = "";
      if (result.messageType == 1)
        opt = "?messageType=1&message=Kayıt Eklendi";
      res.redirect(`/forms${opt}`);
    }
  );
});

// Form List
router.get("/", (req, res, next) => {
  api.apiCall(req.session.token, "/form", "POST", req.body.pagelimit, (data) => {
    let breadcrumb = [
      { route: "/", name: "Anasayfa" },
      { route: "/forms", name: "Formlar" }
      
    ];
    let total = data.count;

    helper.paging(req.body.page, req.body.limit, total, "forms", (paging) => {
      res.render("forms", {
        title: "Formlar",
        addTitle: "Form Ekle",
        data,
        breadcrumb,
        paging,
        route: "forms",
        messageType: req.query.messageType,
        message: req.query.message
      });
    })
  });
});

// Form GetById
router.get("/:formId", (req, res, next) => {
  api.apiCall(req.session.token, `/form/${req.params.formId}`, "GET", null, (
    form
  ) => {
      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/forms", name: "Formlar" },
        {
          route: `/forms/${req.params.formId}`,
          name: "Form Düzenle"
        }
      ];
      res.render("create", {
        edit: true,
        form,
        fields: JSON.stringify(form.fields),
        breadcrumb
      });

  });
});

// Form Update
router.post("/:formId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/form/${req.params.formId}`,
    "PATCH",
    {
      name: req.body.formName
    },
    (result) => {
      let opt = "";
      if (result.nModified > 0)
        opt = "?messageType=1&message=İşlem Başarılı";
      res.redirect(`/forms${opt}`);
    }
  );
});

// Form Delete
router.get("/delete/:formId", (req, res, next) => {
  res.redirect("/forms");

});

module.exports = router;