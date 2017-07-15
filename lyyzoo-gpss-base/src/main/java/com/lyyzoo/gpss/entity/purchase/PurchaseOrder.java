package com.lyyzoo.gpss.entity.purchase;

import com.lyyzoo.data.entity.BaseEntity;
import com.lyyzoo.gpss.Applications;
import com.lyyzoo.util.Dates;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.util.Date;

/**
 * 采购单
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-06
 */
@Data
@Entity
@Table(name = "lz_purchase_order")
public class PurchaseOrder extends BaseEntity {

    public static interface Type {
        /**
         * 采购单
         */
        public static final int BUY = 1;
        /**
         * 采购退货单
         */
        public static final int BUY_REJECT = 2;
    }

    /**
     * 商品ID
     */
    private Long goodsId;
    /**
     * 供货商
     */
    private Long supplierId;
    /**
     * 供应商名称
     */
    private String supplierName;
    /**
     * 收货仓库
     */
    private Long repoId;
    /**
     * 单号
     */
    private String orderNumber;
    /**
     * 数量
     */
    private Integer count;
    /**
     * 单价
     */
    private Double unitPrice;
    /**
     * 总价
     */
    private Double totalPrice;
    /**
     * 经办员工
     */
    private Long employeeId;
    /**
     * 备注
     */
    private String descs;
    /**
     * 审核状态
     */
    private Integer checkState;
    /**
     * 审核结果
     */
    private String checkResult;
    /**
     * 审核人
     */
    private String checkAccount;
    /**
     * 审核时间
     */
    private Date checktime;
    /**
     * 入库日期
     */
    private Date taketime;
    /**
     * 创建人账号
     */
    private String  creater;
    /**
     * 创建时间
     */
    @DateTimeFormat(pattern = Dates.FORMAT_DATETIME)
    private Date creatime;
    /**
     * 修改人账号
     */
    private String  updater;
    /**
     * 修改时间
     */
    @DateTimeFormat(pattern = Dates.FORMAT_DATETIME)
    private Date updatime;
    /**
     * 删除状态
     */
    private Integer state;

    /**
     * 订单类型
     * 1 : 采购单
     * 2 : 退货单
     */
    private Integer type;

    ////////////////// 其它字段 //////////////////

    private String goodsName;

    private String goodsCode;

    private String goodsUnit;

    private String goodsType;

    private String goodsBrand;

    private String repoName;

    private String employeeName;

    private String employeeCode;

    private String checkStateStr;

    private String creatimeStr;

    private String checktimeStr;

    @Transient
    public String getGoodsName() {
        return goodsName;
    }
    @Transient
    public String getGoodsCode() {
        return goodsCode;
    }
    @Transient
    public String getGoodsUnit() {
        return goodsUnit;
    }
    @Transient
    public String getGoodsType() {
        return goodsType;
    }
    @Transient
    public String getGoodsBrand() {
        return goodsBrand;
    }
    @Transient
    public String getRepoName() {
        return repoName;
    }
    @Transient
    public String getEmployeeName() {
        return employeeName;
    }
    @Transient
    public String getEmployeeCode() {
        return employeeCode;
    }
    @Transient
    public String getCheckStateStr() {
        switch (checkState){
            case Applications.Check.INPUT:
                checkStateStr = "录入";
                break;
            case Applications.Check.WAIT:
                checkStateStr = "等待审核";
                break;
            case Applications.Check.PASS:
                checkStateStr = "审核通过";
                break;
            case Applications.Check.FAIL:
                checkStateStr = "审核未通过";
                break;
        }

        return checkStateStr;
    }
    @Transient
    public String getCreatimeStr() {
        return creatime == null ? "" : Dates.toStringWithDateFormatDateTime(creatime);
    }
    @Transient
    public String getChecktimeStr() {
        return checktime == null ? "" : Dates.toStringWithDateFormatDateTime(checktime);
    }
}
