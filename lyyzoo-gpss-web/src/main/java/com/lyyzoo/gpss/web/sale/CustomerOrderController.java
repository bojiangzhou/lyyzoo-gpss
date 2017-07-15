package com.lyyzoo.gpss.web.sale;

import com.lyyzoo.bean.Result;
import com.lyyzoo.data.domain.Page;
import com.lyyzoo.gpss.dto.SaleDto;
import com.lyyzoo.gpss.entity.sale.CustomerOrder;
import com.lyyzoo.gpss.service.sale.CustomerOrderService;
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
 * @date 2017-04-09
 */
@Controller
@RequestMapping("/admin/sale/order")
public class CustomerOrderController extends BaseController {

    @Autowired
    private CustomerOrderService customerOrderService;

    @RequestMapping(value = {"", "/"})
    public String index(){
        return "/sale/order";
    }

    @RequestMapping("/page")
    @ResponseBody
    public Page<CustomerOrder> page(String orderNumber, String goodsNameOrCode, String customerName, Long repoId, String employeeNameOrCode, Integer checkState, String startDate, String endDate, Integer type, int pageNumber, int pageSize){
        return customerOrderService.page(orderNumber, goodsNameOrCode, customerName, repoId, employeeNameOrCode, checkState, startDate, endDate, type, pageNumber, pageSize);
    }

    @RequestMapping(value = "/save", method = RequestMethod.POST)
    @ResponseBody
    public Result save(CustomerOrder customerOrder){
        return customerOrderService.save(customerOrder, getCurrentUser());
    }

    @RequestMapping("/remove")
    @ResponseBody
    public Result remove(Long id){
        return customerOrderService.remove(id, getCurrentUser());
    }

    /**
     * 提交审核
     */
    @RequestMapping("/submit/check")
    @ResponseBody
    public Result submitCheck(Long id){
        return customerOrderService.submitCheck(id, getCurrentUser());
    }

    /**
     * 转到审核页面
     */
    @RequestMapping("/check/index")
    public String checkIndex(){
        return "/sale/orderCheck";
    }

    /**
     * 审核
     */
    @RequestMapping("/check")
    @ResponseBody
    public Result check(Long id, Integer isPass, String checkResult){
        return customerOrderService.check(id, isPass, checkResult, getCurrentUser());
    }

    @RequestMapping("/export")
    public void export(String orderNumber, String goodsNameOrCode, String customerName, Long repoId, String employeeNameOrCode, Integer checkState, String startDate, String endDate, Integer type, HttpServletResponse response){
        customerOrderService.export(orderNumber, goodsNameOrCode, customerName, repoId, employeeNameOrCode, checkState, startDate, endDate, type, response);
    }

    @RequestMapping("/count/index")
    public String countIndex(){
        return "/sale/count";
    }

    @RequestMapping("/count")
    @ResponseBody
    public List<SaleDto> count(String goodsNameOrCode, String employeeNameOrCode, String startDate, String endDate){
        return customerOrderService.count(goodsNameOrCode, employeeNameOrCode, startDate, endDate);
    }


}
