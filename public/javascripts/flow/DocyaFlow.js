(function ($, w, document, undefined) {

    if (typeof Object.assign != 'function') {
        Object.assign = function (target) {
            'use strict';
            if (target == null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            target = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source != null) {
                    for (var key in source) {
                        if (Object.prototype.hasOwnProperty.call(source, key)) {
                            target[key] = source[key];
                        }
                    }
                }
            }
            return target;
        };
    }

    if (w.Docya == undefined)
        w.Docya = {};
    w.Docya.FlowController = {
        SceneId: "FlowScene",
        NumberOfShapes: 0,
        selectedTask: null,
        isEdit: $("#flowtemplate").val().length > 0,
        nodes: $("#flowtemplate").val().length > 0 ? JSON.parse($("#flowtemplate").val()).nodes : [],
        connections: $("#flowtemplate").val().length > 0 ? JSON.parse($("#flowtemplate").val()).connections : [],
        positionX: 0,
        positionY: 0,
        users: [],
        groups: [],
        forms: [],
        organizations: [],
        departments: [],
        methods: [],
        flows: [],
        inputs: ["[input.Email]", "[input.Title]", "[input.Body]", "[input.Person]"],
        outputs: ["[output.Email]", "[output.Title]", "[output.Body]", "[output.Person]"],
        outputJson: $("#flowtemplate").val().length > 0 ? JSON.parse($("#flowtemplate").val()).steps : [
            {
                id: "flowchartStartpoint",
                name: "Başlangıç",
                type: "start",
                assignmentDate: null,
                next: null
            },
            {
                id: "flowchartEndpoint",
                name: "Bitiş",
                type: "end"
            }
        ],
        taskTypes: [
            {
                id: null,
                name: "Başlangıç",
                type: "start",
                assignmentDate: null,
                next: null
            },
            {
                id: null,
                name: null,
                type: "manual",
                description: null,
                schema: null,
                form: null,
                formVer: null,
                fields: [],
                formFields: [],
                showDiagram: false,
                showNote: false,
                showDirection: false,
                showAttachments: false,
                assignmentDate: null,
                assignmentType: null,
                assignmentRule: null,
                assignedUser: null,
                isTimer: false,
                timer: {
                    type: 1,
                    value: 0,
                    dateType: 1,
                    formField: null,
                    formValue: null
                },
                isEmailProcess: false,
                email: {
                    title: null,
                    body: null,
                    actions: []
                },
                next: null
            },
            {
                id: null,
                name: null,
                type: "auto",
                method: null,
                assignmentDate: null,
                description: null,
                next: null
            },
            {
                id: null,
                name: null,
                type: "subflow",
                flowId: null,
                flowName: null,
                isWaiting: false,
                showAttachments: false,
                onAbortedSubFlow: false,
                subResult: null,
                mapping: false,
                map: {
                    before: [],
                    after: []
                },
                assignmentDate: null,
                description: null,
                next: null
            },
            {
                id: null,
                name: null,
                type: "webservice",
                assignmentDate: null,
                description: null,
                wsdl: null,
                serviceName: null,
                serviceMethod: null,
                clientName: null,
                username: null,
                password: null,
                send: [],
                recive: [],
                next: null
            },
            {
                id: null,
                name: null,
                type: "waiting",
                assignmentDate: null,
                description: null,
                timer: {
                    type: 1,
                    value: 0,
                    formDate: null,
                    formField: null
                },
                next: null
            },
            {
                id: null,
                name: null,
                type: "decision",
                assignmentDate: null,
                description: null,
                decisions: [],
                next: null
            },
            {
                id: null,
                name: null,
                type: "combination",
                assignmentDate: null,
                description: null,
                next: null
            },
            {
                id: null,
                name: null,
                type: "distribution",
                assignmentDate: null,
                description: null,
                next: []
            },
            {
                id: null,
                name: null,
                type: "email",
                assignmentDate: null,
                description: null,
                email: {
                    addresses: [],
                    title: null,
                    body: null
                },
                next: null
            },
            {
                id: null,
                name: null,
                type: "message",
                assignmentDate: null,
                description: null,
                message: {
                    toType: null,
                    users: [],
                    groups: [],
                    message: null
                },
                next: null
            },
            {
                id: null,
                name: 'Bitiş',
                type: "end"
            }
        ],
        checkItems: function () {
            var errors = [];
            Docya.FlowController.outputJson.map(function (x) {
                switch (x.type) {
                    case 'manual':

                        if (x.name === null) {
                            errors.push('Manuel Adım: Ad giriniz.');
                        }

                        if (x.schema === null) {
                            errors.push('Manuel Adım: Organizasyon Şeması seçiniz.');
                        }

                        if (x.form === null) {
                            errors.push('Manuel Adım: Form seçiniz.');
                        }

                        if (x.formVer === null) {
                            errors.push('Manuel Adım: Form Versiyonu seçiniz.');
                        }

                        if (x.assignmentType === null || x.assignmentRule === null) {
                            errors.push('Manuel Adım: Atanan Kişiyi belirleyiniz.');
                        }

                        if (x.isEmailProcess && x.email.title === null) {
                            errors.push('Manuel Adım: Mail Konusu giriniz.');
                        }

                        if (x.isEmailProcess && x.email.body === null) {
                            errors.push('Manuel Adım: Mail icerigini giriniz.');
                        }

                        if (x.isEmailProcess && x.email.actions === []) {
                            errors.push('Manuel Adım: Mail aksiyonu giriniz.');
                        }

                        break;

                    case 'auto':

                        if (x.name === null) {
                            errors.push('Otomatik Adım: Ad giriniz.');
                        }

                        if (x.method === null) {
                            errors.push('Otomatik Adım: Method seçiniz.');
                        }

                        break;

                    case 'subflow':

                        if (x.name === null) {
                            errors.push('Alt Akış: Ad giriniz.');
                        }

                        if (x.flowId === null) {
                            errors.push('Alt Akış: Alt Akış seçiniz.');
                        }

                        if (x.flowName === null) {
                            errors.push('Alt Akış: Alt Akış Adı giriniz.');
                        }

                        if (!x.onAbortedSubFlow && x.subResult === null) {
                            errors.push('Alt Akış: Alt Akış sonucunun eslenecegi form alanini seciniz..');
                        }

                        if (x.mapping && (x.map.before === [] || x.map.after === [])) {
                            errors.push('Alt Akış: Alt Akış sonucunun eslenecegi form alanini seciniz..');
                        }

                        break;

                    case 'webservice':

                        if (x.name === null) {
                            errors.push('Web Service: Ad giriniz.');
                        }

                        if (x.wsdl === null) {
                            errors.push('Web Service: WSDL adresi giriniz.');
                        }

                        if (x.serviceName === null) {
                            errors.push('Web Service: Servis Adı giriniz.');
                        }

                        if (x.serviceName === null) {
                            errors.push('Web Service: Method seçiniz.');
                        }

                        if (x.clientName === null) {
                            errors.push('Web Service: Client Adı giriniz.');
                        }

                        if (x.username === null) {
                            errors.push('Web Service: Kullanici Adı giriniz.');
                        }

                        if (x.password === null) {
                            errors.push('Web Service: Sifre giriniz.');
                        }

                        if (x.send === [] || x.recive === []) {
                            errors.push('Web Service: gonderilecek ya da alinacal data seciniz.');
                        }

                        break;

                    case 'waiting':

                        if (x.name === null) {
                            errors.push('Bekleme Adımı: Ad giriniz.');
                        }

                        if (x.timer.type === 2 && x.timer.formDate === null) {
                            errors.push('Bekleme Adımı: Dakika, Saat ya da Gun seciniz.');
                        }

                        if (x.timer.type === 2 && x.timer.formField === null) {
                            errors.push('Bekleme Adımı: Form alani seciniz.');
                        }

                        if (x.timer.value === null || x.timer.value === 0) {
                            errors.push('Bekleme Adımı: Beklenecek Deger\'i giriniz.');
                        }

                        break;

                    case 'decision':

                        if (x.name === null) {
                            errors.push('Karar Adımı: Ad giriniz.');
                        }

                        if (x.decisions === []) {
                            errors.push('Karar Adımı: En az bir tane Karar Koşulu girmelisiniz.');
                        }

                        break;

                    case 'combination':

                        if (x.name === null) {
                            errors.push('Birleştirme Adımı: Ad giriniz.');
                        }

                        break;

                    case 'distribution':

                        if (x.name === null) {
                            errors.push('Dağıtım Adımı: Ad giriniz.');
                        }

                        break;

                    case 'email':

                        if (x.name === null) {
                            errors.push('EPosta Adımı: Ad giriniz.');
                        }

                        if (x.mail.addresses === []) {
                            errors.push('EPosta Adımı: Gönderilecek adresleri giriniz.');
                        }

                        if (x.mail.title === null) {
                            errors.push('EPosta Adımı: Konu giriniz.');
                        }

                        if (x.mail.body === null) {
                            errors.push('EPosta Adımı: Mesaj giriniz.');
                        }

                        break;

                    case 'message':

                        if (x.name === null) {
                            errors.push('Mesaj Adımı: Ad giriniz.');
                        }

                        if (x.message.users === [] || x.message.groups === []) {
                            errors.push('Mesaj Adımı: Gönderilecek Kişileri/Grupları giriniz.');
                        }

                        if (x.message.message === null) {
                            errors.push('Mesaj Adımı: Mesaj giriniz.');
                        }

                        break;

                    default:
                        break;
                }
            });

            if (errors.length > 0) {
                let errorHtml = "<ul>";
                errors.map(x => {
                    errorHtml += "<li>" + x + "</li>";
                });
                errorHtml += "</ul>";
                showMessageBox("danger", "Uyari", errorHtml);
                return false;
            }
        },
        initLibrary: function () {
            jsPlumb.ready(function () {

                var instance = jsPlumb.getInstance({
                    DragOptions: { cursor: 'pointer', zIndex: 2000 },
                    ConnectionOverlays: [
                        ["Arrow", { location: 1 }],
                        ["Label", {
                            location: 0.5,
                            id: "label",
                            cssClass: "aLabel"
                        }]
                    ],
                    Container: "FlowScene"
                });


                var connectorPaintStyle = {
                    lineWidth: 4,
                    strokeStyle: "#61B7CF",
                    joinstyle: "round",
                    outlineColor: "white",
                    outlineWidth: 2
                },
                    connectorHoverStyle = {
                        lineWidth: 4,
                        strokeStyle: "#216477",
                        outlineWidth: 2,
                        outlineColor: "white"
                    },
                    endpointHoverStyle = {
                        fillStyle: "#216477",
                        strokeStyle: "#216477"
                    },
                    sourceEndpoint = {
                        endpoint: "Dot",
                        paintStyle: {
                            strokeStyle: "#7AB02C",
                            fillStyle: "transparent",
                            radius: 4,
                            lineWidth: 3
                        },
                        isSource: true,
                        connector: ["Flowchart", { cornerRadius: 5, alwaysRespectStubs: true }],
                        connectorStyle: connectorPaintStyle,
                        hoverPaintStyle: endpointHoverStyle,
                        connectorHoverStyle: connectorHoverStyle,
                        dragOptions: {},
                    },
                    targetEndpoint = {
                        endpoint: "Dot",
                        paintStyle: { fillStyle: "#7AB02C", radius: 4 },
                        hoverPaintStyle: endpointHoverStyle,
                        maxConnections: -1,
                        dropOptions: { hoverClass: "hover", activeClass: "active" },
                        isTarget: true,
                    },
                    init = function (connection) {
                        connection.getOverlay("label").setLabel(connection.sourceId.substring(15) + "-" + connection.targetId.substring(15));
                        connection.bind("editCompleted", function (o) {
                            if (typeof console != "undefined")
                                console.log("connection edited. path is now ", o.path);
                        });
                    };

                instance.registerConnectionTypes({
                    "connectorType": {
                        paintStyle: connectorPaintStyle,
                        connector: ["Flowchart", { cornerRadius: 5, alwaysRespectStubs: true }],
                        connectorStyle: connectorPaintStyle,
                        hoverPaintStyle: endpointHoverStyle,
                        connectorHoverStyle: connectorHoverStyle
                    },
                    "connectorHover": { paintStyle: connectorHoverStyle },
                });

                instance.registerEndpointTypes({
                    "basic": {
                        paintStyle: { fillStyle: "blue" }
                    },
                    "selected": {
                        paintStyle: { fillStyle: "red" }
                    }
                });

                $('#' + Docya.FlowController.SceneId).on("click", ".button_remove", function () {
                    var parentnode = $(this)[0].parentNode.parentNode;
                    instance.detachAllConnections(parentnode);
                    instance.removeAllEndpoints(parentnode);
                    $(parentnode).remove();
                });


                var _addEndpoints = function (toId, sourceAnchors, targetAnchors) {

                    for (var i = 0; i < sourceAnchors.length; i++) {
                        var sourceUUID = toId + sourceAnchors[i];
                        instance.addEndpoint("flowchart" + toId, sourceEndpoint, { anchor: sourceAnchors[i], uuid: sourceUUID });
                    }
                    for (var j = 0; j < targetAnchors.length; j++) {
                        var targetUUID = toId + targetAnchors[j];
                        instance.addEndpoint("flowchart" + toId, targetEndpoint, { anchor: targetAnchors[j], uuid: targetUUID });
                    }
                };

                _addEndpoints("Startpoint", ["BottomCenter"], []);
                _addEndpoints("Endpoint", [], ["TopCenter"]);

                var positionSetter = {
                    stop: function (event, ui) {
                        var parentLeft = $("#FlowScene").position().left;
                        var parentTop = $("#FlowScene").position().top;
                        var Stoppos = $(this).position();
                        var left = (Stoppos.left - parentLeft);
                        var top = (Stoppos.top - parentTop);
                        var node = Docya.FlowController.nodes.filter(function (a) { return a.blockId === ui.helper.context.id })[0];
                        node.positionX = left;
                        node.positionY = top;
                    }
                };

                instance.draggable($("#flowchartStartpoint"), positionSetter);
                instance.draggable($("#flowchartEndpoint"), positionSetter);

                if (Docya.FlowController.isEdit) {
                    Docya.FlowController.nodes.filter(function (a) { return a.nodetype !== 'startpoint' && a.nodetype !== 'endpoint' }).map(function (item) {

                        var jsonElm = Docya.FlowController.outputJson.filter(function(a){ return a.id===item.blockId})[0];

                        var element = Docya.FlowController.createHTMLElement(item.nodetype, "t-oval", jsonElm.name, item.positionX, item.positionY, _addEndpoints, instance, true);
                    });

                    Docya.FlowController.connections.map(function (conn) {

                        var connection1 = instance.connect({
                            source: conn.pageSourceId,
                            target: conn.pageTargetId,
                            anchors: conn.anchors,
                            endpointStyle: [sourceEndpoint],
                            type: "connectorType"
                        });

                    });
                }

                instance.bind("contextmenu", function (component, originalEvent) {
                    alert("context menu on component " + component.id);
                    originalEvent.preventDefault();

                    var connid = component.id;
                    alert("Connection ID " + connid);
                    return false;
                });

                // suspend drawing and initialise.
                instance.doWhileSuspended(function () {

                    // listen for new connections; initialise them the same way we initialise the connections at startup.
                    instance.bind("connection", function (connInfo, originalEvent) {
                        init(connInfo.connection);
                    });

                    // make all the window divs draggable						
                    instance.draggable(jsPlumb.getSelector("#FlowScene .window"), { grid: [20, 20] });
                    // THIS DEMO ONLY USES getSelector FOR CONVENIENCE. Use your library's appropriate selector 
                    // method, or document.querySelectorAll:
                    //jsPlumb.draggable(document.querySelectorAll(".window"), { grid: [20, 20] });

                    // connect a few up
                    //instance.connect({uuids:["Window2BottomCenter", "Window3TopCenter"], editable:true});
                    //

                    //
                    // listen for clicks on connections, and offer to delete connections on click.
                    //
                    instance.bind("click", function (conn, originalEvent) {
                        if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
                            jsPlumb.detach(conn);

                        Docya.FlowController.UpdateDatas(instance, false);
                    });

                    instance.bind("connectionDrag", function (connection) {
                        console.log("connection " + connection.id + " is being dragged. suspendedElement is ", connection.suspendedElement, " of type ", connection.suspendedElementType);
                    });

                    instance.bind("connectionDragStop", function (connection) {
                        console.log("connection " + connection.id + " was dragged");

                        if (Docya.FlowController.connections.filter(function (a) { return connection.targetId === a.pageTargetId && connection.id !== a.connectionId }).length > 0) {
                            jsPlumb.detach(connection);
                        }

                        Docya.FlowController.UpdateDatas(instance, false);
                    });

                    instance.bind("connectionMoved", function (params) {
                        console.log("connection " + params.connection.id + " was moved");
                        Docya.FlowController.UpdateDatas(instance, false);
                    });
                });


                $("#FlowScene").droppable({
                    drop: function (event, ui) {

                        var jqElem = ui.helper.clone();

                        var fType = jqElem.attr("data-flowtype");
                        var oType = jqElem.attr("data-optiontype");
                        var title = jqElem.attr("title");

                        Docya.FlowController.createHTMLElement(fType, oType, title, (ui.position.left - 120), ui.position.top, _addEndpoints, instance)

                    },
                    accept: function (jqElem) {

                        var bool = (jqElem.is("[data-flowtype]"));
                        // if (!bool)
                        //   alert("hi");

                        return bool;
                    },
                    tolerance: "touch"
                });


                $("[data-flowbtn]").draggable({
                    cursor: "pointer",
                    revert: "invalid",
                    helper: function (a, b) {
                        var helper = $(this).clone();
                        helper.css({
                            "position": "fixed",
                            "z-index": "100"
                        });

                        return helper;
                    }

                });

                $("[data-flowbtn]").click(function (e) {
                    e.stopPropagation();
                    var jqElm = $(this);
                    var fType = jqElm.attr("data-flowtype");
                    var oType = jqElm.attr("data-optiontype");
                    var title = jqElm.attr("title");

                    return Docya.FlowController.createHTMLElement(fType, oType, title, 50, 250, _addEndpoints, instance)

                });

                $("#saveButton").click(function () {
                    saveFlowchart();
                });

                jsPlumb.fire("DocyaFlowController", instance);

                var saveFlowchart = function () {
                    var nodes = []
                    $(".node").each(function (idx, elem) {
                        var $elem = $(elem);
                        nodes.push({
                            blockId: $elem.attr('id'),
                            nodetype: $elem.attr('data-nodetype'),
                            positionX: parseInt($elem.css("left"), 10),
                            positionY: parseInt($elem.css("top"), 10),
                            title: $elem.attr('data-title')
                        });
                    });
                    var connections = [];
                    $.each(instance.getConnections(), function (idx, connection) {
                        connections.push({
                            connectionId: connection.id,
                            pageSourceId: connection.sourceId,
                            pageTargetId: connection.targetId,
                            anchors: $.map(connection.endpoints, function (endpoint) {

                                return [[endpoint.anchor.x,
                                endpoint.anchor.y,
                                endpoint.anchor.orientation[0],
                                endpoint.anchor.orientation[1],
                                endpoint.anchor.offsets[0],
                                endpoint.anchor.offsets[1]]];

                            })
                        });
                    });

                    var flowChart = {};
                    flowChart.nodes = nodes;
                    flowChart.connections = connections;
                    flowChart.numberOfElements = Docya.FlowController.NumberOfShapes;

                    let errors = [];

                    if ($("[data-flowName]").val() === "" || $("[data-flowName]").val() === null) {
                        errors.push("Taslak Adı giriniz.");
                    }

                    if ($("[data-flowAuthSet]").val() === "" || $("[data-flowAuthSet]").val() === null) {
                        errors.push("Yetki Seti seçiniz.");
                    }

                    if ($("[data-flowOrganization]").val() === "" || $("[data-flowOrganization]").val() === null) {
                        errors.push("Şema seçiniz.");
                    }

                    if ($("[data-flowFormType]").val() === "" || $("[data-flowFormType]").val() === null) {
                        errors.push("Tip seçiniz.");
                    }

                    if ($("[data-flowForm]").val() === "" || $("[data-flowForm]").val() === null) {
                        errors.push("Form seçiniz.");
                    }

                    if ($("[data-flowFormVer]").val() === "" || $("[data-flowFormVer]").val() === null) {
                        errors.push("Form Versiyonu seçiniz.");
                    }

                    nodes.map(function (node) {

                        var targetCount = connections.filter(function (connection) { return connection.pageTargetId === node.blockId }).length;

                        $("#" + node.blockId).removeClass("alerted");
                        if (targetCount === 0 && node.blockId !== "flowchartStartpoint") {
                            $("#" + node.blockId).addClass("alerted");
                            errors.push(node.title + " için giriş bağlantısı bulunamadı.");
                        }

                        var sourceCount = connections.filter(function (connection) { return connection.pageSourceId === node.blockId }).length;

                        if (sourceCount === 0 && node.blockId !== "flowchartEndpoint") {
                            $("#" + node.blockId).addClass("alerted");
                            errors.push(node.title + " için çıkış bağlantısı bulunamadı.");
                        }
                    });



                    if (errors.length > 0) {
                        let errorHtml = "<ul>";
                        errors.map(x => {
                            errorHtml += "<li>" + x + "</li>";
                        });
                        errorHtml += "</ul>";
                        showMessageBox("danger", "Uyari", errorHtml);
                        return false;
                    }

                    Docya.FlowController.checkItems();

                    let data = {
                        process: $("[data-edit]").attr("data-edit") === "false" ? "addFlowTemplate" : "updateFlowTemplate",
                        name: $("[data-flowName]").val(),
                        authSet: $("[data-flowAuthSet]").val(),
                        formType: $("[data-flowFormType]").val(),
                        form: $("[data-flowForm]").val(),
                        formVer: $("[data-flowFormVer]").val(),
                        organization: $("[data-flowOrganization]").val(),
                        description: $("[data-flowDescription]").val(),
                        steps: JSON.stringify(Docya.FlowController.outputJson),
                        connections: JSON.stringify(Docya.FlowController.connections),
                        nodes: JSON.stringify(Docya.FlowController.nodes),
                        flowTemplateId: $("#flowTemplateId").val()
                    };

                    let cb = function (data) {
                        if (data.messageType === 1) {
                            showMessageBox("success", "BİLGİ", data.message);
                        } else {
                            showMessageBox("danger", "UYARIM", data.message);
                        }
                    };

                    Docya.FlowController.initAjax(data, cb);
                };

            });

        },
        UpdateDatas: function (instance, first) {
            if (!first) {
                Docya.FlowController.nodes = [];
                Docya.FlowController.connections = [];
            }

            $(".node").each(function (idx, elem) {
                var $elem = $(elem);
                if (Docya.FlowController.nodes.filter(function (a) { return a.blockId === $elem.attr('id') }).length === 0) {
                    Docya.FlowController.nodes.push({
                        blockId: $elem.attr('id'),
                        nodetype: $elem.attr('data-nodetype'),
                        positionX: parseInt($elem.css("left"), 10),
                        positionY: parseInt($elem.css("top"), 10),
                        title: $elem.attr('data-title')
                    });
                }
            });

            $.each(instance.getConnections(), function (idx, connection) {
                Docya.FlowController.connections.push({
                    connectionId: connection.id,
                    pageSourceId: connection.sourceId,
                    pageTargetId: connection.targetId,
                    anchors: $.map(connection.endpoints, function (endpoint) {

                        return [[endpoint.anchor.x,
                        endpoint.anchor.y,
                        endpoint.anchor.orientation[0],
                        endpoint.anchor.orientation[1],
                        endpoint.anchor.offsets[0],
                        endpoint.anchor.offsets[1]]];

                    })
                });
            });

            Docya.FlowController.sortingItems("flowchartStartpoint", 0);

        },
        createHTMLElement: function (fType, oType, title, x, y, _addEndpoints, instance, first) {
            Docya.FlowController.NumberOfShapes++;

            var divHtml = "";
            var sourceAnchors = ["BottomCenter"];
            var targetAnchors = ["TopCenter"];

            switch (fType) {
                case "manual":
                    divHtml = '<div class="boxText" data-label>' + title + '</div><div class="rb"><i class="fas fa-user"></i></div>';
                    break;
                case "auto":
                    divHtml = '<div class="boxText" data-label>' + title + '</div><div class="rb"><i class="fas fa-robot"></i></div>';
                    break;
                case "subflow":
                    divHtml = '<div class="boxText" data-label>' + title + '</div><div class="rb"><i class="fas fa-sitemap"></i></div>';
                    break;
                case "webservice":
                    divHtml = '<div class="boxText">' + title + '</div><div class="rb"><i class="fas fa-cogs"></i></div>';
                    break;
                case "decision":
                    divHtml = '<div class="graph"></div><div class="filigran" data-label>' + title + '</div>';
                    sourceAnchors = ["Left", "Right"];
                    break;
                case "waiting":
                    divHtml = '<i class="far fa-clock"></i><div class="filigran" data-label>' + title + '</div>';
                    break;
                case "email":
                    divHtml = '<i class="far fa-envelope"></i><div class="filigran" data-label>' + title + '</div>';
                    break;
                case "message":
                    divHtml = '<i class="far fa-envelope"></i><div class="filigran" data-label>' + title + '</div>';
                    break;
                case "combination":
                    divHtml = '<div class="graph"></div><div class="normalize"><i class="fas fa-compress"></i></div><div class="filigran" data-label>' + title + '</div>';
                    targetAnchors = ["Left", "Right", "TopCenter"];
                    break;
                case "distribution":
                    divHtml = '<div class="graph"></div><div class="normalize"><i class="fas fa-expand"></i></div><div class="filigran" data-label>' + title + '</div>';
                    sourceAnchors = ["Left", "Right", "BottomCenter"];
                    break;

                default:
                    break;
            }

            $('<div style="top:' + y + 'px; left:' + x + 'px;" class="' + oType + ' ' + fType + ' node" data-nodetype="' + fType + '" data-title="' + title + Docya.FlowController.NumberOfShapes + '" id="flowchartWindow' + Docya.FlowController.NumberOfShapes + '"><div class="node-delete"><i class="fas fa-times"></i></div>' + divHtml + '</div>').appendTo('#' + Docya.FlowController.SceneId);

            _addEndpoints("Window" + Docya.FlowController.NumberOfShapes, sourceAnchors, targetAnchors);

            var positionSetter = {
                stop: function (event, ui) {
                    var parentLeft = $("#FlowScene").position().left;
                    var parentTop = $("#FlowScene").position().top;
                    var Stoppos = $(this).position();
                    var left = (Stoppos.left - parentLeft);
                    var top = (Stoppos.top - parentTop);
                    var node = Docya.FlowController.nodes.filter(function (a) { return a.blockId === ui.helper.context.id })[0];
                    node.positionX = left;
                    node.positionY = top;
                }
            };

            instance.draggable($('#flowchartWindow' + Docya.FlowController.NumberOfShapes), positionSetter);
            id = 'flowchartWindow' + Docya.FlowController.NumberOfShapes;

            var slctd = Docya.FlowController.taskTypes.filter(function (e) {
                return e.type === fType;
            })[0];

            var slctd_ = Object.assign({}, slctd);

            slctd_.id = id;


            !first && Docya.FlowController.outputJson.splice((Docya.FlowController.outputJson.length - 1), 0, slctd_);

            Docya.FlowController.UpdateDatas(instance, first);

            $(".node-delete").unbind("click");

            $(".node-delete").bind("click", function (event) {
                event.stopPropagation();
                var jqElm = $(this).parent();

                instance.detachAllConnections(jqElm.attr("id"));
                instance.removeAllEndpoints(jqElm.attr("id"));
                Docya.FlowController.outputJson = Docya.FlowController.outputJson.filter(function (a) { return a.id !== jqElm.attr("id") });
                $(jqElm).remove();

                Docya.FlowController.UpdateDatas(instance, false);

            });

            $("#" + id).bind("click", function (conn, originalEvent) {
                $('.node').removeClass('show');
                $('.properties').addClass('show');
                $('[data-taskbuttons]').addClass('resize');
                $(this).addClass('show');

                Docya.FlowController.selectedTask = $(this).attr("id");

                Docya.FlowController.createForm();

            });

            return id
        },
        createForm: function () {

            var task = Docya.FlowController.outputJson.filter(function (a) {
                return a.id === Docya.FlowController.selectedTask;
            });


            if (task.length > 0) {
                task = task[0];

                var section = $("[data-properties='" + task.type + "']");

                $("[data-properties]").addClass("d-none");
                section.removeClass("d-none");

                $("[data-section]").addClass("d-none");
                $("[data-sub-section]").addClass("d-none");

                switch (task.type) {
                    case 'manual':

                        // genel //
                        $("input[data-field='name']", section).val(task.name);
                        $("textarea[data-field='description']", section).val(task.description);
                        $("select[data-field='schema']", section).val(task.schema);
                        $("select[data-field='form']", section).val(task.form);
                        $("select[data-field='formVer']", section).val(task.formVer);

                        if (task.showDiagram) {
                            $("input[data-field='showDiagram']", section).prop('checked', true);
                        } else {
                            $("input[data-field='showDiagram']", section).prop('checked', false);
                        }

                        if (task.showNote) {
                            $("input[data-field='showNote']", section).prop('checked', true);
                        }
                        else {
                            $("input[data-field='showNote']", section).prop('checked', false);
                        }

                        if (task.showDirection) {
                            $("input[data-field='showDirection']", section).prop('checked', true);
                        }
                        else {
                            $("input[data-field='showDirection']", section).prop('checked', false);
                        }

                        if (task.showAttachments) {
                            $("input[data-field='showAttachments']", section).prop('checked', true);
                        }
                        else {
                            $("input[data-field='showAttachments']", section).prop('checked', false);
                        }

                        // atanan kişi //
                        if (task.assignmentType !== null) {
                            $("input[data-field='assignmentType'][value='" + task.assignmentType + "']", section).prop('checked', true);
                            $("[data-section='" + $("input[data-field='assignmentType'][value='" + task.assignmentType + "']", section).attr("data-rel") + "']", section).removeClass("d-none");
                            $("[data-sub-section='" + $("input[data-field='assignmentType'][value='" + task.assignmentType + "']", section).attr("data-sub-rel") + "']", section).removeClass("d-none");
                        }
                        else {
                            $("input[data-field='assignmentType']", section).prop('checked', false);
                        }

                        if (task.assignmentRule !== null) {
                            $("input[data-field='assignmentRule'][value='" + task.assignmentRule + "']", section).prop('checked', true);
                            $("[data-section='" + $("input[data-field='assignmentRule'][value='" + task.assignmentRule + "']", section).attr("data-rel") + "']", section).removeClass("d-none");
                            $("[data-sub-section='" + $("input[data-field='assignmentRule'][value='" + task.assignmentRule + "']", section).attr("data-sub-rel") + "']", section).removeClass("d-none");
                        }
                        else {
                            $("input[data-field='assignmentRule']", section).prop('checked', false);
                        }

                        $("select[data-field='assignedUser']", section).val(task.assignedUser);

                        if (task.assignmentType === "group") {
                            $("input[data-field='groupRule'][value='" + task.assignmentRule + "']", section).prop('checked', true);
                        }
                        else {
                            $("input[data-field='groupRule']", section).prop('checked', false);
                        }

                        // zamanlayıcı //
                        if (task.timer.type !== null) {
                            $("input[data-field='timer.type'][value='" + task.timer.type + "']", section).prop('checked', true);
                        }
                        else {
                            $("input[data-field='timer.type']", section).prop('checked', false);
                        }

                        if (task.timer.dateType !== null) {
                            $("input[data-field='timer.dateType'][value='" + task.timer.dateType + "']", section).prop('checked', true);
                        }
                        else {
                            $("input[data-field='timer.dateType']", section).prop('checked', false);
                        }

                        $("input[data-field='timer.value']", section).val(task.timer.value);

                        $("select[data-field='timer.formField']", section).val(task.timer.formField);

                        $("input[data-field='timer.formValue']", section).val(task.timer.formValue);

                        // eposta //
                        if (task.isEmailProcess) {
                            $("input[data-field='isEmailProcess']", section).prop('checked', true);
                        } else {
                            $("input[data-field='isEmailProcess']", section).prop('checked', false);
                        }

                        $("input[data-field='email.title']", section).val(task.email.title);
                        $("textarea[data-field='email.body']", section).val(task.email.body);


                        break;

                    case 'auto':

                        $("input[data-field='name']", section).val(task.name);
                        $("textarea[data-field='description']", section).val(task.description);
                        $("select[data-field='method']", section).val(task.method);

                        break;

                    case 'subflow':

                        $("input[data-field='name']", section).val(task.name);
                        $("textarea[data-field='description']", section).val(task.description);
                        $("select[data-field='flowId']", section).val(task.flowId);
                        $("input[data-field='flowName']", section).val(task.flowName);
                        $("select[data-field='subResult']", section).val(task.subResult);

                        if (task.isWaiting) {
                            $("input[data-field='isWaiting']", section).prop('checked', true);
                        } else {
                            $("input[data-field='isWaiting']", section).prop('checked', false);
                        }

                        if (task.showAttachments) {
                            $("input[data-field='showAttachments']", section).prop('checked', true);
                        } else {
                            $("input[data-field='showAttachments']", section).prop('checked', false);
                        }

                        if (task.onAbortedSubFlow) {
                            $("input[data-field='onAbortedSubFlow']", section).prop('checked', true);
                        } else {
                            $("input[data-field='onAbortedSubFlow']", section).prop('checked', false);
                        }

                        if (task.mapping) {
                            $("input[data-field='mapping']", section).prop('checked', true);
                        } else {
                            $("input[data-field='mapping']", section).prop('checked', false);
                        }

                        break;

                    case 'webservice':

                        $("input[data-field='name']", section).val(task.name);
                        $("textarea[data-field='description']", section).val(task.description);
                        $("input[data-field='wsdl']", section).val(task.wsdl);
                        $("input[data-field='serviceName']", section).val(task.serviceName);
                        $("input[data-field='serviceMethod']", section).val(task.serviceMethod);
                        $("input[data-field='clientName']", section).val(task.clientName);
                        $("input[data-field='username']", section).val(task.username);
                        $("input[data-field='password']", section).val(task.password);

                        break;

                    case 'waiting':

                        $("input[data-field='name']", section).val(task.name);
                        $("textarea[data-field='description']", section).val(task.description);

                        if (task.timer.type !== null) {
                            $("input[data-field='timer.type'][value='" + task.timer.type + "']", section).prop('checked', true);
                            $("[data-section='" + $("input[data-field='timer.type'][value='" + task.timer.type + "']", section).attr("data-rel") + "']", section).removeClass("d-none");
                            $("[data-sub-section='" + $("input[data-field='timer.type'][value='" + task.timer.type + "']", section).attr("data-sub-rel") + "']", section).removeClass("d-none");
                        }
                        else {
                            $("input[data-field='timer.type']", section).prop('checked', false);
                        }

                        if (task.timer.formDate !== null) {
                            $("input[data-field='timer.formDate'][value='" + task.timer.formDate + "']", section).prop('checked', true);
                        }
                        else {
                            $("input[data-field='timer.formDate']", section).prop('checked', false);
                        }

                        $("select[data-field='timer.formField']", section).val(task.timer.formField);

                        $("input[data-field='timer.value']", section).val(task.timer.value);

                        break;

                    case 'decision':

                        $("input[data-field='name']", section).val(task.name);
                        $("textarea[data-field='description']", section).val(task.description);

                        break;

                    case 'combination':

                        $("input[data-field='name']", section).val(task.name);
                        $("textarea[data-field='description']", section).val(task.description);

                        break;

                    case 'distribution':

                        $("input[data-field='name']", section).val(task.name);
                        $("textarea[data-field='description']", section).val(task.description);

                        break;

                    case 'email':

                        break;

                    case 'message':

                        break;

                    default:
                        break;
                }
            }
        },
        initClose: function () {
            $("body").on("click", "[data-closeproperties]", function (e) {
                e.preventDefault();

                $('.properties').removeClass('show');
                $('[data-taskbuttons]').removeClass('resize');
            });
        },
        initTextBox: function () {
            $("body").on("blur", "input[type='text'][data-field],input[type='number'][data-field],textarea[data-field]", function (e) {

                var jqElm = $(this);
                var val = jqElm.data("field");

                var htmlElm = $("#" + Docya.FlowController.selectedTask);

                if (val === "name") {
                    if (jqElm.val() !== "") {
                        htmlElm.find("[data-label]").text(jqElm.val());
                    } else {
                        htmlElm.find("[data-label]").text(htmlElm.attr("data-title"));
                    }
                }

                var task = Docya.FlowController.outputJson.filter(function (a) {
                    return a.id === Docya.FlowController.selectedTask;
                })[0];

                if (val.indexOf(".") < 0) {
                    task[val] = jqElm.val();
                } else {
                    var vals = val.split(".");
                    var newProp = Object.assign({}, task[vals[0]]);
                    newProp[vals[1]] = jqElm.val();
                    task[vals[0]] = newProp;
                }

            });
        },
        initSelectBox: function () {
            $("body").on("change", "select[data-field]", function (e) {

                var jqElm = $(this);
                var val = jqElm.data("field");

                var task = Docya.FlowController.outputJson.filter(function (a) {
                    return a.id === Docya.FlowController.selectedTask;
                })[0];

                if (val.indexOf(".") < 0) {
                    task[val] = jqElm.val();
                } else {
                    var vals = val.split(".");
                    var newProp = Object.assign({}, task[vals[0]]);
                    newProp[vals[1]] = jqElm.val();
                    task[vals[0]] = newProp;
                }

            });
        },
        initRadioButton: function () {
            $("body").on("change", "input[type='radio'][data-field]", function (e) {

                var jqElm = $(this);

                var val = jqElm.data("field");

                var task = Docya.FlowController.outputJson.filter(function (a) {
                    return a.id === Docya.FlowController.selectedTask;
                })[0];

                if (val.indexOf(".") < 0) {
                    task[val] = jqElm.val();
                } else {
                    var vals = val.split(".");
                    var newProp = Object.assign({}, task[vals[0]]);
                    newProp[vals[1]] = jqElm.val();
                    task[vals[0]] = newProp;
                }



            });
        },
        initCheckBox: function () {
            $("body").on("change", "input[type='checkbox'][data-field]", function (e) {

                var jqElm = $(this);

                var val = jqElm.data("field");

                var task = Docya.FlowController.outputJson.filter(function (a) {
                    return a.id === Docya.FlowController.selectedTask;
                })[0];

                if (val.indexOf(".") < 0) {
                    task[val] = jqElm.is(":checked");
                } else {
                    var vals = val.split(".");
                    var newProp = Object.assign({}, task[vals[0]]);
                    newProp[vals[1]] = jqElm.is(":checked");
                    task[vals[0]] = newProp;
                }

            });
        },
        initTrigger: function () {
            $("body").on("change", "[data-trigger]", function (e) {
                var jqElm = $(this);
                var jqParent = jqElm.parents("[data-properties]");
                var target = jqElm.attr("data-trigger");
                var method = jqElm.attr("data-trigger-method");


                if (target.split(",").length === method.split(",").length) {
                    target.split(",").map(function (item, i) {
                        $("[data-target='" + item + "']", jqParent).html("<option value=''>Lütfen seçin.</option>");
                        eval("Docya.FlowController." + method.split(",")[i])(jqElm.val(), item, jqParent);
                    });

                } else {
                    showMessageBox("danger", "hata olustu");
                }




            });
        },
        getFormVer: function (form, item, parent) {

            let data = {
                process: "getFormVersions",
                form: form
            };

            let cb = function (data) {
                data.data.map(function (a) { $("<option value='" + a[0] + "'>" + a[1] + "</option>").appendTo($("[data-target='" + item + "']", parent)) });
            };

            Docya.FlowController.initAjax(data, cb);
        },
        getOrganizationUsers: function (id, item, parent) {
            let data = {
                process: "getOrganizationById",
                organization: id
            };

            let cb = function (data) {
                data.tree.map(function (a) {
                    if (a.type === 0) {
                        return false;
                    }
                    if (a.type === 2) {
                        return $("<option value='" + a.user + "'>" + a.title + "</option>").appendTo($("[data-target='" + item + "']", parent))
                    } else {
                        return $("<option value='" + a.user + "'>" + a.name + "</option>").appendTo($("[data-target='" + item + "']", parent))
                    }

                });
            };

            Docya.FlowController.initAjax(data, cb);
        },
        getOrganizationDepartments: function (id, item, parent) {
            let data = {
                process: "getOrganizationById",
                organization: id
            };

            let cb = function (data) {
                data.tree.map(function (a) {
                    if (a.type === 1) {
                        return $("<option value='" + a.user + "'>" + a.title + "</option>").appendTo($("[data-target='" + item + "']", parent))
                    } else {
                        return false;
                    }

                });
            };

            Docya.FlowController.initAjax(data, cb);
        },
        getFormFields: function (form, item, parent) {
            let data = {
                process: "getFormById",
                form: form
            };

            let cb = function (data) {
                data.formVersion && data.formVersion.fields.map(function (a) { $("<option value='" + a.label + "'>" + a.label + "</option>").appendTo($("[data-target='" + item + "']", parent)) });
            };

            Docya.FlowController.initAjax(data, cb);
        },
        initGet: function () {
            $("body").on("change", "[data-get]", function (e) {
                var jqElm = $(this);
                var method = jqElm.attr("data-get");

                method.split(",").map(function (item, i) {
                    eval("Docya.FlowController." + method.split(",")[i])(jqElm.val());
                });




            });
        },
        getFormVersionFields: function (formVersion) {

            var task = Docya.FlowController.outputJson.filter(function (a) {
                return a.id === Docya.FlowController.selectedTask;
            })[0];

            let data = {
                process: "getFormVersionById",
                formVersion: formVersion
            };

            let cb = function (data) {
                task.fields = data.fields;
            };

            Docya.FlowController.initAjax(data, cb);
        },
        initRel: function () {
            $("body").on("click", "[data-rel]", function (e) {
                $('[data-section]').addClass("d-none");
                $('[data-section="' + $(this).attr("data-rel") + '"]').removeClass("d-none");
            });
        },
        initSubRel: function () {
            $("body").on("click", "[data-sub-rel]", function (e) {
                $('[data-sub-section]').addClass("d-none");
                $('[data-sub-section="' + $(this).attr("data-sub-rel") + '"]').removeClass("d-none");
            });
        },
        initFormType: function () {
            $("body").on("change", "[data-flowFormType]", function (e) {

                let data = {
                    process: "getForms",
                    formType: $(this).val()
                };

                let cb = function (data) {
                    Docya.FlowController.forms = data.data;
                    $("[data-target='form']").html("<option value=''>Lütfen seçin.</option>");
                    Docya.FlowController.forms.map(function (a) { $("<option value='" + a[0] + "'>" + a[1] + "</option>").appendTo($("[data-target='form']")) });

                };

                $(this).val() !== null && Docya.FlowController.initAjax(data, cb);
            });
        },
        initForm: function () {
            $("body").on("change", "[data-flowForm]", function (e) {
                let data = {
                    process: "getFormVersions",
                    form: $(this).val()
                };

                let cb = function (data) {
                    $("[data-flowFormVer]").html("<option value=''>Lütfen seçin.</option>");
                    data.data.map(function (a) { $("<option value='" + a[0] + "'>" + a[1] + "</option>").appendTo($("[data-flowFormVer]")) });
                };

                Docya.FlowController.initAjax(data, cb);
            });
        },
        initialDatas: function () {

            data = {
                process: "getGroups"
            };

            cb = function (data) {
                Docya.FlowController.groups = data.data;
                Docya.FlowController.groups.map(function (a) { $("<option value='" + a[0] + "'>" + a[1] + "</option>").appendTo($("[data-target='group']")) });
            };

            Docya.FlowController.initAjax(data, cb);

            data = {
                process: "getOrganizations"
            };

            cb = function (data) {
                Docya.FlowController.organizations = data.data;
                Docya.FlowController.organizations.map(function (a) { $("<option value='" + a[0] + "'>" + a[1] + "</option>").appendTo($("[data-target='schema']")) });
            };

            Docya.FlowController.initAjax(data, cb);

            data = {
                process: "getAuthSets"
            };

            cb = function (data) {
                data.data.map(function (a) { $("<option value='" + a[0] + "'>" + a[1] + "</option>").appendTo($("[data-flowAuthSet]")) });
            };

            Docya.FlowController.initAjax(data, cb);

            data = {
                process: "getFormTypes"
            };

            cb = function (data) {
                data.data.map(function (a) { $("<option value='" + a[0] + "'>" + a[1] + "</option>").appendTo($("[data-flowFormType]")) });
            };

            Docya.FlowController.initAjax(data, cb);
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
        sortingItems: function (elm, sort) {

            var conn = Docya.FlowController.connections.filter(function (a) {
                return a.pageSourceId === elm
            })

            var objj = Docya.FlowController.outputJson.filter(function (b) {
                return b.id === elm
            })

            if (conn.length > 0) {
                var next = Docya.FlowController.outputJson.filter(function (c) {
                    return c.id === conn[0].pageTargetId
                })

                if (next.length > 0) {

                    Docya.FlowController.outputJson.map(function (d) {
                        if (d.id === elm) {
                            d.next = next[0].id;
                            d.sortIndex = sort;
                        }

                        if (d.id === next[0].id && d.type === "end") {
                            d.sortIndex = sort + 1;
                        }
                    })

                    Docya.FlowController.sortingItems(next[0].id, sort + 1);
                }
            }
        },
        initElements: function () {
            this.initLibrary();
            this.initClose();
            this.initTrigger();
            this.initRel();
            this.initSubRel();
            this.initTextBox();
            this.initSelectBox();
            this.initRadioButton();
            this.initCheckBox();
            this.initFormType();
            this.initForm();
            this.initGet();
            this.initialDatas();
        },
        init: function () {
            this.initElements();
        }

    }



    $(document).ready(function () {
        w.Docya.FlowController.init();

    });

    $(window).on('load', function () {
        if (Docya.FlowController.isEdit) {

            setTimeout(function () {
                $("[data-flowFormType]").change();
            }, 100);

            setTimeout(function () {
                $("[data-flowForm]").val(JSON.parse($("#flowtemplate").val()).form);
            }, 200);

            setTimeout(function () {
                $("[data-flowForm]").change();
            }, 300);

            setTimeout(function () {
                $("[data-flowFormVer]").val(JSON.parse($("#flowtemplate").val()).formVersion._id);
            }, 400);

            Docya.FlowController.isEdit = false;
        }
    });

})(jQuery, window, document);