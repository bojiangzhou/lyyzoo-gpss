<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ include file="/WEB-INF/layout/taglib.jsp"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <%@include file="/WEB-INF/layout/meta.jsp" %>
    <%@include file="/WEB-INF/layout/h-ui.jsp" %>
    <title>燃气管网设备进销存管理系统</title>

    <script type="text/javascript">
        $(function(){
            //是否有错误消息
            var errorMsg = $.trim($("#msg").val());
            if(errorMsg != ""){
                alert(errorMsg);
                $("#msg").val("");
            }

            $("input[name=account]").val(localStorage.account);
            $("input[name=password]").val(localStorage.password);

            //点击图片切换验证码
            $("#vcodeImg").click(function(){
                this.src = "${CTX}/vcode?t=" + new Date().getTime();
            });

            //登录验证
            $("#submitBtn").click(function(){
                var account   = $("input[name='account']").val().trim();
                var password  = $("input[name='password']").val();
                var vcode     = $("input[name='vcode']").val();

                if(account == ""){
                    alert("账号必须填写!");
                    return false;
                }
                if(password == ""){
                    alert("密码必须填写!");
                    return false;
                }
                if(vcode == ""){
                    alert("验证码必须填写!");
                    return false;
                }

                localStorage.account = account;
                localStorage.password = password;

                return true;
            });

        })
    </script>
</head>
<body>
<input id="msg" type="hidden" name="errorMsg" value="${errorMsg}" />
<c:remove var="errorMsg" scope="session" />
<div class="header" style="padding: 0;">
	<h2 style="color: white; width: 500px; height: 60px; line-height: 60px; margin: 0 0 0 30px; padding: 0;">燃气管网设备进销存管理系统</h2>
</div>
<div class="loginWraper">
  <div id="loginform" class="loginBox">
    <form id="form" action="${CTX}/login" class="form form-horizontal" method="post">
      <div class="row cl">
        <label class="form-label col-3"><i class="Hui-iconfont">&#xe60d;</i></label>
        <div class="formControls col-8">
          <input name="account" type="text" placeholder="账号" value="${localStorage.account}" class="input-text size-L">
        </div>
      </div>
      <div class="row cl">
        <label class="form-label col-3"><i class="Hui-iconfont">&#xe60e;</i></label>
        <div class="formControls col-8">
          <input name="password" type="password" placeholder="密码" class="input-text size-L">
        </div>
      </div>
      <div class="row cl">
        <div class="formControls col-8 col-offset-3">
          <input class="input-text size-L" name="vcode" type="text" placeholder="请输入验证码" style="width: 200px;">
          <img title="点击图片切换验证码" style="cursor: pointer;" id="vcodeImg" src="${CTX}/vcode"></div>
      </div>
      <div class="row">
        <div class="formControls col-8 col-offset-3">
          <input id="submitBtn" type="submit" class="btn btn-success radius size-L" value="&nbsp;登&nbsp;&nbsp;&nbsp;&nbsp;录&nbsp;">
        </div>
      </div>
    </form>
  </div>
</div>
<div class="footer">Copyright <strong>©</strong> lyyzoo </div>

</body>
</html>