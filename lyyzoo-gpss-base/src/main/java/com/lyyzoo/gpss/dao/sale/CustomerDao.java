package com.lyyzoo.gpss.dao.sale;

import com.lyyzoo.data.dao.BaseDao;
import com.lyyzoo.data.domain.Page;
import com.lyyzoo.gpss.entity.sale.Customer;
import com.lyyzoo.util.Strings;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-06
 */
@Component
public class CustomerDao extends BaseDao<Customer> {

    public Page<Customer> page(String name, int pageNumber, int pageSize){
        String sql = "SELECT c.* FROM lz_sale_customer c WHERE c.state=1 ";
        Map<String, Object> params = new HashMap<>();
        if(Strings.isNotNullOrEmpty(name)){
            sql += "AND c.name LIKE :name ";
            params.put("name", "%" + name + "%");
        }
        return pageBySql(sql, pageNumber, pageSize, params);
    }

}
