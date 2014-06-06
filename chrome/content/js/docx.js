

//----------------------------------------------------------
// Copyright (C) Microsoft Corporation. All rights reserved.
// Released under the Microsoft Office Extensible File License
// https://raw.github.com/stephen-hardy/docx.js/master/LICENSE.txt
//----------------------------------------------------------
var MAX_VERTICAL_PAGEWIDTH = 8640;
var MAX_HORIZONTAL_PAGEWIDTH = 14000;
var MAX_VERTICAL_EXTENT_CX 	=   5486400;
var MAX_HORIZONTAL_EXTENT_CX = 10000000;

var drawing_ml_template = '<w:p><w:pPr><w:pStyle w:val="style0"/><w:jc w:val="left"/><w:rPr></w:rPr></w:pPr><w:r><w:rPr></w:rPr><w:drawing><wp:anchor allowOverlap="1" behindDoc="0" distB="0" distL="0" distR="0" distT="0" layoutInCell="1" locked="0" relativeHeight="0" simplePos="0"><wp:simplePos x="0" y="0"/><wp:positionH relativeFrom="column"><wp:posOffset>0</wp:posOffset></wp:positionH><wp:positionV relativeFrom="paragraph"><wp:posOffset>0</wp:posOffset></wp:positionV><wp:extent cx="{EXTENTCX}" cy="{EXTENTCY}"/><wp:effectExtent b="0" l="0" r="0" t="0"/><wp:wrapSquare wrapText="largest"/><wp:docPr descr="" id="0" name="Picture"></wp:docPr><wp:cNvGraphicFramePr><a:graphicFrameLocks noChangeAspect="1" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"/></wp:cNvGraphicFramePr><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr descr="" id="0" name="Picture"></pic:cNvPr><pic:cNvPicPr><a:picLocks noChangeArrowheads="1" noChangeAspect="1"/></pic:cNvPicPr></pic:nvPicPr><pic:blipFill><a:blip r:embed="{RID}"/><a:srcRect/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr bwMode="auto"><a:xfrm><a:off x="0" y="0"/><a:ext cx="{EXTENTCX}" cy="{EXTENTCY}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/><a:ln w="9525"><a:noFill/><a:miter lim="800000"/><a:headEnd/><a:tailEnd/></a:ln></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:anchor></w:drawing></w:r></w:p>';

var page_break_horizontal_start_section = '<w:p><w:pPr><w:sectPr><w:type w:val="nextPage"/><w:pgSz w:h="15840" w="12240"/><w:pgMar w:bottom="1440" w:footer="0" w:gutter="0" w:header="0" w:left="1800" w:right="1800" w:top="1440"/><w:pgNumType w:fmt="decimal"/><w:formProt w:val="false"/><w:textDirection w:val="lrTb"/><w:docGrid w:charSpace="4096" w:linePitch="240" w:type="default"/></w:sectPr><w:pStyle w:val="style0"/><w:jc w:val="left"/><w:rPr></w:rPr></w:pPr><w:r><w:rPr></w:rPr></w:r></w:p>';

var page_break_horizontal_end_section = '<w:sectPr><w:type w:val="nextPage"/><w:pgSz w:h="12240" w:orient="landscape" w="15840"/><w:pgMar w:bottom="1134" w:footer="0" w:gutter="0" w:header="0" w:left="1134" w:right="1134" w:top="1134"/><w:pgNumType w:fmt="decimal"/><w:formProt w:val="false"/><w:textDirection w:val="lrTb"/></w:sectPr>';

var page_break_vertical = '<w:p><w:pPr><w:sectPr><w:type w:val="nextPage"/><w:pgSz w:h="15840" w="12240"/><w:pgMar w:bottom="1440" w:footer="0" w:gutter="0" w:header="0" w:left="1800" w:right="1800" w:top="1440"/><w:pgNumType w:fmt="decimal"/>	<w:formProt w:val="false"/><w:textDirection w:val="lrTb"/><w:docGrid w:charSpace="4096" w:linePitch="240" w:type="default"/></w:sectPr><w:pStyle w:val="style0"/><w:jc w:val="left"/><w:rPr></w:rPr></w:pPr><w:r><w:rPr></w:rPr><w:tab/></w:r></w:p>';

var page_break_before = '<w:p><w:pPr><w:pStyle w:val="style0"/><w:pageBreakBefore/><w:jc w:val="left"/><w:rPr><w:color w:val="000000"/><w:sz w:val="26"/></w:rPr></w:pPr><w:r><w:rPr><w:color w:val="000000"/><w:sz w:val="26"/></w:rPr><w:t></w:t></w:r></w:p>';

var page_break_vertical_start_section = '<w:p><w:pPr><w:sectPr><w:type w:val="nextPage"/><w:pgSz w:h="15840" w:w="12240"/><w:pgMar w:bottom="1440" w:footer="0" w:gutter="0" w:header="0" w:left="1800" w:right="1800" w:top="1440"/><w:pgNumType w:fmt="decimal"/><w:formProt w:val="false"/><w:textDirection w:val="lrTb"/><w:docGrid w:charSpace="8192" w:linePitch="260" w:type="default"/></w:sectPr><w:pStyle w:val="style0"/><w:jc w:val="left"/><w:rPr></w:rPr></w:pPr><w:r><w:rPr></w:rPr></w:r></w:p>';

var page_last_section_vertical ='<w:sectPr><w:type w:val="nextPage"/><w:pgSz w:h="15840" w="12240"/><w:pgMar w:bottom="1440" w:footer="0" w:gutter="0" w:header="0" w:left="1800" w:right="1800" w:top="1440"/><w:pgNumType w:fmt="decimal"/><w:formProt w:val="false"/><w:textDirection w:val="lrTb"/><w:docGrid w:charSpace="20480" w:linePitch="320" w:type="default"/></w:sectPr>';

