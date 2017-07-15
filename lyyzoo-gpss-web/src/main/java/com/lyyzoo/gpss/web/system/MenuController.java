package com.lyyzoo.gpss.web.system;

import com.lyyzoo.bean.Result;
import com.lyyzoo.gpss.entity.system.Menu;
import com.lyyzoo.gpss.service.system.MenuService;
import com.lyyzoo.gpss.web.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-01
 */
@Controller
@RequestMapping("/admin/menu")
public class MenuController extends BaseController {

    @Autowired
    private MenuService menuService;

    @RequestMapping(value = { "", "/" })
    public String index(){
        return "/system/menu";
    }

    @RequestMapping("/list")
    @ResponseBody
    public List<Menu> list(Long id){
        return menuService.findByUpId(id, getCurrentUser());
    }

    @RequestMapping("/list/all")
    @ResponseBody
    public List<Menu> listAll(){
        return menuService.findAll(getCurrentUser());
    }

    @RequestMapping(value = "/save", method = RequestMethod.POST)
    @ResponseBody
    public Result save(Menu menu){
        return menuService.save(menu, getCurrentUser());
    }

    @RequestMapping("/remove")
    @ResponseBody
    public Result remove(Long id){
        return menuService.remove(id, getCurrentUser());
    }

}
