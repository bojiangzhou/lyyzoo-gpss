package com.lyyzoo.gpss.dao.base;

import com.lyyzoo.data.dao.BaseDao;
import com.lyyzoo.data.domain.Page;
import com.lyyzoo.gpss.entity.base.Goods;
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
public class GoodsDao extends BaseDao<Goods> {

    /**
     * 基础SQL，不查询图片的base64
     */
    private static final String BASE_SQL = "SELECT g.id, g.name, g.code, g.type, g.brand, g.unit, g.color, g.standard, g.material, g.buyPrice, g.salePrice, g.descs, g.updater, g.updatime, g.state FROM lz_base_goods g ";

    public Page<Goods> page(String name, String code, String type, String brand, String color, String standard, String material, int pageNumber, int pageSize){
        StringBuilder sql = new StringBuilder(BASE_SQL + " WHERE g.state=1 ");
        Map<String, Object> params = new HashMap<>();
        if(Strings.isNotNullOrEmpty(name)){
            sql.append("AND g.name LIKE :name ");
            params.put("name", "%" + name + "%");
        }
        if(Strings.isNotNullOrEmpty(code)){
            sql.append("AND g.code LIKE :code ");
            params.put("code", "%" + code + "%");
        }
        if(Strings.isNotNullOrEmpty(type)){
            sql.append("AND g.type = :type ");
            params.put("type", type);
        }
        if(Strings.isNotNullOrEmpty(brand)){
            sql.append("AND g.brand = :brand ");
            params.put("brand", brand);
        }
        if(Strings.isNotNullOrEmpty(color)){
            sql.append("AND g.color = :color ");
            params.put("color", color);
        }
        if(Strings.isNotNullOrEmpty(standard)){
            sql.append("AND g.standard = :standard ");
            params.put("standard", standard);
        }
        if(Strings.isNotNullOrEmpty(material)){
            sql.append("AND g.material = :material ");
            params.put("material", material);
        }

        return pageBySql(sql.toString(), pageNumber, pageSize, params);
    }

}
