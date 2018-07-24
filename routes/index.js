var express = require("express");
var router = express.Router();
const api = require("../api");
const helper = require("../helpers/index");
const async = require("async");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

// User Add
router.post("/users", (req, res, next) => {
  api.apiCall(
    req.session.token,
    "/user/add",
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
    (result) => {
      api.apiCall(req.session.token, "/user", "GET", null, (users) => {
        let breadcrumb = [
          { route: "/", name: "Anasayfa" },
          { route: "/users", name: "Kullanıcılar" }
        ];
        res.render("users", {
          title: "Kullanıcılar",
          addTitle: "Kullanıcı Ekle",
          users,
          breadcrumb
        });
      });
    }
  );
});

// User List
router.get("/users", (req, res, next) => {
  api.apiCall(req.session.token, "/user", "POST", {
    page: parseInt(req.query.page) || 0,
    limit: parseInt(req.query.limit) || 1
  }, (data) => {
    let breadcrumb = [
      { route: "/", name: "Anasayfa" },
      { route: "/users", name: "Kullanıcılar" }
    ];

    let page = parseInt(req.query.page)|| 0;
    let limit = req.query.limit || 1;
    let total = data.count;

    helper.paging(page, limit, total, "users", (paging) => {
      res.render("users", {
        title: "Kullanıcılar",
        addTitle: "Kullanıcı Ekle",
        data,
        breadcrumb,
        paging,
        route:"users",
        messageType:req.query.messageType,
        message:req.query.message
      });
    })


  });
});

// User GetById
router.get("/users/:userId", (req, res, next) => {
  async.parallel([
    (callback) => {
      api.apiCall(req.session.token, "/user", "POST", {
        page:parseInt(req.query.page)|| 0,
        limit:req.query.limit || 1
      }, (result) => {
        callback(null, result);
      });
    },
    (callback) => {
      api.apiCall(req.session.token, `/user/${req.params.userId}`, "GET", null, (result) => {
        callback(null, result);
      });
    },
    (callback) => {
      api.apiCall(req.session.token, `/role`, "GET", null, (result) => {
        callback(null, result);
      });
    }
  ],
    (err, results) => {
      
      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/users", name: "Kullanıcılar" },
        { route: `/users/${req.params.userId}`, name: "Kullanıcı Düzenle" }
      ];

      let page = parseInt(req.query.page)|| 0;
      let limit = req.query.limit || 1;
      let total = results[0].info && results[0].info[0].count;


    helper.paging(page, limit, total, "users", (paging) => {
      res.render("users", {
        title: "Kullanıcılar",
        addTitle: "Kullanıcı Ekle",
        editTitle: "Kullanıcı Düzenle",
        edit: true,
        data: results[0].data,
        user: results[1],
        roles: results[2],
        breadcrumb,
        paging
      });
    })
    });
});

// User Update
router.post("/users/:userId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/user/${req.params.userId}`,
    "PATCH",
    {
      fName: req.body.fName,
      lName: req.body.lName,
      email: req.body.email,
      username: req.body.email,
      role: req.body.role
    },
    function (result) {
      let opt="";
      if(result.nModified>0)
        opt="?messageType=1&message=İşlem Başarılı";
      res.redirect(`/users${opt}`);
    }
  );
});

// User Delete
router.get("/users/delete/:userId", (req, res, next) => {
  api.apiCall(req.session.token, `/user/${req.params.userId}`, "DELETE", null, (result) => {
    console.log(result)
    res.redirect("/users");
  });
});

// Authority Add
router.post("/authorities", (req, res, next) => {
  api.apiCall(
    req.session.token,
    "/authority",
    "POST",
    {
      name: req.body.authorityName,
      rDate: Date.now()
    },
    function (result) {
      api.apiCall(req.session.token, "/authority", "GET", null, (authorities) => {
        let breadcrumb = [
          { route: "/", name: "Anasayfa" },
          { route: "/authorities", name: "Yetkiler" }
        ];
        res.render("authorities", {
          title: "Yetkiler",
          addTitle: "Yetki Ekle",
          authorities: authorities,
          breadcrumb
        });
      });
    }
  );
});

// Authority List
router.get("/authorities", (req, res, next) => {
  api.apiCall(req.session.token, "/authority", "POST", {
    page: parseInt(req.query.page) || 0,
    limit: parseInt(req.query.limit) || 1
  }, (data) => {
    let breadcrumb = [
      { route: "/", name: "Anasayfa" },
      { route: "/authorities", name: "Yetkiler" }
    ];
    let page = parseInt(req.query.page)|| 0;
    let limit = req.query.limit || 1;
    let total = data.count;

    helper.paging(page, limit, total, "authorities", (paging) => {
      res.render("authorities", {
        title: "Yetkiler",
        addTitle: "Yetki Ekle",
        data,
        breadcrumb,
        paging,
        route:"authorities",
        messageType:req.query.messageType,
        message:req.query.message
      });
    })
  });
});

