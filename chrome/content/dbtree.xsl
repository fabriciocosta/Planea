<?xml version="1.0"  encoding="utf-8" ?>
<xsl:stylesheet version="2.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:regexp="http://exslt.org/regular-expressions">

<xsl:output method="html" indent="yes" version="4.0"/>

<xsl:template match="/">
<html>
	<head>
		<title>DBTree data structure stylesheet template for Proyecto Cultural (EME)</title>
        <link type="text/css" rel="stylesheet" href="../skin/emepro.css"/>
        <link type="text/css" rel="stylesheet" href="../skin/site.css"/>
	</head>
	<body>
		<xsl:apply-templates/>
	</body>
	</html>
</xsl:template>


<xsl:variable name="categorias" select="/arbol/categoria/@clase"/>
<xsl:variable name="ncategorias" select="count($categorias)" as="integer()"/>

<xsl:template match="arbol">
    <div class="info">
    	<div class="proyecto"><xsl:value-of select="proyecto"/></div>
        <div class="creador"><xsl:value-of select="creador"/></div>
        categorias: [<xsl:value-of select="$ncategorias"/>]
        [[        
        <xsl:for-each select="$categorias">
            <br/>
            <xsl:value-of select="."/>
        </xsl:for-each>
        ]]
		<xsl:apply-templates/>		
    </div>
</xsl:template>


<xsl:template match="categoria">
    <li class="categoria item-0 first padre categoria-collapsed">
        <xsl:attribute name="id">cat_<xsl:value-of select="@clase"/>_padre</xsl:attribute>
        <a class="categoria" title="">
            <xsl:attribute name="id">cat_<xsl:value-of select="@clase"/></xsl:attribute>
            <xsl:attribute name="onclick"></xsl:attribute>
            <xsl:value-of select="nombre"/>
            <xsl:value-of select="text()[1]"/><!--backward compatibility old xml-->

        </a>
    </li>
    <ul id ="cat0_cuerpo" class="secciones  deep-0" style="display: block;">
        <xsl:apply-templates/>
    </ul>
</xsl:template>


<xsl:template match="seccion">
    <li id ="secin0_s0_padre" class="seccion padre-collapsed">
        <a id ="secin0_s0">
            (<xsl:value-of select="position()"/>)
            <xsl:value-of select="nombre"/>
            <xsl:value-of select="text()[1]"/><!--backward compatibility old xml-->
        </a>
    </li>
    <ul id ="secin0_s0_cuerpo" class="secciones deep-1"  style="display: block;">
        <xsl:apply-templates/>
    </ul>
</xsl:template>


<xsl:template match="campo[@tipo='texto']">
</xsl:template>


<xsl:template match="campo[@tipo='parrafo']">
</xsl:template>


<xsl:template match="nombre">
</xsl:template>

</xsl:stylesheet>
