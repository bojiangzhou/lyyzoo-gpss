package com.lyyzoo.gpss.service.system;

import com.lyyzoo.bean.Result;
import com.lyyzoo.data.domain.Page;
import com.lyyzoo.gpss.Applications;
import com.lyyzoo.gpss.dao.system.UserDao;
import com.lyyzoo.gpss.entity.system.User;
import com.lyyzoo.service.BaseService;
import com.lyyzoo.util.Cryptos;
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
 * @date 2017-04-01
 */
@Service
public class UserService extends BaseService<User> {

    @Autowired
    private UserDao userDao;

    /**
     * 获取登录用户
     */
    public User login(String account, String password){
        Map<String, Object> filter = new HashMap<>();
        filter.put("account", account);
        filter.put("password", password);
        filter.put("state", Applications.Flag.YES);

        User loginUser = get(filter);
        return loginUser;
    }

    /**
     * 根据条件分页查询
     */
    public Page<User> page(String account, Long roleId, Integer isLocked, int pageNumber, int pageSize){
        return userDao.page(account, roleId, isLocked, pageNumber, pageSize);
    }

    /**
     * 保存
     */
    public Result save(User user, User currentUser){
        if(user.getId() == null){

            //查询是否存在相同账号的用户
            Map<String, Object> filter = new HashMap<>();
            filter.put("account", user.getAccount());
            filter.put("state", Applications.Flag.YES);
            User exist = get(filter);

            if(exist != null){
                return Results.failure("已存在相同账号");
            }

            user.setUpdater(currentUser.getAccount());
            user.setUpdatime(new Date());
            user.setState(Applications.Flag.YES);
            user.setIsLocked(User.IsLocked.NO);
            //密码加密 默认密码111111
            user.setPassword(Cryptos.encryptMd5(Applications.DEFAULT_PASS));

            this.save(user);
            return Results.success("保存成功! 用户账号：" + user.getAccount() + " 默认密码：" + Applications.DEFAULT_PASS);
        } else{
            User toSave = get(user.getId());
            toSave.setRoleId(user.getRoleId());
            toSave.setRoleName(user.getRoleName());
            toSave.setEmployeeId(user.getEmployeeId());
            toSave.setUpdater(currentUser.getAccount());
            toSave.setUpdatime(new Date());

            this.update(toSave);
            return Results.success();
        }
    }

    /**
     * 删除
     */
    public Result remove(Long id, User currentUser) {
        User user = get(id);
        user.setUpdater(currentUser.getAccount());
        user.setUpdatime(new Date());
        user.setState(Applications.Flag.NO);
        this.update(user);

        return Results.success();
    }

    /**
     * 锁定
     */
    public Result lock(Long id, User currentUser) {
        User user = get(id);
        user.setUpdater(currentUser.getAccount());
        user.setUpdatime(new Date());
        user.setIsLocked(User.IsLocked.YES);
        user.setLockTime(new Date());

        this.update(user);

        return Results.success();
    }

    /**
     * 解锁
     */
    public Result unlock(Long id, User currentUser) {
        User user = get(id);
        user.setUpdater(currentUser.getAccount());
        user.setUpdatime(new Date());
        user.setIsLocked(User.IsLocked.NO);
        user.setLockTime(new Date());

        this.update(user);

        return Results.success();
    }

    /**
     * 修改密码
     */
    public Result modify(String oldPass, String newPass, User currentUser) {
        User loginUser = login(currentUser.getAccount(), Cryptos.encryptMd5(oldPass));
        if(loginUser == null){
            return Results.failure("原密码输入错误");
        }
        //加密
        loginUser.setPassword(Cryptos.encryptMd5(newPass));
        this.update(loginUser);

        return Results.success("修改密码成功，请在下次登录时使用新密码登录");
    }
}
