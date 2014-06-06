/** 
    DEFINITIONS

    This templates could be on html files.


*/



var field_persona_base_path = 'arbol:Planificación:Participantes:Integrantes:Integrantes';
var field_actividades_base_path = 'arbol:Planificación:Actividades:Actividades';
var field_areas_de_trabajo_path = 'arbol:Planificación:Participantes:Integrantes:Áreas de trabajo:Áreas de trabajo';

var field_ingresos_internos_base_path = 'arbol:Recursos:Ingresos:Ingresos generación propia';
var field_ingresos_externos_base_path = 'arbol:Recursos:Ingresos:Ingresos fuentes externas';
var field_costos_asociados_base_path = 'arbol:Recursos:Ingresos:Costos asociados a ingresos';
var field_ingresos_totales_base_path = 'arbol:Recursos:Ingresos:Total ingreso proyectado';
var field_ingresos_subtotal_dinerario_base_path = 'arbol:Recursos:Ingresos:Subtotal dinerario';
var field_ingresos_subtotal_no_dinerario_base_path = 'arbol:Recursos:Ingresos:Subtotal no dinerario';

var field_costos_base_path = 'arbol:Recursos:Costos:Costos';
var field_costos_imprevistos_base_path = 'arbol:Recursos:Costos:Imprevistos';
var field_costos_total_de_costo_base_path = 'arbol:Recursos:Costos:Total de costos';

var field_presu_eco_ingresos = 'arbol:Recursos:Presupuesto Económico:Presupuesto económico';
var field_presu_eco_costos = 'arbol:Recursos:Presupuesto Económico:Presupuesto económico Costos';

// PPPPPPOOOO

var alphas = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
var words_translate = [];
words_translate["spanish"] = [];
words_translate["english"] = [];
words_translate["portugeis"] = [];

words_translate["spanish"]["Add a new item..."] = "Agregar un nuevo item...";
words_translate["portugeis"]["Add a new item..."] = "Agregar u novo ito...";

words_translate["spanish"]["Add"] = "Crear";
words_translate["portugeis"]["Add"] = "Crea";

words_translate["spanish"]["persona"] = "Persona";
words_translate["portugeis"]["persona"] = "Pessoa";

function Translate( to_translate, to_language ) {
	
	if (to_language==undefined) {
		to_language = "spanish";
	}
	
	if (words_translate[to_language][to_translate]) 
		return words_translate[to_language][to_translate];

	return to_translate+"_";
}


/**

TREE TEMPLATES


*/

function tabsHide () {

    //var e = document.getElementById( "tabmenu" );
	if (typeof jQuery != 'undefined') {
	 
		//alert("jQuery library is loaded!");
		$("#tabmenu .deep-0").each(function(id, Ele) {
			//alert(Ele.innerHTML);
			$("#"+Ele.getAttribute("id")).hide();
			
		});
		
		$("#tabmenu .padre").each(function(id, Ele) {
			//alert(Ele.innerHTML);
			//$("#"+Ele.getAttribute("id")).hide();
			Ele.setAttribute("class","categoria item-0 first padre categoria-collapsed");
		});
	}else{
	 
		alert("jQuery library is not found!");
	 
	}
}
function openclose( id, field_path ) {
		var section = document.getElementById(id);
		if (section) {
			if (section.getAttribute("class").indexOf("deep-0")>=0) {
				tabsHide();
				showdiv(id);
				var parentNode = section.parentNode;
				parentNode.setAttribute("class","categoria item-0 first padre categoria-expanded");
			}
		}
}
function openclosesel( id ) {
	togglediv(id);
}

var tree_template = [];

tree_template['menu_app'] = fs.openUri( "chrome://planea/content/templates/menu_app.html" );

tree_template['arbol'] = '';
tree_template['arbol'+'sel'] = '';
tree_template['arbol'+'open'] = '<ul id="tabmenu" class="categoria categoria-menu item-0 level-0">\n';
tree_template['arbol'+'open']+= tree_template['menu_app'];
tree_template['arbol'+'opensel'] = '<ul class="categoria item-0 level-0">\n';
tree_template['arbol'+'close'] = '</ul>\n';

tree_template['arbol'+'sel'+'progressbar'] = '';
tree_template['arbol'+'open'+'progressbar'] = '<ul id="progressbar" class="categoria-progress categoria-menu item-0 level-0">\n';
tree_template['arbol'+'opensel'+'progressbar'] = '<ul class="categoria-progress item-0 level-0">\n';
tree_template['arbol'+'close'+'progressbar'] = '</ul>\n';


tree_template['arbol'+'sel'+'_print_html5'] = '<html>'
											+ '<head>'
											+ '<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">'
											+ '<style>'
											+ '{STYLE}'
											+ '</style>'
											+ '</head>';
tree_template['arbol'+'opensel' +'_print_html5' ] = '<body class="_print_html5">';
tree_template['arbol'+'close'+'_print_html5'] = '</body></html>';

tree_template['categoria'] = '\t<li  id ="categoria_{ID}_padre" class="categoria item-0 first padre categoria-collapsed">\n'
							+ '<a id="a_categoria_{ID}" title="" class="{MARKER}" {CLINKOPENFORM}>'
							+	'\t\t {NOMBRE}</a> '
							+	'\t\t\t\t\n';
/*														
tree_template['categoria'+'sel'] = '\t<li  id ="categoria_{ID}_padre" class="categoria item-0 first padre categoria-collapsed">\n'
							+ '\t\t <input type="checkbox" id="categoria_{ID}_sel" pathsel="{PATHSEL}"'
							+ '	onchange="javascript:SelectField(this, \'{PATHCAMPO}\', \'{IDCAMPO}\');" {CHECKED}/>'
							+	'\t\t\t\t onclick="javascript:openclosesel(\'categoria_{ID}_cuerpo_sel\');">{NOMBRE}</a>\n';
*/
tree_template['categoria'+'sel'] = '\t<li  id ="categoria_{ID}_padre" class="categoria item-0 first padre categoria-collapsed">\n'
							+ '\t\t <input type="checkbox" id="categoria_{ID}_sel" pathsel="{PATHSEL}"'
							+ '	onchange="javascript:SelectField(this, \'{PATHCAMPO}\', \'{IDCAMPO}\');" {CHECKED}/>'
							+	'\t\t <a id="a_categoria_{ID}" class="{MARKER}" title="" '
							+	'\t\t\t\t>{NOMBRE}</a>\n';
							
tree_template['categoria'+'sel' + 'progressbar']  = '<li id ="categoria_{ID}_padreprogressbar" class="categoria item-0 first padre categoria-collapsed nsubs-{NSUBS}">\n';							
							
tree_template['categoria'+'open'] = '\t\t<ul id ="categoria_{ID}_cuerpo" class="secciones deep-0 depth-{LEVEL}"  style="display: block;">\n';
tree_template['categoria'+'opensel'] = '\t\t<ul id ="categoria_{ID}_cuerpo_sel" class="secciones  deep-0"  style="display: block;">\n';
tree_template['categoria'+'close'] = '\t\t</ul>\n\t</li>\n\n';


tree_template['categoria'+'opensel' + 'progressbar'] = '<ul id ="categoria_{ID}_cuerpo_selprogressbar" class="secciones  deep-0 nsubs-{NSUBS}"  style="display: block;">\n';
tree_template['categoria'+'close' + 'progressbar'] = '</ul></li>';

//tree_template['categoria'+'sel'+'_print_html5'] = '<u><span style="font-size: 22px;">{NOMBRE}</span></u>\n';
tree_template['categoria'+'sel'+'_print_html5'] = '';
tree_template['categoria'+'opensel'+'_print_html5'] = '';
tree_template['categoria'+'close'+'_print_html5'] = '';							


tree_template['seccion'] = '\t\t\t<li id ="seccion_{ID}_padre" class="seccion padre-collapsed {CLASE} secdepth-{LEVEL}{MARKED}">\n'
											+ '<a id ="a_seccion_{ID}" class="{MARKER}" {SLINKOPENFORM}>{NOMBRE}</a>'
							    + '\t\t\t\t '							    
							    +	'\t\t\t\t \n';
							    
tree_template['seccion'+'sel'] = '\t\t\t<li id ="seccion_{ID}_padre" class="seccion padre-collapsed {CLASE}">\n'
							    + '\t\t\t\t <input type="checkbox" id="seccion_{ID}_sel" pathsel="{PATHSEL}"'
							    + '	onchange="javascript:SelectField(this, \'{PATHCAMPO}\', \'{IDCAMPO}\');" {CHECKED}/>'							    
							    + '\t\t\t\t <a id ="a_seccion_{ID}" class="{MARKER}"'
							    +	'\t\t\t\t onclick="javascript:openclosesel(\'seccion_{ID}_cuerpo_sel\');">{NOMBRE}</a>\n';
								



							    
tree_template['seccion'+'open'] = '\t\t\t\t<ul id ="seccion_{ID}_cuerpo" class="secciones deep-{LEVEL} depth-{LEVEL}"  style="display: block;">\n';
tree_template['seccion'+'opensel'] = '\t\t\t\t<ul id ="seccion_{ID}_cuerpo_sel" class="secciones deep-{LEVEL}"  style="display: none;">\n';
tree_template['seccion'+'close'] = '\t\t\t\t</ul>\n\t\t\t</li>\n';

//tree_template['seccion'+'sel'+'_print_html5'] = '\t<u><span style="font-size: 18px;">{NOMBRE}</span></u>\n';
tree_template['seccion'+'sel'+'_print_html5'] = '';

tree_template['seccion_organizacion'+'sel'+'_print_html5'] = '<newpage orientation="horizontal" section="start"> </newpage>'
															+'<span style="font-size: 22px; font-family: Courier;">{NOMBRE}</span>';
tree_template['seccion_personafisica'+'sel'+'_print_html5'] = '<newpage orientation="horizontal" section="start"> </newpage>'
															 +'<span style="font-size: 22px; font-family: Courier;">{NOMBRE}</span>';
tree_template['seccion_responsable'+'sel'+'_print_html5'] = '<newpage orientation="horizontal" section="start"> </newpage>'
															 +'<span style="font-size: 22px; font-family: Courier;">{NOMBRE}</span>';
tree_template['seccion_generales'+'sel'+'_print_html5'] = '<newpage orientation="vertical" section="start"> </newpage>'
															 +'';
tree_template['seccion_especificos'+'sel'+'_print_html5'] = '<newpage orientation="vertical" section="start"> </newpage>'
															 +'';
tree_template['seccion_metas'+'sel'+'_print_html5'] = '<newpage orientation="vertical" section="start"> </newpage>'
															 +'';
tree_template['seccion_ubicacion'+'sel'+'_print_html5'] = '<newpage orientation="horizontal" section="start"> </newpage>'
															 +'';			
tree_template['seccion_beneficiariosdirectos'+'sel'+'_print_html5'] = '<newpage orientation="horizontal" section="start"> </newpage>'
															 +'';
tree_template['seccion_beneficiariosindirectos'+'sel'+'_print_html5'] = '<newpage orientation="horizontal" section="start"> </newpage>'
															 +'';															 
															 
tree_template['responsable'+'sel'+'_print_html5'] = '';
tree_template['seccion'+'opensel'+'_print_html5'] = '';
tree_template['seccion'+'close'+'_print_html5'] = '';


tree_template['seccion'+'opensel'+'progressbar'] = '<ul id ="seccion_{ID}_cuerpoprogressbar" class="secciones deep-{LEVEL} depth-{LEVEL} nsubs-{NSUBS}"  style="display: block;">\n';
tree_template['seccion'+'sel'+'progressbar'] = '<li id ="seccion_{ID}_padreprogressbar" class="seccion padre-collapsed {CLASE} secdepth-{LEVEL} {MARKED} nsubs-{NSUBS}">\n'
								+ '<a id ="a_seccion_{ID}_progressbar" class="{MARKER}" {SLINKOPENFORMPROGRESS} 					onmouseover="javascript:showProgress(\'{NOMBRE}\')"> </a>';
tree_template['seccion'+'close'+'progressbar'] = '</ul></li>\n';

tree_template['campo'] = '';
tree_template['campo'+'sel'] = '\t\t\t<li id ="campo_{dID}_padre" class="campo">\n'							    
 								+ '\t\t\t\t <input type="checkbox" id="campo_{ID}_sel" pathsel="{PATHSEL}"'
							    + '	onchange="javascript:SelectField(this, \'{PATHCAMPO}\', \'{IDCAMPO}\');" {CHECKED} />'										    
							    +	'<a id ="a_seccion_{ID}" class="{MARKER}">{NOMBRE}</a>'
							    + '</li>\n';
tree_template['campo'+'open'] = '';
tree_template['campo'+'opensel'] = '';
tree_template['campo'+'close'] = '';
								
tree_template['campo'+'sel'+'_print_html5'] = '\n<p style="font-size: 12px; color: #000; text-align: left; font-weight: bold; font-family: Courier; text-transform: uppercase;" class="{FIELD_CLASS}_label">{NOMBRE}</p>\n'
											+ '<p style="font-size: 17px; text-align: justify; font-family: Arial;"   class="{FIELD_CLASS}_value">{VALOR}</p>\n\n';

/** ORGANIZACION */									
tree_template['organizacionnombre'+'sel'+'_print_html5'] = ''
															+ '\n<div style="display: block; float: left; clear: none; width: 300px; position: relative;">'
															+ tree_template['campo'+'sel'+'_print_html5']
															+ '</div>';											

tree_template['organizacionformajuridica'+'sel'+'_print_html5'] = '\n<div style="display: block; float: left; clear: none; width: 300px; position: relative;">'
															+ tree_template['campo'+'sel'+'_print_html5']
															+ '</div>';	
															
tree_template['organizacionidentificacion'+'sel'+'_print_html5'] = '\n<div style="display: block; float: left; clear: none; width: 300px; position: relative;">'
															+ tree_template['campo'+'sel'+'_print_html5']
															+ '</div>';
															
	tree_template['organizaciondomicilio'+'sel'+'_print_html5'] = '\n<div style="display: block; float: left; clear: none; width: 300px; position: relative;">'
															+ tree_template['campo'+'sel'+'_print_html5']
															+ '</div>';
	tree_template['organizacionciudad'+'sel'+'_print_html5'] = '\n<div style="display: block; float: left; clear: none; width: 300px; position: relative;">'
															+ tree_template['campo'+'sel'+'_print_html5']
															+ '</div>';			
	tree_template['organizacioncodigopostal'+'sel'+'_print_html5'] = '\n<div style="display: block; float: left; clear: none; width: 300px; position: relative;">'
															+ tree_template['campo'+'sel'+'_print_html5']
															+ '</div>';

		tree_template['organizacionprovincia'+'sel'+'_print_html5'] = '\n<div style="display: block; float: left; clear: none; width: 300px; position: relative;">'
																+ tree_template['campo'+'sel'+'_print_html5']
																+ '</div>';
		tree_template['organizacionpais'+'sel'+'_print_html5'] = '\n<div style="display: block; float: left; clear: none; width: 300px; position: relative;">'
																+ tree_template['campo'+'sel'+'_print_html5']
																+ '</div>';			
		tree_template['organizaciontelefono'+'sel'+'_print_html5'] = '\n<div style="display: block; float: left; clear: none; width: 300px; position: relative;">'
																+ tree_template['campo'+'sel'+'_print_html5']
																+ '</div>';
				tree_template['organizacionmail'+'sel'+'_print_html5'] = '\n<div style="display: block; float: left; clear: none; width: 300px; position: relative;">'
																+ tree_template['campo'+'sel'+'_print_html5']
																+ '</div>';
				tree_template['organizacionweb'+'sel'+'_print_html5'] = '\n<div style="display: block; float: left; clear: none; width: 300px; position: relative;">'
																+ tree_template['campo'+'sel'+'_print_html5']
																+ '</div>';			
				tree_template['organizacionredessociales'+'sel'+'_print_html5'] = '\n<div style="display: block; float: left; clear: none; width: 300px; position: relative;">'
																+ tree_template['campo'+'sel'+'_print_html5']
																+ '</div>';





																
/** PERSONA FISICA */
							
tree_template['personanombre'+'sel'+'_print_html5'] = ''
															+ '\n<div style="display: block; float: left; clear: none; width: 300px; position: relative;">'
															+ tree_template['campo'+'sel'+'_print_html5']
															+ '</div>';											

tree_template['apellido'+'sel'+'_print_html5'] = '\n<div style="display: block; float: left; clear: none; width: 300px; position: relative;">'
															+ tree_template['campo'+'sel'+'_print_html5']
															+ '</div>';	
															
tree_template['dni'+'sel'+'_print_html5'] = '<div style="display: block; float: left; clear: none; width: 300px; position: relative;">'
															+ tree_template['campo'+'sel'+'_print_html5']
															+ '</div>';
															
	tree_template['nacimiento'+'sel'+'_print_html5'] = '\n<div style="display: block; float: left; clear: none; width: 300px; position: relative;">'
															+ tree_template['campo'+'sel'+'_print_html5']
															+ '</div>';
	tree_template['domicilio'+'sel'+'_print_html5'] = '\n<div style="display: block; float: left; clear: none; width: 300px; position: relative;">'
															+ tree_template['campo'+'sel'+'_print_html5']
															+ '</div>';			
	tree_template['codigo_postal'+'sel'+'_print_html5'] = '<div style="display: block; float: left; clear: none; width: 300px; position: relative;">'
															+ tree_template['campo'+'sel'+'_print_html5']
															+ '</div>';

		tree_template['ciudad'+'sel'+'_print_html5'] = '\n<div style="display: block; float: left; clear: none; width: 300px; position: relative;">'
																+ tree_template['campo'+'sel'+'_print_html5']
																+ '</div>';
		tree_template['provincia'+'sel'+'_print_html5'] = '\n<div style="display: block; float: left; clear: none; width: 300px; position: relative;">'
																+ tree_template['campo'+'sel'+'_print_html5']
																+ '</div>';			
		tree_template['pais'+'sel'+'_print_html5'] = '\n<div style="display: block; float: left; clear: none; width: 300px; position: relative;">'
																+ tree_template['campo'+'sel'+'_print_html5']
																+ '</div>';
				tree_template['telefono'+'sel'+'_print_html5'] = '\n<div style="display: block; float: left; clear: none; width: 300px; position: relative;">'
																+ tree_template['campo'+'sel'+'_print_html5']
																+ '</div>';
				tree_template['web'+'sel'+'_print_html5'] = '\n<div style="display: block; float: left; clear: none; width: 300px; position: relative;">'
																+ tree_template['campo'+'sel'+'_print_html5']
																+ '</div>';			


													
/** RESPONSABLE */
														
							
tree_template['responsablenombre'+'sel'+'_print_html5'] = ''
															+ '\n<div style="display: block; float: left; clear: none; width: 300px; position: relative;">'
															+ tree_template['campo'+'sel'+'_print_html5']
															+ '</div>';											

tree_template['responsableapellido'+'sel'+'_print_html5'] = '\n<div style="display: block; float: left; clear: none; width: 300px; position: relative;">'
															+ tree_template['campo'+'sel'+'_print_html5']
															+ '</div>';	
															
tree_template['responsablemail'+'sel'+'_print_html5'] = '\n<div style="display: block; float: left; clear: none; width: 300px; position: relative;">'
															+ tree_template['campo'+'sel'+'_print_html5']
															+ '</div>';
															
	tree_template['responsabletelefono'+'sel'+'_print_html5'] = '\n<div style="display: block; float: left; clear: none; width: 300px; position: relative;">'
															+ tree_template['campo'+'sel'+'_print_html5']
															+ '</div>';
	tree_template['responsableweb'+'sel'+'_print_html5'] = '\n<div style="display: block; float: left; clear: none; width: 300px; position: relative;">'
															+ tree_template['campo'+'sel'+'_print_html5']
															+ '</div>';			
	tree_template['responsableredes'+'sel'+'_print_html5'] = '\n<div style="display: block; float: left; clear: none; width: 300px; position: relative;">'
															+ tree_template['campo'+'sel'+'_print_html5']
															+ '</div>';

/*FUNDAMENTOS >> ANALISIS EXTERNO*/
tree_template['seccion_fundamentos'+'sel'+'_print_html5'] = '<newpage orientation="vertical" section="start"> </newpage>';
tree_template['seccion_analisis_externo'+'sel'+'_print_html5'] = '<newpage orientation="vertical" section="start"> </newpage>';
tree_template['seccion_analisisexterno'+'sel'+'_print_html5'] = '<newpage orientation="vertical" section="start"> </newpage>';
/*ACTIVIDADES*/
tree_template['seccion_actividades'+'sel'+'_print_html5'] = '<newpage orientation="horizontal" section="start"> </newpage>';



/*INTEGRANTES + ORGANIGRAMA*/

tree_template['seccion_integrantes'+'sel'+'_print_html5'] = '<newpage orientation="horizontal" section="start"> </newpage>';
tree_template['seccion_organigrama'+'sel'+'_print_html5'] = '<newpage orientation="horizontal" section="start"> </newpage>';

/*ACTIVIDADES*/
tree_template['seccion_actividades'+'sel'+'_print_html5'] = '<newpage orientation="horizontal" section="start"> </newpage>';

/*GRAFICO...*/
															
tree_template['graficocronograma'+'sel'+'_print_html5'] = '<newpage orientation="horizontal" section="start"> </newpage>'
															+tree_template['campo'+'sel'+'_print_html5'];
															
															
/*PRESUPUESTO*/															
tree_template['presueco'+'sel'+'_print_html5'] = '<newpage orientation="horizontal" section="start"> </newpage>'
															+tree_template['campo'+'sel'+'_print_html5'];
tree_template['presuecocostos'+'sel'+'_print_html5'] = '<newpage orientation="horizontal" section="start"> </newpage>'
															+tree_template['campo'+'sel'+'_print_html5'];															
								
//tree_template['campo'+'selcellhead'+'_print_html5'] ='<td class="{FIELD_CLASS}">{NOMBRE}'+'</td>';
tree_template['campo'+'selcellhead'+'_print_html5'] ='\n<td style="width:100%;" style="font-size: 14px; text-align: justify; font-family: Arial;" class="{FIELD_CLASS}"><span style="font-size: 14px; text-align: justify; font-family: Arial;">{NOMBRE}'+'</span></td>';