function convertContent(input, images ) { 'use strict'; // Convert HTML to WordprocessingML, and vice versa
	
	var output, inputDoc, i, j, k, id, doc, inNode, inNodeChild, outNode, outNodeChild, styleAttrNode, pCount = 0, tempStr, tempNode, val, fullstr="";
	var maxiterations = 15;
	
	function newXMLnode(name, text) {
		var el = doc.createElement('w:' + name);
		if (text) { el.appendChild(doc.createTextNode(text)); }
		return el;
	}
	
	function newHTMLnode(name, html) {
		var el = document.createElement(name);
		el.innerHTML = html || '';
		return el;
	}
	
	function addDocxXml( XmlDocx /*Node or String xml*/, outDocNode ) {
		
		/*Hack: we cannot use w:xxx, and namespace use is a little too dark in MDN, so we hack the namespace*/
		if (typeof XmlDocx == "string" ) { 
			var tpl = XmlDocx.replace( /:/gi , "twopoints" );
			tpl = tpl.replace( /httptwopoints/gi , "http:" );

			var parser = new DOMParser();
			XmlDocx = parser.parseFromString( tpl, "text/xml");
		}
		
		var childN;
		
		for( var nn=0; childN = XmlDocx.childNodes[nn]; nn++ ) {
		
			var nodename = childN.nodeName;
			var nodenamex = nodename.split("twopoints");
			
			var n_word = nodenamex[0];
			var n_name = nodenamex[1];
			
			//log("addDocxXml: n_word:"+n_word+" n_name:"+ n_name);			
			
			var newElem;				
			if ( n_word !== "#text" && n_name )
				newElem = doc.createElement( n_word + ':' + n_name );
			else
				newElem = doc.createTextNode( childN.nodeValue );
			
			if ( childN.hasAttributes() ) {  
				var its; 
				var a = 0;								
				for ( a=0; a < childN.attributes.length; a++ ) {  
					its = childN.attributes.item(a);  
					var attrnodename = its.nodeName;
					var attrnodenamex = attrnodename.split("twopoints");
					var attr_value = buildValue( its.value );
					var newattr = (attrnodenamex[1]==undefined) ? attrnodenamex[0] : attrnodenamex[0]+":"+attrnodenamex[1];
					if (newattr=="w:val") newattr="val";
					newElem.setAttribute( newattr, its.value  );
				}  
			}				
			
			var outDocNodeChild = outDocNode.appendChild( newElem );
			addDocxXml( childN, outDocNodeChild );
		}			
		
	}
	
	
	function convertHtmlImg( inHtmlNode, outNodeX, table_info, iterations ) {
	
		//log("convertHtmlImg() > iteration:" + iterations+ " inHtmlNode:"+inHtmlNode.outerHTML );
		if (inHtmlNode.outerHTML==undefined) { error("convertImg() > html is undefined"); return;}		
		if (iterations++>maxiterations) { error("convertImg() > Too much iterations!"); return; }
		
		if (inHtmlNode.nodeName.toLowerCase()!=="img" ) {
			return;
		}
		
		var filenameattr = GetAttribute(inHtmlNode, "filename");
		var dimensions = GetAttribute(inHtmlNode, "dimensions");
		
		if (!dimensions) return;
		
		var dimensionsx = dimensions.split("x");
		var wi = dimensionsx[0];
		var he = dimensionsx[1];
		
		var rid = "rIdXXX";
		
		if (filenameattr) {
			var media_image = images[ filenameattr ];
			if (media_image) {
				rid = media_image["rid"];
				log("convertHtmlImg() > media_image found! filename id ["+filenameattr+"] DOCX rid ["+rid+"]");
			} else { error("convertHtmlImg() > media_image not defined for "+ filenameattr); return; } 
		} else { error("convertHtmlImg() > <img filename attribute not defined! >> " + inHtmlNode.outerHTML); return; }
		
		var styled = window.getComputedStyle( inHtmlNode );
		var img_width = styled.width;
		var img_height = styled.height;
		
		if (img_width.indexOf("%")>=0) {
			img_width = parseInt(wi);
			img_height = parseInt(he);
		}
		
		var wt = table_info["table_width"];
		var wc = table_info["cell_width"];
		
		//log("convertHtmlImg() > img_width:" + img_width+" img_height:" + img_height );
		
		var extentcx = MAX_VERTICAL_EXTENT_CX; //change this to full page width... in english units...(?)
		var extentcy = parseInt( Math.abs( (extentcx*img_height) / img_width ) );
		
		if (wc!=undefined && !isNaN(wc)) {
			var wc_converted = wc * MAX_VERTICAL_EXTENT_CX / MAX_VERTICAL_PAGEWIDTH;
			extentcx = parseInt(wc_converted);
			extentcy = parseInt( Math.abs( (extentcx*img_height) / img_width ) );
		}
		
		if (isNaN(extentcy)) extentcy = parseInt(extentcx/2);
		
		//log("convertHtmlImg() > extentcx:" + extentcx+" extentcy:" + extentcy );
		
		var tpl = drawing_ml_template.replace( /\{EXTENTCX\}/gi , extentcx );
		tpl = tpl.replace( /\{EXTENTCY\}/gi , extentcy );
		tpl = tpl.replace( /\{RID\}/gi , rid );
		
	
		//var outNode2 = outNodeX.appendChild( newXMLnode("p") );		
		addDocxXml( tpl, outNodeX );
		
	}
	
	function convertHtmlTable( inHtmlNode, outNodeX, table_info, iterations ) {
	
	
		//log("convertHtmlTable() > iteration:" + iterations+ " inHtmlNode:"+inHtmlNode.outerHTML );
		if (inHtmlNode.outerHTML==undefined) { error("convertHtmlTable() > html is undefined"); return;}
		if (iterations++>maxiterations) { error("convertHtmlTable() > Too much iterations!"); return; }
		
		if (inHtmlNode.nodeName.toLowerCase()!=="table" ) {
			return;
		}
		
		if (!inHtmlNode.childNodes) {
			error("convertHtmlTable()  > no child nodes in TABLE : " +inHtmlNode.outerHTML );
			return;
		}
		
		
		var tblstyled = window.getComputedStyle( inHtmlNode );
		var tblstyled_width = parseInt(tblstyled.width);
		
		var xml_width = MAX_VERTICAL_PAGEWIDTH; /* MAX_VERTICAL_PAGEWIDTH = 8640; */
		if (table_info["cell_width"]) xml_width =  table_info["cell_width"];
		
		var tableNode = outNodeX.appendChild(newXMLnode('tbl'));
		var new_table_info = [];
		new_table_info["table_width"] = xml_width;
		
		
		/** TABLE STYLE settings */
		var tableStyle = tableNode.appendChild(newXMLnode('tblPr'));
			tableStyle.appendChild(newXMLnode("jc")).setAttribute("w","left");
		var tableStyleIndexation = tableStyle.appendChild(newXMLnode("tblInd"));
			tableStyleIndexation.setAttribute("type","dxa");
			tableStyleIndexation.setAttribute("w","0");
		//var tableStyleW = tableStyle.appendChild( newXMLnode("tblW"));
		//	tableStyleW.setAttribute("type","dxa");
		//	tableStyleW.setAttribute("w",""+xml_width+"");			
		var tableStyleBorders = tableStyle.appendChild( newXMLnode("tblBorders"));
			tableStyleBorders.appendChild( newXMLnode("top")).setAttribute("val","nil");
			tableStyleBorders.appendChild( newXMLnode("left")).setAttribute("val","nil");
			tableStyleBorders.appendChild( newXMLnode("bottom")).setAttribute("val","nil");
			tableStyleBorders.appendChild( newXMLnode("insideH")).setAttribute("val","nil");
			tableStyleBorders.appendChild( newXMLnode("right")).setAttribute("val","nil");
			tableStyleBorders.appendChild( newXMLnode("insideV")).setAttribute("val","nil");
		var tableStyleCellMar = tableStyle.appendChild( newXMLnode("tblCellMar"));
		
		var tableStyleCellMarTop = tableStyleCellMar.appendChild( newXMLnode("top"));
			tableStyleCellMarTop.setAttribute("type","dxa");
			tableStyleCellMarTop.setAttribute("w","0");
			
		var tableStyleCellMarLeft = tableStyleCellMar.appendChild( newXMLnode("left"));
			tableStyleCellMarLeft.setAttribute("type","dxa");
			tableStyleCellMarLeft.setAttribute("w","0");
		
		var	tableStyleCellMarBottom = tableStyleCellMar.appendChild( newXMLnode("bottom"));
			tableStyleCellMarBottom.setAttribute("type","dxa");
			tableStyleCellMarBottom.setAttribute("w","0");			
			
		var	tableStyleCellMarRight = tableStyleCellMar.appendChild( newXMLnode("right"));
			tableStyleCellMarRight.setAttribute("type","dxa");
			tableStyleCellMarRight.setAttribute("w","0");		
		
		/** GRID settings */
		var tableGrid = tableNode.appendChild(newXMLnode('tblGrid'));
		
		var rowcells = evaluateXPath( inHtmlNode, "thead/tr/td");
		//if (rowcells.length==0) rowcells = evaluateXPath( inHtmlNode, "tr/td");
		
		if (rowcells.length==0) { error("convertHtmlTable() > no cells!"); return;}
		
		var lencells = rowcells.length;
		var cellwidth = xml_width / lencells;
		//log("convertHtmlTable() > lencells:" + lencells+" for:" + inHtmlNode.outerHTML );
		for(var c in rowcells ) {		
			var rcell = rowcells[ c ];
			var styled = window.getComputedStyle(rcell);			
			var cellsw = parseInt(styled.width);
			
			if (!isNaN(cellsw) 
				&& cellsw>0 
				&& !isNaN( tblstyled_width ) 
				&& tblstyled_width>0 ) {
				
				cellwidth = ( xml_width * cellsw) / tblstyled_width;
			}
			//log("convertHtmlTable() > cellwidth:" + cellwidth );
			tableGrid.appendChild(newXMLnode("gridCol")).setAttribute( "w", cellwidth );
		}
		new_table_info["cell_width"] = cellwidth;
		
		/** ROWS iteration */
		var inNodeTable;
		for (var b = 0; inNodeTable = inHtmlNode.childNodes[b]; b++) {
		
			if (inNodeTable.nodeName.toLowerCase() == 'tr') {
				convertHtmlRow( inNodeTable , tableNode, new_table_info, iterations )
			}
			
			if (inNodeTable.nodeName.toLowerCase() == 'tbody' 
				|| inNodeTable.nodeName.toLowerCase() == 'thead'
				|| inNodeTable.nodeName.toLowerCase() == 'tfoot') {
				var inRow;
				for (var z = 0; inRow = inNodeTable.childNodes[z]; z++) {
					//log("convertHtmlTable() > row z ["+z+"] in ["+inNodeTable.nodeName+"]");
					if (inRow.nodeName.toLowerCase()=="tr") {
						convertHtmlRow( inRow , tableNode, new_table_info, iterations )
					}
				}
			}
		}
	}

	function convertHtmlRow( inHtmlRowNode, tableNodeX, table_info, iterations ) {
		//log("convertHtmlRow() > iterations:" + iterations +" for:" + inHtmlRowNode.outerHTML );
		if (inHtmlRowNode.outerHTML==undefined) { error("convertHtmlRow() > html is undefined"); return;}
		if (iterations++>maxiterations) { error("convertHtmlRow() > Too much iterations!"); return; }
		
		var tableRow = tableNodeX.appendChild(newXMLnode('tr'));
		var tableRowStyle = tableRow.appendChild(newXMLnode('trPr'));	
			tableRowStyle.appendChild(newXMLnode('cantSplit')).setAttribute("val","false");// <w:cantSplit w:val="false"/>
		var inHtmlCell;
		for (var y = 0; inHtmlCell = inHtmlRowNode.childNodes[y]; y++ ) {
			if (inHtmlCell.nodeName.toLowerCase() == "td" ) {
				convertHtmlCell( inHtmlCell , tableRow, table_info, iterations );
			}
		}
	}

	function convertHtmlCell( inHtmlCellNode, tableRowNodeX, table_info, iterations ) {
		//log("convertHtmlCell() > iterations:" + iterations +" for:" + inHtmlCellNode.outerHTML );
		if (inHtmlCellNode.outerHTML==undefined) { error("convertHtmlCell() > html is undefined"); return;}
		if (iterations++>maxiterations) { error("convertHtmlCell() > Too much iterations!"); return; }
		
		var tableCell = tableRowNodeX.appendChild( newXMLnode('tc') );
		var tableCellStyle = tableCell.appendChild( newXMLnode('tcPr') );
		/*
		var tableCellStyleW = tableCellStyle.appendChild( newXMLnode('tcW') ) ;
			tableCellStyleW.setAttribute("type","dxa");
			tableCellStyleW.setAttribute("w",table_info["cell_width"]);
			*/
		
		var tableCellStyleBorders = tableCellStyle.appendChild( newXMLnode('tcBorders') ) ;
			tableCellStyleBorders.appendChild( newXMLnode('top') ).setAttribute("w","0");
			tableCellStyleBorders.appendChild( newXMLnode('left') ).setAttribute("w","0");
			tableCellStyleBorders.appendChild( newXMLnode('bottom') ).setAttribute("w","0");
			tableCellStyleBorders.appendChild( newXMLnode('right') ).setAttribute("w","0");
			
		var tableCellStyleShd = tableCellStyle.appendChild( newXMLnode('shd') ) ;
			tableCellStyleShd.setAttribute("fill","FFFFFF");
			tableCellStyleShd.setAttribute("val","clear");
	
		convertHtml( inHtmlCellNode, tableCell, table_info, iterations );
	}
	
	function convertHtmlSimpleText( inHtmlNode, outNodeX, options, iterations ) {
	
		//log("convertHtmlSimpleText() > iterations:" + iterations +" for:" + inHtmlNode+" text:"+ inHtmlNode.nodeValue );
		
		if (inHtmlNode==undefined) { error("convertHtmlSimpleText() > html is undefined"); return;}
		if (iterations++>maxiterations) { error("convertHtmlSimpleText() > Too much iterations!"); return; }
		
		if (inHtmlNode.nodeName !== '#text') {
			error("convertHtmlSimpleText() > not a text node");
			return;
		}
	
		//log("convertHtmlSimpleText() > outNode.nodeName ["+outNode.nodeName+"] text value ["+inHtmlNode.nodeValue+"]");
		
		/*
		var outSimpleTextNode = outNode.appendChild(newXMLnode('p'));
		
		if (inHtmlNode.style.textAlign) {
			outSimpleTextNode.appendChild(newXMLnode('pPr')).appendChild(newXMLnode('jc')).setAttribute('val', inHtmlNode.style.textAlign);
		}*/
		var outNodeX2;
		if (	outNodeX.nodeName!='w:p' 
			&& 	outNodeX.nodeName!='w:r') {
			outNodeX2 = outNodeX.appendChild(newXMLnode('p'));
			//log("convertHtmlSimpleText() > creating p node in outNode.nodeName ["+outNode.nodeName+"] text value ["+inHtmlNode.nodeValue+"]");
		}
		
		var outNodeX3;
		if (outNodeX2) {
			if (outNodeX2.nodeName=='w:p') {
				outNodeX3 = outNodeX2.appendChild(newXMLnode('r'));
			}
		} else {
			if (outNodeX.nodeName=='w:p') {
				outNodeX3 = outNodeX.appendChild(newXMLnode('r'));
			}
		}
		
		if (outNodeX3 && outNodeX3.nodeName=='w:r') {
			outNodeX3.appendChild(newXMLnode('t', inHtmlNode.nodeValue.replace(/\n/gi,"") ));
		} else if (outNodeX.nodeName=='w:r') {
			outNodeX.appendChild(newXMLnode('t', inHtmlNode.nodeValue.replace(/\n/gi,"") ));	
		} else error("convertHtmlSimpleText() > parent output node is not a <w:r> node!");
	}
	
	var oldSection = "vertical";
	
	function startPageBreak( inHtmlNode, outNodeX, options, iterations ) {
		if (inHtmlNode.nodeName.toLowerCase() == 'pagebreak') {
			var tpl = page_break_horizontal_start_section;
			addDocxXml( tpl, outNodeX);
		}
	}
	
	function startNextPage( inHtmlNode, outNodeX, options, iterations ) {
		
		if (inHtmlNode.nodeName.toLowerCase() == 'newpage') {
			
			var page_orientation = inHtmlNode.getAttribute("orientation");
			
			var page_section = inHtmlNode.getAttribute("section");
			
			var tpl = page_break_before;
			
			
			if ( page_orientation == 'horizontal' ) {
			
				if (page_section == "start") {
				
					tpl = page_break_horizontal_start_section;
					
				} else if (page_section == "end" ) {
				
					tpl = page_break_horizontal_end_section;
					
				}
			}
			
			log("startNextPage() > page_orientation: " + page_orientation+" section:"+page_section+" content:" + tpl );
			
			addDocxXml( tpl, outNodeX);
			
		}
		
	}

	function convertHtml( inHtmlNode, outNodeX, options, iterations ) {
	
		//log("convertHtml() > iterations:" + iterations + " nodeName:" + inHtmlNode.nodeName +" for:" + inHtmlNode.outerHTML );
		if (inHtmlNode.outerHTML==undefined) { error("convertHtml() > html is undefined"); return;}
		
		if ( iterations++ > maxiterations ) { error("convertHtml() > Too much iterations!"); return; }
		
		if (!inHtmlNode.childNodes) {
			error("convertHtml() > empty html node");
			return;
		}
		var inNodeT;
		for ( var h = 0; inNodeT = inHtmlNode.childNodes[h]; h++) {
			//log("convertHtml() > iterating over html node:" + inNodeT.nodeName );
			if (inNodeT.nodeName.toLowerCase() == 'table') {
			
				//log("convertHtml() > iterating over TABLE node:" + inNode.nodeName );
				//if (inNodeT.parentNode.nodeName.toLowerCase()=="td" ) log("convertHtmlCell() > calling intra tables!!! ");
				
				//if (inNodeT.parentNode.nodeName.toLowerCase()!="td" )
				//alert( "TABLE > inNodeT.innerHTML:"+inNodeT.innerHTML);
				//alert( " inHtmlNode.outerHTML:"+inHtmlNode.outerHTML);
				convertHtmlTable( inNodeT, outNodeX, options, iterations );
				
				
			} else if (inNodeT.nodeName.toLowerCase() == '#text') {				
				//log("convertHtml() > iterating over #text node:" + inNode.nodeName );
				convertHtmlSimpleText( inNodeT, outNodeX, options, iterations );
			} else if (inNodeT.nodeName.toLowerCase() == 'img') {
				convertHtmlImg( inNodeT, outNodeX, options, iterations );
			} else if (inNodeT.nodeName.toLowerCase() == 'newpage') {
				startNextPage( inNodeT, outNodeX, options, iterations );
			} else if (inNodeT.nodeName.toLowerCase() == 'pagebreak') {
				startPageBreak( inNodeT, outNodeX, options, iterations );
			} else if (
			
				["span","div","font","a","p","b","u","i"].indexOf( inNodeT.nodeName.toLowerCase() ) 
			
			) {
				
				//log("convertHtml() > iterating over structured node:" + inNode.nodeName + " html:"+inNode.innerHTML );		
				
				if (outNodeX.nodeName == 'w:body' || outNodeX.nodeName == 'w:tc' || outNodeX.nodeName == 'w:r' ) {
					var outNode2 = outNodeX;
					if (outNodeX.nodeName!='w:r') {
						//PARAGRAPH styling
					
						var styled = window.getComputedStyle( inNodeT );
						var outStructuredNode = outNodeX.appendChild(newXMLnode('p'));
						
						if (styled.textAlign) {
							outStructuredNode.appendChild(newXMLnode('pPr')).appendChild(newXMLnode('jc')).setAttribute('val', styled.textAlign);
						}						
						
						var outNodeChild = outStructuredNode.appendChild(newXMLnode('r'));				
						var styleAttrNode = outNodeChild.appendChild(newXMLnode('rPr'));
						
						outNode2 = outNodeChild;
						
						if (styled.fontWeight == "bold") styleAttrNode.appendChild(newXMLnode('b'));					
						if (styled.fontStyle == "italic") styleAttrNode.appendChild(newXMLnode('i'));					
						if (styled.textDecoration == "underline") styleAttrNode.appendChild(newXMLnode('u'));					
						if (styled.textDecoration == "strike") styleAttrNode.appendChild(newXMLnode('strike'));
						if (styled.backgroundColor) styleAttrNode.appendChild(newXMLnode('highlight')).setAttribute('val', color(styled.backgroundColor));
						if (styled.color) styleAttrNode.appendChild(newXMLnode('color')).setAttribute('val', color(styled.color));
						if (styled.fontSize) styleAttrNode.appendChild(newXMLnode('sz')).setAttribute('val', parseInt(styled.fontSize, 10) * 2);
					}
					
					convertHtml( inNodeT, outNode2, options, iterations );
					
				} else {
				
					convertHtmlSimpleText( inNodeT, outNodeX, options, iterations );//remember to put some... styling here!!!!!
					
				}
			} else {
				/*JUST ITERATE: do nothing*/
				convertHtml( inNodeT, outNodeX, options, iterations );
			}
		}
	}	
	
	function color(str) { // Return hex or named color
		if (str.charAt(0) === '#') { return str.substr(1); }
		if (str.indexOf('rgb') < 0) { return str; }
		var values = /rgb\((\d+), (\d+), (\d+)\)/.exec(str), red = +values[1], green = +values[2], blue = +values[3];
		return (blue | (green << 8) | (red << 16)).toString(16);
	}
	
	function toXML(str) { return new DOMParser().parseFromString(str.replace(/<[a-zA-Z]*?:/g, '<').replace(/<\/[a-zA-Z]*?:/g, '</'), 'text/xml').firstChild; }
	
	if (input.files) { // input is zip file object (JSZip last version)
		inputDoc = toXML(input.file('word/document.xml').asText()).getElementsByTagName('body')[0];
		fullstr = "";
		output = newHTMLnode('DIV');
		for (i = 0; inNode = inputDoc.childNodes[i]; i++) {
			j = inNode.childNodes.length;
			outNode = output.appendChild(newHTMLnode('P'));
			tempStr = '';
			for (j = 0; inNodeChild = inNode.childNodes[j]; j++) {
				if (inNodeChild.nodeName === 'pPr') {
					if (styleAttrNode = inNodeChild.getElementsByTagName('jc')[0]) { outNode.style.textAlign = styleAttrNode.getAttribute('w:val'); }
				}
				if (inNodeChild.nodeName === 'r') {
					val = inNodeChild.textContent;
					if (inNodeChild.getElementsByTagName('b').length) { val = '<b>' + val + '</b>'; }
					if (inNodeChild.getElementsByTagName('i').length) { val = '<i>' + val + '</i>'; }
					if (inNodeChild.getElementsByTagName('u').length) { val = '<u>' + val + '</u>'; }
					if (inNodeChild.getElementsByTagName('strike').length) { val = '<s>' + val + '</s>'; }
					if (styleAttrNode = inNodeChild.getElementsByTagName('vertAlign')[0]) {
						if (styleAttrNode.getAttribute('w:val') === 'subscript') { val = '<sub>' + val + '</sub>'; }
						if (styleAttrNode.getAttribute('w:val') === 'superscript') { val = '<sup>' + val + '</sup>'; }
					}
					if (styleAttrNode = inNodeChild.getElementsByTagName('sz')[0]) { val = '<span style="font-size:' + (styleAttrNode.getAttribute('w:val') / 2) + 'pt">' + val + '</span>'; }
					if (styleAttrNode = inNodeChild.getElementsByTagName('highlight')[0]) { val = '<span style="background-color:' + styleAttrNode.getAttribute('w:val') + '">' + val + '</span>'; }
					if (styleAttrNode = inNodeChild.getElementsByTagName('color')[0]) { val = '<span style="color:#' + styleAttrNode.getAttribute('w:val') + '">' + val + '</span>'; }
					if (styleAttrNode = inNodeChild.getElementsByTagName('blip')[0]) {
						id = styleAttrNode.getAttribute('r:embed');
						tempNode = toXML(input.file('word/_rels/document.xml.rels').asText() );
						k = tempNode.childNodes.length;
						while (k--) {
							if (tempNode.childNodes[k].getAttribute('Id') === id) {
								val = '<img src="data:image/png;base64,' + JSZipBase64.encode(input.file('word/' + tempNode.childNodes[k].getAttribute('Target')).asText() ) + '">';
								break;
							}
						}
					}
					tempStr += val;
					//log("val:" + val);
				}
				outNode.innerHTML = tempStr;
			}
			fullstr+= '<P>'+tempStr+'</P>';
		}
		output = { fullhtml: fullstr, DOM: output };
	}
	else if (input.nodeName) { // input is HTML DOM
		doc = new DOMParser().parseFromString('<root></root>', 'text/xml')
		doc.getElementsByTagName('root')[0].appendChild(newXMLnode('body'));
		output = doc.getElementsByTagName('w:body')[0];
		var htmlbody = evaluateXPath( input, "body" );
		convertHtml( htmlbody[0], output, {}, 0 );
		/*
		for (i = 0; inNode = input.childNodes[i]; i++) {
		
			outNode = output.appendChild(newXMLnode('p'));
			pCount++;
			
			if (inNode.style.textAlign) { 
				outNode.appendChild(newXMLnode('pPr')).appendChild(newXMLnode('jc')).setAttribute('val', inNode.style.textAlign); 
			}
			
			if (inNode.nodeName === '#text') { 
				outNode.appendChild(newXMLnode('r')).appendChild(newXMLnode('t', inNode.nodeValue));
			}
			else if (inNode.nodeName === 'table') {
				convertHtmlTable( inNode, outNode );
			}			
			else {
				for (j = 0; inNodeChild = inNode.childNodes[j]; j++) {
					outNodeChild = outNode.appendChild(newXMLnode('r'));
					if (inNodeChild.nodeName !== '#text') {
						
						styleAttrNode = outNodeChild.appendChild(newXMLnode('rPr'));
						
						tempStr = inNodeChild.outerHTML;
						
						if (tempStr.indexOf('<b>') > -1) { styleAttrNode.appendChild(newXMLnode('b')); }
						if (tempStr.indexOf('<i>') > -1) { styleAttrNode.appendChild(newXMLnode('i')); }
						if (tempStr.indexOf('<u>') > -1) { styleAttrNode.appendChild(newXMLnode('u')).setAttribute('val', 'single'); }
						if (tempStr.indexOf('<s>') > -1) { styleAttrNode.appendChild(newXMLnode('strike')); }
						if (tempStr.indexOf('<sub>') > -1) { styleAttrNode.appendChild(newXMLnode('vertAlign')).setAttribute('val', 'subscript'); }
						if (tempStr.indexOf('<sup>') > -1) { styleAttrNode.appendChild(newXMLnode('vertAlign')).setAttribute('val', 'superscript'); }
						
						if (tempNode = inNodeChild.nodeName === 'SPAN' ? inNodeChild : inNodeChild.getElementsByTagName('SPAN')[0]) { 
							if (tempNode.style.fontSize) { 
								styleAttrNode.appendChild(newXMLnode('sz')).setAttribute('val', parseInt(tempNode.style.fontSize, 10) * 2); }
							else if (tempNode.style.backgroundColor) { 
								styleAttrNode.appendChild(newXMLnode('highlight')).setAttribute('val', color(tempNode.style.backgroundColor)); }
							else if (tempNode.style.color) { 
								styleAttrNode.appendChild(newXMLnode('color')).setAttribute('val', color(tempNode.style.color));
							}
						}
					}
					outNodeChild.appendChild(newXMLnode('t', inNodeChild.textContent));
				}
			}
		}
		*/
		//alert("worked ok!");
		
		output = { 
			string: new XMLSerializer().serializeToString(output)
						.replace(/<w:t>/g, '<w:t xml:space="preserve">')
						.replace(/val=/g, 'w:val=')
						.replace(/w=/g, 'w:w='), 
			charSpaceCount: input.textContent.length, charCount: input.textContent.replace(/\s/g, '').length, pCount: pCount
		};
		//log("convertContent: from html node to xml: " + output.string);
		
	}
	return output;
}

