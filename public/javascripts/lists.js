(function ($, w, document, undefined) {
    if (w.Docya == undefined) w.Docya = {};

    w.Docya.ListController = {
        items: JSON.parse($("#items").val()),
        createList: function () {
            var parent = $("[data-table]");
            parent.html("");

            if (Docya.ListController.items.length > 0) {
                Docya.ListController.items.map((x, i) => {
                    parent.append($('<tr><th scope="row">' + (i + 1) + '</th><td>' + x.label + '</td><td>' + x.value + '</td><td>' + x.ekstra + '</td><td><button type="type" data-removeItem="' + i + '" class="btn btn-danger btn-sm"><i class="fas fa-times"></i></button></td></tr>'));
                });
            } else {
                parent.append('<tr><td colspan="5"><div class="alert alert-warning" >Burada henüz birşey yok.</div></td></tr>');
            }

            $("#items").val(JSON.stringify(Docya.ListController.items));

        },
        initAddItem: function () {
            $("body").on("click", "[data-addItem]", function (e) {
                e.preventDefault();
                var label = $("[data-label]").val();
                var value = $("[data-value]").val();
                var ekstra = $("[data-ekstra]").val();

                if (label === "") {
                    $("[data-label]").css("border", "1px solid #f00");
                    return false;
                } else {
                    $("[data-label]").css("border", "1px solid #ced4da");
                }

                if (value === "") {
                    $("[data-value]").css("border", "1px solid #f00");
                    return false;
                } else {
                    $("[data-value]").css("border", "1px solid #ced4da");
                }

                if (Docya.ListController.items.filter(function (a) { return a.label === label || a.value === value }).length === 0) {
                    Docya.ListController.items.push({
                        label: label,
                        value: value,
                        ekstra: ekstra
                    });
                } else {
                    showMessageBox("danger", "UYARI", "Bu <strong>Ad</strong> ya da <strong>Değer</strong> listede bulunuyor")
                }

                $("[data-label]").val("");
                $("[data-value]").val("");
                $("[data-ekstra]").val("");

                Docya.ListController.createList();
            });
        },
        initRemoveItem: function () {
            $("body").on("click", "[data-removeItem]", function (e) {
                e.preventDefault();
                var index = parseInt($(this).attr("data-removeItem"));

                Docya.ListController.items.splice(index, 1);

                Docya.ListController.createList();
            });
        },
        initLabelBlur: function () {
            $("body").on("blur", "[data-label]", function (e) {
                var jqElm = $(this);
                var jqValue = $("[data-value]");
                var jqElmVal = jqElm.val();
                if (jqElmVal.length > 0 && jqValue.val() === "") {
                    jqValue.val(jqElmVal)
                }
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
                        '<div class="invalid-feedback">Lütfen Liste Adı giriniz.</div>'
                    );
                } else {
                    $("#name").css({ border: "1px solid #ced4da" });
                    $("#name")
                        .next()
                        .remove();
                }

                if (Docya.ListController.items.length === 0) {
                    errors.push("En az bir tane Liste Eleman'ı eklemelisiniz.");
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
            this.initAddItem();
            this.initRemoveItem();
            this.initLabelBlur();
            this.initFormSubmit();
            this.createList();
        },
        init: function () {
            this.initElements();
        }
    };

    $(document).ready(function () {
        w.Docya.ListController.init();
    });
})(jQuery, window, document);
