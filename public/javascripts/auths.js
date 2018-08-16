(function ($, w, document, undefined) {
    if (w.Docya == undefined)
        w.Docya = {};

    w.Docya.AuthController = {
        AuthJSON: [
            {
                type: 1,
                ownerId: "1",
                name: "Ahmet Muhip Piranhas",
                authorities: [1, 2, 3, 4]
            },
            {
                type: 1,
                ownerId: "2",
                name: "Memduh Şevket Essential",
                authorities: [4, 5, 6]
            },
            {
                type: 1,
                ownerId: "3",
                name: "Necip Jhonson",
                authorities: [1, 2]
            },
            {
                type: 2,
                ownerId: "4",
                name: "Kanarya Severler",
                authorities: [3, 4]
            },
            {
                type: 2,
                ownerId: "5",
                name: "Terakkiperver Hulk Fırkası",
                authorities: [1, 3, 4]
            }
        ],
        InputJSON: [],
        Owners: [],
        Auths: [],
        createList: function () {
            var parent = $("[data-auth-users]");
            parent.html("");
            Docya.AuthController.AuthJSON.map(x => {
                var className = "fa-user";
                if (x.type === 2)
                    className = "fa-users";
                parent.append($('<a href="#" class="list-group-item list-group-item-action" data-ownerId="' + x.ownerId + '"> <i class="fas ' + className + '"></i> ' + x.name + '</a>'));
            });
        },
        initAuthClick: function () {
            $("body").on("click", ".auth-list .list-group-item", function (e) {
                e.preventDefault();

                if (Docya.AuthController.Owners.length < 1) {
                    alert("Lütfen önce Kişi ya da Rol seçiniz.");
                    return false;
                }

                var jqElm = $(this);
                var authId = jqElm.attr("data-auth-id");
                var index = Docya.AuthController.Auths.indexOf(parseInt(authId));
                jqElm.toggleClass("selected");

                if (index < 0) {
                    Docya.AuthController.Auths.push(authId);
                } else {
                    Docya.AuthController.Auths.splice(index, 1);
                }

                var getOwner = (item) => {
                    if (Docya.AuthController.Owners.indexOf(item.ownerId) > -1) {
                        return true;
                    }
                    return false;
                }

                Docya.AuthController.AuthJSON.filter(getOwner).map((x, i) => {
                    x.authorities = Docya.AuthController.Auths;
                });


            });
        },
        setOwnersAuths: function () {
            $("[data-auth-id]").removeClass("selected");
            var auths = [];

            var getOwner = (item) => {
                if (Docya.AuthController.Owners.indexOf(item.ownerId) > -1) {
                    return true;
                }
                return false;
            }

            Docya.AuthController.AuthJSON.filter(getOwner).map((x, i) => {
                if (i === 0) {
                    auths = x.authorities;
                }
                else {
                    auths = auths.filter(value => -1 !== x.authorities.indexOf(value));
                }
            });

            Docya.AuthController.Auths = auths;

            auths.map(x => {
                $("[data-auth-id=" + x + "]").addClass("selected");
            });

        },
        initUserClick: function () {
            $("body").on("click", "[data-auth-users] .list-group-item-action", function (e) {
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
                    jqElm.toggleClass("active");
                    if (index < 0) {
                        Docya.AuthController.Owners = [ownerId];
                    } else {
                        Docya.AuthController.Owners = [];
                    }
                }

                if (Docya.AuthController.Owners.length > 0)
                    $(".user-remove").removeClass("disable");
                else
                    $(".user-remove").addClass("disable");

                Docya.AuthController.setOwnersAuths();
            });
        },
        initElements: function () {
            this.initAuthClick();
            this.initUserClick();
            this.createList();
        },
        init: function () {
            this.initElements();
        }

    }

    $(document).ready(function () {
        w.Docya.AuthController.init();
    });

})(jQuery, window, document);