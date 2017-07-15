package com.lyyzoo.gpss.dao.purchase;

import com.lyyzoo.data.dao.BaseDao;
import com.lyyzoo.data.domain.Page;
import com.lyyzoo.gpss.dto.PurchaseDto;
import com.lyyzoo.gpss.entity.purchase.PurchaseOrder;
import com.lyyzoo.util.Strings;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-06
 */
@Component
public class PurchaseOrderDao extends BaseDao<PurchaseOrder> {

    public Page<PurchaseOrder> page(String orderNumber, String goodsNameOrCode, String supplierName, Long repoId, String employeeNameOrCode, Integer checkState, String startDate, String endDate, Integer type, int pageNumber, int pageSize){
        StringBuilder sql = new StringBuilder("SELECT po.*, g.name AS goodsName, g.code AS goodsCode, g.unit AS goodsUnit, g.type AS goodsType, g.brand AS goodsBrand, r.name AS repoName, e.name AS employeeName, e.code AS employeeCode FROM lz_purchase_order po ");
        sql.append("LEFT JOIN lz_base_goods g ON po.goodsId=g.id ");
        sql.append("LEFT JOIN lz_base_repo r ON po.repoId=r.id ");
        sql.append("LEFT JOIN lz_base_employee e ON po.employeeId=e.id ");
        sql.append("WHERE po.state=1 ");

        Map<String, Object> params = new HashMap<>();
        if(Strings.isNotNullOrEmpty(orderNumber)){
            sql.append("AND po.orderNumber LIKE :orderNumber ");
            params.put("orderNumber", "%" + orderNumber + "%");
        }
        if(Strings.isNotNullOrEmpty(goodsNameOrCode)){
            sql.append("AND (g.name LIKE :goodsNameOrCode OR g.code LIKE :goodsNameOrCode) ");
            params.put("goodsNameOrCode", "%" + goodsNameOrCode + "%");
        }
        if(Strings.isNotNullOrEmpty(supplierName)){
            sql.append("AND po.supplierName LIKE :supplierName ");
            params.put("supplierName", "%" + supplierName + "%");
        }
        if(repoId != null){
            sql.append("AND po.repoId = :repoId ");
            params.put("repoId", repoId);
        }
        if(Strings.isNotNullOrEmpty(employeeNameOrCode)){
            sql.append("AND (e.name LIKE :employeeNameOrCode OR e.code LIKE :employeeNameOrCode) ");
            params.put("employeeNameOrCode", "%" + employeeNameOrCode + "%");
        }
        if(checkState != null){
            sql.append("AND po.checkState = :checkState ");
            params.put("checkState", checkState);
        }
        if(Strings.isNotNullOrEmpty(startDate)){
            sql.append("AND po.creatime >= :startDate ");
            params.put("startDate", startDate);
        }
        if(Strings.isNotNullOrEmpty(endDate)){
            sql.append("AND po.creatime < :endDate ");
            params.put("endDate", endDate);
        }
        if(type != null){
            sql.append("AND po.type = :type ");
            params.put("type", type);
        }
        sql.append(" ORDER BY po.id DESC");

        return pageBySql(sql.toString(), pageNumber, pageSize, params);
    }

