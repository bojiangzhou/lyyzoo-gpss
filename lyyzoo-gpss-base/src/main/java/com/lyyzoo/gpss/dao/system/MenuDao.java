package com.lyyzoo.gpss.dao.system;

import com.lyyzoo.data.dao.BaseDao;
import com.lyyzoo.gpss.entity.system.Menu;
import com.lyyzoo.util.Strings;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-01
 */
@Component
public class MenuDao extends BaseDao<Menu> {

    public List<Menu> findByUpIdAndMenuIds(Long upId, String menuIds){
        String sql = "SELECT m.* FROM lz_sys_menu m WHERE state=1 ";
        Map<String, Object> params = new HashMap<>();
        if(upId != null){
            sql += " AND m.upId = :upId ";
            params.put("upId", upId);
        }
        if(Strings.isNotNullOrEmpty(menuIds)){
            sql += " AND m.id IN (" + menuIds + ")";
        }
        return findBySql(sql, params);
    }

}
