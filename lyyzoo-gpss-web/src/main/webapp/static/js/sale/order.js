/**
 * 销售订单
 * <p>
 * @author bojiangzhou
 * @date 2017-04-09
 */

var CustomerOrder = {
    propertyWin: {},
    reload: function (params) {
        var toolbar = CustomerOrder.grid.getDockedItems('toolbar[dock="top"]');
        params = Ext.apply(params || {}, Global.getParams(toolbar));
        CustomerOrder.grid.getStore().load({
            params: params
        });
    },
    getGrid: function () {
        if (CustomerOrder.grid) {
            return CustomerOrder.grid;
        }

        var store = Ext.create('Ext.data.Store', {
            fields: ['id', 'goodsId', 'goodsName', 'goodsCode', 'goodsUnit', 'goodsType', 'goodsBrand', 'customerId', 'customerName', 'repoId', 'repoName', 'orderNumber', 'count', 'unitPrice', 'totalPrice', 'employeeId', 'employeeName', 'employeeCode', 'descs', 'checkState', 'checkResult', 'checkAccount', 'checktime', 'checktimeStr', 'taketime', 'creater', 'creatime', 'creatimeStr', 'updater', 'updatime', 'type'],
            pageSize: Global.defaults.grid.pageSize,
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: CTX + '/admin/sale/order/page',
                pageParam: Global.defaults.proxy.pageParam,
                limitParam: Global.defaults.proxy.limitParam,
                reader: {
                    type: 'json',
                    root: 'content'
                }
            }
        });

        var grid = Ext.create('Ext.grid.Panel', {
            store: store,
            selType: 'rowmodel',
            frame: false,
            border: true,
            forceFit: true,
            columnLines: true,
            emptyText: '<div class="x-grid-empty">未找到匹配记录</div>',
            multiSelect: false,
            // enableColumnMove : false,
            enableColumnResize: true,
            viewConfig: {
                stripeRows: false,
                enableTextSelection: true
            },
            plugins: [
                {
                    ptype: 'rowexpander',
                    rowBodyTpl: new Ext.XTemplate(
                        "<p>商品编码：{goodsCode}"+Global.nbsp8+"商品类别：{goodsType}"+Global.nbsp8+"商品品牌：{goodsBrand}"+Global.nbsp8+"创建时间：{creatimeStr}</p>",
                        "<p>订单号：{orderNumber}"+Global.nbsp8+"经办员工：{employeeName}"+Global.nbsp8+"员工编号：{employeeCode}"+Global.nbsp8+"备注信息：{descs}</p>",
                        "<p>审核结果：{checkResult}"+Global.nbsp8+"审核人员：{checkAccount}"+Global.nbsp8+"审核时间：{checktimeStr}</p>"
                    )
                }
            ],
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
                    text: '商品ID',
                    dataIndex: 'goodsId',
                    hidden: true
                },
                {
                    text: '商品名称',
                    dataIndex: 'goodsName',
                    renderer: function (v, meta, record) {
                        meta.tdAttr = 'data-qtip='+v;
                        return v;
                    }
                },
                {
                    text: '商品编码',
                    dataIndex: 'goodsCode',
                    hidden: true
                },
                {
                    text: '计量单位',
                    dataIndex: 'goodsUnit'
                },
                {
                    text: '商品类别',
                    dataIndex: 'goodsType',
                    hidden: true
                },
                {
                    text: '品牌',
                    dataIndex: 'goodsBrand',
                    hidden: true
                },
                {
                    text: '客户ID',
                    dataIndex: 'customerId',
                    hidden: true
                },
                {
                    text: '客户',
                    dataIndex: 'customerName',
                    renderer: function (v, meta, record) {
                        meta.tdAttr = 'data-qtip='+v;
                        return v;
                    }
                },
                {
                    text: '仓库ID',
                    dataIndex: 'repoId',
                    hidden: true
                },
                {
                    text: '仓库名称',
                    dataIndex: 'repoName',
                    renderer: function (v, meta, record) {
                        meta.tdAttr = 'data-qtip='+v;
                        return v;
                    }
                },
                {
                    text: '单号',
                    dataIndex: 'orderNumber',
                    renderer: function (v, meta, record) {
                        meta.tdAttr = 'data-qtip='+v;
                        return v;
                    }
                },
                {
                    text: '数量',
                    dataIndex: 'count'
                },
                {
                    text: '单价',
                    dataIndex: 'unitPrice'
                },
                {
                    text: '总价',
                    dataIndex: 'totalPrice'
                },
                {
                    text: '经办人ID',
                    dataIndex: 'employeeId',
                    hidden: true
                },
                {
                    text: '经办员工',
                    dataIndex: 'employeeName',
                    hidden: true,
                    renderer: function (v, meta, record) {
                        meta.tdAttr = 'data-qtip='+v;
                        return v;
                    }
                },
                {
                    text: '员工编号',
                    dataIndex: 'employeeCode',
                    hidden: true
                },
                {
                    text: '备注',
                    dataIndex: 'descs',
                    hidden: true,
                    renderer: function (v, meta, record) {
                        meta.tdAttr = 'data-qtip='+v;
                        return v;
                    }
                },
                {
                    text: '审核状态',
                    dataIndex: 'checkState',
                    renderer: function (v, meta) {
                        var val = "";
                        var tip = "";
                        switch (v) {
                            case 1:
                                val = "录入";
                                tip = "录入";
                                break;
                            case 2:
                                val = "待审核";
                                tip = "待审核";
                                break;
                            case 3:
                                val = "审核通过";
                                tip = "审核通过";
                                break;
                            case 4:
                                val = "审核未通过";
                                tip = "审核未通过";
                                break;
                            default:
                                val = "<span style='color:red;'>数据错误</span>";
                                tip = "数据错误";
                        }
                        meta.tdAttr = 'data-qtip='+tip;
                        return val;
                    }
                },
                {
                    text: '审核结果',
                    dataIndex: 'checkResult',
                    hidden: true,
                    renderer: function (v, meta, record) {
                        meta.tdAttr = 'data-qtip='+v;
                        return v;
                    }
                },
                {
                    text: '审核人',
                    dataIndex: 'checkAccount',
                    hidden: true
                },
                {
                    text: '审核时间',
                    dataIndex: 'checktime',
                    hidden: true,
                    renderer: function (v, meta) {
                        if (v) {
                            var str = Ext.Date.format(new Date(v), "Y-m-d h:i:s");
                            meta.tdAttr = 'data-qtip='+str;
                            return str;
                        }
                        return "";
                    }
                },
                {
                    text: '出库日期',
                    dataIndex: 'taketime',
                    renderer: function (v, meta) {
                        if (v) {
                            var str = Ext.Date.format(new Date(v), "Y-m-d h:i:s");
                            meta.tdAttr = 'data-qtip='+str;
                            return str;
                        }
                        return "";
                    }
                },
                {
                    text: '创建人',
                    dataIndex: 'creater',
                    hidden: true
                },
                {
                    text: '创建时间',
                    dataIndex: 'creatime',
                    hidden: true,
                    renderer: function (v, meta) {
                        if (v) {
                            var str = Ext.Date.format(new Date(v), "Y-m-d h:i:s");
                            meta.tdAttr = 'data-qtip='+str;
                            return str;
                        }
                        return "";
                    }
                },
                {
                    text: '修改人',
                    hidden: true,
                    dataIndex: 'updater'
                },
                {
                    text: '最近更新时间',
                    hidden: true,
                    dataIndex: 'updatime',
                    renderer: function (v, meta) {
                        if (v) {
                            var str = Ext.Date.format(new Date(v), "Y-m-d h:i:s");
                            meta.tdAttr = 'data-qtip='+str;
                            return str;
                        }
                        return "";
                    }
                },
                {
                    text: '订单类型',
                    dataIndex: 'type',
                    renderer: function (v, meta) {
                        var val = "";
                        var tip = "";
                        switch (v) {
                            case 1:
                                val = "销售订单";
                                tip = "销售订单";
                                break;
                            case 2:
                                val = "退货订单";
                                tip = "退货订单";
                                break;
                            default:
                                val = "<span style='color:red'>数据错误</span>";
                                tip = "数据错误";
                        }
                        meta.tdAttr = 'data-qtip='+tip;
                        return val;
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
                            handler: function (grid, rowIndex, colIndex, actionItem, event, record, row) {
                                var win = CustomerOrder.getWin('update', record, record.data.type);
                                win.show();
                            },
                            getClass: function (v, metadata, record, rowIndex, colIndex, store) {
                                //审核通过的订单不能再修改
                                if (record.data.checkState === 3) {
                                    return "x-hidden";
                                } else {
                                    return "silk-form-update";
                                }
                            }
                        },
                        {
                            tooltip: '删除',
                            iconCls: 'silk-dust-bin',
                            handler: function (grid, rowIndex, colIndex, actionItem, event, record, row) {
                                Ext.Msg.confirm('确认', '您确定要删除该订单吗', function (opt) {
                                    if (opt == 'yes') {
                                        Ext.Ajax.request({
                                            url: CTX + '/admin/sale/order/remove',
                                            params: {
                                                'id': record.data.id
                                            },
                                            success: function (response, action) {
                                                var msg = action.result && action.result.msg ? action.result.msg : "删除成功";
                                                Ext.Msg.alert('信息提示', msg);
                                                CustomerOrder.reload();
                                            },
                                            failure: function (response, action) {
                                                var msg = action.result && action.result.msg ? action.result.msg : "删除失败";
                                                Ext.Msg.alert('信息提示', msg);
                                                CustomerOrder.reload();
                                            }
                                        });
                                    }
                                });
                            },
                            getClass: function (v, metadata, record, rowIndex, colIndex, store) {
                                if (record.data.checkState === 3) {
                                    return "x-hidden";
                                } else {
                                    return "silk-dust-bin";
                                }
                            }
                        },
                        {
                            tooltip: '提交审核',
                            iconCls: 'silk-coach-schedule',
                            handler: function (grid, rowIndex, colIndex, actionItem, event, record, row) {
                                Ext.Msg.confirm('确认', '您确定提交审核吗', function (opt) {
                                    if (opt == 'yes') {
                                        Ext.Ajax.request({
                                            url: CTX + '/admin/sale/order/submit/check',
                                            params: {
                                                'id': record.data.id
                                            },
                                            success: function (response, action) {
                                                var msg = action.result && action.result.msg ? action.result.msg : "提交成功";
                                                Ext.Msg.alert('信息提示', msg);
                                                CustomerOrder.reload();
                                            },
                                            failure: function (response, action) {
                                                var msg = action.result && action.result.msg ? action.result.msg : "提交失败";
                                                Ext.Msg.alert('信息提示', msg);
                                                CustomerOrder.reload();
                                            }
                                        });
                                    }
                                });
                            },
                            getClass: function (v, metadata, record, rowIndex, colIndex, store) {
                                //录入状态和审核未通过的可以提交审核
                                if (record.data.checkState === 1 || record.data.checkState === 4) {
                                    return "silk-coach-schedule";
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
                border: 0,
                items: [
                    {
                        xtype: 'combo',
                        name: 'type',
                        search: true,
                        fieldLabel: '订单类型',
                        labelAlign: 'left',
                        emptyText: '请选择订单类型',
                        labelWidth: Global.labelWidth,
                        valueField: 'id',
                        displayField: 'name',
                        editable: false,
                        value: 1,
                        store: {
                            fields: ['id', 'name'],
                            data: [
                                {
                                    'id': 1,
                                    'name': '销售订单'
                                },
                                {
                                    'id': 2,
                                    'name': '退货订单'
                                }
                            ]
                        },
                        listeners: {
                            'change': function () {
                                CustomerOrder.reload();
                            }
                        }
                    },
                    Global.getSearch({
                        name: 'orderNumber',
                        fieldLabel: '订'+Global.nbsp+'单'+Global.nbsp+'号'
                    }),
                    Global.getSearch({
                        name: 'goodsNameOrCode',
                        fieldLabel: '商品名称',
                        emptyText: '请输入商品名称或编号'
                    }),
                    Global.getSearch({
                        name: 'customerName',
                        fieldLabel: '客户名称'
                    }),
                    Global.getCombo({
                        name: 'repoId',
                        fieldLabel: '仓库',
                        search: true,
                        url: CTX + '/admin/repo/list'
                    })
                ]
            }
        });

        //添加第二行工具栏
        grid.addDocked({
            xtype: 'toolbar',
            border: 0,
            items: [
                Global.getSearch({
                    name: 'employeeNameOrCode',
                    fieldLabel: '经办员工',
                    emptyText: '请输入员工姓名或编号'
                }),
                {
                    xtype: 'combo',
                    name: 'checkState',
                    search: true,
                    fieldLabel: '审核状态',
                    labelAlign: 'left',
                    emptyText: '请选择审核状态',
                    labelWidth: Global.labelWidth,
                    valueField: 'id',
                    displayField: 'name',
                    editable: false,
                    store: {
                        fields: ['id', 'name'],
                        data: [
                            {
                                'id': -1,
                                'name': '所有'
                            },
                            {
                                'id': 1,
                                'name': '录入'
                            },
                            {
                                'id': 2,
                                'name': '等待审核'
                            },
                            {
                                'id': 3,
                                'name': '审核通过'
                            },
                            {
                                'id': 4,
                                'name': '审核未通过'
                            }
                        ]
                    }
                },
                Global.getStartDate({search: true}),
                Global.getEndDate({search: true}),
                {
                    xtype: 'button',
                    text: '查询',
                    iconCls: 'silk-form-search',
                    handler: function (o, ev) {
                        CustomerOrder.reload()
                    }
                },
                {
                    xtype: 'button',
                    text: '销售',
                    iconCls: 'silk-return-premium',
                    handler: function (o, ev) {
                        var win = CustomerOrder.getWin('create', null, 1);
                        win.show();
                    }
                },
                {
                    xtype: 'button',
                    text: '退货',
                    iconCls: 'silk-check-fail',
                    handler: function (o, ev) {
                        var win = CustomerOrder.getWin('create', null, 2);
                        win.show();
                    }
                },
                {
                    xtype: 'button',
                    text: '导出',
                    iconCls: 'silk-export',
                    handler: function (o, ev) {
                        var toolbar = CustomerOrder.grid.getDockedItems('toolbar[dock="top"]');
                        var params = Global.getParams(toolbar);
                        var serial = "";
                        for(var i in params){
                            serial += '&' + i + '=' + params[i];
                        }
                        serial = serial.substr(1);

                        window.location.href = CTX + '/admin/sale/order/export?' + serial;
                    }
                }
            ]
        });


        CustomerOrder.grid = grid;
        return grid;
    },
    getWin: function (action, record, type) {

        if(!CustomerOrder.win){
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
                        xtype: 'combo',
                        fieldLabel: '商品名称',
                        name: 'goodsName',
                        allowBlank: false,
                        afterLabelTextTpl: Global.required,
                        emptyText: '请选择商品',
                        editable: false,
                        triggerCls: 'x-form-search-trigger',
                        onTriggerClick: function() {
                            var nameText = this;
                            var idText = this.nextNode("textfield[name=goodsId]");
                            var unitPriceText = this.nextNode("numberfield[name=unitPrice]");

                            if(!CustomerOrder.propertyWin['stock']){
                                var stockGrid = Stock.getGrid();
                                var stock = Ext.create('Ext.window.Window', {
                                    title: '选择商品信息',
                                    width: 700,
                                    height: 470,
                                    layout: 'fit',
                                    border: 0,
                                    constrain: true,
                                    modal: true,
                                    resizable: false,
                                    closeAction: 'hide',
                                    shadow: 'frame',
                                    items: stockGrid,
                                    buttons: [
                                        {
                                            text: '取消',
                                            handler: function () {
                                                stock.hide();
                                            }
                                        },
                                        {
                                            text: '确定',
                                            handler: function () {
                                                var selModel = stockGrid.getSelectionModel();
                                                var sel = selModel.getSelection()[0];

                                                idText.setValue(sel.data.goodsId);
                                                nameText.setValue(sel.data.goodsName);
                                                unitPriceText.setValue(sel.data.salePrice);

                                                stock.hide();
                                            }
                                        }
                                    ],
                                    listeners: {
                                        'hide': function () {
                                            var selModel = stockGrid.getSelectionModel();
                                            selModel.deselectAll(true);
                                        }
                                    }
                                });
                                CustomerOrder.propertyWin['stock'] = stock;
                            }

                            CustomerOrder.propertyWin['stock'].show();
                        }
                    },
                    {
                        fieldLabel: '商品ID',
                        name: 'goodsId',
                        hidden: true
                    },
                    {
                        xtype: 'combo',
                        fieldLabel: '客'+Global.nbsp8+'户',
                        name: 'customerName',
                        allowBlank: false,
                        afterLabelTextTpl: Global.required,
                        emptyText: '请选择客户',
                        editable: false,
                        triggerCls: 'x-form-search-trigger',
                        onTriggerClick: function() {
                            var nameText = this;
                            var idText = this.nextNode("textfield[name=customerId]");

                            if(!CustomerOrder.propertyWin['customer']){
                                var customerGrid = Customer.getGrid();
                                var customer = Ext.create('Ext.window.Window', {
                                    title: '选择客户',
                                    width: 700,
                                    height: 470,
                                    layout: 'fit',
                                    border: 0,
                                    constrain: true,
                                    modal: true,
                                    resizable: false,
                                    closeAction: 'hide',
                                    shadow: 'frame',
                                    items: customerGrid,
                                    buttons: [
                                        {
                                            text: '取消',
                                            handler: function () {
                                                customer.hide();
                                            }
                                        },
                                        {
                                            text: '确定',
                                            handler: function () {
                                                var selModel = customerGrid.getSelectionModel();
                                                var sel = selModel.getSelection()[0];

                                                idText.setValue(sel.data.id);
                                                nameText.setValue(sel.data.name);

                                                customer.hide();
                                            }
                                        }
                                    ],
                                    listeners: {
                                        'hide': function () {
                                            var selModel = customerGrid.getSelectionModel();
                                            selModel.deselectAll(true);
                                        }
                                    }
                                });
                                CustomerOrder.propertyWin['customer'] = customer;
                            }

                            CustomerOrder.propertyWin['customer'].show();
                        }
                    },
                    {
                        fieldLabel: '客户ID',
                        name: 'customerId',
                        hidden: true
                    },
                    {
                        xtype: 'combo',
                        fieldLabel: type === 1 ? "出库仓库" : "入库仓库",
                        name: 'repoName',
                        itemId: 'repoName',
                        allowBlank: false,
                        afterLabelTextTpl: Global.required,
                        emptyText: '请选择仓库',
                        editable: false,
                        triggerCls: 'x-form-search-trigger',
                        onTriggerClick: function() {
                            var nameText = this;
                            var idText = this.nextNode("textfield[name=repoId]");

                            if(!CustomerOrder.propertyWin['repo']){
                                var repoGrid = Repo.getGrid();
                                var repo = Ext.create('Ext.window.Window', {
                                    title: "选择仓库",
                                    width: 700,
                                    height: 470,
                                    layout: 'fit',
                                    border: 0,
                                    constrain: true,
                                    modal: true,
                                    resizable: false,
                                    closeAction: 'hide',
                                    shadow: 'frame',
                                    items: repoGrid,
                                    buttons: [
                                        {
                                            text: '取消',
                                            handler: function () {
                                                repo.hide();
                                            }
                                        },
                                        {
                                            text: '确定',
                                            handler: function () {
                                                var selModel = repoGrid.getSelectionModel();
                                                var sel = selModel.getSelection()[0];

                                                idText.setValue(sel.data.id);
                                                nameText.setValue(sel.data.name);

                                                repo.hide();
                                            }
                                        }
                                    ],
                                    listeners: {
                                        'hide': function () {
                                            var selModel = repoGrid.getSelectionModel();
                                            selModel.deselectAll(true);
                                        }
                                    }
                                });
                                CustomerOrder.propertyWin['repo'] = repo;
                            }

                            CustomerOrder.propertyWin['repo'].show();
                        }
                    },
                    {
                        fieldLabel: '仓库ID',
                        name: 'repoId',
                        hidden: true
                    },
                    {
                        xtype: 'numberfield',
                        fieldLabel: '数'+Global.nbsp8+'量',
                        name: 'count',
                        allowBlank: false,
                        afterLabelTextTpl: Global.required,
                        emptyText: '请输入数量',
                        minValue: 1,
                        maxValue: 9999999,
                        decimalPrecision: 0, //小数位
                        hideTrigger: false,
                        keyNavEnabled: true,
                        mouseWheelEnabled: true,
                        listeners: {
                            'blur': function (o, ev) {
                                var unitPriceText = this.nextNode("numberfield[name=unitPrice]");
                                var totalPriceText = this.nextNode("textfield[name=totalPrice]");

                                var count = parseInt(o.getValue()) || 0;
                                var unitPrice = parseFloat(unitPriceText.getValue()) || 0;

                                totalPriceText.setValue(count * unitPrice);
                            }
                        }
                    },
                    {
                        xtype: 'numberfield',
                        fieldLabel: '单'+Global.nbsp8+'价',
                        name: 'unitPrice',
                        allowBlank: false,
                        afterLabelTextTpl: Global.required,
                        minValue: 0.001,
                        decimalPrecision: 3, //小数位
                        hideTrigger: false,
                        keyNavEnabled: true,
                        mouseWheelEnabled: true,
                        emptyText: '请输入单价',
                        listeners: {
                            'blur': function (o, ev) {
                                var countText = this.previousNode("numberfield[name=count]");
                                var totalPriceText = this.nextNode("textfield[name=totalPrice]");

                                var count = parseInt(countText.getValue()) || 0;
                                var unitPrice = parseFloat(o.getValue()) || 0;

                                totalPriceText.setValue(count * unitPrice);
                            }
                        }
                    },
                    {
                        fieldLabel: '总'+Global.nbsp8+'价',
                        name: 'totalPrice',
                        value: 0,
                        readOnly: true
                    },
                    {
                        xtype: 'combo',
                        fieldLabel: '经办员工',
                        name: 'employeeName',
                        allowBlank: false,
                        afterLabelTextTpl: Global.required,
                        emptyText: '请选择经办员工',
                        editable: false,
                        triggerCls: 'x-form-search-trigger',
                        onTriggerClick: function() {
                            var nameText = this;
                            var idText = this.nextNode("textfield[name=employeeId]");

                            if(!CustomerOrder.propertyWin['employee']){
                                var employeeGrid = Employee.getGrid();
                                var employee = Ext.create('Ext.window.Window', {
                                    title: '选择经办员工',
                                    width: 700,
                                    height: 470,
                                    layout: 'fit',
                                    border: 0,
                                    constrain: true,
                                    modal: true,
                                    resizable: false,
                                    closeAction: 'hide',
                                    shadow: 'frame',
                                    items: employeeGrid,
                                    buttons: [
                                        {
                                            text: '取消',
                                            handler: function () {
                                                employee.hide();
                                            }
                                        },
                                        {
                                            text: '确定',
                                            handler: function () {
                                                var selModel = employeeGrid.getSelectionModel();
                                                var sel = selModel.getSelection()[0];

                                                idText.setValue(sel.data.id);
                                                nameText.setValue(sel.data.name);

                                                employee.hide();
                                            }
                                        }
                                    ],
                                    listeners: {
                                        'hide': function () {
                                            var selModel = employeeGrid.getSelectionModel();
                                            selModel.deselectAll(true);
                                        }
                                    }
                                });
                                CustomerOrder.propertyWin['employee'] = employee;
                            }

                            CustomerOrder.propertyWin['employee'].show();

                        }
                    },
                    {
                        fieldLabel: '员工ID',
                        name: 'employeeId',
                        hidden: true
                    },
                    {
                        fieldLabel: '备'+Global.nbsp8+'注',
                        name: 'descs',
                        emptyText: '请输入备注'
                    },
                    {
                        name: 'type',
                        itemId: 'type',
                        fieldLabel: '订单类型',
                        labelAlign: 'left',
                        emptyText: '请选择订单类型',
                        labelWidth: Global.labelWidth,
                        editable: false,
                        hidden: true,
                        value: type
                    }
                ]
            });

            var win = Ext.create('Ext.window.Window', {
                title: type === 1 ? "销售订单" : "退货订单",
                width: 350,
                height: 400,
                bodyPadding: 10,
                layout: 'fit',
                closeAction: 'hide',
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
                                    url: CTX + '/admin/sale/order/save',
                                    method: 'POST',
                                    submitEmptyText: false,
                                    success: function (form, action) {
                                        var msg = action.result && action.result.msg ? action.result.msg : "保存成功";
                                        Ext.Msg.alert('信息提示', msg);
                                        CustomerOrder.reload();
                                        win.hide();
                                    },
                                    failure: function (form, action) {
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
                        formPanel.getForm().reset();
                    }
                }
            });

            win.form = formPanel;

            CustomerOrder.win = win;
        }

        CustomerOrder.win.setTitle(type === 1 ? "销售订单" : "退货订单");
        CustomerOrder.win.form.getComponent('repoName').setFieldLabel(type === 1 ? "出库仓库" : "入库仓库");
        CustomerOrder.win.form.getComponent('type').setValue(type);

        if (action === 'update') {
            CustomerOrder.win.form.loadRecord(record);
        }

        return CustomerOrder.win;
    }
};

