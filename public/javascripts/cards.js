(function ($, w, document, undefined) {
    if (w.Docya == undefined)
        w.Docya = {};

    w.Docya.CardController = {
        DocumentJSON: [],
        InputJSON: [],
        CardId: $("#card").val(),
        CardTemplateId: $("#cardtemplate").val(),
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
                    let data = {
                        process: "deleteFolder",
                        folder: Docya.CardController.SelectedFolder
                    };

                    let cb = function (data) {
                        if (data.messageType === 1) {
                            Docya.CardController.getTree();
                        } else {
                            alert(data.message);
                        }
                    };

                    Docya.CardController.initAjax(data, cb);
                    break;
                case "documentEdit":
                    $("[data-documentedit]").fadeIn();
                    break;
                case "documentOpen":
                    document.location.href = "/documents/view/" + $(".document-image").attr("data-f");
                    break;
                case "documentSave":
                    document.location.href = "/documents/download/" + $(".document-image").attr("data-f");
                    break;
                case "documentPrint":
                    $("[data-documentprint]").fadeIn();
                    break;
                case "documentDelete":

                    let data = {
                        process: "deleteDocument",
                        document: Docya.CardController.SelectedDocument
                    };

                    let cb = function (data) {
                        if (data.messageType === 1) {
                            Docya.CardController.getTree();
                        } else {
                            alert(data.message);
                        }
                    };

                    Docya.CardController.initAjax(data, cb);
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
            $("body").on("click", ".cardForms form button", function (e) {
                e.preventDefault();

                var jqElm = $(this);
                var jqForm = $(this).parents("form");

                let process = "";

                let data = {
                    card: Docya.CardController.CardId,
                    cardtemplate: Docya.CardController.CardTemplateId,
                    isCard: true
                };

                let cb = function () { };

                let errors = [];

                switch (jqForm.attr("action")) {
                    case '/documents/documentId':
                        data.process = "renameDocument";
                        data.document = Docya.CardController.SelectedDocument;
                        data.documentname = $("#documentname").val();

                        if (data.document === "") {
                            errors.push('Lütfen döküman seçiniz.');
                        }

                        if (data.documentname === "") {
                            errors.push('Lütfen döküman adı giriniz.');
                            $("#documentname").css({ "border": "1px solid #f00" });
                            $("#documentname").after('<div class="invalid-feedback">Lütfen döküman adı giriniz.</div>');
                        } else {
                            $("#documentname").css({ "border": "1px solid #ced4da" });
                            $("#documentname").next().remove();
                        }

                        cb = function (data) {
                            $("#documentname").val("");
                            Docya.CardController.getTree();
                        };
                        break;

                    case '/folders/folderId':
                        data.process = "renameFolder";
                        data.folder = Docya.CardController.SelectedFolder;
                        data.foldername = $("#foldername").val();

                        if (data.folder === "") {
                            errors.push('Lütfen klasör seçiniz.');
                        }

                        if (data.foldername === "") {
                            errors.push('Lütfen klasör adı giriniz.');
                            $("#foldername").css({ "border": "1px solid #f00" });
                            $("#foldername").after('<div class="invalid-feedback">Lütfen klasör adı giriniz.</div>');
                        } else {
                            $("#foldername").css({ "border": "1px solid #ced4da" });
                            $("#foldername").next().remove();
                        }

                        cb = function (data) {
                            $("#foldername").val("");
                            Docya.CardController.getTree();
                        };
                        break;

                    case '/notes':
                        data.process = "addNote";
                        data.note = $("#note").val();
                        data.document = Docya.CardController.SelectedDocument;
                        data.folder = Docya.CardController.SelectedFolder;

                        if (data.folder === "") {
                            errors.push('Lütfen klasör seçiniz.');
                        }

                        if (data.note === "") {
                            errors.push('Lütfen notunuzu giriniz.');
                            $("#note").css({ "border": "1px solid #f00" });
                            $("#note").after('<div class="invalid-feedback">Lütfen notunuzu giriniz.</div>');
                        } else {
                            $("#note").css({ "border": "1px solid #ced4da" });
                            $("#note").next().remove();
                        }

                        cb = function (data) {
                            $("#note").val("");
                            Docya.CardController.getNotes();
                        };
                        break;

                    case '/folders':
                        data.process = "addFolder";
                        data.foldername = $("#foldernameAdd").val();
                        data.folder = Docya.CardController.SelectedFolder;

                        if (data.folder === "") {
                            errors.push('Lütfen klasör seçiniz.');
                        }

                        if (data.foldername === "") {
                            errors.push('Lütfen klasör adı giriniz.');
                            $("#foldernameAdd").css({ "border": "1px solid #f00" });
                            $("#foldernameAdd").after('<div class="invalid-feedback">Lütfen klasör adı giriniz.</div>');
                        } else {
                            $("#foldernameAdd").css({ "border": "1px solid #ced4da" });
                            $("#foldernameAdd").next().remove();
                        }

                        cb = function (data) {
                            $("#foldernameAdd").val("");
                            Docya.CardController.getTree();
                        };
                        break;

                    case '/documents':
                        data.process = "addDocument";
                        data.folder = Docya.CardController.SelectedFolder;
                        data.json = JSON.stringify(Docya.CardController.DocumentJSON);

                        if (data.folder === "") {
                            errors.push('Lütfen klasör seçiniz.');
                        }

                        if (data.json === []) {
                            errors.push('Lütfen yuklemek icin dokuman secin.');
                        }

                        cb = function (data) {
                            Docya.CardController.DocumentJSON = [];
                            Docya.CardController.getTree();
                        };
                        break;
                }

                if (errors.length > 0) {
                    alert(errors.join("<br/>"));
                    return false;
                }

                Docya.CardController.initAjax(data, cb);

            });
        },
        initTableRowClick: function () {
            $("body").on("click", "[data-cardtr]", function (e) {
                var jqElm = $(this);
                var card = jqElm.attr("data-card");
                var cardtemplate = jqElm.attr("data-cardtemplate");
                document.location.href = "/cards/" + cardtemplate + "/" + card;

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
                    $("[data-documentdetail]").fadeIn();

                    Docya.CardController.SelectedDocument = jqElm.attr("data-id");
                    Docya.CardController.SelectedDocumentName = jqElm.attr("data-name");
                    $("#documentname").val(jqElm.attr("data-name"));
                    $("[name=document]").val(jqElm.attr("data-id"));

                    Docya.CardController.SelectedFolder = jqElm.parent().attr("data-parent");
                    $("[name=folder]").val(Docya.CardController.SelectedFolder);

                    $(".document-title").text(jqElm.attr("data-name"));
                    $(".document-image").attr("data-f", jqElm.attr("data-f")).html("<img class='img-fluid img-thumbnail' src='/documents/view/" + jqElm.attr("data-f") + "?height=50' />");
                };

                Docya.CardController.getNotes();
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
                    $(".document-title").text($(this).attr("data-name"));

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
                        $("[name=document]").val($(this).attr("data-id"));

                        Docya.CardController.SelectedFolder = $(this).parent().attr("data-parent");
                        $("[name=folder]").val(Docya.CardController.SelectedFolder);
                    }

                    Docya.CardController.getNotes();

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
                    $(".document-title").text($(this).attr("data-name"));

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
                        $("[name=document]").val($(this).attr("data-id"));

                        Docya.CardController.SelectedFolder = $(this).parent().attr("data-parent");
                        $("[name=folder]").val(Docya.CardController.SelectedFolder);
                    }

                    Docya.CardController.getNotes();

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
                    Docya.CardController.DocumentJSON = Docya.CardController.DocumentJSON.filter(function (a) {
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
        getNotes: function () {
            $("#note-container").html("");

            let data = {
                process: "getNote",
                document: Docya.CardController.SelectedDocument,
                folder: Docya.CardController.SelectedFolder
            };

            let cb = function (data) {
                var template = '{{# each data.data}}<div class="chat-box"><div class="chat-avatar"><i class="fas fa-user-tie"></i></div><div class="chat-text">{{this.[1]}}</div><div class="chat-info">{{this.[2]}} - {{this.[3]}}</div></div>{{/each}}';
                var renderedHtml = Handlebars.compile(template)(data);
                $("#note-container").append(renderedHtml);
            };

            Docya.CardController.initAjax(data, cb);
        },
        getTree: function () {
            $("#tree2").html("");

            let data = {
                process: "getTree",
                card: Docya.CardController.CardId
            };

            Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
                switch (operator) {
                    case '==':
                        return (v1 == v2) ? options.fn(this) : options.inverse(this);
                    case '===':
                        return (v1 === v2) ? options.fn(this) : options.inverse(this);
                    case '!=':
                        return (v1 != v2) ? options.fn(this) : options.inverse(this);
                    case '!==':
                        return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                    case '<':
                        return (v1 < v2) ? options.fn(this) : options.inverse(this);
                    case '<=':
                        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                    case '>':
                        return (v1 > v2) ? options.fn(this) : options.inverse(this);
                    case '>=':
                        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                    case '&&':
                        return (v1 && v2) ? options.fn(this) : options.inverse(this);
                    case '||':
                        return (v1 || v2) ? options.fn(this) : options.inverse(this);
                    default:
                        return options.inverse(this);
                }
            });

            Handlebars.registerHelper("log", function (something) {
                console.log(something);
            });

            let cb = function (data) {
                var partial = '{{#if this}}<li data-treeitem {{#ifCond this.type "===" "folder"}}data-folder{{/ifCond}} class="context-menu-one" data-name="{{this.name}}" data-id={{this.id}}>{{this.name}}\
                    {{#ifCond this.childs "||" this.documents}}\
                    <ul data-parent={{this.id}}>\
                    {{#each this.childs}}\
                    {{> tree this}}\
                    {{/each}}\
                    {{#each this.documents}}\
                    <li data-treeitem data-document class="context-menu-one2" data-name="{{this.name}}" data-f="{{this.file}}" data-id={{this.id}}>{{this.name}}</li>\
                    {{/each}}\
                    </ul>\
                    {{/ifCond}}\
                </li>{{/if}}';
                var template = "{{> tree this }}";
                Handlebars.registerPartial("tree", partial);
                var renderedHtml = Handlebars.compile(template)(data.data.folders[0]);
                $("#tree2").append(renderedHtml);
                $('#tree2').treed({ openedClass: 'fa-folder-open', closedClass: 'fa-folder' });
                Docya.CardController.initContextMenu();
            };

            Docya.CardController.initAjax(data, cb);
        },
        initAjax: function (data, cb) {
            console.log(data);
            $.ajax({
                dataType: "json",
                url: '/ajax',
                type: 'post',
                data: data,
                success: cb
            });
        },
        initElements: function () {
            this.initDropzone();
            this.initContextMenu();
            this.initOptionClick();
            this.initTreeClick();
            this.initNameChange();
            this.initFormSubmit();
            this.initTableRowClick();
        },
        init: function () {
            this.initElements();
        }

    }

    $(document).ready(function () {
        w.Docya.CardController.init();
    });

})(jQuery, window, document);