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
    "/department",
    "POST",
    {
      page: parseInt(req.query.page) || 0,
      limit: parseInt(req.query.limit) || 1
    },
    data => {
      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/departments", name: "Departmanlar" }
      ];
      let page = parseInt(req.query.page) || 0;
      let limit = req.query.limit || 1;
      let total = data.count;

      helper.paging(page, limit, total, "departments", paging => {
        res.render("departments", {
          title: "Departmanlar",
          addTitle: "Departman Ekle",
          data,
          breadcrumb,
          paging,
          route: "departments",
          messageType: req.query.messageType,
          message: req.query.message
        });
      });
    }
  );
});

// Department GetById
router.get("/:departmentId", (req, res, next) => {
  api.apiCall(req.session.token, "/department", "POST", {
    page: parseInt(req.query.page) || 0,
    limit: req.query.limit || 1
  }, data => {
    api.apiCall(
      req.session.token,
      `/department/${req.params.departmentId}`,
      "GET",
      null,
      department => {
        let page = parseInt(req.query.page) || 0;
        let limit = req.query.limit || 1;
        let total = data.count;

        helper.paging(page, limit, total, "departments", (paging) => {
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
      api.apiCall(
        req.session.token,
        "/department",
        "GET",
        null,
        departments => {
          let breadcrumb = [
            { route: "/", name: "Anasayfa" },
            { route: "/departments", name: "Departmanlar" }
          ];
          res.render("departments", {
            title: "Departmanlar",
            addTitle: "Departman Ekle",
            departments: departments,
            breadcrumb
          });
        }
      );
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
      res.redirect("/Department");
    }
  );
});

module.exports = router;
