var express = require("express");
var router = express.Router();
const api = require("../api");
const helper = require("../helpers/index");
const async = require("async");
const fs = require('fs');
const sharp = require('sharp');

router.get('/download/:file', function (req, res, next) {
  var filePath = "./uploads/documents/" + req.params.file; // Or format the path using the `id` rest param
  var fileName = "download.png"; // The default name the browser will use

  res.download(filePath, fileName);
});

router.get('/view/:file', function (req, res, next) {

  let width = null;
  let height = null;

  if (req.query.width)
    width = parseInt(req.query.width);

  if (req.query.height)
    height = parseInt(req.query.height);
  // Check if the file exists in the current directory, and if it is writable.
  fs.access('./uploads/documents/' + req.params.file, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send('Not found');
    } else {
      const readStream = fs.createReadStream('./uploads/documents/' + req.params.file);
      let transform = sharp()
        .toFormat('png')
        .resize(width, height);

      readStream.pipe(transform).pipe(res);
    }
  });


  // const src = fs.createReadStream('./uploads/' + req.params.file);
  // src.pipe(res);

});

// Document Type Add
router.post("/types", (req, res, next) => {
  api.apiCall(
    req.session.token,
    "/document/type/add",
    "POST",
    {
      name: req.body.typeName,
      rDate: Date.now()
    },
    (result) => {
      let opt = "";
      if (result.messageType == 1)
        opt = "?messageType=1&message=Kayıt Eklendi";
      res.redirect(`/documents${opt}`);
    }
  );
});

// Document Type  List
router.get("/types", (req, res, next) => {
  api.apiCall(
    req.session.token, "/document/type", "POST", req.body.pagelimit, data => {
      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/documents", name: "Dökümanlar" },
        { route: "/documents/types", name: "Döküman Tipleri" }
      ];

      let total = data.count;

      helper.paging(req.body.page, req.body.limit, total, "../documents/types", paging => {
        res.render("documenttypes", {
          title: "Döküman Tipleri",
          addTitle: "Döküman Tipi Ekle",
          data: total === undefined ? false : data,
          breadcrumb,
          paging,
          route: "../documents/types",
          messageType: req.query.messageType,
          message: req.query.message,
          mainMenu: 1,
          subMenu: 6
        });
      });
    }
  );
});

// Document Type  GetById
router.get("/types/:typeId", (req, res, next) => {
  api.apiCall(
    req.session.token, "/document/type", "POST", req.body.pagelimit, data => {
      api.apiCall(
        req.session.token,
        `/document/type/${req.params.typeId}`,
        "GET",
        null,
        function (documenttype) {

          let breadcrumb = [
            { route: "/", name: "Anasayfa" },
            { route: "/documents", name: "Dökümanlar" },
            { route: "/documents/types", name: "Döküman Tipleri" },
            {
              route: `/documents/types/${req.params.typeId}`,
              name: "Döküman Tipi Düzenle"
            }
          ];

          let total = data.count;

          helper.paging(req.body.page, req.body.limit, total, "../documents/types", paging => {

            res.render("documenttypes", {
              title: "Döküman Tipleri",
              addTitle: "Döküman Tipi Ekle",
              editTitle: "Döküman Tipi Düzenle",
              edit: true,
              data,
              documenttype,
              breadcrumb,
              paging,
              route: "../documents/types",
              mainMenu: 1,
              subMenu: 6
            });
          });
        }
      );
    }
  );
});

// Document Type  Update
router.post("/types/:typeId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/document/type/${req.params.typeId}`,
    "PATCH",
    {
      name: req.body.typeName
    },
    result => {
      let opt = "";
      if (result.nModified > 0) opt = "?messageType=1&message=İşlem Başarılı";
      res.redirect(`/documents/types${opt}`);
    }
  );
});

// Document Type  Delete
router.get("/types/delete/:typeId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/document/type/delete/${req.params.typeId}`,
    "GET",
    null,
    result => {
      res.redirect("/documenttypes");
    }
  );
});

