package com.lyyzoo.gpss.dao.base;

import com.lyyzoo.data.dao.BaseDao;
import com.lyyzoo.data.domain.Page;
import com.lyyzoo.gpss.entity.base.Employee;
import com.lyyzoo.util.Strings;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-05
 */
@Component
public class EmployeeDao extends BaseDao<Employee> {

    public Page<Employee> page(String name, String type, int pageNumber, int pageSize) {
        StringBuilder sql = new StringBuilder("SELECT e.* FROM lz_base_employee e WHERE e.state=1 ");
        Map<String, Object> params = new HashMap<>();
        if(Strings.isNotNullOrEmpty(name)){
            sql.append(" AND e.name LIKE :name ");
            params.put("name", "%" + name + "%");
        }
        if(type != null){
            sql.append(" AND e.type = :type ");
            params.put("type", type);
        }

        return pageBySql(sql.toString(), pageNumber, pageSize, params);
    }

}
