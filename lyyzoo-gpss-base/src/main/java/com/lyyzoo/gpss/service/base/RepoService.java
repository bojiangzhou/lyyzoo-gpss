package com.lyyzoo.gpss.service.base;

import com.lyyzoo.bean.Result;
import com.lyyzoo.data.domain.Page;
import com.lyyzoo.gpss.Applications;
import com.lyyzoo.gpss.dao.base.RepoDao;
import com.lyyzoo.gpss.entity.base.Repo;
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
public class RepoService extends BaseService<Repo> {

    @Autowired
    private RepoDao repoDao;

    public Page<Repo> page(String name, int pageNumber, int pageSize){
        return repoDao.page(name, pageNumber, pageSize);
    }

    public Result save(Repo repo, User currentUser){
        if(repo.getId() == null){
            Map<String, Object> filter = new HashMap<>();
            filter.put("state", Applications.Flag.YES);
            filter.put("code", repo.getCode());
            Repo exist = get(filter);
            if(exist != null){
                return Results.failure("已存在相同的编号");
            }

            repo.setState(Applications.Flag.YES);
            repo.setUpdater(currentUser.getAccount());
            repo.setUpdatime(new Date());

            this.save(repo);
        } else{
            Repo toSave = get(repo.getId());

            toSave.setName(repo.getName());
            toSave.setAddress(repo.getAddress());
            toSave.setDescs(repo.getDescs());
            toSave.setAdminId(repo.getAdminId());
            toSave.setUpdater(currentUser.getAccount());
            toSave.setUpdatime(new Date());

            this.update(toSave);
        }
        return Results.success();
    }

    public Result remove(Long id, User currentUser) {
        Repo repo = get(id);

        //TODO 有库存不能删除

        repo.setUpdater(currentUser.getAccount());
        repo.setUpdatime(new Date());
        repo.setState(Applications.Flag.NO);

        return Results.success();
    }
}
