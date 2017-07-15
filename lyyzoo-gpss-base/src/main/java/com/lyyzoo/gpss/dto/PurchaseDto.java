package com.lyyzoo.gpss.dto;

import lombok.Data;

/**
 * 采购统计
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-10
 */
@Data
public class PurchaseDto {

    /**
     * 月份
     */
    private String month;
    /**
     * 采购总数量
     */
    private Integer totalCount;
    /**
     * 采购总值
     */
    private Double totalMoney;

    /**
     * 退货总数量
     */
    private Integer rejectTotalCount;
    /**
     * 退货总值
     */
    private Double rejectTotalMoney;


}
