package com.lyyzoo.gpss.dao.base;

import com.lyyzoo.util.Strings;
import org.springframework.stereotype.Component;

import com.lyyzoo.data.dao.BaseDao;
import com.lyyzoo.data.domain.Page;
import com.lyyzoo.gpss.entity.base.Repo;

/**
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-05
 */
@Component
public class RepoDao extends BaseDao<Repo> {

    public Page<Repo> page(String name, int pageNumber, int pageSize){
        String sql = "SELECT r.*, e.id AS adminId, e.name AS adminName, e.mobile AS adminMobile FROM lz_base_repo r LEFT JOIN lz_base_employee e ON r.adminId=e.id WHERE r.state=1 ";
        if(Strings.isNotNullOrEmpty(name)){
            sql += " AND r.name LIKE '%" + name + "%'";
        }
        return pageBySql(sql, pageNumber, pageSize);
    }

}
