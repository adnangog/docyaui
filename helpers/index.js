module.exports.paging = (page, limit, total, route, cb) => {

  let totalPage = Math.ceil(total / limit);
  let paging = {
    total: total,
    first: (((page+1)*limit)-(limit-1)),
    last: total < ((page+1)*limit) ? total : ((page+1)*limit),
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