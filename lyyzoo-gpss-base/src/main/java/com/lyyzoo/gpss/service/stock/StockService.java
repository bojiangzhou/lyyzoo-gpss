package com.lyyzoo.gpss.service.stock;

import com.lyyzoo.bean.Result;
import com.lyyzoo.data.domain.Page;
import com.lyyzoo.gpss.Applications;
import com.lyyzoo.gpss.dao.stock.StockDao;
import com.lyyzoo.gpss.entity.stock.Stock;
import com.lyyzoo.service.BaseService;
import com.lyyzoo.util.Results;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-08
 */
@Service
public class StockService extends BaseService<Stock> {

    @Autowired
    private StockDao stockDao;

    public Page<Stock> page(String goodsNameOrCode, String goodsType, Long repoId, int pageNumber, int pageSize){
        return stockDao.page(goodsNameOrCode, goodsType, repoId, pageNumber, pageSize);
    }

    /**
     * 通过商品ID 和 库存ID获取库存记录
     * @param goodsId
     * @param repoId
     * @return
     */
    public Stock get(Long goodsId, Long repoId){
        Map<String, Object> filter = new HashMap<>();
        filter.put("state", Applications.Flag.YES);
        filter.put("goodsId", goodsId);
        if(repoId != null){
            filter.put("repoId", repoId);
        }

        return get(filter);
    }

    public List<Stock> findByGoodsIdAndCount(Long goodsId){
        return stockDao.findByGoodsIdAndCount(goodsId);
    }

    /**
     * 创建商品库存
     */
    private Stock create(Long goodsId, Long repoId){
        Stock stock = new Stock();
        stock.setGoodsId(goodsId);
        stock.setRepoId(repoId);
        stock.setTotalCount(0);
        stock.setSaleCount(0);
        stock.setBuyPrice(0D);
        stock.setAvgBuyPrice(0D);
        stock.setSalePrice(0D);
        stock.setTotalBuyPrice(0D);
        stock.setTotalSalePrice(0D);
        stock.setUpdatime(new Date());
        stock.setState(Applications.Flag.YES);

        stock = this.save(stock);

        return stock;
    }

    /**
     * 增加库存
     *
     * @param goodsId
     * @param repoId
     * @param count 数量
     * @param buyPrice 进价
     * @return
     */
    public synchronized Result add(Long goodsId, Long repoId, Integer count, Double buyPrice){
        Stock stock = get(goodsId, repoId);
        if(stock == null){
            stock = create(goodsId, repoId);
        }
        if(count == null || count <= 0){
            return Results.failure("入库数量不能小于1");
        }
        //加总数
        stock.setTotalCount(stock.getTotalCount() + count);
        if(buyPrice != null){
            stock.setBuyPrice(buyPrice);
        }
        if(stock.getAvgBuyPrice() == null || stock.getAvgBuyPrice() == 0){
            stock.setAvgBuyPrice(buyPrice);
        }

        stock.setTotalBuyPrice(stock.getAvgBuyPrice() * stock.getTotalCount());
        stock.setTotalSalePrice(stock.getSalePrice() * stock.getTotalCount());

        this.update(stock);

        return Results.success();
    }

    /**
     * 减少库存
     *
     * @param goodsId
     * @param repoId
     * @param count 数量
     * @return
     */
    public synchronized Result reduce(Long goodsId, Long repoId, Integer count){
        Stock stock = get(goodsId, repoId);
        if(stock == null){
            return Results.failure("该仓库不存在相应的商品");
        }
        if(count == null || count <= 0){
            return Results.failure("数量不能小于1");
        }
        if(count > stock.getTotalCount()){
            return Results.failure("当前库存量为["+stock.getTotalCount()+"]，库存不足");
        }

        //减总数
        stock.setTotalCount(stock.getTotalCount() - count);

        stock.setSaleCount(stock.getSaleCount() + count);

        stock.setTotalBuyPrice(stock.getBuyPrice() * stock.getTotalCount());
        stock.setTotalSalePrice(stock.getSalePrice() * stock.getTotalCount());

        this.update(stock);

        return Results.success();
    }

    /**
     * 修改价格
     * @param stock
     */
    public Result updatePrice(Stock stock) {
        if(stock.getId() == null){
            return Results.failure("该库存不存在");
        }
        Stock toUpdate = get(stock.getId());
        toUpdate.setUpdatime(new Date());
        toUpdate.setAvgBuyPrice(stock.getAvgBuyPrice());
        toUpdate.setSalePrice(stock.getSalePrice());

        toUpdate.setTotalBuyPrice(toUpdate.getAvgBuyPrice() * toUpdate.getTotalCount());
        toUpdate.setTotalSalePrice(toUpdate.getSalePrice() * toUpdate.getTotalCount());

        this.update(toUpdate);

        return Results.success();
    }

    /**
     * 库存统计
     */
    public List<Stock> count(String goodsType, Long repoId){
        return stockDao.count(goodsType, repoId);
    }

    /**
     * 库存调拨
     */
    public Result transfer(Long id, Integer transferCount, Long repoId) {
        Stock from = get(id);
        if(transferCount < 1){
            return Results.failure("调拨数量必须大于1");
        }
        if(from.getRepoId() == repoId){
            return Results.failure("不能调入相同的仓库");
        }
        Stock to = get(from.getGoodsId(), repoId);
        if(to == null){
            to = create(from.getGoodsId(), repoId);
        }

        //入库
        to.setTotalCount(to.getTotalCount() + transferCount);
        if(to.getBuyPrice() == null || to.getBuyPrice() == 0){
            to.setBuyPrice(from.getBuyPrice());
        }
        if(to.getSalePrice() == null || to.getSalePrice() == 0){
            to.setSalePrice(from.getSalePrice());
        }
        if(to.getAvgBuyPrice() == null || to.getAvgBuyPrice() == 0){
            to.setAvgBuyPrice(from.getAvgBuyPrice());
        }
        to.setTotalBuyPrice(to.getAvgBuyPrice() * to.getTotalCount());
        to.setTotalSalePrice(to.getSalePrice() * to.getTotalCount());
        this.update(to);

        //出库
        from.setTotalCount(from.getTotalCount() - transferCount);
        from.setTotalBuyPrice(from.getBuyPrice() * from.getTotalCount());
        from.setTotalSalePrice(from.getSalePrice() * from.getTotalCount());
        this.update(from);

        return Results.success();
    }
}
