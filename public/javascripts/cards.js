(function ($, w, document, undefined) {
    if (w.Docya == undefined)
        w.Docya = {};

    w.Docya.CardController = {
        DocumentJSON: null,
        InputJSON: [],
        SelectedFolder: null,
        SelectedFolderName: null,
        handleProcess: function (folder, action) {
            $(".process-box").hide();
            if (folder) {
                $("[data-folderoptions]").fadeIn();
            } else {
                $("[data-documentoptions]").fadeIn();
            }

            switch (action) {
                case "folderEdit":
                    $("[data-folderedit]").fadeIn();
                    break;
                case "folderAdd":
                    $("[data-foldersection]").fadeIn();
                    break;
                case "documentAdd":
                    $("[data-documentsection]").fadeIn();
                    break;
                case "folderDelete":
                    alert("Silme işlemi yapılacak");;
                    break;
                default:
            }
        },
        initTreeClick: function () {
            $("body").on("click", "[data-treeitem]", function (e) {
                var jqElm = $(this);
                e.stopPropagation();
                $("[data-treeitem]").removeClass("selected");
                jqElm.toggleClass('selected');

                let isFolder = !$(this).attr("data-folder");
                $("[data-itemName]").text(jqElm.attr("data-name")).show();

                Docya.CardController.handleProcess(isFolder, null);

                if (isFolder) {
                    Docya.CardController.SelectedFolder = jqElm.attr("data-id");
                    Docya.CardController.SelectedFolderName = jqElm.attr("data-name");
                } else {
                    Docya.CardController.SelectedDocument = jqElm.attr("data-id");
                    Docya.CardController.SelectedDocumentName = jqElm.attr("data-name");
                };
            });
        },
        initContextMenu: function () {
            $.contextMenu({
                selector: '.context-menu-one',
                callback: function (key, options) {

                    $("[data-treeitem]").removeClass("selected");
                    $(this).toggleClass('selected');

                    let isFolder = !$(this).attr("data-folder");

                    $("[data-itemName]").text($(this).attr("data-name")).show();

                    Docya.CardController.handleProcess(isFolder, key);

                    if (isFolder) {
                        Docya.CardController.SelectedFolder = $(this).attr("data-id");
                        Docya.CardController.SelectedFolderName = $(this).attr("data-name");
                    } else {
                        Docya.CardController.SelectedDocument = $(this).attr("data-id");
                        Docya.CardController.SelectedDocumentName = $(this).attr("data-name");
                    }

                },
                items: {
                    "folderEdit": { name: "Adını Değiştir", icon: "edit"},
                    "folderAdd": { name: "Alt Klasör Ekle", icon: "fas fa-folder-open" },
                    "documentAdd": { name: "Döküman Ekle", icon: "fas fa-file-alt" },
                    "sep1": "---------",
                    "folderDelete": { name: "Sil", icon: "delete" }
                }
            });
        },
        initDropzone: function(){
            Dropzone.options.uploadWidget = {
                paramName: 'file',
                maxFilesize: 2, // MB
                maxFiles: 1,
                dictDefaultMessage: 'Eklemek istediğiniz belgeleri buraya sürekleyip bırakın ya da bu alana tıklayarak seçin.',
                init: function () {
                    this.on('success', function (file, resp) {
                        $("#filename").val(file.upload.filename);
                    });
                    this.on('thumbnail', function (file) {
                    });
                }
            };
        },
        initElements: function () {
            this.initDropzone();
            this.initContextMenu();
            this.initTreeClick();
        },
        init: function () {
            this.initElements();
        }

    }

    $(document).ready(function () {
        w.Docya.CardController.init();
    });

})(jQuery, window, document);