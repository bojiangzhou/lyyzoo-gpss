package com.lyyzoo.gpss.web.base;

import com.lyyzoo.bean.Result;
import com.lyyzoo.data.domain.Page;
import com.lyyzoo.gpss.entity.base.Goods;
import com.lyyzoo.gpss.service.base.GoodsService;
import com.lyyzoo.gpss.web.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

/**
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-05
 */
@Controller
@RequestMapping("/admin/goods")
public class GoodsController extends BaseController {

    @Autowired
    private GoodsService goodsService;

    @RequestMapping(value = {"", "/"})
    public String index(){
        return "/base/goods";
    }

    @RequestMapping("/page")
    @ResponseBody
    public Page<Goods> page(String name, String code, String type, String brand, String color, String standard, String material, int pageNumber, int pageSize){
        return goodsService.page(name, code, type, brand, color, standard, material, pageNumber, pageSize);
    }

    @RequestMapping(value = "/save", method = RequestMethod.POST)
    @ResponseBody
    public Result save(Goods goods, @RequestParam(required = false) MultipartFile file){

        return goodsService.save(goods, file, getCurrentUser());
    }

    @RequestMapping("/picture")
    @ResponseBody
    public Goods picture(Long id){
        if(id == null){
            return new Goods();
        }
        return goodsService.get(id);
    }

    @RequestMapping("/remove")
    @ResponseBody
    public Result remove(Long id){
        return goodsService.remove(id, getCurrentUser());
    }

}
