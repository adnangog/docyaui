$(function () {
    $('[data-datetimepicker]').datetimepicker({
        format: 'YYYY-MM-DD HH:mm',
    });

    $('#tree2').treed({openedClass:'fa-folder-open', closedClass:'fa-folder'});

    $("[data-menutoggle]").click(function(){
        $(".nav-side-menu, .right-side, .toggle-right, .breadcrumb").toggleClass("gizli");
    });

    $.contextMenu({
        selector: '.context-menu-one', 
        callback: function(key, options) {
            var m = "clicked: " + key;
            window.console && console.log(m) || alert(m); 
        },
        items: {
            "edit": {name: "Edit", icon: "edit"},
            "cut": {name: "Cut", icon: "cut"},
           copy: {name: "Copy", icon: "copy"},
            "paste": {name: "Paste", icon: "paste"},
            "delete": {name: "Delete", icon: "delete"},
            "sep1": "---------",
            "quit": {name: "Quit", icon: function(){
                return 'context-menu-icon context-menu-icon-quit';
            }}
        }
    });

    $('.context-menu-one').on('click', function(e){
        console.log('clicked', this);
    })
    
});

Dropzone.options.uploadWidget = {
    paramName: 'file',
    maxFilesize: 2, // MB
    maxFiles: 1,
    dictDefaultMessage: 'Eklemek istediğiniz belgeleri buraya sürekleyip bırakın ya da bu alana tıklayarak seçin.',
    init: function() {
      this.on('success', function( file, resp ){
        $("#filename").val(file.upload.filename);
      });
      this.on('thumbnail', function(file) {
      });
    }
  };