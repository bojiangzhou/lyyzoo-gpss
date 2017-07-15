package com.lyyzoo.gpss.web.base;

import com.lyyzoo.bean.Result;
import com.lyyzoo.data.domain.Page;
import com.lyyzoo.gpss.Applications;
import com.lyyzoo.gpss.entity.base.Repo;
import com.lyyzoo.gpss.service.base.RepoService;
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
 * @date 2017-04-05
 */
@Controller
@RequestMapping("/admin/repo")
public class RepoController extends BaseController {

    @Autowired
    private RepoService repoService;

    @RequestMapping(value = {"", "/"})
    public String index(){
        return "/base/repo";
    }

    @RequestMapping("/page")
    @ResponseBody
    public Page<Repo> page(String name, int pageNumber, int pageSize){
        return repoService.page(name, pageNumber, pageSize);
    }

    @RequestMapping("/list")
    @ResponseBody
    public List<Repo> list(){
        Map<String, Object> filter = new HashMap<>();
        filter.put("state", Applications.Flag.YES);
        return repoService.find(filter);
    }

    @RequestMapping(value = "/save", method = RequestMethod.POST)
    @ResponseBody
    public Result save(Repo repo){
        return repoService.save(repo, getCurrentUser());
    }

    @RequestMapping("/remove")
    @ResponseBody
    public Result remove(Long id){
        return repoService.remove(id, getCurrentUser());
    }

}
