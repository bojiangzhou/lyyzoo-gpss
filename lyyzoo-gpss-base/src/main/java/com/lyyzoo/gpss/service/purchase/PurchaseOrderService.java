package com.lyyzoo.gpss.service.purchase;

import com.lyyzoo.bean.Result;
import com.lyyzoo.data.domain.Page;
import com.lyyzoo.gpss.Applications;
import com.lyyzoo.gpss.dao.purchase.PurchaseOrderDao;
import com.lyyzoo.gpss.dto.PurchaseDto;
import com.lyyzoo.gpss.entity.purchase.PurchaseOrder;
import com.lyyzoo.gpss.entity.system.User;
import com.lyyzoo.gpss.service.stock.StockService;
import com.lyyzoo.gpss.util.ExcelTool;
import com.lyyzoo.service.BaseService;
import com.lyyzoo.util.Dates;
import com.lyyzoo.util.Results;
import com.lyyzoo.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;
import java.util.List;

/**
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-06
 */
@Service
public class PurchaseOrderService extends BaseService<PurchaseOrder> {

    @Autowired
    private PurchaseOrderDao purchaseOrderDao;
    @Autowired
    private StockService stockService;

    /**
     * 分页查询
     */
    public Page<PurchaseOrder> page(String orderNumber, String goodsNameOrCode, String supplierName, Long repoId, String employeeNameOrCode, Integer checkState, String startDate, String endDate, Integer type, int pageNumber, int pageSize){
        if(Strings.isNotNullOrEmpty(startDate)){
            startDate = Dates.toStringWithDateFormatDateTime(Dates.getStartOfTheDate(Dates.newDate(startDate)));
        }
        if(Strings.isNotNullOrEmpty(endDate)){
            endDate = Dates.toStringWithDateFormatDateTime(Dates.getEndOfTheDate(Dates.newDate(endDate)));
        }
        type = type == null ? 1 : type;
        return purchaseOrderDao.page(orderNumber, goodsNameOrCode, supplierName, repoId ,employeeNameOrCode, checkState, startDate, endDate, type, pageNumber, pageSize);
    }

    /**
     * 保存或修改 审核通过不能再修改
     */
    public Result save(PurchaseOrder purchaseOrder, User currentUser){
        if(purchaseOrder.getId() == null){
            String prefix = purchaseOrder.getType() == PurchaseOrder.Type.BUY ? Applications.Order.PURCHASE : Applications.Order.PURCHASE_REJECT;
            //使用时间戳当订单号
            String orderNumber = prefix + Dates.newDateString(Dates.FORMAT_NONE);

            purchaseOrder.setOrderNumber(orderNumber);
            purchaseOrder.setCreater(currentUser.getAccount());
            purchaseOrder.setCreatime(new Date());
            purchaseOrder.setUpdater(currentUser.getAccount());
            purchaseOrder.setUpdatime(new Date());
            purchaseOrder.setCheckState(Applications.Check.INPUT);
            purchaseOrder.setState(Applications.Flag.YES);

            this.save(purchaseOrder);
        } else{
            PurchaseOrder toSave = get(purchaseOrder.getId());

            if(toSave.getCheckState() == Applications.Check.PASS){
                return Results.failure("审核通过的订单不能修改");
            }

            toSave.setGoodsId(purchaseOrder.getGoodsId());
            toSave.setSupplierId(purchaseOrder.getSupplierId());
            toSave.setSupplierName(purchaseOrder.getSupplierName());
            toSave.setRepoId(purchaseOrder.getRepoId());
            toSave.setCount(purchaseOrder.getCount());
            toSave.setUnitPrice(purchaseOrder.getUnitPrice());
            toSave.setTotalPrice(purchaseOrder.getTotalPrice());
            toSave.setEmployeeId(purchaseOrder.getEmployeeId());
            toSave.setDescs(purchaseOrder.getDescs());
            toSave.setUpdater(currentUser.getAccount());
            toSave.setUpdatime(new Date());

            this.update(toSave);
        }

        return Results.success();
    }

    /**
     * 所有的删除都是逻辑删除，即改变state=0表示删除
     */
    public Result remove(Long id, User currentUser) {
        PurchaseOrder toRemove = get(id);
        if(toRemove.getCheckState() == Applications.Check.PASS){
            return Results.failure("审核通过的订单不能删除");
        }
        toRemove.setUpdater(currentUser.getAccount());
        toRemove.setUpdatime(new Date());
        toRemove.setState(Applications.Flag.NO);

        this.update(toRemove);

        return Results.success();
    }