tree_template['campo'+'sel'+'progressbar'] = '';
tree_template['campo'+'selcellhead'+'progressbar'] ='';
tree_template['campo'+'selcell'+'progressbar'] = '';
tree_template['campo'+'selcellfoot'+'progressbar'] ='';

tree_template['campo'+'opensel'+'progressbar'] = '';
tree_template['campo'+'close'+'progressbar'] = '';


/*TEXTO, NUMEROS, PARRAFOS, ETC...*/
//tree_template['campo'+'selcell'+'_print_html5'] ='<td class="{FIELD_CLASS}">{VALOR}</td>';
//THEAD > TD
tree_template['campo'+'selcellhead'+'_print_html5'] = '\n<td style="padding: 10px; color: #0ecc7a; font-size: 14px; text-align: justify; font-family: Arial;" class="{FIELD_CLASS}"><span style="font-size: 14px; text-align: justify; font-family: Arial;">{NOMBRE}'+'</span></td>';
//TBODY > TD
tree_template['campo'+'selcell'+'_print_html5'] = '\n<td style="padding: 10px; font-size: 14px; text-align: justify; font-family: Arial;" class="{FIELD_CLASS}"><span style="font-size: 14px; text-align: justify; font-family: Arial;">{VALOR}'+'</span></td>';



/*OBJETIVOS GRAL*/
tree_template['objetivogral_objetivo'+'selcell'+'_print_html5'] = '\n<td style="width:100%; border-bottom: solid 0.5px #0ecc7a; font-size: 14px; text-align: justify; font-family: Arial;" class="{FIELD_CLASS}"><span style="font-size: 14px; text-align: justify; font-family: Arial;">{VALOR}'+'</span></td>';

/*ESPECIFICO*/
tree_template['objetivospec_objetivo'+'selcell'+'_print_html5'] = '\n<td style="width:100%; border-bottom: solid 0.5px #0ecc7a; font-size: 14px; text-align: justify; font-family: Arial;" class="{FIELD_CLASS}"><span style="font-size: 14px; text-align: justify; vertical-align: top; font-family: Arial;">{VALOR}'+'</span></td>';
tree_template['objetivospec_vinculacion'+'selcell'+'_print_html5'] = '\n<td style="width:100%; border-bottom: solid 0.5px #0ecc7a; font-size: 14px; text-align: justify;  vertical-align: top; font-family: Arial;" class="{FIELD_CLASS}"><span style="font-size: 14px; text-align: justify; font-family: Arial;">{VALOR}'+'</span></td>';

/*META*/
tree_template['nombremeta'+'selcell'+'_print_html5'] = '\n<td style="width:100%; border-bottom: solid 0.5px #0ecc7a; font-size: 14px; text-align: justify; font-family: Arial;" class="{FIELD_CLASS}"><span style="font-size: 14px; text-align: justify; font-family: Arial;">{VALOR}'+'</span></td>';
tree_template['vinculoespecifico'+'selcell'+'_print_html5'] = '\n<td style="width:100%; border-bottom: solid 0.5px #0ecc7a; font-size: 14px; text-align: justify;  vertical-align: top; font-family: Arial;" class="{FIELD_CLASS}"><span style="font-size: 14px; text-align: justify; font-family: Arial;">{VALOR}'+'</span></td>';

/*INTEGRANTE*/

tree_template['registro_personas'+'selhead'+'_print_html5'] = '';
tree_template['registro_personas'+'sel'+'_print_html5'] = '{RECORD_VALUES}'; 
tree_template['registro_personas'+'selfoot'+'_print_html5'] = '';


tree_template['nombre'+'selcell'+'_print_html5'] = '\n<newpage orientation="horizontal" section="start"> </newpage>'
													+'<span style="font-size: 14px; font-family: Arial; color: #0ecc7a; text-transform: uppercase;">'
													+'Integrante'
													+'</span>'
													+'<div style="margin-left: 300px; width: 110px; display: block; float: left; clear: none;">'
														+'<span style="font-size: 14px; font-family: Arial; color: #0ecc7a; text-transform: uppercase;">'
														+'Nombre'+'</span>'
													+'<br><span style="font-family: Arial; padding-top: 10px;font-size: 14px; color: #000;">{VALOR}</span></div>';
													
tree_template['apellido'+'selcell'+'_print_html5'] = '\n<div style="width: 110px; display: block; float: left; clear: none;">'
													+'<span style="font-size: 14px; font-family: Arial; color: #0ecc7a; text-transform: uppercase;">'
													+'Apellido'+'</span>'
													+'<br><span style="font-family: Arial; padding-top: 10px;font-size: 14px; color: #000;">{VALOR}</span></div>';
													
tree_template['documento'+'selcell'+'_print_html5'] = '\n<div style="width: 110px; display: block; float: left; clear: none; ">'
													+'<span style="font-size: 14px; font-family: Arial; color: #0ecc7a; text-transform: uppercase;">'
													+'Documento'+'</span>'
													+'<br><span style="font-family: Arial; padding-top: 10px;font-size: 14px; color: #000;">{VALOR}</span></div>';
													
tree_template['email'+'selcell'+'_print_html5'] = '\n<div style="width: 140px; display: block; float: left; clear: none;">'
													+'<span style="font-size: 14px; font-family: Arial; color: #0ecc7a; text-transform: uppercase;">'
													+'Email'+'</span>'
													+'<br><span style="font-family: Arial; padding-top: 10px;font-size: 14px; color: #000;">{VALOR}</span></div>';
													
tree_template['telefono'+'selcell'+'_print_html5'] = '\n<div style="width: 140px; display: block; float: left; clear: none;">'
													+'<span style="font-size: 14px; font-family: Arial; color: #0ecc7a; text-transform: uppercase;">'
													+'Teléfono'+'</span>'
													+'<br><span style="font-family: Arial; padding-top: 10px; font-size: 14px; color: #000;">{VALOR}</span></div>';
													
tree_template['redessociales'+'selcell'+'_print_html5'] = '\n<div style="position: absolute; left: 80px; top: 470px; width: 300px; height: 100px; overflow: show; display: block; float: left; clear: none;">'
															+'<span style="font-size: 14px; font-family: Arial; color: #0ecc7a; text-transform: uppercase;">'
															+'redessociales'+'</span>'
															+'<br><span style="font-family: Arial; font-size: 14px; color: #000;">{VALOR}</span></div>';
tree_template['cv'+'selcell'+'_print_html5'] = '\n';
tree_template['otros'+'selcell'+'_print_html5'] = '\n';
tree_template['fotopersona'+'selcell'+'_print_html5'] = '\n<div style="width: 240px; height: 300px; display: block; overflow:hidden; float: left; clear: none;  border: solid 1px #CCC;">'
													+'<span style="font-size: 14px; font-family: Arial; color: #0ecc7a;  text-transform: uppercase;">'
													+'Foto'+'</span>'
													+'<br><img dimensions="64x64" height="300px" src="{VALOR}"/></div>';													
													
tree_template['web'+'selcell'+'_print_html5'] = '\n<div style="margin-left: 40px; margin-top: 40px; width: 220px; display: block; float: left; clear: none;">'
													+'<span style="font-size: 14px; font-family: Arial; color: #0ecc7a; text-transform: uppercase;">'
													+'Web'+'</span>'
													+'<br><span style="font-family: Arial; padding-top: 10px; font-size: 14px; color: #000;">{VALOR}</span></div>';
													
tree_template['perfil'+'selcell'+'_print_html5'] = '\n<div style="width: 400px; margin-top: 0px;  display: block; float: left; clear: none;">'
													+'<span style="font-size: 14px; font-family: Arial; color: #0ecc7a; text-transform: uppercase;">'
													+'Perfil'+'</span>'
													+'<br><span style="font-family: Arial; padding-top: 10px; font-size: 14px; color: #000;">{VALOR}</span></div>';
													
tree_template['cargo'+'selcell'+'_print_html5'] = '\n<div style="margin-left: 280px;  width: 220px; margin-top: -40px;  display: block; float: left; clear: none;">'
													+'<span style="font-size: 14px; font-family: Arial; color: #0ecc7a; text-transform: uppercase;">'
													+'Cargo'+'</span>'
													+'<br><span style="font-family: Arial; padding-top: 10px; font-size: 14px; color: #000;">{VALOR}</span></div>';
													
tree_template['responsabilidad'+'selcell'+'_print_html5'] = '\n<div style="width: 400px; margin-top: 0px;  display: block; float: left; clear: none;">'
													+'<span style="font-size: 14px; font-family: Arial; color: #0ecc7a; text-transform: uppercase;">'
													+'Responsabilidad'+'</span>'
													+'<br><span style="font-family: Arial; padding-top: 10px; font-size: 14px; color: #000;">{VALOR}</span></div>';
tree_template['misrelaciones'+'selcell'+'_print_html5'] = '\n';
tree_template['pertenecealaorganizacion'+'selcell'+'_print_html5'] = '\n';

/*IMAGENES*/
tree_template['imagen'+'sel'+'_print_html5'] ='<img dimensions="64x64" width="64" src="{VALOR}"/>';
tree_template['imagen'+'selcell'+'_print_html5'] ='<td class="{FIELD_CLASS}"><img dimensions="64x64" width="64" src="{VALOR}"/></td>';

/*ARCHIVOS*/
tree_template['archivo'+'sel'+'_print_html5'] ='';
tree_template['archivo'+'selcell'+'_print_html5'] ='<td style="padding: 10px;" class="{FIELD_CLASS}"></td>';

tree_template['campo'+'selcellfoot'+'_print_html5'] ='<td style="padding: 10px;" class="{FIELD_CLASS}">{TOTAL}</td>';

tree_template['campo'+'opensel'+'_print_html5'] = '';
tree_template['campo'+'close'+'_print_html5'] = '';


tree_template['ficha'] = '';
tree_template['ficha'+'open'] = '';
tree_template['ficha'+'close'] = '';
tree_template['ficha'+'sel'+'_print_html5'] = '';
tree_template['ficha'+'opensel'+'_print_html5'] = '';
tree_template['ficha'+'close'+'_print_html5'] = '';
tree_template['ficha'+'sel'+'progressbar'] = '';
tree_template['ficha'+'opensel'+'progressbar'] = '';
tree_template['ficha'+'close'+'progressbar'] = '';

tree_template['personas'+'sel'+'_print_html5'] = '{TABLE_RECORDS}';

tree_template['areasdetrabajo'+'sel'+'_print_html5'] = '<table width="100%" cellpadding="0" cellspacing="0" border="0" class="{TABLE_CLASS}_titulo">'
												+'<tr><td>{TABLE_NAME}</td></tr>'
												+'</table>'
												+'<table style="page-break-inside:avoid; autosize: 1;" width="100%" cellpadding="0" cellspacing="0" border="0" class="{TABLE_CLASS}">'
												+'<thead>{TABLE_HEADS}</thead>'
												+'<tbody>{TABLE_RECORDS}</tbody>'
												+'<tfoot>{TABLE_FOOTS}</tfoot>'
												+'</table>';


tree_template['etapas'+'sel'+'_print_html5'] = '<table width="100%" cellpadding="0" cellspacing="0" border="0" class="{TABLE_CLASS}_titulo">'
												+'<tr><td>{TABLE_NAME}</td></tr>'
												+'</table>'
												+'<table style="page-break-inside:avoid; autosize: 1;" width="100%" cellpadding="0" cellspacing="0" border="0" class="{TABLE_CLASS}">'
												+'<thead>{TABLE_HEADS}</thead>'
												+'<tbody>{TABLE_RECORDS}</tbody>'
												+'<tfoot>{TABLE_FOOTS}</tfoot>'
												+'</table>';												
												
tree_template['ingresosgeneracion'+'sel'+'_print_html5'] = '<table width="100%" cellpadding="0" cellspacing="0" border="0" class="{TABLE_CLASS}_titulo">'
												+'<tr><td>{TABLE_NAME}</td></tr>'
												+'</table>'
												+'<table  width="100%" cellpadding="0" cellspacing="0" border="0" class="{TABLE_CLASS}">'
												+'<thead>{TABLE_HEADS}</thead>'
												+'<tbody>{TABLE_RECORDS}</tbody>'
												+'<tfoot>{TABLE_FOOTS}</tfoot>'
												+'</table>';
tree_template['ingresosexternos'+'sel'+'_print_html5'] = tree_template['ingresosgeneracion'+'sel'+'_print_html5'];
tree_template['costosasociados'+'sel'+'_print_html5'] = tree_template['ingresosgeneracion'+'sel'+'_print_html5'];
tree_template['multiplescostos'+'sel'+'_print_html5'] = tree_template['ingresosgeneracion'+'sel'+'_print_html5'];
tree_template['totalesingresos'+'sel'+'_print_html5'] = '<table width="100%" cellpadding="0" cellspacing="0" border="0" class="{FIELD_CLASS}_titulo">'
												+'<tr><td>{NOMBRE}</td><td>{VALOR}</td></tr>'
												+'</table>';
tree_template['totalingresoproyectado'+'sel'+'_print_html5'] = '<table width="100%" cellpadding="0" cellspacing="0" border="0" class="{FIELD_CLASS}_titulo">'
												+'<tr><td>{NOMBRE}</td><td>{VALOR}</td></tr>'
												+'</table>';
tree_template['subtotaldinerario'+'sel'+'_print_html5'] = '<table width="100%" cellpadding="0" cellspacing="0" border="0" class="{FIELD_CLASS}_titulo">'
												+'<tr><td>{NOMBRE}</td><td>{VALOR}</td></tr>'
												+'</table>'
tree_template['subtotalnodinerario'+'sel'+'_print_html5'] = '<table width="100%" cellpadding="0" cellspacing="0" border="0" class="{FIELD_CLASS}_titulo">'
												+'<tr><td>{NOMBRE}</td><td>{VALOR}</td></tr>'
												+'</table>';

tree_template['multiple'+'sel'+'_print_html5'] = '<table cellpadding="0" cellspacing="0" border="0" class="{TABLE_CLASS}">'
												+'<thead>{TABLE_HEADS}</thead>'
												+'<tbody>{TABLE_RECORDS}</tbody>'
												+'<tfoot>{TABLE_FOOTS}</tfoot>'
												+'</table>';
tree_template['multiple'+'sel'+'progressbar'] = ''; 
//'<newpage orientation="horizontal"/>											
tree_template['grafico'+'sel'+'_print_html5'] = '<img width="100%" dimensions="{DIMENSIONS}" src="{SOURCE}" id="{IDCAMPO}" filename="{FILENAME}">';
tree_template['graficocronograma'+'sel'+'_print_html5'] = tree_template['graficocronograma'+'sel'+'_print_html5'] = '<newpage orientation="horizontal" section="start"> </newpage>'
														+'<img width="250%" dimensions="{DIMENSIONS}" src="{SOURCE}" id="{IDCAMPO}" filename="{FILENAME}">'; 
tree_template['grafico'+'sel'+'progressbar'] = '';



tree_template['registro'] = '';
tree_template['registro'+'open'] = '';
tree_template['registro'+'close'] = '';

tree_template['registro'+'selhead'+'_print_html5'] = '<tr class="{RECORD_CLASS}">{RECORD_HEADS}</tr>';
tree_template['registro'+'sel'+'_print_html5'] = '<tr class="{RECORD_CLASS}">{RECORD_VALUES}</tr>'; 
tree_template['registro'+'selfoot'+'_print_html5'] = '<tr class="{RECORD_CLASS}">{RECORD_FOOTS}</tr>';


tree_template['registro'+'selhead'+'_print_html5'] = '<tr class="{RECORD_CLASS}">{RECORD_HEADS}</tr>';
tree_template['registro'+'sel'+'_print_html5'] = '<tr class="{RECORD_CLASS}">{RECORD_VALUES}</tr>'; 
tree_template['registro'+'selfoot'+'_print_html5'] = '<tr class="{RECORD_CLASS}">{RECORD_FOOTS}</tr>';

tree_template['registro'+'selhead'+'progressbar'] = '';
tree_template['registro'+'sel'+'progressbar'] = ''; 
tree_template['registro'+'selfoot'+'progressbar'] = ''; 

tree_template['registro'+'opensel'+'_print_html5'] = '';
tree_template['registro'+'close'+'_print_html5'] = '';

tree_template['registro'+'opensel'+'progressbar'] = '';
tree_template['registro'+'close'+'progressbar'] = '';

tree_template['#text'] = '';
tree_template['#textopen'] = '';
tree_template['#textclose'] = '';

tree_template['label'] = '';
tree_template['labelopen'] = '';
tree_template['labelclose'] = '';
tree_template['label'+'sel'+'_print_html5'] = '';
tree_template['labelopensel'+'_print_html5'] = '';
tree_template['labelclose'+'_print_html5'] = '';

tree_template['label'+'sel'+'progressbar'] = '';
tree_template['labelopensel'+'progressbar'] = '';
tree_template['labelclose'+'progressbar'] = '';

tree_template['valor'] = '';
tree_template['valor'+'open'] = '';
tree_template['valor'+'close'] = '';
tree_template['valor'+'sel'+'_print_html5'] = '';
tree_template['valor'+'opensel'+'_print_html5'] = '';
tree_template['valor'+'close'+'_print_html5'] = '';

tree_template['valor'+'sel'+'progressbar'] = '';
tree_template['valor'+'opensel'+'progressbar'] = '';
tree_template['valor'+'close'+'progressbar'] = '';

function assignFirstFoundedTemplate( ar_prefix, subfix ) {
	
	for( var p in ar_prefix) {
		var prefix = ar_prefix[p];
		var template_alias = prefix + subfix;
		//log("assignFirstFoundedTemplate() > check for tree_template[" +template_alias+"]" );
		var template_string = tree_template[template_alias];
		
		if ( template_string!=undefined ) {
			//log("assignFirstFoundedTemplate() > founded ? " +template_string );
			return new String(template_string);
		}
	}
	error("assignFirstFoundedTemplate() > not found ["+ar_prefix+"] subfix[" + subfix);
	return undefined;
}

function assignTreeTemplate( xmlNode, subfix ) {
	
	var xmlNodeClass = getFieldClass( xmlNode );
	var xmlNodeType = getFieldType( xmlNode );
	
	return assignFirstFoundedTemplate( [ 
										xmlNode.nodeName + "_clase_" +  xmlNodeClass,
										xmlNode.nodeName + "_tipo_" +  xmlNodeType,
										xmlNode.nodeName,
										], subfix );
}



var _templates = new Array();

var _tipo_campos = new Array();
var _campos = new Array();
var _ayudas = new Array();
var _dbobjects = new Array();

_tipo_campos['texto'] = 'ok';
_tipo_campos['tilde'] = 'ok';
_tipo_campos['parrafo'] = 'ok';
_tipo_campos['fecha'] = 'no';
_tipo_campos['selection'] = 'no';

var _template_marker = fs.openUri( "chrome://planea/content/templates/marker.html" ); 
var _template_helper = fs.openUri( "chrome://planea/content/templates/helper.html" ); 

_templates['texto'] = fs.openUri( "chrome://planea/content/templates/campo_texto.html" );
_templates['parrafo'] = fs.openUri( "chrome://planea/content/templates/campo_parrafo.html" );
_templates['multiple'] = fs.openUri( "chrome://planea/content/templates/campo_multiple.html" );


_templates['ficha'] = fs.openUri( "chrome://planea/content/templates/ficha.html" );
_templates['referencia'] = 	fs.openUri( "chrome://planea/content/templates/campo_referencia.html" );	
_templates['arbolseleccion'] = 	fs.openUri( "chrome://planea/content/templates/campo_arbolseleccion.html" );

_templates['fecha'] = _templates['texto'];
_templates['fecha'] = 	fs.openUri( "chrome://planea/content/templates/campo_fecha.html" );
_templates['bifurcacion'] = 	fs.openUri( "chrome://planea/content/templates/campo_bifurcacion.html" );

_templates['seleccion'] = fs.openUri( "chrome://planea/content/templates/campo_seleccion.html" );
_templates['seleccionar-unidad'] = _templates['texto'];
_templates['rango_a'] = _templates['texto'];
_templates['rango_de'] = _templates['texto'];
_templates['tilde'] = fs.openUri( "chrome://planea/content/templates/campo_tilde.html" );
_templates['archivo'] = fs.openUri( "chrome://planea/content/templates/campo_archivo.html" );
_templates['lista'] = fs.openUri( "chrome://planea/content/templates/campo_seleccion.html" );
_templates['imagen'] = fs.openUri( "chrome://planea/content/templates/campo_imagen.html" );
_templates['grafico'] = fs.openUri( "chrome://planea/content/templates/campo_grafico.html" );
_templates['formula'] = fs.openUri( "chrome://planea/content/templates/campo_formula.html" );
_templates['numero'] = fs.openUri( "chrome://planea/content/templates/campo_numero.html" );
_templates['entero'] = fs.openUri( "chrome://planea/content/templates/campo_entero.html" );
_templates['natural'] = fs.openUri( "chrome://planea/content/templates/campo_natural.html" );
_templates['decimal'] = fs.openUri( "chrome://planea/content/templates/campo_decimal.html" );
_templates['porcentaje'] = fs.openUri( "chrome://planea/content/templates/campo_porcentaje.html" );
_templates['color'] = fs.openUri( "chrome://planea/content/templates/campo_color.html" );
_templates['referencia-a-seccion'] = fs.openUri( "chrome://planea/content/templates/campo_referencia-a-seccion.html" );

_templates['grafico-organigrama'] = _templates['grafico'];
_templates['textoref'] = fs.openUri( "chrome://planea/content/templates/campo_textoref.html" );

/*field_actions -> Are just for field whose fathers are sections... (not for records)...  */
_templates['field_actions'] = '<div class="field_actions">'
			+'<!--ADJUNTAR--><button onclick="javascript:attachFileToField(\'{PATHCAMPO}\',\'{IDCAMPO}\')" class="attachfile"> </button>'
			+'<!--ELIMINAR--><button onclick="javascript:cancelField(\'{PATHCAMPO}\',\'{IDCAMPO}\')" class="cancelfield"> </button>'
		+'</div>';

/*MULTIPLEADDRECORD template*/
_templates['multiple_add'] = 	'\n<div class="object_add">'
								+'\n\t<span class="ficha ficha_add" onclick="javascript:showaction(); FocusOut(); setTimeout( function() { AddRecord(\'{CLASSREF}\',\'{HERENCE}\')}, 100 );" title="Nuevo/a {CLASSNAME}"> </span>'
								+'\n</div>';
								
