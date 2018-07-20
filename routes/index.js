var express = require("express");
var router = express.Router();
const api = require("../api");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/useradd", function(req, res, next) {
  res.render("useradd", { title: "Kullanici Ekle" });
});

// User Add
router.post("/users", function(req, res, next) {
  api.apiCall(
    "/user",
    "POST",
    {
      fName: req.body.fName,
      lName: req.body.lName,
      email: req.body.email,
      username: req.body.email,
      password: req.body.password,
      statu: 1,
      authorities: [],
      rDate: Date.now()
    },
    function(result) {
      api.apiCall("/user", "GET", null, function(users) {
        let breadcrumb = [
          { route: "/", name: "Anasayfa" },
          { route: "/users", name: "Kullanıcılar" }
        ];
        res.render("users", {
          title: "Kullanıcılar",
          addTitle: "Kullanıcı Ekle",
          users: users,
          breadcrumb: breadcrumb
        });
      });
    }
  );
});

// User List
router.get("/users", function(req, res, next) {
  api.apiCall("/user", "GET", null, function(users) {
    let breadcrumb = [
      { route: "/", name: "Anasayfa" },
      { route: "/users", name: "Kullanıcılar" }
    ];
    res.render("users", {
      title: "Kullanıcılar",
      addTitle: "Kullanıcı Ekle",
      users: users,
      breadcrumb: breadcrumb
    });
  });
});

// User GetById
router.get("/users/:userId", function(req, res, next) {
  api.apiCall("/user", "GET", null, function(users) {
    api.apiCall(`/user/${req.params.userId}`, "GET", null, function(user) {
      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/users", name: "Kullanıcılar" },
        { route: `/users/${req.params.userId}`, name: "Kullanıcı Düzenle" }
      ];
      res.render("users", {
        title: "Kullanıcılar",
        addTitle: "Kullanıcı Ekle",
        editTitle: "Kullanıcı Düzenle",
        users: users,
        edit: true,
        user: user,
        breadcrumb: breadcrumb
      });
    });
  });
});

// User Update
router.post("/users/:userId", function(req, res, next) {
  api.apiCall(
    `/user/${req.params.userId}`,
    "PATCH",
    {
      name: "ADMİNN",
      authorities: [],
      rDate: Date.now()
    },
    function(result) {
      api.apiCall("/user", "GET", null, function(users) {
        let breadcrumb = [
          { route: "/", name: "Anasayfa" },
          { route: "/users", name: "Kullanıcılar" }
        ];
        res.render("users", {
          title: "Kullanıcılar",
          addTitle: "Kullanıcı Ekle",
          users: users,
          breadcrumb: breadcrumb
        });
      });
    }
  );
});

// User Delete
router.get("/users/delete/:userId", function(req, res, next) {
  api.apiCall(`/users/${req.params.userId}`, "DELETE", null, function(result) {
    res.redirect("/users");
  });
});

// Authority Add
router.post("/authorities", function(req, res, next) {
  api.apiCall(
    "/authority",
    "POST",
    {
      name: req.body.authorityName,
      rDate: Date.now()
    },
    function(result) {
      api.apiCall("/authority", "GET", null, function(authorities) {
        let breadcrumb = [
          { route: "/", name: "Anasayfa" },
          { route: "/authorities", name: "Yetkiler" }
        ];
        res.render("authorities", {
          title: "Yetkiler",
          addTitle: "Yetki Ekle",
          authorities: authorities,
          breadcrumb: breadcrumb
        });
      });
    }
  );
});

// Authority List
router.get("/authorities", function(req, res, next) {
  api.apiCall("/authority", "GET", null, function(authorities) {
    let breadcrumb = [
      { route: "/", name: "Anasayfa" },
      { route: "/authorities", name: "Yetkiler" }
    ];
    res.render("authorities", {
      title: "Yetkiler",
      addTitle: "Yetki Ekle",
      authorities: authorities,
      breadcrumb: breadcrumb
    });
  });
});

