package com.lyyzoo.gpss.web;

import com.lyyzoo.gpss.entity.system.User;
import com.lyyzoo.gpss.service.system.UserService;
import com.lyyzoo.gpss.util.VCodeGenerator;
import com.lyyzoo.util.Cryptos;
import com.lyyzoo.util.Strings;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.awt.image.BufferedImage;
import java.io.IOException;

/**
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-03-29
 */
@Controller
@RequestMapping("")
public class HomeController extends BaseController {

    @Autowired
    private UserService userService;

    /**
     * 到首页/登录页面
     */
    @RequestMapping(value = {"", "/", "/index", "/login"})
    public String index(){
        return "/index";
    }

    /**
     * 管理员主页
     */
    @RequestMapping("/admin/home")
    public String toHome(){
        return "/home/home";
    }

    /**
     * 登录
     */
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public String login(String account, String password, String vcode, HttpSession session){
        String redirect = REDIRECT("/login");
        //基本验证
        if(Strings.isNullOrEmpty(account)){
            session.setAttribute("errorMsg", "账号必须填写!");
            return redirect;
        }
        if(Strings.isNullOrEmpty(password)){
            session.setAttribute("errorMsg", "密码必须填写!");
            return redirect;
        }
        if(Strings.isNullOrEmpty(vcode)){
            session.setAttribute("errorMsg", "验证码必须填写!");
            return redirect;
        }
        //验证码
        String sessionVcode = (String) session.getAttribute("vcode");
        if(!vcode.equalsIgnoreCase(sessionVcode)){
            session.setAttribute("errorMsg", "验证码错误!");
            return redirect;
        }
        //验证用户名和密码
        password = Cryptos.encryptMd5(password);
        User loginUser = userService.login(account, password);
        if(loginUser == null){
            session.setAttribute("errorMsg", "账号或密码错误!");
            return redirect;
        }
        if(loginUser.getIsLocked() == User.IsLocked.YES){
            session.setAttribute("errorMsg", "账号已锁定，不能登录!");
            return redirect;
        }

        //保存到session的时候清除密码
        User currentUser = new User();
        BeanUtils.copyProperties(loginUser, currentUser);
        currentUser.setPassword(null);

        //登录成功
        session.setAttribute("currentUser", currentUser);

        return REDIRECT("/admin/home");
    }

    /**
     * 获取验证码
     */
    @RequestMapping("/vcode")
    public void getVCode(HttpSession session, HttpServletResponse response) throws IOException {
        //创建验证码生成器对象
        VCodeGenerator vcGenerator = new VCodeGenerator();
        //生成验证码
        String vcode = vcGenerator.generatorVCode();
        //将验证码保存在session域中,以便判断验证码是否正确
        session.setAttribute("vcode", vcode);
        //生成验证码图片
        BufferedImage vImg = vcGenerator.generatorRotateVCodeImage(vcode, true);
        //输出图像
        ImageIO.write(vImg, "gif", response.getOutputStream());
    }

    /**
     * 退出系统
     */
    @RequestMapping("/logoff")
    public String logoff(HttpSession session){
        session.invalidate();
        return REDIRECT("/");
    }

    @RequestMapping("/function")
    public String function(){
        return "/home/function";
    }

    @RequestMapping("/welcome")
    public String welcome(){
        return "/home/welcome";
    }

    /**
     * 错误页面
     * @param code
     * @return
     */
    @RequestMapping("/error/{code}")
    public String error(@PathVariable String code) {
        return "/error/" + code;
    }



}
