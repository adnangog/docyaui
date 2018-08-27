$(function () {
    $('[data-datetimepicker]').datetimepicker({
        format: 'YYYY-MM-DD HH:mm',
    });

    $('#tree2').treed({ openedClass: 'fa-folder-open', closedClass: 'fa-folder' });

    $("[data-menutoggle]").click(function () {
        $(".nav-side-menu, .right-side, .toggle-right, .breadcrumb").toggleClass("gizli");
    });

    $('select.form-control').fastselect({
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