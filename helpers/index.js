const fs = require('fs');
const nodemailer = require('nodemailer');

module.exports.paging = (page, limit, total, route, cb) => {

  let totalPage = Math.ceil(total / limit);
  let paging = {
    total: total,
    first: (((page + 1) * limit) - (limit - 1)),
    last: total < ((page + 1) * limit) ? total : ((page + 1) * limit),
    items: [totalPage > 1 ? {
      label: "Önceki",
      url: page === 0 ? "#" : `/${route}?page=${page - 1}`,
      isDisabled: page === 0 ? true : false
    } : null]
  }

  for (i = 0; i < totalPage; i++) {
    paging.items.push({
      label: i + 1,
      url: `/${route}?page=${i}`,
      isDisabled: page === i ? true : false
    });
  }
  paging.items.push({
    label: "Sonraki",
    url: page < (total - 1) ? `/${route}?page=${page + 1}` : "#",
    isDisabled: page < (total - 1) ? false : true
  });

  cb(paging);
};

module.exports.slugify = (text) => {
  var trMap = {
    'çÇ': 'c',
    'ğĞ': 'g',
    'şŞ': 's',
    'üÜ': 'u',
    'ıİ': 'i',
    'öÖ': 'o'
  };
  for (var key in trMap) {
    text = text.replace(new RegExp('[' + key + ']', 'g'), trMap[key]);
  }
  return text.replace(/[^-a-zA-Z0-9\s]+/ig, '')
    .replace(/\s/gi, "_")
    .replace(/[_]+/gi, "_")
    .toLowerCase();

}

module.exports.cHeaderText = (text) => {
  var texts = text.split("_");

  for (var text in texts) {
    text = text.substring(0, 1) + text.substring(1, text.lentg);
  }
  return texts.join(" ");

}

module.exports.isAuth = (authsetitems, auth) => {
  var auths = [];
  authsetitems && authsetitems.map((x, i) => {
    x.authorities && x.authorities.map((a, k) => {
      if (auths.indexOf(a) === -1) {
        auths.push(a);
      }
    });
  });

  return auths.indexOf(auth) > -1;
}

module.exports.getUnique = (array) => {
  return array.filter(onlyUnique);
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

module.exports.auths = {
  cardView: 1,
  cardEdit: 2,
  cardDelete: 3,
  docHistory: 4,
  docSendEmail: 5,
  docSend: 6,
  docWatch: 7,
  docOpen: 8,
  docRename: 9,
  docCheckOut: 10,
  docAuth: 11,
  docNote: 12,
  docSave: 13,
  docPrint: 14,
  docVersion: 15,
  folderCreate: 16,
  folderDelete: 17,
  docCreate: 18,
  docDelete: 19,
  folderView: 20,
  docView: 21,
  folderRename: 22,
  docNoteView: 23
  //...
}

module.exports.deleteFile = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
}

module.exports.moveFile = (oldPath, newPath, callback) => {

  fs.rename(oldPath, newPath, function (err) {
    if (err) {
      if (err.code === 'EXDEV') {
        copy();
      } else {
        callback(err);
      }
      return;
    }
    callback();
  });

  function copy() {
    var readStream = fs.createReadStream(oldPath);
    var writeStream = fs.createWriteStream(newPath);

    readStream.on('error', callback);
    writeStream.on('error', callback);

    readStream.on('close', function () {
      fs.unlink(oldPath, callback);
    });

    readStream.pipe(writeStream);
  }
}

module.exports.sendMail = (from, to, subject, html, attachments) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'docyaapp@gmail.com',
      pass: '00002162'
    }
  });

  let bilgiler = {
    from: from,
    to: to,
    subject: subject,
    html: html,
    attachments: attachments.map(x => {
      return {
        filename: x.filename,
        content: fs.createReadStream('./uploads/documents/' + x.file)
      }
    })
  };

  transporter.sendMail(bilgiler, function (error, info) {

    if (error) throw error;

    console.log('Eposta gönderildi ' + info.response);

  });

}