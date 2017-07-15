package com.lyyzoo.gpss.service.base;

import com.lyyzoo.bean.Result;
import com.lyyzoo.gpss.Applications;
import com.lyyzoo.gpss.dao.base.ParamDao;
import com.lyyzoo.gpss.entity.base.Param;
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
 * @date 2017-04-04
 */
@Service
public class ParamService extends BaseService<Param> {

    @Autowired
    private ParamDao paramDao;

    public Result save(Param param, User currentUser){
        if(param.getId() == null){
            param.setCreater(currentUser.getAccount());
            param.setCreatime(new Date());
            param.setState(Applications.Flag.YES);

            this.save(param);
        } else{
            Param toSave = get(param.getId());
            toSave.setName(param.getName());
            toSave.setDescs(param.getDescs());

            this.update(toSave);
        }
        return Results.success();
    }

    public Result remove(Long id) {
        Param toDelete = get(id);
        toDelete.setState(Applications.Flag.NO);
        this.update(toDelete);

        return Results.success();
    }
}
