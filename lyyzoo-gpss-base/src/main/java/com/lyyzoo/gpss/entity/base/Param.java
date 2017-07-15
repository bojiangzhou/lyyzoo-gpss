package com.lyyzoo.gpss.entity.base;

import com.lyyzoo.data.entity.BaseEntity;
import com.lyyzoo.util.Dates;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Date;

/**
 * 基础参数
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-04
 */
@Data
@Entity
@Table(name = "lz_base_param")
public class Param extends BaseEntity {

    /**
     * 参数类别
     */
    public static interface Type {
        /**
         * 商品类别
         */
        public static final String GOODS_TYPE       = "GOODS_TYPE";
        /**
         * 规格型号
         */
        public static final String GOODS_STANDARD   = "GOODS_STANDARD";
        /**
         * 计量单位
         */
        public static final String GOODS_UNIT       = "GOODS_UNIT";
        /**
         * 品牌
         */
        public static final String BRAND            = "BRAND";
        /**
         * 材质
         */
        public static final String MATERIAL         = "MATERIAL";
        /**
         * 颜色
         */
        public static final String COLOR            = "COLOR";
        /**
         * 员工类别
         */
        public static final String EMPLOYEE_TYPE    = "EMPLOYEE_TYPE";
    }

    /**
     * 参数名称
     */
    private String name;
    /**
     * 描述
     */
    private String descs;
    /**
     * 状态
     */
    private Integer state;
    /**
     * 参数类别
     */
    private String type;
    /**
     * 创建人账号
     */
    private String  creater;
    /**
     * 创建时间
     */
    @DateTimeFormat(pattern = Dates.FORMAT_DATETIME)
    private Date    creatime;


}