// Authority GetById
router.get("/authorities/:authorityId", function(req, res, next) {
  api.apiCall("/authority", "GET", null, function(authorities) {
    api.apiCall(`/authority/${req.params.authorityId}`, "GET", null, function(
      authority
    ) {
      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/authorities", name: "Yetkiler" },
        {
          route: `/authorities/${req.params.authorityId}`,
          name: "Yetki Düzenle"
        }
      ];
      res.render("authorities", {
        title: "Yetkiler",
        addTitle: "Yetki Ekle",
        editTitle: "Yetki Düzenle",
        authorities: authorities,
        edit: true,
        authority: authority,
        breadcrumb: breadcrumb
      });
    });
  });
});

// Authority Update
router.post("/authorities/:authorityId", function(req, res, next) {
  api.apiCall(
    `/authority/${req.params.authorityId}`,
    "PATCH",
    {
      name: "ADMİNN",
      authorities: [],
      rDate: Date.now()
    },
    function(result) {
      api.apiCall("/authority", "GET", null, function(authorities) {
        let breadcrumb = [
          { route: "/", name: "Anasayfa" },
          { route: "/authorities", name: "Yetkiler" }
        ];
        res.render("authorities", {
          title: "Yetkiler",
          addTitle: "Yetki Ekle",
          authorities: authorities,
          breadcrumb: breadcrumb
        });
      });
    }
  );
});

// Authority Delete
router.get("/authorities/delete/:authorityId", function(req, res, next) {
  api.apiCall(
    `/authorities/${req.params.authorityId}`,
    "DELETE",
    null,
    function(result) {
      res.redirect("/authorities");
    }
  );
});

// Role Add
router.post("/roles", function(req, res, next) {
  api.apiCall(
    "/role",
    "POST",
    {
      name: req.body.roleName,
      authorities: [],
      rDate: Date.now()
    },
    function(result) {
      api.apiCall("/role", "GET", null, function(roles) {
        let breadcrumb = [
          { route: "/", name: "Anasayfa" },
          { route: "/roles", name: "Roller" }
        ];
        res.render("roles", {
          title: "Roller",
          addTitle: "Rol Ekle",
          roles: roles,
          breadcrumb: breadcrumb
        });
      });
    }
  );
});

// Role List
router.get("/roles", function(req, res, next) {
  api.apiCall("/role", "GET", null, function(roles) {
    let breadcrumb = [
      { route: "/", name: "Anasayfa" },
      { route: "/roles", name: "Roller" }
    ];
    res.render("roles", {
      title: "Roller",
      addTitle: "Rol Ekle",
      roles: roles,
      breadcrumb: breadcrumb
    });
  });
});

// Role GetById
router.get("/roles/:roleId", function(req, res, next) {
  api.apiCall("/role", "GET", null, function(roles) {
    api.apiCall(`/role/${req.params.roleId}`, "GET", null, function(role) {
      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/roles", name: "Roller" },
        { route: `/role/${req.params.roleId}`, name: "Rol Düzenle" }
      ];
      res.render("roles", {
        title: "Roller",
        addTitle: "Rol Ekle",
        editTitle: "Rol Düzenle",
        roles: roles,
        edit: true,
        role: role,
        breadcrumb: breadcrumb
      });
    });
  });
});

// Role Update
router.post("/roles/:roleId", function(req, res, next) {
  api.apiCall(
    `/role/${req.params.roleId}`,
    "PATCH",
    {
      name: "ADMİNN",
      authorities: [],
      rDate: Date.now()
    },
    function(result) {
      api.apiCall("/role", "GET", null, function(roles) {
        let breadcrumb = [
          { route: "/", name: "Anasayfa" },
          { route: "/roles", name: "Roller" }
        ];
        res.render("roles", {
          title: "Roller",
          addTitle: "Rol Ekle",
          roles: roles,
          breadcrumb: breadcrumb
        });
      });
    }
  );
});

