package com.lyyzoo.gpss.entity.system;

import com.lyyzoo.data.entity.BaseEntity;
import com.lyyzoo.util.Dates;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Date;

/**
 * 角色
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-01
 */
@Data
@Entity
@Table(name = "lz_sys_role")
public class Role extends BaseEntity {

    /**
     * 角色
     */
    public static interface Type {
        /**
         * 管理员
         */
        public static final String ADMIN        = "ADMIN";
        /**
         * 采购管理员
         */
        public static final String PURCHASER    = "PURCHASER";
        /**
         * 销售管理员
         */
        public static final String SELLER       = "SELLER";
        /**
         * 库存管理员
         */
        public static final String STOCKR       = "STOCKR";
    }

    /**
     * 角色名称
     */
    private String name;
    /**
     * 角色编码
     */
    private String code;
    /**
     * 角色描述
     */
    private String descs;
    /**
     * 角色菜单
     */
    private String menuIds;
    /**
     * 角色名称
     */
    private String menuNames;
    /**
     * 状态
     */
    private Integer state;
    /**
     * 创建人账号
     */
    private String updater;
    /**
     * 更新时间
     */
    @DateTimeFormat(pattern = Dates.FORMAT_DATETIME)
    private Date updatime;


}