/**
 * 库存
 */
var Stock = {
    reload: function (params) {
        var toolbar = Stock.grid.getDockedItems('toolbar[dock="top"]');
        params = Ext.apply(params || {}, Global.getParams(toolbar));
        Stock.grid.getStore().load({
            params: params
        });
    },
    getGrid: function () {
        if (Stock.grid) {
            return Stock.grid;
        }

        var store = Ext.create('Ext.data.Store', {
            fields: ['id', 'goodsId', 'goodsName', 'goodsCode', 'goodsUnit', 'goodsType', 'goodsStandard', 'goodsColor', 'repoId', 'repoName', 'totalCount', 'saleCount', 'buyPrice', 'avgBuyPrice', 'salePrice', 'totalBuyPrice', 'totalSalePrice', 'updatime'],
            pageSize: Global.defaults.grid.pageSize,
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: CTX + '/admin/stock/page',
                pageParam: Global.defaults.proxy.pageParam,
                limitParam: Global.defaults.proxy.limitParam,
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
            frame: false,
            border: true,
            forceFit: true,
            columnLines: true,
            emptyText: '<div class="x-grid-empty">未找到匹配记录</div>',
            multiSelect: false,
            // enableColumnMove : false,
            enableColumnResize: true,
            viewConfig: {
                stripeRows: false,
                enableTextSelection: true
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
                    text: '商品ID',
                    dataIndex: 'goodsId',
                    hidden: true
                },
                {
                    text: '商品名称',
                    dataIndex: 'goodsName'
                },
                {
                    text: '商品编号',
                    dataIndex: 'goodsCode'
                },
                {
                    text: '商品类别',
                    dataIndex: 'goodsType',
                    hidden: true
                },
                {
                    text: '计量单位',
                    dataIndex: 'goodsUnit',
                    hidden: true
                },
                {
                    text: '颜色',
                    dataIndex: 'goodsColor',
                    hidden: true
                },
                {
                    text: '规格型号',
                    dataIndex: 'goodsStandard'
                },
                {
                    text: '仓库ID',
                    dataIndex: 'repoId',
                    hidden: true
                },
                {
                    text: '仓库名称',
                    dataIndex: 'repoName'
                },
                {
                    text: '库存量',
                    dataIndex: 'totalCount'
                },
                {
                    text: '预设售价',
                    dataIndex: 'salePrice'
                }
            ],
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: store,
                dock: 'bottom',
                displayInfo: true
            }],
            tbar: {
                // minHeight: Global.toolbarHeight,
                border: 0,
                items: [
                    Global.getSearch({
                        name: 'goodsNameOrCode',
                        fieldLabel: '商品名称',
                        emptyText: '请输入商品名称或编号'
                    }),
                    {
                        xtype: 'button',
                        text: '查询',
                        iconCls: 'silk-form-search',
                        handler: function (o, ev) {
                            Stock.reload()
                        }
                    }
                ]
            }
        });

        Stock.grid = grid;
        return grid;
    }
};

