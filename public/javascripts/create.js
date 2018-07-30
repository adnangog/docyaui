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
        SelectedObj: null,
        SelectedIndex: null,
        StartIndex:null,
        FinalIndex:null,
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
        
                if (itemBlockHtml != null){
                    itemBlockHtml.appendTo($("#HedefForm"));
                }
            });
        },
        initCreateForm: function () {
            var itemBlockHtml = null;
            var elmHtml = null;
            $("#HedefDiv").html("");

            function compare(a,b) {
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
        
                if (itemBlockHtml != null){
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

                        Docya.FormCreator.OutputJSON.map((x,l)=>{
                            Docya.FormCreator.OutputJSON[l]["index"]=l;
                        });

                        Docya.FormCreator.initCreateForm();
        
                    }


                }
            }).sortable({
                update: function(event, ui) { 
                    console.log('update: '+ui.item.index())
                    Docya.FormCreator.FinalIndex=ui.item.index();
                    Docya.FormCreator.reSortItems();
                },
                start: function(event, ui) { 
                    console.log('start: ' + ui.item.index())
                    Docya.FormCreator.StartIndex=ui.item.index();
                }
            });
        
        },
        reSortItems: function(){
            Docya.FormCreator.OutputJSON.filter(item => item.index >= Docya.FormCreator.FinalIndex && item.index < Docya.FormCreator.StartIndex)
            .map(x=>x.index=x.index+1);

            Docya.FormCreator.OutputJSON.filter(item => item.index <= Docya.FormCreator.FinalIndex && item.index > Docya.FormCreator.StartIndex)
            .map(x=>x.index=x.index-1);

            Docya.FormCreator.OutputJSON[Docya.FormCreator.StartIndex].index=Docya.FormCreator.FinalIndex;
            Docya.FormCreator.initCreateForm();
        },
        initClickEdit: function(){
            $("body").on("click", ".edit-link", function (e) {
                e.preventDefault();
                var btn = $(this);
                var selectElm = btn.parents(".dropped");
                Docya.FormCreator.SelectedObj = Docya.FormCreator.OutputJSON[selectElm.attr("data-index")];
                Docya.FormCreator.SelectedIndex = selectElm.attr("data-index");

            });
        },
        initClickDelete: function(){
            $("body").on("click", ".remove-link", function (e) {
                e.preventDefault();
                var btn = $(this);
                var selectElm = btn.parents(".dropped");
                Docya.FormCreator.OutputJSON.splice(selectElm.attr("data-index"),1);

                Docya.FormCreator.OutputJSON.filter(item => item.index > selectElm.attr("data-index"))
            .map(x=>x.index=x.index-1);

                Docya.FormCreator.initCreateForm();

            });
        },
        initElements: function () {
            this.initFormElements();
            this.initDraggable();
            this.initClickEdit();
            this.initClickDelete();
        },
        init: function () {
            this.initElements();
        }

    }

    $(document).ready(function () {
        w.Docya.FormCreator.init();

    });

})(jQuery, window, document);