_templates['multiple_add_objetivo-general'] = 	'\n<div class="object_add object_add_persona">'
								+'\n\t<span class="ficha ficha_add" onclick="javascript:showaction(); FocusOut(); setTimeout( function() { AddRecord(\'{CLASSREF}\',\'{HERENCE}\')}, 100 );" title="Nuevo/a {CLASSNAME}"> </span>'
								+'\n</div>';	
								
_templates['multiple_add_persona'] = 	'\n<div class="object_add object_add_persona">'
								+'\n\t<span class="ficha ficha_add" onclick="javascript:showaction(); FocusOut(); setTimeout( function() { AddRecord(\'{CLASSREF}\',\'{HERENCE}\')}, 100 );" title="Nuevo/a {CLASSNAME}"></span>'
								+'\n</div>';								
							
_templates['multiple_records'] = '\n<div class="object_records object_records_{NFIELDS}" id="{CLASSREF}_records_gral">'
								+'\n\t{HEAD}'
                                +'\n\t{RECORDS}'
                                +'\n\t{FOOT}'
								+'\n</div>';
_templates['multiple_records_objetivo-general'] = '\n<div class="object_records object_records_{NFIELDS}" id="{CLASSREF}_records_gral">'
								+'\n\t{HEAD}'
                                +'\n\t{RECORDS}'
                                +'\n\t{FOOT}'
								+'\n</div>';
_templates['multiple_records_persona'] = '\n<div class="object_records object_records_{NFIELDS}" id="{CLASSREF}_records_gral">'
								+'\n\t{HEAD}'
                                +'\n\t{RECORDS}'
                                +'\n\t{FOOT}'
								+'\n</div>';
						
_templates['multiple_records_head'] = '\n<table class="multiple table_records" id="{CLASSREF}_records" cellpadding="0" cellspacing="0" border="0">'
									+ '\n\t<thead>'
									+ '\n\t\t<tr>'									
									+ '\n{RECORDSHEAD}'
									+ '\n\t\t\t<td class="record_actions">{MULTIPLEADDRECORD}</td>'
									+ '\n\t\t</tr>'
									+ '\n\t</thead>'
									+ '\n\t<tbody>';
_templates['multiple_records_head_objetivo-general'] = '\n<table class="multiple table_records" id="{CLASSREF}_records" cellpadding="0" cellspacing="0" border="0">'
									+ '\n\t<thead>'
									+ '\n\t\t<tr>'
									+ '\n\t\t\t<td class="record_actions">{MULTIPLEADDRECORD}</td>'
									+ '\n{RECORDSHEAD}'
									+ '\n\t\t</tr>'
									+ '\n\t</thead>'
									+ '\n\t<tbody>';
_templates['multiple_records_head_persona'] = '\n<table class="multiple table_records" id="{CLASSREF}_records" cellpadding="0" cellspacing="0" border="0">'
									+ '\n\t<thead>'
									+ '\n\t\t<tr>'
									+ '\n{RECORDSHEAD}'
									+ '\n\t\t\t<td class="record_actions">{MULTIPLEADDRECORD}</td>'
									+ '\n\t\t</tr>'
									+ '\n\t</thead>'
									+ '\n\t<tbody>';
									
										/*
		'<td class="record_actions record_delete">'+actions_template+' <span class="order">{ORDER}</span></td>'
	*/
_templates['multiple_records_actions'] = '<div class="record_actions">{DELETEACTION}{ADDACTION}{ORDERACTION}{EXECUTEACTION}</div><span class="order order-{ORDER} order-num">{ORDER}</span><span class="orderalpha orderalpha-{ORDER} order-alpha">{ORDERALPHA}</span>';
_templates['multiple_records_field_head'] = 	'<td class="{CLASS}">{FIELDNAME}</td>';					
_templates['multiple_records_field'] = 	'<td class="{CLASS} record_field">{FIELDTEMPLATE}{RECORDACTIONS}</td>';				
_templates['multiple_records_field_foot'] = 	'<td class="{CLASS}" id="{TOTALFIELDID}"></td>';					


//<tfoot>{RECORDSFOOT}</tfoot>									
_templates['multiple_records_foot'] = ''
									+ '\n\t</tbody>'
									+ '\n\t<tfoot>'
									+ '\n\t\t<tr>'
									+ '\n{RECORDSFOOT}'
									+ '\n\t\t<td class="record_totals"> </td>'
									+ '\n\t\t</tr>'
									+ '\n\t</tfoot>'
									+ '\n</table>';
_templates['multiple_records_foot_objetivo-general'] = ''
									+ '\n\t</tbody>'
									+ '\n\t<tfoot>'
									+ '\n\t\t<tr>'
									+ '\n\t\t<td class="record_totals"> </td>'
									+ '\n{RECORDSFOOT}'									
									+ '\n\t\t</tr>'
									+ '\n\t</tfoot>'
									+ '\n</table>';
_templates['multiple_records_foot_persona'] = ''
									+ '\n\t</tbody>'
									+ '\n\t<tfoot>'
									+ '\n\t\t<tr>'
									+ '\n{RECORDSFOOT}'
									+ '\n\t\t<td class="record_totals"> </td>'
									+ '\n\t\t</tr>'
									+ '\n\t</tfoot>'
									+ '\n</table>';
									
									
									
_templates['record_object_table'] =  '\n<tr id="{ID}" class="object_record" onblur="javascript:StopEditRecord(\'{ID}\');" onfocus="javascript:StartEditRecord(\'{ID}\')">'
									+'\n\t{RECORD}'
									+'\n\t<td class="record_actions">{RECORDACTIONS}</td>'
									+'\n</tr>';
_templates['record_object_table_objetivo-general'] =  '\n<tr id="{ID}" class="object_record" onblur="javascript:StopEditRecord(\'{ID}\');"  onfocus="javascript:StartEditRecord(\'{ID}\')">'
									+'\n\t<td class="record_actions">{RECORDACTIONS}</td>'
									+'\n\t{RECORD}'
									+'\n</tr>';
_templates['record_object_table_persona'] =  '\n<tr id="{ID}" class="object_record"  onblur="javascript:StopEditRecord(\'{ID}\');"  onfocus="javascript:StartEditRecord(\'{ID}\')">'
									+'\n\t{RECORD}'
									+'\n\t<td class="record_actions">{RECORDACTIONS}</td>'
									+'\n</tr>';
/*
_templates['record_object'] =    '<div class="object_record" id="{ID}">'
                                +'  {PREVIEW}'
                                +'  <div class="record record-edit" id="{ID}_fields" style="display: block;">'
                                +'    {RECORD}'
                                +'  </div>'
								+'  {ACTIONS}'
                                +'</div>';
*/

_templates["execute_action_"+"informe"] = '<!--<span class="execute executeTXT" onclick="javascript:ExecuteRecord(\'{ID}\');"> </span>-->'
										+ '<span class="execute toggletreesel" onclick="javascript:ToggleTreeSel(\'{ID}\');"> </span>'
										+ '<span class="execute executeDOCX" onclick="javascript:printDOC(\'{ID}\');"> </span>'
										+ '<span class="execute executePDF" onclick="javascript:printPDF(\'{ID}\');"> </span>';

_templates["reference_to_section_select_option"] = "{SECTIONNAME}";

/** 

    FUNCTIONS

    Processing templates

*/

function ToggleTreeSel( record_id ) {
	var selid = "arbolseleccion_"+record_id+"_seleccion";
	togglediv( selid );
}



function printDOC( record_id ) {
			
	var selected_tree_title = getRecordValue( record_id, "titulo" );
	var selected_tree_description = getRecordValue( record_id, "descripcion" );
	var selected_tree_values = getRecordValue( record_id, "seleccion" );
	
	if (confirm( "¿Está seguro que quiere generar este informe?" )) {
			
		log( 'printDOC() :'+record_id );

	
		//OPEN WINDOW TO SELECT FORMAT!!!!
		var doc_HtmlPrintedVersion = printTreeS( PlaneaDocument.getXMLDatabase().documentElement, selected_tree_values, "html5", undefined );
	
		var template_docx = "chrome://planea/content/TemplateDocument.docx";
		var dmt = new DOMParser().parseFromString( doc_HtmlPrintedVersion, 'text/html');
		var bodynode = dmt.getElementsByTagName("html")[0];		
		
		var outputPlaneaHtml = normalizePath( fs.getProfileDirectory() + "\\" + "outputPlanea.html" );
		var outputPlaneaDocx = normalizePath( fs.getProfileDirectory() + "\\" + "outputPlanea.docx" );
		var outputPlaneaHtmlUri = "file:///"+(outputPlaneaHtml.replace(/\\/gi, "/" ));
		var outputPlaneaDocxUri  ="file:///"+outputPlaneaDocx.replace(/\\/gi, "/" );
		
		fs.writeFile( outputPlaneaHtml, doc_HtmlPrintedVersion );
		
		var template_docx_path = fs.chromeToPath( template_docx );
		
		var docxcontent = '';
		fs.readFileBinaryAsync( template_docx_path, 
			function(result, file) {
				log( "printDOC > unzipping:" + file.name );
				
				var templatedocx = new docx(result);
				var docx_html = templatedocx.fullhtml;
				log( "printDOC > word document xml to html:" + docx_html );
				//assign DOM node to docx
				templatedocx.DOM = bodynode;
				templatedocx['images'] = printimages;
				//now we create a new docx object from our template with the DOM (html node > bodynode) updated
				//CONVERSION from html to docx HAPPENS HERE
				var newdocx = new docx( templatedocx );
				
				//fs.writeFileBinary( normalizePath( print_output+".docx" ), newdocx.string );
				var file_saved_path = saveDocxAs( newdocx.string, "binary" );
				fs.launchFile( file_saved_path );
			});
		
	}//end confirm
}



function printPDF( record_id ) {
			
	var selected_tree_title = getRecordValue( record_id, "titulo" );
	var selected_tree_description = getRecordValue( record_id, "descripcion" );
	var selected_tree_values = getRecordValue( record_id, "seleccion" );
	
	if (confirm( "¿Está seguro que quiere generar este informe?" )) {
			
		log( 'printPDF() :'+record_id );

		var doc_HtmlPrintedVersion = printTreeS( PlaneaDocument.getXMLDatabase().documentElement, selected_tree_values, "html5", undefined );
	
		//printTreeS( PlaneaDocument.getXMLDatabase().documentElement, selected_tree_values, "html5", undefined );
		
		var outputPlaneaHtml = normalizePath( fs.getProfileDirectory() + "\\" + "outputPlanea.html" );
		var outputPlaneaHtml4 = normalizePath( fs.getProfileDirectory() + "\\" + "html4Planea.html" );
		var outputPlaneaPdf = normalizePath( fs.getProfileDirectory() + "\\" + "outputPlanea.pdf" );
		var outputPlaneaHtmlUri = "file:///"+(outputPlaneaHtml.replace(/\\/gi, "/" ));
		var outputPlaneaHtml4Uri = "file:///"+(outputPlaneaHtml4.replace(/\\/gi, "/" ));
		var outputPlaneaPdfUri  ="file:///"+outputPlaneaPdf.replace(/\\/gi, "/" );
		log( " printPDF > outputPlaneaHtml:" + outputPlaneaHtml+ " outputPlaneaHtmlUrl:" + outputPlaneaHtmlUri );
		fs.writeFile( outputPlaneaHtml, doc_HtmlPrintedVersion );		
		fs.writeFile( outputPlaneaHtml4, doc_Html4 );

		var outputPlaneaHtmlFancy = normalizePath( fs.getProfileDirectory() + "\\" + "outputPlaneaFancy.html" );
		var pDocHTML = PlaneaDocument.createHtmlPrintable();
		fs.writeFile( outputPlaneaHtmlFancy, pDocHTML );
	
		
	
		if ( OsIs("linux") ) {
			var style_site_pdf = fs.getWorkingPath().replace(' ','\\ ') + "/chrome/skin/site_pdf.css";
			outputPlaneaHtml4 = fs.getProfileDirectory() + "/" + "html4Planea.html";
			outputPlaneaPdf = fs.getProfileDirectory() + "/" + "outputPlanea.pdf";
			fs.callProgram( "/utils/linux/converttopdf.sh", [ fs.getWorkingPath().replace(' ','\\ ')+'/utils/win/converttopdf.php', 
																outputPlaneaHtml4, 
																outputPlaneaPdf, 
																style_site_pdf ] );
			//fs.callProgram( "\\utils\\win\\wkhtmltopdf", [ outputPlaneaHtmlUri, outputPlaneaPdf ] );
			var FF = fs.readAsDataURLSync( outputPlaneaPdf );
			var file_saved_path = savePdfAs( FF, "uri" );
			setTimeout( function() { fs.launchFile( file_saved_path ) }, 1500 );
			
		} else if ( OsIs("win") ) {
			var style_site_pdf = fs.getWorkingPath() + "\\chrome\\skin\\site_pdf.css";
			
			fs.callProgram( "\\utils\\win\\php\\php.exe", [ fs.getWorkingPath()+"\\utils\\win\\converttopdf.php", 
															outputPlaneaHtml4,
															outputPlaneaPdf,
															style_site_pdf ] );
															
			//fs.callProgram( "\\utils\\win\\wkhtmltopdf.exe", [ outputPlaneaHtmlUri, outputPlaneaPdf ] );
			var FF = fs.readAsDataURLSync( outputPlaneaPdf );
			var file_saved_path = savePdfAs( FF, "uri" );
			
			setTimeout( function() { fs.launchFile( normalizePath( file_saved_path ) ) }, 1500 );
			
			/*
			fs.readAsDataURL( outputPlaneaPdf, function(e) {
				var file_saved_path = savePdfAs( e.target.result, "uri" );
				fs.launchFile( file_saved_path );
			} );
			*/
		}
		//fs.callProgram( "\\utils\\win\\php\\php.exe", [ "converttopdf.php", outputPlaneaHtmlUri, outputPlaneaPdf ] );
		//fs.callProgram( "\\utils\\win\\converttopdf.bat", [ outputPlaneaHtmlUri, outputPlaneaPdf ] );
		

		

		/** JSPDF */
		
		//log("global.console:" + typeof(window.console));
		//var doc = new jsPDF();
		//doc.text(20, 20, 'Hello world!');
		//doc.text(20, 30, 'This is client-side Javascript, pumping out a PDF.');
		//doc.addPage();
		//doc.text(20, 20, 'Do you like that?');

		//doc.save('Test.pdf');
		//log( doc.output('dataurlstring') );
		//doc.output('dataurlnewwindow');
		//savePdfAs( doc.output('dataurlstring')  );
		/*
		log("pDocHTML:"+pDocHTML);
		
		var doc = new jsPDF();
		var specialElementHandlers = {
			'#editor': function(element, renderer){
				return true;
			}
		};
		*/
		
		//doc.fromHTML( remove_html_namespace( pDocHTML ), 15, 15, {
		//doc.fromHTML( remove_html_namespace( pDocHTML ), 15, 15, {
		//	'width': 1200, 
		//	'elementHandlers': specialElementHandlers
		//});
		//savePdfAs( doc.output('dataurlstring')  );
		
	}

}


function chekTemplateCoherence( title, open, close ) {

	var checking_template_coherence = title + open + close;
	var parse = new DOMParser();
	try {
		parse.parseFromString(checking_template_coherence,"text/xml");
	} catch(e) {
		error("chekTemplateCoherence() > Malformed Incoherence in :" + chekTemplateCoherence);
		return false;
	}
	return true;
}

function getObjectRecordPreviewActions( recordNode, object_preview_template, popup ) {

    var record_class = GetAttribute( recordNode, "clase" );
    var rec_id = GetAttribute( recordNode, "id" );

	var rec_preview_template = object_preview_template || _dbobjects[record_class]["preview"];

	if (popup && popup!="") {
		rec_id = rec_id + popup;
		record_class = record_class+popup;
	}
	
    var rec_preview = getObjectRecordPreview( recordNode, rec_preview_template, popup );
	var actions_preview = getObjectRecordActions( recordNode, popup );
	
    var fields_name_preview = rec_preview_template.split("::");
    var fields_preview = rec_preview.split("::");

    if (fields_name_preview.length!=fields_preview.length) {
        error( "fields_name_preview:" + fields_name_preview + " does not match fields_preview:" + fields_preview );
    }

    var result = '\n\t<div class="preview" id="{ID}_preview">';
    result+= '\n\t\t<div class="preview_text">';

    for( field in fields_preview) {
        var field_preview = fields_preview[field];
        var field_name = fields_name_preview[field];

        result+= '\n\t\t\t<div class="preview_field preview_class_'+record_class+'" id="rec_{ID}_field_'+field_name+'">'+field_preview+'</div>';       
    }
	
    result+= '\n\t\t</div>';
	result+= actions_preview;
    result+= '\n\t</div>';
	
	result = result.replace( /\{ID\}/gi, rec_id);
	
    return result;

}

function getObjectRecordActions( recordNode, popup ) {
	var record_class = GetAttribute( recordNode, "clase" );
	var rec_id = GetAttribute( recordNode, "id" );
	
	var execute_action = _templates[ "execute_action_"+record_class ];
	var delete_action  ="";
	var order_action = "";
	var add_action = "";
	/*
		'<td class="record_actions record_delete">'+actions_template+' <span class="order">{ORDER}</span></td>'
	*/

	
	
	if (popup && popup!="") {
		rec_id = rec_id + popup;
		record_class = record_class + popup;
	}
	
	var template_actions = getMultipleTemplate("multiple_records_actions", record_class );
	
	/*
	var result = '\n\t\t<div class="record_actions">';
    //result+= '\n\t\t\t<span class="edit" onclick="javascript:EditRecord(\'{ID}\');">Modificar</span>';    
    result+= '\n\t\t\t';
	*/
	add_action = '{MULTIPLEADDRECORD}';
	//add_action = '<span class="add" onclick="javascript:AddRecord(\'{CLASSREF}\',\'{HERENCE}\');" title="Eliminar"> </span>';
	order_action = '<span class="order" onclick="javascript:OrderRecord(\'{CLASSREF}\',\'{ID}\');" title="Eliminar"> </span>'; 
	delete_action = '<span class="delete" onclick="javascript:DeleteRecord(\'{CLASSREF}\',\'{ID}\');" title="Eliminar"> </span>';
	
	if (execute_action==undefined) execute_action = "";
	template_actions = template_actions.replace( /\{ADDACTION\}/gi, add_action);
	template_actions = template_actions.replace( /\{ORDERACTION\}/gi, order_action);
	template_actions = template_actions.replace( /\{DELETEACTION\}/gi, delete_action);
	template_actions = template_actions.replace( /\{EXECUTEACTION\}/gi, execute_action);
	template_actions = template_actions.replace( /\{ID\}/gi, rec_id);
    
	
	return template_actions;
}

function getObjectRecordPreviewField( recordNode, field_name, popup ) {
	//log("getObjectRecordPreviewField() > field_name: " + field_name );
	
    var record_class = GetAttribute( recordNode, "clase" );
    var record_id = GetAttribute( recordNode, "id" );
	var record_order = GetAttribute( recordNode, "order" );
	
	if (field_name=="__orden__" || field_name=="__order__") return (record_order+1);
	if (field_name=="__orden_alpha__" || field_name=="__orden_alpha__") return alphas[ record_order ];
	
	var values = evaluateXPath( recordNode, "campo[@clase ='"+field_name+"']" );
	
	if (popup) {
		record_id = record_id + popup;
		record_class = record_class + popup;
	}
	
	
    var actual_value = "";
	
    if (values.length>=1) {

        var fieldNode = values[0];            
/*
        var field_values = evaluateXPath( fieldNode, "valor" );

        if (field_values.length>0 
		&& field_values[0].childNodes 
		&& field_values[0].childNodes.length ) 
            actual_value = field_values[0].childNodes[0].nodeValue;            
*/
		actual_value = GetValues(fieldNode);
        //REFERENCES: use getObjectRecordPreview
        // <registro id="">
        //  <campo id="" clase="referencia" referencia="persona" >Responde a
        //      <valor>persona_321</valor>
        //  </campo>
		if ( GetAttribute( fieldNode, "tipo" )=="parrafo" || GetAttribute( fieldNode, "tipo" )=="texto") {
			
			actual_value = strip(actual_value);
			
		} else if ( GetAttribute( fieldNode, "tipo" )=="referencia" 
			&&  actual_value!=''
			&& actual_value!=undefined ) {

            var referenceClass = GetAttribute( fieldNode , "referencia" );

            var objectNode = _dbobjects[ referenceClass ]["objectNode"];
            var object_preview = _dbobjects[ referenceClass ]["preview"];

			/*
            if (_dbobjects[ referenceClass ]["references"]==undefined) 
				_dbobjects[ referenceClass ]["references"] = [];

            _dbobjects[ referenceClass ]["references"]['rec_'+record_id+'_field_'+field_name] = "updated";
			*/
            //alert( "Este registro de un objecto de clase " + record_class + " tiene el campo "+ fname +" apuntando a " + objectClass + " de id " + campo_sugerido );

            var ref_field_values = evaluateXPath( objectNode.parentNode, "valor" );

            if (ref_field_values.length>0) {
                var ref_valuesNode = ref_field_values[0];
                var rec_values = evaluateXPath( ref_valuesNode, "registro[@id='"+actual_value+"']" );

                if (rec_values.length>0) {//supposing only one record with id=actual_value
                    var ref_recordNode = rec_values[0];
            		var ref_actual_value = getObjectRecordPreview( ref_recordNode, object_preview, popup );

                    actual_value = ref_actual_value.replace( new RegExp("::","gi"), ", ");

                } else {
                    actual_value = "(sin registros) Nuevo/a " + referenceClass;
                }
            } else {                
                actual_value = "(sin valores) Nuevo/a " + referenceClass;
            }
        }

        if (actual_value=="") actual_value = "...";
    }

	//log("getObjectRecordPreviewField() > actual_value: " + actual_value );
	
    return actual_value;
}

