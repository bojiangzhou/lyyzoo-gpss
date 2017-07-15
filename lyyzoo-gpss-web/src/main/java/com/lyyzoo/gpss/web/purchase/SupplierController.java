package com.lyyzoo.gpss.web.purchase;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.lyyzoo.bean.Result;
import com.lyyzoo.data.domain.Page;
import com.lyyzoo.gpss.entity.purchase.Supplier;
import com.lyyzoo.gpss.service.purchase.SupplierService;
import com.lyyzoo.gpss.web.BaseController;

/**
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-06
 */
@Controller
@RequestMapping("/admin/supplier")
public class SupplierController extends BaseController {

    @Autowired
    private SupplierService supplierService;

    @RequestMapping(value = {"", "/"})
    public String index(){
        return "/purchase/supplier";
    }

    @RequestMapping("/page")
    @ResponseBody
    public Page<Supplier> page(String name, int pageNumber, int pageSize){
        return supplierService.page(name, pageNumber, pageSize);
    }

    @RequestMapping(value = "/save", method = RequestMethod.POST)
    @ResponseBody
    public Result save(Supplier supplier){
        return supplierService.save(supplier, getCurrentUser());
    }

    @RequestMapping("/remove")
    @ResponseBody
    public Result remove(Long id){
        return supplierService.remove(id, getCurrentUser());
    }

}