// Authority GetById
router.get("/authorities/:authorityId", (req, res, next) => {
  api.apiCall(req.session.token, "/authority", "POST", {
    page:parseInt(req.query.page)|| 0,
    limit:req.query.limit || 1
  }, (data) => {
    api.apiCall(req.session.token, `/authority/${req.params.authorityId}`, "GET", null, (
      authority
    ) => {
      let page = parseInt(req.query.page)|| 0;
    let limit = req.query.limit || 1;
    let total = data.count;

    helper.paging(page, limit, total, "authorities", (paging) => {
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
        edit: true,
        data,
        authority,
        breadcrumb,
        paging,
        route:"authorities",
        messageType:req.query.messageType,
        message:req.query.message
      });
    })
      
    });
  });
});

// Authority Update
router.post("/authorities/:authorityId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/authority/${req.params.authorityId}`,
    "PATCH",
    {
      name: req.body.authorityName
    },
    (result) => {
      let opt="";
      if(result.nModified>0)
        opt="?messageType=1&message=İşlem Başarılı";
      res.redirect(`/authorities${opt}`);
    }
  );
});

// Authority Delete
router.get("/authorities/delete/:authorityId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/authorities/${req.params.authorityId}`,
    "DELETE",
    null,
    (result) => {
      res.redirect("/authorities");
    }
  );
});

// Role Add
router.post("/roles", (req, res, next) => {
  api.apiCall(
    req.session.token,
    "/role",
    "POST",
    {
      name: req.body.roleName,
      authorities: [],
      rDate: Date.now()
    },
    (result) => {
      api.apiCall(req.session.token, "/role", "GET", null, (roles) => {
        let breadcrumb = [
          { route: "/", name: "Anasayfa" },
          { route: "/roles", name: "Roller" }
        ];
        res.render("roles", {
          title: "Roller",
          addTitle: "Rol Ekle",
          roles: roles,
          breadcrumb
        });
      });
    }
  );
});

// Role List
router.get("/roles", (req, res, next) => {
  api.apiCall(req.session.token, "/role", "GET", null, (roles) => {
    let breadcrumb = [
      { route: "/", name: "Anasayfa" },
      { route: "/roles", name: "Roller" }
    ];
    res.render("roles", {
      title: "Roller",
      addTitle: "Rol Ekle",
      roles: roles,
      breadcrumb
    });
  });
});

// Role GetById
router.get("/roles/:roleId", (req, res, next) => {
  api.apiCall(req.session.token, "/role", "GET", null, (roles) => {
    api.apiCall(req.session.token, `/role/${req.params.roleId}`, "GET", null, (role) => {
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
        breadcrumb
      });
    });
  });
});

// Role Update
router.post("/roles/:roleId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/role/${req.params.roleId}`,
    "PATCH",
    {
      name: req.body.roleName
    },
    (result) => {
      api.apiCall(req.session.token, "/role", "GET", null, (roles) => {
        let breadcrumb = [
          { route: "/", name: "Anasayfa" },
          { route: "/roles", name: "Roller" }
        ];
        res.render("roles", {
          title: "Roller",
          addTitle: "Rol Ekle",
          roles: roles,
          breadcrumb
        });
      });
    }
  );
});

// Role Delete
router.get("/roles/delete/:roleId", (req, res, next) => {
  api.apiCall(req.session.token, `/role/${req.params.roleId}`, "DELETE", null, (result) => {
    res.redirect("/roles");
  });
});

// Department Add
router.post("/departments", (req, res, next) => {
  api.apiCall(
    req.session.token,
    "/department",
    "POST",
    {
      name: req.body.departmentName,
      rDate: Date.now()
    },
    (result) => {
      api.apiCall(req.session.token, "/department", "GET", null, (departments) => {
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
      });
    }
  );
});

// Department List
router.get("/departments", (req, res, next) => {
  api.apiCall(req.session.token, "/department", "GET", null, (departments) => {
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
  });
});

// Department GetById
router.get("/departments/:departmentId", (req, res, next) => {
  api.apiCall(req.session.token, "/department", "GET", null, (departments) => {
    api.apiCall(req.session.token, `/department/${req.params.departmentId}`, "GET", null, (
      department
    ) => {
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
        breadcrumb
      });
    });
  });
});

// Department Update
router.post("/Departments/:departmentId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/department/${req.params.departmentId}`,
    "PATCH",
    {
      name: req.body.departmentName
    },
    (result) => {
      api.apiCall(req.session.token, "/department", "GET", null, (departments) => {
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
      });
    }
  );
});