// Role Delete
router.get("/roles/delete/:roleId", function(req, res, next) {
  api.apiCall(`/role/${req.params.roleId}`, "DELETE", null, function(result) {
    res.redirect("/roles");
  });
});

// Department Add
router.post("/departments", function(req, res, next) {
  api.apiCall(
    "/department",
    "POST",
    {
      name: req.body.departmentName,
      rDate: Date.now()
    },
    function(result) {
      api.apiCall("/department", "GET", null, function(departments) {
        let breadcrumb = [
          { route: "/", name: "Anasayfa" },
          { route: "/departments", name: "Departmanlar" }
        ];
        res.render("departments", {
          title: "Departmanlar",
          addTitle: "Departman Ekle",
          departments: departments,
          breadcrumb: breadcrumb
        });
      });
    }
  );
});

// Department List
router.get("/departments", function(req, res, next) {
  api.apiCall("/department", "GET", null, function(departments) {
    let breadcrumb = [
      { route: "/", name: "Anasayfa" },
      { route: "/departments", name: "Departmanlar" }
    ];
    res.render("departments", {
      title: "Departmanlar",
      addTitle: "Departman Ekle",
      departments: departments,
      breadcrumb: breadcrumb
    });
  });
});

// Department GetById
router.get("/departments/:departmentId", function(req, res, next) {
  api.apiCall("/department", "GET", null, function(departments) {
    api.apiCall(`/department/${req.params.departmentId}`, "GET", null, function(
      department
    ) {
      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/departments", name: "Departmanlar" },
        { route: `/department/${req.params.roleId}`, name: "Departman Düzenle" }
      ];
      res.render("departments", {
        title: "Departmanlar",
        addTitle: "Departman Ekle",
        editTitle: "Departman Düzenle",
        departments: departments,
        edit: true,
        department: department,
        breadcrumb: breadcrumb
      });
    });
  });
});

// Department Update
router.post("/Department/:departmentId", function(req, res, next) {
  api.apiCall(
    `/department/${req.params.departmentId}`,
    "PATCH",
    {
      name: "ADMİNN",
      authorities: [],
      rDate: Date.now()
    },
    function(result) {
      api.apiCall("/department", "GET", null, function(departments) {
        let breadcrumb = [
          { route: "/", name: "Anasayfa" },
          { route: "/departments", name: "Departmanlar" }
        ];
        res.render("departments", {
          title: "Departmanlar",
          addTitle: "Departman Ekle",
          departments: departments,
          breadcrumb: breadcrumb
        });
      });
    }
  );
});

// Department Delete
router.get("/Department/delete/:departmentId", function(req, res, next) {
  api.apiCall(
    `/department/${req.params.departmentId}`,
    "DELETE",
    null,
    function(result) {
      res.redirect("/Department");
    }
  );
});

// Document Type Add
router.post("/documents/types", function(req, res, next) {
  api.apiCall(
    "/document/type",
    "POST",
    {
      name: req.body.typeName,
      rDate: Date.now()
    },
    function(result) {
      api.apiCall("/document/type", "GET", null, function(documenttypes) {
        let breadcrumb = [
          { route: "/", name: "Anasayfa" },
          { route: "/documents", name: "Dökümanlar" },
          { route: "/documents/types", name: "Döküman Tipleri" }
        ];
        res.render("documenttypes", {
          title: "Döküman Tipleri",
          addTitle: "Döküman Tipi Ekle",
          documenttypes: documenttypes,
          breadcrumb: breadcrumb
        });
      });
    }
  );
});

// Document Type  List
router.get("/documents/types", function(req, res, next) {
  api.apiCall("/document/type", "GET", null, function(documenttypes) {
    let breadcrumb = [
      { route: "/", name: "Anasayfa" },
      { route: "/documents", name: "Dökümanlar" },
      { route: "/documents/types", name: "Döküman Tipleri" }
    ];
    res.render("documenttypes", {
      title: "Döküman Tipleri",
      addTitle: "Döküman Tipi Ekle",
      documenttypes: documenttypes,
      breadcrumb: breadcrumb
    });
  });
});

