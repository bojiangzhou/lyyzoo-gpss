package com.lyyzoo.gpss.service.base;

import com.lyyzoo.bean.Result;
import com.lyyzoo.data.domain.Page;
import com.lyyzoo.gpss.Applications;
import com.lyyzoo.gpss.dao.base.EmployeeDao;
import com.lyyzoo.gpss.entity.base.Employee;
import com.lyyzoo.gpss.entity.system.User;
import com.lyyzoo.service.BaseService;
import com.lyyzoo.util.Results;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-05
 */
@Service
public class EmployeeService extends BaseService<Employee> {

    @Autowired
    private EmployeeDao employeeDao;

    /**
     * 根据条件分页查询
     */
    public Page<Employee> page(String name, String type, int pageNumber, int pageSize){
        return employeeDao.page(name, type, pageNumber, pageSize);
    }

    /**
     * 保存
     */
    public Result save(Employee employee, User currentUser){
        if(employee.getId() == null){
            //判断是否有相同的员工编号
            Map<String, Object> filter = new HashMap<>();
            filter.put("code", employee.getCode());
            filter.put("state", Applications.Flag.YES);
            Employee exist = get(filter);
            if(exist != null){
                return Results.failure("该员工编号已存在");
            }

            employee.setUpdater(currentUser.getAccount());
            employee.setUpdatime(new Date());
            employee.setState(Applications.Flag.YES);

            this.save(employee);
        } else{
            Employee toSave = get(employee.getId());

            toSave.setName(employee.getName());
            toSave.setCode(employee.getCode());
            toSave.setIdCard(employee.getIdCard());
            toSave.setMobile(employee.getMobile());
            toSave.setSex(employee.getSex());
            toSave.setBirthday(employee.getBirthday());
            toSave.setAddress(employee.getAddress());
            toSave.setEmail(employee.getEmail());
            toSave.setType(employee.getType());
            toSave.setUpdater(currentUser.getAccount());
            toSave.setUpdatime(new Date());

            this.update(toSave);
        }
        return Results.success();
    }

    /**
     * 删除
     */
    public Result remove(Long id, User currentUser) {
        Employee employee = get(id);
        employee.setUpdater(currentUser.getAccount());
        employee.setUpdatime(new Date());
        employee.setState(Applications.Flag.NO);
        this.update(employee);

        return Results.success();
    }


}
