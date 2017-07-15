/**
 * 销售统计
 * <p>
 * @author bojiangzhou
 * @date 2017-04-10
 */

var Count = {
    getChart: function () {
        var store = Ext.create('Ext.data.JsonStore', {
            fields: ['month', 'totalCount', 'totalMoney', 'rejectTotalCount', 'rejectTotalMoney'],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: CTX + '/admin/sale/order/count',
                reader: {
                    type: 'json',
                    root: 'content'
                }
            }
        });

        var chart = Ext.create('Ext.chart.Chart', {
            store: store,
            layout: 'fit',
            style: 'background:#FFF',
            animate: true,
            shadow: false,
            theme: 'Category1',
            legend: {
                position: 'bottom'
            },
            axes: [
                {
                    type: 'Numeric',
                    position: 'left',
                    fields: ['totalCount', 'rejectTotalCount'],
                    title: '销售量',
                    grid: {
                        even: {
                            opacity: 0.7,
                            fill: '#DDD',
                            stroke: '#BBB',
                            'stroke-width': 1
                        }
                    },
                    minimum: 0,
                    adjustMinimumByMajorUnit: 0
                },
                {
                    type: 'Numeric',
                    position: 'right',
                    fields: ['totalMoney', 'rejectTotalMoney'],
                    title: '销售额',
                    grid: false,
                    minimum: 0,
                    adjustMinimumByMajorUnit: 0
                },
                {
                    type: 'Category',
                    position: 'bottom',
                    fields: ['month'],
                    title: '月份',
                    grid: true,
                    label: {
                        rotate: {
                            degrees: 315
                        }
                    }
                }
            ],
            series: [
                {
                    type: 'line',
                    highlight: {
                        size: 7,
                        radius: 7
                    },
                    shadow: true,
                    tips: {
                        trackMouse: false,
                        autoShow: true,
                        height: 22,
                        renderer: function(storeItem, item) {
                            this.setTitle(storeItem.get('totalCount'));
                        }
                    },
                    axis: 'left',
                    smooth: true,
                    xField: 'name',
                    yField: 'totalCount',
                    title: '销售量',
                    markerConfig: {
                        type: 'circle',
                        size: 4,
                        radius: 4,
                        'stroke-width': 0
                    }
                },
                {
                    type: 'line',
                    highlight: {
                        size: 7,
                        radius: 7
                    },
                    tips: {
                        trackMouse: false,
                        autoShow: true,
                        height: 22,
                        renderer: function(storeItem, item) {
                            this.setTitle(storeItem.get('totalMoney'));
                        }
                    },
                    axis: 'right',
                    smooth: true,
                    xField: 'name',
                    yField: 'totalMoney',
                    title: '销售额',
                    // fill: true,
                    markerConfig: {
                        type: 'circle',
                        size: 4,
                        radius: 4,
                        'stroke-width': 0
                    }
                },
                {
                    type: 'line',
                    highlight: {
                        size: 7,
                        radius: 7
                    },
                    tips: {
                        trackMouse: false,
                        autoShow: true,
                        height: 22,
                        renderer: function(storeItem, item) {
                            this.setTitle(storeItem.get('rejectTotalCount'));
                        }
                    },
                    axis: 'left',
                    smooth: true,
                    xField: 'name',
                    yField: 'rejectTotalCount',
                    title: '退货量',
                    markerConfig: {
                        type: 'cross',
                        size: 4,
                        radius: 4,
                        'stroke-width': 0
                    }
                },
                {
                    type: 'line',
                    highlight: {
                        size: 7,
                        radius: 7
                    },
                    tips: {
                        trackMouse: false,
                        autoShow: true,
                        height: 22,
                        renderer: function(storeItem, item) {
                            this.setTitle(storeItem.get('rejectTotalMoney'));
                        }
                    },
                    axis: 'right',
                    smooth: true,
                    xField: 'name',
                    yField: 'rejectTotalMoney',
                    title: '退货额',
                    markerConfig: {
                        type: 'cross',
                        size: 4,
                        radius: 4,
                        'stroke-width': 0
                    }
                }
            ]
        });

        var panel = Ext.create('Ext.panel.Panel', {
            items: chart,
            layout: 'fit',
            tbar: [
                Global.getSearch({
                    name: 'goodsNameOrCode',
                    fieldLabel: '商品名称',
                    emptyText: '请输入商品名称或编号'
                }),
                Global.getSearch({
                    name: 'employeeNameOrCode',
                    fieldLabel: '员工姓名',
                    emptyText: '请输入员工姓名或编号'
                }),
                Global.getStartDate({
                    search: true
                }),
                Global.getEndDate({
                    search: true
                }),
                {
                    xtype: 'button',
                    text: '查询',
                    iconCls: 'silk-form-search',
                    handler: function (o, ev) {
                        var params = Global.getParams(panel.getDockedItems('toolbar[dock="top"]'));
                        store.load({
                            params: params
                        });
                    }
                }
            ]
        });

        return panel;
    }
};

Ext.require(['*']);

Ext.onReady(function () {
    Ext.tip.QuickTipManager.init();

    Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));

    var chart = Count.getChart();

    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: chart
    });
});

