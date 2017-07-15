package com.lyyzoo.gpss.service.sale;

import java.io.IOException;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import com.lyyzoo.gpss.dto.SaleDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lyyzoo.bean.Result;
import com.lyyzoo.data.domain.Page;
import com.lyyzoo.gpss.Applications;
import com.lyyzoo.gpss.dao.sale.CustomerOrderDao;
import com.lyyzoo.gpss.dto.PurchaseDto;
import com.lyyzoo.gpss.entity.sale.CustomerOrder;
import com.lyyzoo.gpss.entity.system.User;
import com.lyyzoo.gpss.service.stock.StockService;
import com.lyyzoo.gpss.util.ExcelTool;
import com.lyyzoo.service.BaseService;
import com.lyyzoo.util.Dates;
import com.lyyzoo.util.Results;
import com.lyyzoo.util.Strings;

/**
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-09
 */
@Service
public class CustomerOrderService extends BaseService<CustomerOrder> {

    @Autowired
    private CustomerOrderDao customerOrderDao;
    @Autowired
    private StockService stockService;

    public Page<CustomerOrder> page(String orderNumber, String goodsNameOrCode, String customerName, Long repoId, String employeeNameOrCode, Integer checkState, String startDate, String endDate, Integer type, int pageNumber, int pageSize){
        if(Strings.isNotNullOrEmpty(startDate)){
            startDate = Dates.toStringWithDateFormatDateTime(Dates.getStartOfTheDate(Dates.newDate(startDate)));
        }
        if(Strings.isNotNullOrEmpty(endDate)){
            endDate = Dates.toStringWithDateFormatDateTime(Dates.getEndOfTheDate(Dates.newDate(endDate)));
        }
        type = type == null ? 1 : type;
        return customerOrderDao.page(orderNumber, goodsNameOrCode, customerName, repoId ,employeeNameOrCode, checkState, startDate, endDate, type, pageNumber, pageSize);
    }

    /**
     * 保存或修改 审核通过不能再修改
     */
    public Result save(CustomerOrder customerOrder, User currentUser){
        if(customerOrder.getId() == null){
            String prefix = customerOrder.getType() == CustomerOrder.Type.SALE ? Applications.Order.SALE : Applications.Order.SALE_REJECT;
            //使用时间戳当订单号
            String orderNumber = prefix + Dates.newDateString(Dates.FORMAT_NONE);

            customerOrder.setOrderNumber(orderNumber);
            customerOrder.setCreater(currentUser.getAccount());
            customerOrder.setCreatime(new Date());
            customerOrder.setUpdater(currentUser.getAccount());
            customerOrder.setUpdatime(new Date());
            customerOrder.setCheckState(Applications.Check.INPUT);
            customerOrder.setState(Applications.Flag.YES);

            this.save(customerOrder);
        } else{
            CustomerOrder toSave = get(customerOrder.getId());

            if(toSave.getCheckState() == Applications.Check.PASS){
                return Results.failure("审核通过的订单不能修改");
            }

            toSave.setGoodsId(customerOrder.getGoodsId());
            toSave.setCustomerId(customerOrder.getCustomerId());
            toSave.setCustomerName(customerOrder.getCustomerName());
            toSave.setRepoId(customerOrder.getRepoId());
            toSave.setCount(customerOrder.getCount());
            toSave.setUnitPrice(customerOrder.getUnitPrice());
            toSave.setTotalPrice(customerOrder.getTotalPrice());
            toSave.setEmployeeId(customerOrder.getEmployeeId());
            toSave.setDescs(customerOrder.getDescs());
            toSave.setUpdater(currentUser.getAccount());
            toSave.setUpdatime(new Date());

            this.update(toSave);
        }

        return Results.success();
    }

    public Result remove(Long id, User currentUser) {
        CustomerOrder toRemove = get(id);
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
        CustomerOrder order = get(id);
        order.setUpdater(currentUser.getAccount());
        order.setUpdatime(new Date());
        order.setCheckState(Applications.Check.WAIT);

        this.update(order);

        return Results.success();
    }

