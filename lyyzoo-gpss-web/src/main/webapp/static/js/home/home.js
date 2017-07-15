Ext.require(['*']);

Ext.onReady(function () {
    Ext.tip.QuickTipManager.init();

    Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));

    /*头部*/
    var header = {
        region: 'north',
        collapsible: false,
        height: 70,
        bodyStyle: {
            background: '#1070B6',
        },
        contentEL: 'header'
    };

    /*菜单*/
    var menuStore = Ext.create('Ext.data.TreeStore', {
        fields: [
            'id',
            'name',
            'upId',
            'path',
            'leaf'
        ],
        proxy: {
            type: 'ajax',
            url: CTX + '/admin/menu/list/all',
            reader: {
                type: 'json'
            }
        },
        root: {
            id: 0,
            text: false,
            leaf: false,
            expanded: true,
            nodeType: 'async'
        },
        nodeParam: 'id',
        autoLoad: false
    });

    var task = new Ext.util.DelayedTask();
    var itemExpands = function (record, type) {
        var isleaf = record.data.leaf;
        if (isleaf === true) {
            var path = record.data.path;
            main.src = CTX + path;
        } else {
            if (type === 'single') {
                if (record.isExpanded()) {
                    record.collapse();
                } else {
                    record.expand();
                }
                return false;
            }
        }
    };

    /*导航*/
    var navi = {
        xtype: 'treepanel',
        region: 'west',
        title: '功能菜单',
        displayField: 'name',
        collapsible: true,
        width: 220,
        minHeight: 200,
        bodyPadding: 10,
        margin: '0 0 1px 0',
        lines: false,
        border: false,
        useArrows: true,
        autoScroll: false,
        collapsible: true,
//     	singleExpand : true,
        rootVisible: false,
        forceFit: true,
        animate: true,
        store: menuStore,
        itemclick: false,
        listeners: {
            'itemclick': function (o, record, item, index, e, eOpts) {
                task.delay(350, itemExpands, this, [record, 'single' ]);
            },
            'itemdblclick': function (o, record, item, index, e, eOpts) {
                task.delay(200, itemExpands, this, [record, 'double' ]);
            }

        }
    };

    /*主体IFRAME窗口*/
    var getIFrame = function () {
        var main = document.createElement("iframe");
        main.id = "main";
        main.frameBorder = "none";
        main.border = 0;
        main.src = CTX + "/welcome";
        main.height = "100%";
        main.width = "100%";

        return main;
    };
    var main = getIFrame();

    /*主页框架*/
    var center = {
        region: 'center',
        minHeight: 300,
        contentEl: main
    };

    /*底部*/
    var bottom = {
        region: 'south',
        height: 30,
        maxHeight: 40,
        bodyStyle: {
            background: '#1070B6'
        },
        contentEl: 'footer'
    };

    /*点击logo返回首页*/
    Ext.fly('logo').on('click', function () {
        main.src = CTX + "/welcome";
    });

    /*修改密码*/
    Ext.fly('modify').on('click', function () {
        //表单
        var formPanel = Ext.create('Ext.form.Panel', {
            layout: 'anchor',
            border: 0,
            bodyPadding: 4,
            defaults: {
                anchor: '100%'
            },
            defaultType: 'textfield',
            fieldDefaults: {
                labelAlign: 'right',
                labelWidth: 80,
                inputType: 'password',
                allowBlank: false,
                afterLabelTextTpl: Global.required,
                msgTarget: 'side'
            },
            items: [
                {
                    fieldLabel: '原密码',
                    name: 'oldPass',
                    emptyText: '请输入原密码'
                },
                {
                    fieldLabel: '新密码',
                    name: 'newPass',
                    id: 'newPass',
                    emptyText: '请输入新密码',
                    minLength: 6,
                    maxLength: 30
                },
                {
                    fieldLabel: '确认新密码',
                    name: 'reNewPass',
                    vtype: 'password',
                    newPassId: 'newPass',
                    emptyText: '请输入新密码'
                }
            ]
        });

        var win = Ext.create('Ext.window.Window', {
            title: "修改密码",
            width: 300,
            height: 200,
            bodyPadding: 10,
            layout: 'fit',
            border: 0,
            constrain: true,
            modal: true,
            resizable: false,
            shadow: 'frame',
            items: formPanel,
            buttons: [
                {
                    text: '取消',
                    handler: function () {
                        win.hide();
                    }
                },
                {
                    text: '确认',
                    handler: function () {
                        var form = formPanel.getForm();
                        if(form.isValid()){
                            form.submit({
                                url: CTX + '/admin/user/modify/pass',
                                success: function(form, action) {
                                    var msg = action.result && action.result.msg ? action.result.msg : '保存成功';
                                    Ext.Msg.alert('信息提示', msg);
                                    win.hide();
                                },
                                failure: function(form, action) {
                                    var msg = action.result && action.result.msg ? action.result.msg : '保存失败';
                                    Ext.Msg.alert('信息提示', msg);
                                }
                            });

                        }
                    }
                }
            ],
            listeners: {
                'hide': function () {
                    win.destroy();
                }
            }
        });

        win.show();
    });

    /*退出系统*/
    Ext.fly('logoff').on('click', function () {
        Ext.Msg.confirm('确认', '您确定要退出本系统吗？', function (opt) {
            if (opt == 'yes') {
                window.location.href = CTX + '/logoff';
            }
        });
    });

    /*页面布局*/
    var viewport = Ext.create('Ext.Viewport', {
        layout: {
            type: 'border',
//          padding: 5
        },
        defaults: {
            split: true
        },
        items: [
            header,
            navi,
            center,
            bottom
        ]
    });
});


