$(function () {
    $('[data-datetimepicker]').datetimepicker({
        format: 'YYYY-MM-DD HH:mm',
    });

    $('#tree2').treed({openedClass:'fa-folder-open', closedClass:'fa-folder'});
});