package com.lyyzoo.gpss.web.purchase;

import com.lyyzoo.bean.Result;
import com.lyyzoo.data.domain.Page;
import com.lyyzoo.gpss.dto.PurchaseDto;
import com.lyyzoo.gpss.entity.purchase.PurchaseOrder;
import com.lyyzoo.gpss.service.purchase.PurchaseOrderService;
import com.lyyzoo.gpss.web.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-06
 */
@Controller
@RequestMapping("/admin/purchase/order")
public class PurchaseOrderController extends BaseController {

    @Autowired
    private PurchaseOrderService purchaseOrderService;

    /**
     * 转到采购订单页面
     */
    @RequestMapping(value = {"", "/"})
    public String index(){
        return "/purchase/order";
    }

    /**
     * 分页查询
     */
    @RequestMapping("/page")
    @ResponseBody
    public Page<PurchaseOrder> page(String orderNumber, String goodsNameOrCode, String supplierName, Long repoId, String employeeNameOrCode, Integer checkState, String startDate, String endDate, Integer type, int pageNumber, int pageSize){
        return purchaseOrderService.page(orderNumber, goodsNameOrCode, supplierName, repoId, employeeNameOrCode, checkState, startDate, endDate, type, pageNumber, pageSize);
    }

    /**
     * 新增或修改订单
     */
    @RequestMapping(value = "/save", method = RequestMethod.POST)
    @ResponseBody
    public Result save(PurchaseOrder purchaseOrder){
        return purchaseOrderService.save(purchaseOrder, getCurrentUser());
    }

    /**
     * 删除订单
     */
    @RequestMapping("/remove")
    @ResponseBody
    public Result remove(Long id){
        return purchaseOrderService.remove(id, getCurrentUser());
    }

    /**
     * 提交审核
     */
    @RequestMapping("/submit/check")
    @ResponseBody
    public Result submitCheck(Long id){
        return purchaseOrderService.submitCheck(id, getCurrentUser());
    }

    /**
     * 转到审核页面
     */
    @RequestMapping("/check/index")
    public String checkIndex(){
        return "/purchase/orderCheck";
    }

    /**
     * 审核
     */
    @RequestMapping("/check")
    @ResponseBody
    public Result check(Long id, Integer isPass, String checkResult){
        return purchaseOrderService.check(id, isPass, checkResult, getCurrentUser());
    }

    /**
     * 导出
     */
    @RequestMapping("/export")
    public void export(String orderNumber, String goodsNameOrCode, String supplierName, Long repoId, String employeeNameOrCode, Integer checkState, String startDate, String endDate, Integer type, HttpServletResponse response){
        purchaseOrderService.export(orderNumber, goodsNameOrCode, supplierName, repoId, employeeNameOrCode, checkState, startDate, endDate, type, response);
    }

    /**
     * 转到统计页面
     * @return
     */
    @RequestMapping("/count/index")
    public String countIndex(){
        return "/purchase/count";
    }

    /**
     * 统计
     */
    @RequestMapping("/count")
    @ResponseBody
    public List<PurchaseDto> count(String goodsNameOrCode, String employeeNameOrCode, String startDate, String endDate){
        return purchaseOrderService.count(goodsNameOrCode, employeeNameOrCode, startDate, endDate);
    }

}