function docx(file) { 'use strict'; // v1.0.1
	var result, zip = new JSZip(), zipTime, processTime, docProps, word, content;
	log("typeof file:" + (typeof file ));
	if (file.DOM == undefined) { // Load
		log ("docx() -> Load");
		zipTime = Date.now();
		zip = zip.load(file);//, { base64: true }
		result = { zipTime: Date.now() - zipTime };
		processTime = Date.now();
		
		//{ Get file info from "docProps/core.xml"
			var s = zip.file('docProps/core.xml').asText();
			s = s.substr(s.indexOf('<dc:creator>') + 12);
			result.creator = s.substring(0, s.indexOf('</dc:creator>'));
			s = s.substr(s.indexOf('<cp:lastModifiedBy>') + 19);
			result.lastModifiedBy = s.substring(0, s.indexOf('</cp:lastModifiedBy>'));			
			s = s.substr(s.indexOf('<dcterms:created xsi:type="dcterms:W3CDTF">') + 43);
			result.created = new Date(s.substring(0, s.indexOf('</dcterms:created>')));			
			s = s.substr(s.indexOf('<dcterms:modified xsi:type="dcterms:W3CDTF">') + 44);
			result.modified = new Date(s.substring(0, s.indexOf('</dcterms:modified>')));
		//}
		var convertoutput = convertContent(zip);
		result.DOM = convertoutput.DOM;
		result.fullhtml = convertoutput.fullhtml;
		result.processTime = Date.now() - processTime;
	}
	else { // Save
		log ("docx() -> Save");
		//file is docx loaded by new docx(...), content is in file.DOM (output.childNodes? mmm it needs a nodeName)
		processTime = Date.now();
		var sharedStrings = [[], 0];
		//{ Fully static
			zip.file('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/stylesWithEffects.xml" ContentType="application/vnd.ms-word.stylesWithEffects+xml"/><Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/><Override PartName="/word/webSettings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.webSettings+xml"/><Override PartName="/word/fontTable.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.fontTable+xml"/><Override PartName="/word/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>');
			zip.folder('_rels').file('.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');
			docProps = zip.folder('docProps');
			
			word = zip.folder('word');

			var drels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/><Relationship Id="rId2" Type="http://schemas.microsoft.com/office/2007/relationships/stylesWithEffects" Target="stylesWithEffects.xml"/><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId6" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/><Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable" Target="fontTable.xml"/><Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/webSettings" Target="webSettings.xml"/>';
						
			var media = word.folder('media');
			var tplrel = '<Relationship Id="{RID}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="{TARGET}"/>';
			
			var media_images = {};
			
			if (file.images) {	
				var ii = 1;				
				for(var im in file.images) {
					var pimg = file.images[im];
					//compress image into zip file in word/media folder...
					var mediaimgname = "";
					/*
					if (pimg["abssrc"]) {
						log("docx> loading image: " + pimg["abssrc"] );
						var ddurl = fs.readAsbase64Sync(pimg["abssrc"]);
						log("docx> loaded! ("+ddurl.length+")");
						media.file( "image"+ii+".png", ddurl, {base64: true} );
					} else */
					if (pimg["base64"]) {
						log("docx >  base64: !! "+"image"+ii+".png");
						media.file( "image"+ii+".png", pimg["base64"], {base64: true});
						mediaimgname = "media/"+"image"+ii+".png";
					} else if (pimg["abssrc"]) {
						log("docx> loading image: " + pimg["abssrc"] );
						var ddurl = fs.readAsbase64Sync(pimg["abssrc"]);
						log("docx> loaded! ("+ddurl+")");
						media.file( "image"+ii+".jpg", ddurl, {base64: true} );
						mediaimgname = "media/"+"image"+ii+".jpg";
					}
					
					//generate a referencial id
					var rii = ii + 6;
					var rid = "rId" + rii;
					var tpl_media_img = tplrel.replace("{RID}",rid );
					//update the Relationship template line for each image with RID (rIdYYY) and TARGET (media/imageXXX.png)
					
					tpl_media_img = tpl_media_img.replace("{TARGET}", mediaimgname);
					drels+= tpl_media_img;
					
					//save information of each media image in an array to be passed as a parameter to convertContent()
					var media_image = {
							"rid": rid,
							"media": mediaimgname,
							"id": ii,
							"field_id": pimg["field_id"]
							};
					media_images[pimg["filename"]] = media_image;
					
					//increment ii and continue
					ii++;
				}
			}			
			drels+= '</Relationships>';
			
			word.folder('_rels').file('document.xml.rels', drels );
			
			content = convertContent(file.DOM, media_images );
			
			word.folder('theme').file('theme1.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office Theme"><a:themeElements><a:clrScheme name="Office"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="1F497D"/></a:dk2><a:lt2><a:srgbClr val="EEECE1"/></a:lt2><a:accent1><a:srgbClr val="4F81BD"/></a:accent1><a:accent2><a:srgbClr val="C0504D"/></a:accent2><a:accent3><a:srgbClr val="9BBB59"/></a:accent3><a:accent4><a:srgbClr val="8064A2"/></a:accent4><a:accent5><a:srgbClr val="4BACC6"/></a:accent5><a:accent6><a:srgbClr val="F79646"/></a:accent6><a:hlink><a:srgbClr val="0000FF"/></a:hlink><a:folHlink><a:srgbClr val="800080"/></a:folHlink></a:clrScheme><a:fontScheme name="Office"><a:majorFont><a:latin typeface="Cambria"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="MS ????"/><a:font script="Hang" typeface="?? ??"/><a:font script="Hans" typeface="??"/><a:font script="Hant" typeface="????"/><a:font script="Arab" typeface="Times New Roman"/><a:font script="Hebr" typeface="Times New Roman"/><a:font script="Thai" typeface="Angsana New"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="MoolBoran"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Times New Roman"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:majorFont><a:minorFont><a:latin typeface="Calibri"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="MS ??"/><a:font script="Hang" typeface="?? ??"/><a:font script="Hans" typeface="??"/><a:font script="Hant" typeface="????"/><a:font script="Arab" typeface="Arial"/><a:font script="Hebr" typeface="Arial"/><a:font script="Thai" typeface="Cordia New"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="DaunPenh"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Arial"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:minorFont></a:fontScheme><a:fmtScheme name="Office"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="50000"/><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="35000"><a:schemeClr val="phClr"><a:tint val="37000"/><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:tint val="15000"/><a:satMod val="350000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="16200000" scaled="1"/></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:shade val="51000"/><a:satMod val="130000"/></a:schemeClr></a:gs><a:gs pos="80000"><a:schemeClr val="phClr"><a:shade val="93000"/><a:satMod val="130000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="94000"/><a:satMod val="135000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="16200000" scaled="0"/></a:gradFill></a:fillStyleLst><a:lnStyleLst><a:ln w="9525" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"><a:shade val="95000"/><a:satMod val="105000"/></a:schemeClr></a:solidFill><a:prstDash val="solid"/></a:ln><a:ln w="25400" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln><a:ln w="38100" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst><a:outerShdw blurRad="40000" dist="20000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="38000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="40000" dist="23000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="35000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="40000" dist="23000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="35000"/></a:srgbClr></a:outerShdw></a:effectLst><a:scene3d><a:camera prst="orthographicFront"><a:rot lat="0" lon="0" rev="0"/></a:camera><a:lightRig rig="threePt" dir="t"><a:rot lat="0" lon="0" rev="1200000"/></a:lightRig></a:scene3d><a:sp3d><a:bevelT w="63500" h="25400"/></a:sp3d></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="40000"/><a:satMod val="350000"/></a:schemeClr></a:gs><a:gs pos="40000"><a:schemeClr val="phClr"><a:tint val="45000"/><a:shade val="99000"/><a:satMod val="350000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="20000"/><a:satMod val="255000"/></a:schemeClr></a:gs></a:gsLst><a:path path="circle"><a:fillToRect l="50000" t="-80000" r="50000" b="180000"/></a:path></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="80000"/><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="30000"/><a:satMod val="200000"/></a:schemeClr></a:gs></a:gsLst><a:path path="circle"><a:fillToRect l="50000" t="50000" r="50000" b="50000"/></a:path></a:gradFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/></a:theme>');
			
			word.file('fontTable.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:fonts xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" mc:Ignorable="w14"><w:font w:name="Calibri"><w:panose1 w:val="020F0502020204030204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="E10002FF" w:usb1="4000ACFF" w:usb2="00000009" w:usb3="00000000" w:csb0="0000019F" w:csb1="00000000"/></w:font><w:font w:name="Times New Roman"><w:panose1 w:val="02020603050405020304"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="E0002AFF" w:usb1="C0007841" w:usb2="00000009" w:usb3="00000000" w:csb0="000001FF" w:csb1="00000000"/></w:font><w:font w:name="Cambria"><w:panose1 w:val="02040503050406030204"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="E00002FF" w:usb1="400004FF" w:usb2="00000000" w:usb3="00000000" w:csb0="0000019F" w:csb1="00000000"/></w:font></w:fonts>');
			word.file('settings.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:settings xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:sl="http://schemas.openxmlformats.org/schemaLibrary/2006/main" mc:Ignorable="w14"><w:zoom w:percent="100"/><w:proofState w:spelling="clean" w:grammar="clean"/><w:defaultTabStop w:val="720"/><w:characterSpacingControl w:val="doNotCompress"/><w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="14"/><w:compatSetting w:name="overrideTableStyleFontSizeAndJustification" w:uri="http://schemas.microsoft.com/office/word" w:val="1"/><w:compatSetting w:name="enableOpenTypeFeatures" w:uri="http://schemas.microsoft.com/office/word" w:val="1"/><w:compatSetting w:name="doNotFlipMirrorIndents" w:uri="http://schemas.microsoft.com/office/word" w:val="1"/></w:compat><w:rsids><w:rsidRoot w:val="00502205"/><w:rsid w:val="00502205"/><w:rsid w:val="00F545DC"/></w:rsids><m:mathPr><m:mathFont m:val="Cambria Math"/><m:brkBin m:val="before"/><m:brkBinSub m:val="--"/><m:smallFrac m:val="0"/><m:dispDef/><m:lMargin m:val="0"/><m:rMargin m:val="0"/><m:defJc m:val="centerGroup"/><m:wrapIndent m:val="1440"/><m:intLim m:val="subSup"/><m:naryLim m:val="undOvr"/></m:mathPr><w:themeFontLang w:val="en-US"/><w:clrSchemeMapping w:bg1="light1" w:t1="dark1" w:bg2="light2" w:t2="dark2" w:accent1="accent1" w:accent2="accent2" w:accent3="accent3" w:accent4="accent4" w:accent5="accent5" w:accent6="accent6" w:hyperlink="hyperlink" w:followedHyperlink="followedHyperlink"/><w:shapeDefaults><o:shapedefaults v:ext="edit" spidmax="1026"/><o:shapelayout v:ext="edit"><o:idmap v:ext="edit" data="1"/></o:shapelayout></w:shapeDefaults><w:decimalSymbol w:val="."/><w:listSeparator w:val=","/></w:settings>');
			word.file('styles.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" mc:Ignorable="w14"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorBidi"/><w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="en-US" w:eastAsia="en-US" w:bidi="ar-SA"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="200" w:line="276" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:latentStyles w:defLockedState="0" w:defUIPriority="99" w:defSemiHidden="1" w:defUnhideWhenUsed="1" w:defQFormat="0" w:count="267"><w:lsdException w:name="Normal" w:semiHidden="0" w:uiPriority="0" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="heading 1" w:semiHidden="0" w:uiPriority="9" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="heading 2" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 3" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 4" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 5" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 6" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 7" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 8" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 9" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="toc 1" w:uiPriority="39"/><w:lsdException w:name="toc 2" w:uiPriority="39"/><w:lsdException w:name="toc 3" w:uiPriority="39"/><w:lsdException w:name="toc 4" w:uiPriority="39"/><w:lsdException w:name="toc 5" w:uiPriority="39"/><w:lsdException w:name="toc 6" w:uiPriority="39"/><w:lsdException w:name="toc 7" w:uiPriority="39"/><w:lsdException w:name="toc 8" w:uiPriority="39"/><w:lsdException w:name="toc 9" w:uiPriority="39"/><w:lsdException w:name="caption" w:uiPriority="35" w:qFormat="1"/><w:lsdException w:name="Title" w:semiHidden="0" w:uiPriority="10" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Default Paragraph Font" w:uiPriority="1"/><w:lsdException w:name="Subtitle" w:semiHidden="0" w:uiPriority="11" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Strong" w:semiHidden="0" w:uiPriority="22" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Emphasis" w:semiHidden="0" w:uiPriority="20" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Table Grid" w:semiHidden="0" w:uiPriority="59" w:unhideWhenUsed="0"/><w:lsdException w:name="Placeholder Text" w:unhideWhenUsed="0"/><w:lsdException w:name="No Spacing" w:semiHidden="0" w:uiPriority="1" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Light Shading" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 1" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 1" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 1" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 1" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 1" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 1" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Revision" w:unhideWhenUsed="0"/><w:lsdException w:name="List Paragraph" w:semiHidden="0" w:uiPriority="34" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Quote" w:semiHidden="0" w:uiPriority="29" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Intense Quote" w:semiHidden="0" w:uiPriority="30" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Medium List 2 Accent 1" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 1" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 1" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 1" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 1" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 1" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 1" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 1" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 2" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 2" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 2" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 2" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 2" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 2" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 2" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 2" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 2" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 2" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 2" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 2" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 2" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 2" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 3" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 3" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 3" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 3" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 3" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 3" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 3" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 3" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 3" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 3" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 3" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 3" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 3" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 3" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 4" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 4" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 4" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 4" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 4" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 4" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 4" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 4" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 4" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 4" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 4" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 4" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 4" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 4" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 5" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 5" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 5" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 5" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 5" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 5" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 5" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 5" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 5" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 5" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 5" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 5" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 5" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 5" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 6" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 6" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 6" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 6" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 6" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 6" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 6" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 6" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 6" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 6" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 6" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 6" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 6" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 6" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Subtle Emphasis" w:semiHidden="0" w:uiPriority="19" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Intense Emphasis" w:semiHidden="0" w:uiPriority="21" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Subtle Reference" w:semiHidden="0" w:uiPriority="31" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Intense Reference" w:semiHidden="0" w:uiPriority="32" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Book Title" w:semiHidden="0" w:uiPriority="33" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Bibliography" w:uiPriority="37"/><w:lsdException w:name="TOC Heading" w:uiPriority="39" w:qFormat="1"/></w:latentStyles><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style><w:style w:type="character" w:default="1" w:styleId="DefaultParagraphFont"><w:name w:val="Default Paragraph Font"/><w:uiPriority w:val="1"/><w:semiHidden/><w:unhideWhenUsed/></w:style><w:style w:type="table" w:default="1" w:styleId="TableNormal"><w:name w:val="Normal Table"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/><w:tblPr><w:tblInd w:w="0" w:type="dxa"/><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="108" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style><w:style w:type="numbering" w:default="1" w:styleId="NoList"><w:name w:val="No List"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/></w:style></w:styles>');
			word.file('stylesWithEffects.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 wp14"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorBidi"/><w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="en-US" w:eastAsia="en-US" w:bidi="ar-SA"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="200" w:line="276" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:latentStyles w:defLockedState="0" w:defUIPriority="99" w:defSemiHidden="1" w:defUnhideWhenUsed="1" w:defQFormat="0" w:count="267"><w:lsdException w:name="Normal" w:semiHidden="0" w:uiPriority="0" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="heading 1" w:semiHidden="0" w:uiPriority="9" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="heading 2" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 3" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 4" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 5" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 6" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 7" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 8" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 9" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="toc 1" w:uiPriority="39"/><w:lsdException w:name="toc 2" w:uiPriority="39"/><w:lsdException w:name="toc 3" w:uiPriority="39"/><w:lsdException w:name="toc 4" w:uiPriority="39"/><w:lsdException w:name="toc 5" w:uiPriority="39"/><w:lsdException w:name="toc 6" w:uiPriority="39"/><w:lsdException w:name="toc 7" w:uiPriority="39"/><w:lsdException w:name="toc 8" w:uiPriority="39"/><w:lsdException w:name="toc 9" w:uiPriority="39"/><w:lsdException w:name="caption" w:uiPriority="35" w:qFormat="1"/><w:lsdException w:name="Title" w:semiHidden="0" w:uiPriority="10" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Default Paragraph Font" w:uiPriority="1"/><w:lsdException w:name="Subtitle" w:semiHidden="0" w:uiPriority="11" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Strong" w:semiHidden="0" w:uiPriority="22" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Emphasis" w:semiHidden="0" w:uiPriority="20" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Table Grid" w:semiHidden="0" w:uiPriority="59" w:unhideWhenUsed="0"/><w:lsdException w:name="Placeholder Text" w:unhideWhenUsed="0"/><w:lsdException w:name="No Spacing" w:semiHidden="0" w:uiPriority="1" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Light Shading" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 1" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 1" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 1" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 1" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 1" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 1" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Revision" w:unhideWhenUsed="0"/><w:lsdException w:name="List Paragraph" w:semiHidden="0" w:uiPriority="34" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Quote" w:semiHidden="0" w:uiPriority="29" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Intense Quote" w:semiHidden="0" w:uiPriority="30" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Medium List 2 Accent 1" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 1" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 1" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 1" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 1" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 1" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 1" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 1" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 2" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 2" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 2" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 2" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 2" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 2" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 2" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 2" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 2" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 2" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 2" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 2" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 2" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 2" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 3" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 3" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 3" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 3" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 3" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 3" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 3" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 3" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 3" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 3" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 3" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 3" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 3" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 3" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 4" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 4" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 4" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 4" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 4" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 4" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 4" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 4" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 4" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 4" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 4" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 4" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 4" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 4" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 5" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 5" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 5" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 5" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 5" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 5" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 5" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 5" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 5" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 5" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 5" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 5" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 5" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 5" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 6" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 6" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 6" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 6" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 6" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 6" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 6" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 6" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 6" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 6" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 6" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 6" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 6" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 6" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Subtle Emphasis" w:semiHidden="0" w:uiPriority="19" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Intense Emphasis" w:semiHidden="0" w:uiPriority="21" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Subtle Reference" w:semiHidden="0" w:uiPriority="31" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Intense Reference" w:semiHidden="0" w:uiPriority="32" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Book Title" w:semiHidden="0" w:uiPriority="33" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Bibliography" w:uiPriority="37"/><w:lsdException w:name="TOC Heading" w:uiPriority="39" w:qFormat="1"/></w:latentStyles><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style><w:style w:type="character" w:default="1" w:styleId="DefaultParagraphFont"><w:name w:val="Default Paragraph Font"/><w:uiPriority w:val="1"/><w:semiHidden/><w:unhideWhenUsed/></w:style><w:style w:type="table" w:default="1" w:styleId="TableNormal"><w:name w:val="Normal Table"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/><w:tblPr><w:tblInd w:w="0" w:type="dxa"/><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="108" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style><w:style w:type="numbering" w:default="1" w:styleId="NoList"><w:name w:val="No List"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/></w:style></w:styles>');
			word.file('webSettings.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:webSettings xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" mc:Ignorable="w14"><w:optimizeForBrowser/><w:allowPNG/></w:webSettings>');
		//}
		//{ Not content dependent
			docProps.file('core.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:creator>'
				+ (file.creator || 'DOCX.js') + '</dc:creator><cp:lastModifiedBy>' + (file.lastModifiedBy || 'XLSX.js') + '</cp:lastModifiedBy><cp:revision>1</cp:revision><dcterms:created xsi:type="dcterms:W3CDTF">'
				+ (file.created || new Date()).toISOString() + '</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">' + (file.modified || new Date()).toISOString() + '</dcterms:modified></cp:coreProperties>');
		//}
		//{ Content dependent
			//{ docProps/app.xml
				docProps.file('app.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Template>Normal.dotm</Template><TotalTime>1</TotalTime><Pages>1</Pages><Words>1</Words><Characters>'
					+ content.charCount + '</Characters><Application>DOCX.js</Application><DocSecurity>0</DocSecurity><Lines>1</Lines><Paragraphs>'
					+ content.pCount + '</Paragraphs><ScaleCrop>false</ScaleCrop><Company>Microsoft Corporation</Company><LinksUpToDate>false</LinksUpToDate><CharactersWithSpaces>'
					+ content.charSpaceCount + '</CharactersWithSpaces><SharedDoc>false</SharedDoc><HyperlinksChanged>false</HyperlinksChanged><AppVersion>1.0</AppVersion></Properties>');
			//}
			
			word.file('document.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 wp14">'
				+ content.string + '<w:sectPr w:rsidR="00F545DC" w:rsidRPr="00502205"><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/><w:cols w:space="720"/><w:docGrid w:linePitch="360"/></w:sectPr></w:document>');
		//}
		processTime = Date.now() - processTime;
		zipTime = Date.now();
		result = { 
			base64: zip.generate({ compression: 'DEFLATE' }), 
			buffer: zip.generate({ compression: 'DEFLATE', type: 'arraybuffer'}),
			string: zip.generate({ compression: 'DEFLATE', type: 'string'}),
			zipTime: Date.now() - zipTime, 
			processTime: processTime,
			href: function() { return 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,' + this.base64; }
		}
	}
	return result;
}