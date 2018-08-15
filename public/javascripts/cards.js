(function ($, w, document, undefined) {
    if (w.Docya == undefined)
        w.Docya = {};

    w.Docya.CardController = {
        DocumentJSON: [],
        InputJSON: [],
        SelectedFolder: null,
        SelectedFolderName: null,
        handleProcess: function (folder, action) {
            $('#myTab a[href="#process"]').tab('show') // Select tab by name
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
                case "documentEdit":
                    $("[data-documentedit]").fadeIn();
                    break;
                case "documentOpen":
                    $("[data-documentadd]").fadeIn();
                    break;
                case "documentSave":
                    $("[data-documentsave]").fadeIn();
                    break;
                case "documentPrint":
                    $("[data-documentprint]").fadeIn();
                    break;
                case "documentDelete":
                    alert("Silme işlemi yapılacak");;
                    break;
                default:
            }
        },
        createDocumentItems: function () {
            $("#DocumentItems").html("");
            Docya.CardController.DocumentJSON.map((x, i) => {
                let htmlBlok = '<div class="form-row">';
                htmlBlok += '<div class="form-group col-md-6">';
                htmlBlok += '<label for="itemFileName' + i + '">Dosya Adı</label>';
                htmlBlok += '<input type="text" class="form-control form-control-sm" id="itemFileName" name="itemFileName" value="' + x.originalname + '" readonly>';
                htmlBlok += '</div>';

                htmlBlok += '<div class="form-group col-md-6">';
                htmlBlok += '<label for="itemName' + i + '">Döküman Adı</label>';
                htmlBlok += '<input type="text" class="form-control form-control-sm" id="itemName' + i + '" name="itemName' + i + '"  data-doc-index="' + i + '"  value="' + x.name + '" placeholder="Döküman adı giriniz" autocomplete="off">';
                htmlBlok += '</div>';
                htmlBlok += '</div>';

                $("#DocumentItems").append(htmlBlok);
            });
        },
        initOptionClick: function () {
            $("body").on("click", "[data-optionitem]", function (e) {
                e.preventDefault();

                var jqElm = $(this);

                let isFolder = jqElm[0].hasAttribute("data-folder");

                Docya.CardController.handleProcess(isFolder, jqElm.attr("data-key"));
            });
        },
        initNameChange: function () {
            $("body").on("blur", "[data-doc-index]", function (e) {

                var jqElm = $(this);
                var index = jqElm.attr("data-doc-index");
                var text = jqElm.val();

                Docya.CardController.DocumentJSON[index].name = text;

                $("#json").val(JSON.stringify(Docya.CardController.DocumentJSON));

            });
        },
        initFormSubmit: function () {
            $("body").on("click", "form button", function (e) {
                e.preventDefault();

                var jqElm = $(this);
                var jqForm = $(this).parents("form");
                var inpCard = $("#card");
                var inpCardTemplate = $("#cardtemplate");
                var isCard = $("<input type='hidden' name='isCard' id='isCard' value='true' />")
                jqForm.attr("action", jqForm.attr("action").replace("documentId", Docya.CardController.SelectedDocument));
                jqForm.attr("action", jqForm.attr("action").replace("folderId", Docya.CardController.SelectedFolder));
                jqForm.append(inpCard);
                jqForm.append(inpCardTemplate);
                jqForm.append(isCard);
                jqForm.submit();
            });
        },
        initTreeClick: function () {
            $("body").on("click", "[data-treeitem]", function (e) {
                e.stopPropagation();
                var jqElm = $(this);
                $("[data-treeitem]").removeClass("selected");
                jqElm.toggleClass('selected');

                let isFolder = jqElm[0].hasAttribute("data-folder");
                $("[data-itemName]").text(jqElm.attr("data-name")).show();

                Docya.CardController.handleProcess(isFolder, null);

                if (isFolder) {
                    Docya.CardController.SelectedFolder = jqElm.attr("data-id");
                    Docya.CardController.SelectedFolderName = jqElm.attr("data-name");
                    $("#foldername").val(jqElm.attr("data-name"));
                    $("[name=folder]").val(jqElm.attr("data-id"));
                } else {
                    Docya.CardController.SelectedDocument = jqElm.attr("data-id");
                    Docya.CardController.SelectedDocumentName = jqElm.attr("data-name");
                    $("#documentname").val(jqElm.attr("data-name"));
                };
            });
        },
        initContextMenu: function () {
            $.contextMenu({
                selector: '.context-menu-one',
                callback: function (key, options) {

                    $("[data-treeitem]").removeClass("selected");
                    $(this).toggleClass('selected');

                    let isFolder = $(this)[0].hasAttribute("data-folder");

                    $("[data-itemName]").text($(this).attr("data-name")).show();

                    Docya.CardController.handleProcess(isFolder, key);

                    if (isFolder) {
                        Docya.CardController.SelectedFolder = $(this).attr("data-id");
                        Docya.CardController.SelectedFolderName = $(this).attr("data-name");
                        $("#foldername").val($(this).attr("data-name"));
                        $("[name=folder]").val($(this).attr("data-id"));
                    } else {
                        Docya.CardController.SelectedDocument = $(this).attr("data-id");
                        Docya.CardController.SelectedDocumentName = $(this).attr("data-name");
                        $("#documentname").val($(this).attr("data-name"));
                    }

                },
                items: {
                    "folderEdit": { name: "Adını Değiştir", icon: "edit" },
                    "folderAdd": { name: "Alt Klasör Ekle", icon: "fas fa-folder-open" },
                    "documentAdd": { name: "Döküman Ekle", icon: "fas fa-file-alt" },
                    "sep1": "---------",
                    "folderDelete": { name: "Sil", icon: "delete" }
                }
            });

            $.contextMenu({
                selector: '.context-menu-one2',
                callback: function (key, options) {

                    $("[data-treeitem]").removeClass("selected");
                    $(this).toggleClass('selected');

                    let isFolder = $(this)[0].hasAttribute("data-folder");

                    $("[data-itemName]").text($(this).attr("data-name")).show();

                    Docya.CardController.handleProcess(isFolder, key);

                    if (isFolder) {
                        Docya.CardController.SelectedFolder = $(this).attr("data-id");
                        Docya.CardController.SelectedFolderName = $(this).attr("data-name");
                        $("#foldername").val($(this).attr("data-name"));
                        $("[name=folder]").val($(this).attr("data-id"));
                    } else {
                        Docya.CardController.SelectedDocument = $(this).attr("data-id");
                        Docya.CardController.SelectedDocumentName = $(this).attr("data-name");
                        $("#documentname").val($(this).attr("data-name"));
                    }

                },
                items: {
                    "documentEdit": { name: "Adını Değiştir", icon: "edit" },
                    "documentOpen": { name: "Aç", icon: "fas fa-folder-open" },
                    "documentSave": { name: "Kaydet", icon: "fas fa-file-alt" },
                    "sep1": "---------",
                    "documentDelete": { name: "Sil", icon: "delete" }
                }
            });
        },
        initDropzone: function () {
            Dropzone.options.uploadWidget = {
                paramName: 'file',
                maxFilesize: 10, // MB
                maxFiles: 5,
                addRemoveLinks: true,
                removedfile: function (file) {
                    var name = file.name;
                    var filename = JSON.parse(file.xhr.response).filename;
                    Docya.CardController.DocumentJSON = Docya.CardController.DocumentJSON.filter(function(a){
                        return a.filename != filename;
                    });
                    Docya.CardController.createDocumentItems();
                    $("#json").val(JSON.stringify(Docya.CardController.DocumentJSON));
                    // $.ajax({
                    //     type: 'POST',
                    //     url: 'delete.html',
                    //     data: "id=" + name,
                    //     dataType: 'html'
                    // });
                    var _ref;
                    return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
                },
                dictRemoveFile: "Vazgeç",
                dictDefaultMessage: 'Eklemek istediğiniz belgeleri buraya sürekleyip bırakın ya da bu alana tıklayarak seçin.',
                init: function () {
                    this.on('success', function (file, resp) {
                        Docya.CardController.DocumentJSON.push({
                            filename: resp.filename,
                            originalname: resp.originalname,
                            name: resp.originalname,
                            size: resp.size,
                            mimetype: resp.mimetype
                        });
                        Docya.CardController.createDocumentItems();
                        $("#json").val(JSON.stringify(Docya.CardController.DocumentJSON));
                    });
                    this.on('thumbnail', function (file) {
                    });
                }
            };
        },
        initElements: function () {
            this.initDropzone();
            this.initContextMenu();
            this.initOptionClick();
            this.initTreeClick();
            this.initNameChange();
            this.initFormSubmit();
        },
        init: function () {
            this.initElements();
        }

    }

    $(document).ready(function () {
        w.Docya.CardController.init();
    });

})(jQuery, window, document);