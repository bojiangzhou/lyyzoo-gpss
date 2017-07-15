package com.lyyzoo.gpss.service.purchase;

import com.lyyzoo.bean.Result;
import com.lyyzoo.data.domain.Page;
import com.lyyzoo.gpss.Applications;
import com.lyyzoo.gpss.dao.purchase.SupplierDao;
import com.lyyzoo.gpss.entity.purchase.Supplier;
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
public class SupplierService extends BaseService<Supplier> {

    @Autowired
    private SupplierDao supplierDao;

    public Page<Supplier> page(String name, int pageNumber, int pageSize){
        return supplierDao.page(name, pageNumber, pageSize);
    }

    public Result save(Supplier supplier, User currentUser){
        if(supplier.getId() == null){
            supplier.setUpdater(currentUser.getAccount());
            supplier.setUpdatime(new Date());
            supplier.setState(Applications.Flag.YES);

            this.save(supplier);
        } else{
            Supplier toSave = get(supplier.getId());

            toSave.setName(supplier.getName());
            toSave.setLinkman(supplier.getLinkman());
            toSave.setMobile(supplier.getMobile());
            toSave.setAddress(supplier.getAddress());
            toSave.setDescs(supplier.getDescs());
            toSave.setUpdater(currentUser.getAccount());
            toSave.setUpdatime(new Date());

            this.update(toSave);
        }
        return Results.success();
    }

    public Result remove(Long id, User currentUser) {
        Supplier supplier = get(id);
        supplier.setUpdater(currentUser.getAccount());
        supplier.setUpdatime(new Date());
        supplier.setState(Applications.Flag.NO);

        this.update(supplier);

        return Results.success();
    }
}
