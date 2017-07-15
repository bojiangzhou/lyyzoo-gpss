package com.lyyzoo.gpss.entity.purchase;

import com.lyyzoo.data.entity.BaseEntity;
import com.lyyzoo.util.Dates;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Date;

/**
 * 供应商
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-06
 */
@Data
@Entity
@Table(name = "lz_purchase_supplier")
public class Supplier extends BaseEntity {

    /**
     * 供应商名称
     */
    private String name;
    /**
     * 联系人
     */
    private String linkman;
    /**
     * 联系电话
     */
    private String mobile;
    /**
     * 联系地址
     */
    private String address;
    /**
     * 描述
     */
    private String descs;
    /**
     * 状态
     */
    private Integer state;
    /**
     * 修改人账号
     */
    private String  updater;
    /**
     * 修改时间
     */
    @DateTimeFormat(pattern = Dates.FORMAT_DATETIME)
    private Date updatime;


}