    public List<PurchaseOrder> list(String orderNumber, String goodsNameOrCode, String supplierName, Long repoId, String employeeNameOrCode, Integer checkState, String startDate, String endDate, Integer type){
        StringBuilder sql = new StringBuilder("SELECT po.*, g.name AS goodsName, g.code AS goodsCode, g.unit AS goodsUnit, g.type AS goodsType, g.brand AS goodsBrand, r.name AS repoName, e.name AS employeeName, e.code AS employeeCode FROM lz_purchase_order po ");
        sql.append("LEFT JOIN lz_base_goods g ON po.goodsId=g.id ");
        sql.append("LEFT JOIN lz_base_repo r ON po.repoId=r.id ");
        sql.append("LEFT JOIN lz_base_employee e ON po.employeeId=e.id ");
        sql.append("WHERE po.state=1 ");

        Map<String, Object> params = new HashMap<>();
        if(Strings.isNotNullOrEmpty(orderNumber)){
            sql.append("AND po.orderNumber LIKE :orderNumber ");
            params.put("orderNumber", "%" + orderNumber + "%");
        }
        if(Strings.isNotNullOrEmpty(goodsNameOrCode)){
            sql.append("AND (g.name LIKE :goodsNameOrCode OR g.code LIKE :goodsNameOrCode) ");
            params.put("goodsNameOrCode", "%" + goodsNameOrCode + "%");
        }
        if(Strings.isNotNullOrEmpty(supplierName)){
            sql.append("AND po.supplierName LIKE :supplierName ");
            params.put("supplierName", "%" + supplierName + "%");
        }
        if(repoId != null){
            sql.append("AND po.repoId = :repoId ");
            params.put("repoId", repoId);
        }
        if(Strings.isNotNullOrEmpty(employeeNameOrCode)){
            sql.append("AND (e.name LIKE :employeeNameOrCode OR e.code LIKE :employeeNameOrCode) ");
            params.put("employeeNameOrCode", "%" + employeeNameOrCode + "%");
        }
        if(checkState != null){
            sql.append("AND po.checkState = :checkState ");
            params.put("checkState", checkState);
        }
        if(Strings.isNotNullOrEmpty(startDate)){
            sql.append("AND po.creatime >= :startDate ");
            params.put("startDate", startDate);
        }
        if(Strings.isNotNullOrEmpty(endDate)){
            sql.append("AND po.creatime < :endDate ");
            params.put("endDate", endDate);
        }
        if(type != null){
            sql.append("AND po.type = :type ");
            params.put("type", type);
        }
        sql.append(" ORDER BY po.id DESC");

        return findBySql(sql.toString(), params);
    }

    /**
     * 采购/退货统计
     *
     * @return
     */
    public List<PurchaseDto> count(String goodsNameOrCode, String employeeNameOrCode, String startDate, String endDate){
        StringBuilder sql = new StringBuilder("SELECT SUBSTR(po.creatime, 1, 7) AS month, SUM(IF(po.type=1,po.count,0)) AS totalCount, SUM(IF(po.type=1,po.totalPrice,0)) AS totalMoney , SUM(IF(po.type=2, po.count,0)) AS rejectTotalCount, SUM(IF(po.type=2,po.totalPrice,0)) AS rejectTotalMoney FROM lz_purchase_order po ");
        sql.append("LEFT JOIN lz_base_goods g ON po.goodsId=g.id ");
        sql.append("LEFT JOIN lz_base_employee e ON po.employeeId = e.id ");
        sql.append("WHERE po.checkState=3 ");

        Map<String, Object> params = new HashMap<>();
        if(Strings.isNotNullOrEmpty(goodsNameOrCode)){
            sql.append(" AND (g.name LIKE :goodsNameOrCode OR g.code LIKE :goodsNameOrCode) ");
            params.put("goodsNameOrCode", "%" + goodsNameOrCode + "%");
        }
        if(Strings.isNotNullOrEmpty(employeeNameOrCode)){
            sql.append(" AND (e.name LIKE :employeeNameOrCode OR e.code LIKE :employeeNameOrCode) ");
            params.put("employeeNameOrCode", "%" + employeeNameOrCode + "%");
        }
        if(Strings.isNotNullOrEmpty(startDate)){
            sql.append(" AND po.creatime >= :startDate ");
            params.put("startDate", startDate);
        }
        if(Strings.isNotNullOrEmpty(endDate)){
            sql.append(" AND po.creatime <= :endDate ");
            params.put("endDate", endDate);
        }
        sql.append(" GROUP BY SUBSTR(po.creatime, 1, 7)");

        return findBySql(sql.toString(), PurchaseDto.class, params);
    }

}
