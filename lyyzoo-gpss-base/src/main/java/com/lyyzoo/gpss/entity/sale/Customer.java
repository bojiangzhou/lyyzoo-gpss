package com.lyyzoo.gpss.entity.sale;

import com.lyyzoo.data.entity.BaseEntity;
import com.lyyzoo.util.Dates;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Date;

/**
 * 客户
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-06
 */
@Data
@Entity
@Table(name = "lz_sale_customer")
public class Customer extends BaseEntity {

    /**
     * 客户名称
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
