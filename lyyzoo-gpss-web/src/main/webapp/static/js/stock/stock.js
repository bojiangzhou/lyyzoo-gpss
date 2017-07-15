/**
 * 库存管理
 * <p>
 * @author bojiangzhou
 * @date 2017-04-08
 */

var Stock = {
    propertyWin: {},
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
            title: '库存记录',
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
                    dataIndex: 'goodsType'
                },
                {
                    text: '计量单位',
                    dataIndex: 'goodsUnit'
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
                    text: '销售量',
                    dataIndex: 'saleCount'
                },
                {
                    text: '上次进价',
                    dataIndex: 'buyPrice'
                },
                {
                    text: '平均进价',
                    dataIndex: 'avgBuyPrice'
                },
                {
                    text: '预设售价',
                    dataIndex: 'salePrice'
                },
                {
                    text: '库存总值',
                    dataIndex: 'totalBuyPrice'
                },
                {
                    text: '售价总值',
                    dataIndex: 'totalSalePrice'
                },
                {
                    text: '创建时间',
                    dataIndex: 'updatime',
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
                    xtype: 'actioncolumn',
                    width: 120,
                    maxWidth: 120,
                    menuDisabled: true,
                    items: [
                        {
                            tooltip: '修改均价',
                            iconCls: 'silk-ledger',
                            handler: function (grid, rowIndex, colIndex, actionItem, event, record, row) {
                                var priceWin = Stock.getPriceWin(record);
                                priceWin.show();
                            }
                        },
                        {
                            tooltip: '库存调拨',
                            iconCls: 'silk-transfer',
                            handler: function (grid, rowIndex, colIndex, actionItem, event, record, row) {
                                var transferWin = Stock.getTransferWin(record);
                                transferWin.show();
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
                // minHeight: Global.toolbarHeight,
                border: 0,
                items: [
                    {
                        xtype: 'textfield',
                        name: 'goodsNameOrCode',
                        search: true,
                        fieldLabel: '商品名称',
                        labelAlign: 'left',
                        emptyText: '请输入商品名称或编号',
                        labelWidth: Global.labelWidth
                    },
                    Global.getCombo({
                        name: 'goodsType',
                        fieldLabel: '类别',
                        search: true,
                        valueField: 'name',
                        url: CTX + '/admin/param/list/goods_type'
                    }),
                    Global.getCombo({
                        name: 'repoId',
                        fieldLabel: '仓库',
                        search: true,
                        url: CTX + '/admin/repo/list'
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
    },
    /**
     * 修改价格
     */
    getPriceWin: function (record) {

        if (!Stock.priceWin) {

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
                        xtype: 'numberfield',
                        fieldLabel: '平均进价',
                        name: 'avgBuyPrice',
                        allowBlank: false,
                        afterLabelTextTpl: Global.required,
                        emptyText: '请输入平均进价',
                        minValue: 1,
                        maxValue: 9999999,
                        decimalPrecision: 2, //小数位
                        hideTrigger: false,
                        keyNavEnabled: true,
                        mouseWheelEnabled: true
                    },
                    {
                        xtype: 'numberfield',
                        fieldLabel: '预设售价',
                        name: 'salePrice',
                        allowBlank: false,
                        afterLabelTextTpl: Global.required,
                        emptyText: '请输入预设售价',
                        minValue: 1,
                        maxValue: 9999999,
                        decimalPrecision: 2, //小数位
                        hideTrigger: false,
                        keyNavEnabled: true,
                        mouseWheelEnabled: true
                    }
                ]
            });

            var win = Ext.create('Ext.window.Window', {
                title: "修改价格",
                width: 300,
                height: 200,
                bodyPadding: 10,
                layout: 'fit',
                border: 0,
                constrain: true,
                modal: true,
                resizable: false,
                shadow: 'frame',
                closeAction: 'hide',
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
                            if (form.isValid()) {
                                form.submit({
                                    url: CTX + '/admin/stock/update',
                                    submitEmptyText: false,
                                    success: function (form, action) {
                                        var msg = action.result && action.result.msg ? action.result.msg : "修改成功";
                                        Ext.Msg.alert('信息提示', msg);
                                        Stock.reload();
                                        win.hide();
                                    },
                                    failure: function (form, action) {
                                        var msg = action.result && action.result.msg ? action.result.msg : "修改失败";
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

            Stock.priceWin = win;
        }

        Stock.priceWin.form.loadRecord(record);

        return Stock.priceWin;
    },
    /**
     * 库存调拨
     */
    getTransferWin: function (record) {
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
                    value: record.data.id
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: '调拨数量',
                    name: 'transferCount',
                    allowBlank: false,
                    afterLabelTextTpl: Global.required,
                    emptyText: '请输入调拨数量',
                    minValue: 1,
                    maxValue: record.data.totalCount,
                    decimalPrecision: 0, //小数位
                    hideTrigger: false,
                    keyNavEnabled: true,
                    mouseWheelEnabled: true
                },
                {
                    xtype: 'combo',
                    fieldLabel: '调入仓库',
                    name: 'repoName',
                    itemId: 'repoName',
                    allowBlank: false,
                    afterLabelTextTpl: Global.required,
                    emptyText: '请选择调入仓库',
                    editable: false,
                    triggerCls: 'x-form-search-trigger',
                    onTriggerClick: function() {
                        var nameText = this;
                        var idText = this.nextNode("textfield[name=repoId]");

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

                                        if(sel.data.id == record.data.repoId){
                                            Ext.Msg.alert('信息提示', "不能选择相同的仓库");
                                            return false;
                                        }

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

                        repo.show();
                    }
                },
                {
                    fieldLabel: '仓库ID',
                    name: 'repoId',
                    hidden: true
                }
            ]
        });

        var win = Ext.create('Ext.window.Window', {
            title: "库存调拨",
            width: 300,
            height: 200,
            bodyPadding: 10,
            layout: 'fit',
            border: 0,
            constrain: true,
            modal: true,
            resizable: false,
            shadow: 'frame',
            closeAction: 'hide',
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
                        if (form.isValid()) {
                            form.submit({
                                url: CTX + '/admin/stock/transfer',
                                submitEmptyText: false,
                                success: function (form, action) {
                                    var msg = action.result && action.result.msg ? action.result.msg : "调拨成功";
                                    Ext.Msg.alert('信息提示', msg);
                                    Stock.reload();
                                    win.hide();
                                },
                                failure: function (form, action) {
                                    var msg = action.result && action.result.msg ? action.result.msg : "调拨失败";
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
    },
    getCountGrid: function () {
        var store = Ext.create('Ext.data.Store', {
            fields: ['totalGoodsCount', 'totalRepoCount', 'totalSaleCount', 'totalRepoBuyPrice', 'totalRepoSalePrice'],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: CTX + '/admin/stock/count',
                reader: {
                    type: 'json',
                    root: 'content'
                }
            }
        });

        var countGrid = Ext.create('Ext.grid.Panel', {
            store: store,
            title: '库存统计',
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
            columns: [
                {
                    text: '商品总数',
                    dataIndex: 'totalGoodsCount'
                },
                {
                    text: '库存总量',
                    dataIndex: 'totalRepoCount'
                },
                {
                    text: '总销售量',
                    dataIndex: 'totalSaleCount'
                },
                {
                    text: '库存总成本',
                    dataIndex: 'totalRepoBuyPrice'
                },
                {
                    text: '库存总值',
                    dataIndex: 'totalRepoSalePrice'
                }
            ],
            tbar: {
                border: 0,
                items: [
                    Global.getCombo({
                        name: 'goodsType',
                        fieldLabel: '类别',
                        search: true,
                        valueField: 'name',
                        url: CTX + '/admin/param/list/goods_type'
                    }),
                    Global.getCombo({
                        name: 'repoId',
                        fieldLabel: '仓库',
                        search: true,
                        url: CTX + '/admin/repo/list'
                    }),
                    {
                        xtype: 'button',
                        text: '查询',
                        iconCls: 'silk-form-search',
                        handler: function (o, ev) {
                            countGrid.reload();
                        }
                    }
                ]
            },
            listeners: {
                'activate': function (o) {
                    countGrid.reload();
                }
            }
        });

        countGrid.reload = function () {
            var toolbar = countGrid.getDockedItems('toolbar[dock="top"]');
            var params = Ext.apply({}, Global.getParams(toolbar));
            countGrid.getStore().load({
                params: params
            });
        };

        Stock.countGrid = countGrid;

        return countGrid;
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

Ext.require(['*']);

Ext.onReady(function () {
    Ext.tip.QuickTipManager.init();

    Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));

    //库存
    var grid = Stock.getGrid();
    //统计
    var count = Stock.getCountGrid();

    var tab = Ext.create('Ext.tab.Panel', {
        layout: 'fit',
        activeTab: 0,
        items: [
            grid,
            count
        ]
    });

    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: tab
    });

});




