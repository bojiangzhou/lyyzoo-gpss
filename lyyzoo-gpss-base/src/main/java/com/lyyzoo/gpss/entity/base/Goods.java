package com.lyyzoo.gpss.entity.base;

import com.lyyzoo.data.entity.BaseEntity;
import com.lyyzoo.util.Dates;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Date;

/**
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-05
 */
@Data
@Entity
@Table(name = "lz_base_goods")
public class Goods extends BaseEntity {

    /**
     * 商品名称
     */
    private String name;
    /**
     * 商品编号
     */
    private String code;
    /**
     * 商品类别
     */
    private String type;
    /**
     * 品牌
     */
    private String brand;
    /**
     * 计量单位
     */
    private String unit;
    /**
     * 颜色
     */
    private String color;
    /**
     * 规格型号
     */
    private String standard;
    /**
     * 材质
     */
    private String material;
    /**
     * 预设进价
     */
    private String buyPrice;
    /**
     * 预设售价
     */
    private String salePrice;
    /**
     * 商品描述
     */
    private String descs;

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
     * 状态
     */
    private Integer state;

    /**
     * 图片 base64
     */
    private String picture;


}
