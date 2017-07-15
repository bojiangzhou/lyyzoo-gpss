/**
 * 供应商管理
 * <p>
 * @author bojiangzhou
 * @date 2017-04-06
 */
var Supplier = {
    reload: function (params) {
        var toolbar = Supplier.grid.getDockedItems('toolbar[dock="top"]');
        params = Ext.apply(params || {}, Global.getParams(toolbar));
        Supplier.grid.getStore().load({
            params: params
        });
    },
    getGrid: function () {
        if(Supplier.grid){
            return Supplier.grid;
        }

        var store = Ext.create('Ext.data.Store', {
            fields:['id', 'name', 'linkman', 'mobile', 'address', 'descs', 'updater', 'updatime'],
            pageSize: Global.defaults.grid.pageSize,
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: CTX + '/admin/supplier/page',
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
                    text: '供应商名称',
                    dataIndex: 'name'
                },
                {
                    text: '联系人',
                    dataIndex: 'linkman'
                },
                {
                    text: '联系电话',
                    dataIndex: 'mobile'
                },
                {
                    text: '联系地址',
                    dataIndex: 'address'
                },
                {
                    text: '描述',
                    dataIndex: 'descs'
                },
                {
                    text: '创建人',
                    hidden: true,
                    dataIndex: 'updater'
                },
                {
                    text: '更新时间',
                    dataIndex: 'updatime',
                    renderer: function(v){
                        if (v) {
                            return Ext.Date.format(new Date(v), "Y-m-d h:i");
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
                                var win = Supplier.getWin('update', record);
                                win.show();
                            }
                        },
                        {
                            tooltip: '删除',
                            iconCls: 'silk-dust-bin',
                            handler: function (tree, rowIndex, colIndex, actionItem, event, record, row) {
                                Ext.Msg.confirm('确认', '您确定要删除该供应商吗', function (opt) {
                                    if (opt == 'yes') {
                                        Ext.Ajax.request({
                                            url: CTX + '/admin/supplier/remove',
                                            params: {
                                                'id': record.data.id
                                            },
                                            success: function(response, opts) {
                                                Ext.Msg.alert('信息提示', "删除成功");
                                                Supplier.reload();
                                            }
                                        });
                                    }
                                });
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
                defaults: {
                    labelAlign: Global.labelAlign,
                    labelWidth: Global.labelWidth
                },
                items: [
                    {
                        xtype: 'textfield',
                        name: 'name',
                        search: true,
                        labelWidth: Global.labelWidth + 10,
                        fieldLabel: '供应商名称'
                    },
                    {
                        xtype: 'button',
                        text: '查询',
                        iconCls: 'silk-form-search',
                        handler: function(o, ev) {
                            Supplier.reload();
                        }
                    },
                    {
                        xtype: 'button',
                        text: '新增',
                        iconCls: 'silk-form-add',
                        handler: function(o, ev) {
                            var win = Supplier.getWin("create");
                            win.show();
                        }
                    }
                ]
            }
        });

        Supplier.grid = grid;
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
                labelAlign: 'left',
                labelWidth: Global.labelWidth,
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'hidden',
                    name: 'id'
                },
                {
                    fieldLabel: '供'+Global.nbsp+'应'+Global.nbsp+'商',
                    name: 'name',
                    afterLabelTextTpl: Global.required,
                    emptyText: '请输入供应商名称',
                    allowBlank: false
                },
                {
                    fieldLabel: '联'+Global.nbsp+'系'+Global.nbsp+'人',
                    name: 'linkman',
                    afterLabelTextTpl: Global.required,
                    emptyText: '请输入联系人',
                    allowBlank: false
                },
                {
                    fieldLabel: '联系电话',
                    name: 'mobile',
                    afterLabelTextTpl: Global.required,
                    emptyText: '请输入联系电话',
                    allowBlank: false
                },
                {
                    fieldLabel: '联系地址',
                    name: 'address',
                    afterLabelTextTpl: Global.required,
                    emptyText: '请输入联系地址',
                    allowBlank: false
                },
                {
                    fieldLabel: '描'+Global.nbsp8+'述',
                    name: 'descs',
                    emptyText: '请输入供应商描述'
                }
            ]
        });

        if(action === 'update'){
            formPanel.loadRecord(record);
        }

        var win = Ext.create('Ext.window.Window', {
            title: "供应商",
            width: 350,
            height: 280,
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
                                url: CTX + '/admin/supplier/save',
                                submitEmptyText: false,
                                success: function(form, action) {
                                    var msg = action.result && action.result.msg ? action.result.msg : "保存成功";
                                    Ext.Msg.alert('信息提示', msg);
                                    Supplier.reload();
                                    win.hide();
                                },
                                failure: function(form, action) {
                                    var msg = action.result && action.result.msg ? action.result.msg : "保存失败";
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

        return win;
    }
};

Ext.require(['*']);

Ext.onReady(function () {
    Ext.tip.QuickTipManager.init();

    Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));

    var grid = Supplier.getGrid();

    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: grid
    });

});



