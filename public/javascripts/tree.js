$.fn.extend({
    treed: function (o) {
      
      var openedClass = 'fa-minus';
      var closedClass = 'fa-plus';
      
      if (typeof o != 'undefined'){
        if (typeof o.openedClass != 'undefined'){
        openedClass = o.openedClass;
        }
        if (typeof o.closedClass != 'undefined'){
        closedClass = o.closedClass;
        }
      };
      
        //initialize each of the top levels
        var tree = $(this);
        tree.addClass("tree");
        tree.find('li').has("ul").each(function () {
            var branch = $(this); //li with children ul
            branch.prepend("<i class='far " + openedClass + "'></i>");
            branch.addClass('branch');
            branch.on('dblclick', function (e) {
                if (this == e.target) {
                    var icon = $(this).children('i:first');
                    icon.toggleClass(openedClass + " " + closedClass);
                    $(this).children().children().toggle();
                }
            })
            // branch.children().children().toggle(); // all nodes are closed
        });
        tree.find('li[data-folder]:not(.branch)').each(function () {
            var branch = $(this); //li with children ul
            branch.prepend("<i class='far " + closedClass + "'></i>");
            branch.addClass('notBranch');
        });
        tree.find('li[data-document]').each(function () {
            var branch = $(this); //li with children ul
            branch.prepend("<i class='fas fa-file'></i>");
        });
        //fire event from the dynamically added icon
      tree.find('.branch .indicator').each(function(){
        $(this).on('click', function () {
            $(this).closest('li').click();
        });
      });
        //fire event to open branch if the li contains an anchor instead of text
        tree.find('.branch>a').each(function () {
            $(this).on('click', function (e) {
                $(this).closest('li').click();
                e.preventDefault();
            });
        });
        //fire event to open branch if the li contains a button instead of text
        tree.find('.branch>button').each(function () {
            $(this).on('click', function (e) {
                $(this).closest('li').click();
                e.preventDefault();
            });
        });
    }
});