/**
*   getObjectRecordPreview( recordNode, preview_template )
*
*   create object's preview taking the values from recordNode xml "<registro>...</registro>"
*
*/
function getObjectRecordPreview( recordNode, preview_template, popup ) {
	//log("getObjectRecordPreview() > recordNode["+recordNode.nodeName+"] preview_template: " + preview_template + " popup:" + popup);
    var record_class = GetAttribute( recordNode, "clase" );
	var result = preview_template;
	
	if (_dbobjects[record_class])
		if (_dbobjects[record_class]["preview"])
			result = _dbobjects[record_class]["preview"];
		
	if (popup) {
		record_class = record_class + popup;
	}
	//log("getObjectRecordPreview() > preview:"+result);
	if (result) {
		var pre = result.split("::");
		
		for( var f in pre) {
			var fname = pre[f];
			var actual_value = getObjectRecordPreviewField( recordNode, fname, popup );
			result = result.replace( new RegExp( fname, "gi" ) , actual_value );
		}
	} else error("getObjectRecordPreview() > no preview! for object class ["+record_class+"]");

	return result;
}


function isObjectTableDeclared( objectClass ) {
	if (_dbobjects[ objectClass ]!=undefined) {
		return true;
	}
	return false;
}

function isReferenceable( objectClass ) {
	return (getObjectClassReference( objectClass ) == (objectClass+"_RF1_") );
}

function getObjectClassReference( objectClass ) {
	
	var objectClassRef = objectClass;
	var i = 0;
	while( isObjectTableDeclared(objectClassRef) ) {
		i++;
		objectClassRef = objectClass + "_RF"+i+"_";
		if (i>40) {
			error("getObjectClassReference > iteration > 40 ... never ending loop. force quit.");
			return "errrrror";
		}
	}
	return objectClassRef;
}

/**
* registerObject()
*
* objectNode is an xml node like:
*		<ficha ...>
*			<campo >
*			<campo >
*			...
*		</ficha>
*
* this function create the template for editing object "objectClass"

and save the object reference in:
*_dbobjects[ objectClassRef ] = { 	
									'template': object_template, 
									'preview': object_preview,
									'objectNode': objectNode,
									'objectPath': objectPath,
									'parentNode': parentNode,
									'objectClass': objectClass,
									'objectClassRef': objectClassRef
								}

* template for this fields are listed at the beginning of this file like:

* _templates['texto'] = ....
* _templates['parrafo'] = ....
*
*/
function getObjectPreview( objectNode ) {
	return GetAttribute( objectNode, "preview" );
}

function createObject( objectNode, objectPath, parentNode, objectClass, objectClassRef ) {

	return { 	
			'template': '', 
			'preview': getObjectPreview( objectNode ),
			'objectNode': objectNode,
			'objectPath': objectPath,
			'parentNode': parentNode,
			'objectClass': objectClass,
			'objectClassRef': objectClassRef,
			'instances': {}, /*objects instances > field_path_1 > objectClass_RF1_, field_path_2 > _objectClass_RF2_*/
			'references': [],
			'formulas': [],
			'sums': {},
			'popups': ''
			};

}


function registerObject( objectNode, objectClass, parentNode, objectPath, popup ) {

    var valor_campo = '';
    var label_campo = '';
    var object_template = '';
	var objectClassRef = "";
	
	//we create the reference object, so it can be referenced by inner fields
	//but we also check that if two multiple objects are declared with same class name we just name it different
	if (popup==undefined) {
		//objects with same name can coexists, with limitations...
		objectClassRef = getObjectClassReference( objectClass );
		
	} else {
		return;
	}
	 
	
	_dbobjects[ objectClassRef ] = createObject( objectNode, objectPath, parentNode, objectClass, objectClassRef );

								
	//log("registerObject() > objectClassRef ["+objectClassRef+"] "+JSON.stringify(_dbobjects[ objectClassRef ],null, "\n\t"));
	
	//REGISTER FIELDS!!!! (calling getFieldTemplate for the first time for each field)
    for(var c=0;c<objectNode.childNodes.length;c++) {

        var fieldNode = objectNode.childNodes[c];		
		
        if (fieldNode.nodeName=="campo") {
		
			var field_name = getFieldName( fieldNode );
			//generates iterative check for inner fields, creating objects and fields
            var temp_aux = getFieldTemplate( fieldNode, objectPath+":"+field_name );
			// iria el objectClass en lugar de {HERENCE_OBJECT_TEMPLATE}
			/*
            valor_campo = GetValues( fieldNode );
            label_campo  = GetFieldLabel( fieldNode );

            if (temp_aux) {
			    temp_aux = temp_aux.replace( /\{VALOR\}/gi, valor_campo );
                temp_aux = temp_aux.replace( /\{NOMBRECAMPO\}/gi, label_campo);
                object_template+= temp_aux;
            } else {
                error( "registerObject() > processing ficha: objectClass:" 
                        + objectClassRef + " field_class: " 
                        + field_class + " type: " 
                        + field_type + " has no template!");
            }
			*/
        }
    }

    //Save object prototype in _dbobjects[].... so we can use it to create new records.
	_dbobjects[ objectClassRef ]['template'] = object_template;

	if (objectClassRef!=objectClass) {
		//copy sums!!
		for( var field_class in _dbobjects[ objectClass ]['sums']) {
			var objSum = _dbobjects[ objectClass ]['sums'][field_class];
			var cloneSum = createSum( field_class, objectPath  );
			_dbobjects[ objectClassRef ]['sums'][field_class] = cloneSum;
		}
	}
	
    //log("registerObject() : object template created for [" + objectClassRef +"] \n" + object_template +"" );
	//log( " object_template:" + object_template);
    return object_template;
}

function assignReferenceToSectionTemplate( str_code, field_class, field_path ) {
	
	var tpl = _templates[str_code+"_"+field_class];
	if (tpl) return tpl;
	tpl = _templates[str_code+"_"+field_path];
	if (tpl) return tpl;
	tpl = _templates[str_code+"_"+field_class+"_"+field_path];
	if (tpl) return tpl;
	tpl = _templates[str_code];
	return tpl;
}

/**
*  make a <select> control to make a reference to the value "arbol:category:section:...:section:field", which is the path of the section 
*/
function getFieldTemplateReferenceToSection( _template, fieldNode, herence ) {
	
	var template = _template;
	var section_path_root	= GetAttribute( fieldNode, "referencia" );
	
	var fieldClass	= getFieldClass(fieldNode);	
    var fieldValues = evaluateXPath( fieldNode, "valor");
    var fieldCustomPreview = GetAttribute( fieldNode, "preview" );
	var fieldClass	= getFieldClass(fieldNode);	
	
    var fieldValue = undefined;

    if ( fieldValues.length>0) {
	   fieldValue = GetValues( fieldNode );
	}
	
	var	select_str 	= '\n<div class="select_reference select_reference_to_section"><table cellpadding="0" cellspacing="0" border="0"><tr><td><select id="{IDCAMPO}" class="select_reference select_reference_to_section" referencia="'+section_path_root+'" onchange="javascript:SaveField(\'{PATHCAMPO}\',\'{IDCAMPO}\');">{OPTIONS}\n</select></td><td>{SELACTION}</td></tr></table></div>';
	//<div class="search_multiple" onclick="javascript:PopupRelational(\'{PATHCAMPO}\',\'{IDCAMPO}\');"> </div>
	var options_str = '\n\t<option value="">Seleccionar sección</option>';
	
	for(var section_path in _dbForms) {
		
		var sForm = _dbForms[ section_path ];
		if (sForm) {
			var sectionNode = sForm['node'];
			section_name = getSectionName(sectionNode);
		} else { error("assignReferenceToSectionTemplate()> Error no form: "+section_path); return _template; }
		
		var isSelected;
        (section_path==fieldValue && fieldValue!=undefined) ? isSelected = "selected=\"true\"" : isSelected = "";
		
		var section_path_ex = section_path.split( ":" );
		css_style = 'class="levels_'+section_path_ex.length+'_"';
		
		var rec_preview = assignReferenceToSectionTemplate("reference_to_section_select_option", fieldClass, herence ).replace(/\{SECTIONNAME\}/gi, section_name );
		options_str += '\n\t<option '+css_style+' '+isSelected+' value="'+section_path+'">' + rec_preview.replace( new RegExp("::","gi"),", ") + '</option>';
	}
	
	/*
	if ( records.length >= 0 ) {
		var valorNode = records[0];
		if (valorNode) {
		
			for( var r=0; r < valorNode.childNodes.length; r++) {
											
				var recordNode = valorNode.childNodes[r];				
				
				if (recordNode.nodeName =="registro") {
				
					var recId = GetAttribute( recordNode, 'id' );
					var rec_preview = getObjectRecordPreview( recordNode, fieldCustomPreview );
                    var isSelected;
                    (recId==fieldValue && fieldValue!=undefined) ? isSelected = "selected=\"true\"" : isSelected = "";
					
					if ( recordNode ) {
						options_str += '\n\t<option '+isSelected+' value="'+recId+'">' + rec_preview.replace( new RegExp("::","gi"),", ") + '</option>';
					}
					
				}
			}
			
			options_str += '\n\t<option value="-1">' + Translate("Add") + " " + Translate(objectClass) + '</option>';
		
		}
	}
	*/
	
	select_str = select_str.replace( "{OPTIONS}", options_str );	
	template = template.replace( /\{VALOR\}/gi, select_str );
	template = template.replace( /\{SELACTION\}/gi, "" );
	
	return template;
}

function getFieldTemplateReferenceOptions( objectClass, fieldValue, fieldCustomPreview, fieldClass ) {
	
	var dbobject	= _dbobjects[ objectClass ];	
	var objectNode	= dbobject[ 'objectNode' ];
	var parentNode	= dbobject[ 'parentNode' ];
	var objectPreview  = dbobject[ 'preview' ];
	if (fieldCustomPreview=="")
		fieldCustomPreview = objectPreview;
		
	if (fieldCustomPreview=="attribute not found: preview")
		fieldCustomPreview = "";	

	var options_str = "";
	var records = evaluateXPath( objectNode.parentNode, "valor" );
	
	if ( records.length >= 0 ) {
	
		var valorNode = records[0];
		
		if (valorNode) {
		
			for( var r=0; r < valorNode.childNodes.length; r++) {
											
				var recordNode = valorNode.childNodes[r];				
				
				if (recordNode.nodeName =="registro") {
				
					var recId = GetAttribute( recordNode, 'id' );
					var rec_preview = getObjectRecordPreview( recordNode, fieldCustomPreview );
                    var isSelected;
                    (recId==fieldValue && fieldValue!=undefined) ? isSelected = "selected=\"true\"" : isSelected = "";		
					
					
					if ( recordNode ) {
						var obj_field = "";
						var obj_field_val = "";
						if (fieldClass!=undefined) {
							var val = getRecordToJSON( recordNode );
							obj_field = ' subvalue="'+val[fieldClass]+'" ';
							//obj_field_val = '<span class="option_'+fieldClass+'">'+val[fieldClass]+'</span>';
						}
						options_str += '\n\t<option '+isSelected+' value="'+recId+'" '+obj_field+'>' + rec_preview.replace( new RegExp("::","gi"),", ") + obj_field_val + '</option>';
					}
					
				}
			}
			
			options_str += '\n\t<option value="-1">' + Translate("Add") + " " + Translate(objectClass) + '</option>';
		
		} else {
			options_str += '\n\t<option value="-1">' + Translate("Add") + " " + Translate(objectClass) + '</option>';
		}
	} else {
		options_str += '\n\t<option value="-1">' + Translate("Add") + " " + Translate(objectClass) + '</option>';
	}
	return options_str;
}

/**
*	Build a template for a reference field from a xml node like <campo clase="clase" referencia="object"> 
*	so the user can select an option from multiple object records
*
*		_template
*		fieldNode
*		herence
*
*/
function getFieldTemplateReference( _template, fieldNode, herence ) {

	//poner una funcion javascript para que procese:
	//  1) la referencia: persona por ejemplo
	//	2) traer el objecto al que se hace referencia: _dbobjects['persona'] y buscar en su nodo los hijos (<registro id="persona_0"> </registro>) que corresponden a 
	// lo que tenemos en <campo referencia="persona"><valor>persona_0</valor></campo>
	// si es nulo o no existe, deberia tirar un error...
	
	var RefObjectClass	= GetAttribute( fieldNode, "referencia" );
	var RefObjectFieldClass = GetAttribute( fieldNode, "referenciaclase" );
	var fieldClass	= getFieldClass(fieldNode);	
    var fieldValues = evaluateXPath( fieldNode, "valor");
    var fieldCustomPreview = GetAttribute( fieldNode, "preview" );
	var isreferenceable = isReferenceable( RefObjectClass );
	
/*
	if (!isreferenceable) {
		error(" objectClass ["+objectClass+"] is not referenceable. There are duplicate table sources. Define specifically or die!!!");
		return _template;
	}
*/

    var fieldValue = undefined;

    if ( fieldValues.length>0) {
       //fieldValue = fieldValues[0].childNodes[0].nodeValue;
	   
	   fieldValue = GetValues( fieldNode );
	   if (fieldValue==undefined) {
			error("getFieldTemplateReference() > fieldValues[0] undefined for objectClass:["+objectClass+"] fieldClass:["+fieldClass+"]");
	   } else {
			//fieldValue = GetValues( fieldNode );
			/*
			if (fieldValues[0].childNodes[0]==undefined) {
				error("getFieldTemplateReference() > fieldValues[0].childNodes[0] undefined for objectClass:["+objectClass+"] fieldClass:["+fieldClass+"]");
				if (fieldNode.parentNode.nodeName=="registro") {
					error("getFieldTemplateReference() > correspond to record: " 
							+ fieldNode.parentNode.getAttribute("id") 
							+ " of object class:" + fieldNode.parentNode.getAttribute("clase"));
				}
			} else fieldValue = fieldValues[0].childNodes[0].nodeValue;
			*/
	   }   
	   
    }

	var dbobject	= _dbobjects[ RefObjectClass ];
	if (dbobject==undefined) return error("getFieldTemplateReference() > Object unregistered! objectClass["+RefObjectClass+"]");
	var dbinstances  = _dbobjects[ RefObjectClass ]["instances"];
	
	if (dbobject) {
		//log("getFieldTemplateReference() : referencia: objectClass: " +  objectClass  );
	} else error(" getFieldTemplateReference() : referencia: objectClass: " +  RefObjectClass  );
	
	
    var template = _template;

	//now take the <valor> childs where are the <registro> records, and create in memory a reference to this objects...
	//....
	
	var	select_str 	= '\n<div class="select_reference"><table cellpadding="0" cellspacing="0" border="0"><tr><td><select id="{IDCAMPO}" class="select_reference" referencia="'+RefObjectClass+'" onchange="javascript:SaveField(\'{PATHCAMPO}\',\'{IDCAMPO}\');">{OPTIONS}\n</select></td><td><div class="search_multiple" onclick="javascript:PopupRelational(\'{PATHCAMPO}\',\'{IDCAMPO}\');"> </div></td></tr></table></div>';
	var options_str = '\n\t<option value="">Seleccionar ' + RefObjectClass + '</option>';
	
	options_str+= getFieldTemplateReferenceOptions( RefObjectClass, fieldValue, fieldCustomPreview, RefObjectFieldClass );
	

	for( var object_path in dbinstances ) {
		var objectClassRef = dbinstances[ object_path ];
		options_str+= getFieldTemplateReferenceOptions( objectClassRef, fieldValue, fieldCustomPreview, RefObjectFieldClass );
	}

	
	select_str = select_str.replace( "{OPTIONS}", options_str );

	template = template.replace( /\{VALOR\}/gi, select_str );	

	if (dbobject[ 'references' ]) {
		if (dbobject[ 'references' ][herence]) {
			error("getFieldTemplateReference() > duplicate reference for : ["+RefObjectClass+"] and field: ["+ herence+"]");
		} else log("getFieldTemplateReference() > saving reference in _dbobjects["+RefObjectClass+"] for field ["+ herence+"]");
		
		dbobject[ 'references' ][herence] = {
					'field_id': '',
					'field_id_reference': '',
					'field_id_select': '',
					'field_path': herence,
					'fieldNode': fieldNode
		}
		
		_dbobjects[ RefObjectClass ] = dbobject;
		//log("getFieldTemplateReference() > OK added references to object: ["+RefObjectClass+"]['references']["+herence+"] => n: "+ _dbobjects[ RefObjectClass ]['references'][herence]['field_path'] );
	} else error("getFieldTemplateReference() > cannot add references to object: ["+RefObjectClass+"]");
	
	return template;
}

function updateReferences( objectClass ) {

	var fieldCustomPreview;
	var popup = "";
	var objectClassRef = objectClass;
	var	objectClassSource = objectClass;
	
	if (objectClassRef.indexOf('_popup')>=0) {
		
		var idx = objectClass.indexOf('_popup');
		
		objectClassSource = objectClass.substr( 0, idx);
		popup = "_popup";
	}
	
	var dbobject	= _dbobjects[ objectClassSource ];
	
	if (dbobject) {
		log("updateReferences() : referencia: objectClass: " +  objectClass + " src:" + objectClassSource  );
	} else {
		error(" updateReferences() : referencia: objectClass: " +  objectClass+ " src:" + objectClassSource  );
		return;
	}
	
	var dbinstances  = dbobject["instances"];
	//var template	= dbobject[ 'template' ]; //we dont use this because it's the template for edition
	var objectNode	= dbobject[ 'objectNode' ];
	var parentNode	= dbobject[ 'parentNode' ];
	var objectPreview  = dbobject[ 'preview' ];
	var references = dbobject['references'];
		
	
	if (references==undefined) {
		error("updateReferences) > No references for objectClassSource: ["+objectClassSource+"] references: ["+references+"]");
		return;
	}
	
    if (fieldCustomPreview=="") fieldCustomPreview = objectPreview;
	//log("updateReferences() checking records");
	var records 	= evaluateXPath( objectNode.parentNode, "valor" );
	
	//WARNING ESTO DEBE SER UN TEMPLATE!!!!
	var	select_str 	= '\n<div class="select_reference"><table cellpadding="0" cellspacing="0" border="0"><tr><td><select id="{IDCAMPO}" class="select_reference" referencia="'+objectClass+'" onchange="javascript:SaveField(\'{PATHCAMPO}\',\'{IDCAMPO}\');">{OPTIONS}\n</select></td><td><div class="search_multiple" onclick="javascript:PopupRelational(\'{PATHCAMPO}\',\'{IDCAMPO}\');">   </div></td></tr></table></div>';
	
	
	log("updateReferences()  checking references");
	for( var her in references) {
	
		var ref_str = select_str;
		var ref_object = references[her];
		
		
		
		var fieldNode = ref_object['fieldNode'];
		var field_id = ref_object['field_id'];
		var field_path = ref_object['field_path'];
		var field_id_ref = ref_object['field_id_reference']; //see campo_referencia.html
		var field_id_select = ref_object['field_id_select'];
		
		log("updateReferences()  herence:["+her+"] ref_object:["+ref_object+"] field_id_ref["+field_id_ref+"]");
		
		var fieldClass	= getFieldClass( fieldNode );	
		var fieldValues = evaluateXPath( fieldNode, "valor");
		
		var fieldValue = undefined;

		if ( fieldValues.length>0) {
			fieldValue = fieldValues[0];
			if (fieldValue && fieldValue.childNodes) {
				fieldValue = fieldValue.childNodes[0].nodeValue;
			} else fieldValue = "";
		}
		
		var RefObjectFieldClass = GetAttribute( fieldNode, "referenciaclase" );
		
		var options_str = '\n\t<option value="">Seleccionar ' + objectClass + '</option>';
		
		options_str+= getFieldTemplateReferenceOptions( objectClassSource, fieldValue, fieldCustomPreview, RefObjectFieldClass );

		for( var object_path in dbinstances ) {
			var objectClassRef = dbinstances[ object_path ];
			options_str+= getFieldTemplateReferenceOptions( objectClassRef, fieldValue, fieldCustomPreview, RefObjectFieldClass );
		}
		
		/*
		
		
		if ( records.length >= 0 ) {
			var valorNode = records[0];
			if (valorNode) {
			
				for( var r=0; r < valorNode.childNodes.length; r++) {
												
					var recordNode = valorNode.childNodes[r];				
					
					if (recordNode.nodeName =="registro") {
					
						var recId = GetAttribute( recordNode, 'id' );
						var rec_preview = getObjectRecordPreview( recordNode, fieldCustomPreview );
						var isSelected;
						(recId==fieldValue) ? isSelected = "selected=\"true\"" : isSelected = "";
						
						if ( recordNode ) {
							options_str += '\n\t<option '+isSelected+' value="'+recId+'">' + rec_preview.replace( new RegExp("::","gi"),", ") + '</option>';
						}
						
					}
				}
				//WARNING!!! ESTO TAMBIEN DEBE SER UN TEMPLATE!!!!
				options_str += '\n\t<option value="-1">' + Translate("Add") + " " + Translate(objectClass) + '</option>';
			
			}
			
			
		}
		*/
		
		ref_str = ref_str.replace( "{OPTIONS}", options_str );		
		ref_str = ref_str.replace( /\{IDCAMPO\}/gi, field_id  );
		ref_str = ref_str.replace( /\{HERENCE\}/gi, field_path );
		ref_str = ref_str.replace( /\{PATHCAMPO\}/gi, field_path );		
		if (field_id_ref!="") {
		var htmlRef = document.getElementById( field_id_ref);
			if (htmlRef) {
				//log( "field_id_ref: ["+field_id_ref+"] htmlRef.innerHTML:" + htmlRef.innerHTML);
				htmlRef.innerHTML = add_html_namespace( ref_str );
				//log("updateReferences() > OK!! htmlElement ["+field_id_ref+"] found from ["+field_path+"]");
			}
			//else error("updateReferences() > htmlElement ["+field_id_ref+"] not found! from ["+field_path+"]");
		}
	}
	
}


