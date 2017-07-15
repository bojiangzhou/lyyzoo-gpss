package com.lyyzoo.gpss.web.base;

import com.lyyzoo.bean.Result;
import com.lyyzoo.data.domain.Page;
import com.lyyzoo.gpss.Applications;
import com.lyyzoo.gpss.entity.base.Param;
import com.lyyzoo.gpss.service.base.ParamService;
import com.lyyzoo.gpss.web.BaseController;
import com.lyyzoo.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
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
 * @date 2017-04-04
 */
@RequestMapping("/admin/param")
@Controller
public class ParamController extends BaseController {

    @Autowired
    private ParamService paramService;

    @RequestMapping(value = {"", "/"})
    public String index(){
        return "/base/param";
    }

    @RequestMapping("/page")
    @ResponseBody
    public Page<Param> page(String type, int pageNumber, int pageSize){
        Map<String, Object> filter = new HashMap<>();
        filter.put("state", Applications.Flag.YES);
        if(Strings.isNotNullOrEmpty(type)){
            filter.put("type", type.toUpperCase());
        }
        return paramService.page(filter, pageNumber, pageSize);
    }

    @RequestMapping("/list/{type}")
    @ResponseBody
    public List<Param> list(@PathVariable String type){
        Map<String, Object> filter = new HashMap<>();
        filter.put("state", Applications.Flag.YES);
        if(Strings.isNotNullOrEmpty(type)){
            filter.put("type", type.toUpperCase());
        }
        return paramService.find(filter);
    }

    @RequestMapping(value = "/save", method = RequestMethod.POST)
    @ResponseBody
    public Result save(Param param){
        return paramService.save(param, getCurrentUser());
    }

    @RequestMapping("/remove")
    @ResponseBody
    public Result remove(Long id){
        return paramService.remove(id);
    }

}
