var express = require("express");
var router = express.Router();
const api = require("../api");
const helper = require("../helpers/index");
const async = require("async");

// Form Add
router.post("/", (req, res, next) => {

  let objCopy = Object.assign({}, req.body);

  for (var key in objCopy) {
    if(key.indexOf("dForm_")<0){
      delete objCopy[key];
    }else{
    Object.defineProperty(objCopy, key.replace("dForm_",""), Object.getOwnPropertyDescriptor(objCopy, key));
    delete objCopy[key];
    }
  }

  console.log(objCopy);

  res.redirect("forms");
  // api.apiCall(
  //   req.session.token,
  //   "/form/add",
  //   "POST",
  //   {
  //     name: req.body.formName,
  //     rDate: Date.now()
  //   },
  //   (result) => {
  //     let opt = "";
  //     if (result.messageType == 1)
  //       opt = "?messageType=1&message=Kayıt Eklendi";
  //     res.redirect(`/forms${opt}`);
  //   }
  // );
});

// Form List
router.get("/", (req, res, next) => {

  let data = {
    "_id": "5b5b164746a35a2b28e13d9e",
    "name": "TEKLİFLER",
    "fields": [
      {
        "label": "Müşteri Adı",
        "type": "text",
        "field": "musteriAdi",
        "sort": 0,
        "isRequired": true
      },
      {
        "label": "Teklif No",
        "type": "text",
        "field": "teklifNo",
        "sort": 1,
        "isRequired": true
      },
      {
        "label": "Teklif Tarihi",
        "type": "date",
        "field": "teklifTarihi",
        "sort": 2
      },
      {
        "label": "Açıklamalar",
        "type": "textarea",
        "field": "aciklamalar",
        "sort": 3
      }
    ]
  };

  res.render("forms", {
    title: "Form",
    addTitle: "Yetki Ekle",
    data
  });
});

// Form GetById
router.get("/:formId", (req, res, next) => {
  api.apiCall(req.session.token, "/form", "POST", req.body.pagelimit, (data) => {
    api.apiCall(req.session.token, `/form/${req.params.formId}`, "GET", null, (
      form
    ) => {
      let total = data.count;

      helper.paging(req.body.page, req.body.limit, total, "forms", (paging) => {
        let breadcrumb = [
          { route: "/", name: "Anasayfa" },
          { route: "/forms", name: "Yetkiler" },
          {
            route: `/forms/${req.params.formId}`,
            name: "Yetki Düzenle"
          }
        ];
        res.render("forms", {
          title: "Yetkiler",
          addTitle: "Yetki Ekle",
          editTitle: "Yetki Düzenle",
          edit: true,
          data,
          form,
          breadcrumb,
          paging,
          route: "forms",
        });
      })

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
  next();
  res.redirect("/forms");

});

module.exports = router;