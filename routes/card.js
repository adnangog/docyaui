var express = require("express");
var router = express.Router();
const api = require("../api");
const helper = require("../helpers/index");
const async = require("async");

// Form GetById
router.get("/:cardTemplateId/:cardId", (req, res, next) => {
  async.parallel([
    (callback) => {
      api.apiCall(req.session.token, `/card/`, "POST", {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 25,
        cardTemplateId: req.params.cardTemplateId
      }, (result) => {
        callback(null, result);
      });
    },
    (callback) => {
      api.apiCall(req.session.token, `/cardtemplate/${req.params.cardTemplateId}`, "GET", null, (result) => {
        callback(null, result);
      });
    },
    (callback) => {
      api.apiCall(req.session.token, `/card/${req.params.cardId}`, "GET", null, (result) => {
        callback(null, result);
      });
    },
    (callback) => {
      api.apiCall(req.session.token, `/folder/card/${req.params.cardId}`, "GET", null, (result) => {
        callback(null, result);
      });
    }
  ],
    (err, results) => {
      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/forms", name: "Dosya Kartları" },
        {
          route: `/forms/${req.params.cardTemplateId}`,
          name: results[1].name
        }
      ];

      let total = results[0].count;

      helper.paging(req.body.page, req.body.limit, total, "cards", (paging) => {
        res.render("cards", {
          addTitle:"Yeni Kayıt",
          route: "cards",
          data: total === undefined ? false : results[0],
          cardTemplate: results[1],
          card: results[2],
          folders: results[3],
          breadcrumb,
          paging,
          edit: true
        });
      })
    });
});

// Form Add
router.post("/", (req, res, next) => {

    let objCopy = Object.assign({}, req.body);

    for (var key in objCopy) {
      if (key.indexOf("dForm_") < 0 && key.indexOf("duForm_") < 0 ) {
        delete objCopy[key];
      } else {
        Object.defineProperty(objCopy, key.replace("dForm_", "").replace("duForm_", ""), Object.getOwnPropertyDescriptor(objCopy, key));
        delete objCopy[key];
      }
    }

    api.apiCall(req.session.token, "/card/add", "POST",
      {
        name: req.body.name,
        authSet: null,
        user: req.session.userId,
        status: 1,
        type: req.body.type,
        form: req.body.form,
        cardTemplate: req.body.cardId,
        fields: [objCopy],
        rDate: Date.now()
      },
      (result) => {
        let opt = "";
        if (result.messageType == 1)
          opt = "?messageType=1&message=Kayıt Eklendi";
        res.redirect(`/cards/${req.body.cardId}/${result.card._id}${opt}`);
      }
    );

});

// Form List
router.get("/", (req, res, next) => {

  let breadcrumb = [
    { route: "/", name: "Anasayfa" },
    { route: "/forms", name: "Dosya Kartlari" },
    {
      route: `/forms/${req.params.formId}`,
      name: "Dosya Karti Detay"
    }
  ];

  res.render("cards", {
    title: "Form",
    addTitle: "Yetki Ekle",
    breadcrumb,
    isForm: true
  });
});

// Cards GetByTemplateId
router.get("/:cardTemplateId", (req, res, next) => {

  async.parallel([
    (callback) => {
      api.apiCall(req.session.token, `/card/`, "POST", {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 25,
        cardTemplateId: req.params.cardTemplateId
      }, (result) => {
        callback(null, result);
      });
    },
    (callback) => {
      api.apiCall(req.session.token, `/cardtemplate/${req.params.cardTemplateId}`, "GET", null, (result) => {
        callback(null, result);
      });
    }
  ],
    (err, results) => {
      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/forms", name: "Dosya Kartları" },
        {
          route: `/forms/${req.params.cardTemplateId}`,
          name: results[1].name
        }
      ];

      let total = results[0].count;

      helper.paging(req.body.page, req.body.limit, total, "cards", (paging) => {
        res.render("cards", {
          addTitle:"Yeni Kayıt",
          route: "cards",
          data: total === undefined ? false : results[0],
          cardTemplate: results[1],
          breadcrumb,
          paging,
          edit: false
        });
      })
    });
});

// Form Update
router.post("/:cardTemplateId/:cardId", (req, res, next) => {

  let objCopy = Object.assign({}, req.body);

    for (var key in objCopy) {
      if (key.indexOf("dForm_") < 0 && key.indexOf("duForm_") < 0 ) {
        delete objCopy[key];
      } else {
        Object.defineProperty(objCopy, key.replace("dForm_", "").replace("duForm_", ""), Object.getOwnPropertyDescriptor(objCopy, key));
        delete objCopy[key];
      }
    }

  api.apiCall(
    req.session.token,
    `/card/${req.params.cardId}`,
    "PATCH",
    {
      fields: [objCopy]
    },
    (result) => {
      let opt = "";
      if (result.nModified > 0)
        opt = "?messageType=1&message=İşlem Başarılı";
      res.redirect(`/cards/${req.params.cardTemplateId}/${req.params.cardId}${opt}`);
    }
  );
});

// Form Delete
router.get("/delete/:formId", (req, res, next) => {
  next();
  res.redirect("/forms");

});

module.exports = router;