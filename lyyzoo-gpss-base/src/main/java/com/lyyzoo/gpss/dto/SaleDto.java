package com.lyyzoo.gpss.dto;

import lombok.Data;

/**
 * 销售统计
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-10
 */
@Data
public class SaleDto {

    /**
     * 月份
     */
    private String month;
    /**
     * 销售总数量
     */
    private Integer totalCount;
    /**
     * 销售总值
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
