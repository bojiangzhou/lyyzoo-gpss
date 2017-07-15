/**
 * 用户管理
 * <p>
 * @author bojiangzhou
 * @date 2017-04-03
 */
var User = {
    reload: function (params) {
        var toolbar = User.grid.getDockedItems('toolbar[dock="top"]');
        params = Ext.apply(params || {}, Global.getParams(toolbar));
        User.grid.getStore().load({
            params: params
        });
    },
    getGrid: function () {
        if(User.grid){
            return User.grid;
        }

        var store = Ext.create('Ext.data.Store', {
            fields:['id', 'account', 'password', 'roleId', 'roleName', 'employeeId', 'employeeName', 'employeeCode', 'updater', 'updatime', 'isLocked', 'lockTime'],
            pageSize: Global.defaults.grid.pageSize,
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: CTX + '/admin/user/page',
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
                    text: '用户账号',
                    dataIndex: 'account'
                },
                {
                    text: '角色名称',
                    dataIndex: 'roleName'
                },
                {
                    text: '员工姓名',
                    dataIndex: 'employeeName'
                },
                {
                    text: '员工编号',
                    dataIndex: 'employeeCode'
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
                            return Ext.Date.format(new Date(v), "Y-m-d h:i:s");
                        }
                        return "";
                    }
                },
                {
                    text: '锁定状态',
                    dataIndex: 'isLocked',
                    renderer: function (v) {
                        var val = "";
                        switch (v) {
                            case 1:
                                val = "已锁定";
                                break;
                            case 0:
                                val = "正常";
                                break;
                            default:
                                val = "<span style='color:red;'>数据错误</span>";
                        }
                        return val;
                    }
                },
                {
                    text: '锁定时间',
                    hidden: true,
                    dataIndex: 'lockTime'
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
                                var win = User.getWin('update', record);
                                win.show();
                            }
                        },
                        {
                            tooltip: '删除',
                            iconCls: 'silk-dust-bin',
                            handler: function (tree, rowIndex, colIndex, actionItem, event, record, row) {
                                Ext.Msg.confirm('确认', '您确定要删除该用户吗', function (opt) {
                                    if (opt == 'yes') {
                                        Ext.Ajax.request({
                                            url: CTX + '/admin/user/remove',
                                            params: {
                                                'id': record.data.id
                                            },
                                            success: function(response, opts) {
                                                Ext.Msg.alert('信息提示', "删除成功");
                                                User.reload();
                                            }
                                        });
                                    }
                                });
                            },
                            getClass: function (v, metadata, record, rowIndex, colIndex, store) {
                                if (record.data.account === "admin") {
                                    return "x-hidden";
                                } else {
                                    return "silk-dust-bin";
                                }
                            }
                        },
                        {
                            tooltip: '锁定',
                            iconCls: 'silk-lock',
                            handler: function (tree, rowIndex, colIndex, actionItem, event, record, row) {
                                Ext.Msg.confirm('确认', '您确定要锁定该用户吗', function (opt) {
                                    if (opt == 'yes') {
                                        Ext.Ajax.request({
                                            url: CTX + '/admin/user/lock',
                                            params: {
                                                'id': record.data.id
                                            },
                                            success: function(response, opts) {
                                                Ext.Msg.alert('信息提示', "锁定成功");
                                                User.reload();
                                            }
                                        });
                                    }
                                });
                            },
                            getClass: function (v, metadata, record, rowIndex, colIndex, store) {
                                if (record.data.isLocked === 0 && record.data.account !== 'admin') {
                                    return "silk-lock";
                                } else {
                                    return "x-hidden";
                                }
                            }
                        },
                        {
                            tooltip: '解锁',
                            iconCls: 'silk-unlock',
                            handler: function (tree, rowIndex, colIndex, actionItem, event, record, row) {
                                Ext.Msg.confirm('确认', '您确定要解锁该用户吗', function (opt) {
                                    if (opt == 'yes') {
                                        Ext.Ajax.request({
                                            url: CTX + '/admin/user/unlock',
                                            params: {
                                                'id': record.data.id
                                            },
                                            success: function(response, opts) {
                                                Ext.Msg.alert('信息提示', "解锁成功");
                                                User.reload();
                                            }
                                        });
                                    }
                                });
                            },
                            getClass: function (v, metadata, record, rowIndex, colIndex, store) {
                                if (record.data.isLocked === 1 && record.data.account !== 'admin') {
                                    return "silk-unlock";
                                } else {
                                    return "x-hidden";
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
                defaults: {
                    labelAlign: Global.labelAlign,
                    labelWidth: Global.labelWidth
                },
                items: [
                    {
                        xtype: 'textfield',
                        name: 'account',
                        search: true,
                        fieldLabel: '用户账号'
                    },
                    {
                        xtype: 'combo',
                        name: 'roleId',
                        search: true,
                        width: 200,
                        fieldLabel: '用户角色',
                        valueField: 'id',
                        displayField: 'name',
                        editable: false,
                        store: {
                            fields: ['id', 'name'],
                            autoLoad: true,
                            proxy: {
                                type: 'ajax',
                                url: CTX + '/admin/role/list/all',
                                reader: {
                                    type: 'json',
                                    root: 'content'
                                }
                            },
                            listeners: {
                                'load': function (store, records) {
                                    store.insert(0, [{'id': -1, 'name': '所有'}]);
                                }
                            }
                        }
                    },
                    {
                        xtype: 'combo',
                        name: 'isLocked',
                        search: true,
                        width: 200,
                        fieldLabel: '锁定状态',
                        editable: false,
                        valueField: 'id',
                        displayField: 'name',
                        queryMode: 'local',
                        store: {
                            fields: ['id', 'name'],
                            data: [
                                {
                                    'id': -1,
                                    'name': '所有'
                                },
                                {
                                    'id': 0,
                                    'name': '正常'
                                },
                                {
                                    'id': 1,
                                    'name': '锁定'
                                }
                            ]
                        }
                    },
                    {
                        xtype: 'button',
                        text: '查询',
                        iconCls: 'silk-form-search',
                        handler: function(o, ev) {
                            User.reload();
                        }
                    },
                    {
                        xtype: 'button',
                        text: '新增',
                        iconCls: 'silk-form-add',
                        handler: function(o, ev) {
                            var win = User.getWin("create");
                            win.show();
                        }
                    }
                ]
            }
        });

        User.grid = grid;
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
                    fieldLabel: '用户账号',
                    name: 'account',
                    afterLabelTextTpl: Global.required,
                    readOnly: action === 'update',
                    emptyText: '请输入用户账号',
                    allowBlank: false,
                    vtype: 'alphanum'
                },
                {
                    xtype: 'combo',
                    name: 'roleId',
                    fieldLabel: '用户角色',
                    emptyText: '请选择用户角色',
                    allowBlank: false,
                    afterLabelTextTpl: Global.required,
                    valueField: 'id',
                    displayField: 'name',
                    editable: false,
                    store: {
                        fields: ['id', 'name'],
                        autoLoad: true,
                        proxy: {
                            type: 'ajax',
                            url: CTX + '/admin/role/list/all',
                            reader: {
                                type: 'json',
                                root: 'content'
                            }
                        }
                    },
                    listeners: {
                        'change': function (o, nv) {
                            var roleName = o.nextNode('textfield[name=roleName]');
                            roleName.setValue(o.getRawValue());
                        }
                    }
                },
                {
                    fieldLabel: '用户角色',
                    name: 'roleName',
                    hidden: true
                },
                {
                    xtype: 'trigger',
                    fieldLabel: '员'+Global.nbsp8+'工',
                    name: 'employeeName',
                    editable: false,
                    triggerCls: 'x-form-search-trigger',
                    emptyText: '请选择员工',
                    onTriggerClick: function() {
                        var employeeId = this.nextNode("textfield[name=employeeId]");
                        var employeeWin = Employee.getWin(this, employeeId);
                        employeeWin.show();
                    }
                },
                {
                    fieldLabel: '员工ID',
                    hidden: true,
                    name: 'employeeId'
                }
            ]
        });

        if(action === 'update'){
            formPanel.loadRecord(record);
        }

        var win = Ext.create('Ext.window.Window', {
            title: "用户",
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
                        if(form.isValid()){
                            form.submit({
                                url: CTX + '/admin/user/save',
                                submitEmptyText: false,
                                success: function(form, action) {
                                    var msg = action.result && action.result.msg ? action.result.msg : "保存成功";
                                    Ext.Msg.alert('信息提示', msg);
                                    User.reload();
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

/**
 * 员工
 */
var Employee = {
    reload: function (params) {
        var toolbar = Employee.grid.getDockedItems('toolbar[dock="top"]')[0];
        params = Ext.apply(params || {}, Global.getParams(toolbar));
        Employee.grid.getStore().load({
            params: params
        });
    },
    getGrid: function () {

        var store = Ext.create('Ext.data.Store', {
            fields:['id', 'name', 'code', 'idCard', 'mobile', 'sex', 'birthday', 'address', 'email', 'type'],
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
            selType : 'checkboxmodel',
            selModel: {
                'mode': 'single' //单选
            },
            bodyPadding: '0',
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
                    hidden: true,
                    dataIndex: 'idCard'
                },
                {
                    text: '手机号码',
                    dataIndex: 'mobile'
                },
                {
                    text: '性别',
                    dataIndex: 'sex',
                    hidden: true,
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
                    hidden: true,
                    renderer: function(v){
                        if (v) {
                            return Ext.Date.format(new Date(v), "Y-m-d");
                        }
                        return "";
                    }
                },
                {
                    text: '地址',
                    dataIndex: 'address',
                    hidden: true
                },
                {
                    text: '邮箱',
                    dataIndex: 'email',
                    hidden: true
                },
                {
                    text: '员工类别',
                    dataIndex: 'type'
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
                        name: 'typeId',
                        search: true,
                        width: 200,
                        fieldLabel: '员工类别',
                        valueField: 'id',
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
                                    store.insert(0, [{'id': -1, 'name': '所有'}]);
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
                    }
                ]
            }
        });

        Employee.grid = grid;
        return grid;
    },
    getWin: function (showText, hideText) {
        var grid = Employee.getGrid();

        var win = Ext.create('Ext.window.Window', {
            title: "选择员工",
            width: 580,
            height: 450,
            bodyPadding: 0,
            layout: 'fit',
            border: 0,
            constrain: true,
            modal: true,
            resizable: false,
            shadow: 'frame',
            items: grid,
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
                        var selModel = grid.getSelectionModel();
                        var sel = selModel.getSelection()[0];
                        var name = "", id = "";
                        if(sel){
                            name = sel.data.name;
                            id = sel.data.id;
                        }
                        showText.setValue(name);
                        hideText.setValue(id);

                        win.hide();
                    }
                }
            ],
            listeners: {
                'hide': function () {
                    win.destroy();
                }
            }
        });

        Employee.win = win;

        return win;
    }
};

Ext.require(['*']);

Ext.onReady(function () {
    Ext.tip.QuickTipManager.init();

    Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));

    var grid = User.getGrid();

    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: grid
    });

});

