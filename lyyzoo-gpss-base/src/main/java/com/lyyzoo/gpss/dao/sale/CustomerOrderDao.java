package com.lyyzoo.gpss.dao.sale;

import com.lyyzoo.data.dao.BaseDao;
import com.lyyzoo.data.domain.Page;
import com.lyyzoo.gpss.dto.SaleDto;
import com.lyyzoo.gpss.entity.sale.CustomerOrder;
import com.lyyzoo.util.Strings;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-09
 */
@Component
public class CustomerOrderDao extends BaseDao<CustomerOrder> {

    public Page<CustomerOrder> page(String orderNumber, String goodsNameOrCode, String customerName, Long repoId, String employeeNameOrCode, Integer checkState, String startDate, String endDate, Integer type, int pageNumber, int pageSize){
        StringBuilder sql = new StringBuilder("SELECT so.*, g.name AS goodsName, g.code AS goodsCode, g.unit AS goodsUnit, g.type AS goodsType, g.brand AS goodsBrand, r.name AS repoName, e.name AS employeeName, e.code AS employeeCode FROM lz_sale_order so ");
        sql.append("LEFT JOIN lz_base_goods g ON so.goodsId=g.id ");
        sql.append("LEFT JOIN lz_base_repo r ON so.repoId=r.id ");
        sql.append("LEFT JOIN lz_base_employee e ON so.employeeId=e.id ");
        sql.append("WHERE so.state=1 ");

        Map<String, Object> params = new HashMap<>();
        if(Strings.isNotNullOrEmpty(orderNumber)){
            sql.append("AND so.orderNumber LIKE :orderNumber ");
            params.put("orderNumber", "%" + orderNumber + "%");
        }
        if(Strings.isNotNullOrEmpty(goodsNameOrCode)){
            sql.append("AND (g.name LIKE :goodsNameOrCode OR g.code LIKE :goodsNameOrCode) ");
            params.put("goodsNameOrCode", "%" + goodsNameOrCode + "%");
        }
        if(Strings.isNotNullOrEmpty(customerName)){
            sql.append("AND so.customerName LIKE :customerName ");
            params.put("customerName", "%" + customerName + "%");
        }
        if(repoId != null){
            sql.append("AND so.repoId = :repoId ");
            params.put("repoId", repoId);
        }
        if(Strings.isNotNullOrEmpty(employeeNameOrCode)){
            sql.append("AND (e.name LIKE :employeeNameOrCode OR e.code LIKE :employeeNameOrCode) ");
            params.put("employeeNameOrCode", "%" + employeeNameOrCode + "%");
        }
        if(checkState != null){
            sql.append("AND so.checkState = :checkState ");
            params.put("checkState", checkState);
        }
        if(Strings.isNotNullOrEmpty(startDate)){
            sql.append("AND so.creatime >= :startDate ");
            params.put("startDate", startDate);
        }
        if(Strings.isNotNullOrEmpty(endDate)){
            sql.append("AND so.creatime < :endDate ");
            params.put("endDate", endDate);
        }
        if(type != null){
            sql.append("AND so.type = :type ");
            params.put("type", type);
        }
        sql.append(" ORDER BY so.id DESC");

        return pageBySql(sql.toString(), pageNumber, pageSize, params);
    }

    public List<CustomerOrder> list(String orderNumber, String goodsNameOrCode, String customerName, Long repoId, String employeeNameOrCode, Integer checkState, String startDate, String endDate, Integer type){
        StringBuilder sql = new StringBuilder("SELECT so.*, g.name AS goodsName, g.code AS goodsCode, g.unit AS goodsUnit, g.type AS goodsType, g.brand AS goodsBrand, r.name AS repoName, e.name AS employeeName, e.code AS employeeCode FROM lz_sale_order so ");
        sql.append("LEFT JOIN lz_base_goods g ON so.goodsId=g.id ");
        sql.append("LEFT JOIN lz_base_repo r ON so.repoId=r.id ");
        sql.append("LEFT JOIN lz_base_employee e ON so.employeeId=e.id ");
        sql.append("WHERE so.state=1 ");

        Map<String, Object> params = new HashMap<>();
        if(Strings.isNotNullOrEmpty(orderNumber)){
            sql.append("AND so.orderNumber LIKE :orderNumber ");
            params.put("orderNumber", "%" + orderNumber + "%");
        }
        if(Strings.isNotNullOrEmpty(goodsNameOrCode)){
            sql.append("AND (g.name LIKE :goodsNameOrCode OR g.code LIKE :goodsNameOrCode) ");
            params.put("goodsNameOrCode", "%" + goodsNameOrCode + "%");
        }
        if(Strings.isNotNullOrEmpty(customerName)){
            sql.append("AND so.customerName LIKE :customerName ");
            params.put("customerName", "%" + customerName + "%");
        }
        if(repoId != null){
            sql.append("AND so.repoId = :repoId ");
            params.put("repoId", repoId);
        }
        if(Strings.isNotNullOrEmpty(employeeNameOrCode)){
            sql.append("AND (e.name LIKE :employeeNameOrCode OR e.code LIKE :employeeNameOrCode) ");
            params.put("employeeNameOrCode", "%" + employeeNameOrCode + "%");
        }
        if(checkState != null){
            sql.append("AND so.checkState = :checkState ");
            params.put("checkState", checkState);
        }
        if(Strings.isNotNullOrEmpty(startDate)){
            sql.append("AND so.creatime >= :startDate ");
            params.put("startDate", startDate);
        }
        if(Strings.isNotNullOrEmpty(endDate)){
            sql.append("AND so.creatime < :endDate ");
            params.put("endDate", endDate);
        }
        if(type != null){
            sql.append("AND so.type = :type ");
            params.put("type", type);
        }
        sql.append(" ORDER BY so.id DESC");

        return findBySql(sql.toString(), params);
    }

    /**
     * 采购/退货统计
     *
     * @return
     */
    public List<SaleDto> count(String goodsNameOrCode, String employeeNameOrCode, String startDate, String endDate){
        StringBuilder sql = new StringBuilder("SELECT SUBSTR(so.creatime, 1, 7) AS month, SUM(IF(so.type=1, so.count,0)) AS totalCount, SUM(IF(so.type=1,so.totalPrice,0)) AS totalMoney , SUM(IF(so.type=2, so.count,0)) AS rejectTotalCount, SUM(IF(so.type=2,so.totalPrice,0)) AS rejectTotalMoney FROM lz_sale_order so ");
        sql.append("LEFT JOIN lz_base_goods g ON so.goodsId=g.id ");
        sql.append("LEFT JOIN lz_base_employee e ON so.employeeId = e.id ");
        sql.append("WHERE so.checkState=3 ");

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
            sql.append(" AND so.creatime >= :startDate ");
            params.put("startDate", startDate);
        }
        if(Strings.isNotNullOrEmpty(endDate)){
            sql.append(" AND so.creatime <= :endDate ");
            params.put("endDate", endDate);
        }
        sql.append(" GROUP BY SUBSTR(so.creatime, 1, 7)");

        return findBySql(sql.toString(), SaleDto.class, params);
    }

}
