/**
 * 销售订单审核
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
                url: CTX + '/admin/sale/order/page?checkState=2',
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
                    text: '入库日期',
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
                            tooltip: '审核',
                            iconCls: 'silk-evaluate-detail',
                            handler: function (grid, rowIndex, colIndex, actionItem, event, record, row) {
                                var checkWin = CustomerOrder.getCheckWin(record);
                                checkWin.show();
                            },
                            getClass: function (v, metadata, record, rowIndex, colIndex, store) {
                                //待审核的订单可以审核
                                if (record.data.checkState === 2) {
                                    return "silk-evaluate-detail";
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
                    })
                ]
            }
        });

        //添加第二行工具栏
        grid.addDocked({
            xtype: 'toolbar',
            border: 0,
            items: [
                Global.getCombo({
                    name: 'repoId',
                    fieldLabel: '仓'+Global.nbsp8+'库',
                    search: true,
                    url: CTX + '/admin/repo/list'
                }),
                Global.getSearch({
                    name: 'employeeNameOrCode',
                    fieldLabel: '经办员工',
                    emptyText: '请输入员工姓名或编号'
                }),
                {
                    xtype: 'datefield',
                    name: 'startDate',
                    search: true,
                    fieldLabel: '开始时间',
                    maxValue: new Date(),
                    vtype: 'daterange',
                    endDateField: 'endDate',
                    format: 'Y-m-d',
                    labelAlign: 'left',
                    emptyText: '请选择开始时间',
                    labelWidth: Global.labelWidth
                },
                {
                    xtype: 'datefield',
                    name: 'endDate',
                    search: true,
                    fieldLabel: '结束时间',
                    vtype: 'daterange',
                    startDateField: 'startDate',
                    format: 'Y-m-d',
                    maxValue: new Date(),
                    labelAlign: 'left',
                    emptyText: '请选择结束时间',
                    labelWidth: Global.labelWidth
                },
                {
                    xtype: 'button',
                    text: '查询',
                    iconCls: 'silk-form-search',
                    handler: function (o, ev) {
                        CustomerOrder.reload()
                    }
                }
            ]
        });

        CustomerOrder.grid = grid;
        return grid;
    },
    /**
     * 获取审核订单窗口
     */
    getCheckWin: function (record) {

        if(!CustomerOrder.checkWin){
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
                        name: 'id',
                        itemId: 'id'
                    },
                    {
                        xtype: 'combo',
                        fieldLabel: '是否通过',
                        allowBlank: false,
                        afterLabelTextTpl: Global.required,
                        emptyText: '请选择是否审核通过',
                        editable: false,
                        valueField: 'id',
                        displayField: 'name',
                        name: 'isPass',
                        store: {
                            fields: ['id', 'name'],
                            data: [
                                {
                                    'id': 1,
                                    'name': '审核通过'
                                },
                                {
                                    'id': 0,
                                    'name': '审核不通过'
                                }
                            ]
                        },
                        listeners: {
                            'change': function (o, nv) {
                                var checkResult = this.nextNode('textfield[name=checkResult]');
                                if(nv === 1){
                                    checkResult.setValue("通过");
                                } else if(nv === 0){
                                    checkResult.setValue("不通过");
                                } else{
                                    checkResult.setValue("");
                                }
                            }
                        }
                    },
                    {
                        xtype: 'textarea',
                        fieldLabel: '审核结果',
                        name: 'checkResult',
                        emptyText: '请输入审核结果',
                        height: 50
                    }
                ]
            });

            var checkWin = Ext.create('Ext.window.Window', {
                title: '审核订单',
                width: 300,
                height: 200,
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
                            checkWin.hide();
                        }
                    },
                    {
                        text: '审核',
                        handler: function () {
                            var form = formPanel.getForm();
                            if (form.isValid()) {
                                form.submit({
                                    url: CTX + '/admin/sale/order/check',
                                    method: 'GET',
                                    submitEmptyText: false,
                                    success: function (form, action) {
                                        var msg = action.result && action.result.msg ? action.result.msg : "操作成功";
                                        Ext.Msg.alert('信息提示', msg);
                                        CustomerOrder.reload();
                                        checkWin.hide();
                                    },
                                    failure: function (form, action) {
                                        var msg = action.result && action.result.msg ? action.result.msg : "操作失败";
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

            checkWin.form = formPanel;

            CustomerOrder.checkWin = checkWin;
        }

        CustomerOrder.checkWin.form.getComponent('id').setValue(record.data.id);

        return CustomerOrder.checkWin;
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




