(function ($, w, document, undefined) {
    if (w.Docya == undefined) w.Docya = {};

    w.Docya.OrganizationController = {
        Tree: [
            {
                id: 0,
                parent: 0,
                index: 0,
                title: 'AGOG',
                name: 'Adnan GOG',
                sub: 'Satış'
            },
            {
                id: 1,
                parent: 0,
                index: 1,
                title: 'SATIŞ',
                name: 'Adnan GOG',
                sub: 'Satış'
            },
            {
                id: 3,
                parent: 0,
                index: 1,
                title: 'PAZARLAMA2',
                name: 'Adnan GOG',
                sub: 'Satış'
            },
            {
                id: 6,
                parent: 3,
                index: 2,
                title: 'PAZARLAMA3',
                name: 'Adnan GOG',
                sub: 'Satış'
            },
            {
                id: 7,
                parent: 3,
                index: 2,
                title: 'PAZARLAMA4',
                name: 'Adnan GOG',
                sub: 'Satış'
            },
            {
                id: 8,
                parent: 3,
                index: 2,
                title: 'PAZARLAMA5',
                name: 'Adnan GOG',
                sub: 'Satış'
            },
            {
                id: 4,
                parent: 0,
                index: 1,
                title: 'IT',
                name: 'Adnan GOG',
                sub: 'Satış'
            },
            {
                id: 2,
                parent: 4,
                index: 2,
                title: 'Adnan GOG',
                name: 'Adnan GOG',
                sub: 'Satış'
            },
            {
                id: 5,
                parent: 4,
                index: 2,
                title: 'Ahmet Muhip',
                name: 'Ahmet Muhip',
                sub: 'Satış'
            }
        ],
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
                    parent.append(
                        $(
                            '<div class="organizatinBox" style="left:' + left + 'px; top: ' + top + 'px;" id="Element' + x.id + '" data-id="' + x.id + '"> \
                                <button class="btn btn-danger btn-sm organization-delete" data-delete><i class="fas fa-times"></i></button>\
                                <div class="box-title">'+ x.title + '</div>\
                                <div class="person">'+ x.name + '</div>\
                                <div class="title">'+ x.sub + '</div>\
                                <div class="buttons">\
                                    <button class="btn btn-secondary btn-sm" data-edit><i class="fas fa-pencil-alt"></i></button>\
                                    <button class="btn btn-success btn-sm" data-add data-type="1"><i class="fas fa-users"></i></button>\
                                    <button class="btn btn-success btn-sm" data-add data-type="2"><i class="fas fa-user-plus"></i></button>\
                                    </div>\
                            </div>'
                        )
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
        },
        initNodeDelete: function () {
            $("body").on("click", "[data-delete]", function (e) {
                e.preventDefault();

                var id = parseInt($(this).parent().attr("data-id"));

                if(id===0){
                    showMessageBox(
                        "danger",
                        "Uyari",
                        "Kök elementi silemezsiniz!"
                    );
                }else{
                    Docya.OrganizationController.Tree = Docya.OrganizationController.Tree.filter(function(a){return a.id !== id && a.parent !== id});
                Docya.OrganizationController.createTree();
                }

            });
        },
        initNodeEdit: function () {
            $("body").on("click", "[data-edit]", function (e) {
                e.preventDefault();
                var id = parseInt($(this).parents(".organizatinBox").attr("data-id"));

                $('#organizationModal').modal('show');
            });
        },
        initNodeAdd: function () {
            $("body").on("click", "[data-add]", function (e) {
                e.preventDefault();
                var id = parseInt($(this).parents(".organizatinBox").attr("data-id"));
                var type = parseInt($(this).attr("data-type"));

                $('#organizationModal').modal('show');

            });
        },
        initElements: function () {
            this.createTree();
            this.initNodeDelete();
            this.initNodeEdit();
            this.initNodeAdd();
        },
        init: function () {
            this.initElements();
        }
    };

    $(document).ready(function () {
        w.Docya.OrganizationController.init();
    });
})(jQuery, window, document);
