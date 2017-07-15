/**
 * 员工管理
 * <p>
 * @author bojiangzhou
 * @date 2017-04-05
 */
var Employee = {
    reload: function (params) {
        var toolbar = Employee.grid.getDockedItems('toolbar[dock="top"]');
        params = Ext.apply(params || {}, Global.getParams(toolbar));
        Employee.grid.getStore().load({
            params: params
        });
    },
    getGrid: function () {
        if(Employee.grid){
            return Employee.grid;
        }

        var store = Ext.create('Ext.data.Store', {
            fields:['id', 'name', 'code', 'idCard', 'mobile', 'sex', 'birthday', 'address', 'email', 'type', 'updater', 'updatime'],
            pageSize: Global.defaults.grid.pageSize,
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: CTX + '/admin/employee/page',
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
                    text: '员工姓名',
                    dataIndex: 'name'
                },
                {
                    text: '员工编号',
                    dataIndex: 'code'
                },
                {
                    text: '身份证',
                    dataIndex: 'idCard'
                },
                {
                    text: '手机号码',
                    dataIndex: 'mobile'
                },
                {
                    text: '性别',
                    dataIndex: 'sex',
                    renderer: function (v) {
                        var val = "";
                        switch (v) {
                            case 1:
                                val = "男";
                                break;
                            case 2:
                                val = "女";
                                break;
                            case 0:
                                val = "无";
                                break;
                            default:
                                val = "<span style='color:red;'>数据错误</span>";
                        }
                        return val;
                    }
                },
                {
                    text: '出生日期',
                    dataIndex: 'birthday',
                    renderer: function(v){
                        if (v) {
                            return Ext.Date.format(new Date(v), "Y-m-d");
                        }
                        return "";
                    }
                },
                {
                    text: '地址',
                    dataIndex: 'address'
                },
                {
                    text: '邮箱',
                    dataIndex: 'email'
                },
                {
                    text: '员工类别',
                    dataIndex: 'type'
                },
                {
                    text: '创建人',
                    hidden: true,
                    dataIndex: 'updater'
                },
                {
                    text: '创建时间',
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
                                var win = Employee.getWin('update', record);
                                win.show();
                            }
                        },
                        {
                            tooltip: '删除',
                            iconCls: 'silk-dust-bin',
                            handler: function (tree, rowIndex, colIndex, actionItem, event, record, row) {
                                Ext.Msg.confirm('确认', '您确定要删除该员工吗', function (opt) {
                                    if (opt == 'yes') {
                                        Ext.Ajax.request({
                                            url: CTX + '/admin/employee/remove',
                                            params: {
                                                'id': record.data.id
                                            },
                                            success: function(response, opts) {
                                                Ext.Msg.alert('信息提示', "删除成功");
                                                Employee.reload();
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
                        fieldLabel: '员工姓名'
                    },
                    {
                        xtype: 'combo',
                        name: 'type',
                        search: true,
                        width: 200,
                        fieldLabel: '员工类别',
                        valueField: 'name',
                        displayField: 'name',
                        editable: false,
                        store: {
                            fields: ['id', 'name'],
                            autoLoad: true,
                            proxy: {
                                type: 'ajax',
                                url: CTX + '/admin/param/list/employee_type',
                                reader: {
                                    type: 'json',
                                    root: 'content'
                                }
                            },
                            listeners: {
                                'load': function (store, records) {
                                    store.insert(0, [{'id': '所有', 'name': '所有'}]);
                                }
                            }
                        }
                    },
                    {
                        xtype: 'button',
                        text: '查询',
                        iconCls: 'silk-form-search',
                        handler: function(o, ev) {
                            Employee.reload();
                        }
                    },
                    {
                        xtype: 'button',
                        text: '新增',
                        iconCls: 'silk-form-add',
                        handler: function(o, ev) {
                            var win = Employee.getWin("create");
                            win.show();
                        }
                    }
                ]
            }
        });

        Employee.grid = grid;
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
                    fieldLabel: '员工姓名',
                    name: 'name',
                    afterLabelTextTpl: Global.required,
                    emptyText: '请输入员工姓名',
                    allowBlank: false
                },
                {
                    fieldLabel: '员工编号',
                    name: 'code',
                    afterLabelTextTpl: Global.required,
                    emptyText: '请输入员工编号',
                    allowBlank: false,
                    readOnly: action === 'update'
                },
                {
                    fieldLabel: '身'+Global.nbsp+'份'+Global.nbsp+'证',
                    name: 'idCard',
                    emptyText: '请输入身份证'
                },
                {
                    fieldLabel: '手机号码',
                    name: 'mobile',
                    vtype: 'mobile',
                    afterLabelTextTpl: Global.required,
                    emptyText: '请输入手机号码',
                    allowBlank: false
                },
                {
                    xtype: 'combo',
                    fieldLabel: '性'+Global.nbsp8+'别',
                    name: 'sex',
                    emptyText: '请选择性别',
                    allowBlank: false,
                    afterLabelTextTpl: Global.required,
                    valueField: 'id',
                    displayField: 'name',
                    editable: false,
                    store: {
                        fields: ['id', 'name'],
                        data: [
                            {
                                'id': 1,
                                'name': '男'
                            },
                            {
                                'id': 2,
                                'name': '女'
                            }
                        ]
                    }

                },
                {
                    xtype: 'datefield',
                    fieldLabel: '出生日期',
                    name: 'birthday',
                    itemId: 'birthday',
                    format: 'Y-m-d',
                    maxValue: new Date(),
                    emptyText: '请选择出生日期',
                    listeners: {
                        'change': function (o, nv) {

                        }
                    }
                },
                {
                    fieldLabel: '地'+Global.nbsp8+'址',
                    name: 'address',
                    emptyText: '请输入地址'
                },
                {
                    fieldLabel: '邮'+Global.nbsp8+'箱',
                    name: 'email',
                    emptyText: '请输入邮箱',
                    vtype: 'email'
                },
                {
                    xtype: 'combo',
                    name: 'type',
                    fieldLabel: '员工类别',
                    emptyText: '请选择员工类别',
                    allowBlank: false,
                    afterLabelTextTpl: Global.required,
                    valueField: 'name',
                    displayField: 'name',
                    editable: false,
                    store: {
                        fields: ['id', 'name'],
                        autoLoad: true,
                        proxy: {
                            type: 'ajax',
                            url: CTX + '/admin/param/list/employee_type',
                            reader: {
                                type: 'json',
                                root: 'content'
                            }
                        }
                    }
                }
            ]
        });

        if(action === 'update'){
            formPanel.loadRecord(record);
            if(record.data['birthday']){
                formPanel.getComponent('birthday').setValue(Ext.Date.format(new Date(record.data['birthday']), "Y-m-d"));
            }
        }

        var win = Ext.create('Ext.window.Window', {
            title: "员工",
            width: 350,
            height: 410,
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
                                url: CTX + '/admin/employee/save',
                                submitEmptyText: false,
                                success: function(form, action) {
                                    var msg = action.result && action.result.msg ? action.result.msg : "保存成功";
                                    Ext.Msg.alert('信息提示', msg);
                                    Employee.reload();
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

    var grid = Employee.getGrid();

    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: grid
    });

});

