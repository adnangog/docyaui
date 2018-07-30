
$(document).ready(function () {

    var availableElements = [
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
    ];

    initElements(availableElements);

    setup_draggable();

    $("#copy-to-json").on("click", function () {

        return false;
    })


});

var initElements = function (elms) {
    var itemBlockHtml = null;
    var elmHtml = null;

    elms.map(function (elm, i) {
        var label = elm.control;

        if (elm.hasOwnProperty('label')) {
            label = elm.label
        }

        var placeholder = label;

        if (elm.hasOwnProperty('placeholder')) {
            placeholder = elm.placeholder
        }

        itemBlockHtml = $('<div class="form-group draggable"><label for="' + (elm.type + i) + '">' + label + '</label></div>');


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

        if (itemBlockHtml != null)
            itemBlockHtml.appendTo("#HedefForm");
    });
}

var setup_draggable = function () {
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

                var $el = $orig
                    .clone()
                    .addClass("dropped")
                    .css({ "position": "static", "left": null, "right": null })
                    .appendTo(this);

                // update id
                var id = $orig.find(":input").attr("id");

                if (id) {
                    id = id.split("-").slice(0, -1).join("-") + "-"
                        + (parseInt(id.split("-").slice(-1)[0]) + 1)

                    $orig.find(":input").attr("id", id);
                    $orig.find("label").attr("for", id);
                }

                // tools
                $('<p class="tools">\
						<a class="edit-link">Düzenle<a> | \
						<a class="remove-link">Kaldır</a></p>').prependTo($el);
            } else {
                if ($(this)[0] != $orig.parent()[0]) {
                    var $el = $orig
                        .clone()
                        .css({ "position": "static", "left": null, "right": null })
                        .appendTo(this);
                    $orig.remove();
                }
            }
        }
    }).sortable();

}

var get_modal = function (content) {
    var modal = $('<div class="modal" style="overflow: auto;" tabindex="-1">\
			<div class="modal-dialog">\
				<div class="modal-content">\
					<div class="modal-header">\
						<a type="button" class="close"\
							data-dismiss="modal" aria-hidden="true">&times;</a>\
						<h4 class="modal-title">Düzenle</h4>\
					</div>\
					<div class="modal-body ui-front">\
						<textarea class="form-control" \
							style="min-height: 200px; margin-bottom: 10px;\
							font-family: Monaco, Fixed">'+ content + '</textarea>\
						<button class="btn btn-success">Update</button>\
					</div>\
				</div>\
			</div>\
			</div>').appendTo(document.body);

    return modal;
};

$(document).on("click", ".edit-link", function (ev) {
    var $el = $(this).parent().parent();
    var $el_copy = $el.clone();

    var $edit_btn = $el_copy.find(".edit-link").parent().remove();

    var $modal = get_modal($el_copy.html()).modal("show");
    $modal.find(":input:first").focus();
    $modal.find(".btn-success").click(function (ev2) {
        var html = $modal.find("textarea").val();
        if (!html) {
            $el.remove();
        } else {
            $el.html(html);
            $edit_btn.appendTo($el);
        }
        $modal.modal("hide");
        return false;
    })
});

$(document).on("click", ".remove-link", function (ev) {
    $(this).parent().parent().remove();
});