package com.lyyzoo.gpss.service.system;

import com.lyyzoo.bean.Result;
import com.lyyzoo.gpss.Applications;
import com.lyyzoo.gpss.dao.system.MenuDao;
import com.lyyzoo.gpss.entity.system.Menu;
import com.lyyzoo.gpss.entity.system.Role;
import com.lyyzoo.gpss.entity.system.User;
import com.lyyzoo.service.BaseService;
import com.lyyzoo.util.Results;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-01
 */
@Service
public class MenuService extends BaseService<Menu> {

    @Autowired
    private MenuDao menuDao;
    @Autowired
    private RoleService roleService;

    /**
     * 保存或更新
     */
    public Result save(Menu menu, User currentUser){
        if(menu.getId() == null){
            menu.setUpdatime(new Date());
            menu.setUpdater(currentUser.getAccount());
            menu.setState(Applications.Flag.YES);
            this.save(menu);
        } else{
            Menu save = get(menu.getId());
            save.setUpdatime(new Date());
            save.setName(menu.getName());
            save.setPath(menu.getPath());
            this.update(save);
        }
        return Results.success();
    }

    /**
     * 删除
     */
    public Result remove(Long id, User currentUser){
        List<Menu> toDelete = new ArrayList<>();
        Menu menu = get(id);
        toDelete.add(menu);
        if(menu.getIsLeaf() == Menu.IsLeaf.No){
            List<Menu> childs = menuDao.findByUpIdAndMenuIds(id, getMenuIds(currentUser));
            toDelete.addAll(childs);
        }
        for(Menu m : toDelete){
            m.setState(Applications.Flag.NO);
            m.setUpdater(currentUser.getAccount());
            m.setUpdatime(new Date());
        }
        update(toDelete);
        return Results.success();
    }

    /**
     * 根据上级id查找菜单
     */
    public List<Menu> findByUpId(Long id, User currentUser) {

        return menuDao.findByUpIdAndMenuIds(id, getMenuIds(currentUser));
    }

    /**
     * 根据当前用户查找所有菜单
     * @return
     */
    public List<Menu> findAll(User currentUser) {

        return listChildren(0L, getMenuIds(currentUser));
    }

    /**
     * 查找所有子菜单
     * @param id
     */
    public List<Menu> listChildren(Long id, String menuIds){
        List<Menu> childs = menuDao.findByUpIdAndMenuIds(id, menuIds);
        for(Menu child : childs){
            if(child.getIsLeaf() == Menu.IsLeaf.No){
                child.setChildren(listChildren(child.getId(), menuIds));
            }
        }
        return childs;
    }

    /**
     * 超级管理员拥有所有权限
     */
    private String getMenuIds(User currentUser){
        String menuIds = "";
        if(!Applications.ADMIN.equalsIgnoreCase(currentUser.getAccount())){
            Role role = roleService.get(currentUser.getRoleId());
            menuIds = role.getMenuIds();
        }
        return menuIds;
    }


}