    /**
     * 销售审核出库 退货审核入库
     */
    public Result check(Long id, Integer isPass, String checkResult, User currentUser){
        Result result = Results.success();
        CustomerOrder order = get(id);
        if(order.getCheckState() == Applications.Check.INPUT){
            return Results.failure("该订单还未提交审核");
        }
        order.setCheckAccount(currentUser.getAccount());
        order.setCheckResult(checkResult);
        order.setChecktime(new Date());
        order.setUpdater(currentUser.getAccount());
        order.setUpdatime(new Date());
        if(isPass == Applications.Flag.YES){

            if(order.getType() == CustomerOrder.Type.SALE){
                //销售出库
                result = stockService.reduce(order.getGoodsId(), order.getRepoId(), order.getCount());
            } else if(order.getType() == CustomerOrder.Type.SALE_REJECT){
                //销售退货入库
                result = stockService.add(order.getGoodsId(), order.getRepoId(), order.getCount(), null);
            }

            if(result.isSuccess()){
                //审核通过
                order.setCheckState(Applications.Check.PASS);
                order.setTaketime(new Date());
            }
        } else{
            //审核未通过
            order.setCheckState(Applications.Check.FAIL);
        }

        return result;
    }

    /**
     * 导出
     */
    public void export(String orderNumber, String goodsNameOrCode, String customerName, Long repoId, String employeeNameOrCode, Integer checkState, String startDate, String endDate, Integer type, HttpServletResponse response){
        if(Strings.isNotNullOrEmpty(startDate)){
            startDate = Dates.toStringWithDateFormatDateTime(Dates.getStartOfTheDate(Dates.newDate(startDate)));
        }
        if(Strings.isNotNullOrEmpty(endDate)){
            endDate = Dates.toStringWithDateFormatDateTime(Dates.getEndOfTheDate(Dates.newDate(endDate)));
        }
        type = type == null ? 1 : type;
        try {

            //根据条件查询所有
            List<CustomerOrder> list = customerOrderDao.list(orderNumber, goodsNameOrCode, customerName, repoId,employeeNameOrCode, checkState, startDate, endDate, type);
            //设置文件名
            String fileName = type == 1 ? "销售订单.xls" : "客户退货订单.xls";
            String repoHeader = type == 1 ? "出库仓库" : "入库仓库";
            response.setCharacterEncoding("UTF-8");
            //定义输出类型
            response.setContentType("application/msexcel;charset=utf-8");
            //设定输出文件头
            //response.setHeader("Content-Disposition", "attachment; filename="+ URLEncoder.encode(fileName, "UTF-8"));
            response.addHeader("Content-Disposition", "attachment;filename=\"" + new String(fileName.getBytes("GB2312"), "ISO8859-1") + "\"");

            String[] headers = new String[]{"商品名称","商品编号","计量单位","商品类别","商品品牌","客户名称",repoHeader,"单号","数量","单价","总价","经办员工","员工编号","备注","审核状态","审核结果","审核人","审核时间","入库日期","创建时间"};
            String[] properties = new String[]{"goodsName","goodsCode","goodsUnit","goodsType","goodsBrand","customerName","repoName","orderNumber","count","unitPrice","totalPrice","employeeName","employeeCode","descs","checkStateStr","checkResult","checkAccount","checktime","taketime","creatime"};
            ExcelTool<CustomerOrder> excelTool = new ExcelTool<>();

            //导出
            excelTool.exportExcel(headers, properties, list, response.getOutputStream());

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 统计销售和销售退货的情况
     * @return
     */
    public List<SaleDto> count(String goodsNameOrCode, String employeeNameOrCode, String startDate, String endDate){
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

        return customerOrderDao.count(goodsNameOrCode, employeeNameOrCode, startDate, endDate);
    }

}