/**
*	Create HTML EDITABLE record view of recordNode (xml db node)
*	with template object_preview (nombre::apellido::dni)
*/
function getObjectRecordEditView( parent_field_path, recordNode, object_preview, popup ) {

    var edit_str = "";
    var rec_id = GetAttribute( recordNode, "id" );
	var rec_class = GetAttribute( recordNode, "clase" );
	
	var base_class_object = getBaseClassObject(rec_class);
	
	if (popup!=undefined && popup!="") { rec_id = rec_id + popup; log("getObjectRecordEditView()> from popup => recid = ["+rec_id+"]");}
	
	//log("getObjectRecordEditView() > record_id [" + rec_id + "]  rec_class ["+rec_class+"]");
	
	var dbRecord = _dbRecords[rec_id];
	if (!dbRecord) {
		error("getObjectRecordEditView() > dbRecord undefined for rec_id: ["+rec_id+"]");
	}
	
	dbRecord["fields"] = {};
	
    for( var c = 0; c < recordNode.childNodes.length; c++ ) {
        var fieldNode = recordNode.childNodes[c];

        if (fieldNode.nodeName=="campo") {

            var field_class = GetAttribute( fieldNode, "clase" );
            var field_type = GetAttribute( fieldNode, "tipo" );						
			var record_field_path = trim(parent_field_path+":"+rec_id+":"+field_class);
			var record_field_id = rec_id+"_"+field_class;
			
			dbRecord["fields"][field_class] = { 
				"field_id": record_field_id, 
				"field_path":record_field_path 
				};
			_dbRecords[rec_id] = dbRecord;
			
			log("getObjectRecordEditView() : calling getFieldTemplate for field field_class: " + field_class 
					+ " record_field_path:"+record_field_path
					+ " record_field_id:"+record_field_id );
					
			var tpl_field = getFieldTemplate( fieldNode, record_field_path );
			
			//log("getObjectRecordEditView() : ITERATE END!!! record_field_path:" + record_field_path );
			
			if (field_type.indexOf("multiple")) {
				log("getObjectRecordEditView() > registering field of type [multiple]! ["+record_field_path+"]"); 
			}
			
            if ( tpl_field!=undefined 
				&& trim(tpl_field)!='') {
				
				var dbF = _dbFields[ record_field_path ];
				
				if (dbF==undefined) {
				
					_dbFields[ record_field_path ] = createField( fieldNode, 
							record_field_path, 
							record_field_id, 
							"", /*section_path undefined*/
							parent_field_path, 
							popup );
					
					dbF = _dbFields[ record_field_path ];
				}
				
				dbF["node"] = fieldNode;
				dbF["path"] = record_field_path; 
				dbF["record_id"] = rec_id;
				dbF["class"] = field_class;
				dbF["field_class"] = field_class;
				dbF["field_type"] = field_type;
				dbF["field_id"] = record_field_id;
				dbF["section_path"] = undefined,
				dbF["parent_path"] = parent_field_path,
				dbF["popup"] = popup;
				_dbFields[ record_field_path ] = dbF;
				
				_dbFields[ record_field_path ]["validator"] = assignRecordValidator( parent_field_path, rec_class, record_field_path, field_class, field_type );
				
				//log("getObjectRecordEditView() : registering of record field ["+record_field_path+"] " + JSON.stringify(dbF,null,"\t") );
				
				
				/*TODO: must use completeFieldTemplate with those parameteres*/								
								
                label_campo = GetFieldLabel( fieldNode );
                valor_campo = GetValues( fieldNode );
				objectClass = getFieldReference( fieldNode );
				var field_actions = getFieldTemplateActions( fieldNode );
				tpl_field = tpl_field.replace( /\{FIELDACTIONS\}/gi, field_actions );
			    tpl_field = tpl_field.replace( /\{VALOR\}/gi, valor_campo );
                tpl_field = tpl_field.replace( /\{NOMBRECAMPO\}/gi,  label_campo );
                tpl_field = tpl_field.replace( /\{IDCAMPO\}/gi,  record_field_id );
                tpl_field = tpl_field.replace( /\{PATHCAMPO\}/gi,  record_field_path );
				tpl_field = tpl_field.replace( /\{AYUDARAPIDA\}/gi,  ' ' );
				
				/*WARNING QUE PASA SI EL objectClass aun no esta definido....?!?!?! */
				if (field_type=="referencia") {
					var dbObject = _dbobjects[ objectClass ];
					if (!dbObject) 
						error("getObjectRecordEditView() > REFERENCIA field_type ["+field_type+"] to OBJECT ["+objectClass+"] is not registered yet!! ");
					else
					if (dbObject[ 'references' ]) {
						var dbRefs = dbObject[ 'references' ];
						if (dbRefs[record_field_path]) {
							dbRefs[record_field_path]['field_id'] = record_field_id;
							dbRefs[record_field_path]['field_id_reference'] = 'referencia_'+record_field_id;
							dbRefs[record_field_path]['field_id_select'] = record_field_id;							
							_dbobjects[ objectClass ][ 'references' ]  = dbRefs;		
						} 
						else error("getObjectRecordEditView() dbObject[ 'references' ][record_field_path] not found for "+objectClass+" record_field_path:["+record_field_path+"]");
					} else error("getObjectRecordEditView() dbObject[ 'references' ] not found for "+objectClass);
				}
				
				edit_str+= getMultipleTemplate( "multiple_records_field", objectClass, record_field_path ).replace(/\{CLASS\}/gi, field_class ).replace(/\{FIELDTEMPLATE\}/gi, tpl_field );
                //edit_str+= '<td class="'+field_class+'">'+tpl_field+'</td>';
				
            } else {
                //mul_object_records+= field_class+ " has no template!";
                error( "getRecordObjectView() : record: field class:" + field_class 
                        + " type:" + field_type 
                        + " has no template!");
            }
        }
    }  //end fields of this record   
	//log("getObjectRecordEditView: edit_str: " + edit_str);
    return edit_str;

}

/**
* getObjectRecordView( herence, recordNode, object_preview )
*
*	Build the Object Record View from templates:
*	build the preview + actions block
*	@see getObjectRecordPreviewActions( recordNode, object_preview )
*	build all the fields form block
* @see getObjectRecordEditView( herence, recordNode, object_preview )
*
*/
function getObjectRecordView( herence, recordNode, object_preview_template, popup ) {

    //var record_object_template = _templates['record_object'];
	
    var rec_id = GetAttribute( recordNode, "id" );
	var rec_order = GetAttribute( recordNode, "order" );
    var objectClass = GetAttribute( recordNode, "clase" );//OJO, en <registro clase="persona_RF1" > figura la clase DUPLICADA
	var record_object_template = getMultipleTemplate( 'record_object_table', objectClass, herence );
	var objectClassPop = objectClass;
	
    if (	object_preview_template==undefined || object_preview_template=="") {
    		object_preview_template = _dbobjects[objectClassPop]["preview"];
    		if (object_preview_template==undefined) 
				object_preview_template = "object_preview_template is undefined";    
    }                                      

	//IMPORTANT: if html record is from a popup, the record id must be added the popup parameter, usually "_popup"
	//original rec_id:   objectClass_# = persona_0, persona_3452
	//popup id: objectClass_#_popup => persona_0_popup, persona_3452_popup
	if (popup!=undefined && popup!="") { rec_id = rec_id+popup;
		objectClassPop = objectClass + popup;
	}
	
	//WARNING: each time getObjectRecordView() is called, this info is updated... check this please!!
	// each view of the record has differents IDS (exam: popups) assigned to the inputs Html Elements
	// we must register them here....???
	//for a popup, rec_id is the xmlnode id + popup value > "persona_0_popupXXX"
    _dbRecords[ rec_id ] = { 
		"node": recordNode, 
		"herence": herence,
		"recordPath": herence,
		"recordClass": objectClass,/* persona OR persona_RF1_ =>> */
		"recordClassRef": objectClassPop, /* persona OR person_RF1_ OR persona_popup1_  */
		"fields": {}
	};	
	
    var preview_template = getObjectRecordPreviewActions( recordNode, object_preview_template, popup );
	var fields_str = getObjectRecordEditView( herence, recordNode, object_preview_template, popup );
    var actions_template = getObjectRecordActions( recordNode, popup );
	var multiple_add_record = getMultipleTemplate('multiple_add', objectClass, herence );
	
    record_object_template = record_object_template.replace( /\{PREVIEW\}/gi, preview_template );
    record_object_template = record_object_template.replace( /\{RECORD\}/gi, fields_str );
	record_object_template = record_object_template.replace( /\{RECORDACTIONS\}/gi, actions_template );
    record_object_template = record_object_template.replace( /\{ID\}/gi, rec_id );
	record_object_template = record_object_template.replace( /\{ORDER\}/gi, (rec_order+1) );
	record_object_template = record_object_template.replace( /\{ORDERALPHA\}/gi, alphas[rec_order] );
	record_object_template = record_object_template.replace( /\{MULTIPLEADDRECORD\}/gi, multiple_add_record );	
    record_object_template = record_object_template.replace( /\{HERENCE\}/gi, herence );
	record_object_template = record_object_template.replace( /\{CLASSREF\}/gi, objectClassPop );



    //log("getObjectRecordView() : record class: "+ rec_class +" record id: " + rec_id + " herence:" + herence );

    return record_object_template;
}

/**
*	getFieldTemplateMultiple
*
*	create a template from a <campo> node, to add, modify and delete records
*
*
*/

_dbRelationals = [];

function getFieldTemplateActions( fieldNode ) {
	//maybe could change relative to fieldNode...
	//var field_id = fieldNode.getAttribute("id");
	var field_type = getFieldType( fieldNode );
	var tpl = _templates["field_actions"];
	//log("getFieldTemplateActions() > field_type ["+field_type+"]");
	//log("getFieldTemplateActions() > fieldNode.nodeName = ["+fieldNode.nodeName+"] fieldNode.parentNode.nodeName ["+fieldNode.parentNode.nodeName +"]");
	if (	fieldNode.parentNode.nodeName.toLowerCase()=="registro"
		|| fieldNode.parentNode.nodeName.toLowerCase()=="ficha"
		|| field_type.indexOf("multiple")==0
		) {
		
		//log("getFieldTemplateActions() > field_type is a multiple record or registro or ficha");
		return "";
		
	}
	
	//log("getFieldTemplateActions() > tpl [" + tpl + "]");
	return tpl;
}

function getMultipleTemplate( template_code_str, object_class, object_path ) {
	var template;
	
	template =_templates[template_code_str+"_"+object_class];
	if (template) return template;
	template =_templates[template_code_str+"_"+object_path];
	if (template) return template;
	template =_templates[template_code_str];
	return template;
}

function getFieldTemplateMultiple( _template, xmlNode, field_path, field_id, popup, forceoriginal ) {

    var mul_object_add  = "";
    var mul_object_records  = "";
    var mul_object_records_head = "";
	var mul_object_records_foot = "";
	var temp_aux  = "";
    var template = _template;
    var base_object_class = 'default';
    var object_preview = '[no preview!]';
	var object_class_ref = "";

	var nfields = 0;
	//releva la ficha
    for(var i=0;i<xmlNode.childNodes.length;i++) {

        var childNode = xmlNode.childNodes[i];

        if (childNode.nodeName == "ficha") {
            //process the FICHA/OBJECT to be editable and add some records...
            base_object_class = GetAttribute( childNode, "clase" );
            object_preview = GetAttribute( childNode, "preview" );
			
			//CREATE OBJECT TEMPLATE (if called twice, will create a objectclass new REF with incremental id...
			if (popup==undefined || popup=='') {
			
				object_class_ref = getObjectClassReference( base_object_class );
				registerObject( childNode, base_object_class, xmlNode, field_path );
				
				//SAVE OBJECT Table Instance > duplicate in _dbobjects, and save info in instances
				if (object_class_ref!=base_object_class) {
				
					var dbObj = _dbobjects[base_object_class];
					dbObj['instances'][field_path] = object_class_ref;
					
				}
				if (_dbFields[ field_path ]==undefined)
					_dbFields[ field_path ] = createField( xmlNode, field_path, field_id ); //maybe we must put more values here...
				else
					error("getFieldTemplateMultiple() > Warning already defined _dbFields[" + field_path +"]");
					
				_dbFields[ field_path ]["path"] = field_path;
				_dbFields[ field_path ]["field_id"] = field_id;
				_dbFields[ field_path ]["field_class"] = GetAttribute( xmlNode, "clase");
				_dbFields[ field_path ]["parent_path"] = getParentFieldPath( field_path ); //to iterate over parent OBJECTS !!
				_dbFields[ field_path ]["objectClass"] =  base_object_class;
				_dbFields[ field_path ]["objectClassRef"] =  object_class_ref;
				log("getFieldTemplateMultiple() > multiple field ["+field_path+"] > registering new object from base_object_class["+base_object_class+"] to ["+object_class_ref+"] => " + JSON.stringify( _dbFields[ field_path ], null, "\t" ) );
			} 
			else 
			{
				//passsing popup value
				if (popup=='refresh') {
					//bad!!! object_class_ref must be defined!!! or die!!!
					//or _dbobjects["object_class"] => must have an array of all his "object_class_RFXXXX_"
					//based on the field_id or field_path
					object_class_ref = _dbFields[ field_path ]["objectClassRef"];
					if (object_class_ref==undefined) {
						error("getFieldTemplateMultiple() > object_class_ref UNDEFINED [ " + object_class_ref + "] dbField ["+JSON.stringify(_dbFields[ field_path ]) );
						
					}
					popup = '';
				} else {
					object_class_ref = base_object_class + popup;
					if (_dbobjects[ objectClass ])
						_dbobjects[ objectClass ]['popups']+= popup;//one popup at a time 
											//WARNING WE DONT USE THI.
					log ( " getFieldTemplateMultiple() > it a POPUP!! object_class_ref => base_object_class + popup=> "+object_class_ref);
				}
			}
			
			
			//CREATE TABLE HEADER and FOOTER (HTML VIEW => TABLE HEAD AND FOOTER VIEW)
			for( var k=0; k<childNode.childNodes.length; k++) {
				var fieldNode = childNode.childNodes[k];
				if (fieldNode.nodeName == "campo") {
					nfields++;
					mul_object_records_head+= getMultipleTemplate("multiple_records_field_head", base_object_class, field_path )
													.replace( /\{CLASS\}/gi, getFieldClass(fieldNode) )
													.replace( /\{FIELDNAME\}/gi, getFieldName(fieldNode) );
													
					//'\n<td class="'+getFieldClass(fieldNode)+'">'+getFieldName(fieldNode)+'</td>';
					mul_object_records_foot+= getMultipleTemplate("multiple_records_field_foot", base_object_class, field_path )
													.replace( /\{CLASS\}/gi, getFieldClass(fieldNode) )
													.replace( /\{FIELDNAME\}/gi, getFieldName(fieldNode) )
													.replace( /\{TOTALFIELDID\}/gi, getTotalFieldId( object_class_ref, fieldNode ) ) ;
					//'\n<td class="'+getFieldClass(fieldNode)+'" id="'+getTotalFieldId( object_class_ref, fieldNode )+'"> </td>';
				}
			}
        }

		//CREATE HTML TABLE ROWS FROM XML NODE, warning with popups
        if (childNode.nodeName == "valor") {
            for(var r=0; r<childNode.childNodes.length;r++) {
                var recNode = childNode.childNodes[r];
                if (recNode.nodeName == "registro") {
					log ( " getFieldTemplateMultiple() : START !!!!!! recNode.nodeName: " + recNode.nodeName + " attributes:" + getAttributes( recNode ) );
                    //mul_object_records+= getObjectRecordView( herence, recNode, object_preview );
					mul_object_records+= getObjectRecordView( field_path, recNode, object_preview, popup );
					
					log ( " getFieldTemplateMultiple() : END !!!!!! recNode.nodeName: " + recNode.nodeName + " attributes:" + getAttributes( recNode ) );
                } //end this record
            } //end all records            
        }
    }

    //NEWRECORD
	var mul_object_add_TMP = getMultipleTemplate('multiple_add',base_object_class,field_path).replace( /\{HERENCE\}/gi, field_path );
    
	//HEAD
	//heads field... field 1, field 2, field 3 or <td>field1</td><td>field2</td><td>field3</td>....
	var mul_object_records_head_TMP = getMultipleTemplate('multiple_records_head',base_object_class,field_path).replace( /\{RECORDSHEAD\}/gi, mul_object_records_head );	
	mul_object_records_head_TMP = mul_object_records_head_TMP.replace( /\{RECORDSHEAD\}/gi, mul_object_records_head );
	//FOOT
	//foot... formulas and general action buttons
	var mul_object_records_foot_TMP = getMultipleTemplate('multiple_records_foot',base_object_class,field_path).replace( /\{RECORDSFOOT\}/gi, mul_object_records_foot );

	var mul_object_records_TMP = getMultipleTemplate('multiple_records',base_object_class,field_path)
										.replace( /\{HERENCE\}/gi, field_path )
										.replace( /\{NFIELDS\}/gi, nfields );    
    
	
	mul_object_records_TMP = mul_object_records_TMP.replace(/\{HEAD\}/gi, mul_object_records_head_TMP );
	mul_object_records_TMP = mul_object_records_TMP.replace(/\{RECORDS\}/gi, mul_object_records );
	mul_object_records_TMP = mul_object_records_TMP.replace(/\{FOOT\}/gi, mul_object_records_foot_TMP );
	
	_dbobjects['MULTIPLERECORDS'] = mul_object_records_TMP;
	//FINALLY   
    template = template.replace(/\{MULTIPLERECORDS\}/gi, mul_object_records_TMP );
	template = template.replace(/\{MULTIPLEADDRECORD\}/gi, mul_object_add_TMP );
	template = template.replace(/\{CLASS\}/gi, object_class_ref );
	template = template.replace(/\{CLASSREF\}/gi, object_class_ref );
	template = template.replace(/\{CLASSNAME\}/gi, base_object_class );
    fs.writeFile( normalizePath( fs.getHomeDir()+ '/db_tabla_relational_'+ object_class_ref + ".html" ) , template );

    return template;
}

function getFieldTemplateTreeSelector( _template, xmlNode, herence ) {

				var template = _template;
				var seri = new XMLSerializer().serializeToString(xmlNode);
				var selected_values = GetValues( xmlNode );
				//log("getFieldTemplateTreeSelector() > serialized: " + seri);
				//log("getFieldTemplateTreeSelector() > selected_values: " + selected_values);
				var treeselector = loadTreeS( PlaneaDocument.getBaseNode(), selected_values );
				
				template = template.replace( /\{HERENCE\}/gi, herence ); 	
				template = template.replace( '{TREESELECTOR}', treeselector );
	
				return template;
}

function getFieldListOptions( fieldNode ) {
	return GetAttribute( fieldNode, "opciones" );
}

function getFieldTemplateList( _template, fieldNode, field_path ) {
	
	var field_options = getFieldListOptions( fieldNode );
	var field_class = getFieldClass( fieldNode );
	var field_name = getFieldName( fieldNode );
	var actualvalue = GetValues( fieldNode );
	//log("getFieldTemplateList() actualvalue:" + actualvalue );
	
	var field_values_str = "";
	field_values_str+= '\n\t\t\t<option value="">Seleccionar '+field_name+'...</option>';
	var template = _template;
	if (field_options) {
		var field_values_ex = field_options.split(",");
    
		for( field_key in field_values_ex) {
			var field_option = field_values_ex[field_key];
			var selected_option = "";
			if (actualvalue)
				if (field_option==actualvalue) 
					selected_option = 'selected="selected"';
			field_values_str+= '\n\t\t\t<option value="'+field_option+'" '+selected_option+'>'+field_option+'</option>';       
		}
	}
	
	template = template.replace( /\{VALOR\}/gi, field_values_str );
	
	return template;
}

function getFieldTemplateTextoRef( _template, fieldNode, field_path ) {

	return _template;
}

function getFieldTemplateFormula( _template, fieldNode, field_path, field_id ) {


	log("getFieldTemplateFormula()  > field_path ["+field_path+"] field_id ["+field_id+"]")
	
	var formula = getFieldFormula(fieldNode);
	var field_class = getFieldClass(fieldNode);
	var object_path = "";
	var template = _template;
	var formula_result = 0;
	
	formula_result = GetValues( fieldNode );
	if (isNaN(formula_result)) formula_result = 0;
	
	if ( 	formula
			&& 
			formula.length>0 ) {
		var recordclass = "";
		var recordid = "";
		
		if (	fieldNode.parentNode
				&& (
					/*
					fieldNode.parentNode.nodeName=="registro"
					||*/
					 fieldNode.parentNode.nodeName=="ficha"
				)) {
			recordclass = GetAttribute( fieldNode.parentNode,"clase");
			log("getFieldTemplateFormula()  > parent ["+fieldNode.parentNode.nodeName+"] object class ["+recordclass+"]");
			
		} else error("getFieldTemplateFormula() > this is not an Object definition...<ficha>, maybe a record <registro>");
		
		if (recordclass!="") {
			if (_dbobjects[ recordclass ]) {
				if (_dbobjects[ recordclass ]["formulas"]==undefined)
					_dbobjects[ recordclass ]["formulas"] = [];
				
				object_path = _dbobjects[ recordclass ]["objectPath"];
				
				var objFormula = {
					'target_field_class': field_class,
					'object_path': object_path,
					'ffunction': formula,
					'parameters': '',
					'target_section_field_path': ''
				};
				_dbobjects[ recordclass ]["formulas"].push(objFormula);
				//log("getFieldTemplateFormula()  > registering formula ["+formula+"] oFormula: " + JSON.stringify( objFormula ) );
			}
		} else {
			/* SECTION FIELD => FORMULA IS NOT IN A TABLE (OBJECT)
				BUT reference to others... 
			/*
			
			arbol:Recursos:Ingresos:Ingresos generación propia:ingresoestimado 
			+ arbol:Recursos:Ingresos:Ingresos fuentes externas:ingresoestimado 
			+ arbol:Recursos:Costos:Costos:importedelcosto
			*/
			//if this a section->field not a record->field
			//we check the formula for expressions:
			// a) path expressions of multiple type fields (tables)
			// b) other path expressions > 
			
			var regex_var = new RegExp( "{[^{}]+}", "mgi" );
			var regex_rec = new RegExp( "\\[[^\\[\\]]+\\]", "mgi" );
			var regex_rec_path = new RegExp( "[^\\[\\]]+", "mgi" )
			var regex_field = new RegExp( "[:][^\\[\\]\\{\\}]+[\\}]", "mgi" );
			var regex_field_x = new RegExp( "[^:\\}]+", "mgi" );
			
			var res = formula.match( regex_var );
			
			var objFormu = {
				'target_field_class': '', //none, this is for records
				'object_path': '', //none
				'object_class': '',//none
				'ffunction': formula,
				'parameters': {},//populate here!
				'target_section_field_path': '' //none
			};
					
			
			for(var i in res) {
			
				var forvar = res[i];
				var rec_path = forvar.match( regex_rec );
				rec_path = rec_path[0].match( regex_rec_path );
				var rec_field = forvar.match( regex_field );
				rec_field = rec_field[0].match( regex_field_x );
				
				log ("getFieldTemplateFormula() > rec_path => " + rec_path + " rec_field => " + rec_field );
				//WARNING CHECK: rec_field is ok and a member of object rec_path, rec_path is ok
						
				if ( rec_path && rec_field ) {
				
					var dbField = _dbFields[ rec_path ];
					if (dbField==undefined)
						return error("getFieldTemplateFormula() > processing section field formula. no dbField for ["+rec_path+"]:"+rec_field);
						
					var recordclass = dbField['objectClass'];
					var recordclass_ref = dbField['objectClassRef'];
					
					if (recordclass=="" || recordclass==undefined)
						error("getFieldTemplateFormula() > dbField["+rec_path+"] => " + JSON.stringify( dbField, null, "\t" ) );
						
					var field_class = rec_field;
					var object_path = rec_path;
					//registramos esta formula en los objetos referidos para que disparen su calculo a cada cambio...
					log(	"getFieldTemplateFormula()> section field formula for: ["+field_path+"] => recordclass ["+recordclass+"]"
							+ " recordclass_ref["+recordclass_ref+"]");
					
					var objFormula = {
						'target_field_class': field_class,
						'object_path': object_path,
						'object_class': recordclass,
						'object_class_ref': recordclass_ref,
						'ffunction': formula,
						'parameters': '',
						'target_section_field_path': field_path					
					};
					
					_dbobjects[ recordclass ]["formulas"].push( objFormula );
					if (recordclass!=recordclass_ref)
						_dbobjects[ recordclass_ref ]["formulas"].push( objFormula );
					
					objFormu["parameters"][forvar] = objFormula;					
					
					log("getFieldTemplateFormula()> section field formula for: ["+field_path+"] => OBJECT > " + JSON.stringify( _dbobjects[ recordclass ]["formulas"],null,"\t") );
				}
			}
			
			if (_dbFields[field_path]==undefined) {
			
				_dbFields[field_path] = createField( fieldNode, field_path, field_id );
				_dbFields[field_path]["formulas"].push(objFormu);//register this formula and his parameters referenced to  objects
				
			}

			//CALCULATE!!! we need to put a result NOW
			//CHECK
			//formula_result = processFieldFormula( field_path, objFormu );
			/*
			log( "getFieldTemplateFormula()> _dbFields[ field_path ][ formula ] " + JSON.stringify( _dbFields[ field_path ]["formulas"], null, "\t" )  );
			log( "getFieldTemplateFormula()> _dbobjects[ recordclass ][ formula ] " + JSON.stringify( _dbobjects[ recordclass ]["formulas"], null, "\t" ) */
			
		}
		
		template = template.replace( /\{FORMULA\}/gi, formula );
		template = template.replace( /\{VALOR\}/gi, formula_result );
	}
	return template;
}