    /**
     * 提交订单审核
     */
    public Result submitCheck(Long id, User currentUser) {
        PurchaseOrder order = get(id);
        order.setUpdater(currentUser.getAccount());
        order.setUpdatime(new Date());
        order.setCheckState(Applications.Check.WAIT);

        this.update(order);

        return Results.success();
    }

    /**
     * 进货审核入库 退货审核出库
     */
    public Result check(Long id, Integer isPass, String checkResult, User currentUser){
        PurchaseOrder order = get(id);
        if(order.getCheckState() == Applications.Check.INPUT){
            return Results.failure("该订单还未提交审核");
        }
        order.setCheckAccount(currentUser.getAccount());
        order.setCheckResult(checkResult);
        order.setChecktime(new Date());
        order.setUpdater(currentUser.getAccount());
        order.setUpdatime(new Date());
        if(isPass == Applications.Flag.YES){
            //审核通过
            order.setCheckState(Applications.Check.PASS);
            order.setTaketime(new Date());

            if(order.getType() == PurchaseOrder.Type.BUY){
                //采购入库
                return stockService.add(order.getGoodsId(), order.getRepoId(), order.getCount(), order.getUnitPrice());
            } else if(order.getType() == PurchaseOrder.Type.BUY_REJECT){
                //采购退货出库
                return stockService.reduce(order.getGoodsId(), order.getRepoId(), order.getCount());
            }
        } else{
            //审核未通过
            order.setCheckState(Applications.Check.FAIL);
        }
        return Results.success();
    }

    /**
     * 导出
     */
    public void export(String orderNumber, String goodsNameOrCode, String supplierName, Long repoId, String employeeNameOrCode, Integer checkState, String startDate, String endDate, Integer type, HttpServletResponse response){
        if(Strings.isNotNullOrEmpty(startDate)){
            startDate = Dates.toStringWithDateFormatDateTime(Dates.getStartOfTheDate(Dates.newDate(startDate)));
        }
        if(Strings.isNotNullOrEmpty(endDate)){
            endDate = Dates.toStringWithDateFormatDateTime(Dates.getEndOfTheDate(Dates.newDate(endDate)));
        }
        type = type == null ? 1 : type;
        try {

            //根据条件查询所有
            List<PurchaseOrder> list = purchaseOrderDao.list(orderNumber, goodsNameOrCode, supplierName, repoId,employeeNameOrCode, checkState, startDate, endDate, type);
            //设置文件名
            String fileName = type == 1 ? "采购订单.xls" : "退货订单.xls";
            String repoHeader = type == 1 ? "入库仓库" : "出库仓库";
            response.setCharacterEncoding("UTF-8");
            //定义输出类型
            response.setContentType("application/msexcel;charset=utf-8");
            //设定输出文件头
            //response.setHeader("Content-Disposition", "attachment; filename="+ URLEncoder.encode(fileName, "UTF-8"));
            response.addHeader("Content-Disposition", "attachment;filename=\"" + new String(fileName.getBytes("GB2312"), "ISO8859-1") + "\"");

            String[] headers = new String[]{"商品名称","商品编号","计量单位","商品类别","商品品牌","供应商",repoHeader,"单号","数量","单价","总价","经办员工","员工编号","备注","审核状态","审核结果","审核人","审核时间","入库日期","创建时间"};
            String[] properties = new String[]{"goodsName","goodsCode","goodsUnit","goodsType","goodsBrand","supplierName","repoName","orderNumber","count","unitPrice","totalPrice","employeeName","employeeCode","descs","checkStateStr","checkResult","checkAccount","checktime","taketime","creatime"};
            ExcelTool<PurchaseOrder> excelTool = new ExcelTool<>();

            //导出
            excelTool.exportExcel(headers, properties, list, response.getOutputStream());

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 统计采购和采购退货的情况
     * @return
     */
    public List<PurchaseDto> count(String goodsNameOrCode, String employeeNameOrCode, String startDate, String endDate){
        if(Strings.isNullOrEmpty(endDate)){
            endDate = Dates.toStringWithDateFormatDateTime(new Date());
        } else{
            endDate = Dates.toStringWithDateFormatDateTime(Dates.getEndOfTheDate(Dates.newDate(endDate)));
        }
        //默认统计一年
        if(Strings.isNullOrEmpty(startDate)){
            startDate = Dates.toStringWithDateFormatDateTime(Dates.addMonth(Dates.newDate(endDate), -12));
        } else{
            startDate = Dates.toStringWithDateFormatDateTime(Dates.getStartOfTheDate(Dates.newDate(startDate)));
        }

        //采购统计

        return purchaseOrderDao.count(goodsNameOrCode, employeeNameOrCode, startDate, endDate);
    }

}
