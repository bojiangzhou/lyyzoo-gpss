package com.lyyzoo.gpss.web.sale;

import com.lyyzoo.bean.Result;
import com.lyyzoo.data.domain.Page;
import com.lyyzoo.gpss.entity.sale.Customer;
import com.lyyzoo.gpss.service.sale.CustomerService;
import com.lyyzoo.gpss.web.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-06
 */
@Controller
@RequestMapping("/admin/customer")
public class CustomerController extends BaseController {

    @Autowired
    private CustomerService customerService;

    @RequestMapping(value = {"", "/"})
    public String index(){
        return "/sale/customer";
    }

    @RequestMapping("/page")
    @ResponseBody
    public Page<Customer> page(String name, int pageNumber, int pageSize){
        return customerService.page(name, pageNumber, pageSize);
    }

    @RequestMapping(value = "/save", method = RequestMethod.POST)
    @ResponseBody
    public Result save(Customer customer){
        return customerService.save(customer, getCurrentUser());
    }

    @RequestMapping("/remove")
    @ResponseBody
    public Result remove(Long id){
        return customerService.remove(id, getCurrentUser());
    }

}
