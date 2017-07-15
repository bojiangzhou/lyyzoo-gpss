/**
 * 商品管理
 * <p>
 * @author bojiangzhou
 * @date 2017-04-05
 */

var Goods = {
    reload: function (params) {
        var toolbar = Goods.grid.getDockedItems('toolbar[dock="top"]');
        params = Ext.apply(params || {}, Global.getParams(toolbar));
        Goods.grid.getStore().load({
            params: params
        });
    },
    getParam: function (defaults) {
        defaults = Ext.applyIf(defaults || {}, {
            xtype: 'combo',
            name: 'color',
            fieldLabel: '颜色',
            labelAlign: 'left',
            labelWidth: Global.labelWidth,
            valueField: 'name',
            displayField: 'name',
            editable: false,
            store: {
                fields: ['id', 'name'],
                autoLoad: true,
                proxy: {
                    type: 'ajax',
                    url: defaults.url,
                    reader: {
                        type: 'json',
                        root: 'content'
                    }
                },
                listeners: {
                    'load': function (store, records) {
                        if (defaults.search) {
                            store.insert(0, [{'id': '所有', 'name': '所有'}]);
                        }
                    }
                }
            }
        });

        return defaults;
    },
    getGrid: function () {
        if (Goods.grid) {
            return Goods.grid;
        }

        var store = Ext.create('Ext.data.Store', {
            fields: ['id', 'name', 'code', 'type', 'brand', 'unit', 'color', 'standard', 'material', 'buyPrice', 'salePrice', 'descs', 'updater', 'updatime'],
            pageSize: Global.defaults.grid.pageSize,
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: CTX + '/admin/goods/page',
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
                    text: '商品名称',
                    dataIndex: 'name'
                },
                {
                    text: '商品编号',
                    dataIndex: 'code'
                },
                {
                    text: '商品类别',
                    dataIndex: 'type'
                },
                {
                    text: '品牌',
                    dataIndex: 'brand'
                },
                {
                    text: '计量单位',
                    dataIndex: 'unit'
                },
                {
                    text: '颜色',
                    dataIndex: 'color'
                },
                {
                    text: '规格型号',
                    dataIndex: 'standard'
                },
                {
                    text: '材质',
                    dataIndex: 'material'
                },
                {
                    text: '预设进价',
                    dataIndex: 'buyPrice'
                },
                {
                    text: '预设售价',
                    dataIndex: 'salePrice'
                },
                {
                    text: '商品描述',
                    dataIndex: 'descs'
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
                            tooltip: '修改',
                            iconCls: 'silk-form-update',
                            handler: function (grid, rowIndex, colIndex, actionItem, event, record, row) {
                                var win = Goods.getWin('update', record);
                                win.show();
                            }
                        },
                        {
                            tooltip: '删除',
                            iconCls: 'silk-dust-bin',
                            handler: function (grid, rowIndex, colIndex, actionItem, event, record, row) {
                                Ext.Msg.confirm('确认', '您确定要删除该商品吗', function (opt) {
                                    if (opt == 'yes') {
                                        Ext.Ajax.request({
                                            url: CTX + '/admin/goods/remove',
                                            params: {
                                                'id': record.data.id
                                            },
                                            success: function (response, action) {
                                                var result = Ext.decode(response.responseText);
                                                if(result.success){
                                                    Ext.Msg.alert('信息提示', "删除成功");
                                                    Goods.reload();
                                                } else{
                                                    Ext.Msg.alert('信息提示', result.msg);
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        },
                        {
                            tooltip: '商品图片',
                            iconCls: 'silk-application-view-gallery',
                            handler: function (grid, rowIndex, colIndex, actionItem, event, record, row) {
                                var loadMask = new Ext.LoadMask(Goods.grid, {msg:"加载中..."});
                                loadMask.show();
                                Ext.Ajax.request({
                                    url: CTX + '/admin/goods/picture',
                                    params: {
                                        'id': record.data.id
                                    },
                                    success: function (response, options) {
                                        var json = Ext.JSON.decode(response.responseText);
                                        var base64 = json['picture'];
                                        if(base64 && base64 !== ""){
                                            var pictureWin = Goods.getPictureWin(base64);
                                            pictureWin.show();
                                        } else{
                                            Ext.Msg.alert("信息提示", "当前商品没有图片");
                                        }
                                        loadMask.hide();
                                    },
                                    failure: function (response, options) {
                                        Ext.Msg.alert("信息提示", "下载图片失败");
                                        loadMask.hide();
                                    }
                                });
                            }
                        },
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
                        name: 'name',
                        search: true,
                        fieldLabel: '商品名称',
                        labelAlign: 'left',
                        emptyText: '请输入商品名称',
                        labelWidth: Global.labelWidth
                    },
                    {
                        xtype: 'textfield',
                        name: 'code',
                        search: true,
                        fieldLabel: '商品编号',
                        labelAlign: 'left',
                        emptyText: '请输入商品编号',
                        labelWidth: Global.labelWidth
                    },
                    Goods.getParam({
                        name: 'type',
                        fieldLabel: '类别',
                        labelWidth: Global.labelWidth - 25,
                        search: true,
                        emptyText: '请选择类别',
                        url: CTX + '/admin/param/list/goods_type'
                    }),
                    Goods.getParam({
                        name: 'brand',
                        fieldLabel: '品牌',
                        labelWidth: Global.labelWidth - 25,
                        search: true,
                        emptyText: '请选择品牌',
                        url: CTX + '/admin/param/list/brand'
                    })
                ]
            }
        });

        //添加第二行工具栏
        grid.addDocked({
            xtype: 'toolbar',
            border: 0,
            items: [
                Goods.getParam({
                    name: 'color',
                    fieldLabel: '颜'+Global.nbsp8+'色',
                    labelWidth: Global.labelWidth,
                    search: true,
                    emptyText: '请选择颜色',
                    url: CTX + '/admin/param/list/color'
                }),
                Goods.getParam({
                    name: 'standard',
                    fieldLabel: '规格型号',
                    search: true,
                    emptyText: '请选择规格型号',
                    url: CTX + '/admin/param/list/goods_standard'
                }),
                Goods.getParam({
                    name: 'material',
                    fieldLabel: '材质',
                    labelWidth: Global.labelWidth - 25,
                    search: true,
                    emptyText: '请选择材质',
                    url: CTX + '/admin/param/list/material'
                }),
                {
                    xtype: 'button',
                    text: '查询',
                    iconCls: 'silk-form-search',
                    handler: function (o, ev) {
                        Goods.reload()
                    }
                },
                {
                    xtype: 'button',
                    text: '新增',
                    iconCls: 'silk-form-add',
                    handler: function (o, ev) {
                        var win = Goods.getWin('create');
                        win.show();
                    }
                }
            ]
        });


        Goods.grid = grid;
        return grid;
    },
    getPictureWin: function (base64) {
        if(!Goods.PictureWin){
            var pictureImg = Ext.create('Ext.Img');

            var pictureWin = Ext.create('Ext.window.Window', {
                title: "商品图片",
                width: 500,
                height: 400,
                bodyPadding: 2,
                closeAction: 'hide',
                layout: 'fit',
                border: 0,
                constrain: true,
                modal: true,
                resizable: false,
                shadow: 'frame',
                items: pictureImg
            });

            pictureWin.pictureImg = pictureImg;

            Goods.PictureWin = pictureWin;
        }

        var src = "data:image/png;base64," + base64;
        Goods.PictureWin.pictureImg.setSrc(src);

        return Goods.PictureWin;
    },
    getWin: function (action, record) {

        if (!Goods.win) {
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
                        fieldLabel: '商品名称',
                        name: 'name',
                        afterLabelTextTpl: Global.required,
                        emptyText: '请输入商品名称',
                        allowBlank: false
                    },
                    {
                        fieldLabel: '商品编号',
                        name: 'code',
                        itemId: 'code',
                        afterLabelTextTpl: Global.required,
                        emptyText: '请输入商品编号',
                        allowBlank: false,
                        readOnly: false
                    },
                    Goods.getParam({
                        name: 'type',
                        fieldLabel: '商品类别',
                        afterLabelTextTpl: Global.required,
                        emptyText: '请选择商品类别',
                        allowBlank: false,
                        url: CTX + '/admin/param/list/goods_type'
                    }),
                    Goods.getParam({
                        name: 'brand',
                        fieldLabel: '品' + Global.nbsp8 + '牌',
                        emptyText: '请选择品牌',
                        url: CTX + '/admin/param/list/brand'
                    }),
                    Goods.getParam({
                        name: 'unit',
                        fieldLabel: '计量单位',
                        emptyText: '请选择计量单位',
                        url: CTX + '/admin/param/list/goods_unit'
                    }),
                    Goods.getParam({
                        name: 'color',
                        fieldLabel: '颜' + Global.nbsp8 + '色',
                        emptyText: '请选择颜色',
                        url: CTX + '/admin/param/list/color'
                    }),
                    Goods.getParam({
                        name: 'standard',
                        fieldLabel: '规格型号',
                        emptyText: '请选择规格型号',
                        url: CTX + '/admin/param/list/goods_standard'
                    }),
                    Goods.getParam({
                        name: 'material',
                        fieldLabel: '材' + Global.nbsp8 + '质',
                        emptyText: '请选择材质',
                        url: CTX + '/admin/param/list/material'
                    }),
                    {
                        fieldLabel: '预设进价',
                        name: 'buyPrice',
                        emptyText: '请输入预设进价'
                    },
                    {
                        fieldLabel: '预设售价',
                        name: 'salePrice',
                        emptyText: '请输入预设售价'
                    },
                    {
                        fieldLabel: '描' + Global.nbsp8 + '述',
                        name: 'descs',
                        emptyText: '请输入商品描述'
                    },
                    {
                        xtype: 'filefield',
                        fieldLabel: '商品图片',
                        buttonText: '选择图片',
                        name: 'file',
                        vtype: 'picture',
                        emptyText: '请选择图片'
                    }
                ]
            });

            var win = Ext.create('Ext.window.Window', {
                title: "商品",
                width: 350,
                height: 470,
                bodyPadding: 10,
                layout: 'fit',
                border: 0,
                constrain: true,
                modal: true,
                resizable: false,
                closeAction: 'hide',
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
                                    url: CTX + '/admin/goods/save',
                                    submitEmptyText: false,
                                    success: function (form, action) {
                                        var msg = action.result && action.result.msg ? action.result.msg : "保存成功";
                                        Ext.Msg.alert('信息提示', msg);
                                        Goods.reload();
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

            Goods.win = win;
        }

        if (action === 'update') {
            Goods.win.form.loadRecord(record);
        }
        Goods.win.form.getComponent('code').setReadOnly(action === 'update');

        return Goods.win;
    }
};

Ext.require(['*']);

Ext.onReady(function () {
    Ext.tip.QuickTipManager.init();

    Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));

    var grid = Goods.getGrid();

    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: grid
    });

});




