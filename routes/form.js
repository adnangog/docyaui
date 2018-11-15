var express = require("express");
var router = express.Router();
const api = require("../api");
const helper = require("../helpers/index");
const async = require("async");

// Form GetById
router.get("/add", (req, res, next) => {
  async.parallel([
    (callback) => {
      api.apiCall(req.session.token, "/formType", "POST", req.body.pagelimit, (result) => {
        console.log(result)
        callback(null, result);
      });
    }
  ],
    (err, results) => {
      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/forms", name: "Formlar" },
        {
          route: `/forms/add}`,
          name: "Form Oluştur"
        }
      ];
      res.render("formCreate", {
        breadcrumb,
        route: "forms/create",
        fields:"[]",
        formTypes: results[0].data,
        formCreate:true,
        mainMenu:1,
        subMenu:8
      });
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
      formType: req.body.formType,
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
        data: total === undefined ? false : data,
        breadcrumb,
        paging,
        route: "forms",
        messageType: req.query.messageType,
        message: req.query.message,
        mainMenu:1,
        subMenu:8
      });
    })
  });
});

// Form GetById
router.get("/:formId", (req, res, next) => {
  async.parallel([
    (callback) => {
      api.apiCall(req.session.token, "/formType", "POST", req.body.pagelimit, (result) => {
        callback(null, result);
      });
    },
    (callback) => {
      api.apiCall(req.session.token, `/form/${req.params.formId}`, "GET", null, (result) => {
        callback(null, result);
      });
    }
  ],
    (err, results) => {

      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/forms", name: "Formlar" },
        {
          route: `/forms/${req.params.formId}`,
          name: "Form Düzenle"
        }
      ];
      res.render("formCreate", {
        edit: true,
        formTypes: results[0].data,
        form:results[1],
        fields: JSON.stringify(results[1].fields),
        breadcrumb,
        formCreate:true,
        mainMenu:1,
        subMenu:8
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
      name: req.body.formName,
      formType: req.body.formType,
      fields : JSON.parse(req.body.fields)
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