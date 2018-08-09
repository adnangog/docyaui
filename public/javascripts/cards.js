(function ($, w, document, undefined) {
    if (w.Docya == undefined)
        w.Docya = {};

    w.Docya.CardController = {
        DocumentJSON: null,
        InputJSON: [],
        SelectedFolder: null,
        SelectedFolderName: null,
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
                if(i===0)
                    $(".empty-form").remove();
                    
                var label = elm.control;

                if (elm.hasOwnProperty('label')) {
                    label = elm.label
                }

                var placeholder = label;

                if (elm.hasOwnProperty('placeholder')) {
                    placeholder = elm.placeholder
                }

                itemBlockHtml = $('<div class="form-group draggable dropped" data-index=' + i + '><label for="' + (elm.type + i) + '">' + label + '</label><p class="tools"><a class="edit-link btn btn-secondary text-white btn-sm">Düzenle<a> <a class="remove-link btn btn-danger btn-sm">Kaldır</a></p></div>');


                switch (elm.control) {

                    case "textbox":

                        elmHtml = $('<input type="' + elm.type + '" class="form-control form-item" placeholder="' + placeholder + '" value="' + label + '" />');

                        itemBlockHtml.append(elmHtml);

                        break;
                    case "dropdown":

                        elmHtml = $('<select class="form-control form-item" value={this.props.data.defaultValue} ></select>');
                        elmHtml.append("<option>" + placeholder + "</option>");

                        for (var i = 0; i < elm.options.length; i++) {
                            var ek = elm.options[i].val === elm.defaultValue ? " selected='selected'" : "";

                            elmHtml.append("<option value='" + elm.options[i].val + "' "+ek+" >" + elm.options[i].option + "</option>");
                        }

                        itemBlockHtml.append(elmHtml);

                        break;
                    default:
                        break;
                }

                if (itemBlockHtml != null) {
                    itemBlockHtml.append($("<small id='emailHelp' class='form-text text-muted'>" + elm.help + "</small>"));
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

                        var isExist = Docya.FormCreator.OutputJSON.filter(item => item.control === obj.control && item.type === obj.type);

                        if(isExist.length>0){
                            obj.label = obj.label + (isExist.length+1);
                        }

                        Docya.FormCreator.OutputJSON.push(obj);

                        Docya.FormCreator.OutputJSON.map((x, l) => {
                            Docya.FormCreator.OutputJSON[l]["index"] = l;
                        });

                        Docya.FormCreator.initCreateForm();

                    }


                }
            }).sortable({
                update: function (event, ui) {
                    Docya.FormCreator.FinalIndex = ui.item.index();
                    Docya.FormCreator.reSortItems();
                },
                start: function (event, ui) {
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
                $("#defaultValueControl").removeClass("d-none");
            }

            if (obj.control == "dropdown") {
                $("#defOptionsControl").removeClass("d-none");
                $("#optionDiv").removeClass("d-none");
            }

            $("#labelControl").val(obj.label);
            $("#placeholderControl").val(obj.placeholder);

            if (obj.isDynamic === true) {
                $("#isDynamicControl").prop('checked', true);
                $("#urlControl").parents(".form-group").removeClass("d-none");
                $("#urlControl").val(obj.url);
            }

            if (obj.isFiltering === true) {
                $("#isFilteringControl").prop('checked', true);
                $("#filterTypeControl").parents(".form-group").removeClass("d-none");
                $("#filterTypeControl").val(obj.filterType);
                $("#filterMinLengthControl").parents(".form-group").removeClass("d-none");
                $("#filterMinLengthControl").val(obj.filterMinLength);
            }

            if (obj.isRequired === true) {
                $("#isRequiredControl").prop('checked', true);
            }

            if (obj.hasOwnProperty('options')) {
                obj.options.map((o, i) => {
                    var ek = o.val === obj.defaultValue ? "  <span class='badge badge-danger'>Default</span>" : "";
                    $("#optionsControl").append("<div class='option-edit' data-index='" + i + "'>" + o.option + "<div class='option-edit-btn-delete' data-option-delete><i class='fas fa-times'></i> Sil</div> </div>");
                    $("#defOptionsControl").append("<div class='option-edit' data-value='" + o.val + "'>" + o.option + ek + "<div class='option-edit-btn-delete' data-option-select><i class='fas fa-check'></i> Seç</div> </div>");
                });
            }

            if (obj.defaultValue != "") {
                $("#defaultValueControl").val(obj.defaultValue);
            }

            if (obj.help != "") {
                $("#helpControl").val(obj.help);
            }

        },
        clearModal: function () {

            $("#defaultValueControl").addClass("d-none");
            $("#defOptionsControl").addClass("d-none");
            $("#optionDiv").addClass("d-none");


            $("#labelControl").val("");
            $("#placeholderControl").val("");

            $("#isDynamicControl").prop('checked', false);
            $("#urlControl").parents(".form-group").addClass("d-none");
            $("#urlControl").val("");

            $("#isFilteringControl").prop('checked', false);
            $("#filterTypeControl").parents(".form-group").addClass("d-none");
            $("#filterTypeControl").val("");
            $("#filterMinLengthControl").parents(".form-group").addClass("d-none");
            $("#filterMinLengthControl").val("");

            $("#isRequiredControl").prop('checked', false);

            $("#optionsControl").html("");
            $("#defOptionsControl").html("");

            $("#defaultValueControl").val("");
            $("#helpControl").val("");

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
        initHelpControl: function () {
            $("body").on("blur", "#helpControl", function (e) {
                var elm = $(this);
                var obj = Docya.FormCreator.OutputJSON[Docya.FormCreator.SelectedIndex];

                obj.help = elm.val();
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
                        $("#urlControl").parents(".form-group").removeClass("d-none");
                    else
                        $("#urlControl").parents(".form-group").addClass("d-none");
                }

                if (id === "isFiltering") {
                    if (elm.is(':checked')) {
                        $("#filterTypeControl").parents(".form-group").removeClass("d-none");
                        $("#filterMinLengthControl").parents(".form-group").removeClass("d-none");
                    }
                    else {
                        $("#filterTypeControl").parents(".form-group").addClass("d-none");
                        $("#filterMinLengthControl").parents(".form-group").addClass("d-none");
                    }
                }

            });
        },
        initOptionDelete: function () {
            $("body").on("click", "[data-option-delete]", function () {
                var elm = $(this);
                var parent = elm.parent();
                var obj = Docya.FormCreator.OutputJSON[Docya.FormCreator.SelectedIndex];

                obj.options.splice(parent.attr("data-index"), 1);

                $("#optionsControl").html("");
                $("#defOptionsControl").html("");

                obj.options.map((o, i) => {
                    var ek = o.val === obj.defaultValue ? "  <span class='badge badge-danger'>Default</span>" : "";
                    $("#optionsControl").append("<div class='option-edit' data-index='" + i + "'>" + o.option + "<div class='option-edit-btn-delete' data-option-delete><i class='fas fa-times'></i> Sil</div> </div>");
                    $("#defOptionsControl").append("<div class='option-edit' data-value='" + o.val + "'>" + o.option + ek + "<div class='option-edit-btn-delete' data-option-select><i class='fas fa-check'></i> Seç</div> </div>");
                });

                Docya.FormCreator.initCreateForm();

            });
        },
        initOptionSelect: function () {
            $("body").on("click", "[data-option-select]", function () {
                var elm = $(this);
                var parent = elm.parent();
                var obj = Docya.FormCreator.OutputJSON[Docya.FormCreator.SelectedIndex];

                obj.defaultValue = parent.attr("data-value");

                $("#defOptionsControl").html("");

                obj.options.map((o, i) => {
                    var ek = o.val === parent.attr("data-value") ? "  <span class='badge badge-danger'>Default</span>" : "";
                    $("#defOptionsControl").append("<div class='option-edit' data-value='" + o.val + "'>" + o.option + ek + "<div class='option-edit-btn-delete' data-option-select><i class='fas fa-check'></i> Seç</div> </div>");
                });

                Docya.FormCreator.initCreateForm();

            });
        },
        initOptionAdd: function () {
            $("body").on("click", "#addOptionBtnControl", function () {
                var elm = $(this);
                var label = $("#addOptionControl").val();
                var val = $("#addOptionControlVal").val();
                var obj = Docya.FormCreator.OutputJSON[Docya.FormCreator.SelectedIndex];

                if (label.length > 0) {
                    var isExist = obj.options.filter(option => option.option === label || option.val === val);
                    if (isExist.length > 0) {
                        alert("Bu seçenek mevcut!");
                    } else {
                        obj.options.push({ option: label, val: val != "" ? val : label });

                        $("#optionsControl").html("");
                        $("#defOptionsControl").html("");

                        obj.options.map((o, i) => {
                            var ek = o.val === obj.defaultValue ? "  <span class='badge badge-danger'>Default</span>" : "";
                            $("#optionsControl").append("<div class='option-edit' data-index='" + i + "'>" + o.option + "<div class='option-edit-btn-delete' data-option-delete><i class='fas fa-times'></i> Sil</div> </div>");
                            $("#defOptionsControl").append("<div class='option-edit' data-value='" + o.val + "'>" + o.option + ek + "<div class='option-edit-btn-delete' data-option-select><i class='fas fa-check'></i> Seç</div> </div>");
                        });

                        Docya.FormCreator.initCreateForm();
                    }
                }

            });
        },
        initBtnSave: function () {
            $("body").on("click", "#btnSaveForm", function (e) {
                e.preventDefault();

                if($("#formName").val()==""){
                    alert("Lütfen form adı girin.");
                    return false;
                }

                if(Docya.FormCreator.OutputJSON.length===0){
                    alert("Lütfen en az bir tane form elemanı oluşturun.");
                    return false;
                }

                $("#fields").val(JSON.stringify(Docya.FormCreator.OutputJSON));

                $("#createForm").submit();
                return true;

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
            this.initHelpControl();
            this.initCBControl();
            this.initOptionDelete();
            this.initOptionSelect();
            this.initOptionAdd();
            this.initBtnSave();
        },
        init: function () {
            this.initElements();
        }

    }

    $(document).ready(function () {
        w.Docya.FormCreator.init();
        w.Docya.FormCreator.initCreateForm();

    });

})(jQuery, window, document);