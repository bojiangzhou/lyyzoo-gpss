package com.lyyzoo.gpss.service.system;

import com.lyyzoo.bean.Result;
import com.lyyzoo.data.domain.Page;
import com.lyyzoo.gpss.Applications;
import com.lyyzoo.gpss.dao.system.RoleDao;
import com.lyyzoo.gpss.entity.system.Role;
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
 * @date 2017-04-01
 */
@Service
public class RoleService extends BaseService<Role> {

    @Autowired
    private RoleDao roleDao;

    public Page<Role> page(String code, int pageNumber, int pageSize){
        return roleDao.page(code, pageNumber, pageSize);
    }

    /**
     * 保存或修改
     */
    public Result save(Role role, User currentUser){
        if(role.getId() == null){
            role.setUpdater(currentUser.getAccount());
            role.setUpdatime(new Date());
            role.setState(Applications.Flag.YES);
            this.save(role);
        } else{
            Role toSave = get(role.getId());
            toSave.setMenuIds(role.getMenuIds());
            toSave.setMenuNames(role.getMenuNames());
            toSave.setCode(role.getCode());
            toSave.setDescs(role.getDescs());
            toSave.setName(role.getName());
            toSave.setUpdatime(new Date());
            toSave.setUpdater(currentUser.getAccount());
            this.update(toSave);
        }
        return Results.success();
    }

    /**
     * 删除
     */
    public Result remove(Long id, User currentUser) {
        Role toDelete = get(id);
        toDelete.setState(Applications.Flag.NO);
        toDelete.setUpdatime(new Date());
        toDelete.setUpdater(currentUser.getAccount());
        this.update(toDelete);

        return Results.success();
    }
}
