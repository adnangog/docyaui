module.exports = (req, res, next) => {
    // grab reference of render
    var _render = res.render;
    // override logic
    res.render = function (view, options, fn) {
        // do some custom logic
        if (typeof options == 'object') options.menucards = [
            { "Id": "123", "name": "Dava Dosyaları" }, 
            { "Id": "123", "name": "Firma Bilgileri" }, 
            { "Id": "123", "name": "Fiziksel Arşiv Takip" }, 
            { "Id": "123", "name": "Kalite Kontrol Formu" }, 
            { "Id": "123", "name": "Müşteri Sözleşmeleri" }, 
            { "Id": "123", "name": "Müşteri Teklifleri" }
        ];
        // continue with original render
        _render.call(this, view, options, fn);
    }
    next();
};