/**
 * 全局工具类
 * <p>
 * @author bojiangzhou
 * @date 2017-04-02
 */

var Global = {
    CTX: window.CTX,
    nbsp: '&nbsp;&nbsp;',
    nbsp8: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
    required: '<span style="color:red;font-weight:bold" data-qtip="必填项">*</span>',
    emptyRecord: '<div class="x-grid-empty">未找到匹配记录</div>',
    waitMsg: '请稍候...',
    successMsg: '操作成功',
    labelAlign: 'left',
    labelWidth: 62,
    toolbarHeight: 50,
    defaults: {
        grid: {
            pageSize: 15
        },
        proxy: {
            pageParam: 'pageNumber',
            limitParam: 'pageSize'
        }
    },
    /**
     * 封装返回容器下的表单的参数 <p>
     * 需要封装参数的表单加上search=true
     * @param toolbars
     */
    getParams: function (toolbars) {
        var params = {};
        for (var c in toolbars) {
            var items = toolbars[c].items.items;
            for (var i in items) {
                var item = items[i];
                if (item.search) {
                    var key = item.name;
                    var val = item.value || item.getValue();
                    if (val && val !== -1 && val !== "-1" && val !== '所有') {
                        if(item.xtype === 'datefield'){
                            val = Ext.Date.format(val, 'Y-m-d');
                        }
                        params[key] = val;
                    }
                }
            }
        }

        return params;
    },
    getCombo: function (defaults) {
        var text = defaults.fieldLabel;
        if(defaults.search){
            if(text.length == 2){
                defaults.labelWidth = Global.labelWidth - 25;
            } else if(text.length == 3){
                defaults.labelWidth = Global.labelWidth - 15;
            }
        }
        text = text.replace(/[&nbsp;]/g, '');

        defaults = Ext.apply({
            name: 'name',
            fieldLabel: 'label',
            labelAlign: 'left',
            labelWidth: Global.labelWidth,
            valueField: 'id',
            displayField: 'name',
            emptyText: '请选择' + text,
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
                        if(defaults.search){
                            var defaultData = {'id': -1, 'name': '所有'};
                            if(defaults.defaultData){
                                defaultData = defaults.defaultData;
                            }
                            store.insert(0, [defaultData]);
                        }
                    }
                }
            }
        }, defaults);

        return Ext.create('Ext.form.field.ComboBox', defaults);
    },
    getSearch: function (defaults) {
        var text = defaults.fieldLabel;
        text = text.replace(/[&nbsp;]/g, '');

        defaults = Ext.apply({
            xtype: 'textfield',
            name: 'name',
            search: true,
            fieldLabel: 'label',
            labelAlign: 'left',
            emptyText: '请输入'+text,
            labelWidth: Global.labelWidth
        }, defaults);

        return defaults;
    },
    getStartDate: function (defaults) {
        defaults = Ext.apply({
            name: 'startDate',
            fieldLabel: '开始时间',
            maxValue: new Date(),
            vtype: 'daterange',
            endDateField: 'endDate',
            format: 'Y-m-d',
            labelAlign: 'left',
            emptyText: '请选择开始时间',
            labelWidth: Global.labelWidth
        }, defaults);

        return Ext.create('Ext.form.field.Date', defaults);
    },
    getEndDate: function (defaults) {
        defaults = Ext.apply({
            name: 'endDate',
            fieldLabel: '结束时间',
            vtype: 'daterange',
            startDateField: 'startDate',
            format: 'Y-m-d',
            maxValue: new Date(),
            labelAlign: 'left',
            emptyText: '请选择结束时间',
            labelWidth: Global.labelWidth
        }, defaults);

        return Ext.create('Ext.form.field.Date', defaults);
    }
};

Ext.onReady(function () {
    Ext.apply(Ext.form.field.VTypes, {
        //验证两次密码是否一致 第一个密码组件需要定义一个id, 第二个密码组件需要定义newPassId指向第一个的id
        password: function (val, field) {
            if (field.newPassId) {
                var newPass = Ext.getCmp(field.newPassId);
                return val === newPass.getValue();
            }
            return false;
        },
        passwordText: '两次输入的密码不一致',

        //验证两次密码是否一致
        mobile: function (val, field) {
            var reg = /^1[34578]\d{9}$/;
            if (!reg.test(val)) {
                return false;
            }
            return true;
        },
        mobileText: '手机号格式有误',

        //中文
        chinese: function (val, field) {
            var reg = /^[\u4e00-\u9fa5]+$/i;
            if (!reg.test(val)) {
                return false;
            }
            return true;
        },
        chineseText: '请输入中文',

        picture: function (val, field) {
            if(val){
                var suffix = val.substr(val.lastIndexOf(".") + 1);
                return /^jpg$|^jpeg$|^png$|^gif$/i.test(suffix);
            }
            return false;
        },
        pictureText: '图片格式不正确，只能选择.jpg|.jpeg|.png|.gif格式图片',

        /**
         * 时间控件验证 开始时间必须小于结束时间
         */
        daterange : function(val, field) {
            if (val) {
                var date = field.parseDate(val);
                if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
                    var start = field.up().query('datefield[name=' + field.startDateField + ']')[0];
                    if (start) {
                        start.setMaxValue(date);
                        start.validate();
                        this.dateRangeMax = date;
                    }
                } else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
                    var end = field.up().query('datefield[name=' + field.endDateField + ']')[0];
                    if (end) {
                        end.setMinValue(date);
                        end.validate();
                        this.dateRangeMin = date;
                    }
                }
                return true;
            }
            return false;
        }

    });

});


