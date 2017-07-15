package com.lyyzoo.gpss;

/**
 * 程序的一些常量配置等
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-01
 */
public class Applications {

    public static interface Flag {
        /**
         * 无效
         */
        public static final int NO  = 0;
        /**
         * 有效
         */
        public static final int YES = 1;
    }

    /**
     * 性别
     */
    public static interface Sex {
        /**
         * 无
         */
        public static final int NONE   = 0;
        /**
         * 男
         */
        public static final int MALE   = 1;
        /**
         * 女
         */
        public static final int FEMALE = 2;
    }

    /**
     * 审核状态
     */
    public static interface Check {
        /**
         * 录入
         */
        public static final int INPUT   = 1;
        /**
         * 待审核
         */
        public static final int WAIT    = 2;
        /**
         * 审核通过
         */
        public static final int PASS    = 3;
        /**
         * 审核未通过
         */
        public static final int FAIL    = 4;
    }

    /**
     * 订单前缀
     */
    public static interface Order {
        /**
         * 采购订单
         */
        public static final String PURCHASE         = "P";
        /**
         * 采购退货订单
         */
        public static final String PURCHASE_REJECT  = "PR";
        /**
         * 销售订单
         */
        public static final String SALE             = "S";
        /**
         * 销售退货订单
         */
        public static final String SALE_REJECT      = "SR";
    }

    /**
     * 默认密码
     */
    public static final String DEFAULT_PASS = "111111";

    /**
     * 超级管理员账号
     */
    public static final String ADMIN        = "admin";



}
