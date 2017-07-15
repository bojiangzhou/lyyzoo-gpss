package com.lyyzoo.gpss.entity.system;

import com.lyyzoo.data.entity.BaseEntity;
import com.lyyzoo.util.Dates;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.util.Date;

/**
 * 系统用户
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-01
 */
@Data
@Entity
@Table(name = "lz_sys_user")
public class User extends BaseEntity {

    /**
     * 锁定
     */
    public static interface IsLocked {
        /**
         * 未锁定
         */
        public static final int NO  = 0;
        /**
         * 已锁定
         */
        public static final int YES = 1;
    }

    /**
     * 用户账号
     */
    private String  account;
    /**
     * 用户密码
     */
    private String  password;
    /**
     * 用户角色Id
     */
    private Long    roleId;
    /**
     * 角色名称
     */
    private String  roleName;
    /**
     * 员工ID
     */
    private Long    employeeId;
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
     * 账号状态
     */
    private Integer state;
    /**
     * 是否锁定 <br/>
     * 0 未锁定 <br/>
     * 1 锁定 <br/>
     */
    private Integer isLocked;
    /**
     * 锁定时间
     */
    @DateTimeFormat(pattern = Dates.FORMAT_DATETIME)
    private Date    lockTime;

    //////////////////// 冗余字段 ////////////////////

    @Transient
    private String  employeeName;
    @Transient
    private String  employeeCode;


    @Transient
    public String getEmployeeName() {
        return employeeName;
    }
    @Transient
    public String getEmployeeCode() {
        return employeeCode;
    }
}
