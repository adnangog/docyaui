(function ($, w, document, undefined) {
    if (w.Docya == undefined)
        w.Docya = {};

    w.Docya.UserController = {
        initialUser: JSON.parse($("[data-u]").val()),
        user: {
            name: null,
            avatar: null,
            proxy: null
        },
        bindValues: function () {
            $("#name").val(this.initialUser.name);
            $("#proxy").val(this.initialUser.proxy);

            Docya.UserController.user.name = this.initialUser.name;
            Docya.UserController.user.proxy = this.initialUser.proxy;
        },
        initDropzone: function () {
            var previewNode = document.querySelector("#template");
            previewNode.id = "";
            var previewTemplate = previewNode.parentNode.innerHTML;
            previewNode.parentNode.removeChild(previewNode);

            var myDropzone = new Dropzone(document.body, { // Make the whole body a dropzone
                url: "/cards/upload", // Set the url
                thumbnailWidth: 80,
                thumbnailHeight: 80,
                maxFilesize: 1,
                uploadMultiple: false,
                autoQueue: false,
                accept: function (file, done) {
                    reader = new FileReader();
                    reader.onload = handleReaderLoad;
                    reader.readAsDataURL(file);
                    function handleReaderLoad(evt) {
                        Docya.UserController.user.avatar = evt.target.result;
                        $("[data-avatar]").attr("src", Docya.UserController.user.avatar);
                    };
                    done();
                },
                init: function () {
                    this.on("addedfile", function (file) {
                        $("[data-removeavatar]").removeClass("d-none");
                        if (this.files.length === 2) {
                            this.removeFile(this.files[0]);
                        }

                    });
                },
                previewTemplate: previewTemplate,
                previewsContainer: "#previews", // Define the container to display the previews
                clickable: ".fileinput-button" // Define the element that should be used as click trigger to select files.
            });

        },
        initRemoveAvatar: function () {
            $("body").on("click", "[data-removeavatar]", function (e) {
                e.preventDefault();
                e.stopPropagation();

                $("[data-avatar]").attr("src", Docya.UserController.initialUser.avatar);

                Docya.UserController.user.avatar = null;

                $("[data-removeavatar]").addClass("d-none");

            });
        },
        initTxtBoxChange: function () {
            $("body").on("blur", "input[data-target]", function (e) {
                e.preventDefault();
                var jqElm = $(this);

                Docya.UserController.user[jqElm.attr("data-target")]=jqElm.val();

            })
        },
        initDdlChange: function () {
            $("body").on("change", "select[data-target]", function (e) {
                e.preventDefault();
                var jqElm = $(this);

                Docya.UserController.user[jqElm.attr("data-target")]=jqElm.val();

            })
        },
        initBtnSave: function () {
            $("body").on("click", "[data-save]", function (e) {
                e.preventDefault();

                var errors = [];
                var obj = Docya.UserController.user;

                if (obj.name === null || obj.name === "")
                    errors.push("Adınızı giriniz.");


                if (errors.length > 0) {
                    let errorHtml = "<ul>";
                    errors.map(x => {
                        errorHtml += "<li>" + x + "</li>";
                    });
                    errorHtml += "</ul>";
                    showMessageBox("danger", "UYARI", errorHtml);
                    return false;
                }

                let data = {
                    process: "updateUser",
                    user: JSON.stringify(Docya.UserController.user)
                };

                let cb = function (data) {
                    if (data.messageType === 1) {
                        showMessageBox("success", "BİLGİ", data.message);

                    } else {
                        showMessageBox("danger", "UYARI", data.message);
                    }

                };
                Docya.UserController.initAjax(data, cb);

            });
        },
        initAjax: function (data, cb) {
            $.ajax({
                dataType: "json",
                url: '/ajax',
                type: 'post',
                data: data,
                success: cb
            });
        },
        initElements: function () {
            this.bindValues();
            this.initDropzone();
            this.initRemoveAvatar();
            this.initBtnSave();
            this.initTxtBoxChange();
            this.initDdlChange();
        },
        init: function () {
            this.initElements();
        }

    }

    $(document).ready(function () {
        w.Docya.UserController.init();
    });

})(jQuery, window, document);