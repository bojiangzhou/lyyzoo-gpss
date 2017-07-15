/**
 * 菜单管理
 * <p>
 * @author bojiangzhou
 * @date 2017-04-02
 */

var Menu = {
    reload: function () {
        Menu.menuTree.getStore().load();
    },

    getTreePanel: function (defaults) {
        defaults = Ext.applyIf(defaults || {}, {
            store: {
                fields: [
                    'id',
                    'name',
                    'upId',
                    'path',
                    'isLeaf',
                    'updatime'
                ],
                proxy: {
                    type: 'ajax',
                    url: CTX + '/admin/menu/list'
                },
                nodeParam: 'id',
                autoLoad: true
            },
            root: {
                id: 0,
                name: '菜单',
                expanded: true,
                leaf: false,
                isLeaf: 0,
                upId: -1
            },
            useArrows: false,
            autoScroll: true,
            rootVisible: true,
            frame: false,
            forceFit: true,
            columnLines: false,
            emptyText: '<div class="x-grid-empty">未找到匹配记录</div>',
            multiSelect: false,
            enableColumnMove: false,
            enableColumnResize: true,
            viewConfig: {
                stripeRows: true,
                columnLines: false
            },
            columns: [
                {
                    text: 'id',
                    hidden: true,
                    dataIndex: 'id'
                },
                {
                    xtype: 'treecolumn',
                    text: "菜单名称",
                    dataIndex: "name"
                },
                {
                    text: "地址",
                    dataIndex: "path"
                },
                {
                    text: "节点",
                    dataIndex: "isLeaf",
                    renderer: function (v) {
                        var leaf = "";
                        switch (v) {
                            case 0:
                                leaf = "否";
                                break;
                            case 1:
                                leaf = "是";
                                break;
                            default:
                                leaf = "<span style='color:red;'>数据错误</span>";
                        }
                        return leaf;
                    }
                },
                {
                    text: "创建时间",
                    dataIndex: "updatime",
                    hidden: true,
                    renderer: function (value) {
                        if (value) {
                            return Ext.Date.format(new Date(value), "Y-m-d h:i:s");
                        }
                        return "";
                    }
                },
                {
                    text: '操作',
                    width: 120,
                    maxWidth: 120,
                    menuDisabled: true,
                    xtype: 'actioncolumn',
                    items: [
                        {
                            tooltip: '新增下级菜单',
                            iconCls: 'silk-form-add',
                            handler: function (tree, rowIndex, colIndex, actionItem, event, record, row) {
                                var win = Menu.getWin("create", record);
                                win.show();
                            },
                            getClass: function (v, metadata, record, rowIndex, colIndex, store) {
                                if (record.data.upId > 0) {
                                    return "x-hidden";
                                } else {
                                    return "silk-form-add";
                                }
                            }
                        },
                        {
                            tooltip: '修改',
                            iconCls: 'silk-form-update',
                            handler: function (tree, rowIndex, colIndex, actionItem, event, record, row) {
                                var win = Menu.getWin("update", record);
                                win.show();
                            },
                            getClass: function (v, metadata, record, rowIndex, colIndex, store) {
                                if (record.data.id === 0) {
                                    return "x-hidden";
                                } else {
                                    return "silk-form-update";
                                }
                            }
                        },
                        {
                            tooltip: '删除',
                            iconCls: 'silk-dust-bin',
                            handler: function (tree, rowIndex, colIndex, actionItem, event, record, row) {
                                Ext.Msg.confirm('确认', '您确定要删除菜单吗', function (opt) {
                                    if (opt == 'yes') {
                                        Ext.Ajax.request({
                                            url: CTX + '/admin/menu/remove',
                                            params: {
                                                'id': record.data.id
                                            },
                                            success: function (response, opts) {
                                                Ext.Msg.alert('信息提示', "删除成功");
                                                Menu.reload();
                                            }
                                        });
                                    }
                                });
                            },
                            getClass: function (v, metadata, record, rowIndex, colIndex, store) {
                                if (record.data.id === 0) {
                                    return "x-hidden";
                                } else {
                                    return "silk-dust-bin";
                                }
                            }
                        }
                    ]
                }
            ]
        });

        Menu.menuTree = Ext.create('Ext.tree.Panel', defaults);

        return Menu.menuTree;
    },
    getWin: function (action, record) {
        var id      = record.data.id;
        var upId    = record.data.upId;
        var isLeaf  = record.data.isLeaf;
        var createIsLeaf = upId === 0 ? 1 : 0;

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
                labelAlign: 'left',
                labelWidth: Global.labelWidth,
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'hidden',
                    name: 'id',
                    value: action === 'create' ? '' : id
                },
                {
                    xtype: 'hidden',
                    name: 'upId',
                    value: action === 'create' ? id : upId
                },
                {
                    xtype: 'hidden',
                    name: 'isLeaf',
                    value: action === 'create' ? createIsLeaf : isLeaf
                },
                {
                    fieldLabel: '菜单名称',
                    name: 'name',
                    afterLabelTextTpl: Global.required,
                    emptyText: '请输入菜单名称...',
                    value: action === 'update' ? record.data.name : '',
                    allowBlank: false
                },
                {
                    fieldLabel: '菜单地址',
                    name: 'path',
                    value: action === 'update' ? record.data.path : ''
                }
            ]
        });

        var win = Ext.create('Ext.window.Window', {
            title: "菜单",
            width: 350,
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
                    text: '保存',
                    handler: function () {
                        var form = formPanel.getForm();
                        if (form.isValid()) {
                            form.submit({
                                url: CTX + '/admin/menu/save',
                                submitEmptyText: false,
                                success: function (form, action) {
                                    Ext.Msg.alert('信息提示', "保存成功");
                                    Menu.reload();
                                    win.hide();
                                },
                                failure: function (form, action) {
                                    Ext.Msg.alert('信息提示', "保存失败");
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

        return win;
    }
};

Ext.require(['*']);

Ext.onReady(function () {
    Ext.tip.QuickTipManager.init();

    Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));

    var menuTree = Menu.getTreePanel();

    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: menuTree
    });

});