function getFieldTemplateArchivo( _template, fieldNode, field_path ) {
	var filename = getFieldFileName(fieldNode);
	var field_class = getFieldClass(fieldNode);
	var file_link = '<a href="#" class="filelink filelink-'+field_class+'" onclick="javascript:downloadFile( \''+field_path+'\',\'{IDCAMPO}\');"><u>'
															+reduceFileName( filename ) 
															+"</u></a>";
	_template = _template.replace("{ARCHIVO}",file_link);
	return _template;
}

/**
*	Just check for attribute Sum="[YES]", so we know this field is taken from an Object table, and we
*	have to do some calculations (Adding this column) and display it somewhere in the table
*/
function getFieldTemplateNumeric( _template, fieldNode, field_path ) {

	var field_col_sum = getFieldSum(fieldNode);
	var field_class = getFieldClass(fieldNode);
	var object_path = "";
	
	//log("getFieldTemplateNumeric()  > field_col_sum for ["+field_class+"] is >> ["+field_col_sum+"]");
	if (field_col_sum=="[YES]") {
		var recordclass = "";
		var recordid = "";
		if (	fieldNode.parentNode
				&& (
					 fieldNode.parentNode.nodeName=="ficha"
				)) {
			recordclass = GetAttribute( fieldNode.parentNode, "clase" );
			//log("getFieldTemplateNumeric()  > parent ["+fieldNode.parentNode.nodeName+"] object class ["+recordclass+"]");
		} else {
			//error("getFieldTemplateNumeric() > this is not an Object definition <ficha>, maybe a record <registro>");
			return _template;
		}
		
		//WARNING REGISTERING ONLY IN BASE CLASS
		if (recordclass) {
			if (_dbobjects[ recordclass ]) {
				
				if (_dbobjects[ recordclass ]["sums"]==undefined)
					_dbobjects[ recordclass ]["sums"] = {};
				
				object_path = _dbobjects[ recordclass ]["objectPath"];
				
				var objSum = createSum( field_class, object_path  );
				
				_dbobjects[ recordclass ][ "sums" ][ field_class ] = objSum;
				
				//WARNING!!! we must record this objSum in all object's instances...
				
				
				//WE WILL HAVE TO PROCESS IT !!!!				
				//log("getFieldTemplateNumeric()  > registering sum for object_path ["+object_path+"] of object class ["+recordclass+"] with objSum: " + JSON.stringify( objSum ) );
				
				
			}
		}
	}
	
	return _template;
}


/**
*	creates template that auto-calculate and draw the Org chart, based on differentes fields that needs to exist
*	Fields requirements:
*			Integrantes (multiples persona)
*	
*		1) Based on Field > in section Integrantes (field named "Lista de personas" and field type: "Multiples Personas"
*			Creates a JSON structure to show dependencies between people, taking info from xml database
*		2) Draw the hierarchy
*/
var dbAreas = [];
var dbPersonas = [];
var dbOrgaboxs = [];//
var Jerarquia = {};

function cloneObj( obj ) {
	return JSON.parse(JSON.stringify(obj));
}

function createOrgaboxsDependencyIndex() {

	var OIndexDep = {};
	
	for( var index in dbOrgaboxs ) {
		var OBox = dbOrgaboxs[index];
		if (OIndexDep[ OBox.depende_orgabox_index ] == undefined) {
			OIndexDep[ OBox.depende_orgabox_index ] = {}
		}
		OIndexDep[ OBox.depende_orgabox_index ][ index ] = OBox;
	}
	
	//log("IndexingOrgaboxs() > " + JSON.stringify( OIndexDep, null, "\t") );
	
	return OIndexDep;

}

function isDef( object ) {
	if (object) {
		for(var j in object) {
			return true;
		}
	}
	return false;
}

function setIndexOrgBox( OrgaBox ) {

}

function createArea( area_id, areaRecordNode ) {

 var areadetrabajo = getRecordToJSON( areaRecordNode );
 
 return {
			'area_id': area_id,
			'area_object': areadetrabajo,
			'responsables': {},
			'miembros': {}
		};
}

function createAreas( ) {
	dbAreas = {};
	
	var AreasField = _dbFields[ field_areas_de_trabajo_path ];
	if (AreasField==undefined) return error("createAreas() > _dbFields["+field_areas_de_trabajo_path+"] undefined!");
	
	var AreasNode = AreasField['node'];
	if (AreasNode==undefined)  return error("createAreas() > _dbFields["+field_areas_de_trabajo_path+"]['node'] undefined!");
	
	var areaRecords = evaluateXPath( AreasNode, "valor/registro");

	for( var a in areaRecords ) {
		
		var areaNode = areaRecords[a];		
		var area_id = GetAttribute( areaNode, "id" );	
		dbAreas[ area_id ] = createArea( area_id, areaNode );
		
	}
	//log("createAreas() > " + JSON.stringify( dbAreas, null, "\t") );
}

function createOrgaBox( index ) {

	return {
	
		'orgabox_index': index,
			'esresponsabledearea': '',
			'select_persona': '',//orgabox representa a esta persona misma "select_persona" (ej: "persona_2 tendra este orgabox con su nombre")
			'area_id': '',
			
		'depende_orgabox_index': '',//
			'depende_persona': '',// hijo de la persona que aparece en "depende_persona_X"
			'enarea': '',
			'tipoderelacion': '',
			
		'relacion_id': '',
		'relacion_node': '',
		'relacion': {},
		'posicion': '',
		'objectPersona': {},

		'assistant': false,
		'servant': false,

		'visible': '',//mostrar o esconder orgabox (directamente se borra ???)
		'geometry': 'cuadrado',//cuadrado, elipse, esfera, etc...
		'layout': 'tree',//jerarquico/horizontal/circular
		'color': 'rgb(100,100,100)'
	};


}

function associatePersonaToArea( OrgaBox ) {
	
	//register member in Area object (createArea)
	
	var dbArea = dbAreas[ OrgaBox.area_id ];
	
	if (dbArea==undefined) return error("associatePersonaToArea() > OrgaBox.area_id not found ["+OrgaBox.area_id+"]");
	
	//if responsability of this area founded > populate member "responsables"
	
	if ( OrgaBox.esresponsabledearea.toLowerCase().indexOf("s")>=0 ) {
	
		dbArea["responsables"][OrgaBox.orgabox_index] = OrgaBox.objectPersona;
		
	}
	
	dbArea["miembros"][OrgaBox.orgabox_index] = OrgaBox.objectPersona;
	dbAreas[ OrgaBox.area_id ] = dbArea;
}


/*  
** Translate recordNode of class Persona, with relations and workareas, 
*	to Orgabox/Box object, one Persona may have multiple Boxes, depending on Areas and Relationships
*   Personas have relations of dependency / assistant 
*/
function createOrgaboxsFromPersona( personaNode ) {


	/*LEVANTAMOS LOS DATOS DE LA PERSONA en recordNode*/
	var persona_id = GetAttribute( personaNode, "id");

	log ( "createOrgaboxsFromPersona() > persona_id: [" + persona_id + "]" );
	
	
	var objectPersona = {};
	objectPersona = getRecordToJSON( personaNode );
   
	var misrelaciones = objectPersona["misrelaciones"];
	
	if (!isDef(misrelaciones)) {
		var OBox = createOrgaBox();
		OBox.area_id = "no-area";
		OBox.depende_persona = "no-depende";
		OBox.enarea = "no-area";
		OBox.esresponsabledearea = "No";
		OBox.color = 'rgb(230,240,250);';
		OBox.position = '0,0';
		OBox.geometry = 'cuadrado';
		OBox.objectPersona = objectPersona;
		
		//create self index to connect OrgBoxes
		OBox.orgabox_index = OBox.select_persona;
		OBox.depende_orgabox_index = OBox.depende_persona;
		
		if ( OBox.area_id && OBox.area_id != "" ) {		
			OBox.orgabox_index+= "_" + OBox.area_id;
		}
		
		//create father orgabox index (hierarchy)
		if (OBox.enarea && OBox.enarea!="") {
			OBox.depende_orgabox_index+="_"+OBox.enarea;
		}
		//clone the object and index it
		dbOrgaboxs[ OBox.orgabox_index ] = OBox;
	} else	
	for( var relacion_id in misrelaciones ) {
	
		var OBox = createOrgaBox();
		var Relacion = misrelaciones[ relacion_id ];
		
		var indice_orgabox = OBox.select_persona;
		var RelacionRecord = _dbRecords[ relacion_id ];
		if (RelacionRecord==undefined) error("createOrgaboxsFromPersona() > no RelacionRecord for relacion_id ["+relacion_id+"]");
		var RelacionRecordNode = RelacionRecord.node;
		if (RelacionRecordNode==undefined) error("createOrgaboxsFromPersona() > no RelacionRecordNode in RelacionRecord ["+JSON.stringify(RelacionRecord,null,"\t")+"]");
	
		OBox.select_persona = persona_id;
		
		//assign fields
		OBox.area_id = isDef(Relacion["relacionarea"]) ? Relacion["relacionarea"].value : "no-area";
		OBox.depende_persona = isDef(Relacion["personarelativa"]) ? Relacion["personarelativa"].value : "no-depende";
		OBox.enarea = isDef(Relacion["enarea"]) ? Relacion["enarea"].value : "no-area";
		OBox.tiporelacion = isDef(Relacion["tiporelacion"]) ? Relacion["tiporelacion"].value : "";
		OBox.esresponsabledearea = isDef(Relacion["esresponsabledearea"]) ? Relacion["esresponsabledearea"] : "No";
		
		OBox.color = 'rgb(230,240,250);';
		OBox.position = '0,0';
		OBox.geometry = 'cuadrado';
		
		OBox.relacion_node = RelacionRecordNode;
		OBox.relacion_id = relacion_id;
		OBox.relacion = Relacion;
		
		OBox.objectPersona = objectPersona;
		
		//create self index to connect OrgBoxes
		OBox.orgabox_index = OBox.select_persona;
		OBox.depende_orgabox_index = OBox.depende_persona;
		
		if ( OBox.area_id && OBox.area_id != "" ) {		
			OBox.orgabox_index+= "_" + OBox.area_id;			
			if (OBox.area_id!="no-area")
				associatePersonaToArea( OBox );			
		}
		
		//create father orgabox index (hierarchy)
		if (OBox.enarea && OBox.enarea!="") {
			OBox.depende_orgabox_index+="_"+OBox.enarea;
		}
		//clone the object and index it
		dbOrgaboxs[ OBox.orgabox_index ] = OBox;
		
		
	}
	
	//log("createOrgaboxsFromPersona() > record:" + JSON.stringify( OBox, null, "\t") );

}/*FIN PrepararOrgaboxs() */
	
function createOrgaboxsFromPersonas() {

	//log("createOrgaboxsFromPersonas() > creating Orgaboxes from Personas");
	
	var dbFieldListaPersonas = _dbFields[field_persona_base_path];
	var xmlNodePersonas = dbFieldListaPersonas['node'];
	var personasRecords = evaluateXPath( xmlNodePersonas, "valor/registro" );
	
	if (personasRecords.length>0) {
		for( var pp in personasRecords ) {
			var personaNode = personasRecords[pp];
			createOrgaboxsFromPersona( personaNode );
		}
	}
}

function createOrgaboxesFromAreas() {

	//log("createOrgaboxesFromAreas() > creatting Orgabox from Areas (no responsables).");
	for( var area_id in dbAreas) {
		
		var dbArea = dbAreas[area_id];
		var responsable_orgabox_index = area_id;
		//log("createOrgaboxesFromAreas() > check if Area area_id["+area_id+"]"+JSON.stringify( dbArea,null,"\t" ));

		//check if there are responsables...
		var hasResp = false;			
		for( var oindex in dbArea["miembros"]) {
			if (oindex!=undefined) {
				var isResp = dbArea["responsables"][oindex];
				if (isResp && !hasResp) {
					hasResp = true;
					//set the last responsable to be THE RESPONSABLE
					responsable_orgabox_index = oindex;
				}
			}
		}
		//log("createOrgaboxesFromAreas() > area["+area_id+"] has responsables? > ["+hasResp+"]");
		
		if (hasResp==false) {		
			//create an OrgBox for this area
			//no responsables imply: AREA has no father!!
			var AreaOrgaBox = createOrgaBox();
			AreaOrgaBox.orgabox_index = area_id;//orgabox index is AREA_XXX
			AreaOrgaBox.area_id = area_id;
			AreaOrgaBox.depende_orgabox_index = "no-depende_no-area";
			AreaOrgaBox.depende_persona = "no-depende";
			dbOrgaboxs[ AreaOrgaBox.orgabox_index ] = AreaOrgaBox;		
			//log("createOrgaboxesFromAreas() > AreaOrgaBox > " + JSON.stringify( AreaOrgaBox, null, "\t" ) );
		}
		
		
		
		//Set the dependency of all the members OrgaBoxes (with no dependencies in this area)
		// to the Responsable > responsable_orgabox_index
		for( var oindex in dbArea["miembros"]) {
			if (oindex!=undefined) {
				var OrgaBoxMember = dbOrgaboxs[oindex];
				if (OrgaBoxMember==undefined)
					return error("createOrgaboxesFromAreas() > OrgaBoxMember undefined for dbOrgaboxs["+oindex+"]");
					
				//only Orgabox of this area with no dependency...
				if (OrgaBoxMember.orgabox_index==responsable_orgabox_index) {
					//NOTHING, HE IS THE RESPONSABLE > HE IS THE AREA!!!
				} else
				if (OrgaBoxMember.depende_orgabox_index=="no-depende_no-area") {
						OrgaBoxMember.depende_orgabox_index = responsable_orgabox_index;//set it as child (no responsables were found)
				}
				//reset object in array:
				dbOrgaboxs[oindex] = OrgaBoxMember;
			}
		}
		
		
		
	}
}


function labelOrgabox( Orgabox ) {

	if ( Orgabox.orgabox_index == Orgabox.area_id ) {
		if ( dbAreas[ Orgabox.area_id ] ) {
			return dbAreas[ Orgabox.area_id ]['area_object'].nombrearea;
		}
	}
	
	if ( Orgabox.objectPersona ) {
		return Orgabox.objectPersona.nombre+" "+Orgabox.objectPersona.apellido;
	}

	return Orgabox.orgabox_index;
}

function areaOrgabox( Orgabox ) {

	if ( Orgabox.orgabox_index == Orgabox.area_id ) {
		return "";
	}
	
	if ( Orgabox.objectPersona ) {
		//name of the area appear in Persona Orgabox if, and only if he is responsable of the area...
		if ( Orgabox.esresponsabledearea.toLowerCase().indexOf('s')>=0 ) {
			if ( dbAreas[ Orgabox.area_id ] ) {
				return dbAreas[ Orgabox.area_id ]['area_object'].nombrearea;
			}
		} else return "";
	}
	return Orgabox.area_id;
}

function classOrgabox( Orgabox ) {

	//it's an Area Orgabox... no persona....
	if ( Orgabox.orgabox_index == Orgabox.area_id ) {
		return " orgbox-area orgbox-nopersona orgbox-area-"+Orgabox.area_id;
	}
	
	return " orgbox-persona"+" orgbox-"+Orgabox.select_persona+" orgbox-area-"+Orgabox.area_id;

}

/**
* Iterate the whole tree nodes
*/
function IterateTreeOrgaboxs( index_dp, OrgaboxsByDependencies ) {

	var OrgaboxsColgantes = OrgaboxsByDependencies[index_dp]; 
	var nraices = 0;
	var Children = [];
	
	for( var idx in OrgaboxsColgantes) {
	
		var Orgabox = OrgaboxsColgantes[idx];
			Children[nraices] = {
				'name': labelOrgabox( Orgabox ),
				'area': areaOrgabox( Orgabox ),
				'style': classOrgabox( Orgabox ),
				'index': Orgabox.orgabox_index,
				'father': Orgabox.depende_orgabox_index,				
				'record': Orgabox,
				'assistant': Orgabox.assistant,
				'servant': Orgabox.servant,
				'children': IterateTreeOrgaboxs( Orgabox.orgabox_index, OrgaboxsByDependencies )
			}; 
		
		nraices++;
	}
	
	return Children;
}

function createOrgaTree( OrgaboxsIndexDep ) {

		var OrgaTree = {
			'name': 'Organigrama',
			'children': []
		};
		
		OrgaTree['children'] = IterateTreeOrgaboxs( "no-depende_no-area", OrgaboxsIndexDep );
		return OrgaTree;
}



