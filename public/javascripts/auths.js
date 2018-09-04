(function ($, w, document, undefined) {
    if (w.Docya == undefined) w.Docya = {};

    w.Docya.AuthController = {
        JsJSON: $("#jsJSON")[0] && $("#jsJSON").val().length > 0 ? JSON.parse($("#jsJSON").val()) : [],
        AuthJSON: $("#json")[0] && $("#json").val().length > 0 ? JSON.parse($("#json").val()) : [],
        InputJSON: [],
        Owners: [],
        Auths: [],
        createList: function () {
            var parent = $("[data-auth-users]");
            parent.html("");
            Docya.AuthController.AuthJSON.map(x => {
                var className = "fa-user";
                if (x.type === 2) className = "fa-users";
                var attention = "";
                var classes = "list-group-item list-group-item-action";
                if (Docya.AuthController.Owners.indexOf(x.ownerId) > -1)
                    classes = "list-group-item list-group-item-action active";
                if (x.authorities.length === 0)
                    attention =
                        " <span class='badge badge-danger'>Yetki atanmadı.</span>";
                parent.append(
                    $(
                        '<a href="#" class="' +
                        classes +
                        '" data-ownerId="' +
                        x.ownerId +
                        '"> <i class="fas ' +
                        className +
                        '"></i> ' +
                        x.name +
                        attention +
                        "</a>"
                    )
                );
            });
        },
        initAuthClick: function () {
            $("body").on("click", ".auth-list .list-group-item", function (e) {
                e.preventDefault();

                if (Docya.AuthController.Owners.length < 1) {
                    showMessageBox("danger","Uyari","Lütfen önce Kişi ya da Rol seçiniz.");
                    return false;
                }

                var jqElm = $(this);
                var authId = jqElm.attr("data-auth-id");
                var index = Docya.AuthController.Auths.indexOf(parseInt(authId));
                jqElm.toggleClass("selected");

                if (index < 0) {
                    Docya.AuthController.Auths.push(parseInt(authId));
                } else {
                    Docya.AuthController.Auths.splice(index, 1);
                }

                var getOwner = item => {
                    if (Docya.AuthController.Owners.indexOf(item.ownerId) > -1) {
                        return true;
                    }
                    return false;
                };

                Docya.AuthController.AuthJSON.filter(getOwner).map((x, i) => {
                    x.authorities = Docya.AuthController.Auths;
                });

                $("#json").val(JSON.stringify(Docya.AuthController.AuthJSON));

                Docya.AuthController.createList();
            });
        },
        setOwnersAuths: function () {
            $("[data-auth-id]").removeClass("selected");
            var auths = [];

            var getOwner = item => {
                if (Docya.AuthController.Owners.indexOf(item.ownerId) > -1) {
                    return true;
                }
                return false;
            };

            Docya.AuthController.AuthJSON.filter(getOwner).map((x, i) => {
                if (i === 0) {
                    auths = x.authorities;
                } else {
                    auths = auths.filter(value => -1 !== x.authorities.indexOf(value));
                }
            });

            Docya.AuthController.Auths = auths;

            auths.map(x => {
                $("[data-auth-id=" + x + "]").addClass("selected");
            });
        },
        initUserClick: function () {
            $("body").on(
                "click",
                "[data-auth-users] .list-group-item-action",
                function (e) {
                    e.preventDefault();

                    var jqElm = $(this);
                    var ownerId = jqElm.attr("data-ownerId");
                    var index = Docya.AuthController.Owners.indexOf(ownerId);

                    if (e.ctrlKey) {
                        jqElm.toggleClass("active");
                        if (index < 0) {
                            Docya.AuthController.Owners.push(ownerId);
                        } else {
                            Docya.AuthController.Owners.splice(index, 1);
                        }
                    } else {
                        $("[data-ownerId]").removeClass("active");
                        if (index < 0) {
                            jqElm.addClass("active");
                            Docya.AuthController.Owners = [ownerId];
                        } else {
                            Docya.AuthController.Owners = [];
                        }
                    }

                    if (Docya.AuthController.Owners.length > 0)
                        $(".user-remove").removeClass("disable");
                    else $(".user-remove").addClass("disable");

                    Docya.AuthController.setOwnersAuths();
                }
            );
        },
        initUserAdd: function () {
            $("body").on("click", "[data-addowner]", function (e) {
                e.preventDefault();
                var ids_ = $("#owners").val();

                if (ids_ !== null && ids_ !== "" && ids_.length > 0) {
                    ids_.map((x, i) => {
                        if (
                            Docya.AuthController.AuthJSON.filter(function (a) {
                                return a.ownerId === x;
                            }).length === 0
                        ) {
                            let item = Docya.AuthController.JsJSON.filter(function (a) {
                                return a.ownerId === x;
                            })[0];
                            Docya.AuthController.AuthJSON.push(item);
                        }
                    });

                    Docya.AuthController.createList();
                }
            });
        },
        initUserRemove: function () {
            $("body").on("click", ".user-remove", function (e) {
                e.preventDefault();
                var ids_ = Docya.AuthController.Owners;

                if (confirm("Silmek istediğinizden emin misiniz?")) {
                    if (ids_ !== null && ids_ !== "" && ids_.length > 0) {
                        ids_.map((x, i) => {
                            Docya.AuthController.AuthJSON = Docya.AuthController.AuthJSON.filter(function (a) {
                                return a.ownerId !== x;
                            });
                        });

                        Docya.AuthController.Owners = [];
                        Docya.AuthController.Auths = [];
                        Docya.AuthController.createList();
                    }
                }


            });
        },
        initAuthFilter: function () {
            $("body").on("keyup", "#authFilter", function (e) {
                var jqElm = $(this);
                var jqElmVal = jqElm.val()
                if (jqElmVal.length > 0)
                    $("#deleteFilter").html('<i class="fas fa-times"></i>');
                else
                    $("#deleteFilter").html('<i class="fas fa-filter"></i>');
                $('.auth-list .list-group-item:icontains(' + jqElmVal + ')').show();
                $('.auth-list .list-group-item:not(:icontains(' + jqElmVal + '))').hide();
            });
        },
        initDeleteFilter: function () {
            $("body").on("click", "#deleteFilter", function (e) {
                var jqElm = $(this);
                jqElm.html('<i class="fas fa-filter"></i>');
                $("#authFilter").val("");
                $('.auth-list .list-group-item').show();
            });
        },
        initFormSubmit: function () {
            $("body").on("click", "[data-submit]", function (e) {
                e.preventDefault();
                var jqElm = $(this);
                var jqForm = jqElm.parents("form");

                let errors = [];

                if ($("#name").val() === "") {
                    errors.push('Yetki seti adı boş bırakılamaz.');
                    $("#name").css({ "border": "1px solid #f00" });
                    $("#name").next().remove();
                    $("#name").after('<div class="invalid-feedback">Lütfen yetki seti adı giriniz.</div>');
                } else {
                    $("#name").css({ "border": "1px solid #ced4da" });
                    $("#name").next().remove();
                }

                if (Docya.AuthController.AuthJSON.length === 0) {
                    errors.push('Yetki setine en az bir kişi ya da rol eklemelisiniz.');
                }

                if (Docya.AuthController.AuthJSON.filter(function (a) { return a.authorities.length === 0; }).length > 0) {
                    errors.push('Yetki atanmayan kişi ya da rol bulunuyor.');
                }

                if (errors.length > 0) {
                    let errorHtml = "<ul>";
                    errors.map(x => { errorHtml += "<li>" + x + "</li>" });
                    errorHtml += "</ul>";
                    showMessageBox("danger", "Uyari", errorHtml);
                    return false;
                }

                jqForm.submit();
            });
        },
        initElements: function () {
            this.initDeleteFilter();
            this.initAuthFilter();
            this.initUserRemove();
            this.initUserAdd();
            this.initAuthClick();
            this.initUserClick();
            this.createList();
            this.initFormSubmit();
        },
        init: function () {
            this.initElements();
        }
    };

    $(document).ready(function () {
        w.Docya.AuthController.init();
    });
})(jQuery, window, document);
