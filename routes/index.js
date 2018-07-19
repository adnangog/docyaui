var express = require('express');
var router = express.Router();
const api = require('../api');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/useradd', function (req, res, next) {
  res.render('useradd', { title: 'Kullanici Ekle' });
});

router.get('/userlist', function (req, res, next) {
  res.render('userlist', { title: 'Express' });
});

router.post('/authorities', function (req, res, next) {
  api.apiCall("/authority", "POST", {
    "name": req.body.authorityName,
    "rDate": Date.now()
  }, function (result) {
    console.log(result);
    api.apiCall("/authority", "GET", null, function (result) {
      console.log(result);
      res.render('authorities', { title: 'Yetkiler', addTitle: 'Yetki Ekle', authorities: result });
    });
  });
});

router.get('/authorities', function (req, res, next) {
  api.apiCall("/authority", "GET", null, function (result) {
    console.log(result);
    res.render('authorities', { title: 'Yetkiler', addTitle: 'Yetki Ekle', authorities: result });
  });
});

router.post('/roles', function (req, res, next) {
  api.apiCall("/role", "POST", {
    "name": req.body.roleName,
    "authorities": [],
    "rDate": Date.now()
  }, function (result) {
    console.log(result);
    api.apiCall("/role", "GET", null, function (result) {
      console.log(result);
      res.render('roles', { title: 'Roller', addTitle: 'Rol Ekle', roles: result });
    });
  });
});

router.get('/roles', function (req, res, next) {
  api.apiCall("/role", "GET", null, function (result) {
    console.log(result);
    res.render('roles', { title: 'Roller', addTitle: 'Rol Ekle', roles: result });
  });
});

router.post('/departments', function (req, res, next) {
  api.apiCall("/department", "POST", {
    "name": req.body.roleName,
    "authorities": [],
    "rDate": Date.now()
  }, function (result) {
    console.log(result);
    api.apiCall("/department", "GET", null, function (result) {
      console.log(result);
      res.render('departments', { title: 'Departmanlar', addTitle: 'Departman Ekle', departments: result });
    });
  });
});

router.get('/departments', function (req, res, next) {
  api.apiCall("/department", "GET", null, function (result) {
    console.log(result);
    res.render('departments', { title: 'Departmanlar', addTitle: 'Departman Ekle', departments: result });
  });
});

module.exports = router;
