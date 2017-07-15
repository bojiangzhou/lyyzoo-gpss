package com.lyyzoo.gpss.web.base;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.lyyzoo.bean.Result;
import com.lyyzoo.data.domain.Page;
import com.lyyzoo.gpss.entity.base.Employee;
import com.lyyzoo.gpss.service.base.EmployeeService;
import com.lyyzoo.gpss.web.BaseController;

/**
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-05
 */
@Controller
@RequestMapping("/admin/employee")
public class EmployeeController extends BaseController {

    @Autowired
    private EmployeeService employeeService;

    @RequestMapping(value = {"", "/"})
    public String index(){
        return "/base/employee";
    }

    @RequestMapping("/page")
    @ResponseBody
    public Page<Employee> page(String name, String type, int pageNumber, int pageSize){

        return employeeService.page(name, type, pageNumber, pageSize);
    }

    /**
     * 保存或修改
     */
    @RequestMapping(value = "/save", method = RequestMethod.POST)
    @ResponseBody
    public Result save(Employee employee){
        return employeeService.save(employee, getCurrentUser());
    }

    @RequestMapping("/remove")
    @ResponseBody
    public Result remove(Long id){
        return employeeService.remove(id, getCurrentUser());
    }

}
