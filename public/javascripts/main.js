$(function () {
    $('[data-datetimepicker]').datetimepicker({
        format: 'YYYY-MM-DD HH:mm',
    });

    $('#tree2').treed({openedClass:'fa-folder-open', closedClass:'fa-folder'});

    $("[data-menutoggle]").click(function(){
        $(".nav-side-menu, .right-side, .toggle-right, .breadcrumb").toggleClass("gizli");
    });
});