// Department Delete
router.get("/Department/delete/:departmentId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/department/${req.params.departmentId}`,
    "DELETE",
    null,
    (result) => {
      res.redirect("/Department");
    }
  );
});

// Document Type Add
router.post("/documents/types", (req, res, next) => {
  api.apiCall(
    req.session.token,
    "/document/type",
    "POST",
    {
      name: req.body.typeName,
      rDate: Date.now()
    },
    (result) => {
      api.apiCall(req.session.token, "/document/type", "GET", null, (documenttypes) => {
        let breadcrumb = [
          { route: "/", name: "Anasayfa" },
          { route: "/documents", name: "Dökümanlar" },
          { route: "/documents/types", name: "Döküman Tipleri" }
        ];
        res.render("documenttypes", {
          title: "Döküman Tipleri",
          addTitle: "Döküman Tipi Ekle",
          documenttypes: documenttypes,
          breadcrumb
        });
      });
    }
  );
});

// Document Type  List
router.get("/documents/types", (req, res, next) => {
  api.apiCall(req.session.token, "/document/type", "GET", null, (documenttypes) => {
    let breadcrumb = [
      { route: "/", name: "Anasayfa" },
      { route: "/documents", name: "Dökümanlar" },
      { route: "/documents/types", name: "Döküman Tipleri" }
    ];
    res.render("documenttypes", {
      title: "Döküman Tipleri",
      addTitle: "Döküman Tipi Ekle",
      documenttypes: documenttypes,
      breadcrumb
    });
  });
});

// Document Type  GetById
router.get("/documents/types/:typeId", (req, res, next) => {
  api.apiCall(req.session.token, "/document/type", "GET", null, (documenttypes) => {
    api.apiCall(req.session.token, `/document/type/${req.params.typeId}`, "GET", null, function (
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
        breadcrumb
      });
    });
  });
});

// Document Type  Update
router.post("/documents/types/:typeId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/document/type/${req.params.typeId}`,
    "PATCH",
    {
      name: req.body.typeName
    },
    (result) => {
      api.apiCall(req.session.token, "/document/type", "GET", null, (documenttypes) => {
        let breadcrumb = [
          { route: "/", name: "Anasayfa" },
          { route: "/documents", name: "Dökümanlar" },
          { route: "/documents/types", name: "Döküman Tipleri" }
        ];
        res.render("documenttypes", {
          title: "Döküman Tipleri",
          addTitle: "Döküman Tipi Ekle",
          documenttypes: documenttypes,
          breadcrumb
        });
      });
    }
  );
});

// Document Type  Delete
router.get("/documents/types/delete/:typeId", (req, res, next) => {
  api.apiCall(req.session.token, `/document/type/${req.params.typeId}`, "DELETE", null, (
    result
  ) => {
    res.redirect("/documenttypes");
  });
});

