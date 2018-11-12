(function ($, w, document, undefined) {
    if (w.Docya == undefined) w.Docya = {};

    w.Docya.OrganizationController = {
        Tree: $("#tree").val() !== '[]' ? JSON.parse($("#tree").val()) : [
            {
                id: 0,
                parent: 0,
                index: 0,
                type: 0,
                department: null,
                user: null,
                position: null,
                title: 'Şema Adı',
                name: null,
                sub: null
            }
        ],
        Name: null,
        createTree: function () {
            var parent = $("[data-parent]");
            parent.html("");

            jsPlumb.ready(function () {

                jsPlumb.deleteEveryEndpoint();

                var common = {
                    connector: ["Flowchart"],
                    anchors: ["BottomCenter", "Top"],
                    endpoint: "Dot"
                };

                Docya.OrganizationController.Tree.map(x => {
                    var parentWidth = parent.width();
                    var group = Docya.OrganizationController.Tree.filter(function (a) { return a.index === x.index && a.parent === x.parent });
                    var parents = Docya.OrganizationController.Tree.filter(function (a) { return a.index === (x.index - 1) });
                    var parentElm = Docya.OrganizationController.Tree.filter(function (a) { return a.id === x.parent });

                    var index = 0;
                    var parentIndex = 0;

                    group.map(function (a, i) {
                        if (a.id === x.id) {
                            index = i;
                        }
                    })

                    parents.map(function (a, i) {
                        if (a.id === x.parent) {
                            parentIndex = i;
                        }
                    })

                    if (x.index === 0) {
                        left = (parentWidth / 2) - (180 / 2);
                        top = 0;
                    } else {
                        parentWidth = parentWidth / parents.length;
                        var left = (parentIndex * parentWidth) + (((parentWidth / group.length) * (index)) + (parentWidth / group.length) / 2) - (180 / 2);
                        var top = x.index * 130;
                    }

                    var delHtml = '<button class="btn btn-danger btn-sm organization-delete" data-delete><i class="fas fa-times"></i></button>';
                    var bodyHtml = '<div class="person">' + x.name + '</div><div class="title">' + x.sub + '</div>';
                    var btnzHtml = '<div class="buttons"><button class="btn btn-secondary btn-sm" data-edit><i class="fas fa-pencil-alt"></i></button><button class="btn btn-success btn-sm" data-add data-type="1"><i class="fas fa-users"></i></button><button class="btn btn-success btn-sm" data-add data-type="2"><i class="fas fa-user-plus"></i></button></div>';

                    if (x.id === 0) {
                        delHtml = "";
                        bodyHtml = "";
                        btnzHtml = '<div class="buttons"><button class="btn btn-success btn-sm" data-add data-type="1"><i class="fas fa-users"></i></button><button class="btn btn-success btn-sm" data-add data-type="2"><i class="fas fa-user-plus"></i></button></div>';
                    }

                    if (x.type === 2) {
                        btnzHtml = '<div class="buttons"><button class="btn btn-secondary btn-sm" data-edit><i class="fas fa-pencil-alt"></i></button></div>';
                    }

                    parent.append(
                        $('<div class="organizatinBox" style="left:' + left + 'px; top: ' + top + 'px;" id="Element' + x.id + '" data-id="' + x.id + '">' + delHtml + ' \
                                <div class="box-title">'+ x.title + '</div>' + bodyHtml + btnzHtml + '\
                            </div >')
                    );

                    if (x.id !== 0) {
                        jsPlumb.connect({
                            source: "Element" + parentElm[0].id,
                            target: "Element" + x.id,
                            detachable: false
                        }, common);
                    }

                    jsPlumb.draggable("Element" + x.id);
                });

            });

            $("[data-json]").val(JSON.stringify(Docya.OrganizationController.Tree));
        },
        initNodeDelete: function () {
            $("body").on("click", "[data-delete]", function (e) {
                e.preventDefault();

                var id = parseInt($(this).parent().attr("data-id"));

                if (id === 0) {
                    showMessageBox(
                        "danger",
                        "Uyari",
                        "Kök elementi silemezsiniz!"
                    );
                } else {
                    Docya.OrganizationController.Tree = Docya.OrganizationController.Tree.filter(function (a) { return a.id !== id && a.parent !== id });
                    Docya.OrganizationController.createTree();
                }

            });
        },
        initNodeEdit: function () {
            $("body").on("click", "[data-edit]", function (e) {
                e.preventDefault();
                var id = parseInt($(this).parents(".organizatinBox").attr("data-id"));
                var elmType = parseInt($(this).parents(".organizatinBox").attr("data-type"));

                var elm = Docya.OrganizationController.Tree.filter(function (a) { return a.id === id })[0];

                $("[data-department]").val(elm.department);
                $("[data-user]").val(elm.user);

                $("#organizationModalLabel").text("Düzenle");
                $("[data-save]").attr("data-process", "1").attr("data-target", id).attr("data-type", elm.type).removeClass("btn-success").addClass("btn-secondary").text("Güncelle");

                $('#organizationModal').modal('show');
            });
        },
        initNodeAdd: function () {
            $("body").on("click", "[data-add]", function (e) {
                e.preventDefault();
                var id = parseInt($(this).parents(".organizatinBox").attr("data-id"));
                var type = parseInt($(this).attr("data-type"));

                $("[data-save]").attr("data-process", "2").attr("data-target", id).attr("data-type", type).removeClass("btn-secondary").addClass("btn-success").text("Ekle");

                if (type === 1) {
                    $("#organizationModalLabel").text("Departman Ekle");
                    $("[data-user-title]").text("Yönetici");
                    $("[data-department]").parents(".form-group").show();
                } else {
                    $("#organizationModalLabel").text("Kullanıcı Ekle");
                    $("[data-user-title]").text("Kullanıcı");
                    $("[data-department]").parents(".form-group").hide();
                }

                $('#organizationModal').modal('show');

            });
        },
        initSave: function () {
            $("body").on("click", "[data-save]", function (e) {
                e.preventDefault();
                var jqElm = $(this);

                var target = parseInt(jqElm.attr("data-target"));
                var processType = parseInt(jqElm.attr("data-process"));
                var type = parseInt(jqElm.attr("data-type"));

                var errors = [];

                if ($("[data-user]").val() === "") {
                    errors.push(type === 1 ? "Yönetici seçiniz." : "Kullanıcı seçiniz.");
                }

                if (type === 1 && $("[data-department]").val() === "") {
                    errors.push("Departman seçiniz.");
                }

                if ($("[data-position]").val() === "") {
                    errors.push("Pozisyon giriniz.");
                }

                var elm = Docya.OrganizationController.Tree.filter(function (a) { return a.id === target })[0];

                if (errors.length === 0) {
                    if (processType === 1) {

                        elm.department = type === 1 ? $("[data-department]").val() : elm.department;
                        elm.user = $("[data-user]").val();
                        elm.position = $("[data-position]").val();
                        elm.title = type === 1 ? $("[data-department] option:selected").text() : $("[data-user] option:selected").text();
                        elm.name = type === 1 ? $("[data-user] option:selected").text() : $("[data-position]").val();
                        elm.sub = type === 1 ? $("[data-position]").val() : elm.title;

                    } else {
                        Docya.OrganizationController.Tree.push({
                            id: Math.max.apply(Math, Docya.OrganizationController.Tree.map(function (o) { return o.id; })) + 1,
                            parent: elm.id,
                            index: elm.index + 1,
                            type: type,
                            department: type === 1 ? $("[data-department]").val() : elm.department,
                            user: $("[data-user]").val(),
                            position: $("[data-position]").val(),
                            title: type === 1 ? $("[data-department] option:selected").text() : $("[data-user] option:selected").text(),
                            name: type === 1 ? $("[data-user] option:selected").text() : $("[data-position]").val(),
                            sub: type === 1 ? $("[data-position]").val() : target !== 0 ? elm.title : ''
                        });
                    }

                    $("[data-department]").val("");
                    $("[data-user]").val("");
                    $("[data-position]").val("");
                    $(".fstToggleBtn").text("Lutfen secin");

                    $('[data-department],[data-user]').fastselect({
                        placeholder: 'Lütfen seçin',
                        searchPlaceholder: 'Arama kriterinizi girin',
                        noResultsText: 'Kayıt bulunamadı',
                        userOptionPrefix: 'Ekle'
                    });

                    Docya.OrganizationController.createTree();

                    $('#organizationModal').modal('hide');

                } else {
                    let errorHtml = "<ul>";
                    errors.map(x => {
                        errorHtml += "<li>" + x + "</li>";
                    });
                    errorHtml += "</ul>";
                    showMessageBox("danger", "Uyari", errorHtml);
                }


            });
        },
        initOrgName: function () {
            $("body").on("blur", "#organizationName", function (e) {
                e.preventDefault();
                var jqElm = $(this);
                if (jqElm.val() !== "") {
                    Docya.OrganizationController.Name = jqElm.val();
                    $("[data-id='0'] .box-title").text(jqElm.val());
                    Docya.OrganizationController.Tree[0].title = jqElm.val();
                } else {
                    jqElm.val(Docya.OrganizationController.Name);
                }
            });
        },
        initElements: function () {
            this.createTree();
            this.initNodeDelete();
            this.initNodeEdit();
            this.initNodeAdd();
            this.initSave();
            this.initOrgName();
        },
        init: function () {
            this.initElements();
        }
    };

    $(document).ready(function () {
        w.Docya.OrganizationController.init();
    });
})(jQuery, window, document);
