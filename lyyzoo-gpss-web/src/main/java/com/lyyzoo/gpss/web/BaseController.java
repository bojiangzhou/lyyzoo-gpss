package com.lyyzoo.gpss.web;

import com.lyyzoo.gpss.entity.system.User;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpSession;

/**
 *
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-02
 */
public class BaseController extends com.lyyzoo.web.BaseController {

    @Autowired
    protected HttpSession session;

    public User getCurrentUser(){
        return (User) session.getAttribute("currentUser");
    }

    public Long getCurrentUserId(){
        return getCurrentUser().getId();
    }

    public String getCurrentUserAccount(){
        return getCurrentUser().getAccount();
    }

}
