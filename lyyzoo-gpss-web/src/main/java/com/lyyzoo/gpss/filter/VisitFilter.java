package com.lyyzoo.gpss.filter;

import com.lyyzoo.gpss.entity.system.User;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 如果用户没有登录，返回首页
 * <p>
 *
 * @author bojiangzhou
 * @date 2017-04-01
 */
public class VisitFilter implements Filter {

	public void destroy() {
		
	}

	public void doFilter(ServletRequest req, ServletResponse rep, FilterChain chain) throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest) req;
		HttpServletResponse response = (HttpServletResponse) rep;

		User currentUser = (User) request.getSession().getAttribute("currentUser");
		//判断用户是否登录
		if(currentUser != null){
			chain.doFilter(request, response);
		} else{
			String ctx = request.getContextPath();
			response.sendRedirect(ctx + "/login");
		}
	}

	public void init(FilterConfig arg0) throws ServletException {

	}

}