// Document Type  GetById
router.get("/documents/types/:typeId", function(req, res, next) {
  api.apiCall("/document/type", "GET", null, function(documenttypes) {
    api.apiCall(`/document/type/${req.params.typeId}`, "GET", null, function(
      documenttype
    ) {
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
        documenttypes: documenttypes,
        edit: true,
        documenttype: documenttype,
        breadcrumb: breadcrumb
      });
    });
  });
});

// Document Type  Update
router.post("/documents/types/:typeId", function(req, res, next) {
  api.apiCall(
    `/document/type/${req.params.typeId}`,
    "PATCH",
    {
      name: "ADMİNN",
      rDate: Date.now()
    },
    function(result) {
      api.apiCall("/document/type", "GET", null, function(documenttypes) {
        let breadcrumb = [
          { route: "/", name: "Anasayfa" },
          { route: "/documents", name: "Dökümanlar" },
          { route: "/documents/types", name: "Döküman Tipleri" }
        ];
        res.render("documenttypes", {
          title: "Döküman Tipleri",
          addTitle: "Döküman Tipi Ekle",
          documenttypes: documenttypes,
          breadcrumb: breadcrumb
        });
      });
    }
  );
});

// Document Type  Delete
router.get("/documents/types/delete/:typeId", function(req, res, next) {
  api.apiCall(`/document/type/${req.params.typeId}`, "DELETE", null, function(
    result
  ) {
    res.redirect("/documenttypes");
  });
});

// Document Add
router.post("/documents", function(req, res, next) {
  api.apiCall(
    "/document",
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
    function(result) {
      api.apiCall("/document", "GET", null, function(documents) {
        let breadcrumb = [
          { route: "/", name: "Anasayfa" },
          { route: "/documents", name: "Dökümanlar" }
        ];
        res.render("documents", {
          title: "Dökümanlar",
          addTitle: "Döküman Ekle",
          documents: documents,
          breadcrumb: breadcrumb
        });
      });
    }
  );
});

// Document List
router.get("/documents", function(req, res, next) {
  api.apiCall("/document", "GET", null, function(documents) {
    let breadcrumb = [
      { route: "/", name: "Anasayfa" },
      { route: "/documents", name: "Dökümanlar" }
    ];
    res.render("documents", {
      title: "Dökümanlar",
      addTitle: "Döküman Ekle",
      documents: documents,
      breadcrumb: breadcrumb
    });
  });
});

// Document GetById
router.get("/documents/:documentId", function(req, res, next) {
  api.apiCall("/document", "GET", null, function(documents) {
    api.apiCall(`/document/${req.params.documentId}`, "GET", null, function(
      document
    ) {
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
        documents: documents,
        edit: true,
        document: document,
        breadcrumb: breadcrumb
      });
    });
  });
});

// Document Update
router.post("/documents/:documentId", function(req, res, next) {
  api.apiCall(
    `/document/${req.params.documentId}`,
    "PATCH",
    {
      name: "ADMİNN",
      rDate: Date.now()
    },
    function(result) {
      api.apiCall("/document", "GET", null, function(documents) {
        let breadcrumb = [
          { route: "/", name: "Anasayfa" },
          { route: "/documents", name: "Dökümanlar" }
        ];
        res.render("documents", {
          title: "Dökümanlar",
          addTitle: "Döküman Ekle",
          documents: documents,
          breadcrumb: breadcrumb
        });
      });
    }
  );
});

// Document Delete
router.get("/documents/delete/:documentId", function(req, res, next) {
  api.apiCall(`/document/${req.params.documentId}`, "DELETE", null, function(
    result
  ) {
    res.redirect("/documents");
  });
});

module.exports = router;
