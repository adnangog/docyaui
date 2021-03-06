(function ($, w, document, undefined) {
    if (w.Docya == undefined)
        w.Docya = {};

    w.Docya.FormTypeCreator = {
        OutputJSON: JSON.parse($("#fields").val()),
        InputJSON: [
            {
                "control": "textbox",
                "type": "string",
                "fieldName":null,
                "label": null,
                "tempLabel": "Metin",
                "placeholder": null,
                "help": "",
                "isRequired": false,
                "isDynamic": false,
                "url": "",
                "isFiltering": false,
                "filterType": "start",
                "filterMinLength": 3,
                "defaultValue": "",
                "validationType": 0
            },
            {
                "control": "textbox",
                "type": "datetime",
                "fieldName":null,
                "label": null,
                "tempLabel": "Tarih",
                "placeholder": null,
                "help": "",
                "isRequired": false,
                "isDynamic": false,
                "url": "",
                "isFiltering": false,
                "filterType": "start",
                "filterMinLength": 3,
                "defaultValue": "",
                "validationType": 0
            },
            {
                "control": "textbox",
                "type": "number",
                "fieldName":null,
                "label": null,
                "tempLabel": "Sayı",
                "placeholder": null,
                "help": "",
                "isRequired": false,
                "isDynamic": false,
                "url": "",
                "isFiltering": false,
                "filterType": "start",
                "filterMinLength": 3,
                "defaultValue": "",
                "validationType": 0
            },
            {
                "control": "dropdown",
                "type":"select",
                "fieldName":null,
                "label": null,
                "tempLabel": "Liste",
                "placeholder": null,
                "help": "",
                "isDynamic": false,
                "url": null,
                "isFiltering": false,
                "filterType": "start",
                "filterMinLength": 3,
                "isRequired": false,
                "options": [],
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
                    label = elm.label === null ? elm.tempLabel : elm.label;
                }

                var placeholder = label;

                if (elm.hasOwnProperty('placeholder') && elm.placeholder !== null) {
                    placeholder = elm.placeholder
                }

                itemBlockHtml = $('<div class="form-group draggable type-item" data-index=' + i + '>' + label + ' <span class="badge badge-light">'+elm.type+'</span></div>');
                itemBlockHtml.append(elmHtml);


                // switch (elm.control) {

                //     case "textbox":

                //         elmHtml = $('<input type="' + elm.type + '" class="form-control form-item" placeholder="' + placeholder + '" value="' + label + '" />');

                //         itemBlockHtml.append(elmHtml);

                //         break;
                //     case "dropdown":

                //         elmHtml = $('<select class="form-control form-item" value={this.props.data.defaultValue} ></select>');
                //         elmHtml.append("<option>" + placeholder + "</option>");

                //         for (var i = 0; i < elm.options.length; i++) {
                //             elmHtml.append("<option value='" + elm.options[i].val + "'>" + elm.options[i].option + "</option>");
                //         }

                //         itemBlockHtml.append(elmHtml);

                //         break;
                //     default:
                //         break;
                // }

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
                    label = elm.label === null ? elm.tempLabel + " <span class='badge badge-light'>"+elm.type+"</span> <span class='badge badge-danger'>İsim verin</span>" : elm.label + " <span class='badge badge-light'>"+elm.type+"</span>";
                }

                var placeholder = label;

                if (elm.hasOwnProperty('placeholder') && elm.placeholder !== null) {
                    placeholder = elm.placeholder
                }

                itemBlockHtml = $('<div class="form-group draggable dropped" data-index=' + i + '><label for="' + (elm.type + i) + '">' + label + '</label><p class="tools"><a class="edit-link btn btn-secondary text-white btn-sm">Düzenle<a> <a class="remove-link btn btn-danger btn-sm">Kaldır</a></p></div>');

                itemBlockHtml.append(elmHtml);


                // switch (elm.control) {

                //     case "textbox":

                //         elmHtml = $('<input type="' + elm.type + '" class="form-control form-item" placeholder="' + placeholder + '" value="' + label + '" />');

                //         itemBlockHtml.append(elmHtml);

                //         break;
                //     case "dropdown":

                //         elmHtml = $('<select class="form-control form-item" value={this.props.data.defaultValue} ></select>');
                //         elmHtml.append("<option>" + placeholder + "</option>");

                //         for (var i = 0; i < elm.options.length; i++) {
                //             var ek = elm.options[i].val === elm.defaultValue ? " selected='selected'" : "";

                //             elmHtml.append("<option value='" + elm.options[i].val + "' "+ek+" >" + elm.options[i].option + "</option>");
                //         }

                //         itemBlockHtml.append(elmHtml);

                //         break;
                //     default:
                //         break;
                // }

                let helpText = "Düzenle butonuna tıklayarak form elamnını ihtiyaç duyduğunuz şekilde ayarlayabilirsiniz.";
                
                if(elm.help !== ""){
                    helpText = el.help;
                }

                if (itemBlockHtml != null) {
                    itemBlockHtml.append($("<small id='emailHelp' class='form-text text-muted'>" + helpText + "</small><hr/>"));
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
                        var obj = Object.assign({}, Docya.FormTypeCreator.InputJSON[index]);

                        var isExist = Docya.FormTypeCreator.OutputJSON.filter(item => item.control === obj.control && item.type === obj.type);

                        if(isExist.length>0){
                            obj.tempLabel = obj.tempLabel + (isExist.length+1);
                        }

                        Docya.FormTypeCreator.OutputJSON.push(obj);

                        Docya.FormTypeCreator.OutputJSON.map((x, l) => {
                            Docya.FormTypeCreator.OutputJSON[l]["index"] = l;
                        });

                        Docya.FormTypeCreator.initCreateForm();

                    }


                }
            }).sortable({
                update: function (event, ui) {
                    Docya.FormTypeCreator.FinalIndex = ui.item.index();
                    Docya.FormTypeCreator.reSortItems();
                },
                start: function (event, ui) {
                    Docya.FormTypeCreator.StartIndex = ui.item.index();
                }
            });

        },
        reSortItems: function () {
            Docya.FormTypeCreator.OutputJSON.filter(item => item.index >= Docya.FormTypeCreator.FinalIndex && item.index < Docya.FormTypeCreator.StartIndex)
                .map(x => x.index = x.index + 1);

            Docya.FormTypeCreator.OutputJSON.filter(item => item.index <= Docya.FormTypeCreator.FinalIndex && item.index > Docya.FormTypeCreator.StartIndex)
                .map(x => x.index = x.index - 1);

            Docya.FormTypeCreator.OutputJSON[Docya.FormTypeCreator.StartIndex].index = Docya.FormTypeCreator.FinalIndex;
            Docya.FormTypeCreator.initCreateForm();
        },
        setModal: function () {
            var obj = Docya.FormTypeCreator.OutputJSON[Docya.FormTypeCreator.SelectedIndex];
            Docya.FormTypeCreator.clearModal();

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
                Docya.FormTypeCreator.SelectedIndex = selectElm.attr("data-index");

                // $("#modelContent").html(JSON.stringify(Docya.FormTypeCreator.SelectedObj));
                Docya.FormTypeCreator.setModal();
                $('#myModal').modal('show');

            });
        },
        initClickDelete: function () {
            $("body").on("click", ".remove-link", function (e) {
                e.preventDefault();
                var btn = $(this);
                var selectElm = btn.parents(".dropped");
                Docya.FormTypeCreator.OutputJSON.splice(selectElm.attr("data-index"), 1);

                Docya.FormTypeCreator.OutputJSON.filter(item => item.index > selectElm.attr("data-index"))
                    .map(x => x.index = x.index - 1);

                Docya.FormTypeCreator.initCreateForm();

            });
        },
        initLabelControl: function () {
            $("body").on("blur", "#labelControl", function (e) {
                var elm = $(this);
                var obj = Docya.FormTypeCreator.OutputJSON[Docya.FormTypeCreator.SelectedIndex];

                if (elm.val().length > 0) {
                    obj.label = elm.val();
                    obj.fieldName = slugify(obj.label);
                    if(obj.placeholder === null){
                        obj.placeholder = obj.label ;
                        $("#placeholderControl").val(obj.label);
                    }
                    Docya.FormTypeCreator.initCreateForm();
                }

            });
        },
        initPlaceholderControl: function () {
            $("body").on("blur", "#placeholderControl", function (e) {
                var elm = $(this);
                var obj = Docya.FormTypeCreator.OutputJSON[Docya.FormTypeCreator.SelectedIndex];

                obj.placeholder = elm.val();
                Docya.FormTypeCreator.initCreateForm();

            });
        },
        initUrlControl: function () {
            $("body").on("blur", "#urlControl", function (e) {
                var elm = $(this);
                var obj = Docya.FormTypeCreator.OutputJSON[Docya.FormTypeCreator.SelectedIndex];

                obj.url = elm.val();
                Docya.FormTypeCreator.initCreateForm();

            });
        },
        initUrlControl: function () {
            $("body").on("blur", "#urlControl", function (e) {
                var elm = $(this);
                var obj = Docya.FormTypeCreator.OutputJSON[Docya.FormTypeCreator.SelectedIndex];

                obj.url = elm.val();
                Docya.FormTypeCreator.initCreateForm();

            });
        },
        initFilterMinLengthControl: function () {
            $("body").on("blur", "#filterMinLengthControl", function (e) {
                var elm = $(this);
                var obj = Docya.FormTypeCreator.OutputJSON[Docya.FormTypeCreator.SelectedIndex];

                obj.filterMinLength = elm.val();
                Docya.FormTypeCreator.initCreateForm();

            });
        },
        initDefaultValueControl: function () {
            $("body").on("blur", "#defaultValueControl", function (e) {
                var elm = $(this);
                var obj = Docya.FormTypeCreator.OutputJSON[Docya.FormTypeCreator.SelectedIndex];

                obj.defaultValue = elm.val();
                Docya.FormTypeCreator.initCreateForm();

            });
        },
        initHelpControl: function () {
            $("body").on("blur", "#helpControl", function (e) {
                var elm = $(this);
                var obj = Docya.FormTypeCreator.OutputJSON[Docya.FormTypeCreator.SelectedIndex];

                obj.help = elm.val();
                Docya.FormTypeCreator.initCreateForm();

            });
        },
        initCBControl: function () {
            $("body").on("change", "input:checkbox", function (e) {
                var elm = $(this);
                var id = $(this).attr("id").replace("Control", "");
                var obj = Docya.FormTypeCreator.OutputJSON[Docya.FormTypeCreator.SelectedIndex];

                obj[id] = elm.is(':checked');
                Docya.FormTypeCreator.initCreateForm();

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
                var obj = Docya.FormTypeCreator.OutputJSON[Docya.FormTypeCreator.SelectedIndex];

                obj.options.splice(parent.attr("data-index"), 1);

                $("#optionsControl").html("");
                $("#defOptionsControl").html("");

                obj.options.map((o, i) => {
                    var ek = o.val === obj.defaultValue ? "  <span class='badge badge-danger'>Default</span>" : "";
                    $("#optionsControl").append("<div class='option-edit' data-index='" + i + "'>" + o.option + "<div class='option-edit-btn-delete' data-option-delete><i class='fas fa-times'></i> Sil</div> </div>");
                    $("#defOptionsControl").append("<div class='option-edit' data-value='" + o.val + "'>" + o.option + ek + "<div class='option-edit-btn-delete' data-option-select><i class='fas fa-check'></i> Seç</div> </div>");
                });

                Docya.FormTypeCreator.initCreateForm();

            });
        },
        initOptionSelect: function () {
            $("body").on("click", "[data-option-select]", function () {
                var elm = $(this);
                var parent = elm.parent();
                var obj = Docya.FormTypeCreator.OutputJSON[Docya.FormTypeCreator.SelectedIndex];

                obj.defaultValue = parent.attr("data-value");

                $("#defOptionsControl").html("");

                obj.options.map((o, i) => {
                    var ek = o.val === parent.attr("data-value") ? "  <span class='badge badge-danger'>Default</span>" : "";
                    $("#defOptionsControl").append("<div class='option-edit' data-value='" + o.val + "'>" + o.option + ek + "<div class='option-edit-btn-delete' data-option-select><i class='fas fa-check'></i> Seç</div> </div>");
                });

                Docya.FormTypeCreator.initCreateForm();

            });
        },
        initOptionAdd: function () {
            $("body").on("click", "#addOptionBtnControl", function () {
                var elm = $(this);
                var label = $("#addOptionControl").val();
                var val = $("#addOptionControlVal").val();
                var obj = Docya.FormTypeCreator.OutputJSON[Docya.FormTypeCreator.SelectedIndex];

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

                        Docya.FormTypeCreator.initCreateForm();
                    }
                }

            });
        },
        initSelectOption: function () {
            $("body").on("change", "input[type='radio'][name='selectOption']", function (e) {

                var jqElm = $(this);

                var val = jqElm.val();

                if(val==='1'){
                    $("[data-staticoption]").removeClass("d-none");
                    $("[data-dynamicoption]").addClass("d-none");
                }else{
                    $("[data-staticoption]").addClass("d-none");
                    $("[data-dynamicoption]").removeClass("d-none");
                }

                

                // var task = Docya.FlowController.outputJson.filter(function (a) {
                //     return a.id === Docya.FlowController.selectedTask;
                // })[0];

                // if (val.indexOf(".") < 0) {
                //     task[val] = jqElm.val();
                // } else {
                //     var vals = val.split(".");
                //     var newProp = Object.assign({}, task[vals[0]]);
                //     newProp[vals[1]] = jqElm.val();
                //     task[vals[0]] = newProp;
                // }

            });
        },
        initBtnSave: function () {
            $("body").on("click", "#btnSaveForm", function (e) {
                e.preventDefault();

                if($("#formName").val()==""){
                    alert("Lütfen form adı girin.");
                    return false;
                }

                if(Docya.FormTypeCreator.OutputJSON.length===0){
                    alert("Lütfen en az bir tane form elemanı oluşturun.");
                    return false;
                }

                $("#fields").val(JSON.stringify(Docya.FormTypeCreator.OutputJSON));

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
            this.initSelectOption();
            this.initBtnSave();
        },
        init: function () {
            this.initElements();
        }

    }

    $(document).ready(function () {
        w.Docya.FormTypeCreator.init();
        w.Docya.FormTypeCreator.initCreateForm();

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