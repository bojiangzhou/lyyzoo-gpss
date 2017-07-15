package com.lyyzoo.gpss.service.base;

import com.lyyzoo.bean.Result;
import com.lyyzoo.data.domain.Page;
import com.lyyzoo.gpss.Applications;
import com.lyyzoo.gpss.dao.base.GoodsDao;
import com.lyyzoo.gpss.entity.base.Goods;
import com.lyyzoo.gpss.entity.stock.Stock;
import com.lyyzoo.gpss.entity.system.User;
import com.lyyzoo.gpss.service.stock.StockService;
import com.lyyzoo.service.BaseService;
import com.lyyzoo.util.Results;
import com.lyyzoo.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import sun.misc.BASE64Encoder;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-05
 */
@Service
public class GoodsService extends BaseService<Goods> {

    @Autowired
    private GoodsDao goodsDao;
    @Autowired
    private StockService stockService;

    public Page<Goods> page(String name, String code, String type, String brand, String color, String standard, String material, int pageNumber, int pageSize){
        return goodsDao.page(name, code, type, brand, color, standard, material, pageNumber, pageSize);
    }

    public Result save(Goods goods, MultipartFile file, User currentUser){
        String picture = "";
        if(file != null){
            if(file.getSize() > 1024000){
                return Results.failure("请上传小于1M的图片");
            };
            BASE64Encoder base64 = new BASE64Encoder();
            try {
                picture = base64.encode(file.getBytes());
            } catch (IOException e) {
                e.printStackTrace();
                return Results.failure("图片上传失败");
            }
        }

        if(goods.getId() == null){
            Map<String, Object> filter = new HashMap<>();
            filter.put("state", Applications.Flag.YES);
            filter.put("code", goods.getCode());
            Goods exist = get(filter);
            if(exist != null){
                return Results.failure("已存在相同的编号");
            }
            if(Strings.isNotNullOrEmpty(picture)){
                goods.setPicture(picture);
            }

            goods.setUpdater(currentUser.getAccount());
            goods.setUpdatime(new Date());
            goods.setState(Applications.Flag.YES);

            this.save(goods);
        } else{
            Goods toSave = get(goods.getId());

            toSave.setName(goods.getName());
            toSave.setType(goods.getType());
            toSave.setBrand(goods.getBrand());
            toSave.setUnit(goods.getUnit());
            toSave.setColor(goods.getColor());
            toSave.setDescs(goods.getDescs());
            toSave.setStandard(goods.getStandard());
            toSave.setMaterial(goods.getMaterial());
            toSave.setBuyPrice(goods.getBuyPrice());
            toSave.setSalePrice(goods.getSalePrice());
            toSave.setUpdater(currentUser.getAccount());
            toSave.setUpdatime(new Date());
            if(Strings.isNotNullOrEmpty(picture)){
                toSave.setPicture(picture);
            }

            this.update(toSave);
        }
        return Results.success();
    }

    public Result remove(Long id, User currentUser){
        Goods goods = get(id);

        List<Stock> stocks = stockService.findByGoodsIdAndCount(goods.getId());
        if(stocks.size() > 0){
            return Results.failure("库存中还存在该商品，不能删除");
        }


        goods.setUpdater(currentUser.getAccount());
        goods.setUpdatime(new Date());
        goods.setState(Applications.Flag.NO);

        this.update(goods);

        return Results.success();
    }

}
