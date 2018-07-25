var express = require("express");
var router = express.Router();
const api = require("../api");
const helper = require("../helpers/index");
const async = require("async");

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
    req.session.token,
    "/document/type",
    "POST",
    {
      page: parseInt(req.query.page) || 0,
      limit: parseInt(req.query.limit) || 1
    },
    data => {
      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/documents", name: "Dökümanlar" },
        { route: "/documents/types", name: "Döküman Tipleri" }
      ];
      let page = parseInt(req.query.page) || 0;
      let limit = req.query.limit || 1;
      let total = data.count;

      helper.paging(page, limit, total, "/documents/types", paging => {
        res.render("documenttypes", {
          title: "Döküman Tipleri",
          addTitle: "Döküman Tipi Ekle",
          data,
          breadcrumb,
          paging,
          route: "/documents/types",
          messageType: req.query.messageType,
          message: req.query.message
        });
      });
    }
  );
});

// Document Type  GetById
router.get("/types/:typeId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    "/document/type",
    "POST",
    {
      page: parseInt(req.query.page) || 0,
      limit: req.query.limit || 1
    },
    data => {
      api.apiCall(
        req.session.token,
        `/document/type/${req.params.typeId}`,
        "GET",
        null,
        function(documenttype) {
          helper.paging(page, limit, total, "/documents/types", paging => {
            let breadcrumb = [
              { route: "/", name: "Anasayfa" },
              { route: "/documents", name: "Dökümanlar" },
              { route: "/documents/types", name: "Döküman Tipleri" },
              {
                route: `/documents/types/${req.params.typeId}`,
                name: "Döküman Tipi Düzenle"
              }
            ];
            res.render("documenttypes", {
              title: "Döküman Tipleri",
              addTitle: "Döküman Tipi Ekle",
              editTitle: "Döküman Tipi Düzenle",
              edit: true,
              data,
              documenttype,
              breadcrumb,
              paging,
              route: "/documents/types"
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
    `/document/type/${req.params.typeId}`,
    "DELETE",
    null,
    result => {
      res.redirect("/documenttypes");
    }
  );
});

// Document Add
router.post("/", (req, res, next) => {
  api.apiCall(
    req.session.token,
    "/document/add",
    "POST",
    {
      name: req.body.name,
      type: req.body.type,
      publishFirstDate: req.body.publishFirstDate || null,
      publishEndDate: req.body.publishEndDate || null,
      department: req.body.department || null,
      user: req.body.user,
      description: req.body.description,
      file: req.body.file,
      status: 1,
      rDate: Date.now()
    },
    result => {
      api.apiCall(req.session.token, "/document", "GET", null, documents => {
        let breadcrumb = [
          { route: "/", name: "Anasayfa" },
          { route: "/documents", name: "Dökümanlar" }
        ];
        res.render("documents", {
          title: "Dökümanlar",
          addTitle: "Döküman Ekle",
          documents: documents,
          breadcrumb
        });
      });
    }
  );
});

// Document List
router.get("/", (req, res, next) => {
  api.apiCall(
    req.session.token,
    "/document",
    "POST",
    {
      page: parseInt(req.query.page) || 0,
      limit: req.query.limit || 1
    },
    data => {
      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/documents", name: "Dökümanlar" }
      ];
      let page = parseInt(req.query.page) || 0;
      let limit = req.query.limit || 1;
      let total = data.count;

      helper.paging(page, limit, total, "/documents", paging => {
        res.render("documents", {
          title: "Dökümanlar",
          addTitle: "Döküman Ekle",
          data,
          breadcrumb,
          paging,
          route: "/documents",
          messageType: req.query.messageType,
          message: req.query.message
        });
      });
    }
  );
});

// Document GetById
router.get("/:documentId", (req, res, next) => {
  api.apiCall(req.session.token, "/document", "POST", {
    page: parseInt(req.query.page) || 0,
    limit: parseInt(req.query.limit) || 1
  }, documents => {
    api.apiCall(
      req.session.token,
      `/document/${req.params.documentId}`,
      "GET",
      null,
      document => {
        helper.paging(page, limit, total, "/documents", paging => {
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
            route: "/documents"
          });
        });
      }
    );
  });
});

// Document Update
router.post("/:documentId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/document/${req.params.documentId}`,
    "PATCH",
    {
      name: req.body.name,
      type: req.body.type,
      publishFirstDate: req.body.publishFirstDate || null,
      publishEndDate: req.body.publishEndDate || null,
      department: req.body.department || null,
      user: req.body.user,
      description: req.body.description,
      file: req.body.file
    },
    result => {
      let opt = "";
      if (result.nModified > 0) opt = "?messageType=1&message=İşlem Başarılı";
      res.redirect(`/documents${opt}`);
    }
  );
});

// Document Delete
router.get("/delete/:documentId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/document/${req.params.documentId}`,
    "DELETE",
    null,
    result => {
      res.redirect("/documents");
    }
  );
});

module.exports = router;
