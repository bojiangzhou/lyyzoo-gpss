package com.lyyzoo.gpss.service.sale;

import com.lyyzoo.bean.Result;
import com.lyyzoo.data.domain.Page;
import com.lyyzoo.gpss.Applications;
import com.lyyzoo.gpss.dao.sale.CustomerDao;
import com.lyyzoo.gpss.entity.sale.Customer;
import com.lyyzoo.gpss.entity.system.User;
import com.lyyzoo.service.BaseService;
import com.lyyzoo.util.Results;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-06
 */
@Service
public class CustomerService extends BaseService<Customer> {

    @Autowired
    private CustomerDao customerDao;

    public Page<Customer> page(String name, int pageNumber, int pageSize){
        return customerDao.page(name, pageNumber, pageSize);
    }

    public Result save(Customer customer, User currentUser){
        if(customer.getId() == null){
            customer.setUpdater(currentUser.getAccount());
            customer.setUpdatime(new Date());
            customer.setState(Applications.Flag.YES);

            this.save(customer);
        } else{
            Customer toSave = get(customer.getId());

            toSave.setName(customer.getName());
            toSave.setLinkman(customer.getLinkman());
            toSave.setMobile(customer.getMobile());
            toSave.setAddress(customer.getAddress());
            toSave.setDescs(customer.getDescs());
            toSave.setUpdater(currentUser.getAccount());
            toSave.setUpdatime(new Date());

            this.update(toSave);
        }
        return Results.success();
    }

    public Result remove(Long id, User currentUser) {
        Customer customer = get(id);
        customer.setUpdater(currentUser.getAccount());
        customer.setUpdatime(new Date());
        customer.setState(Applications.Flag.NO);

        this.update(customer);

        return Results.success();
    }

}
