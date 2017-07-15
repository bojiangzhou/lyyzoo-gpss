package com.lyyzoo.gpss.entity.base;

import com.lyyzoo.data.entity.BaseEntity;
import com.lyyzoo.util.Dates;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.util.Date;

/**
 * 仓库
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-04
 */
@Data
@Entity
@Table(name = "lz_base_repo")
public class Repo extends BaseEntity {

    /**
     * 仓库名称
     */
    private String name;
    /**
     * 仓库编号
     */
    private String code;
    /**
     * 仓库地址
     */
    private String address;
    /**
     * 描述
     */
    private String descs;
    /**
     * 仓库管理员ID 与Employee ID 关联
     */
    private Long adminId;
    /**
     * 修改人账号
     */
    private String  updater;
    /**
     * 修改时间
     */
    @DateTimeFormat(pattern = Dates.FORMAT_DATETIME)
    private Date    updatime;
    /**
     * 状态
     */
    private Integer state;


    //////////////////// 冗余字段 ////////////////////
    /**
     * 仓库管理员姓名
     */
    @Transient
    private String adminName;
    /**
     * 仓库管理员电话
     */
    @Transient
    private String adminMobile;

    @Transient
    public String getAdminName() {
        return adminName;
    }

    @Transient
    public String getAdminMobile() {
        return adminMobile;
    }
}