// Document Add
router.post("/documents", (req, res, next) => {
  api.apiCall(
    req.session.token,
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
    (result) => {
      api.apiCall(req.session.token, "/document", "GET", null, (documents) => {
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
router.get("/documents", (req, res, next) => {
  api.apiCall(req.session.token, "/document", "GET", null, (documents) => {
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
});

// Document GetById
router.get("/documents/:documentId", (req, res, next) => {
  api.apiCall(req.session.token, "/document", "GET", null, (documents) => {
    api.apiCall(req.session.token, `/document/${req.params.documentId}`, "GET", null, (
      document
    ) => {
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
        breadcrumb
      });
    });
  });
});

// Document Update
router.post("/documents/:documentId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/document/${req.params.documentId}`,
    "PATCH",
    {
      name: "ADMİNN",
      rDate: Date.now()
    },
    (result) => {
      api.apiCall(req.session.token, "/document", "GET", null, (documents) => {
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

// Document Delete
router.get("/documents/delete/:documentId", (req, res, next) => {
  api.apiCall(req.session.token, `/document/${req.params.documentId}`, "DELETE", null, (
    result
  ) => {
    res.redirect("/documents");
  });
});

// Card Add
router.post("/cards", (req, res, next) => {
  api.apiCall(
    req.session.token,
    "/card",
    "POST",
    {
      name: req.body.name,
      rDate: Date.now()
    },
    function (result) {
      api.apiCall(req.session.token, "/card", "GET", null, (cards) => {
        let breadcrumb = [
          { route: "/", name: "Anasayfa" },
          { route: "/cards", name: "Dosya Kartları" }
        ];
        res.render("cards", {
          title: "Dosya Kartları",
          addTitle: "Dosya Kartı Ekle",
          cards: cards,
          breadcrumb
        });
      });
    }
  );
});

// Card List
router.get("/cards", (req, res, next) => {
  api.apiCall(req.session.token, "/card", "GET", null, (cards) => {
    let breadcrumb = [
      { route: "/", name: "Anasayfa" },
      { route: "/cards", name: "Dosya Kartları" }
    ];
    res.render("cards", {
      title: "Dosya Kartları",
      addTitle: "Dosya Kartı Ekle",
      cards: cards.messageType == 0 ? [] : cards,
      breadcrumb
    });
  });
});

// Card GetById
router.get("/cards/:cardId", (req, res, next) => {
  api.apiCall(req.session.token, "/card", "GET", null, (cards) => {
    api.apiCall(req.session.token, `/card/${req.params.cardId}`, "GET", null, (
      card
    ) => {
      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/cards", name: "Dosya Kartları" },
        {
          route: `/cards/${req.params.cardId}`,
          name: "Dosya Kartı"
        }
      ];
      res.render("cards", {
        title: "Dosya Kartları",
        addTitle: "Dosya Kartı Ekle",
        editTitle: "Dosya Kartı Düzenle",
        cards: cards,
        edit: true,
        card: card,
        breadcrumb
      });
    });
  });
});

// Card Update
router.post("/cards/:cardId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/card/${req.params.cardId}`,
    "PATCH",
    {
      name: req.body.name
    },
    (result) => {
      api.apiCall(req.session.token, "/card", "GET", null, (cards) => {
        let breadcrumb = [
          { route: "/", name: "Anasayfa" },
          { route: "/cards", name: "Dosya Kartları" }
        ];
        res.render("cards", {
          title: "Dosya Kartları",
          addTitle: "Dosya Kartı Ekle",
          cards: cards,
          breadcrumb
        });
      });
    }
  );
});

// Card Delete
router.get("/cards/delete/:cardId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/cards/${req.params.cardId}`,
    "DELETE",
    null,
    (result) => {
      res.redirect("/cards");
    }
  );
});

// Folder Add
router.post("/folders", (req, res, next) => {
  api.apiCall(
    req.session.token,
    "/folder",
    "POST",
    {
      name: req.body.name,
      description: req.body.description,
      parent: req.body.parent,
      card: req.body.card,
      authSet: null,
      status: 1,
      rDate: Date.now()
    },
    function (result) {
      api.apiCall(req.session.token, "/folder", "GET", null, (folders) => {
        let breadcrumb = [
          { route: "/", name: "Anasayfa" },
          { route: "/folders", name: "Klasörler" }
        ];
        res.render("folders", {
          title: "Klasörler",
          addTitle: "Klasör Ekle",
          folders: folders,
          breadcrumb
        });
      });
    }
  );
});

// Folder List
router.get("/folders", (req, res, next) => {
  api.apiCall(req.session.token, "/folder", "GET", null, (folders) => {
    let breadcrumb = [
      { route: "/", name: "Anasayfa" },
      { route: "/folders", name: "Klasörler" }
    ];
    res.render("folders", {
      title: "Klasörler",
      addTitle: "Klasör Ekle",
      folders: folders.messageType == 0 ? [] : folders,
      breadcrumb
    });
  });
});

// Folder GetById
router.get("/folders/:folderId", (req, res, next) => {
  api.apiCall(req.session.token, "/folder", "GET", null, (folders) => {
    api.apiCall(req.session.token, `/folder/${req.params.folderId}`, "GET", null, (
      folder
    ) => {
      let breadcrumb = [
        { route: "/", name: "Anasayfa" },
        { route: "/folders", name: "Klasörler" },
        {
          route: `/folders/${req.params.folderId}`,
          name: "Klasör"
        }
      ];
      res.render("folders", {
        title: "Klasörler",
        addTitle: "Klasör Ekle",
        editTitle: "Klasör Düzenle",
        folders: folders,
        edit: true,
        folder: folder,
        breadcrumb
      });
    });
  });
});

// Folder Update
router.post("/folders/:folderId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/folder/${req.params.folderId}`,
    "PATCH",
    {
      name: req.body.name,
      description: req.body.description,
      authSet: null,
      card: "5b54e836db7f91048cb5ae2b",
    },
    (result) => {
      api.apiCall(req.session.token, "/folder", "GET", null, (folders) => {
        let breadcrumb = [
          { route: "/", name: "Anasayfa" },
          { route: "/folders", name: "Klasörler" }
        ];
        res.render("folders", {
          title: "Klasörler",
          addTitle: "Klasör Ekle",
          folders: folders,
          breadcrumb
        });
      });
    }
  );
});

// Folder Delete
router.get("/folders/delete/:folderId", (req, res, next) => {
  api.apiCall(
    req.session.token,
    `/folder/${req.params.folderId}`,
    "DELETE",
    null,
    (result) => {
      res.redirect("/folders");
    }
  );
});


module.exports = router;
