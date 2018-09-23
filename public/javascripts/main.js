$(function () {
    $('[data-datetimepicker]').datetimepicker({
        format: 'YYYY-MM-DD HH:mm',
    });

    $('#tree2').treed({ openedClass: 'fa-folder-open', closedClass: 'fa-folder' });

    $("[data-menutoggle]").click(function () {
        $(".nav-side-menu, .right-side, .toggle-right, .breadcrumb").toggleClass("gizli");
    });

    $('select.form-control:not(.notFast)').fastselect({
        placeholder: 'Lütfen seçin',
        searchPlaceholder: 'Arama kriterinizi girin',
        noResultsText: 'Kayıt bulunamadı',
        userOptionPrefix: 'Ekle'
    });

    $('[data-toggle="tooltip"]').tooltip();

});

function showMessageBox(type, title, message) {
    $('#messageBox .modal-content').addClass(type);
    $('#messageBox #myModalLabel').text(title);
    $('#messageBox .modal-body').html(message);
    $('#messageBox').modal('show');
}

jQuery.expr[':'].icontains = function (a, i, m) {
    return replaceTurkish(jQuery(a).text())
        .indexOf(replaceTurkish(m[3])) >= 0;
};

function replaceTurkish(e) {
    var output = e.toUpperCase();
    output = output.replace("Ğ", "G");
    output = output.replace("Ü", "U");
    output = output.replace("Ş", "S");
    output = output.replace("İ", "I");
    output = output.replace("Ö", "O");
    output = output.replace("Ç", "C");
    return output;
}