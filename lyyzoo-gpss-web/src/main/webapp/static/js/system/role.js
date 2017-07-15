/**
 * 角色管理
 * <p>
 * @author bojiangzhou
 * @date 2017-04-01
 */
var Role = {
    reload: function (params) {
        var toolbar = Role.grid.getDockedItems('toolbar[dock="top"]');
        params = Ext.apply(params || {}, Global.getParams(toolbar));
        Role.grid.getStore().load({
            params: params
        });
    },
    getGrid: function () {
        if(Role.grid){
            return Role.grid;
        }

        var store = Ext.create('Ext.data.Store', {
            fields:['id', 'name', 'code', 'descs', 'menuIds', 'menuNames', 'state', 'updater', 'updatime'],
            pageSize: Global.defaults.grid.pageSize,
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: CTX + '/admin/role/page',
                pageParam : Global.defaults.proxy.pageParam,
                limitParam : Global.defaults.proxy.limitParam,
                reader: {
                    type: 'json',
                    root: 'content'
                }
            }
        });

        var grid = Ext.create('Ext.grid.Panel', {
            store: store,
            selType : 'rowmodel',
            frame : false,
            border : true,
            forceFit : true,
            columnLines : true,
            emptyText : '<div class="x-grid-empty">未找到匹配记录</div>',
            multiSelect : false,
            // enableColumnMove : false,
            enableColumnResize : true,
            viewConfig : {
                stripeRows : false,
                enableTextSelection : true
            },
            columns: [
                {
                    xtype: 'rownumberer',
                    text: '序号',
                    width: 60,
                    align: 'center'
                },
                {
                    text: 'ID',
                    dataIndex: 'id',
                    hidden: true
                },
                {
                    text: '角色名称',
                    dataIndex: 'name'
                },
                {
                    text: '角色编码',
                    dataIndex: 'code'
                },
                {
                    text: '角色描述',
                    dataIndex: 'descs'
                },
                {
                    text: '角色菜单ID',
                    hidden: true,
                    dataIndex: 'menuIds'
                },
                {
                    text: '角色菜单',
                    dataIndex: 'menuNames'
                },
                {
                    text: '创建者',
                    hidden: true,
                    dataIndex: 'updater'
                },
                {
                    text: '创建时间',
                    dataIndex: 'updatime',
                    renderer: function(value){
                        if (value) {
                            return Ext.Date.format(new Date(value), "Y-m-d h:i:s");
                        }
                        return "";
                    }
                },
                {
                    text: '操作',
                    xtype: 'actioncolumn',
                    width: 120,
                    maxWidth: 120,
                    menuDisabled: true,
                    items: [
                        {
                            tooltip: '修改',
                            iconCls: 'silk-form-update',
                            handler: function (tree, rowIndex, colIndex, actionItem, event, record, row) {
                                var win = Role.getWin('update', record);
                                win.show();
                            }
                        },
                        {
                            tooltip: '删除',
                            iconCls: 'silk-dust-bin',
                            handler: function (tree, rowIndex, colIndex, actionItem, event, record, row) {
                                Ext.Msg.confirm('确认', '您确定要删除菜单吗', function (opt) {
                                    if (opt == 'yes') {
                                        Ext.Ajax.request({
                                            url: CTX + '/admin/role/remove',
                                            params: {
                                                'id': record.data.id
                                            },
                                            success: function(response, opts) {
                                                Ext.Msg.alert('信息提示', "删除成功");
                                                Role.reload();
                                            }
                                        });
                                    }
                                });
                            },
                            getClass: function (v, metadata, record, rowIndex, colIndex, store) {
                                if (record.data.code === "ADMIN") {
                                    return "x-hidden";
                                } else {
                                    return "silk-dust-bin";
                                }
                            }
                        }
                    ]
                }
            ],
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: store,
                dock: 'bottom',
                displayInfo: true
            }],
            tbar: {
                minHeight: Global.toolbarHeight,
                items: [
                    {
                        xtype: 'textfield',
                        name: 'code',
                        search: true,
                        fieldLabel: '角色编码',
                        labelAlign: 'left',
                        labelWidth: Global.labelWidth
                    },
                    {
                        xtype: 'button',
                        text: '查询',
                        iconCls: 'silk-form-search',
                        handler: function(o, ev) {
                            Role.reload()
                        }
                    },
                    {
                        xtype: 'button',
                        text: '新增',
                        iconCls: 'silk-form-add',
                        handler: function(o, ev) {
                            var win = Role.getWin();
                            win.show();
                        }
                    }
                ]
            }
        });

        Role.grid = grid;
        return grid;
    },
    getWin: function (action, record) {
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
                labelAlign: Global.labelAlign,
                labelWidth: Global.labelWidth,
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'hidden',
                    name: 'id'
                },
                {
                    fieldLabel: '角色名称',
                    name: 'name',
                    afterLabelTextTpl: Global.required,
                    emptyText: '请输入角色名称',
                    allowBlank: false
                },
                {
                    fieldLabel: '角色编码',
                    name: 'code',
                    afterLabelTextTpl: Global.required,
                    emptyText: '请输入角色编码',
                    allowBlank: false
                },
                {
                    fieldLabel: '角色描述',
                    name: 'descs',
                    emptyText: '请输入角色描述'
                },
                {
                    xtype: 'trigger',
                    fieldLabel: '角色菜单',
                    name: 'menuNames',
                    editable: false,
                    triggerCls: 'x-form-search-trigger',
                    emptyText: '请选择菜单',
                    onTriggerClick: function() {
                        var menuIds = this.nextNode("textfield[name=menuIds]");
                        var menuWin = Menu.getWin(menuIds.value, this, menuIds);
                        menuWin.show();
                    }
                },
                {
                    fieldLabel: '角色菜单',
                    hidden: true,
                    name: 'menuIds'
                }
            ]
        });

        if(action === 'update'){
            formPanel.loadRecord(record);
        }

        var win = Ext.create('Ext.window.Window', {
            title: "角色",
            width: 350,
            height: 250,
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
                        if(form.isValid()){
                            form.submit({
                                url: CTX + '/admin/role/save',
                                submitEmptyText: false,
                                success: function(form, action) {
                                    Ext.Msg.alert('信息提示', "保存成功");
                                    Role.reload();
                                    win.hide();
                                },
                                failure: function(form, action) {
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
                    url: CTX + '/admin/menu/list/all'
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
            selType: 'checkboxmodel',
            useArrows: false,
            autoScroll: true,
            rootVisible: true,
            frame: false,
            forceFit: true,
            columnLines: false,
            emptyText: Global.emptyRecord,
            multiSelect: false,
            enableColumnMove: false,
            enableColumnResize: true,
            viewConfig: {
                stripeRows: true,
                columnLines: false
            },
            columns: [
                {
                    text: 'ID',
                    hidden: true,
                    dataIndex: 'id'
                },
                {
                    xtype: 'treecolumn',
                    text: "菜单名称",
                    dataIndex: "name"
                }
            ]
        });

        Menu.menuTree = Ext.create('Ext.tree.Panel', defaults);

        return Menu.menuTree;
    },
    getWin: function (selIds, menuNames, menuIds) {

        var menuTree = Menu.getTreePanel();
        var ids = [];
        if(selIds && selIds !== ""){
            ids = selIds.split(",");

            menuTree.getStore().on('load', function (store, records) {
                //回显数据
                var sels = [];
                for(var i in ids){
                    var sel = store.getById(ids[i]);
                    if(sel){
                        sels.push(sel);
                    }
                }
                if(sels.length > 0){
                    menuTree.getSelectionModel().select(sels);
                }
            });
        }

        var win = Ext.create('Ext.window.Window', {
            title: "选择菜单",
            width: 450,
            height: 380,
            bodyPadding: 10,
            layout: 'fit',
            border: 0,
            constrain: true,
            modal: true,
            resizable: false,
            shadow: 'frame',
            items: menuTree,
            buttons: [
                {
                    text: '取消',
                    handler: function () {
                        win.hide();
                    }
                },
                {
                    text: '确定',
                    handler: function () {
                        var selModel = menuTree.getSelectionModel();
                        var sels = selModel.getSelection();
                        var ids = "", names = "";
                        for(var i=0;i < sels.length;i++){
                            var menu = sels[i];
                            ids += "," + menu.data.id;
                            names += "," + menu.data.name;
                        }
                        ids = ids.substr(1);
                        names = names.substr(1);

                        menuIds.setValue(ids);
                        menuNames.setValue(names);

                        win.hide();
                    }
                }
            ],
            listeners: {
                'hide': function () {
                    win.destroy();
                },
                'show': function () {
                    menuTree.expandAll();
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

    var grid = Role.getGrid();

    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: grid
    });

});