// Document Add
router.post("/", (req, res, next) => {
  let items = {};
  let url = "";
  let apiUrl = "";
  if (req.body.isCard) { // dosya karti v.s sayfalardan geliyorsa
    items = {
      json: req.body.json,
      rDate: Date.now(),
      user: req.session.userId,
      folder: req.body.folder,
      card: req.body.card,
      status: 1
    };
    url = `/cards/${req.body.cardtemplate}/${req.body.card}`;
    apiUrl = "/document/adds";
  } else { // edit formundan geliyorsa
    items = {
      name: req.body.name,
      rDate: Date.now(),
      publishFirstDate: req.body.publishFirstDate,
      publishEndDate: req.body.publishEndDate,
      department: req.body.department,
      user: req.session.userId,
      folder: req.body.folder,
      card: req.body.card,
      authSet: null,
      description: req.body.description,
      file: req.body.file,
      filename: req.body.filename,
      status: 1
    };
    url = "/documents";
    apiUrl = "/document/add";
  }

  api.apiCall(
    req.session.token,
    apiUrl,
    "POST",
    items,
    result => {
      let opt = "";
      if (result.messageType == 1){
        opt = "?messageType=1&message=Kayıt Eklendi";
        if (req.body.isCard) {
          JSON.parse(req.body.json).map(f=>{
            helper.moveFile('./uploads/'+y.filename,'./uploads/documents/'+y.filename,null);
          });
        }
      }
      res.redirect(`${url}${opt}`);
    }
  );
});

// Document List
router.get("/", (req, res, next) => {
  async.parallel([
    (callback) => {
      api.apiCall(req.session.token, "/document", "POST", req.body.pagelimit, (result) => {
        callback(null, result);
      }
      );
    },
    (callback) => {
      api.apiCall(req.session.token, `/card`, "POST", req.body.pagelimit, (result) => {
        callback(null, result);
      });
    },
    (callback) => {
      api.apiCall(req.session.token, `/document/type`, "POST", req.body.pagelimit, (result) => {
        callback(null, result);
      });
    },
    (callback) => {
      api.apiCall(req.session.token, `/department`, "POST", req.body.pagelimit, (result) => {
        callback(null, result);
      });
    },
    (callback) => {
      api.apiCall(req.session.token, `/folder`, "POST", req.body.pagelimit, (result) => {
        callback(null, result);
      });
    }
  ],
    (err, results) => {
      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/documents", name: "Dökümanlar" }
      ];

      let total = results[0].count;


      helper.paging(req.body.page, req.body.limit, total, "documents", (paging) => {
        res.render("documents", {
          title: "Dökümanlar",
          addTitle: "Döküman Ekle",
          route: "documents",
          data: total === undefined ? false : results[0],
          cards: results[1].data,
          types: results[2].data,
          departments: results[3].data,
          folders: results[4].data,
          breadcrumb,
          paging,
          mainMenu: 1,
          subMenu: 7
        });
      })
    });
});

// Document GetById
router.get("/:documentId", (req, res, next) => {
  api.apiCall(req.session.token, "/document", "POST", req.body.pagelimit, data => {
    api.apiCall(
      req.session.token,
      `/document/${req.params.documentId}`,
      "GET",
      null,
      document => {

        helper.paging(req.body.page, req.body.limit, data.count, "/documents", paging => {
          let breadcrumb = [
            { route: "/", name: "Anasayfa" },
            { route: "/documents", name: "Dökümanlar" },
            {
              route: `/documents/${req.params.documentId}`,
              name: "Döküman Düzenle"
            }
          ];
          res.render("documents", {
            title: "Dökümanlar",
            addTitle: "Döküman Ekle",
            editTitle: "Döküman Düzenle",
            edit: true,
            data,
            document,
            breadcrumb,
            paging,
            route: "/documents",
            mainMenu: 1,
            subMenu: 7
          });
        });
      }
    );
  });
});

// Document Update
router.post("/:documentId", (req, res, next) => {
  let items = {};
  let url = "";
  if (req.body.isCard) { // dosya karti v.s sayfalardan geliyorsa
    items = {
      name: req.body.documentname,
    };
    url = `/cards/${req.body.cardtemplate}/${req.body.card}`;
  } else { // edit formundan geliyorsa
    items = {
      name: req.body.name,
      type: req.body.type,
      publishFirstDate: req.body.publishFirstDate || null,
      publishEndDate: req.body.publishEndDate || null,
      department: req.body.department || null,
      user: req.body.user,
      description: req.body.description,
      file: req.body.file
    };
    url = "/documents";
  }
  api.apiCall(
    req.session.token,
    `/document/${req.params.documentId}`,
    "PATCH",
    items,
    result => {
      let opt = "";
      if (result.nModified > 0) opt = "?messageType=1&message=İşlem Başarılı";
      res.redirect(`${url}${opt}`);
    }
  );
});

// Document Delete
router.get("/delete/:documentId", (req, res, next) => {

  // versionlari sil
  // dosyalari sil

  api.apiCall(
    req.session.token,
    `/document/delete/${req.params.documentId}`,
    "GET",
    null,
    result => {
      res.redirect("/documents");
    }
  );
});

module.exports = router;