function drawD3Organigram( field_id, data_root, force_refresh ) {
					
			getFieldTemplateOrgChart( "", dbOrganigramaNode, dbOrganigramaPath);
			
			if (md5_tree_organigram_old!=md5_tree_organigram_new)
				document.getElementById('orgchart').innerHTML = '';
			
			md5_tree_organigram_old = md5_tree_organigram_new;

			if (	document.getElementById('orgchart') && document.getElementById('orgchart').innerHTML!="") {
				return;
			}
			
			var svgorgchartElement = null;
			
			var width = "100%";
			var height = "100%";
			var nodewidth = 200;
			var nodeheight = 55;
			var svg = d3.select("#orgchart")
						.append("svg")
						.attr("id", "svgorgchart")
						.attr("width", width)
						.attr("height", height);
						
			svg.attr("viewBox", "-1500 0 3000 1000");

			function zoomed() {
			  container.attr("transform", "translate( " + d3.event.translate + ") scale(" + d3.event.scale + ")");
			  var org_field_id = _dbFields[dbOrganigramaPath].field_id;
			  rendersvg(  document.getElementById("svgorgchart"), 
							"grafico_canvg_"+org_field_id ); 
			  
			}
			
			var zoom = d3.behavior.zoom()
								.scaleExtent([1, 8])
								.on("zoom", zoomed);
								
			var gscale = svg.append("g")
							.call(zoom);
			var container = gscale.append("g")
			
			
			container.append("rect")
					.attr("x",-5000)
					.attr("y",-5000)
					.attr("width",10000)
					.attr("height",10000)
					.attr("fill","none")
					.style("pointer-events", "all");
					

			var root = data_root;
			if (root==undefined) root = Jerarquia;

			function NodeName( textElement, d ) {
				return d.name;
			}
			
			function NodeArea( textElement, d ) {
				return d.area;
				//return d.name;
			}
			
			function NodeCargo( textElement, d ) {
				return d.cargo;
				//return d.name;
			}			
			
			function NodeWidth( d ) {
				//return mtree.nodeSize()[0];
				return d.width;
			}
			
			function NodeWidth2( d, node ) {
				//alert( node.width );
				return node.width;
			}
			
			function NodeHeight( d ) {
				//return mtree.nodeSize()[1];
				return d.height;
			}	

			function NodeHeight2( d, node ) {
				//alert( node.width );
				return node.height;
			}			
						
			var drag = d3.behavior.drag()
						.origin(function(d) { return d; })
						.on("dragstart", dragstarted)
						.on("drag", dragmove)	
						.on("dragend", dragended);
			
			var mtree = d3.layout.tree()
						.nodeSize( [ nodewidth, nodeheight ] )
						.separation(	function(a, b) { 
							//alert(a.children);							
							return (a.parent == b.parent ? 1 : 2)*1.15; 
							//return (a.parent == b.parent ? 1 : 2) / a.depth;
						});

			var nodes = mtree.nodes(root),		//ESTOS SON LOS NODOS (ordenados jerarquicamente???
				links = mtree.links(nodes);		//ESTAS SON LAS RELACIONES!!!
			
			function dragstarted(d) {
			  d3.event.sourceEvent.stopPropagation();
			  d3.select(this).classed("dragging", true);
			}
			
			function dragended(d) {
			  d3.select(this).classed("dragging", false);
			}			
	
			function dragmove(d) {
			
				d3.select(this).attr( "transform", function(d) {
														d.x = d3.event.x;
														d.y = d3.event.y;
														
														link.attr("d", lineconnection );
														//node.selectAll("g.node")
														return "translate( " + d3.event.x 
																+ "," + d3.event.y + ")";
														} );				
			}			
			
			container.append("defs").append("marker")
				.attr("id", "triangle")
				.attr("viewBox", "0 -5 10 10")
				.attr("refX", 10)
				.attr("refY", 0)
				.attr("markerWidth", 5)
				.attr("markerHeight", 5)
				.attr("orient", "auto")
				.append("path")
				.attr("d", "M0,-5L10,0L0,5");
				
			var node = container.selectAll("g.node")
						.data(nodes)
						.enter()
						.append("g")
						.attr("class", function(d) {
								if (d.depth==0) {
									return "node nodehide node-"+d.depth+" "+d.style;
								}
								return "node node-"+d.depth+" "+d.style;
						})
						.attr("transform",	 function(d) { 
								//return "translate(" + d.y + ")";
								//d.x = d.x + 400;
								//d.y = d.y + d.depth*NodeHeight2(d,d) / 2;
								//alert(d.width);
								d.width = nodewidth;
								d.height = nodeheight;
								d.x = d.x;
								d.y = d.y + d.height*d.depth;
								return "translate("+d.x + "," + d.y + ")";
						} )
						.call(drag);
						/*
						.attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });
						*/		
						

			
			node.append("rect")
				.attr("class", "nodebox")
				.style("fill","rgba(255,255,255,1)")
				.style("stroke","#000")
				.attr("x", 0  )
				.attr("y", 0  )
				.attr("width", NodeWidth )
				.attr("height", NodeHeight )
				.attr("rx", 5)
				.attr("ry", 5);
				
			
			node.append("text")
				.attr("class", "name")
				.attr("x", nodewidth/2)
				.attr("y", 35)
				.attr("text-anchor","middle")
				.text( function( d ) { return NodeName(this,d) } );
				
			node.append("text")
				.attr("class", "area")
				.attr("x", nodewidth/2)
				.attr("y", 20)
				.attr("text-anchor","middle")
				.text( function( d ) { return NodeArea(this,d) } );
				
			node.append("text")
				.attr("class", "cargo")
				.attr("x", nodewidth/2)
				.attr("y", 45)
				.attr("text-anchor","middle")
				.text(function( d ) { return NodeCargo(this,d) } );
			
			var lineconnection = function(d) {
			
				if (d.target.assistant) {
					d3.select(this).classed("linkassistant",true)
				}

				if (d.source.depth==0) {
					d3.select(this).classed("linkhide",true)
				}
				
				if ( Math.abs(d.source.y - d.target.y) < NodeHeight2(d, d.source)) {
					//to horizontal
					var dsx = d.source.x + NodeWidth2(d, d.target);
					var dsy = d.source.y + NodeHeight2(d, d.source)/2;	
					var dtx = d.target.x;
					var dty = d.target.y + NodeHeight2(d, d.source)/2;
					
					if ( d.source.x > d.target.x ) {
						dsx = d.source.x;
						dtx = d.target.x + NodeWidth2(d, d.target);
					}
					var dx = d.target.x - d.source.x,
						dy = d.target.y - d.source.y,
						dr = Math.sqrt(dx * dx + dy * dy);
					var ipx1 = dsx + (dtx-dsx) / 2;
					var ipy1 = dsy;
					
					var ipx2 = ipx1;
					var ipy2 = dty;
				} else {
					var dsx = d.source.x + NodeWidth2(d, d.source) / 2;
					var dsy = d.source.y + NodeHeight2(d, d.source);	
					var dtx = d.target.x + NodeWidth2(d, d.target) / 2;
					var dty = d.target.y;
					
					if ( d.source.y > d.target.y ) {
						dsy = d.source.y;
						dty = d.target.y + NodeHeight2(d, d.target);
					}
					var dx = d.target.x - d.source.x,
						dy = d.target.y - d.source.y,
						dr = Math.sqrt(dx * dx + dy * dy);
					var ipx1 = dsx;
					var ipy1 = dsy + (dty-dsy) / 2;
					
					var ipx2 = dtx;
					var ipy2 = ipy1;
				}
				
				return "M " + dsx + " " + dsy + " L " + ipx1 + " " + ipy1 + " L " + ipx2 + " " + ipy2 + " L " + dtx + " " + dty;
					//return "M" + dsx + "," + dsy + "A" + dr + "," + dr + " 0 0,1 " + dtx + "," + dty;
			}
	
  			var diagonal = d3.svg.diagonal()
				.projection(
					function(d) {						
						return [ d.x, d.y]; 
					}
				);
			
			var link = container.selectAll("path.link")
							.data( links )
							.enter()
							.append("path")
							.attr( "class", "link")		
							.style("fill", "none")
							.style("stroke", "#ccc")
							.style("stroke-width", "1.5px")
							.attr( "marker-end", "url(#triangle)" )
							.attr( "d", lineconnection);

			function recalculateAllTexts() {
				function adjustTextLength( d ) {
					//alert(d.area);
					//var texta = d3.select(this);
					var bbox = this.getBBox();
					var twidth = bbox.width+20;
					if (twidth>d.width) {
						this.setAttribute("lengthAdjust","spacingAndGlyphs");
						this.setAttribute("textLength",d.width-10);
						
					}
					
				}

				svg.selectAll("text.area").each( adjustTextLength );
				svg.selectAll("text.name").each( adjustTextLength );
				svg.selectAll("text.cargo").each( adjustTextLength );
			}
			recalculateAllTexts();
			
			
			function onControlZoomClickedOrg(e) {
				var elmTarget = $(this)
				var scaleProcentile = 0.20;

				// Scale
				var currentScale = zoom.scale();
				//alert( " currentScale:" + currentScale );
				var newScale;
				if(elmTarget.hasClass('control-zoom-in')) {
				  newScale = currentScale * (1 + scaleProcentile);
				} else {
				  newScale = currentScale * (1 - scaleProcentile);
				}
				newScale = Math.max(newScale, 0);

				// Translate
				var graphWidth = 228;
				var graphHeight = 166;
				//alert("graphWidth:"+graphWidth+" graphHeight:"+graphHeight);
				var centerTranslate = [
				  (graphWidth / 2) - (graphWidth * newScale / 2),
				  (graphHeight / 2) - (graphHeight * newScale / 2)
				];

				// Store values
				zoom
				  .translate(centerTranslate)
				  .scale(newScale);

				// Render transition
				/*
				graph.transition()
				  .duration(500)
				  .attr("transform", "translate(" + zoom.translate() + ")" + " scale(" + zoom.scale() + ")");
				*/
				container.transition()
						.duration(500)
						.attr("transform", "translate( " + zoom.translate() + ") scale(" + zoom.scale() + ")");

			  }
			
			$('#control-zoom-out-org').on('click', onControlZoomClickedOrg);
			$('#control-zoom-in-org').on('click', onControlZoomClickedOrg);
			//log( "drawD3Organigram() > " + document.getElementById("orgchart").innerHTML );
			//log ("drawD3Organigram() > rendering to Canvas.");
			
			svgorgchartElement = document.getElementById("svgorgchart");
			rendersvg( svgorgchartElement, "grafico_canvg_"+field_id );
}
 	
var dbOrganigramaNode = {};
var dbOrganigramaPath = {};
var md5_tree_organigram_old = "";
var md5_tree_organigram_new = "";
	
function getFieldTemplateOrgChart( _template, xmlNode, field_path ) {

	var template = _template;
	var graph_d3_js_code = "";
	
	
	dbOrganigramaNode = xmlNode;
	dbOrganigramaPath = field_path;
	//reset
	dbAreas = {};
	dbPersonas = {};
	dbOrgaboxs = {};
	
	//log("getFieldTemplateOrgChart() > field_path: [" + field_path + "]");
	
	
	/*CREATE AREAS Objects*/
	createAreas();
	
			
	/*CREATE ORGBOX FROM PERSONAS*/
	createOrgaboxsFromPersonas();
		
	/*GENERAL ROOT AREAS !!!*/
	/*create additional OrgaBox for Areas with no responsables. */
	createOrgaboxesFromAreas();
	
	//log("createOrgaboxsFromPersona() > OrgaBoxes = " + JSON.stringify( dbOrgaboxs, null, "\t") );
	//log("createOrgaboxsFromPersona() > Areas = " + JSON.stringify( dbAreas, null, "\t") );
	
		
	/*INDEXING ORGBOXS*/
	var DependencyIndex = createOrgaboxsDependencyIndex();

	/*CREATING TREE*/
	Jerarquia = createOrgaTree( DependencyIndex );
	
	log("getFieldTemplateOrgChart() > Jerarquia = " + JSON.stringify( Jerarquia, null,"\t" ) );
	
	md5_tree_organigram_new = JSON.stringify(Jerarquia);
		
	graph_d3_js_code= '<div class="control-zoom">';
    graph_d3_js_code+= '	<a title="Zoom in" href="#" id="control-zoom-in-org" class="control-zoom-in"> </a>';
    graph_d3_js_code+= '	<a title="Zoom out" href="#" id="control-zoom-out-org" class="control-zoom-out"> </a>';
    graph_d3_js_code+= '</div>';
	graph_d3_js_code+= '<div class="refreshgraph" onclick="javascript:drawD3Organigram(\'{IDCAMPO}\');">';
	graph_d3_js_code+= '';
	graph_d3_js_code+= '</div>';
	graph_d3_js_code+= '<div onclick="javascript:drawD3Organigram(\'{IDCAMPO}\');" id="orgchart"> </div>';
	
	template = _template.replace( /\{VALOR\}/gi, graph_d3_js_code );
	//log("getFieldTemplateOrgChart() > template:"+template );
	return template;
}

var dbCronogramNode = {};
var dbCronogramPath = {};
var dbTasks = [];
var md5_tree_cronogram_old = "";
var md5_tree_cronogram_new = "";
var cronozoom = 1.0;


function onControlZoomClickedCrono(obj,ev) {

	var elmTarget = obj;
	var scaleProcentile = 0.20;

	if(elmTarget.getAttribute("class").indexOf('control-zoom-in')>=0) {
		cronozoom = cronozoom + scaleProcentile;
	} else {
		cronozoom = cronozoom - scaleProcentile;
	}
	
	if ( cronozoom < 0.1 ) cronozoom = 0.1;
	if ( cronozoom > 10.0 ) cronozoom = 10.0;
	
	log("drawD3Cronogram() > onControlZoomClickedCrono() > cronozoom:" + cronozoom );
	drawD3Cronogram( _dbFields[dbCronogramPath].field_id, dbTasks, true );
	
	document.getElementById("cronozoom").innerHTML = parseInt(cronozoom*100)/100 + "x";	

}

