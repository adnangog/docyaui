const express = require("express");
const router = express.Router();
const api = require("../api");
const helper = require("../helpers/index");
const async = require("async");
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const sizeOf = require( 'image-size' );

router.post( '/upload', upload.single( 'file' ), function( req, res, next ) {


  console.log(req.file);
  
    // var dimensions = sizeOf( req.file.path );
  
    // if ( ( dimensions.width < 640 ) || ( dimensions.height < 480 ) ) {
    //   return res.status( 422 ).json( {
    //     error : 'The image must be at least 640 x 480px'
    //   } );
    // }
  
    return res.status( 200 ).send( req.file );
  });

// Form GetById
router.get("/:cardTemplateId/:cardId", (req, res, next) => {
  async.parallel([
    (callback) => {
      api.apiCall(req.session.token, `/card/`, "POST", {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 25,
        cardTemplateId: req.params.cardTemplateId,
        userId: req.session.userId
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
      api.apiCall(req.session.token, `/card/${req.params.cardId}`, "POST", {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 25,
        cardTemplateId: req.params.cardTemplateId,
        userId: req.session.userId
      }, (result) => {
        callback(null, result);
      });
    },
    (callback) => {
      api.apiCall(req.session.token, `/folder/card/${req.params.cardId}`, "POST", {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 25,
        cardTemplateId: req.params.cardTemplateId,
        userId: req.session.userId
      }, (result) => {
        callback(null, result);
      });
    },
    (callback) => {
      api.apiCall(req.session.token, `/authority/set`, "POST", req.body.pagelimit, (result) => {
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

      let isWrite = helper.isAuth(results[2].authsetitems,helper.auths.cardEdit);

      //helper.sendMail('Bay Docya <docyaapp@gmail.com>','adnangog@gmail.com', 'Docya - Bilgilendirme Maili', '<h1>Merhaba</h1><p>Docya iyi günler diler</p>');

      helper.paging(req.body.page, req.body.limit, total, "cards", (paging) => {
        res.render("cards", {
          addTitle:"Yeni Kayıt",
          route: "cards",
          data: total === undefined ? false : results[0],
          cardTemplate: results[1],
          isWrite: isWrite, //gecici
          isForm:true,
          card: results[2],
          folders: results[3],
          authSets: results[4].data,
          breadcrumb,
          paging,
          edit: true,
          mainMenu:3,
          subMenu:req.params.cardTemplateId
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
        authSet: req.body.authSet,
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
    { route: "/cards", name: "Dosya Kartlari" },
    {
      route: `/cards/${req.params.formId}`,
      name: "Dosya Karti Detay"
    }
  ];

  res.render("cards", {
    title: "Kart",
    addTitle: "Kart Ekle",
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
        cardTemplateId: req.params.cardTemplateId,
        userId: req.session.userId
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
      api.apiCall(req.session.token, `/authority/set`, "POST", req.body.pagelimit, (result) => {
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

      // let isWrite = helper.isAuth(results[2].authsetitems,helper.auths.cardEdit);
      let isWrite = true;

      helper.paging(req.body.page, req.body.limit, total, "cards", (paging) => {
        res.render("cards", {
          addTitle:"Yeni Kayıt",
          route: "cards",
          isWrite: isWrite, //gecici
          data: total === undefined ? false : results[0],
          cardTemplate: results[1],
          authSets: results[2].data,
          breadcrumb,
          paging,
          edit: false,
          isForm:true,
          mainMenu:3,
          subMenu:req.params.cardTemplateId
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
router.get("/delete/:cardId", (req, res, next) => { 
  api.apiCall(
  req.session.token,
  `/card/delete/${req.params.cardId}`,
  "GET",
  null,
  (result) => {
    res.redirect("/cards");
  }
);
});

module.exports = router;