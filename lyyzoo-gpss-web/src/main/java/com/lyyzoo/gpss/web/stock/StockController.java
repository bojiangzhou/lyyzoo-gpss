package com.lyyzoo.gpss.web.stock;

import com.lyyzoo.bean.Result;
import com.lyyzoo.data.domain.Page;
import com.lyyzoo.gpss.entity.stock.Stock;
import com.lyyzoo.gpss.service.stock.StockService;
import com.lyyzoo.gpss.web.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-08
 */
@Controller
@RequestMapping("/admin/stock")
public class StockController extends BaseController {

    @Autowired
    private StockService stockService;

    @RequestMapping(value = {"", "/"})
    public String index(){
        return "/stock/stock";
    }

    @RequestMapping("/update")
    @ResponseBody
    public Result update(Stock stock){
        return stockService.updatePrice(stock);
    }

    @RequestMapping("/page")
    @ResponseBody
    public Page<Stock> page(String goodsNameOrCode, String goodsType, Long repoId, int pageNumber, int pageSize){
        return stockService.page(goodsNameOrCode, goodsType, repoId, pageNumber, pageSize);
    }

    @RequestMapping("/count")
    @ResponseBody
    public List<Stock> count(String goodsType, Long repoId){
        return stockService.count(goodsType, repoId);
    }

    /**
     * 库存调拨
     */
    @RequestMapping("/transfer")
    @ResponseBody
    public Result transfer(Long id, Integer transferCount, Long repoId){
        return stockService.transfer(id, transferCount, repoId);
    }


}
