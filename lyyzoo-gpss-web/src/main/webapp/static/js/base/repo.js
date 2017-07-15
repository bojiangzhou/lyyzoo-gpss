/**
 * 员工管理
 * <p>
 * @author bojiangzhou
 * @date 2017-04-05
 */

var Repo = {
    reload: function (params) {
        var toolbar = Repo.grid.getDockedItems('toolbar[dock="top"]');
        params = Ext.apply(params || {}, Global.getParams(toolbar));
        Repo.grid.getStore().load({
            params: params
        });
    },
    getGrid: function () {
        if(Repo.grid){
            return Repo.grid;
        }

        var store = Ext.create('Ext.data.Store', {
            fields:['id', 'name', 'code', 'address', 'descs', 'adminId', 'adminName', 'adminMobile', 'type', 'updater', 'updatime'],
            pageSize: Global.defaults.grid.pageSize,
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: CTX + '/admin/repo/page',
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
                    text: '仓库名称',
                    dataIndex: 'name'
                },
                {
                    text: '仓库编号',
                    dataIndex: 'code'
                },
                {
                    text: '仓库地址',
                    dataIndex: 'address'
                },
                {
                    text: '描述',
                    dataIndex: 'descs'
                },
                {
                    text: '仓库管理员ID',
                    hidden: true,
                    dataIndex: 'adminId'
                },
                {
                    text: '管理员姓名',
                    dataIndex: 'adminName'
                },
                {
                    text: '管理员电话',
                    dataIndex: 'adminMobile'
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
                                var win = Repo.getWin('update', record);
                                win.show();
                            }
                        },
                        {
                            tooltip: '删除',
                            iconCls: 'silk-dust-bin',
                            handler: function (tree, rowIndex, colIndex, actionItem, event, record, row) {
                                Ext.Msg.confirm('确认', '您确定要删除该仓库吗', function (opt) {
                                    if (opt == 'yes') {
                                        Ext.Ajax.request({
                                            url: CTX + '/admin/repo/remove',
                                            params: {
                                                'id': record.data.id
                                            },
                                            success: function(response, action) {
                                                var msg = action.result && action.result.msg ? action.result.msg : "删除成功";
                                                Ext.Msg.alert('信息提示', msg);
                                                Repo.reload();
                                            },
                                            failure: function(response, action) {
                                                var msg = action.result && action.result.msg ? action.result.msg : "删除失败";
                                                Ext.Msg.alert('信息提示', msg);
                                                Repo.reload();
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
                    {
                        xtype: 'textfield',
                        name: 'name',
                        search: true,
                        fieldLabel: '仓库名称',
                        labelAlign: 'left',
                        labelWidth: Global.labelWidth
                    },
                    {
                        xtype: 'button',
                        text: '查询',
                        iconCls: 'silk-form-search',
                        handler: function(o, ev) {
                            Repo.reload()
                        }
                    },
                    {
                        xtype: 'button',
                        text: '新增',
                        iconCls: 'silk-form-add',
                        handler: function(o, ev) {
                            var win = Repo.getWin();
                            win.show();
                        }
                    }
                ]
            }
        });

        Repo.grid = grid;
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
                    fieldLabel: '仓库名称',
                    name: 'name',
                    afterLabelTextTpl: Global.required,
                    emptyText: '请输入仓库名称',
                    allowBlank: false
                },
                {
                    fieldLabel: '仓库编号',
                    name: 'code',
                    afterLabelTextTpl: Global.required,
                    emptyText: '请输入仓库编号',
                    allowBlank: false,
                    readOnly: action === 'update'
                },
                {
                    fieldLabel: '仓库地址',
                    name: 'address',
                    afterLabelTextTpl: Global.required,
                    emptyText: '请输入仓库地址',
                    allowBlank: false
                },
                {
                    fieldLabel: '描'+Global.nbsp8+'述',
                    name: 'descs',
                    emptyText: '请输入仓库描述'
                },
                {
                    xtype: 'trigger',
                    fieldLabel: '管'+Global.nbsp+'理'+Global.nbsp+'员',
                    name: 'adminName',
                    editable: false,
                    triggerCls: 'x-form-search-trigger',
                    emptyText: '请选择仓库管理员',
                    onTriggerClick: function() {
                        var adminId = this.nextNode("textfield[name=adminId]");
                        var employeeWin = Employee.getWin(this, adminId);
                        employeeWin.show();
                    }
                },
                {
                    fieldLabel: '管理员ID',
                    hidden: true,
                    name: 'adminId'
                }
            ]
        });

        if(action === 'update'){
            formPanel.loadRecord(record);
        }

        var win = Ext.create('Ext.window.Window', {
            title: "基础参数",
            width: 350,
            height: 300,
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
                                url: CTX + '/admin/repo/save',
                                submitEmptyText: false,
                                success: function(form, action) {
                                    var msg = action.result && action.result.msg ? action.result.msg : "保存成功";
                                    Ext.Msg.alert('信息提示',msg);
                                    Repo.reload();
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
            fields:['id', 'name', 'code', 'idCard', 'mobile', 'sex', 'birthday', 'address', 'email', 'typeId', 'typeName'],
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
                    text: '员工类别ID',
                    hidden: true,
                    dataIndex: 'typeId'
                },
                {
                    text: '员工类别',
                    dataIndex: 'typeName'
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

    var grid = Repo.getGrid();

    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: grid
    });

});




