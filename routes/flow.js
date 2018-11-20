var express = require("express");
var router = express.Router();
const api = require("../api");
const helper = require("../helpers/index");
const async = require("async");

// Flow Add
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

  for (let key in objCopy) {
    objCopy[key]=helper.stringToType(objCopy[key]);
  }

  console.log({
    name: req.body.name,
    user: req.session.userId,
    flowTemplate: req.body.flowTemplate,
    fields: [objCopy]
  })

  api.apiCall(req.session.token, "/flow/add", "POST",
    {
      name: req.body.name,
      user: req.session.userId,
      flowTemplate: req.body.flowTemplate,
      fields: [objCopy]
    },
    (result) => {
      let opt = "";
      if (result.messageType == 1)
        opt = "?messageType=1&message=Kayıt Eklendi";
      res.redirect(`/flows/${req.body.flowTemplate}`);
    }
  );
});

// Flow List
router.get("/", (req, res, next) => {
  async.parallel([
    (callback) => {
      api.apiCall(req.session.token, "/flow", "POST", req.body.pagelimit, (result) => {
        callback(null, result);
      }
      );
    },
    (callback) => {
      api.apiCall(req.session.token, `/card`, "POST", req.body.pagelimit, (result) => {
        callback(null, result);
      });
    }
  ],
    (err, results) => {
      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/flows", name: "Is Akislari" }
      ];

      let total = results[0].count;

      helper.paging(req.body.page, req.body.limit, total, "flows", (paging) => {
        res.render("flowCreate", {
          title: "Is Akislari",
          addTitle: "Is Akisi Ekle",
          route: "flows",
          data: total === undefined ? false : results[0],
          cards: results[1].data,
          // authSets: results[2].data,
          flow:true,
          breadcrumb,
          paging,
          mainMenu:1,
          subMenu:13
        });
      })
    });
});

// Flow GetById
router.get("/:flowTemplateId", (req, res, next) => {
  async.parallel([
    (callback) => {
      api.apiCall(req.session.token, "/flow", "POST", {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 25,
        cardTemplateId: req.params.flowTemplateId,
        userId: req.session.userId
      }, (result) => {
        callback(null, result);
      }
      );
    },
    (callback) => {
      api.apiCall(req.session.token, `/flowTemplate/${req.params.flowTemplateId}`, "GET", null, (result) => {
        callback(null, result);
      });
    },
  ],
    (err, results) => {

      console.log(results[1])

      let total = results[0].info && results[0].info[0].count;

      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: `/flows/${req.params.flowTemplateId}`, name: "İş Akışları" },
        {
          route: `/flows/${req.params.flowTemplateId}`,
          name: results[1].name
        }
      ];

      helper.paging(req.body.page, req.body.limit, total, "flows", paging => {
        res.render("flows", {
          title: "İş Akışları",
          addTitle: "İş Akışı Ekle",
          editTitle: "İş Akışı Düzenle",
          isWrite:true,
          flowTemplate:results[1],
          data: results[0],
          breadcrumb,
          paging,
          route: "flows",
          mainMenu:4,
          subMenu:req.params.flowTemplateId
        });
      });
    });
});

// Flow Update
router.post("/:flowId", (req, res, next) => {
  let items = {};
  let url = "";
  if(req.body.isCard){ // dosya karti v.s sayfalardan geliyorsa
    items = {
      name: req.body.flowname,
    };
    url= `/cards/${req.body.cardtemplate}/${req.body.card}`;
  }else{ // edit formundan geliyorsa
    items = {
      name: req.body.name,
      description: req.body.description,
      parent: req.body.parent,
      card: req.body.card,
      user: req.session.userId,
      authSet: null,
    };
    url= "/flows";
  }
  api.apiCall(
    req.session.token,
    `/flow/${req.params.flowId}`,
    "PATCH",
    items,
    result => {
      let opt = "";
      if (result.nModified > 0) opt = "?messageType=1&message=İşlem Başarılı";
      res.redirect(`${url}${opt}`);
    }
  );
});

// Flow Delete
router.get("/delete/:flowId", (req, res, next) => {

  // dokuman ya da klasor varsa buna ait silinemez.

  api.apiCall(
    req.session.token,
    `/flow/delete/${req.params.flowId}`,
    "GET",
    null,
    result => {
      res.redirect("/flows");
    }
  );
});

module.exports = router;
