package com.lyyzoo.gpss.dao.stock;

import com.lyyzoo.data.dao.BaseDao;
import com.lyyzoo.data.domain.Page;
import com.lyyzoo.gpss.entity.stock.Stock;
import com.lyyzoo.util.Strings;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-08
 */
@Component
public class StockDao extends BaseDao<Stock> {

    public Page<Stock> page(String goodsNameOrCode, String goodsType, Long repoId, int pageNumber, int pageSize){
        StringBuilder sql = new StringBuilder("SELECT s.*, g.name AS goodsName, g.code AS goodsCode, g.type AS goodsType, g.unit AS goodsUnit, g.color AS goodsColor, g.standard AS goodsStandard, r.name AS repoName FROM lz_stock s ");
        sql.append("LEFT JOIN lz_base_goods g ON s.goodsId=g.id ");
        sql.append("LEFT JOIN lz_base_repo r ON s.repoId=r.id ");
        sql.append("WHERE s.state=1 ");

        Map<String, Object> params = new HashMap<>();
        if(Strings.isNotNullOrEmpty(goodsNameOrCode)){
            sql.append("AND (g.name LIKE :goodsNameOrCode OR g.code LIKE :goodsNameOrCode) ");
            params.put("goodsNameOrCode", "%" + goodsNameOrCode + "%");
        }
        if(Strings.isNotNullOrEmpty(goodsType)){
            sql.append("AND g.type = :goodsType ");
            params.put("goodsType", goodsType);
        }
        if(repoId != null){
            sql.append("AND s.repoId= :repoId ");
            params.put("repoId", repoId);
        }

        return pageBySql(sql.toString(), pageNumber, pageSize, params);
    }

    /**
     * 统计库存
     */
    public List<Stock> count(String goodsType, Long repoId){
        StringBuilder sql = new StringBuilder("SELECT (SELECT COUNT(DISTINCT goodsId) FROM lz_stock) AS totalGoodsCount, SUM(s.totalCount) AS totalRepoCount, SUM(s.saleCount) AS totalSaleCount, SUM(s.totalBuyPrice) AS totalRepoBuyPrice, SUM(s.totalSalePrice) AS totalRepoSalePrice FROM lz_stock s ");
        sql.append("LEFT JOIN lz_base_goods g ON s.goodsId=g.id ");
        sql.append("WHERE s.state=1 ");

        Map<String, Object> params = new HashMap<>();
        if(Strings.isNotNullOrEmpty(goodsType)){
            sql.append("AND g.type = :goodsType ");
            params.put("goodsType", goodsType);
        }
        if(repoId != null){
            sql.append("AND s.repoId= :repoId ");
            params.put("repoId", repoId);
        }

        return findBySql(sql.toString(), params);
    }

    public List<Stock> findByGoodsIdAndCount(Long goodsId) {
        String sql = "SELECT * FROM lz_stock WHERE state=1 AND goodsId="+goodsId;

        return findBySql(sql);
    }
}
