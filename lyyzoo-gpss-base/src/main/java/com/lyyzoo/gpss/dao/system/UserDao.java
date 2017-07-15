package com.lyyzoo.gpss.dao.system;

import com.lyyzoo.data.dao.BaseDao;
import com.lyyzoo.data.domain.Page;
import com.lyyzoo.gpss.entity.system.User;
import com.lyyzoo.util.Strings;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-01
 */
@Component
public class UserDao extends BaseDao<User> {

    public Page<User> page(String account, Long roleId, Integer isLocked, int pageNumber, int pageSize) {
        StringBuilder sql = new StringBuilder("SELECT u.*, e.id AS employeeId, e.name AS employeeName, e.code AS employeeCode FROM lz_sys_user u LEFT JOIN lz_base_employee e ON u.employeeId = e.id WHERE u.state=1 ");
        Map<String, Object> params = new HashMap<>();
        if(Strings.isNotNullOrEmpty(account)){
            sql.append(" AND u.account LIKE :account ");
            params.put("account", "%" + account + "%");
        }
        if(roleId != null){
            sql.append(" AND u.roleId = :roleId ");
            params.put("roleId", roleId);
        }
        if(isLocked != null){
            sql.append(" AND u.isLocked = :isLocked ");
            params.put("isLocked", isLocked);
        }

        return pageBySql(sql.toString(), pageNumber, pageSize, params);
    }
}
