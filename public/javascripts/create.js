(function ($, w, document, undefined) {
    if (w.Docya == undefined)
        w.Docya = {};

    w.Docya.FormCreator = {
        OutputJSON: [],
        InputJSON: [
            {
                "control": "textbox",
                "type": "text",
                "label": "Textbox",
                "placeholder": "Açıklama.",
                "help":"Düzenle butonuna tıklayarak form elamnını ihtiyaç duyduğunuz şekilde ayarlayabilirsiniz.",
                "isRequired": true,
                "isDynamic": false,
                "url": "",
                "isFiltering": true,
                "filterType": "start",
                "filterMinLength": 3,
                "defaultValue": "",
                "validationType": 0
            },
            {
                "control": "dropdown",
                "label": "Selectbox",
                "placeholder": "Lütfen seçiniz.",
                "help":"Düzenle butonuna tıklayarak form elamnını ihtiyaç duyduğunuz şekilde ayarlayabilirsiniz.",
                "isDynamic": true,
                "url": "http://www.google.com",
                "isFiltering": true,
                "filterType": "start",
                "filterMinLength": 3,
                "isRequired": true,
                "options": [
                    {
                        "option": "Seçenek 1",
                        "val": "1"
                    },
                    {
                        "option": "Seçenek 2",
                        "val": "2"
                    }
                ],
                "defaultValue": ""
            }
        ],
        SelectedIndex: null,
        StartIndex: null,
        FinalIndex: null,
        initFormElements: function () {
            var itemBlockHtml = null;
            var elmHtml = null;

            this.InputJSON.map(function (elm, i) {
                var label = elm.control;

                if (elm.hasOwnProperty('label')) {
                    label = elm.label
                }

                var placeholder = label;

                if (elm.hasOwnProperty('placeholder')) {
                    placeholder = elm.placeholder
                }

                itemBlockHtml = $('<div class="form-group draggable" data-index=' + i + '><label for="' + (elm.type + i) + '">' + label + '</label></div>');


                switch (elm.control) {

                    case "textbox":

                        elmHtml = $('<input type="' + elm.type + '" class="form-control form-item" placeholder="' + placeholder + '" value="' + label + '" />');

                        itemBlockHtml.append(elmHtml);

                        break;
                    case "dropdown":

                        elmHtml = $('<select class="form-control form-item" value={this.props.data.defaultValue} ></select>');
                        elmHtml.append("<option>" + placeholder + "</option>");

                        for (var i = 0; i < elm.options.length; i++) {
                            elmHtml.append("<option value='" + elm.options[i].val + "'>" + elm.options[i].option + "</option>");
                        }

                        itemBlockHtml.append(elmHtml);

                        break;
                    default:
                        break;
                }

                if (itemBlockHtml != null) {
                    itemBlockHtml.appendTo($("#HedefForm"));
                }
            });
        },
        initCreateForm: function () {
            var itemBlockHtml = null;
            var elmHtml = null;
            $("#HedefDiv").html("");

            function compare(a, b) {
                if (a.index < b.index)
                    return -1;
                if (a.index > b.index)
                    return 1;
                return 0;
            }

            this.OutputJSON.sort(compare).map(function (elm, i) {
                var label = elm.control;

                if (elm.hasOwnProperty('label')) {
                    label = elm.label
                }

                var placeholder = label;

                if (elm.hasOwnProperty('placeholder')) {
                    placeholder = elm.placeholder
                }

                itemBlockHtml = $('<div class="form-group draggable dropped" data-index=' + i + '><label for="' + (elm.type + i) + '">' + label + '</label><p class="tools"><a class="edit-link btn btn-success btn-sm">Düzenle<a> <a class="remove-link btn btn-danger btn-sm">Kaldır</a></p></div>');


                switch (elm.control) {

                    case "textbox":

                        elmHtml = $('<input type="' + elm.type + '" class="form-control form-item" placeholder="' + placeholder + '" value="' + label + '" />');

                        itemBlockHtml.append(elmHtml);

                        break;
                    case "dropdown":

                        elmHtml = $('<select class="form-control form-item" value={this.props.data.defaultValue} ></select>');
                        elmHtml.append("<option>" + placeholder + "</option>");

                        for (var i = 0; i < elm.options.length; i++) {
                            elmHtml.append("<option value='" + elm.options[i].val + "'>" + elm.options[i].option + "</option>");
                        }

                        itemBlockHtml.append(elmHtml);

                        break;
                    default:
                        break;
                }

                if (itemBlockHtml != null) {
                    itemBlockHtml.append($("<p class='help-block'>"+elm.help+"</p>"));
                    itemBlockHtml.appendTo($("#HedefDiv"));
                }
            });
        },
        initDraggable: function () {
            $(".draggable").draggable({
                appendTo: "body",
                helper: "clone"
            });
            $(".droppable").droppable({
                accept: ".draggable",
                helper: "clone",
                hoverClass: "droppable-active",
                drop: function (event, ui) {
                    $(".empty-form").remove();
                    var $orig = $(ui.draggable)
                    if (!$(ui.draggable).hasClass("dropped")) {
                        var $el = $orig;

                        var index = $el.attr("data-index");
                        var obj = Object.assign({}, Docya.FormCreator.InputJSON[index]);
                        Docya.FormCreator.OutputJSON.push(obj);

                        Docya.FormCreator.OutputJSON.map((x, l) => {
                            Docya.FormCreator.OutputJSON[l]["index"] = l;
                        });

                        Docya.FormCreator.initCreateForm();

                    }


                }
            }).sortable({
                update: function (event, ui) {
                    console.log('update: ' + ui.item.index())
                    Docya.FormCreator.FinalIndex = ui.item.index();
                    Docya.FormCreator.reSortItems();
                },
                start: function (event, ui) {
                    console.log('start: ' + ui.item.index())
                    Docya.FormCreator.StartIndex = ui.item.index();
                }
            });

        },
        reSortItems: function () {
            Docya.FormCreator.OutputJSON.filter(item => item.index >= Docya.FormCreator.FinalIndex && item.index < Docya.FormCreator.StartIndex)
                .map(x => x.index = x.index + 1);

            Docya.FormCreator.OutputJSON.filter(item => item.index <= Docya.FormCreator.FinalIndex && item.index > Docya.FormCreator.StartIndex)
                .map(x => x.index = x.index - 1);

            Docya.FormCreator.OutputJSON[Docya.FormCreator.StartIndex].index = Docya.FormCreator.FinalIndex;
            Docya.FormCreator.initCreateForm();
        },
        setModal: function () {
            var obj = Docya.FormCreator.OutputJSON[Docya.FormCreator.SelectedIndex];
            Docya.FormCreator.clearModal();

            if (obj.control == "textbox") {
                $("#defaultValueControl").removeClass("hidden");
            }

            if (obj.control == "dropdown") {
                $("#defOptionsControl").removeClass("hidden");
                $("#optionDiv").removeClass("hidden");
            }

            $("#labelControl").val(obj.label);
            $("#placeholderControl").val(obj.placeholder);

            if (obj.isDynamic === true) {
                $("#isDynamicControl").prop('checked', true);
                $("#urlControl").parents(".form-group").removeClass("hidden");
                $("#urlControl").val(obj.url);
            }

            if (obj.isFiltering === true) {
                $("#isFilteringControl").prop('checked', true);
                $("#filterTypeControl").parents(".form-group").removeClass("hidden");
                $("#filterTypeControl").val(obj.filterType);
                $("#filterMinLengthControl").parents(".form-group").removeClass("hidden");
                $("#filterMinLengthControl").val(obj.filterMinLength);
            }

            if (obj.isRequired === true) {
                $("#isRequiredControl").prop('checked', true);
            }

            if (obj.hasOwnProperty('options')) {
                obj.options.map(o => {
                    $("#optionsControl").append("<div class='option-edit' data-value='" + o.val + "'>" + o.option + "<div class='option-edit-btn-delete'>Sil</div> </div>");
                    $("#defOptionsControl").append("<div class='option-edit' data-value='" + o.val + "'>" + o.option + "<div class='option-edit-btn-delete'>Seç</div> </div>");
                });
            }

            if (obj.defaultValue != "") {
                $("#defaultValueControl").val(obj.defaultValue);
            }

        },
        clearModal: function () {

            $("#defaultValueControl").addClass("hidden");
            $("#defOptionsControl").addClass("hidden");
            $("#optionDiv").addClass("hidden");


            $("#labelControl").val("");
            $("#placeholderControl").val("");

            $("#isDynamicControl").prop('checked', false);
            $("#urlControl").parents(".form-group").addClass("hidden");
            $("#urlControl").val("");

            $("#isFilteringControl").prop('checked', false);
            $("#filterTypeControl").parents(".form-group").addClass("hidden");
            $("#filterTypeControl").val("");
            $("#filterMinLengthControl").parents(".form-group").addClass("hidden");
            $("#filterMinLengthControl").val("");

            $("#isRequiredControl").prop('checked', false);

            $("#optionsControl").html("");
            $("#defOptionsControl").html("");

            $("#defaultValueControl").val("");

        },
        initClickEdit: function () {
            $("body").on("click", ".edit-link", function (e) {
                e.preventDefault();
                var btn = $(this);
                var selectElm = btn.parents(".dropped");
                Docya.FormCreator.SelectedIndex = selectElm.attr("data-index");

                // $("#modelContent").html(JSON.stringify(Docya.FormCreator.SelectedObj));
                Docya.FormCreator.setModal();
                $('#myModal').modal('show');

            });
        },
        initClickDelete: function () {
            $("body").on("click", ".remove-link", function (e) {
                e.preventDefault();
                var btn = $(this);
                var selectElm = btn.parents(".dropped");
                Docya.FormCreator.OutputJSON.splice(selectElm.attr("data-index"), 1);

                Docya.FormCreator.OutputJSON.filter(item => item.index > selectElm.attr("data-index"))
                    .map(x => x.index = x.index - 1);

                Docya.FormCreator.initCreateForm();

            });
        },
        initLabelControl: function () {
            $("body").on("blur", "#labelControl", function (e) {
                var elm = $(this);
                var obj = Docya.FormCreator.OutputJSON[Docya.FormCreator.SelectedIndex];

                if (elm.val().length > 0) {
                    obj.label = elm.val();
                    Docya.FormCreator.initCreateForm();
                }

            });
        },
        initPlaceholderControl: function () {
            $("body").on("blur", "#placeholderControl", function (e) {
                var elm = $(this);
                var obj = Docya.FormCreator.OutputJSON[Docya.FormCreator.SelectedIndex];

                obj.placeholder = elm.val();
                Docya.FormCreator.initCreateForm();

            });
        },
        initUrlControl: function () {
            $("body").on("blur", "#urlControl", function (e) {
                var elm = $(this);
                var obj = Docya.FormCreator.OutputJSON[Docya.FormCreator.SelectedIndex];

                obj.url = elm.val();
                Docya.FormCreator.initCreateForm();

            });
        },
        initUrlControl: function () {
            $("body").on("blur", "#urlControl", function (e) {
                var elm = $(this);
                var obj = Docya.FormCreator.OutputJSON[Docya.FormCreator.SelectedIndex];

                obj.url = elm.val();
                Docya.FormCreator.initCreateForm();

            });
        },
        initFilterMinLengthControl: function () {
            $("body").on("blur", "#filterMinLengthControl", function (e) {
                var elm = $(this);
                var obj = Docya.FormCreator.OutputJSON[Docya.FormCreator.SelectedIndex];

                obj.filterMinLength = elm.val();
                Docya.FormCreator.initCreateForm();

            });
        },
        initDefaultValueControl: function () {
            $("body").on("blur", "#defaultValueControl", function (e) {
                var elm = $(this);
                var obj = Docya.FormCreator.OutputJSON[Docya.FormCreator.SelectedIndex];

                obj.defaultValue = elm.val();
                Docya.FormCreator.initCreateForm();

            });
        },
        initCBControl: function () {
            $("body").on("change", "input:checkbox", function (e) {
                var elm = $(this);
                var id = $(this).attr("id").replace("Control", "");
                var obj = Docya.FormCreator.OutputJSON[Docya.FormCreator.SelectedIndex];

                obj[id] = elm.is(':checked');
                Docya.FormCreator.initCreateForm();

                if (id === "isDynamic") {
                    if (elm.is(':checked'))
                        $("#urlControl").parents(".form-group").removeClass("hidden");
                    else
                        $("#urlControl").parents(".form-group").addClass("hidden");
                }

                if (id === "isFiltering") {
                    if (elm.is(':checked')){
                        $("#filterTypeControl").parents(".form-group").removeClass("hidden");
                        $("#filterMinLengthControl").parents(".form-group").removeClass("hidden");
                    }
                    else{
                        $("#filterTypeControl").parents(".form-group").addClass("hidden");
                        $("#filterMinLengthControl").parents(".form-group").addClass("hidden");
                    }
                }

            });
        },
        initElements: function () {
            this.initFormElements();
            this.initDraggable();
            this.initClickEdit();
            this.initClickDelete();
            this.initLabelControl();
            this.initPlaceholderControl();
            this.initUrlControl();
            this.initFilterMinLengthControl();
            this.initDefaultValueControl();
            this.initCBControl();
        },
        init: function () {
            this.initElements();
        }

    }

    $(document).ready(function () {
        w.Docya.FormCreator.init();

    });

})(jQuery, window, document);