module.exports.paging = (page, limit, total, route, cb) => {

    let totalPage = Math.ceil(total / limit);
    let paging = [{
      label: "Önceki",
      url:page === 0 ? "#" : `/${route}?page=${page-1}`, 
      isDisabled:page === 0 ? true : false
    }];

    for (i = 0; i < totalPage; i++) {
      paging.push({
        label: i+1,
        url:`/${route}?page=${i}`,
        isDisabled:page === i ? true : false
      });
    }
    paging.push({
      label: "Sonraki",
      url:page < (total - 1) ? `/${route}?page=${page+1}` : "#", 
      isDisabled:page < (total - 1) ? false : true
    });

    cb(totalPage > 1 ? paging : null);
};