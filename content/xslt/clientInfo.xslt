<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
    
    <xsl:template match="/">
      <xsl:for-each select="Messages/item">
        <div class="eQuoteAppMessage">
            <xsl:value-of select="Message" />
        </div>
      </xsl:for-each>
    </xsl:template>
  
</xsl:stylesheet>