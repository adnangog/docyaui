var express = require("express");
var router = express.Router();
const api = require("../api");
const helper = require("../helpers/index");
const async = require("async");

// Department Add
router.post("/", (req, res, next) => {
  api.apiCall(
    req.session.token,
    "/department/add",
    "POST",
    {
      name: req.body.departmentName,
      rDate: Date.now()
    },
    (result) => {
      let opt = "";
      if (result.messageType == 1)
        opt = "?messageType=1&message=Kayıt Eklendi";
      res.redirect(`/departments${opt}`);
    }
  );
});

// Department List
router.get("/", (req, res, next) => {
  api.apiCall(
    req.session.token,
    "/department", "POST", req.body.pagelimit, data => {
      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/departments", name: "Departmanlar" }
      ];

      let total = data.count;

      helper.paging(req.body.page, req.body.limit, total, "departments", paging => {
        res.render("departments", {
          title: "Departmanlar",
          addTitle: "Departman Ekle",
          data: total === undefined ? false : data,
          breadcrumb,
          paging,
          route: "departments",
          messageType: req.query.messageType,
          message: req.query.message,
          mainMenu:1,
          subMenu:5
        });
      });
    }
  );
});

// Department GetById
router.get("/:departmentId", (req, res, next) => {
  api.apiCall(req.session.token, "/department", "POST", req.body.pagelimit, data => {
    api.apiCall(
      req.session.token,
      `/department/${req.params.departmentId}`,
      "GET",
      null,
      department => {

        let total = data.count;

        helper.paging(req.body.page, req.body.limit, total, "departments", (paging) => {
          let breadcrumb = [
            { route: "/", name: "Anasayfa" },
            { route: "/departments", name: "Departmanlar" },
            {
              route: `/department/${req.params.roleId}`,
              name: "Departman Düzenle"
            }
          ];
          res.render("departments", {
            title: "Departmanlar",
            addTitle: "Departman Ekle",
            editTitle: "Departman Düzenle",
            edit: true,
            data,
            department,
            breadcrumb,
            paging,
            route: "departments",
            mainMenu:1,
            subMenu:5
          });
        })
      }
    );
  });
});

// Department Update
router.post("/:departmentId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/department/${req.params.departmentId}`,
    "PATCH",
    {
      name: req.body.departmentName
    },
    result => {
      let opt = "";
      if (result.nModified > 0)
        opt = "?messageType=1&message=İşlem Başarılı";
      res.redirect(`/departments${opt}`);
    }
  );
});

// Department Delete
router.get("/delete/:departmentId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/department/${req.params.departmentId}`,
    "DELETE",
    null,
    result => {
      res.redirect("/departments");
    }
  );
});

module.exports = router;
