(function ($, w, document, undefined) {
    if (w.Docya == undefined) w.Docya = {};

    w.Docya.OrganizationController = {
        Tree:[
            {
                id:0,
                parent:0,
                index:0,
                title:'AGOG',
                name:'Adnan GOG',
                sub:'Satış'
            },
            {
                id:1,
                parent:0,
                index:1,
                title:'SATIŞ',
                name:'Adnan GOG',
                sub:'Satış'
            },
            {
                id:2,
                parent:0,
                index:2,
                title:'SATIŞ',
                name:'Adnan GOG',
                sub:'Satış'
            }
        ],
        AuthJSON:
            $("#json")[0] && $("#json").val().length > 0
                ? JSON.parse($("#json").val())
                : [],
        Authorities:
            $("#authoritiesJSON")[0] && $("#authoritiesJSON").val().length > 0
                ? JSON.parse($("#authoritiesJSON").val())
                : [],
        InputJSON: [],
        Owners: [],
        Auths: [],
        createList: function () {
            var parent = $("[data-auth-users]");
            parent.html("");
            Docya.OrganizationController.AuthJSON.map(x => {
                var className = "fa-user";
                if (x.type === 2) className = "fa-users";
                var attention = "";
                var classes = "list-group-item list-group-item-action";
                if (Docya.OrganizationController.Owners.indexOf(x.ownerId) > -1)
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

                if (Docya.OrganizationController.Owners.length < 1) {
                    showMessageBox(
                        "danger",
                        "Uyari",
                        "Lütfen önce Kişi ya da Rol seçiniz."
                    );
                    return false;
                }

                var jqElm = $(this);
                var authId = jqElm.attr("data-auth-id");
                var index = Docya.OrganizationController.Auths.indexOf(parseInt(authId));
                jqElm.toggleClass("selected");

                if (index < 0) {
                    Docya.OrganizationController.Auths.push(parseInt(authId));
                } else {
                    Docya.OrganizationController.Auths.splice(index, 1);
                }

                var getOwner = item => {
                    if (Docya.OrganizationController.Owners.indexOf(item.ownerId) > -1) {
                        return true;
                    }
                    return false;
                };

                Docya.OrganizationController.AuthJSON.filter(getOwner).map((x, i) => {
                    x.authorities = Docya.OrganizationController.Auths;
                });

                $("#json").val(JSON.stringify(Docya.OrganizationController.AuthJSON));

                Docya.OrganizationController.createList();
            });
        },
        setOwnersAuths: function () {
            $("[data-auth-id]").removeClass("selected");
            var auths = [];

            var getOwner = item => {
                if (Docya.OrganizationController.Owners.indexOf(item.ownerId) > -1) {
                    return true;
                }
                return false;
            };

            Docya.OrganizationController.AuthJSON.filter(getOwner).map((x, i) => {
                if (i === 0) {
                    auths = x.authorities;
                } else {
                    auths = auths.filter(value => -1 !== x.authorities.indexOf(value));
                }
            });

            Docya.OrganizationController.Auths = auths;

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
                    var index = Docya.OrganizationController.Owners.indexOf(ownerId);

                    if (e.ctrlKey) {
                        jqElm.toggleClass("active");
                        if (index < 0) {
                            Docya.OrganizationController.Owners.push(ownerId);
                        } else {
                            Docya.OrganizationController.Owners.splice(index, 1);
                        }
                    } else {
                        $("[data-ownerId]").removeClass("active");
                        if (index < 0) {
                            jqElm.addClass("active");
                            Docya.OrganizationController.Owners = [ownerId];
                        } else {
                            Docya.OrganizationController.Owners = [];
                        }
                    }

                    if (Docya.OrganizationController.Owners.length > 0)
                        $(".user-remove").removeClass("disable");
                    else $(".user-remove").addClass("disable");

                    Docya.OrganizationController.setOwnersAuths();
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
                            Docya.OrganizationController.AuthJSON.filter(function (a) {
                                return a.ownerId === x;
                            }).length === 0
                        ) {
                            let item = Docya.OrganizationController.JsJSON.filter(function (a) {
                                return a.ownerId === x;
                            })[0];
                            Docya.OrganizationController.AuthJSON.push(item);
                        }
                    });

                    Docya.OrganizationController.createList();
                }
            });
        },
        initUserRemove: function () {
            $("body").on("click", ".user-remove", function (e) {
                e.preventDefault();
                var ids_ = Docya.OrganizationController.Owners;

                if (confirm("Silmek istediğinizden emin misiniz?")) {
                    if (ids_ !== null && ids_ !== "" && ids_.length > 0) {
                        ids_.map((x, i) => {
                            Docya.OrganizationController.AuthJSON = Docya.OrganizationController.AuthJSON.filter(
                                function (a) {
                                    return a.ownerId !== x;
                                }
                            );
                        });

                        Docya.OrganizationController.Owners = [];
                        Docya.OrganizationController.Auths = [];
                        Docya.OrganizationController.createList();
                    }
                }
            });
        },
        initAuthFilter: function () {
            $("body").on("keyup", "#authFilter", function (e) {
                var jqElm = $(this);
                var jqElmVal = jqElm.val();
                if (jqElmVal.length > 0)
                    $("#deleteFilter").html('<i class="fas fa-times"></i>');
                else $("#deleteFilter").html('<i class="fas fa-filter"></i>');
                $(".auth-list .list-group-item:icontains(" + jqElmVal + ")").show();
                $(
                    ".auth-list .list-group-item:not(:icontains(" + jqElmVal + "))"
                ).hide();
            });
        },
        initDeleteFilter: function () {
            $("body").on("click", "#deleteFilter", function (e) {
                var jqElm = $(this);
                jqElm.html('<i class="fas fa-filter"></i>');
                $("#authFilter").val("");
                $(".auth-list .list-group-item").show();
            });
        },
        initSelectAll: function () {
            $("body").on("click", "[data-selectall]", function (e) {

                var getOwner = item => {
                    if (Docya.OrganizationController.Owners.indexOf(item.ownerId) > -1) {
                        return true;
                    }
                    return false;
                };

                if (Docya.OrganizationController.Owners.length < 1) {
                    showMessageBox(
                        "danger",
                        "Uyari",
                        "Lütfen önce Kişi ya da Rol seçiniz."
                    );
                    return false;
                }

                var jqElm = $(this);
                var current = jqElm.attr("data-selectall");

                if (current === "0") {

                    jqElm.attr("data-selectall","1");
                    jqElm.addClass("selected");

                    $(".list-group-flush .list-group-item").addClass("selected");

                    Docya.OrganizationController.Authorities.map(x => {
                        var index = Docya.OrganizationController.Auths.indexOf(parseInt(x));
                        if (index < 0) {
                            Docya.OrganizationController.Auths.push(parseInt(x));
                        }
                    });

                    Docya.OrganizationController.AuthJSON.filter(getOwner).map((x, i) => {
                        x.authorities = Docya.OrganizationController.Auths;
                    });

                } else {

                    jqElm.attr("data-selectall","0");
                    jqElm.removeClass("selected");

                    Docya.OrganizationController.Auths = [];

                    Docya.OrganizationController.AuthJSON.filter(getOwner).map((x, i) => {
                        x.authorities = [];
                    });

                    $(".list-group-flush .list-group-item").removeClass("selected");
                }

                $("#json").val(JSON.stringify(Docya.OrganizationController.AuthJSON));

                Docya.OrganizationController.createList();
            });
        },
        initFormSubmit: function () {
            $("body").on("click", "[data-submit]", function (e) {
                e.preventDefault();
                var jqElm = $(this);
                var jqForm = jqElm.parents("form");

                let errors = [];

                if ($("#name").val() === "") {
                    errors.push("Yetki seti adı boş bırakılamaz.");
                    $("#name").css({ border: "1px solid #f00" });
                    $("#name")
                        .next()
                        .remove();
                    $("#name").after(
                        '<div class="invalid-feedback">Lütfen yetki seti adı giriniz.</div>'
                    );
                } else {
                    $("#name").css({ border: "1px solid #ced4da" });
                    $("#name")
                        .next()
                        .remove();
                }

                if (Docya.OrganizationController.AuthJSON.length === 0) {
                    errors.push("Yetki setine en az bir kişi ya da rol eklemelisiniz.");
                }

                if (
                    Docya.OrganizationController.AuthJSON.filter(function (a) {
                        return a.authorities.length === 0;
                    }).length > 0
                ) {
                    errors.push("Yetki atanmayan kişi ya da rol bulunuyor.");
                }

                if (errors.length > 0) {
                    let errorHtml = "<ul>";
                    errors.map(x => {
                        errorHtml += "<li>" + x + "</li>";
                    });
                    errorHtml += "</ul>";
                    showMessageBox("danger", "Uyari", errorHtml);
                    return false;
                }

                jqForm.submit();
            });
        },
        initElements: function () {
            this.initSelectAll();
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
        w.Docya.OrganizationController.init();
    });
})(jQuery, window, document);
