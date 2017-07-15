/**
 * 基础参数
 * <p>
 * @author bojiangzhou
 * @date 2017-04-04
 */

var Param = {
    reload: function (params) {
        var toolbar = Param.grid.getDockedItems('toolbar[dock="top"]');
        params = Ext.apply(params || {}, Global.getParams(toolbar));
        Param.grid.getStore().load({
            params: params
        });
    },
    getType: function (defaults) {
        defaults = Ext.apply(defaults || {}, {
            xtype: 'combo',
            name: 'type',
            fieldLabel: '参数类别',
            emptyText: '请选择参数类别',
            labelAlign: 'left',
            labelWidth: Global.labelWidth,
            editable: false,
            valueField: 'code',
            displayField: 'name',
            queryMode: 'local',
            store: {
                fields: ['code', 'name'],
                data: [
                    {
                        'code': "GOODS_TYPE",
                        'name': '商品类别'
                    },
                    {
                        'code': "GOODS_STANDARD",
                        'name': '规格型号'
                    },
                    {
                        'code': "GOODS_UNIT",
                        'name': '计量单位'
                    },
                    {
                        'code': "BRAND",
                        'name': '品牌'
                    },
                    {
                        'code': "MATERIAL",
                        'name': '材质'
                    },
                    {
                        'code': "COLOR",
                        'name': '颜色'
                    },
                    {
                        'code': "EMPLOYEE_TYPE",
                        'name': '员工类别'
                    }
                ]
            }
        });

        return defaults;
    },
    getGrid: function () {
        if(Param.grid){
            return Param.grid;
        }

        var store = Ext.create('Ext.data.Store', {
            fields:['id', 'name', 'descs', 'state', 'type', 'creater', 'creatime'],
            pageSize: Global.defaults.grid.pageSize,
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: CTX + '/admin/param/page',
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
                    text: '参数名称',
                    dataIndex: 'name'
                },
                {
                    text: '描述',
                    dataIndex: 'descs'
                },
                {
                    text: '参数类别',
                    dataIndex: 'type',
                    renderer: function (v) {
                        var val = "";
                        switch (v) {
                            case "GOODS_TYPE":
                                val = "商品类别";
                                break;
                            case "GOODS_STANDARD":
                                val = "规格型号";
                                break;
                            case "GOODS_UNIT":
                                val = "计量单位";
                                break;
                            case "BRAND":
                                val = "品牌";
                                break;
                            case "MATERIAL":
                                val = "材质";
                                break;
                            case "COLOR":
                                val = "颜色";
                                break;
                            case "EMPLOYEE_TYPE":
                                val = "员工类别";
                                break;
                            default:
                                val = "<span style='color:red;'>数据错误</span>";
                        }
                        return val;
                    }
                },
                {
                    text: '创建者',
                    hidden: true,
                    dataIndex: 'updater'
                },
                {
                    text: '创建时间',
                    dataIndex: 'updatime',
                    hidden: true,
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
                                var win = Param.getWin('update', record);
                                win.show();
                            }
                        },
                        {
                            tooltip: '删除',
                            iconCls: 'silk-dust-bin',
                            handler: function (tree, rowIndex, colIndex, actionItem, event, record, row) {
                                Ext.Msg.confirm('确认', '您确定要删除该参数吗', function (opt) {
                                    if (opt == 'yes') {
                                        Ext.Ajax.request({
                                            url: CTX + '/admin/param/remove',
                                            params: {
                                                'id': record.data.id
                                            },
                                            success: function(response, opts) {
                                                Ext.Msg.alert('信息提示', "删除成功");
                                                Param.reload();
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
                items: [
                    Param.getType({'search': true}),
                    {
                        xtype: 'button',
                        text: '查询',
                        iconCls: 'silk-form-search',
                        handler: function(o, ev) {
                            Param.reload()
                        }
                    },
                    {
                        xtype: 'button',
                        text: '新增',
                        iconCls: 'silk-form-add',
                        handler: function(o, ev) {
                            var win = Param.getWin();
                            win.show();
                        }
                    }
                ]
            }
        });

        Param.grid = grid;
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
                Param.getType({
                    allowBlank: false,
                    afterLabelTextTpl: Global.required,
                    readOnly: action === 'update'
                }),
                {
                    fieldLabel: '参数名称',
                    name: 'name',
                    afterLabelTextTpl: Global.required,
                    emptyText: '请输入参数名称',
                    allowBlank: false
                },
                {
                    fieldLabel: '描'+Global.nbsp8+'述',
                    name: 'descs',
                    emptyText: '请输入参数描述'
                }
            ]
        });

        if(action === 'update'){
            formPanel.loadRecord(record);
        }

        var win = Ext.create('Ext.window.Window', {
            title: "基础参数",
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
                    text: '保存',
                    handler: function () {
                        var form = formPanel.getForm();
                        if(form.isValid()){
                            form.submit({
                                url: CTX + '/admin/param/save',
                                submitEmptyText: false,
                                success: function(form, action) {
                                    Ext.Msg.alert('信息提示', "保存成功");
                                    Param.reload();
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

Ext.require(['*']);

Ext.onReady(function () {
    Ext.tip.QuickTipManager.init();

    Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));

    var grid = Param.getGrid();

    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: grid
    });

});




