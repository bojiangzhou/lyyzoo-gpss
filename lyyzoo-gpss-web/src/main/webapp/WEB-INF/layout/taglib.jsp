<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<%-- 引入标签 --%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@taglib prefix="sf" uri="http://www.springframework.org/tags/form" %>

<%-- 资源路径 --%>
<c:set var="CTX" value="${pageContext.request.contextPath}" />
<c:set var="STATIC_CTX_URL" value="${CTX}/static" />
<c:set var="LIB" value="${STATIC_CTX_URL}/lib" />
<c:set var="JS" value="${STATIC_CTX_URL}/js"/>
<c:set var="CSS" value="${STATIC_CTX_URL}/css"/>
<c:set var="IMG" value="${STATIC_CTX_URL}/img"/>