function drawD3Cronogram( field_id, tasks, forcerefresh ) {

	getFieldTemplateCronoChart( "", dbCronogramNode, dbCronogramPath );
	if (	md5_tree_cronogram_old!=md5_tree_cronogram_new
			|| forcerefresh == true ) {
			
		if (document.getElementById('cronochart'))
			document.getElementById('cronochart').innerHTML = '';
		
	} else {
		log("drawD3Cronogram() > nothing changed on dbTasks");
	}
	
	md5_tree_cronogram_old = md5_tree_cronogram_new;
	
	if ( document.getElementById('cronochart')) {
		if ( document.getElementById('cronochart').innerHTML!="")
			return;
	}
	
	var svgcronochartElement = null;
	
	var w = window.innerWidth;
	var h = window.innerHeight;
	var width = "100%";
	var height = "100%";
	var svg = d3.select("#cronochart")
			.append("svg")
			.attr("id", "svgcronochart")
			.attr("width", width)
			.attr("height", height);
		
	if (document.getElementById("cronochart")) {
		styled = window.getComputedStyle( document.getElementById("cronochart") );
		w = parseInt(styled.width);
		h = parseInt(styled.height);
	}
	
	log("drawD3Cronogram() > w ["+w+"] h ["+h+"]");
	//svg.attr("viewBox", "-1500 0 3000 1000");
	//svg.attr("viewBox", "0 0 1000 500");

	var sp = {
	  "decimal": ".",
	  "thousands": ",",
	  "grouping": [3],
	  "currency": ["$", ""],
	  "dateTime": "%a %b %e %X %Y",
	  "date": "%m/%d/%Y",
	  "time": "%H:%M:%S",
	  "periods": ["AM", "PM"],
	  "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	  "shortDays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	  "months": ["January", "Febrero", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	  "shortMonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	};

	
	var taskArray = [
	  {
		task: "conceptualize",
		type: "development",
		startTime: "2013-1-28", //year/month/day
		endTime: "2013-4-1",
		details: "This actually didn't take any conceptualization"
	},

	{
		task: "sketch",
		type: "development",
		startTime: "2013-3-1",
		endTime: "2013-4-6",
		details: "No sketching either, really"
	},

	{
		task: "color profiles",
		type: "development",
		startTime: "2013-4-6",
		endTime: "2013-6-9"
	},

	{
		task: "HTML",
		type: "coding",
		startTime: "2013-3-2",
		endTime: "2013-4-6",
		details: "all three lines of it"
	},

	{
		task: "write the JS",
		type: "coding",
		startTime: "2013-4-6",
		endTime: "2013-5-9"
	},

	{
		task: "advertise",
		type: "promotion",
		startTime: "2013-4-9",
		endTime: "2013-6-12",
		details: "This counts, right?"
	},

	{
		task: "spam links",
		type: "promotion",
		startTime: "2013-7-12",
		endTime: "2013-8-14"
	},
	{
		task: "eat",
		type: "celebration",
		startTime: "2013-4-8",
		endTime: "2013-7-13",
		details: "All the things"
	},

	{
		task: "crying",
		type: "celebration",
		startTime: "2013-2-13",
		endTime: "2013-8-16"
	},

	];
	
	
	//si la combinacion entre zoom e intervalo
	// se ven dias, meses o años...

	if (tasks) taskArray = tasks;
	if (dbTasks.length) taskArray = dbTasks;
	
	d3.locale(sp);
	
	var dateFormat = d3.time.format("%Y-%m-%d");

	makeGant(taskArray, w, h);

	var title = svg.append("text")
				  .text("ACTIVIDAD")
				  .attr("x", 50 )
				  .attr("y", 40 )
				  .attr("text-anchor", "middle")
				  .attr("font-size", 15 )
				  .style("font-family", "Arial")
				  .attr("fill", "#0ecc7a" );

	function makeGant(tasks, pageWidth, pageHeight) {

		var barHeight = 15;
		var gap = barHeight + 30;
		var gapMargin = 4;
		var topPadding = 50;
		var sidePadding = 130;

		var timeScale = d3.time.scale()
			.domain( [ d3.min( taskArray, function(d) {return dateFormat.parse(d.startTime);}),
					 d3.max(taskArray, function(d) {return dateFormat.parse(d.endTime);})])
			.range([ 0, parseInt( pageWidth*cronozoom-250) ] );
		
		var colorScale = d3.scale.linear()
			.domain( [ 0, tasks.length ] )
			.range( ["#88aaCC" , "#55DD77"] )
			.interpolate( d3.interpolateHcl );

		
		
		drawRects( tasks, timeScale, gap, gapMargin, topPadding, sidePadding, barHeight, colorScale, pageWidth, pageHeight );		
		vertLabelsTasks( tasks, timeScale, gap, gapMargin, topPadding, sidePadding, barHeight, colorScale);
		makeGrid( timeScale, sidePadding, topPadding, pageWidth, pageHeight);
	}

	
	function drawRects(theArray, timeScale, theGap, theGapMargin, theTopPad, theSidePad, theBarHeight, theColorScale, w, h) {
	
		var bigRects = svg.append("g")
			.selectAll("rect")
		   .data(theArray)
		   .enter()
		   .append("rect")
		   .attr("x", theSidePad)
		   .attr("y", function(d, i){
			  return i*theGap + theTopPad + theGapMargin;
		  })
		   .attr("width", function(d){
			  return w-theSidePad;
		   })
		   .attr("height", theGap-theGapMargin*2)
		   .attr("stroke", "none")
		   .attr("fill", function(d){
				return "#e6e7e8";

		   })
		   .attr("opacity", 1.0);

			 var rectangles = svg.append('g')
				 .selectAll("rect")
				 .data(theArray)
				 .enter();

		   var innerRects = rectangles.append("rect")
					 .attr("rx", 0)
					 .attr("ry", 0)
					 .attr("x", function(d){
					  return timeScale(dateFormat.parse(d.startTime)) + theSidePad;
					  })
					 .attr("y", function(d, i){
						return i*theGap + theGap/4 + theGapMargin + theTopPad;
					})
					 .attr("width", function(d){
						return (timeScale(dateFormat.parse(d.endTime))-timeScale(dateFormat.parse(d.startTime)));
					 })
					 .attr("height", theBarHeight)
					 .attr("stroke", "none")
					 .attr("fill", function(d, i) {
							log(" color: " + theColorScale(i));
							return theColorScale(i);
					 })
			
			
			var rectTextA = rectangles.append("text")
					.text(function(d) {
						var format = d3.time.format("%Y-%m-%d");
						var parsed = dateFormat.parse(d.startTime);
						if (parsed) {
							return parsed.getDay();
						}
						return "-";
					})
					.attr("x", function(d){
						return ( timeScale( dateFormat.parse(d.startTime) ) + theSidePad - 10 );
						})
					.attr("y", function(d, i){
						  return i*theGap + 27 + theTopPad;
					  })
				   .attr("font-size", 12)
				   .attr("font-family", "Arial")
				   .attr("font-weight", "bold")
				   .attr("text-anchor", "middle")
				   .attr("text-height", theBarHeight)
				   .attr("fill", "#000");
			
			var rectText = rectangles.append("text")
					   .text(function(d){
					   
							//if (d.assigned) return d.task+" ("+d.assigned+")";
							//return d.task;
							if (d.assigned) return d.assigned;
					   })
					   .attr("x", function(d){
						return (timeScale(dateFormat.parse(d.endTime))-timeScale(dateFormat.parse(d.startTime)))/2 + timeScale(dateFormat.parse(d.startTime)) + theSidePad;
						})
					   .attr("y", function(d, i){
						  return i*theGap + 14+ theTopPad;
					  })
					   .attr("font-size", 11)
					   .attr("text-anchor", "middle")
					   .attr("text-height", theBarHeight)
					   .attr("fill", "#fff");

		rectText.on('mouseover', function(e) {
		 // console.log(this.x.animVal.getItem(this));
					   var tag = "";

				 if (d3.select(this).data()[0].details != undefined){
				  tag = "Actividad: " + d3.select(this).data()[0].task + "<br/>" + 
						"Etapa: " + d3.select(this).data()[0].type + "<br/>" + 
						"Inicia: " + d3.select(this).data()[0].startTime + "<br/>" + 
						"Finaliza: " + d3.select(this).data()[0].endTime + "<br/>" +
						"Responsable: " + d3.select(this).data()[0].assigned + "<br/>" + 						
						"Detalle: " + d3.select(this).data()[0].details;
				 } else {
				  tag = "Actividad: " + d3.select(this).data()[0].task + "<br/>" + 
						"Etapa: " + d3.select(this).data()[0].type + "<br/>" + 
						"Inicia: " + d3.select(this).data()[0].startTime + "<br/>" + 
						"Finaliza: " + d3.select(this).data()[0].endTime;
				 }
				 var output = document.getElementById("tag");

				  var x = this.x.animVal.getItem(this) + "px";
				  var y = this.y.animVal.getItem(this) + 25 + "px";

				 output.innerHTML = tag;
				 output.style.top = y;
				 output.style.left = x;
				 output.style.display = "block";
			   }).on('mouseout', function() {
				 var output = document.getElementById("tag");
				 output.style.display = "none";
					 });

		innerRects.on('mouseover', function(e) {
		 //console.log(this);
				log("innerRects.on(\"mouseover\") >  this:"+JSON.stringify(this) );
				 var tag = "";

				 if (d3.select(this).data()[0].details != undefined){
				  tag = "Actividad: " + d3.select(this).data()[0].task + "<br/>" + 
						"Etapa: " + d3.select(this).data()[0].type + "<br/>" + 
						"Inicia: " + d3.select(this).data()[0].startTime + "<br/>" + 
						"Finaliza: " + d3.select(this).data()[0].endTime + "<br/>" +
						"Responsable: " + d3.select(this).data()[0].assigned + "<br/>" + 						
						"Detalle: " + d3.select(this).data()[0].details;
				 } else {
				  tag = "Actividad: " + d3.select(this).data()[0].task + "<br/>" + 
						"Etapa: " + d3.select(this).data()[0].type + "<br/>" + 
						"Inicia: " + d3.select(this).data()[0].startTime + "<br/>" + 
						"Finaliza: " + d3.select(this).data()[0].endTime;
				 }
				 var output = document.getElementById("tag");

				 var x = (this.x.animVal.value + this.width.animVal.value/2) + "px";
				 var y = this.y.animVal.value + 25 + "px";

				 output.innerHTML = add_html_namespace( tag );
				 output.style.top = y;
				 output.style.left = x;
				 output.style.display = "block";
				 log("innerRects.on(\"mouseover\") >  output:"+output.innerHTML );
			   }).on('mouseout', function() {
				 var output = document.getElementById("tag");
				 //output.style.display = "none";

		 });

	}

	function makeGrid( timeScale, theSidePad, theTopPad, wi, he){

		var xAxis = d3.svg.axis()
			.scale(timeScale)
			.orient('bottom')
			.ticks( d3.time.weeks, 1)
			.tickSize( -he+theTopPad+20, 0, 0 )
			.tickFormat( d3.time.format('%s') );

		var grid = svg.append('g')
			.attr('class', 'grid')
			.attr('transform', 'translate(' +theSidePad + ', ' + (he - 25) + ')')
			.call(xAxis)
			.selectAll("text")  
				.style("text-anchor", "middle")
				.attr("fill", "#000")
				.attr("stroke", "none")
				.attr("font-size", 14)
				.attr("dy", "1em");
					
		var xAxisMonths = d3.svg.axis()
				.scale(timeScale)
				.orient('top')
				.ticks( d3.time.months, 1)
				.tickSize( 18, 0, 1 )
				.tickFormat( d3.time.format('%B') );
				
		var gridMonths = svg.append('g')
			.attr('class', 'gridmonths')
			.attr('transform', 'translate(' +theSidePad + ', ' + (25) + ')')
			.call(xAxisMonths);

			gridMonths.selectAll("line")
				.attr("x1", 0 )
				.attr("y1", 0 )
				.attr("x2", 0 )
				.attr("y2", he )
				.attr("y2", he )
				.attr("stroke-width", "4")
				.attr("stroke", "#FFF");
				
			gridMonths.selectAll("text")  
				.style("text-anchor", "start")
				.attr("fill", "#808184")
				.attr("stroke", "none")
				.attr("font-size", 14)
				.attr("font-family", "Arial")
				.attr("dy", "1em");
			
		/*	
		var xAxisMonths2 = d3.svg.axis()
			.scale(timeScale)
			.orient('bottom')
			.ticks( d3.time.months, 1);
			
		var gridMonths2 = svg.append('g')
			.attr('class', 'gridmonths2')
			.attr('transform', 'translate(' +theSidePad + ', ' + (25) + ')')
			.call(xAxisMonths2)
			;
		*/
				
					
		var dd = 0;
		var mm = 0;
		
		var xAxisMonths3 = d3.svg.axis()
				.scale(timeScale)
				.orient('top')
				.ticks( d3.time.months, 1 )
				.tickSize( 17, 0, 0 )
				.tickFormat( 
						function() { mm+=2; return "m"+mm; }
				);		
		var xAxisWeeks = d3.svg.axis()
				.scale(timeScale)
				.orient('top')
				.ticks( d3.time.weeks, 2 )
				.tickSize( 17, 0, 0 )
				.tickFormat( /*function() { dd++; return "S" + (1 +(dd % 4)); }*/
						function() { dd+=2; return "s"+dd; }
				);
		var gridWeeks = svg.append('g')
			.attr('class', 'gridmonths')
			.attr('transform', 'translate(' +theSidePad + ', ' + (50) + ')')
			.call(xAxisWeeks)
			.selectAll("text")  
					.style("text-anchor", "start")
					.attr("fill", "#0ecc7a")
					.attr("stroke", "none")
					.attr("font-size", 11)
					.attr("font-family", "Arial")
					.attr("dy", "1em");
	}

	function vertLabelsTasks(theArray, timeScale, theGap, theGapMargin, theTopPad, theSidePad, theBarHeight, theColorScale){


	  var prevGap = 0;
	  
	  var borderTasks = svg.append("g")
			.selectAll("rect")
		   .data(theArray)
		   .enter()
		   .append("rect")
		   .attr("x", -5)
		   .attr("y", function(d, i){
			  return i*theGap + theGapMargin + theTopPad;
		  })
		   .attr("width", function(d){
			  return theSidePad;
		   })
		   .attr("height", theGap)
		   .attr("stroke", "#808184")
		   .attr("fill", "transparent")
		   .attr("opacity", 1.0);

	  var axisText = svg.append("g") //without doing this, impossible to put grid lines behind text
	   .selectAll("text")
	   .data(theArray)
	   .enter()
	   .append("text")
	   .text(function(d){
			return d.task;
	   })
	   .attr("x", 10 )
	   .attr("y", function(d, i) {
			return i*theGap + (theGap)/2 + theGapMargin + theTopPad;
	   })
	   .attr("font-size", 15)
	   .style("font-family","Arial")
	   .attr("text-anchor", "start")
	   .attr("text-height", 14)
	   .attr("fill", function(d){
			return "#58595b";
	   });

	}
		
	//from this stackexchange question: http://stackoverflow.com/questions/1890203/unique-for-arrays-in-javascript
	function checkUnique(arr) {
		var hash = {}, result = [];
		for ( var i = 0, l = arr.length; i < l; ++i ) {
			if ( !hash.hasOwnProperty(arr[i]) ) { //it works with objects! in FF, at least
				hash[ arr[i] ] = true;
				result.push(arr[i]);
			}
		}
		return result;
	}

	//from this stackexchange question: http://stackoverflow.com/questions/14227981/count-how-many-strings-in-an-array-have-duplicates-in-the-same-array
	function getCounts(arr) {
		var i = arr.length, // var to loop over
			obj = {}; // obj to store results
		while (i) obj[arr[--i]] = (obj[arr[i]] || 0) + 1; // count occurrences
		return obj;
	}

	// get specific from everything
	function getCount(word, arr) {
		return getCounts(arr)[word] || 0;
	}
		
	//$('control-zoom-out-crono').on('click', onControlZoomClickedCrono );
	//$('control-zoom-in-crono').on('click', onControlZoomClickedCrono );
	svgcronochartElement = document.getElementById( "svgcronochart" );
	rendersvg(  svgcronochartElement, "grafico_canvg_"+field_id ); 
}
				

function addActividadToTask( actNode ) {
/*
{
		task: "conceptualize",
		type: "development",
		startTime: "2013-1-28", //year/month/day
		endTime: "2013-2-1",
		details: "This actually didn't take any conceptualization"
	}*/

	
	var Actividad = {};
	//log("addActividadToTask() > actNode:"+GetAttribute(actNode,"id"));
	Actividad = getRecordToJSON( actNode );
	//log("addActividadToTask() > Actividad " + JSON.stringify(Actividad,null, "\t") )
	var newTask = {
		task: Actividad.actividad,
		type: Actividad.etapas.preview,
		startTime: Actividad.desde_fecha,
		endTime: Actividad.hasta_fecha,
		hit: Actividad.eshito? 1:0,
		assigned: Actividad.responsable.preview,
		details: ""+(Actividad.eshito? "Es un hito": "")+""
	};
	
	dbTasks.push(newTask);
	
	md5_tree_cronogram_new = JSON.stringify( dbTasks );
	
	//log("addActividadToTask() > " + JSON.stringify(dbTasks,null, "\t") );
}

function getFieldTemplateCronoChart( _template, xmlNode, field_path ) {
	
	var template = _template;
	var graph_d3_js_code = "";
	
	
	var dbFieldActividades = _dbFields[ field_actividades_base_path ];
	dbCronogramNode = xmlNode;
	dbCronogramPath = field_path;
	
	//log("getFieldTemplateCronoChart() > field_path: [" + field_path + "] " + JSON.stringify( dbFieldActividades ) );
	
	if (dbFieldActividades) {
	
		dbTasks = [];
		var xmlNodeActividades = dbFieldActividades['node'];
		
		//log("getFieldTemplateCronoChart() > n childs: [" + xmlNodeActividades.childNodes.length + "]");
		
		for(var i=0;i<xmlNodeActividades.childNodes.length;i++) {

			var childNode = xmlNodeActividades.childNodes[i];
			if (childNode.nodeName == "valor") {
				for(var r=0; r<childNode.childNodes.length;r++) {
					var recNode = childNode.childNodes[r];
					if (recNode.nodeName == "registro") {
						log("getFieldTemplateCronoChart() > child:"+GetAttribute(recNode,"id"));
						addActividadToTask( recNode );
					}
				}
			}
		}
	}
	
	
	graph_d3_js_code= '<div class="control-zoom"><span id="cronozoom"> </span>';
    graph_d3_js_code+= '	<a title="Zoom in" href="#" id="control-zoom-in-crono" onclick="javascript:onControlZoomClickedCrono(this, event);" class="control-zoom-in"> </a>';
    graph_d3_js_code+= '	<a title="Zoom out" href="#" id="control-zoom-out-crono"  onclick="javascript:onControlZoomClickedCrono(this, event);" class="control-zoom-out"> </a>';
    graph_d3_js_code+= '</div>';
	graph_d3_js_code+= '<div id="cronochart"> </div>';
	graph_d3_js_code+= '<div id="tag" style="display: none;z-index: 40000; position: absolute;"> </div>';
	
	template = _template.replace( /\{VALOR\}/gi, graph_d3_js_code );
	//log("getFieldTemplateCronoChart() > template:"+template );
	return template;
}


var dbNodeIngresosInternos = {};
var dbNodeIngresosExternos = {};
var dbFieldCostosAsociados = {};
var dbNodeCostos = {};
var presu_eco_ingreso;
var presu_eco_costos;
var dbPresuEcoIngreso;
var dbPresuEcoCosto;

function drawPresuEcoIngresos( field_id ) {
	log("drawPresuEcoIngresos()");
	var value = getFieldTemplatePresupuestoEcoIngresos( "{VALOR}", "", dbPresuEcoIngreso, presu_eco_ingreso );
	var tablePresuEcoElement = document.getElementById( "grafico_" + presu_eco_ingreso );
	if (tablePresuEcoElement) {
		tablePresuEcoElement.innerHTML = add_html_namespace(value);
	}
	
}

function getFieldTemplatePresupuestoEcoIngresos( _template, xmlNode, field_path, field_id ) {
	
	log("getFieldTemplatePresupuestoEcoIngresos() > field_id:"+field_id);
	
	var temp = _template;
	presu_eco_ingreso = field_id;
	dbPresuEcoIngreso = field_path;
	
	var temp_value = "";
	temp_value+= '<div class="refreshgraph" onclick="javsacript:drawPresuEcoIngresos(\'{IDCAMPO}\');">';
	temp_value+= ' ';
	temp_value+= '</div>';
	var dbFieldIngresosInternos = _dbFields[ field_ingresos_internos_base_path ];
	
	if (dbFieldIngresosInternos==undefined) return error("getFieldTemplatePresupuestoEcoIngresos() > dbFieldIngresosInternos > "+field_ingresos_internos_base_path+" undefined!");
	
	dbNodeIngresosInternos = dbFieldIngresosInternos.node;
	temp_value+= LoadLeafIterativeS( dbNodeIngresosInternos, "_print_html5" );

	
	var dbFieldIngresosExternos = _dbFields[ field_ingresos_externos_base_path ];
	if (dbFieldIngresosExternos==undefined) return error("getFieldTemplatePresupuestoEcoIngresos() > dbFieldIngresosExternos > "+field_ingresos_externos_base_path+" undefined!");
	
	dbNodeIngresosExternos = dbFieldIngresosExternos.node;
	temp_value+= LoadLeafIterativeS( dbNodeIngresosExternos, "_print_html5" );

	
	var dbFieldCostosAsociados = _dbFields[ field_costos_asociados_base_path ];
	if (dbFieldCostosAsociados==undefined) return error("getFieldTemplatePresupuestoEcoIngresos() > dbFieldCostosAsociados > "+field_costos_asociados_base_path+" undefined!");
	dbNodeCostosAsociados = dbFieldCostosAsociados.node;
	temp_value+= LoadLeafIterativeS( dbNodeCostosAsociados, "_print_html5" );
	

	var dbFieldIngresosTotales = _dbFields[ field_ingresos_totales_base_path ];
	var dbFieldIngresosTotalesDinerarios = _dbFields[ field_ingresos_subtotal_dinerario_base_path ];
	var dbFieldIngresosTotalesNoDinerarios = _dbFields[ field_ingresos_subtotal_no_dinerario_base_path ];

	temp_value+= LoadLeafIterativeS( dbFieldIngresosTotales.node, "_print_html5" );	
	temp_value+= LoadLeafIterativeS( dbFieldIngresosTotalesDinerarios.node, "_print_html5" );	
	temp_value+= LoadLeafIterativeS( dbFieldIngresosTotalesNoDinerarios.node, "_print_html5" );	

	//now create final rows...
	//print total 
	//print subtotal dinerario
	//print subtotal no dinerario
	

	temp = temp.replace( "{VALOR}", temp_value );
	return temp;
	
}


function drawPresuEcoCostos() {
	log("drawPresuEcoCostos()");
	var value = getFieldTemplatePresupuestoEcoCostos( "{VALOR}", "", dbPresuEcoCosto, presu_eco_costos );
	if (document.getElementById( "grafico_" + presu_eco_costos )) {
		document.getElementById( "grafico_"+ presu_eco_costos ).innerHTML = add_html_namespace(value);
	}
}


function getFieldTemplatePresupuestoEcoCostos( _template, xmlNode, field_path, field_id ) {
	
	log("getFieldTemplatePresupuestoEcoCostos() > field_id:"+field_id);
	
	var temp = _template;
	var temp_value = "";
	presu_eco_costos = field_id;
	dbPresuEcoCosto = field_path;
	
	temp_value+= '<div class="refreshgraph" onclick="javsacript:drawPresuEcoCostos(\'{IDCAMPO}\');">';
	temp_value+= ' ';
	temp_value+= '</div>';
	var dbFieldCostos = _dbFields[ field_costos_base_path ];
	var dbFieldCostosImprevistos = _dbFields[ field_costos_imprevistos_base_path ];
	var dbFieldCostosTotales = _dbFields[ field_costos_total_de_costo_base_path ];
	
	if (dbFieldCostos==undefined) return error("getFieldTemplatePresupuestoEcoCostos() > dbFieldCostos > "+field_costos_base_path+" undefined!");
	
	dbNodeCostos = dbFieldCostos.node;
	var dbNodeCostosImprevistos = dbFieldCostosImprevistos.node;
	var dbNodeCostosTotales = dbFieldCostosTotales.node;
	
	temp_value+= LoadLeafIterativeS( dbNodeCostos, "_print_html5" );
	temp_value+= LoadLeafIterativeS( dbNodeCostosImprevistos, "_print_html5" );
	temp_value+= LoadLeafIterativeS( dbNodeCostosTotales, "_print_html5" );

	temp = temp.replace( "{VALOR}", temp_value );
	return temp;
	
}

function getFieldMarker( xmlNode ) {
	
			var mark = GetAttribute( xmlNode, "marker" );
			var tmarker = _template_marker;
			
			var markvalue = "blanco";			
			
			switch(mark) {
					case "blanco":
					case "verde":
					case "amarillo":
					case "rojo":
							markvalue = mark;							
							break;				
			}
			
			tmarker = tmarker.replace( /\{SELECTEDMARKER\}/gi, markvalue );
			
			return tmarker;
}

function setFieldMarker( template, xmlNode ) {
	var tmarker = getFieldMarker( xmlNode );	
	template = template.replace( /\{MARKER\}/gi, tmarker );
	return template;
}

function setFieldHelper( template, xmlNode ) {
	var thelper = _template_helper;	
	template = template.replace( /\{HELPER\}/gi, thelper );
	return template;
}

function assignFieldBaseTemplate( xmlNode ) {

	var field_type = GetAttribute( xmlNode, "tipo" );
	var clase = GetAttribute( xmlNode, "clase" );
    var template = _templates[ field_type ];
	
	//if (herence==undefined) alert(" getFieldTemplate => herence: ["+herence+"] from type:" + field_type + " clase:" + clase);
	
	//log(" getFieldTemplate()=> nodename:"+xmlNode.nodeName+ " field_type:" + field_type+ " field_path:" + field_path );
	
    if (	field_type=="multiple" 
			|| field_type.indexOf("multiples")>=0 ) {
		template = _templates["multiple"];
	}
	
    if ( field_type.indexOf("grafico")>=0 ) {
		template = _templates["grafico"];
	}	
	
    if ( field_type.indexOf("formula")>=0 ) {
		template = _templates["formula"];
	}	

	if (	field_type=="seleccionar" 
			|| field_type.indexOf("seleccionar")>=0 ) {
		//field_type == "referencia"
		template = _templates["referencia"];
	}	
	
	if ( field_type.indexOf("lista")>=0 ) {
		template = _templates["lista"];
	}
	
	if ( field_type.indexOf("textoref")>=0 ) {
		template = _templates["textoref"];
	}		
			
	if (template==undefined) {
		alert("No html5 template defined for field type: "+field_type+". Check template.js .");
		return "";
	}	
		
	template = setFieldMarker( template, xmlNode);
	template = setFieldHelper( template, xmlNode);
	return template;
}

function RegisterDate( field_path, field_id ) {
	//log("RegisterDate() > field_id ["+field_id+"]");
	//var objectquery = $('#'+field_id);
	//log("RegisterDate() > objectquery ["+objectquery+"]");
	//if (objectquery) objectquery.datepicker();

}


function getFieldTemplateParrafo( template, xmlNode, field_path, field_id ) {

	var field_values = GetValues( xmlNode );
	/* onkeydown...
javascript:log('check: editor keydown');
var sed = this.contentDocument.documentElement;
setTimeout( function() {sed.focus();}, 100);
*/
	log("getFieldTemplateParrafo() > encoding field_values >> " + field_values );
	var hasvalues = false;
	var tienevalor = "false";
	if (field_values!="") {
		hasvalues = true;
		tienevalor = "true";
	}
	field_values = '<html><head><style>* { font-family: Arial; color: #555; }</style></head><body>'+field_values+'</body></html>';
	var dataURI = 'data:text/html;charset=UTF-8,' + encodeURIComponent( field_values );
	log("getFieldTemplateParrafo() > encoding URI >> " + dataURI );
	template = template.replace( /\{VALOR\}/gi, dataURI );
	template = template.replace( /\{TIENEVALOR\}/gi, tienevalor );
	return template;
}

function getFieldTemplate( xmlNode, field_path, field_id ) {
	
	//if (field_id==undefined) field_id = ;
	//if (herence==undefined) alert(" getFieldTemplate => herence: ["+herence+"] from type:" + field_type + " clase:" + clase);
	var field_type = getFieldType( xmlNode );
	var template = assignFieldBaseTemplate( xmlNode );
	
	if ( field_type.indexOf("parrafo")>=0 ) {
		template = getFieldTemplateParrafo( template, xmlNode, field_path, field_id );
	}
	
    if (field_type.indexOf("multiple")>=0 ) {
        template = getFieldTemplateMultiple( template, xmlNode, field_path, field_id );
    }
	
	if (field_type == "referencia"
		/*|| field_type == "seleccionar una persona" */
		) {
		template = getFieldTemplateReference( template, xmlNode, field_path );
	}
	
	if (field_type == "referencia-a-seccion"
		/*|| field_type == "seleccionar una persona" */
		) {
		template = getFieldTemplateReferenceToSection( template, xmlNode, field_path );
	}

	if (field_type == "arbolseleccion") {
		template = getFieldTemplateTreeSelector( template, xmlNode, field_path );
	}
	
	if ( field_type.indexOf("lista")>=0 ) {
		template = getFieldTemplateList( template, xmlNode, field_path );
	}
	
	if ( field_type.indexOf("grafico-organigrama")>=0 ) {
		template = getFieldTemplateOrgChart( template, xmlNode, field_path );
	}
	
	if ( field_type.indexOf("grafico-cronograma")>=0 ) {
		template = getFieldTemplateCronoChart( template, xmlNode, field_path );
	}	

	if ( field_type.indexOf("textoref")>=0 ) {
		template = getFieldTemplateTextoRef( template, xmlNode, field_path );
	}
	
	if ( field_type.indexOf("formula")>=0 ) {
		template = getFieldTemplateFormula( template, xmlNode, field_path, field_id );
	}
	
		
	if ( numberTypes.indexOf(field_type)>=0 ) {
		template = getFieldTemplateNumeric( template, xmlNode, field_path );
	}
	
	if (["archivo"].indexOf(field_type)>=0) {
		template = getFieldTemplateArchivo(template, xmlNode, field_path);
	}
	
	if (field_type.indexOf("grafico-presu-economico")>=0) {
		template = getFieldTemplatePresupuestoEcoIngresos( template, xmlNode, field_path, field_id );
	}
	
	if (field_type.indexOf("grafico-presu-eco-costos")>=0) {
		template = getFieldTemplatePresupuestoEcoCostos( template, xmlNode, field_path, field_id );
	}
	
	return template;
}

/**
* completeFieldTemplate
*	completes the field template with values of the field itself
*/
function completeFieldTemplate( template, xmlNode, field_path, field_name, field_id ) {
	
	var field_values = GetValues( xmlNode );
	var field_type = getFieldType( xmlNode );
	var field_actions = getFieldTemplateActions( xmlNode );
	var field_class = getFieldClass( xmlNode );
		
	//log( "completeFieldTemplate() for field_name ["+field_name+"] field_path ["+field_path+"] field_type ["+field_type+"] field_values ["+field_values+"]" );
	if (template==undefined) return error("completeFieldTemplate() > undefined template for"
										+"	field_path: ["+field_path
										+"] field_name: ["+field_name
										+"] and field_type: ["+field_type
										+"] template: ["+template +"]");
										
	//log( "completeFieldTemplate() from  ["+template+"] ");
	template = template.replace( /\{FIELDACTIONS\}/gi, field_actions );
	template = template.replace( /\{NOMBRECAMPO\}/gi, trim(field_name) );
	template = template.replace( /\{IDCAMPO\}/gi, field_id );
	
	tiene_ayuda = "campo-con-ayuda";
	if ( _ayudas[field_path]==undefined ) {
		//log( it_herence+" (no definido en la ayuda)");
		_ayudas[field_path] = { resumen: "", completa: "", ejemplos: "" };
		tiene_ayuda = "campo-sin-ayuda";
	} else if ( _ayudas[field_path] && _ayudas[field_path]["resumen"]=="") {
		tiene_ayuda = "campo-sin-ayuda";
	}

	field_values = field_values.replace( new RegExp('"',"gi"), "&quot;");
	
	template = template.replace( /\{AYUDARAPIDA\}/gi, (_ayudas[field_path]["resumen"] || " ") );	
	template = template.replace( /\{VALOR\}/gi, field_values );
	template = template.replace( /\{PATHCAMPO\}/gi, field_path );
	template = template.replace( /\{CLASE\}/gi, field_class );
	template = template.replace( /\{CAMPOCONAYUDA\}/gi, tiene_ayuda );
	/*
	if (field_type=="referencia" && field_id) {
		var objectClass	= getFieldReference(  xmlNode );
		var dbObject = _dbobjects[ objectClass ];
		if (dbObject[ 'references' ]) {
			var dbRefs = dbObject[ 'references' ];
			if (dbRefs[record_field_path]) {
				dbRefs[record_field_path]['field_id'] = field_id;
				dbRefs[record_field_path]['field_id_reference'] = 'referencia_'+field_id;
				dbRefs[record_field_path]['field_id_select'] = 'select_'+field_id;							
				_dbobjects[ objectClass ][ 'references' ]  = dbRefs;							
			}
		}
	}
	*/
	//log( "completeFieldTemplate() to  ["+template+"] ");
	return template;
}










