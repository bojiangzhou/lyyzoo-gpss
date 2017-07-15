package com.lyyzoo.gpss.web.system;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.lyyzoo.bean.Result;
import com.lyyzoo.data.domain.Page;
import com.lyyzoo.gpss.entity.system.User;
import com.lyyzoo.gpss.service.system.UserService;
import com.lyyzoo.gpss.web.BaseController;

/**
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-01
 */
@Controller
@RequestMapping("/admin/user")
public class UserController extends BaseController {

    @Autowired
    private UserService userService;

    @RequestMapping(value = {"", "/"})
    public String index(){
        return "/system/user";
    }

    @RequestMapping("/page")
    @ResponseBody
    public Page<User> page(String account, Long roleId, Integer isLocked, int pageNumber, int pageSize){

        return userService.page(account, roleId, isLocked, pageNumber, pageSize);
    }

    /**
     * 保存或修改
     */
    @RequestMapping(value = "/save", method = RequestMethod.POST)
    @ResponseBody
    public Result save(User user){
        return userService.save(user, getCurrentUser());
    }

    @RequestMapping("/remove")
    @ResponseBody
    public Result remove(Long id){
        return userService.remove(id, getCurrentUser());
    }

    /**
     * 锁定
     */
    @RequestMapping("/lock")
    @ResponseBody
    public Result lock(Long id){
        return userService.lock(id, getCurrentUser());
    }

    /**
     * 解锁
     */
    @RequestMapping("/unlock")
    @ResponseBody
    public Result unlock(Long id){
        return userService.unlock(id, getCurrentUser());
    }

    /**
     * 修改密码
     */
    @RequestMapping("/modify/pass")
    @ResponseBody
    public Result modify(String oldPass, String newPass){
        return userService.modify(oldPass, newPass, getCurrentUser());
    }

}
