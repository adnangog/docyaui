(function ($, w, document, undefined) {
    if (w.Docya == undefined)
        w.Docya = {};

    w.Docya.CardController = {
        DocumentJSON: [],
        InputJSON: [],
        AuthSets: [],
        FormFields: JSON.parse($("#formFields").val()).map((x) => {
            return {
                name: x.label,
                field: slugify(x.label),
                type: x.type || "string"
            }
        }),
        SearchRules: {
            string: [
                {
                    name: "Esittir",
                    rule: "equal"
                },
                {
                    name: "Esit Degildir",
                    rule: "notequal"
                },
                {
                    name: "Benzer",
                    rule: "like"
                },
                {
                    name: "Benzemez",
                    rule: "notlike"
                }
            ],
            date: [
                {
                    name: "Esittir",
                    rule: "equal"
                },
                {
                    name: "Esit Degildir",
                    rule: "notequal"
                },
                {
                    name: "Kucuktur",
                    rule: "less"
                },
                {
                    name: "Buyuktur",
                    rule: "greater"
                },
                {
                    name: "Arasinda",
                    rule: "between"
                }
            ],
            number: [
                {
                    name: "Esittir",
                    rule: "equal"
                },
                {
                    name: "Esit Degildir",
                    rule: "notequal"
                },
                {
                    name: "Kucuktur",
                    rule: "less"
                },
                {
                    name: "Buyuktur",
                    rule: "greater"
                },
                {
                    name: "Arasinda",
                    rule: "between"
                }
            ]
        },
        SearchJSON: [
            {
                rule: "or",
                items: [
                    {
                        type: "string",
                        field: "ad_soyad",
                        rule: "equal",
                        value: "adnan gog"
                    },
                    {
                        type: "date",
                        field: "dogum_tarihi",
                        rule: "greater",
                        value: "2018-08-24"
                    }
                ]
            },
            {
                rule: "or",
                items: [
                    {
                        type: "string",
                        field: "ad_soyad",
                        rule: "equal",
                        value: "adnan gog"
                    },
                    {
                        type: "date",
                        field: "dogum_tarihi",
                        rule: "greater",
                        value: "2018-08-24"
                    }
                ]
            }
        ],
        CardId: $("#card").val(),
        CardTemplateId: $("#cardtemplate").val(),
        SelectedFolder: null,
        SelectedFolderName: null,
        Auths: {
            cardView: 1,
            cardEdit: 2,
            cardDelete: 3,
            docHistory: 4,
            docSendEmail: 5,
            docSend: 6,
            docWatch: 7,
            docOpen: 8,
            docRename: 9,
            docCheckOut: 10,
            docAuth: 11,
            docNote: 12,
            docSave: 13,
            docPrint: 14,
            docVersion: 15,
            folderCreate: 16,
            folderDelete: 17,
            docCreate: 18,
            docDelete: 19,
            folderView: 20,
            docView: 21,
            folderRename: 22,
            docNoteView: 23
            //...
        },
        Email: {
            From: "Adnan GÖG <adnangog@gmail.com>",
            To: null,
            Cc: null,
            Subject: null,
            Message: null,
            Attachments: []
        },
        checkAuth: function (auths, auth) {
            return auths.indexOf(auth) > -1;
        },
        handleProcess: function (folder, action) {
            // $('#myTab a[href="#process"]').tab('show') // Select tab by name
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
                    var data = {
                        process: "deleteFolder",
                        folder: Docya.CardController.SelectedFolder
                    };

                    var cb = function (data) {
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

                    var data = {
                        process: "deleteDocument",
                        document: Docya.CardController.SelectedDocument
                    };

                    var cb = function (data) {
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
        createSearchForm: function () {
            var screen = $("#dvSearchFields");
            screen.html("");
            Docya.CardController.SearchJSON.map((s) => {
                var html_ = '<div class="search-box"><div class="row"><div class="col">{<button class="btn btn-warning btn-sm" style="margin-left:5px;" data-search-add><i class="fas fa-plus-circle"></i> Yeni Koşul Ekle</button></div></div>';
                s.items.map((item) => {
                    html_ += '<div class="row"><div class="col" style="width:40px; flex-grow:inherit;"><button class="btn btn-danger btn-sm2" data-search-remove><i class="fas fa-minus-circle"></i></button></div>';
                    html_ += '<div class="col">';
                    html_ += '<select class="form-control form-control-sm" data-search-field>';
                    Docya.CardController.FormFields.map((a) => {
                        if (item.field === a.field) {
                            html_ += '<option selected="selected" value="' + a.field + '||' + a.type + '">' + a.name + '</option>';
                        } else {
                            html_ += '<option value="' + a.field + '||' + a.type + '">' + a.name + '</option>';
                        }
                    });
                    html_ += '</select>';
                    html_ += '</div><div class="col">';
                    html_ += '<select class="form-control form-control-sm notFast" data-search-operator>';

                    var obj_ = Docya.CardController.SearchRules.string;
                    switch (item.type) {
                        case "date":
                            obj_ = Docya.CardController.SearchRules.date;
                            break;
                        case "number":
                            obj_ = Docya.CardController.SearchRules.number;
                            break;

                        default:
                            obj_ = Docya.CardController.SearchRules.string;
                            break;
                    }

                    obj_.map((a) => {
                        if (item.rule === a.rule) {
                            html_ += '<option selected="selected" value="' + a.rule + '">' + a.name + '</option>';
                        } else {
                            html_ += '<option value="' + a.rule + '">' + a.name + '</option>';
                        }
                    });
                    html_ += '</select>';
                    html_ += '</div><div class="col">';
                    html_ += '<input type="text" class="form-control form-control-sm" value="' + item.value + '" data-search-value>';
                    html_ += '</div><div class="col"></div></div>';
                });
                html_ += '<div class="row"><div class="col-lg-2">}';
                html_ += '<select class="form-control form-control-sm notFast" style="display:inline-block" data-search-operator>';
                html_ += '<option val="or">Veya</option>';
                html_ += '<option val="and">Ve</option>';
                html_ += '</select>';
                html_ += '</div></div></div>';

                screen.append(html_);
            });
        },
        createDocumentItems: function () {
            $("#DocumentItems").html("");
            Docya.CardController.DocumentJSON.map((x, i) => {
                let htmlBlok = '<hr/>';
                htmlBlok += '<div class="form-row">';
                htmlBlok += '<div class="form-group col-md-6">';
                htmlBlok += '<label for="itemFileName' + i + '">Dosya Adı</label>';
                htmlBlok += '<input type="text" class="form-control form-control-sm" id="itemFileName" name="itemFileName" value="' + x.originalname + '" readonly>';
                htmlBlok += '</div>';

                htmlBlok += '<div class="form-group col-md-6">';
                htmlBlok += '<label for="itemName' + i + '">Döküman Adı</label>';
                htmlBlok += '<input type="text" class="form-control form-control-sm" id="itemName' + i + '" name="itemName' + i + '" data-doc-itemname  data-doc-index="' + i + '"  value="' + x.name + '" placeholder="Döküman adı giriniz" autocomplete="off">';
                htmlBlok += '</div>';
                htmlBlok += '</div>';

                htmlBlok += '<div class="form-row">';
                htmlBlok += '<label for="authSet' + i + '">Yetki Seti</label>';
                htmlBlok += '<select data-doc-authSet data-doc-index="' + i + '" id="authSet' + i + '" class="form-control form-control-sm">Yetki Seti';
                Docya.CardController.AuthSets.map(x => {
                    htmlBlok += '<option value="' + x[0] + '">' + x[1] + '</option>';
                });
                htmlBlok += '</select>';
                htmlBlok += '</div>';

                $("#DocumentItems").append(htmlBlok);
            });

            $('#DocumentItems select.form-control').fastselect({
                placeholder: 'Lütfen seçin',
                searchPlaceholder: 'Arama kriterinizi girin',
                noResultsText: 'Kayıt bulunamadı',
                userOptionPrefix: 'Ekle'
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
            $("body").on("blur", "[data-doc-itemname]", function (e) {

                var jqElm = $(this);
                var index = jqElm.attr("data-doc-index");
                var text = jqElm.val();

                Docya.CardController.DocumentJSON[index].name = text;

                $("#json").val(JSON.stringify(Docya.CardController.DocumentJSON));

            });
        },
        initAuthSetChange: function () {
            $("body").on("change", "[data-doc-authSet]", function (e) {

                var jqElm = $(this);
                var index = jqElm.attr("data-doc-index");
                var text = jqElm.val();

                Docya.CardController.DocumentJSON[index].authSet = text;

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
                            $("#documentname").next().remove();
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
                            $("#foldername").next().remove();
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
                            $("#note").next().remove();
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
                        data.authSet = $("#authSet").val();

                        if (data.folder === "") {
                            errors.push('Lütfen klasör seçiniz.');
                        }

                        if (data.authSet === "") {
                            errors.push('Lütfen yetki seti seçiniz.');
                        }

                        if (data.foldername === "") {
                            errors.push('Lütfen klasör adı giriniz.');
                            $("#foldernameAdd").css({ "border": "1px solid #f00" });
                            $("#foldernameAdd").next().remove();
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
                    showMessageBox("danger", "Uyari", errors.join("<br/>"));
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

                var authorities_ = JSON.parse(jqElm.attr("data-a"));

                $("[data-ca]").hide();

                authorities_.map(a => {
                    $("[data-ca=" + a + "]").show();
                });

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
                    $(".document-image").attr("data-f", jqElm.attr("data-id")).html(Docya.CardController.ThumbCreator(jqElm.attr("data-ft"), jqElm.attr("data-id")));
                };

                Docya.CardController.getTransactions(jqElm.attr("data-id"));

                Docya.CardController.getNotes();
            });
        },
        ThumbCreator: function (fileType, file) {
            let html = "<i class='far fa-file-image'></i>";
            if (fileType.indexOf("image") > -1) {
                html = "<img class='img-fluid img-thumbnail' src='/documents/view/" + file + "?height=50' />";
            }
            return html;
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
                    documentEdit: { name: "Adını Değiştir", icon: "edit" },
                    documentOpen: { name: "Aç", icon: "fas fa-folder-open" },
                    documentSave: { name: "Kaydet", icon: "fas fa-file-alt" },
                    sep1: "---------",
                    documentDelete: { name: "Sil", icon: "delete" }
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
                            authSet: null,
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
        getUsers: function () {

            let data = {
                process: "getUsers"
            };

            let cb = function (data) {

                $("#docToContainer").html("");

                var template = '<select class="form-control" id="docUser" name="docUser">{{# each data}}<option value="{{this.[0]}}">{{this.[1]}} {{this.[2]}}</option>{{/each}}</select>';
                var renderedHtml = Handlebars.compile(template)(data);

                $("#docToContainer").append(renderedHtml);

                $('#docUser').fastselect({
                    placeholder: 'Lütfen seçin',
                    searchPlaceholder: 'Arama kriterinizi girin',
                    noResultsText: 'Kayıt bulunamadı',
                    userOptionPrefix: 'Ekle'
                });

            };



            Docya.CardController.initAjax(data, cb);
        },
        getAuthSets: function () {

            let data = {
                process: "getAuthSets"
            };

            let cb = function (data) {
                Docya.CardController.AuthSets = data.data;
            };

            Docya.CardController.initAjax(data, cb);
        },
        getNotes: function () {
            $("#note-container").html("");

            let data = {
                process: "getNote",
                document: Docya.CardController.SelectedDocument,
                folder: Docya.CardController.SelectedFolder
            };

            let cb = function (data) {
                var template = '{{# each data}}<div class="chat-box"><div class="chat-avatar"><i class="fas fa-user-tie"></i></div><div class="chat-text">{{this.[1]}}</div><div class="chat-info">{{this.[2]}} - {{this.[3]}}</div></div>{{/each}}';
                var renderedHtml = Handlebars.compile(template)(data);
                $("#note-container").append(renderedHtml);
            };

            Docya.CardController.initAjax(data, cb);
        },
        getTransactions: function (itemId) {



            let data = {
                process: "getTransactionsByItemId",
                itemId: itemId
            };

            let cb = function (data) {
                $("#dvTransactions").html("");
                if (data.length > 0) {
                    var template = '<table class="table table-sm"><thead><tr><th scope="col">Detay</th><th scope="col">Kullanıcı</th><th scope="col">Tarih</th></tr></thead><tbody>{{# each this}}<tr><td scope="row">{{this.detail}}</td><td>{{this.user.fName}} {{this.user.lName}}</td><td>{{this.rDate}}</td></tr>{{/each}}</tbody></table>';
                    var renderedHtml = Handlebars.compile(template)(data);
                    $("#dvTransactions").append(renderedHtml);
                }

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

            Handlebars.registerHelper("jsonStringify", function (something) {
                return JSON.stringify(something);
            });

            let cb = function (data) {
                var partial = '{{#if this}}<li data-treeitem {{#ifCond this.type "===" "folder"}}data-folder{{/ifCond}} class="context-menu-one" data-name="{{this.name}}" data-id={{this.id}} data-a="{{jsonStringify this.authsetitems.0.authorities}}">{{this.name}}\
                    {{#ifCond this.childs "||" this.documents}}\
                    <ul data-parent={{this.id}}>\
                    {{#each this.childs}}\
                    {{> tree this}}\
                    {{/each}}\
                    {{#each this.documents}}\
                    <li data-treeitem data-document class="context-menu-one2" data-name="{{this.name}}" data-f="{{this.file}}" data-ft="{{this.fileType}}" data-id={{this.id}}  data-a="{{jsonStringify this.authsetitems.authorities}}">{{this.name}}</li>\
                    {{/each}}\
                    </ul>\
                    {{/ifCond}}\
                </li>{{/if}}';
                var template = "{{> tree this }}";
                Handlebars.registerPartial("tree", partial);
                var renderedHtml = Handlebars.compile(template)(data.folders[0]);
                $("#tree2").append(renderedHtml);
                $('#tree2').treed({ openedClass: 'fa-folder-open', closedClass: 'fa-folder' });
                Docya.CardController.initContextMenu();

                $("#mailDocuments").html("");

                var mailDocsPartial = '{{#each this.childs}} {{> maildocuments this}} {{/each}} {{#each this.documents }}\
                <tr class="mail-attachments" data-id="{{this.id}}" data-name="{{this.name}}" data-f="{{this.file}}" data-fn="{{this.filename}}">\
                  <td><input type="checkbox" data-check="select"></td>\
                  <td class="text-cont-cont"><span class="text-cont">{{this.name}}</span></td>\
                  <td><input type="checkbox" data-check="link"></td>\
                  <td><input type="checkbox" data-check="zip"></td>\
                  <td><input type="checkbox" data-check="form"></td>\
                </tr>\
                {{/each}}';

                var mailDocsTemplate = "{{> maildocuments this }}";
                Handlebars.registerPartial("maildocuments", mailDocsPartial);
                var renderedmailDocsHtml = Handlebars.compile(mailDocsTemplate)(data.folders[0]);
                console.log(renderedmailDocsHtml);
                $("#mailDocuments").append(renderedmailDocsHtml);

            };

            Docya.CardController.initAjax(data, cb);
        },
        initMailFields: function () {
            $("body").on("blur", "[data-mailfields]", function (e) {

                var jqElm = $(this);
                var id = jqElm.attr("id");
                var val = jqElm.val();

                switch (id) {
                    case "mailTo":
                        Docya.CardController.Email.To = val;
                        break;
                    case "mailCc":
                        Docya.CardController.Email.Cc = val;
                        break;
                    case "mailSubject":
                        Docya.CardController.Email.Subject = val;
                        break;
                    case "mailMessage":
                        Docya.CardController.Email.Message = val;
                        break;

                    default:
                        break;
                }

            });
        },
        initMailAttachments: function () {
            $("body").on("change", "[data-check]", function (e) {



                var jqElm = $(this);
                var jqParent = jqElm.parents(".mail-attachments");
                var docId = jqParent.attr("data-id");
                var docname = jqParent.attr("data-name");
                var f = jqParent.attr("data-f");
                var fn = jqParent.attr("data-fn");
                var type = jqElm.attr("data-check");
                var isPushable = true;
                var attachment = {
                    id: docId,
                    name: docname,
                    file: f,
                    filename: fn,
                    link: false,
                    zip: false,
                    password: false,
                    form: false
                };
                var isExist = Docya.CardController.Email.Attachments.filter(function (a) { return a.id === docId }).length > 0;

                if (isExist) {
                    attachment = Docya.CardController.Email.Attachments.filter(function (a) { return a.id === docId })[0];
                    Docya.CardController.Email.Attachments = Docya.CardController.Email.Attachments.filter(function (a) { return a.id !== docId });
                }

                switch (type) {
                    case "select":
                        if (jqElm.is(':checked') === false) {
                            isPushable = false;
                            $("[data-check='link']", jqParent).prop('checked', false);
                            $("[data-check='zip']", jqParent).prop('checked', false);
                            $("[data-check='password']", jqParent).prop('checked', false);
                            $("[data-check='form']", jqParent).prop('checked', false);
                        }
                        break;
                    case "link":
                        if (jqElm.is(':checked') === true) {
                            attachment.link = true;
                            attachment.zip = false;
                            attachment.password = false;
                            $("[data-check='zip']", jqParent).prop('checked', false);
                            $("[data-check='password']", jqParent).prop('checked', false);
                            $("[data-check='select']", jqParent).prop('checked', true);
                        } else {
                            attachment.link = false;
                        }
                        break;
                    case "zip":
                        if (jqElm.is(':checked') === true) {
                            attachment.zip = true;
                            attachment.link = false;
                            $("[data-check='link']", jqParent).prop('checked', false);
                            $("[data-check='select']", jqParent).prop('checked', true);
                        } else {
                            attachment.zip = false;
                        }
                        break;
                    case "password":
                        if (jqElm.is(':checked') === true) {
                            attachment.password = true;
                            attachment.link = false;
                            $("[data-check='link']", jqParent).prop('checked', false);
                            $("[data-check='select']", jqParent).prop('checked', true);
                        } else {
                            attachment.password = false;
                        }
                        break;
                    case "form":
                        if (jqElm.is(':checked') === true) {
                            attachment.form = true;
                            $("[data-check='select']", jqParent).prop('checked', true);
                        } else {
                            attachment.form = false;
                        }
                        break;

                    default:
                        break;
                }

                if (isPushable)
                    Docya.CardController.Email.Attachments.push(attachment);

            });
        },
        initMailSend: function () {
            $("body").on("click", "[data-mailsend]", function (e) {
                e.preventDefault();

                var errors = [];
                var obj = Docya.CardController.Email;

                if (obj.To === null || obj.To === "")
                    errors.push("Alıcıyı girin.");

                if (obj.Subject === null || obj.Subject === "")
                    errors.push("Konu girin.");

                if (obj.Message === null || obj.Message === "")
                    errors.push("Mesaj boş bırakılamaz.");

                if (obj.Attachments.length < 1)
                    errors.push("Lütfen en az 1 döküman ekleyin.");

                if (errors.length > 0) {
                    let errorHtml = "<ul>";
                    errors.map(x => {
                        errorHtml += "<li>" + x + "</li>";
                    });
                    errorHtml += "</ul>";
                    showMessageBox("danger", "UYARI", errorHtml);
                    return false;
                }

                let data = {
                    process: "sendMail",
                    card: Docya.CardController.CardId,
                    mail: JSON.stringify(Docya.CardController.Email)
                };

                let cb = function (data) {
                    if (data.messageType === 1) {
                        showMessageBox("success", "BİLGİ", data.message);

                        Docya.CardController.Email.To = null;
                        Docya.CardController.Email.Cc = null;
                        Docya.CardController.Email.Subject = null;
                        Docya.CardController.Email.Message = null;
                        Docya.CardController.Email.Attachments = [];

                        $("[data-mailfields]").each(function () {
                            $(this).val("");
                        });

                        $("[data-check]").each(function () {
                            $(this).prop('checked', false);
                        });

                        $('#mailModal').modal('hide');


                    } else {
                        showMessageBox("danger", "UYARI", data.message);
                    }

                };

                Docya.CardController.initAjax(data, cb);
            })
        },
        initDocSend: function () {
            $("body").on("click", "[data-docsend]", function (e) {
                e.preventDefault();

                var errors = [];

                if ($("#docUser").val() === "")
                    errors.push("Alıcıyı girin.");

                if ($("#docMessage").val() === "")
                    errors.push("Mesaj boş bırakılamaz.");


                if (errors.length > 0) {
                    let errorHtml = "<ul>";
                    errors.map(x => {
                        errorHtml += "<li>" + x + "</li>";
                    });
                    errorHtml += "</ul>";
                    showMessageBox("danger", "UYARI", errorHtml);
                    return false;
                }

                let data = {
                    process: "sendDoc",
                    user: $("#docUser").val(),
                    document: Docya.CardController.SelectedDocument,
                    message: $("#docMessage").val()
                };

                let cb = function (data) {
                    if (data.messageType === 1) {
                        showMessageBox("success", "BİLGİ", data.message);

                        $("#docMessage").val("");
                        $("#docUser").val("");

                        $('#docModal').modal('hide');


                    } else {
                        showMessageBox("danger", "UYARI", data.message);
                    }

                };

                Docya.CardController.initAjax(data, cb);
            })
        },
        initSearchRemove: function () {
            $("body").on("click", "[data-search-remove]", function (e) {
                e.preventDefault();

                var jqElm = $(this);
                var itemIndex = (jqElm.closest(".row").index() - 1);
                var groupIndex = jqElm.closest(".search-box").index();

                Docya.CardController.SearchJSON[groupIndex].items.splice(itemIndex, 1);

                if (Docya.CardController.SearchJSON[groupIndex].items.length === 0 && Docya.CardController.SearchJSON.length>1) {
                    Docya.CardController.SearchJSON.splice(groupIndex, 1);
                }

                Docya.CardController.createSearchForm();

            })
        },
        initSearchAdd: function () {
            $("body").on("click", "[data-search-add]", function (e) {
                e.preventDefault();

                var jqElm = $(this);
                var parent_ = jqElm.closest(".row");
                var group = jqElm.closest(".search-box");

                Docya.CardController.SearchJSON[group.index()].items.push({
                    type: Docya.CardController.FormFields[0].type,
                    field: Docya.CardController.FormFields[0].field,
                    rule: Docya.CardController.FormFields[0].type === "string" ? Docya.CardController.SearchRules.string[0].rule : Docya.CardController.SearchRules.number[0].rule,
                    value: ""
                });

                Docya.CardController.createSearchForm();

            })
        },
        initSearchGroupAdd: function () {
            $("body").on("click", "[data-search-grupadd]", function (e) {
                e.preventDefault();

                var jqElm = $(this);

                Docya.CardController.SearchJSON.push(
                    {
                        rule: "or",
                        items: [
                            {
                                type: Docya.CardController.FormFields[0].type,
                                field: Docya.CardController.FormFields[0].field,
                                rule: Docya.CardController.FormFields[0].type === "string" ? Docya.CardController.SearchRules.string[0].rule : Docya.CardController.SearchRules.number[0].rule,
                                value: ""
                            }
                        ]
                    }
                );


                Docya.CardController.createSearchForm();

            })
        },
        initSearchFieldChange: function () {
            $("body").on("change", "[data-search-field]", function (e) {
                e.preventDefault();

                var jqElm = $(this);
                var values = jqElm.val().split("||");
                var field_ = values[0];
                var type_ = values[1];

                var parent_ = jqElm.closest(".row");

                var jqOperatorElm = parent_.find("[data-search-operator]");
                var jqValueElm = parent_.find("[data-search-value]");

                var itemIndex = (parent_.index() - 1);
                var groupIndex = jqElm.closest(".search-box").index();

                Docya.CardController.SearchJSON[groupIndex].items[itemIndex].field = field_;
                Docya.CardController.SearchJSON[groupIndex].items[itemIndex].type = type_;

                var obj_ = Docya.CardController.SearchRules.string;
                switch (type_) {
                    case "datetime":
                        obj_ = Docya.CardController.SearchRules.date;
                        jqValueElm.attr("data-datetimepicker").attr("type","text");
                        break;
                    case "number":
                        obj_ = Docya.CardController.SearchRules.number;
                        jqValueElm.removeAttr("data-datetimepicker").attr("type","number");
                        break;
                    default:
                        obj_ = Docya.CardController.SearchRules.string;
                        jqValueElm.removeAttr("data-datetimepicker").attr("type","text");
                        break;
                }

                Docya.CardController.SearchJSON[groupIndex].items[itemIndex].rule = obj_[0].rule;
                Docya.CardController.SearchJSON[groupIndex].items[itemIndex].value = "";

                jqValueElm.val("");

                jqOperatorElm.empty();

                obj_.map((a) => {
                    jqOperatorElm.append('<option value="' + a.rule + '">' + a.name + '</option>');
                });

            })
        },
        initAjax: function (data, cb) {
            $.ajax({
                dataType: "json",
                url: '/ajax',
                type: 'post',
                data: data,
                success: cb
            });
        },
        initElements: function () {
            this.initSearchFieldChange();
            this.initSearchRemove();
            this.initSearchAdd();
            this.initSearchGroupAdd();
            this.createSearchForm();
            this.initDocSend();
            this.initMailSend();
            this.initMailFields();
            this.initMailAttachments();
            this.initDropzone();
            this.initContextMenu();
            this.initOptionClick();
            this.initTreeClick();
            this.initNameChange();
            this.initAuthSetChange();
            this.initFormSubmit();
            this.initTableRowClick();
            this.getAuthSets();
            this.getUsers();
        },
        init: function () {
            this.initElements();
        }

    }

    $(document).ready(function () {
        w.Docya.CardController.init();
    });

})(jQuery, window, document);

function slugify(text) {
    var trMap = {
        'çÇ': 'c',
        'ğĞ': 'g',
        'şŞ': 's',
        'üÜ': 'u',
        'ıİ': 'i',
        'öÖ': 'o'
    };
    for (var key in trMap) {
        text = text.replace(new RegExp('[' + key + ']', 'g'), trMap[key]);
    }
    return text.replace(/[^-a-zA-Z0-9\s]+/ig, '')
        .replace(/\s/gi, "_")
        .replace(/[_]+/gi, "_")
        .toLowerCase();

}