/**
 * 客户
 */
var Customer = {
    reload: function (params) {
        var toolbar = Customer.grid.getDockedItems('toolbar[dock="top"]');
        params = Ext.apply(params || {}, Global.getParams(toolbar));
        Customer.grid.getStore().load({
            params: params
        });
    },
    getGrid: function () {
        if(Customer.grid){
            return Customer.grid;
        }

        var store = Ext.create('Ext.data.Store', {
            fields:['id', 'name', 'linkman', 'mobile', 'address', 'descs', 'updater', 'updatime'],
            pageSize: Global.defaults.grid.pageSize,
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: CTX + '/admin/customer/page',
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
                    text: '客户名称',
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
                        fieldLabel: '客户名称'
                    },
                    {
                        xtype: 'button',
                        text: '查询',
                        iconCls: 'silk-form-search',
                        handler: function(o, ev) {
                            Customer.reload();
                        }
                    }
                ]
            }
        });

        Customer.grid = grid;
        return grid;
    }
};

/**
 * 仓库
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
            selType : 'checkboxmodel',
            selModel: {
                'mode': 'single' //单选
            },
            frame : false,
            border : true,
            forceFit : true,
            closeAction: 'hide',
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
                    dataIndex: 'descs',
                    hidden: true
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
                    }
                ]
            }
        });

        Repo.grid = grid;
        return grid;
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
            closeAction: 'hide',
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
    }
};

Ext.require(['*']);

Ext.onReady(function () {
    Ext.tip.QuickTipManager.init();

    Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));

    var grid = CustomerOrder.getGrid();

    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: grid
    });
});




