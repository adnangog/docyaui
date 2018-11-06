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
                id:3,
                parent:0,
                index:1,
                title:'PAZARLAMA',
                name:'Adnan GOG',
                sub:'Satış'
            },
            {
                id:4,
                parent:0,
                index:1,
                title:'IT',
                name:'Adnan GOG',
                sub:'Satış'
            },
            {
                id:2,
                parent:4,
                index:2,
                title:'Adnan GOG',
                name:'Adnan GOG',
                sub:'Satış'
            },
            {
                id:5,
                parent:4,
                index:2,
                title:'Ahmet Muhip',
                name:'Ahmet Muhip',
                sub:'Satış'
            }
        ],
        createTree: function () {
            var parent = $("[data-parent]");
            parent.html("");
            Docya.OrganizationController.Tree.map(x => {
                var parentWidth = parent.width();
                var group = Docya.OrganizationController.Tree.filter(function(a){ return a.index === x.index});
                var parents = Docya.OrganizationController.Tree.filter(function(a){ return a.index === (x.index-1)});

                var index=0;
                var parentIndex=0;

                group.map(function(a,i){
                    if(a.id===x.id){
                        index=i;
                    }
                })

                parents.map(function(a,i){
                    if(a.id===x.parent){
                        parentIndex=i;
                    }
                })


                if(x.index===0){
                    left = (parentWidth/2)-(180/2);
                    top=0;
                }else{
                    parentWidth = parentWidth/parents.length;
                    var left = (parentIndex*parentWidth) + (((parentWidth/group.length)*(index))+(parentWidth/group.length)/2)-(180/2);
                    var top = x.index * 130;
                }
                parent.append(
                    $(
                        '<div class="organizatinBox" style="left:'+left+'px; top: '+top+'px;"> \
                                <div class="box-title">'+x.title+'</div>\
                                <div class="person">'+x.name+'</div>\
                                <div class="title">'+x.sub+'</div>\
                                <div class="buttons">\
                                    <button class="btn btn-secondary btn-sm"><i class="fas fa-pencil-alt"></i></button>\
                                    <button class="btn btn-success btn-sm"><i class="fas fa-users"></i></button>\
                                    <button class="btn btn-success btn-sm"><i class="fas fa-user-plus"></i></button>\
                                    <button class="btn btn-danger btn-sm"><i class="fas fa-times"></i></button>\
                                    </div>\
                            </div>'
                    )
                );
            });
        },
        initElements: function () {
            this.createTree();
        },
        init: function () {
            this.initElements();
        }
    };

    $(document).ready(function () {
        w.Docya.OrganizationController.init();
    });
})(jQuery, window, document);
