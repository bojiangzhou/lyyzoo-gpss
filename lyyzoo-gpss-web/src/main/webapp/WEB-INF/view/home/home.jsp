<%--
  User: bojiangzhou
  Date: 2017-03-29
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ include file="/WEB-INF/layout/taglib.jsp"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <%@include file="/WEB-INF/layout/meta.jsp" %>
    <%@include file="/WEB-INF/layout/extjs-neptune.jsp" %>

    <title>燃气管进销存系统</title>

    <style>
        .navbar {
            height: 68px;
            max-height: 70px;
            width: 100%;
            margin: auto;
            box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.5);
        }
        .navbar-logo {
            height: 68px;
            width: 300px;
            float: left;
            position: relative;
            /*margin-left: -5px;*/
        }
        .navbar-menu {
            float: right;
            position: relative;
            margin: 30px 4px 0 0;
            color: #FFF;
            height: 30px;
            font-size: 14px;
            overflow: hidden;
            line-height: 30px;
            font-weight: bolder;
        }
        .navbar-menu a {
            color: #fff;
            padding: 3px 6px;
            margin-right: 3px;
            font-weight: normal;
            border-radius: 100px;
            text-decoration: none;
        }
        .navbar-menu i {
            float: left;
            color: #fff;
            margin-right: 14px;
            font-style: normal;
            font-weight: normal;
        }
        .navbar-menu a:hover {
            color: #DA0B3C;
        }
        .copyright {
            width: 100%;
            text-align: center;
            line-height:30px;
        }
    </style>

    <script type="text/javascript" src="${JS}/home/home.js"></script>
</head>
<body>
    <div id="header" class="navbar">
        <div class="navbar-logo">
            <a id="logo" href="javascript:void(0);"><img src="${IMG}/logo.png" ></a>
        </div>
        <div class="navbar-menu">
            <i> 用户：${currentUser.account} </i>
            <a id="modify" href="javascript:void(0);">修改密码</a>
            <a id="logoff" href="javascript:void(0);">退出</a>
        </div>
    </div>
    <div id="footer" class="copyright">
        Copyright <strong>©</strong> lyyzoo
    </div>
</body>
</html>

