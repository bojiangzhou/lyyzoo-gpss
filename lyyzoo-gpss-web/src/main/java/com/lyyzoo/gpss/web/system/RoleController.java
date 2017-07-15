package com.lyyzoo.gpss.web.system;

import com.lyyzoo.bean.Result;
import com.lyyzoo.data.domain.Page;
import com.lyyzoo.gpss.Applications;
import com.lyyzoo.gpss.entity.system.Role;
import com.lyyzoo.gpss.service.system.RoleService;
import com.lyyzoo.gpss.web.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-01
 */
@Controller
@RequestMapping("/admin/role")
public class RoleController extends BaseController {

    @Autowired
    private RoleService roleService;

    @RequestMapping(value = {"", "/"})
    public String index(){
        return "/system/role";
    }

    @RequestMapping("/page")
    @ResponseBody
    public Page<Role> page(String code, int pageNumber, int pageSize){

        return roleService.page(code, pageNumber, pageSize);
    }

    /**
     * 查询所有角色
     */
    @RequestMapping("/list/all")
    @ResponseBody
    public List<Role> list(){
        Map<String, Object> filter = new HashMap<>();
        filter.put("state", Applications.Flag.YES);
        return roleService.find(filter);
    }

    /**
     * 保存或修改
     */
    @RequestMapping(value = "/save", method = RequestMethod.POST)
    @ResponseBody
    public Result save(Role role){
        return roleService.save(role, getCurrentUser());
    }

    @RequestMapping("/remove")
    @ResponseBody
    public Result remove(Long id){
        return roleService.remove(id, getCurrentUser());
    }

}
