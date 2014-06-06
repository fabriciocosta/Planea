<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

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


<xsl:template match="arbol">
    <div class="info">
    	<div class="proyecto"><xsl:value-of select="proyecto"/></div>
        <div class="creador"><xsl:value-of select="creador"/></div>
		<xsl:apply-templates/>		
    </div>
</xsl:template>

<xsl:template match="categoria">
    <li id ="cat_0_padre" class="categoria item-0 first padre categoria-collapsed">
        <a id="cat0" class="categoria" title="">
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
            <xsl:value-of select="nombre"/>
            <xsl:value-of select="text()[1]"/><!--backward compatibility old xml-->
        </a>
    </li>
    <ul id ="secin0_s0_cuerpo" class="secciones deep-1"  style="display: block;">
        <xsl:apply-templates/>
    </ul>
</xsl:template>


<xsl:template match="campo[@tipo='texto']">
    <div class="campo">
        <div class="titulo">
            <label class="titulocampo" title="{AYUDARAPIDA}"><span><xsl:value-of select="text()[1]"/></span></label>
            <div class="marker">
                <div class="markers">
                    <div class="marker-verde marker-selected"></div>
                    <div class="marker_options" id="marcar_{IDCAMPO}_options">
                        <div value="verde" class="marker-verde marker-option"></div>
                        <div value="amarillo" class="marker-amarillo marker-option"></div>
                        <div value="rojo" class="marker-rojo marker-option"></div>
                    </div>
                    <div class="marker_button" id="marcar_{IDCAMPO}_"></div>
                </div>
            </div>
            <div class="ayuda" id="ayuda_{IDCAMPO}_"></div>            
            <div class="texto-ayuda" id="ayuda_{IDCAMPO}_cuerpo"><img border="0" class="tri" src="img/tri_amarillo.png"/>
                <span>{AYUDARAPIDA}</span>
            </div>
        </div>
        <div class="entrada">
            <input id="input_{IDCAMPO}" type="text" value="{VALOR}" 
                onfocus="javascript:OpenHelp('{PATHCAMPO}');" 
                onkeyup="javascript:SaveField('{PATHCAMPO}','input_{IDCAMPO}');"/>
        </div>
    </div>
</xsl:template>


<xsl:template match="campo[@tipo='parrafo']">
    <div class="campo">
        <div class="titulo">
            <label class="titulocampo" title="{AYUDARAPIDA}"><span><xsl:value-of select="text()[1]"/></span></label>
            <div class="marker">
                <div class="markers">
                    <div class="marker-verde marker-selected"></div>
                    <div class="marker_options" id="marcar_{IDCAMPO}_options">
                        <div value="verde" class="marker-verde marker-option"></div>
                        <div value="amarillo" class="marker-amarillo marker-option"></div>
                        <div value="rojo" class="marker-rojo marker-option"></div>
                    </div>
                    <div class="marker_button" id="marcar_{IDCAMPO}_"></div>
                </div>
            </div>
            <div class="ayuda" id="ayuda_{IDCAMPO}_"></div>            
            <div class="texto-ayuda" id="ayuda_{IDCAMPO}_cuerpo"><img border="0" class="tri" src="img/tri_amarillo.png"/>
                <span>{AYUDARAPIDA}</span>
            </div>
        </div>
        <div class="entrada">
            <textarea class="parrafo" id="parrafo_{IDCAMPO}" style="display: block;" rows="7"
                onfocus="javascript:OpenHelp('{PATHCAMPO}');"
                onkeyup="javascript:SaveField('{PATHCAMPO}','parrafo_{IDCAMPO}')"
            ></textarea>
        </div>
    </div>
</xsl:template>


<xsl:template match="nombre">
</xsl:template>

</xsl:stylesheet>
