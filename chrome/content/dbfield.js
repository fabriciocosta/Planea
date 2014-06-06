
/**
*    Field operations:
*
*		A form is a section with his fields (and a screen interface with fields to complete), 
*		subsections of this section are displayed as the next form 
*
*
*		globals:
*
*			INTERNAL INDEXATION VARIABLES
*
*			OF FIELDS:	@see addFieldToForm()						
						@see getObjectRecordEditView() for internal record fields... (templates.js)
*
*			_dbFields[ path_field_id ] = { 
*											"node": fieldNode, 
*											"herence": path to field,
											'validator': function() { return true; },
											
											"path": record_field_path || field_path, 
											"record_id": rec_id,
											"class": field_class,
											"field_class": field_class,
											"field_type": field_type,
											"field_id": record_field_id,
											
											"objectClass": "",
											"objectClassRef": "",
											"popup": popup
*										}
*
*			_Validators[  ] = 
*			_RecordValidators[  ] = 
*
*			OF FULL FORMS:
*
*			_dbForms[ path_to_form_id ] = { 
*											"formularioN": iForm, //to iterate sequentially over the forms
*											"html": htmlFields,	//html styled form
*											"node": {},
*											"visible": {},
*											"subsecciones": "",
*											"idcampos": "",
*											"tipocampos": "",
*											"padre_seccion": "", 
*											"padre_subseccion": "", 
*											"padre_subsubseccion":"" 
*										}
*
*			_dbTreeBranches[ path_to_section ] = { 
*													"node": 	xml database node, 
*												    "id": 		tree section id,
*													"father_herence": father_herence,
*													"leaves": 	{},
*												    "branches": 	{}
*												   }
*			_dbTreeBranches[ path_to_leaf ] = {		
*												'node': xmlNode,
*												'id' : id,
*												'isleaf': (xmlNode.nodeName.toLowerCase()=="campo"),
*												'father_herence': father_herence,
*												'leaves': {}
*											}
*			OF OBJECTS (TABLES):
*
*			_dbobjects[ objectClass ] = { 	
*									'template': object_template, //html template with table multiple
*									'preview': object_preview,	//preview fields: field1_name, field2_name, field3_name
*									'objectNode': objectNode, //object node in the xml project file
*									'objectPath': objectPath, //path to find HTML
*									'parentNode': parentNode,  //parent node
*									'references': array of field that reference this object (table),
*									'objectClass': objectClass,
*									'objectClassRef': objectClassRef,
*									'instances': {}, // objects instances > field_path_1 > objectClass_RF1_, field_path_2 > _objectClass_RF2_
*									'references': [],
*									'formulas': {},
*									'sums': {}, //[ field_class] = { 'target_field_class': field_class, 'object_path': object_path } //objSum
*									'popups': '
*									}
*									
*			(TABLE ROW)
*			_dbRecords[ record_id ]	= {
*									
*										'node': recordNode >> <registro id="record_id" ...>...</registro>
*										'herence': record_path ??, 
*										'class': rec_class
*										'recordClass': ,
										'recordClassRef': ,
										'validator': function() { return true; },
*										'fields': { 
													'[field_class]' = { 
														'field_id': ..., 
														'field_path': ...  //to access full field do >> _dbFields[field_path]
													} 
												 }
*									}			
*
*
*		functions:
*
*		addFieldToForm( herence_form, herence_field, iForm, htmlForm, xmlNode )
*			add a Field reference to HTML Section form ( @see _dbForms[] )
*
*		GetFieldLabel( childNode )
*			retreive <label> or #text value from node
*
*		GetValues( fieldNode )
*			retreive values in <valor>..</valor> from node
*
*		getNewRecordId( valuesNode, object_class )			
*			create a new record id ( based on last childs <registro/>... found at "valuesNode" (<valor>..</valor>) )
*			New recordID retreived is required to create a new record from class "object_class".
*			@return string recordid   ( Composed as a string [object_class + "_" + new_id], so any "multiple" object_class defined twice, cannot coexists safelly)
*
*		AddRecord( objectClass, to_herence )
*			create a new record from class "objectClass" and to the target "to_herence" (path to field) )
*			format for to_herence is [SectionName]:[SectionName]:[FieldName]
*
*		EditRecord( record_id )
*			Displays the editable form to complete the field's record		
*		
*		HideAllOthers ( record_id )
*			
*		DeleteRecord( objectClassRef, record_id, forced )
*
*		getRecordValue( record_id, record_field )
*			retreive the value of the field (<campo...) identified by attribute ( clase="record_field"), from the record identified by "record_id" 
*			
*		ExecuteRecord( record_id )
*			send an execution message to this record: execute directly [ this is hardcoded in ]
*
*		
*
*/

var _dbForms  = {};
var _dbFields = {};
var _dbRecords = {};
var _dbTreeBranches = {};
var _dbTreeLeaves = {};
var prefield_id = "";//"input_"
var numberTypes = ["numero","decimal","natural","entero","monto","porcentaje","formula"];
var code_names = [ "registro", "campo", "seccion", "valor", "categoria", "ficha"];

var _Validators = {};
var _RecordValidators = {};

_Validators[ 'imagen' ] =   function( field_path, field_id ) {

									var dbField = _dbFields[field_path];
									log("Validating ["+field_path+"]");
									
									return true;
							};

_RecordValidators[ 'persona' ] =   function( record_id, field_path, field_id ) {

									var dbField = _dbFields[field_path];
									var dbRecord = _dbRecords[record_id];
									var recordNode = dbRecord.node;
									var fieldNode = dbField.node;
									
									log("Validating PERSONA with record validator for: ["+field_path+"]");
									
									return true;
							};
							
_RecordValidators[ 'relacion' ] =   function( record_id, field_path, field_id ) {

									var dbField = _dbFields[field_path];
									var dbRecord = _dbRecords[record_id];
									var recordNode = dbRecord.node;
									var fieldNode = dbField.node;
									
									log("Validating RELACION with validator for: ["+field_path+"]");
									
									var Relacion = getRecordToJSON( recordNode );									
									//assign new value:
									Relacion[dbField.field_class] = GetValuesInput( field_path );
									log("Validating RELACION >  " + " Updated Relacion: " +  JSON.stringify( Relacion, null, "\t")  );
									//stringify for comparison
									var Relacion_str = JSON.stringify(Relacion);
									
									
									/*PROCESAR CONDICIONES*/
									
									/*CONDICION 1  */
									/* NO PUEDE HABER DUPLICADOS!! */
									//recorrer las otras relaciones... de este mismo registro
									var Persona = getRecordToJSON( recordNode.parentNode.parentNode.parentNode );
									var MisRelaciones = Persona["misrelaciones"];
									
									log("Validating RELACION >  " + " is from persona: " +  JSON.stringify(Persona,null, "\t")  );
									
									var misrels = {};
									
									for( var rid in MisRelaciones) {
										var rel = JSON.stringify( MisRelaciones[rid] );
										if (rid!=record_id) {
											if (rel==Relacion_str) {
												error("Validating RELACION > duplicated! with : record id[" + rid + "]");
												return false;
											}
										}
									}
									
									/*CONDICION 2  */
									
									// si es responsable de esa area > no puede tener otra relacion dentro de esa area....
									// responsabilidad implica => relacion unica!!!!
									if ( Relacion.esresponsabledearea
										&& Relacion.esresponsabledearea.indexOf("S")>=0 ) {
										
										var comp_str = JSON.stringify( { 'esresponsabledearea': Relacion.esresponsabledearea, 'relacionarea': Relacion.relacionarea } );
										var ctr ="";
										for( var rid in MisRelaciones) {
											var ctr = JSON.stringify( { 'esresponsabledearea': MisRelaciones[rid].esresponsabledearea, 'relacionarea': MisRelaciones[rid].relacionarea } );
											if (rid!=record_id) {
												if (ctr==comp_str) {
														error("Validating RELACION > CONDICION 2! [responsabilidad no permite duplicacion de relaciones en un area] con record id[" + rid + "]");
														return false;
												}
											}
										}
										
									}
									

									/*CONDICION 3 */
									/* si hay dependencia */
									if ( Relacion.tipoderelacion 
										&& Relacion.personarelativa 
										&& Relacion.tipoderelacion.length>0
										&& Relacion.personarelativa.length>0) {
										
										/* A = Persona Relativa
										*  B = esta Persona
										*	Z = area de A
										*	Y = area de B
										*	R( B, Y) => verdadero si B es responsable de Y
										*	dep( B, A, Z, Y) => verdadero si B depende de A siendo el area de A,Z y el area de B,Y
										*	per( B, Y) => verdadero si B pertence al area Y
										*	dp(B,A) es verdadero ssi ( Z!=Y && R(B,Y) )
										*   dp(B,A) tambien ssi ( Z==Y && ( R(B,Y)!=R(A,Z) ) && not( dp(A,B) ) ) 
										*/
										log("Validating RELACION > " + " procesando dependencia...." );
									}
									/* si no hay dependencia */
									else {
									
									}
									
									return true;
							};

_RecordValidators[ 'actividad' ] = function( record_id, field_path, field_id ) {
									var dbField = _dbFields[field_path];
									var parent_field_path = dbField.parent_field_path;
									var dbRecord = _dbRecords[record_id];
									var recordNode = dbRecord.node;
									var fieldNode = dbField.node;
									var field_class = dbField.field_class;
									
									log("Validating ACTIVIDAD with record validator for: record_id["+record_id+"] field_path ["+field_path+"] field_class ["+field_class+"]");
									var Actividad = getRecordToJSON( recordNode );
									
									log ("Validating ACTIVIDAD > "+  JSON.stringify(  Actividad, null , "\t" ) );
									
									var duracion = Actividad["duracion"];
									var unidad = Actividad["unidaddetiempo"];
									var desdeunidad = Actividad["desdeunidad"];
									
									if (["desde_fecha","hasta_fecha"].indexOf( field_class )>=0) {
										return true;
									}
									
									//var desde_fecha = Actividad["desde_fecha"];
									//var hasta_fecha = Actividad["hasta_fecha"];
									var fechainicio = Actividad["fechainicio"];
									
									var fechainicio_actividad = fechainicio;
									var fecha_inicio_proyecto = new Date();
									var hoy = new Date();
									
									//ORDEN DE IMPORTANCIA: fechainicio_actividad >>>>> [hoy | fecha_inicio_proyecto ] + desdeunidad 
									
									if (fechainicio_actividad==undefined || fechainicio_actividad=="") {
										fechainicio_actividad = sumaTiempo(  hoy, desdeunidad, unidad);
									} else {
										//recalcula el desdeunidad .... en funcion de cuando se marco esta fecha de inicio, que debe ser relativa a:
											// la fecha de inicio del proyecto!!! si existe, claro
											// la feha de hoy >>>> que marca el 0..... desde = 0 = hoy => desde  = -1 mes = mes pasado
											if (fecha_inicio_proyecto!=undefined ) 
												fechainicio_actividad = sumaTiempo(  fecha_inicio_proyecto, desdeunidad, unidad);
									}
									
									//formula para:
									// desde_fecha
									desde_fecha = dateToString( fechainicio_actividad );
									hasta_fecha = dateToString( sumaTiempo( fechainicio_actividad, duracion, unidad ) );
									
									df_field_path = parent_field_path+":"+record_id+":desde_fecha";
									hf_field_path = parent_field_path+":"+record_id+":hasta_fecha";
									df_field_id = record_id+"_desde_fecha";
									hf_field_id = record_id+"_hasta_fecha";
									
									log("Validating ACTIVIDAD > desde_fecha : " + desde_fecha+ " hasta_fecha:" + hasta_fecha );
									SaveField( df_field_path, df_field_id, desde_fecha );
									SaveField( hf_field_path, hf_field_id, hasta_fecha );
									
									drawD3Cronogram( _dbFields[dbCronogramPath].field_id, null, true );
									return true;
									
							};

_RecordValidators[ 'ingreso' ] = function( record_id, field_path, field_id ) {

								var dbField = _dbFields[field_path];
								var parent_field_path = dbField.parent_field_path;
								
								log("_RecordValidators[] > parent_field_path["+parent_field_path+"] record_id["+record_id+"] => field_path["+field_path+"] field_id["+field_id+"]");
								
								drawPresuEcoIngresos();
								
								return true;
							};

_RecordValidators[ 'costo' ] = function( record_id, field_path, field_id ) {

								var dbField = _dbFields[field_path];
								var parent_field_path = dbField.parent_field_path;
								
								log("_RecordValidators[] > parent_field_path["+parent_field_path+"] record_id["+record_id+"] => field_path["+field_path+"] field_id["+field_id+"]");
								
								drawPresuEcoCostos();
								return true;
							};

_RecordValidators[ 'costo-asociado-a-ingreso' ] = function( record_id, field_path, field_id ) {

								var dbField = _dbFields[field_path];
								var parent_field_path = dbField.parent_field_path;
								
								log("_RecordValidators[] > parent_field_path["+parent_field_path+"] record_id["+record_id+"] => field_path["+field_path+"] field_id["+field_id+"]");
								
								drawPresuEcoIngresos();
								return true;
							};								

function showProyectada( field_path, field_id ) {

	log( "showProyectada() > " + field_path +  " _dbFields[field_path].formulaOpen:"+_dbFields[field_path].formulaOpen );
	
	if (_dbFields[field_path].formulaOpen == undefined) {
		_dbFields[field_path].formulaOpen = true;
	} else if (_dbFields[field_path].formulaOpen==true) {
		_dbFields[field_path].formulaOpen = false;
		return hideProyectada( field_path, field_id );
	} else if (_dbFields[field_path].formulaOpen==false) {
		_dbFields[field_path].formulaOpen = true;
	}
		
	
	//show fields
	var fp1 = field_path.replace("cantidadproyectada", "cantidadmaxima" );
	var fp2 = field_path.replace("cantidadproyectada", "capacidadproyectada" );

	var din = document.getElementById(field_id);
	
	var rect = din.getBoundingClientRect();	
	
	var parent_path = _dbFields[field_path]["parent_path"];
	var pa = _dbFields[ parent_path ];
	var paEl = document.getElementById("field_"+pa.field_id);
	//log("Parent >> pa.field_id >> " + pa.field_id );
	
	var rectrel = paEl.getBoundingClientRect();
	var toprel = parseInt(rect.top) - parseInt(rectrel.top);
		
	//log( "EditField() > fp1 - " + fp1 );
	//log( "EditField() > fp2 - " + fp2 );
	
	var ff1 = _dbFields[fp1];
	var ffid1 = "field_" + ff1.field_id;
	
	//log( "EditField() > ff1 - " + ff1 );
	//log( "EditField() > ffid1 - " + ffid1 );
	
	var ff2 = _dbFields[fp2];
	var ffid2 = "field_"+ff2.field_id;
	
	//log( "EditField() > ff2 - " + ff2 );
	//log( "EditField() > ffid2 - " + ffid2 );
	
	innode1 = document.getElementById(ff1.field_id);
	innode2 = document.getElementById(ff2.field_id);
	if (innode1) innode1.focus();
	
	hnode1 = document.getElementById(ffid1).parentNode;
	hnode2 = document.getElementById(ffid2).parentNode;
	//log( "EditField() > hnode1 - " + hnode1.outerHTML );
	//log( "EditField() > hnode2 - " + hnode2.outerHTML );
	//log( "EditField() > hnode1 - " + hnode1.getAttribute("class") +" to:" + toprel );
	//log( "EditField() > hnode2 - " + hnode2.getAttribute("class") +" to:" + toprel );
	
	hnode1.setAttribute("style","top: "+ toprel+"px ; transform: scale(1.0);");
	hnode2.setAttribute("style","top: "+ toprel+"px ; transform: scale(1.0);");
	
}

function hideProyectada( field_path, field_id ) {

	log( "EditField() > " + field_path );

	//show fields
	var fp1 = field_path.replace("cantidadproyectada", "cantidadmaxima" );
	var fp2 = field_path.replace("cantidadproyectada", "capacidadproyectada" );
	
	//log( "EditField() > fp1 - " + fp1 );
	//log( "EditField() > fp2 - " + fp2 );
	
	var ff1 = _dbFields[fp1];
	var ffid1 = "field_" + ff1.field_id;
	//log( "EditField() > ff1 - " + ff1 );
	//log( "EditField() > ffid1 - " + ffid1 );
	
	var ff2 = _dbFields[fp2];
	var ffid2 = "field_"+ff2.field_id;
	log( "EditField() > ff2 - " + ff2 );
	log( "EditField() > ffid2 - " + ffid2 );
	
	hnode1 = document.getElementById(ffid1).parentNode;
	hnode2 = document.getElementById(ffid2).parentNode;
	
	innode1 = document.getElementById(ff1.field_id);
	innode2 = document.getElementById(ff2.field_id);
	
	//log( "EditField() > hnode1 - " + hnode1.outerHTML );
	//log( "EditField() > hnode2 - " + hnode2.outerHTML );
	//log( "EditField() > hnode1 - " + hnode1.getAttribute("id") );
	//log( "EditField() > hnode2 - " + hnode2.getAttribute("id") );
	
	hnode1.setAttribute("style","transform: scale(0.0);");
	hnode2.setAttribute("style","transform: scale(0.0);");
	
}
	
function CalcDinerario( tipo_de_movimiento ) {

	if (tipo_de_movimiento && tipo_de_movimiento.length>0) {
		return ( tipo_de_movimiento.toLowerCase().indexOf('no')>=0 ) ? 0 : 1;
	}
	return 1;
}

function CalcNoDinerario( tipo_de_movimiento ) {
	if (tipo_de_movimiento && tipo_de_movimiento.length>0) {
		return ( tipo_de_movimiento.toLowerCase().indexOf('no')>=0 ) ? 1 : 0;
	}
	return 0;
}
	
function TotalIngresoProyectado() {
	return 0;
}
	
function SubtotalDinerario() {
	return 0;
}

function SubtotalNoDinerario() {
	return 0;
}

function TotalIngresosPorTipo() {
	return "270375/18080808";
}

/*
	var field_class = getFieldClass( fieldNode );
	var field_type = getFieldType( fieldNode );
	var field_formula = getFieldFormula( fieldNode );
	
    //we save the XML Node of this field so we can save our data directly to XML DOM
	if (_dbFields[ herence_field ]) {
		_dbFields[ herence_field ]["node"] = fieldNode;
		_dbFields[ herence_field ]["path"] = trim(herence_field);
		_dbFields[ herence_field ]["section_path"] = trim(herence_form);
		_dbFields[ herence_field ]["class"] = field_class;
		_dbFields[ herence_field ]["field_type"] = field_type;
		_dbFields[ herence_field ]["field_id"] = field_id;
		_dbFields[ herence_field ]["validator"] = assignValidator( trim(herence_field), field_class, field_type );
		_dbFields[ herence_field ]["formula"] = field_formula;
	} else
	_dbFields[ herence_field ] = { 
		"node": fieldNode,
		"path": trim(herence_field),
		"section_path": trim(herence_form),
		"class": field_class,
		"field_class": field_class,
		"field_type": field_type,
		"field_id": field_id,
		"validator": ,
		"formula": field_formula,
		"objectClass": "",
		"objectClassRef": "",
		"popup": ''
	};	
*/
				
function createField( fieldNode, field_path, field_id, section_path, parent_field_path, from_popup ) {
	return {	
		"node": fieldNode, 
		"herence": field_path,
		"section_path": section_path,
		"parent_field_path": parent_field_path,//parent is the parent field, of type ("multiple")
		'validator': assignValidator( trim(field_path), getFieldClass( fieldNode ), getFieldType( fieldNode ) ), //function
		"path": field_path,
		"class": getFieldClass( fieldNode ),
		"field_class": getFieldClass( fieldNode ),
		"field_type": getFieldType( fieldNode ),
		"field_id": field_id,
		"record_id": "",
		"objectClass": "",
		"objectClassRef": "",
		"formula": getFieldFormula( fieldNode ),
		"formulas": [],
		"popup": from_popup
	};
}

function createSum( target_field_class, object_path ) {
	return {
			'target_field_class': target_field_class,
			'object_path': object_path,
			'result': 0
		};
}

function createFormula(  ) {

}
			
function assignRecordValidator( parent_field_path, rec_class, record_field_path, field_class, field_type ) {

	var val;
	var base_class = getBaseClassObject( rec_class );
	
	log ("assignRecordValidator() > parent_field_path["+parent_field_path+"] rec_class["+rec_class+"] field_class["+field_class+"]" );
	
	val = _RecordValidators[ parent_field_path ];
	if (val!=undefined) return val;
	
	val = _RecordValidators[ rec_class ];
	if (val!=undefined) return val;
	
	val = _RecordValidators[ base_class ];
	if (val!=undefined) return val;
	
	val = _RecordValidators[ rec_class+"_"+field_class ];
	if (val!=undefined) return val;
	
	val = _RecordValidators[ base_class+"_"+field_class ];
	if (val!=undefined) return val;
	
	val = _RecordValidators[ record_field_path ];
	if (val!=undefined) return val;
	
	val = _RecordValidators[ field_class ];
	if (val!=undefined) return val;
	
	val = _RecordValidators[ field_type ];
	if (val!=undefined) return val;
	
	//error("assignValidator() undefined for  field_class ["+field_class+"] from field_path ["+record_field_path+"]");
	return val;
}
							
function assignValidator( field_path, field_class, field_type ) {

	var val;
	
	val = _Validators[ field_path ];
	if (val!=undefined) return val;
	
	val = _Validators[ field_class ];
	if (val!=undefined) return val;
	
	val = _Validators[ field_type ];
	if (val!=undefined) return val;
	//error("assignValidator() undefined for  field_class ["+field_class+"] from field_path ["+field_path+"]");
	return val;
}

function getSectionName( xmlNode ) {
	return getFieldName( xmlNode );
}

function getFieldName( xmlNode ) {

	var fieldName = "";
	if (xmlNode.nodeName==undefined) {
		return error("getFieldName() > ["+xmlNode+"]");
	}
    var labels = xmlNode.getElementsByTagName("label");
    (labels.length>0) ? fieldName = trim(labels[0].childNodes[0].nodeValue) : fieldName = trim(xmlNode.childNodes[0].nodeValue);
	
	return fieldName;
}

function getFieldClass( fieldNode ) {
	var clas =  GetAttribute( fieldNode, "clase");
	if (code_names.indexOf(clas)>=0) {
		warning("Warning using internal code name in XML internal section or clase definitions... avoid if possible."+clas);
	}
	return clas;
}

function getFieldFormula( fieldNode ) {
	return GetAttribute( fieldNode, "formula");
}

function getFieldFileName( fieldNode ) {
	return GetAttribute( fieldNode, "filename");
}

function getFieldSum( fieldNode ) {
	return GetAttribute( fieldNode, "suma");
}

function getTotalFieldId( object_class_ref, fieldNode) {
	return "total_"+object_class_ref+"_"+getFieldClass(fieldNode);
}

function getFieldType( fieldNode ) {
	var tip =  GetAttribute( fieldNode, "tipo");
	if (code_names.indexOf(tip)>=0) {
		warning("Warning using internal code name in XML internal section or clase definitions... avoid if possible: "+tip);
	}
	return tip;
}

function getFieldReference( fieldNode ) {
	return GetAttribute( fieldNode, "referencia");
}

/**
*		addFieldToForm( herence_form, herence_field, iForm, htmlForm, xmlNode )
*
*			add a Field reference to HTML Section form ( @see _dbForms[] )
*			_dbFields[ herence_field ] = {
*					"node" : xmlNode in the XML project file.
*					"path" : path with the form "arbol:Portada:Presentación:Iítulo"
*			}		
*
*/
function addFieldToForm( herence_form, herence_field, iForm, htmlForm, fieldNode, field_id ) {

    if (DBTree.verbose) log(  "addFieldToForm(): herence_form: " + herence_form 
							+ " herence_field: " + herence_field
							+" fieldNode: <" + fieldNode.nodeName + ">" );

    if (_dbForms[herence_form]==undefined) {
        _dbForms[herence_form] = { 
							"formularioN": 0,
							"html": '', 
							"fields": {} ,
							"visible": {} ,
							"subsecciones": "", 
							"idcampos": "", 
							"tipocampos": "",
							"padre_seccion": "", 
							"padre_subseccion": "", 
							"padre_subsubseccion":""
							};
        _formularios[iForm] = herence_form;
    }

    htmlfields = _dbForms[herence_form]["html"];
	
	_dbForms[herence_form]["formularioN"] = iForm; 
	_dbForms[herence_form]["html"] = htmlfields + add_html_namespace( htmlForm );
	_dbForms[herence_form]["node"] = fieldNode.parentNode;
	_dbForms[herence_form]["visible"]=false;
	_dbForms[herence_form]["fields"][herence_field] = true;

    var family = herence_form.split(':');
    var section = '';

	if (_dbFields[herence_field]==undefined)
		_dbFields[herence_field] = createField( fieldNode, herence_field, field_id, herence_form );
	else 
		_dbFields[herence_field]["section_path"] = herence_form;
	
    for( var si=0; si<family.length; si++) {
        if (si==1) _dbForms[herence_form]["padre_seccion"] = family[si];
        if (si==2) _dbForms[herence_form]["padre_subseccion"] = family[si];
        if (si==3) _dbForms[herence_form]["padre_subsubseccion"] = family[si];
    }
	

}

/**
*  GetFieldLabel( node )
*
*			retreive <label> or #text value from node		
*/
function GetFieldLabel( childNode ) {
    var field_values = "";
    if ( childNode.childNodes[0] && childNode.childNodes[0].nodeName=="#text")
        if (childNode.childNodes[0].nodeValue)
            field_values = childNode.childNodes[0].nodeValue;
    return field_values;
}

function getThisFieldSection( field_path ) {
	var section_path;
	var field_data = _dbFields[ field_path ];
	if (field_data) {
		section_path = field_data["section_path"];
		var parent_path = field_data["parent_path"];
		if (section_path==undefined && parent_path != "") {
			return getThisFieldSection( parent_path );
		}
	} else error("getThisFieldSection() >  field_path [" + field_path +"]");
	return section_path;
}

/**
*		GetValues( node )
*
*			retreive values in <valor>..</valor> from node
*
*			possible childNode:
*			<campo clase="titulo" type="texto">Título</campo>
*
*			o bien:
*			<campo clase="titulo" type="texto">Título
*							<valor>El titulo de mi proyecto aqui.</valor>
*			</campo>
*		
*/
function GetFieldValues( fieldNode ) {
	return GetValues( fieldNode );
}

function GetValues( fieldNode ) {
    var field_values = "";
    if ( fieldNode.childNodes[1] && fieldNode.childNodes[1].nodeName=="valor") { // <campo><valor>... 
        if (fieldNode.childNodes[1].childNodes[0]) {// #text ?
            field_values = fieldNode.childNodes[1].childNodes[0].nodeValue;
		}
	}
    return field_values;
}

function GetValuesInput( field_path, forced_value, html_set ) {		

		var dbField = _dbFields[field_path];
		if (dbField==undefined)
			return error("GetValuesInput() > field_path unregistered! ["+field_path+"]");
		
		var field_type = dbField.field_type;
		var field_id = dbField.field_id;
		
		var htmlfieldElement = document.getElementById(field_id);
		if (htmlfieldElement==undefined) 
			return error("GetValuesInput() > HTML input value not found! ["+field_id+"]");
		
		if (html_set==undefined) html_set = false;
		
		var _nuevo_valor = forced_value;
		
		log("GetValuesInput() > getting values from HTML field_id: "+field_id+"  htmlfield: "+htmlfieldElement+" field_path:" + field_path );
	    	
		if (	htmlfieldElement.color!==undefined
				&& field_type.indexOf("color")==0) {
			//log("GetValuesInput() : color htmlfield.type:"+htmlfieldElement.getAttribute("type") + " color:"+htmlfieldElement.color );
			if (_nuevo_valor==undefined) _nuevo_valor = htmlfield.color;
			if (html_set) htmlfieldElement.setAttribute( "color", _nuevo_valor);
		}		
		
		if (field_type.indexOf('archivo')==0) {
			
		}
		
		if (field_type.indexOf('imagen')==0) {
			
		}
		
		if (htmlfieldElement.value!==undefined 
			&& ( 
					field_type.indexOf("tilde")==0 
				) 
			) {
			
			//log("GetValuesInput() : input htmlfield.type:"+htmlfieldElement.getAttribute("type"));
			
			if (htmlfieldElement.getAttribute("type")=="checkbox") {
				if (_nuevo_valor==undefined) {
					_nuevo_valor = htmlfieldElement.checked;
					if (_nuevo_valor!=true) _nuevo_valor = false; 
				}
				//log("GetValuesInput() : input htmlfield.checked:" + _nuevo_valor );
				if (html_set) htmlfieldElement.setAttribute( "checked", _nuevo_valor);
			} else {
				if (_nuevo_valor==undefined) _nuevo_valor = htmlfieldElement.value;
				//log("GetValuesInput() : input htmlfield.value:" + _nuevo_valor );
				if (html_set) htmlfieldElement.setAttribute( "value", _nuevo_valor);
			}
			
		}
		
		if (	htmlfieldElement.value!==undefined
				&&  (
						/*field_type.indexOf("parrafo")==0
					||	*/field_type.indexOf("texto")==0
					)
				) {
			if (_nuevo_valor==undefined) _nuevo_valor = htmlfieldElement.value;
			if (html_set) {
				htmlfieldElement.value = _nuevo_valor;
				htmlfieldElement.innerHTML = _nuevo_valor;
			}
			//log("GetValuesInput() : parrafo/texto htmlfieldElement: " + htmlfieldElement.innerHTML );
		}
		
		if (htmlfieldElement && htmlfieldElement.nodeName=="editor") {
	
			var htmlfieldElementCONTENT = htmlfieldElement.contentDocument.getElementsByTagName("body")[0];
			//valueforce = htmlfieldElement.innerHTML;
			if (_nuevo_valor==undefined) _nuevo_valor = htmlfieldElementCONTENT.innerHTML;
			log(" GetValuesInput() > editor > _nuevo_valor:" + _nuevo_valor );
			if (html_set) {
				log(" GetValuesInput() > editor > resetting html to _nuevo_valor:" + _nuevo_valor );
				htmlfieldElementCONTENT.innerHTML = _nuevo_valor;
			}
		}
		
		if (htmlfieldElement.value!==undefined && field_type.indexOf("referencia")==0) {
			//log("GetValuesInput() : select field: htmlfield.selectedIndex: " + htmlfieldElement.selectedIndex );
			var option_value = htmlfieldElement.options[htmlfieldElement.selectedIndex].value;

			//Add a new item:
			if ( _nuevo_valor==undefined && option_value=="-1") {
				//log("GetValuesInput() : Adding a new item > Opening a PopupRelational");
				//abre un popup (show modal ??)
				PopupRelational( field_path, field_id );
			} else {
				//save the value ( from <option value="XX">) that reference the object record ( {object_name}_{id_record}
				if ( _nuevo_valor==undefined ) _nuevo_valor = option_value;
			}
			
			option_value = _nuevo_valor;
			for( var io=0; io<htmlfieldElement.childNodes.length; io++) {
				var op = htmlfieldElement.childNodes[ io ];				
				if (op.nodeName=="html:option") {
					op.removeAttribute("selected");
					if ( op.getAttribute("value")==option_value ) {
						op.setAttribute( "selected", "selected" );
					}
				}				
			}			
		}
		
		if (htmlfieldElement.value!==undefined && field_type.indexOf("lista")==0) {
			//log("GetValuesInput() : list (<select>) field: htmlfieldElement.selectedIndex: " + htmlfieldElement.selectedIndex );
			option_value = htmlfieldElement.options[htmlfieldElement.selectedIndex].value;			
			if ( _nuevo_valor==undefined ) _nuevo_valor = option_value;
			
			
			// Recorrer los options del <select>
			option_value = _nuevo_valor;
			for( var io=0; io<htmlfieldElement.childNodes.length; io++) {
				var op = htmlfieldElement.childNodes[ io ];				
				if (op.nodeName=="html:option") {
					if (html_set) op.removeAttribute("selected");
					if ( op.getAttribute("value")==option_value ) {
						if (html_set) op.setAttribute( "selected", "selected" );
					}
				}				
			}			
			
		}		

		//error("document.getElementById("+_id_campo+").value = " + htmlfieldElement.value );	
		if ( field_path=="arbol:Presentación:Título:Título") {
			//log("GetValuesInput()  field_path: "+field_path+" : Update project title: htmlfieldElement.value:"+htmlfieldElement.value);
			//document.getElementById("project_title").innerHTML = _nuevo_valor;
		}
		
		
		if (	htmlfieldElement.value!==undefined && numberTypes.indexOf(field_type)>=0 ) {
			if (_nuevo_valor==undefined) _nuevo_valor = htmlfieldElement.value;
			//log("GetValuesInput() > saving number from XULElement: " + field_type+" valor:" + _nuevo_valor );
			if (html_set) {
				htmlfieldElement.value = _nuevo_valor;
				htmlfieldElement.setAttribute( "value", _nuevo_valor );
			}
		}
		
		
		if (	htmlfieldElement.value!==undefined && field_type.indexOf("fecha")>=0 ) {
			if (_nuevo_valor==undefined) _nuevo_valor = htmlfieldElement.value;
			log("GetValuesInput() > saving date from XULElement: " + field_type+" valor:" + _nuevo_valor );
			if (html_set) {
				htmlfieldElement.value = _nuevo_valor;
				htmlfieldElement.setAttribute( "value", _nuevo_valor );
			}	
		}
		
		return _nuevo_valor;

}


function getBaseClassObject( record_class_instance ) {
	var idx_RF = record_class_instance.indexOf("_RF");
	if (idx_RF>=0) {
		var base_class_object = record_class_instance.substr( 0, idx_RF );
		return base_class_object;
	}
	return record_class_instance;
}

/**
*		getNewRecordId( valuesNode, object_class )
*
*			create a new record id ( based on last childs <registro/>... found at "valuesNode" (<valor>..</valor>) )
*			New record id retreived is required to create a new record from class "object_class".
*/
function getNewRecordId( valuesNode, object_class ) {

    var values = evaluateXPath( valuesNode, "registro" );    
    var new_id = values.length;
    var old_ids = [];
	//ID: In "persona_0" is 0, in "object_class_name_REF_0" is 0
	//retreiving last number after "_" from recordNode "id" attribute
    for( var r in values) {
        var recordNode = values[r];
        var ids = GetAttribute( recordNode, "id");
        var nums = ids.split("_");
        if (nums.length>1) id_number = parseInt( nums[ nums.length - 1 ] );
        old_ids.push( id_number );
    }

    if (old_ids.length>0) {
        old_ids.sort( function(a,b){return a - b} );
        new_id = old_ids[ old_ids.length -1 ];
        new_id = new_id + 1;
    }

    return object_class + "_" + new_id;
}

function getNewRecordOrder( valuesNode, object_class ) {

    var values = evaluateXPath( valuesNode, "registro" );    
    var new_order = values.length;
    
    return new_order;
}

function refreshRecords( objectClass ) {
	
	var popup = "";
	var objectClassRef = objectClass;
	var objectClassSource = objectClass;
	
	if (objectClassRef.indexOf('_popup')>=0) {
		var idx = objectClassRef.indexOf('_popup');		
		objectClassSource = objectClassRef.substr( 0, idx);
	}
	
	var object = _dbobjects[ objectClassSource ];
	var object_path = object.objectPath;
	var objectTemplate = object.template;
    var objectNode = object.objectNode;
    var parentNode = object.parentNode;
	
	var dbField = _dbFields[ object_path ];
	log( " refreshRecords() > dbField.field_id:" + dbField.field_id+" object class: [" + objectClassSource+"_records_gral]" );
	
	var htmlRecords = document.getElementById( objectClassSource+"_records_gral" );
	
	if (htmlRecords) {
	
		//var template = assignFieldBaseTemplate( parentNode );
		var template = getFieldTemplateMultiple( "{MULTIPLERECORDS}", parentNode, object_path, dbField.field_id, "refresh" );		
		template = completeFieldTemplate( template, parentNode, object_path, getFieldName(parentNode), dbField.field_id );
				
		//log( " refreshRecords() : " + template );
		template = add_html_namespace(  template );
		htmlRecords.parentNode.innerHTML = template;
	}
	
}

function orderRecords( objectClass ) {
	
	var popup = "";
	var objectClassRef = objectClass;
	var objectClassSource = objectClass;
	
	if (objectClassRef.indexOf('_popup')>=0) {
		var idx = objectClassRef.indexOf('_popup');		
		objectClassSource = objectClassRef.substr( 0, idx);
	}
	
	var object = _dbobjects[ objectClassSource ];
	if (!object) { error("orderRecords() > objectClass not found : "+objectClass); return; }
	var object_path = object.objectPath;
	var objectTemplate = object.template;
    var objectNode = object.objectNode;
    var parentNode = object.parentNode;

	var values = evaluateXPath( parentNode, "valor/registro" );
	if (values.length) {
		var o = 0;
		for(var ro in values) {
			var recNode = values[ro];
			recNode.setAttribute("order",o);
			o++;			
		}
	}
	log("orderRecords() > objectClass [" + objectClass +"] and refreshRecords ["+objectClassRef+"] the original source is ["+objectClassSource+"]")
	refreshRecords(objectClassRef);
}

/**
*		AddRecord( object_class, to_herence )
*
*			create a new record from class "objectClass" and to the target "to_herence" (path to field) )
*			format for to_herence is [SectionName]:[SectionName]:[FieldName]
*		TODO: set focus()!!
*/
function AddRecord( objectClass, to_herence ) {
    
	var object;
	var objectClassSource = objectClass;
	var objectClassRef = objectClass;
	var popup = "";
	
	if (objectClassRef.indexOf('_popup')>=0) {
		
		var idx = objectClassRef.indexOf('_popup');
		
		objectClassSource = objectClassRef.substr( 0, idx);
		popup = "_popup";
	}
	
	object = _dbobjects[ objectClassSource ];

	
    if (object) {
        var objectTemplate = object.template;
        var objectNode = object.objectNode;
        var parentNode = object.parentNode;
		var actual_edit_field = object["actual_edit_field"];
        log( "AddRecord() Object creation: objectClassSource:" + objectClassSource + " objectClass:" + objectClassRef );
        
		if ( actual_edit_field ) {
			SaveField( actual_edit_field.field_path, actual_edit_field.field_id );
		}
		
		
        //check for node <valor>...</valor>, if it doesnt exists create it...to contain new record
		/** valid node is: 
				<campo (parentnode)>  
					<ficha (objectNode)>
						...
					</ficha>
					<valor>
						<registro>...</registro>
						...
					</valor>
				</campo>
		*/
        var valores = evaluateXPath( parentNode, "valor" );
        if (valores.length>1) {
            return error("AddRecord("+objectClass+") : Too many <valor>");    
        }

        var valorNode = undefined;

        if (valores.length==1) {
			//select the first <valor> node
            valorNode = valores[0];
        } else {
            //create element <valor>
            var ele_valor = PlaneaDocument.getXMLDatabase().createElement("valor");
            parentNode.appendChild( ele_valor );
            valores = evaluateXPath( parentNode, "valor" );
            if (valores.length==1) valorNode = valores[0];
            else return error("AddRecord("+objectClass+") : couldn't create valorNode"); 
        }


        if (valorNode) {
			//generate new valid id (based on old records)
            var new_id =  getNewRecordId( valorNode, objectClassSource );
			var new_order = getNewRecordOrder( valorNode, objectClassSource );
			//create <regitro> node
            var new_record = PlaneaDocument.getXMLDatabase().createElement("registro");
            new_record.setAttribute('clase', objectClassSource);
            new_record.setAttribute('id', new_id );
			 new_record.setAttribute('order', new_order );
			if( popup) {  new_id = new_id+popup; log("AddRecord() > from popup: new_id = ["+new_id+"]"); }
			//clone each field node into new record...
            for( var c=0;c<objectNode.childNodes.length;c++) {
                var fieldNode = objectNode.childNodes[c];
                new_record.appendChild( fieldNode.cloneNode(true) );
            }         
			/*valorNode.appendChild( PlaneaDocument.getXMLDatabase().createTextNode("\n"));*/
            valorNode.appendChild( new_record );
            //log( new_record.textContent );
			
			//We retreive the xmlnode from the db of the record, the preview attribute of the object
            var recNode = valorNode.lastChild;
            var object_preview_template = GetAttribute( objectNode, "preview" );
            var herence = to_herence;

			//then we generate the HTML view of the record
			
			//WARNING: herence parameter is not really used here... we use [objectClass]_records, to know the position
			log("AddRecord() > record created on database, now create the HTML view and register the records in _dbRecords["+new_id+"]");
			//this one creates the _dbRecords[rec_id] too, from the last update node: recNode
            var new_rec_template = getObjectRecordView( herence, recNode, object_preview_template, popup );
			
			//log("AddRecord() > record created, template is: " + new_rec_template );
						
			/**  ADDING TO HTML !!    */
			
			//and update the form where it belongs (this could iterate over all the dbObjects reference of objectClassSource )
            var html_valor = document.getElementById( objectClassRef+"_records" );
			
			if (!html_valor) {
				error("AddRecord() > " + objectClassRef+"_records NOT FOUND!! " );
			} else {
				//log("AddRecord() > html_valor: " + html_valor.innerHTML );
				var tbodyx = evaluateXPath( html_valor, "html:tbody" );
				//log("AddRecord() > tbodyx: " + tbodyx );
				if (tbodyx) tbodyx[0].innerHTML+= "\n" + add_html_namespace( new_rec_template );
			}
            fs.writeFile( normalizePath( fs.getHomeDir() + "/db_new_rec_template.html"), remove_html_namespace( new_rec_template ) );
            fs.writeFile( normalizePath( fs.getHomeDir() + "/db_interface.html"), remove_html_namespace( document.getElementById('container').innerHTML ) );

            PlaneaDocument.save();
			orderRecords(objectClassSource);
            EditRecord( new_id );
			
			if (popup!=undefined && popup!="") {
				log ("AddRecord() > refreshRecords > objectClassSource: " + objectClassSource+" because of ["+new_id+"]" );
				refreshRecords( objectClassSource );
			}
			
			updateReferences( objectClassSource );

        } else return error("AddRecord("+objectClassRef+") : couldn't create valorNode");


    } else alert( objectClassSource +  ' no tiene definición en este XML');

}

/**
*		HideAllOthers( record_id )
*
*			hide all records editable forms (), but not the one's where this "record_id" is contained
*			record_id is generally formatted as: [objectClass]_[number]
*			ex: HideAllOthers( "persona_3" )
*
*/
function HideAllOthers ( record_id ) {

    var record = _dbRecords[ record_id ];
       
    //Hide all record's editors
    for( var rid in _dbRecords ) {
        if (rid!=record_id) {

            //  this record (registro) > (valor) > (campo) > (registro)
            var otherr = _dbRecords[ rid ];
            
            var child_records = evaluateXPath( otherr.node, "campo/valor/registro" )

            if ( child_records.length>0 ) {
                //not hiding when record has descendent records...
            } else {                      
                var ele = document.getElementById( rid + "_fields" );
                if (ele) {
                    ele.style.display = 'none';
                    ele.innerHTML = "";
                }
            }
        }
    }

}

/**
*		EditRecord( record_id )
*
*			Displays the editable form to complete the field's record
*			record_id is a unique id
*
*			record_id = objectClass + "_" + number_id
*			record_id = persona_3847
*/
function EditRecord( record_id ) {

    var record = _dbRecords[ record_id ];
	if ( record==undefined )
		error("EditRecord() > _dbRecords[" + record_id + "] is undefined.");
	
	//esto para la vista tipo Excel ya deberia sacarse...
    //HideAllOthers( record_id );
    var record_class = record.recordClass;
	var dbObject = _dbobjects[record_class];//to check all fields...
	
	/** old one: works with previews and editable form */
	
    var divfields = document.getElementById( record_id + '_fields' );
    if ( record && divfields && divfields.style.display == 'none') {
        if (record.node) {
            var preview_str = _dbobjects[record.recordClass]["preview"];
            var fields_str = getObjectRecordEditView( record.herence, record.node, preview_str );
            divfields.innerHTML = add_html_namespace( fields_str );
        }
    }
	
	/*must focus on the first HTML field input!!!*/
	
	var fields = record["fields"];
	for(var fclass in fields) {
		
		var field = fields[fclass];		
		var field_id = field["field_id"];
		var field_path = field["field_path"];
		
		var dbField = _dbFields[field_path];
		var inputElement = document.getElementById(field_id);
		if (inputElement==undefined) {
			error("EditRecord() > inputElement[" + field_id+ "] is null"  );
		} else {
			inputElement.focus();
			EditField( field_path, field_id );
			log("EditRecord() > focus for record_id ["+record_id+"] in field_class[" + fclass+ "] field_id ["+field_id+"]"  );
			return;
		}
	}
	

	//esto tampoco va en la nueva vista Excel
    //togglediv( record_id + '_fields' );
    fs.writeFile( normalizePath( fs.getHomeDir() + "/db_edit_rec_template.html"), remove_html_namespace( fields_str ) );
	
}

/**
*		DeleteRecord( objectClassRef, record_id, forced )
*
*			Deletes the "record_id" referenced record.
*			
*/
function DeleteRecord( objectClassRef, record_id, forced ) {

	var popup = "";
	var objectClassSource = objectClassRef;
	
	if (objectClassRef.indexOf('_popup')>=0) {
		
		var idx = objectClassRef.indexOf('_popup');
		
		objectClassSource = objectClassRef.substr( 0, idx);
		popup = "_popup";
	}
	
    log( "DeleteRecord() : "+record_id );

    var record = _dbRecords[record_id];

    if (record) {

        var node = record['node'];
        var herence = record['herence'];
        
        if (node) {
            var record_class = GetAttribute( node, "clase" );
            if ( (forced==undefined || forced==false)
				&& confirm( "¿Está seguro que quiere eliminar este registro? \n\n")
/*			
                        + "[CLASE] " + record_class + "\n" 
                        + "[RUTA] " + herence.replace(new RegExp( "::","gi")," / ") + "\n" 
                        + "[ID] " + record_id + "\n" 
                        + "\n" + getObjectRecordPreview( node ).replace(new RegExp("::","gi"), ", " )  )
						*/
                        ) {
						
				//remove from xml database
                node.parentNode.removeChild(node);
				
				//remove from html editor
                var html_node = document.getElementById( record_id );
                html_node.parentNode.removeChild( html_node );

				orderRecords( objectClassRef );
				
				//saveActualDB (xml) to file
				PlaneaDocument.save();
				
				//if (popup!=undefined && popup!="") {
					refreshRecords( objectClassSource );
				//}
				updateReferences( record_class );
            }
        }
    }

}

function SaveActualRecordField( objectClass ) {
	
	var objectClassRef =  objectClass;
	var objectClassSource =  objectClass;
	var popup;
	
	if (objectClassRef.indexOf('_popup')>=0) {
		
		var idx = objectClassRef.indexOf('_popup');
		
		objectClassSource = objectClassRef.substr( 0, idx);
		popup = "_popup";
	}
	
	var object = _dbobjects[ objectClassSource ];

	
    if (object) {
		var actual_edit_field = object["actual_edit_field"];
        log( "SaveActualRecordField() > " + objectClassSource + " actual_edit_field:" + JSON.stringify(actual_edit_field,null,"\t") );
        
		if ( actual_edit_field ) {
			SaveField( actual_edit_field.field_path, actual_edit_field.field_id );
		}
	}
}


/**
*		getRecordValue( record_id, record_field )
*
*			retreive the value of the field named "record_field", from the record identified by "record_id" 
*			
*/
function getRecordValue( record_id, record_field ) {

		var record = _dbRecords[ record_id ];
		var recordNode = record.node;
		
		if (recordNode) {
			for( var c=0;c<recordNode.childNodes.length;c++) {
			
                var fieldNode = recordNode.childNodes[c];  
				var field_class = GetAttribute( fieldNode, "clase" );				
				//new_record.appendChild( fieldNode.cloneNode(true) );
				if (record_field==field_class 
					&& fieldNode.nodeName=="campo") {
					return GetValues( fieldNode );
				}
				
            }			
		
		}
		
}

/**
*		ExecuteRecord( record_id )
*
*			Execute the "record_id" referenced record.
*			
*/
function ExecuteRecord( record_id ) {

    log( "ExecuteRecord() : "+record_id );

    var record = _dbRecords[record_id];

    if (record) {

        var node = record['node'];
        var herence = record['herence'];
        
        if (node) {
            var record_class = GetAttribute( node, "clase" );
			

			
        }
    }

}

function getRecordToJSON( recordNode ) {
	var record = {};
	//log("getRecordToJSON() > recordNode [" + recordNode+"] " + GetAttribute(recordNode,"id")  );
	var rec_id = GetAttribute(recordNode,"id") ;
	for( var c = 0; c < recordNode.childNodes.length; c++ ) {
		var fieldNode = recordNode.childNodes[c];

		if (fieldNode.nodeName=="campo") {/*campos de la ficha Persona*/

			var field_class = GetAttribute( fieldNode, "clase" );
			var field_type = GetAttribute( fieldNode, "tipo" );						
			//var record_field_path = trim(parent_field_path+":"+rec_id+":"+field_class);
			//var record_field_id = rec_id+"_"+field_class;
			record[field_class] = {};
			
			if (field_type.indexOf('multiple')>=0) {
			/*detalles de la ficha Persona > redes+sociales, misareastrabajo, misrelaciones */
				
				//log("getRecordToJSON() > MREG: rec_id:["+ rec_id + "] field_class: [" + field_class+"]" );
				var recordsNode = evaluateXPath( fieldNode, "valor/registro");
				
				for( var reci in recordsNode) {
				
					var recNode = recordsNode[reci];
					var object_id = recNode.getAttribute("id");
					
					record[field_class][object_id] = {};
					record[field_class][object_id] = getRecordToJSON(recNode);
					//log("getRecordToJSON() > MREG: record["+field_class+"]["+object_id+"]");
				}
			
			}
			else if ( field_type == "referencia" ) {
				//log("getRecordToJSON() > campo referencia a clase");
				var referencia_id = GetValues(fieldNode);
				var referencia_clase = GetAttribute( fieldNode, "referencia" );
				var dbObject = _dbobjects[referencia_clase];
				//log("getRecordToJSON() > campo referencia a clase, buscando referencia de objetos clase["+referencia_clase+"] referencia_id["+referencia_id+"]");
				if (dbObject && referencia_id) {
					var parent_node = dbObject['objectNode'].parentNode;
					if (parent_node) {
						var recordrefnode = evaluateXPath( parent_node, "valor/registro[@id='"+referencia_id+"']");
						if (recordrefnode[0]) {
							//log("getRecordToJSON() > campo referenciaa clase, generando preview: getObjectRecordPreview() ["+recordrefnode[0].nodeName+"]");
							var ref_preview = getObjectRecordPreview( recordrefnode[0] );
							record[field_class]["preview"] = ref_preview;
							record[field_class]["value"] = referencia_id;
							record[field_class]["node"] = recordrefnode[0];
							//log("getRecordToJSON() > campo referencia a clase [" + referencia_clase + "] of id ["+referencia_id+"] has value ["+record[field_class][referencia_id] );
						} else error("getRecordToJSON() > " + "valor/registro[@id='"+referencia_id+"'] sin resultados!");
					}
				}
				
			}
			else {
				//log("getRecordToJSON() > campo comun: valor: "+GetValues(fieldNode));
				record[field_class] = GetValues(fieldNode);
			}
		}
	}
	
	//log("getRecordToJSON() > " + JSON.stringify(record,null,"\t")  );
	return record;
}

/**
*	getRecordsToTable() 
*
*/

function getRecordsToJSON( fieldNode /*aka tableNode > multiple field Node*/, table_template ) {

	var tableout = {};
	var records = evaluateXPath( fieldNode, "valor/registro");
	
	if (records.length>=0) {
	
		for( var r in records ) {
		
			var recordNode = records[r];
			var record_id = GetAttribute( recordNode, "id" );
			tableout[record_id] = getRecordToJSON( recordNode );
			
		}
		
	}
	
	return tableout;
}

function showFieldSection( field_path ) {

	markFieldSection( field_path );
	
	var field_data = _dbFields[ field_path ];
	var section_path = field_data[ "section_path" ]
	var dbForm = _dbForms[section_path];
	if (dbForm && !isThisFieldSectionEmpty(field_path)) {
		var formularioN = dbForm["formularioN"];
		var idf = "dbformulario_"+dbForm["formularioN"]+"_";
		showSection( idf );
	}
}

function updateTreeMarkedSections() {
	//iterate over each field...
	for( var field_path in _dbFields) {
		markFieldSection( field_path, true );
	}
}

function loadedImage( image_id ) {

	showdiv(image_id);
	
}

function attachFile( field_path, field_id ) {
	var htmlfieldElement = document.getElementById( field_id );
	performClick(htmlfieldElement);
}

function attachFileToField(field_path, field_id) {

	var htmlfieldElement = document.getElementById( field_id );
	//performClick(htmlfieldElement);
	loadFields("arbol:Anexos");
	//agrega al indice de ANEXOS UN REGISTRO Y SU ARCHIVO....
	log("attachFileToField() > field_path ["+field_path+"] field_id ["+field_id+"]");
	//ALTA EN LA BASE DE ANEXOS....
	
}

function reduceFileName( filename ) {
	if (filename=="" || filename==undefined) return "";
	//
	if (filename && filename.length>15) {
		filename = filename.substr(0,7)+"..."+filename.substr(-7,7);
	} 
	
	return filename;
	
}

function LoadFile( field_path, field_id ) {
	
	var htmlfieldElement = document.getElementById( field_id );
	var field_data = _dbFields[ field_path ];
	var field_class = getFieldClass( field_data.node );
	//
	var selectedFile = htmlfieldElement.files[0];
	
	var oReader = new FileReader();
	oReader.onload = function(e){		 
		// e.target.result contains the DataURL which we will use as a source of the image
		
		log("SaveField( ) > uploading file:" + e.target.result);
		var filelinkElement = document.getElementById(field_id+"_filelink");
		var sResultFileSize = selectedFile.size;
		
		if (filelinkElement) {
			
			filelinkElement.innerHTML = add_html_namespace('<a href="#" class="filelink filelink-'+field_class+'" onclick="javascript:downloadFile( \''+field_path+'\',\''+ field_id+'\');"><u>'
															+reduceFileName( selectedFile.name ) 
															+"</u></a>");
		}
		field_data.node.setAttribute("filename", selectedFile.name );
		SaveField( field_path, field_id, e.target.result);
	};
	log("LoadFile() > uploading!! [" + selectedFile +"] into ["+field_path+"]");
	oReader.readAsDataURL(selectedFile);
	
}


function LoadImageFile( field_path, field_id ) {
	
	var htmlfieldElement = document.getElementById( field_id );
	var field_data = _dbFields[ field_path ];
	
	if (htmlfieldElement) {
		var selectedFile = htmlfieldElement.files[0];
		
		var accept = ["image/png","image/jpg","image/gif","image/bmp","image/xmp"];
		if (accept.indexOf(selectedFile.mediaType)===false) {
			selectedFile = "";
		}
		
		log("LoadImageFile() > trying to load image: [" + selectedFile +"]");
		
		var oReader = new FileReader();
		oReader.onload = function(e){
			
			// e.target.result contains the DataURL which we will use as a source of the image
			var oImage = document.getElementById(field_id+"_img");
			var loadButton = document.getElementById(field_id+"_loadbutton");
			oImage.src = e.target.result;
			oImage.setAttribute("src",e.target.result);
			
			oImage.style.display = 'block';
			oImage.setAttribute("style","display: block;");
			
			
			var sResultFileSize = selectedFile.size;
			if (loadButton)
				activateClass( loadButton, "loadedimage" );
			oImage.onload = function () { // binding onload event
	 
				// we are going to display some custom image information here
				
				
				//document.getElementById('fileinfo').style.display = 'block';
				//document.getElementById('filename').innerHTML = 'Name: ' + oFile.name;
				//document.getElementById('filesize').innerHTML = 'Size: ' + sResultFileSize;
				//document.getElementById('filetype').innerHTML = 'Type: ' + oFile.type;
				//document.getElementById('filedim').innerHTML = 'Dimension: ' + oImage.naturalWidth + ' x ' + oImage.naturalHeight;
				//_nuevo_valor = _nuevo_valor.name;
				//_nuevo_valor = e.target.result;
				SaveField( field_path, field_id, e.target.result);
				
			};
		};
		
		if (selectedFile && selectedFile!="") { 
				log("LoadImageFile > uploading image!! [" + selectedFile+"]");
				oReader.readAsDataURL(selectedFile);
				return;
		}
	} else error("LoadImageFile() > no ["+field_id+"]");
}


function ValidateField( field_path, field_id  ) {
	var field_data = _dbFields[ field_path ];
	if (field_data && field_data.record_id) {
		return executeRecordValidator( field_data.record_id, field_path, field_id  );
	} else {
		return executeFieldValidator( field_path, field_id );
	}
}


function executeFieldValidator( field_path, field_id ) {
	log("executeFieldValidator() > field_path [" + field_path+"] field_id ["+field_id+"]");
	var field_data = _dbFields[ field_path ];
	if (field_data.validator) {
		log("executeFieldValidator() > [" + field_data.validator+"]");
		return field_data.validator( field_path, field_id );
	}
	return true;
}

function executeRecordValidator( record_id, field_path, field_id ) {
	var field_data = _dbFields[ field_path ];
	//var record_data = _dbRecords[record_id];
	if ( field_data.validator ) {
		return field_data.validator( record_id, field_path, field_id );
	}
	return true;
}


function sectionIsEmpty( section_path ) {

	//check every single field node inside if they are empty:
	//		fields or tables
	//
	var branch = _dbTreeBranches[ section_path ];
	var isEmpty = true;	
	var branchNode;
	
	//log("sectionIsEmpty() > check for ["+section_path+"] _dbTreeBranches > " + JSON.stringify(branch,null,"\t") );
	
	if (branch) {
		/*leaves of this branch*/
		for( var node_path in branch["leaves"] ) {
			if (isEmpty) isEmpty = fieldIsEmpty( node_path );
		}
		/*branches of this branch*/
		for( var node_path in branch["branches"] ) {
			if (isEmpty) isEmpty = sectionIsEmpty( node_path );
		}
	} else {
		//error("sectionIsEmpty() > no branch exist for ["+section_path+"]");
	}
	//log("sectionIsEmpty() > check for ["+section_path+"] empty = ["+isEmpty+"]");
	return isEmpty;
}

function recordIsEmpty( recNode ) {
	var record_id = GetAttribute(recNode, "id");
	var dbRecord = _dbRecords[record_id];
	var isEmpty = true;
	//log("recordIsEmpty() > check for ["+record_id+"]");
	if (!dbRecord) {
		error("recordIsEmpty() > dbRecord UNDEFINED > record_id: [" + record_id +"]" );
	} else {
		var recordFields = dbRecord["fields"];	
		if (recordFields) {
			for( var field_class in recordFields) {
				var field_data = recordFields[field_class];
				var field_path = field_data.field_path;
				if (isEmpty) isEmpty = fieldIsEmpty( field_path );
			}
		} else {
			error("recordIsEmpty() > no fields registered in _dbRecords for record [" + record_id +"]" );
		}
	}
	//log("recordIsEmpty() > check for ["+record_id+"] empty ["+isEmpty+"]");
	return isEmpty;
}


function sectionHasNoFocus( section_path ) {
	//log(document.activeElement.outerHTML);
	return false;
}

function fieldIsEmpty( field_path ) {

	//check every single
	var dbField = _dbFields[ field_path ];
	//log("fieldIsEmpty() > check for ["+field_path+"]");
	if (dbField==undefined) {
		//error("fieldIsEmpty() > dbField unregistered for [" + field_path+"]" );
		return true;
	}
	
	var fieldNode = dbField.node;
	var isEmpty = true;
	
	if (fieldNode) {
		if (dbField.field_type.indexOf("multiple")>=0) {
			var records = evaluateXPath( fieldNode, "valor/registro"  );
			if ( records.length > 0 ) {
				isEmpty = false;
				/*
				for(var rec in records) {
					var recNode = records[rec];
					if (isEmpty) isEmpty = recordIsEmpty( recNode );
				}
				*/
			} else {
				isEmpty = true;
			}
		} else {
			var values = GetValues( fieldNode );
			isEmpty = (values=="" || values==undefined);
		}
	}
	//log("fieldIsEmpty() > check for ["+field_path+"] empty = ["+isEmpty+"]");
	return isEmpty;
	
}

function isThisFieldSectionEmpty( field_path ) {

	var section_path = getThisFieldSection( field_path );
	//log ("isThisFieldSectionEmpty() > field_path ["+field_path+"] section_path["+section_path+"]");
	var isEmpty = sectionIsEmpty( section_path );
	//log ("isThisFieldSectionEmpty() > field_path ["+field_path+"] section_path["+section_path+"] empty = " + isEmpty ) ;
	return isEmpty;
/*
	var fieldNode = field_data.node;
	//we have to check the full section (iterative?)
	//for now we only check this field...
	var values = GetValues(fieldNode);
	return (values=="" || values==undefined);
*/
}



function StopEditRecord( record_id ) {
	log("StopEditRecord() > record_id ["+record_id+"]");
}

/**
*	StopEditField( field_path, field_id )
*		
*		de-activate class editing, call a field function validator (or record validator)
*		hide section, or field if SECTION is all empty
*/
function StopEditField( field_path, field_id ) {

	log("StopEditField() > field_path [" + field_path + "] field_id ["+ field_id +"]");
	var htmlFieldElement = document.getElementById(field_id);
	var fieldchecked = false;
	if (htmlFieldElement.nodeName=="editor") {
		//
	} else {
		//validate field before we leave
		fieldchecked = ValidateField( field_path, field_id );	
		if (!fieldchecked) {
			error("StopEditField() > CANNOT VALIDATE FIELD! ["+field_path+"]");
			htmlFieldElement.focus();
			return;
		}
	}
	
	if (htmlFieldElement)	
		//deactivate field editing
		deactivateClass( htmlFieldElement, "editing"  );
	else
		return error("StopEditField() > no htmlFieldElement for field_id[" + field_id + "]");
		
	var section_path = getThisFieldSection( field_path );
	
	//deactivate record editing
	var field_data = _dbFields[ field_path ];
	var record_id = field_data["record_id"];
	if (record_id) {
		var recordElement = document.getElementById(record_id);
		if (recordElement) 
			deactivateClass( recordElement, "editing"  );
			
		//delete record if empty!!
		var dbRecord = _dbRecords[record_id];
		if (dbRecord) {
			if (recordIsEmpty(dbRecord.node) && sectionHasNoFocus(section_path) ) {
				DeleteRecord( dbRecord.recordClass , record_id, false );
			}
		}
	}
	
	//hide full section if empty
	if ( isThisFieldSectionEmpty( field_path) ) {
		
		log("StopEditField() > hiding section ["+section_path+"]of field ["+field_path+"] ");
		var dbForm = _dbForms[ section_path ];
		if (dbForm) hideSection( "dbformulario_"+dbForm["formularioN"]+"_" );
	}
}

function cancelField( field_path, field_id ) {

	var field_data = _dbFields[ field_path ];
	var field_node = field_data.node;
	var field_values = GetValues(field_node);
	
	if ( 	field_values != "" 
			&&
			field_values != undefined ) {
		//[][]
		if (confirm('¿Quiere eliminar este campo y descartar el texto ingresado?') ) {
			//[][]
			SaveField( field_path, field_id, "" );
			StopEditField( field_path, field_id );
		}
		
	} else {
		SaveField( field_path, field_id, "" );
		StopEditField( field_path, field_id );
	}
	
}

/**
* Edit Field
*	Change the state of the field to editing... so style can be applied when editing...
*   show Help texts. SHows hint over the title, and shows complete help with examples on the floating Help Window...
*/
function EditField( field_path, field_id ) {
	
	var dbField = _dbFields[field_path];
	
	log("EditField() > field_path >  "+field_path);
	if (field_path.indexOf("cantidadproyectada")>=0) {
		showProyectada(field_path, field_id);
	} 
	
	if ( dbField ) {
		
		field_type = dbField["field_type"];
		if (field_type.indexOf("parrafo")>=0) {
		
			var eleditor = document.getElementById(field_id);
			if (eleditor) {
				var eldoc = eleditor.contentDocument;
				
				eleditor.contentDocument.onblur = function(e) {
					/*alert("myblur");*/
					setTimeout( function() {
						SaveField( field_path, field_id );
						StopEditField( field_path, field_id );
					}, 700 );//wait 700 ms, just for TOOLS execommand like (bold,underline,justify)
				};
				eleditor.contentDocument.onfocus = function(e) {
					/*alert("myblur");*/
					EditField( field_path, field_id );
				};
				
				var eldocel = eldoc.documentElement;
				var head = eldoc.getElementsByTagName("head");
				var head_styles = eldoc.getElementsByTagName("style");
				if (head_styles && head_styles[0]) {
					log("EditField() > tiene estilo! " + head_styles[0].innerHTML );
				} else {
					log("EditField() > no tiene estilo lo agregamos");					

					var mcss = "* { font-family: Arial; color: #555; }";

					if ( head && head[0] ) {
						var hstyle = eldoc.createElement("style");
						hstyle.type = 'text/css';
						
						if (hstyle.styleSheet){
						  hstyle.styleSheet.cssText = mcss;
						} else {
						  hstyle.appendChild(eldoc.createTextNode(mcss));
						}
						
						head[0].appendChild(hstyle);
					}
				}
				var body = eldoc.getElementsByTagName("body")[0];
				body.setAttribute("spellcheck","false");
				body.setAttribute("lang","es");
			}
		}
		
	}
	
	OpenHelp(field_path);
	ShowHint(field_id);
	
	var htmlFieldElement = document.getElementById(field_id);
	var field_data = _dbFields[ field_path ];
	//if (field_data.node)
	var record_id = field_data["record_id"];
	if (record_id) {
		var dbR = _dbRecords[record_id];
		if (dbR) {
			var oc = dbR.recordClass;
			log("EditField()  > actual_edit_field for oc:"+oc);
			var dbO = _dbobjects[oc];
			if (dbO) dbO["actual_edit_field"] = { "field_path":field_path, "field_id":field_id };
			log("EditField()  > actual_edit_field > ok in obj:" + JSON.stringify( dbR, null, "\t" ) );
		}
		var recordElement = document.getElementById(record_id);
		if (recordElement) 
			activateClass( recordElement, "editing"  );
	}
	if (htmlFieldElement)
		activateClass( htmlFieldElement, "editing"  );

}

/**
*		SaveField( field_path, field_id )
*
*			Saves the field referenced by "field_id" in the HTML and by
*			"field_path" for the Fields data object, the field data object: 
*					_dbFields[field_path] => 
*					{ 
						node, 
						path, 
						record_id, 
						class 
					}
*
*			field_path and data.path must be equals...
*
*/
function SaveField( field_path, field_id, valueforce ) {

	log( "SaveField() : field_path [" + field_path + "] field_id [" + field_id +"]" );
	
    var htmlfieldElement = document.getElementById( field_id );
	var fieldchecked = false;
	
	if (htmlfieldElement && htmlfieldElement.nodeName=="editor") {
	
		htmlfieldElement = htmlfieldElement.contentDocument.getElementsByTagName("body")[0];
		//valueforce = htmlfieldElement.innerHTML;
		//log("SaveField() > from editor > "+ valueforce);
	} else {	
		fieldchecked = ValidateField( field_path, field_id );
		if (!fieldchecked) {
			error("StopEditField() > CANNOT VALIDATE FIELD! ["+field_path+"]");
			htmlFieldElement.focus();
			return;
		}
	}
	
    var field_data = _dbFields[ field_path ];
	//log( " SaveField() _dbFields["+ field_path+" ]: " + getStructure( field_data ) );
	//log( " SaveField() > _dbFields[" + field_path+"]  > validator: " + _dbFields[ field_path ].validator  );
	
    var xmlNode = field_data.node;
    var herence = field_data.path;
    var rec_id = field_data["record_id"];//its a field from a record!
    var rec_field_class = field_data["class"];//the record class that this field is a member
	var popup = field_data["popup"];
	var field_type = getFieldType( xmlNode );
	
	log("SaveField() > is it record id from popup? : > " + JSON.stringify( field_data, null, "\t" ) );
	
    if (herence!=field_path) {
        error("error: SaveField(): herence!=field_path > "+herence+"!="+field_path);
        return;
    }

    var _nuevo_valor = undefined;
    if (valueforce!=undefined) { 
		_nuevo_valor = valueforce; 
		log( "SaveField() > field_path ["+field_path+"] forcing value > ["+valueforce+"]");
	}
    //assign new value
    // and set title to the brief project view    
    if ( htmlfieldElement ) {
	
		_nuevo_valor = GetValuesInput( field_path, 
										_nuevo_valor,
										true /*set html inner fields, HACK needed to preserve values using innerHTML setting mode.*/ );
	
	} 
    
	
	if (_nuevo_valor==undefined)
    	return error("SaveField() > document.getElementById("+field_id+") = " + htmlfieldElement );
					
    //Now really try to save the value in the XML
    // overwrite <valor>...</valor> node value
    var saved = false;
    for(var i=0;i<xmlNode.childNodes.length;i++) {
        var childNode = xmlNode.childNodes[i];
		
        if (childNode.nodeName=='valor') {
            if (childNode.childNodes[0] && childNode.childNodes[0].nodeType==3) {//TEXT_NODE
				//log("SaveField()  really saving in text node : "+_nuevo_valor);
				//must use CData now!!!
				childNode.
                childNode.childNodes[0].nodeValue = _nuevo_valor;
                saved = true;
			} else if (childNode.childNodes[0] && childNode.childNodes[0].nodeType==4) {//CDATA_SECTION_NODE
				//log("SaveField()  really saving in CData section node : "+_nuevo_valor);
				childNode.childNodes[0].nodeValue = _nuevo_valor;
                saved = true;
            } else { //CREATE CDATA_SECTION_NODE
				//log("SaveField()  really saving, creating CData section node : "+_nuevo_valor);
				var txt_valor =  PlaneaDocument.getXMLDatabase().createCDATASection(_nuevo_valor);
                /*
				var txt_valor =  PlaneaDocument.getXMLDatabase().createTextNode(_nuevo_valor);
                */
				childNode.appendChild( txt_valor );
				saved = true;
            }   
        }
    }

    //need to create <valor> node...
    if (!saved) {
		//log("SaveField()  need to create <value></value> or <valor></valor> for ["+_nuevo_valor+"]");
		var ele_valor = PlaneaDocument.getXMLDatabase().createElement("valor");
		//var txt_valor =  PlaneaDocument.getXMLDatabase().createTextNode(_nuevo_valor);
		var txt_valor =  PlaneaDocument.getXMLDatabase().createCDATASection(_nuevo_valor);
		ele_valor.appendChild( txt_valor );
		xmlNode.appendChild( ele_valor );
        saved = true;
    }

	markFieldSection(field_path);
	PlaneaDocument.save();
	
    //For records: updates the preview values too!!! 
    if (rec_id && rec_field_class) {
        //processPreview();
        var recordNode = _dbRecords[rec_id].node;
        var recordClass = _dbRecords[rec_id].recordClass;
		
		updateReferences( recordClass );
		updateFormulas( xmlNode, recordNode, recordClass );
		updateSums( xmlNode, recordNode, recordClass );
		
		if (popup!=undefined && popup!="") {
			//refreshing the source table tooo...
			log ("SaveField() > refreshRecords FROM a popup!! > recordClass: " + recordClass+" because of ["+rec_id+"]" );
			refreshRecords( recordClass );
		}
		
		updateSectionFormulas( xmlNode, recordNode, recordClass );
		/* WE DONT USE THIS IN XXXX: we must use it for optimization!*/
		/*
        preview_field_id = 'rec_'+rec_id+'_field_'+rec_field_class;

        log("SaveFields() for records: preview_field_id: " + preview_field_id );

        var el = document.getElementById( preview_field_id );

        if (el) el.innerHTML = add_html_namespace( getObjectRecordPreviewField( recordNode, rec_field_class, popup) );

        //and now update all preview fields that references to this object
		log("SaveField() for records: checking objects references for recordClass:" + recordClass +" popup:" + popup+ " recid:" + rec_id);
		if (popup) {
			recordClass = recordClass.substr(0,recordClass.indexOf(popup));
			log("SaveField() for records: recordClass:"+recordClass);
		}
        var references = _dbobjects[ recordClass ]["references"];
        
        for (ref in references) {
            var prev_ref = document.getElementById(ref);
            
            if ( prev_ref ) {
                prev_ref.innerHTML = add_html_namespace( getObjectRecordPreviewField( recordNode, rec_field_class, popup) );
            }

        }
		*/

    }
	

	//updateSectionFormulas( getThisFieldSection( field_path ) );
    
}






/*
function getRecordPath( object_path, record_id ) {
	return  object_path+":"+record_id;
}*/









function getRecordFieldPath( object_path, record_id, field_class ) {
	return  object_path+":"+record_id+":"+field_class;
}

function updateFormulas( fieldnode, recordnode, recordclass ) {

	//check if this special field (fieldnode)[clase] is related to any formulas in _dbobjects[recordclass]["formulas"]
	var field_class = getFieldClass(fieldnode);
	var record_id = GetAttribute(recordnode,"id");
	var formulas = _dbobjects[recordclass]["formulas"];
	var objectclass = recordclass;
	var objectPath = _dbobjects[recordclass]["objectPath"];
	
	if (recordclass.indexOf("_RF")>0) {
		//check it this recordClass is a reference of another source Object
		log("updateFormulas() > ["+recordclass+"] is a reference of "+_dbobjects[recordclass]["objectClass"]);
		objectclass = _dbobjects[recordclass]["objectClass"];
		objectPath =  _dbobjects[recordclass]["objectPath"];
		formulas = _dbobjects[objectclass]["formulas"];
	}
	
	
	log("updateFormulas() > recordclass["+recordclass+"] objectclass["+objectclass+"] objectPath["+objectPath+"] recordnode["+record_id+"] field_class["+field_class+"]");
	if (formulas) {
		var founded = false;
		log("updateFormulas() > checking formulas if this field belong to some registered formulas functions...");
		for(var id in formulas) {
			var oFormula = formulas[id];
			if (oFormula.ffunction) {
				if (oFormula.ffunction.indexOf(field_class)>=0) {
					founded = true;
					log("updateFormulas() > Yes it did!! processRecordFormula!! update parameter values, calculate formula function ["+oFormula.ffunction+"]");
					var result = processRecordFormula( recordnode, oFormula );
					if (result===false) {
						//ok formula is from a section field....
						//check mark to process later:
						log("updateFormulas() > marked to process later ? ["+oFormula["processlater"]+"]");
					} else if (!isNaN(result)) {
					
						var field_path = getRecordFieldPath( objectPath, record_id, oFormula.target_field_class );
						//log("updateFormulas() > field_path ["+field_path+"]");
						
						dbField = _dbFields[ field_path ];
						
						//log("updateFormulas() > dbField ["+JSON.stringify(dbField) +"]");
						
						document.getElementById(prefield_id+dbField.field_id).value = result;
						//document.getElementById("input_"+dbField.field_id).setAttribute("value",result);
						SaveField( field_path, prefield_id+dbField.field_id );
					} else error("updateFormulas() > isNaN !! result["+result+"]");
				}
			}
		}
		//if (founded==false) log("updateFormulas() > No it doenst field_class["+field_class+"] => "+JSON.stringify( oFormula.ffunction,nu ));
	}
}

function updateSums( fieldnode, recordnode, recordclass ) {

	var field_class = getFieldClass(fieldnode);
	var record_id = GetAttribute(recordnode,"id");
	var sums = _dbobjects[recordclass]["sums"];
	var objectclass = recordclass;
	var objectPath = _dbobjects[recordclass]["objectPath"];
	
	if (recordclass.indexOf("_RF")>0) {
	
		//check it this recordClass is a reference of another source Object
		log("updateSums() > ["+recordclass+"] is a reference of "+_dbobjects[recordclass]["objectClass"]);
		objectclass = _dbobjects[recordclass]["objectClass"];
		objectPath =  _dbobjects[recordclass]["objectPath"];
		//sums = _dbobjects[objectclass]["sums"];
		
	}	
	
	if (sums) {
		var founded = false;
		//log("updateSums() > check if this field class has to be sumarized... field_class["+field_class+"] sums["+sums.length+"]");
		for(var id in sums) {
		
			var objSum = sums[id];
			
			if (objSum.target_field_class==field_class) {
				
				log("updateSums() > Yes it did!! SUM this column!! ["+field_class+"]");
				founded = true;
				var result = processSums( recordnode, objSum );
				
				if (!isNaN(result)) {
					//objSum["total"] = result;
					//_dbobjects[objectclass]["sums"] = objSum;
					var total_field_id = getTotalFieldId( recordclass, fieldnode );		
					
					log("updateSums() > Saving the result in DOM Element id ["+total_field_id+"] => "+result);
					objSum["result"] = result;
					
					//recordclass is object_class_ref
					_dbobjects[recordclass]["sums"][id] = objSum;
					
					if (document.getElementById( total_field_id )) 
						document.getElementById( total_field_id ).innerHTML = '<html:span>'+result+'</html:span>';
				/*
					var field_path = getRecordFieldPath( objectPath, record_id, oFormula.target_field_class );
					log("updateFormulas() > field_path ["+field_path+"]");
					
					dbField = _dbFields[ field_path ];
					
					log("updateFormulas() > dbField ["+JSON.stringify(dbField) +"]");
					
					document.getElementById("input_"+dbField.field_id).value = result;
					//document.getElementById("input_"+dbField.field_id).setAttribute("value",result);
					SaveField( field_path, "input_"+dbField.field_id );
				*/	
				} else error("updateSums() > isNaN !! result["+result+"]");
				
			}
		}
		if (!founded) log("updateSums() > No it doesnt ["+field_class+"]");
	}
		
}

function processSums( recordnode, objSum ) {
	
	var object_path = objSum.object_path;
	var target_field_class = objSum.target_field_class;
	
	//log("processSums() > sum for object_path ["+object_path+"] and column ["+target_field_class+"]");
	
	var records = evaluateXPath( recordnode.parentNode, "registro" );
	var total = 0;
	for( var r in records) {
		var recNode = records[r];
		var record_id = GetAttribute(recNode, "id");
		//log("processSums() > adding record ["+record_id+"]");
		var fields = evaluateXPath( recNode, "campo[@clase ='"+target_field_class+"']" );
		for( var f in fields) {
			var fieldNode = fields[f];
			//log("processSums() > adding record ["+record_id+"] column["+target_field_class+"] sum+="+total);
			var val = parseFloat( GetValues(fieldNode) );
			if (!isNaN(val)){
				total+= val;
			}
			
			
		}		
	}
	return total;
}

function processRecordFormula( recordnode, oFormula ) {
	
	var ffunction = oFormula.ffunction;
	var object_path = oFormula.object_path;
	var record_id = GetAttribute( recordnode, "id" );
	var is_a_call_from_a_section_field = oFormula["target_section_field_path"];
	
	log("processRecordFormula() > FOR record["+record_id+"] => " + JSON.stringify( oFormula, null, "\t" ) );
	//var recordrefnode = evaluateXPath( parent_node, "valor/registro[@id ='"+referencia_id+"']");
	
	if (is_a_call_from_a_section_field!="" && is_a_call_from_a_section_field!=undefined) {
	
		log("processRecordFormula() > do not process now, do it later, after updateSums [is_a_call_from_a_section_field] => [" + is_a_call_from_a_section_field+"]");
		
		oFormula["processlater"] = true;
		
		return false;
	}
	
	var parameters = evaluateXPath( recordnode, "campo" );
	
	var sorting = [];
	for( var pp in parameters ) {
		//====((()))====>>>[[[ bbbbb-ccccc-ddddd ]]]		
		sorting.push(pp);
	}
	sorting.sort();
	sorting.reverse();
	
	for( var i in sorting) {
		pp = sorting[i];
		var parameterNode = parameters[pp];
		var paramClass = getFieldClass(parameterNode);
		var paramType = getFieldType(parameterNode);
		//log("processRecordFormula() > paramClass["+paramClass+"] paramType["+paramType+"]");
		
		//if ( numberTypes.indexOf(paramType)>=0) {
			log("processRecordFormula() > paramClass["+paramClass+"] paramType["+paramType+"]");
			
			var paramValue = GetValues(parameterNode);
			
			if (paramType=="referencia") {
				var refclase = GetAttribute(parameterNode, "referenciaclase");
				if (refclase!=undefined) {
					log("processRecordFormula() > refclase["+refclase+"] => record_id ["+paramValue+"]");
					var refRec = _dbRecords[ paramValue ];
					if (refRec) {
						log("processRecordFormula() > record_id["+paramValue+"] => "+JSON.stringify(refRec,null,"\t") );
						var recObj = getRecordToJSON( refRec['node'] );
						log("processRecordFormula() > recObj " + JSON.stringify( recObj, null, "\t") );
						paramValue = parseInt(recObj[refclase]);
						log("processRecordFormula() > record:["+refclase+"] = ["+paramValue+"]");
					}
				}
			}
			
			if (paramValue=="" || paramValue==undefined) {
			
				paramValue = 0;
				
			} else if (isNaN(paramValue)) {
			//error("processRecordFormula() > paramValue from paramClass["+paramClass+"] of record ["+record_id+"] is NaN. ["+paramValue+"], setting to zero and continue.");
			//paramValue = 0;
				paramValue = "'"+paramValue+"'";
			}
			var re = new RegExp( paramClass,"gi");
			ffunction = ffunction.replace( re, paramValue);
			log("processRecordFormula() > ffunction ["+ffunction+"]");
		//}
		
	}
	
	var result = 0;
	
	eval( " result="+ffunction+";"  );
	
	log("processRecordFormula() > result of ["+ffunction+"] is ["+result+"]");

	return result;
}

/**
*
*	updateSectionFormulas()
*		
*/
function updateSectionFormulas( fieldnode, recordnode, recordclass ) {

	var formulas = _dbobjects[recordclass]["formulas"];
	var objectclass = recordclass;
	var objectPath = _dbobjects[recordclass]["objectPath"];
	
	if (recordclass.indexOf("_RF")>0) {
		//check it this recordClass is a reference of another source Object
		log("updateFormulas() > ["+recordclass+"] is a reference of "+_dbobjects[recordclass]["objectClass"]);
		objectclass = _dbobjects[recordclass]["objectClass"];
		objectPath =  _dbobjects[recordclass]["objectPath"];
		formulas = _dbobjects[objectclass]["formulas"];
	}

	if (formulas) {
	
		var founded = false;
		log("updateSectionFormulas() > checking formulas if this field belong to some registered formulas functions...");
		
		for(var id in formulas) {
		
			var oFormula = formulas[id];
			var is_a_call_from_a_section_field = oFormula["target_section_field_path"];
			var processlater = oFormula["processlater"];
			
			if (processlater && is_a_call_from_a_section_field) {
			
				var field_formulas = _dbFields[is_a_call_from_a_section_field]["formulas"];
				
				for( var k in field_formulas ) {
					var objForm = field_formulas[k];
					processFieldFormula( is_a_call_from_a_section_field, objForm );
				}
				
			}

		}
	}
	
	
	
	
	
	//var formulas = _dbFields[target_field_path]["formulas"];
	
	//re parse the formula... > calculate each member:
	//	{[arbol:Recursos:Ingresos:Ingreso generacion propia]:ingresoestimado}
	
	// _dbFields["arbol:Recursos:Ingresos:Ingreso generacion propia"] =>objectClass 
	// _dbobjects[objectClass]["sums"]["ingresoestimado"] => ["result"] => ??? => updateSums( fieldnode, recordnode, recordclass )
	
	//
	// target_field_class
	//
	//   en _dbobjects[record_class]
	//
	//
	/*
	for( var i in formulas ) {
		
		var objForm = formulas[i];
		processFieldFormula( target_field_path, objForm );
	}
	*/
	
}


function SubtotalDinerario() {
	return 0;
}

function SubtotalNoDinerario() {
	return 0;
}

function SubtotalDinerarioNoDinerario() {
	return 0;
}

function processFieldFormula( target_field_path, objFormula ) {

	var dbField = _dbFields[target_field_path];
	var target_field_id = dbField["field_id"];	
	var formulafunction = objFormula["ffunction"];
	
	log("processFieldFormula() > formulafunction ["+formulafunction+"] objFormula >> " + JSON.stringify( objFormula, null, "\t" ) );
	
		
	for( var param_variable in objFormula["parameters"] ) {

		var paramForm = objFormula["parameters"][param_variable];
		
		var o_path = paramForm["object_path"];
		var o_class = paramForm["object_class"];
		var o_class_ref = paramForm["object_class_ref"];
		var	sum_field_class = paramForm["target_field_class"];
		
		var sum_value = _dbobjects[o_class]["sums"][sum_field_class]["result"];
		
		if (	_dbobjects[o_class_ref] 
			&& _dbobjects[o_class_ref]["sums"]
			&& _dbobjects[o_class_ref]["sums"][sum_field_class])
			sum_value = _dbobjects[o_class_ref]["sums"][sum_field_class]["result"];
		
		
		log("processFieldFormula() > param_variable ["+param_variable+"] => o_class["+o_class+"] o_class_ref["+o_class_ref+"] sum_field_class ["+sum_field_class+"] sum_value ["+sum_value+"]");
		
		formulafunction = formulafunction.replace( param_variable , sum_value );

	}
	
	log("processFieldFormula() > formulafunction PROCESSED ["+formulafunction+"]");
	
	//try {
		var result = 0;
		eval( " result = "+formulafunction+";"  );
		if (result!=undefined) {
			
			if (target_field_id!=undefined) {
				//document.getElementById(target_field_id).innerHTML = result;
				log("processFieldFormula() > setting target_field_id["+target_field_id+"] with result  ["+result+"]");
				var ele = document.getElementById(target_field_id);
				if (ele)
					ele.value = result;
			} else {
				error("processFieldFormula() > target_field_id ["+target_field_id+"] "+JSON.stringify( dbField, null, "\t") );
			}
		} else {
			if (target_field_id!=undefined) {
				//var ele = document.getElementById(target_field_id);/*.innerHTML = "NO RESULT";*/
				error("processFieldFormula() > function return undefined! ["+result+"]");
			} else {
				error("processFieldFormula() > target_field_id ["+target_field_id+"] "+JSON.stringify( dbField, null, "\t") );
			}
		}
	//} catch(e) {
		return result;
	//}
}

function PopupRelational( field_path, field_id ) {

	log( "PopupRelational() for Field: field_path: " + field_path + " field_id: " + field_id );

    var dfield = document.getElementById( field_id );
    var field_data = _dbFields[ field_path ];
	
	
	if ( field_path.indexOf( ":seleccionarresponsable" ) >= 0
		|| field_path.indexOf( ":responsable" ) >= 0
			) {
		return loadFields( "arbol:Planificación:Participantes:Integrantes" );
	}
	
	
	if ( field_path.indexOf( ":actividadasociada" ) >= 0
	||  ( field_path.indexOf( ":actividad" ) >= 0 && field_path.indexOf( ":actividad_" )==false)	) {
		return loadFields( "arbol:Planificación:Actividades" );
	}
	
    var xmlNode = field_data.node;
    var herence = field_data.path;
    var rec_id = field_data.record_id;
    var rec_field_class = field_data.class;
	
	var objectClass	= GetAttribute( xmlNode, "referencia" );
	if (objectClass==undefined) {
		error( " PopupRelational() no attribute referencia in " + field_path);
		error( " PopupRelational() node: " + getAttributes( xmlNode ) );
		error( " PopupRelational() _dbFields["+ field_path+"] => "+ getStructure(field_data) );
	}
	//ok vemos que el dbObject existe
	dbObject = _dbobjects[ objectClass ];
	
	
	if ( dbObject==undefined)
		error("PopupRelational() > Object not found for objectClass [" + objectClass +"]" );

	
	//ahora vamos a generar un popup con un getTemplateRelational asociado a ese objeto (pero sera una referencia duplicada )
	
	var objectNode	= dbObject[ 'objectNode' ];
	var parentNode	= dbObject[ 'parentNode' ];
	var objectPreview  = dbObject[ 'preview' ];
	var objectPath = dbObject['objectPath'];
	
	//var records 	= evaluateXPath( objectNode.parentNode, "valor" );

	
	//el parent node contiene la ficha...
	//var popuptemplate = getFieldTemplate( parentNode, objectPath );
	//popuptemplate = completeFieldTemplate( popuptemplate, parentNode, objectPath, getFieldName(parentNode), "popup1" );
	var template = assignFieldBaseTemplate(parentNode);
	var popuptemplate = getFieldTemplateMultiple( template, parentNode, objectPath, field_id, "_popup" );
	popuptemplate = completeFieldTemplate( popuptemplate, parentNode, objectPath, getFieldName(parentNode));
	popuptemplate = add_html_namespace(  '<div class="popup_container">'+popuptemplate + '<div class="close_popup" onclick="javascript:FocusOut(); setTimeout(function() { ClosePopupRelational();}, 500 );"> </div> </div>' );
	
	fs.writeFile( normalizePath( fs.getHomeDir() + "/db_popup_relational.html"), remove_html_namespace( popuptemplate ) );
	fs.writeFile( normalizePath( fs.getHomeDir() + "/db_popup_relational_xul.html"),  popuptemplate );
	
	document.getElementById("popuprelational").innerHTML = popuptemplate;
		
	showdiv('popuprelational');
	
}


function ClosePopupRelational() {
	/*document.getElementById("popuprelational").innerHTML = ' ';*/
	hidediv('popuprelational');
}

/**
*	SelectField
*
*	object is the <input type="checkbox"> relative to section or field (categoria/seccion/campo)
* field path is of the field of type "arbolseleccion" (tree selection).
*/
function SelectField( iobject, field_path, field_id ) {
	
	
	var idinput = iobject.getAttribute("id");
	//alert(object.getAttribute("id") + " pathcampo: " + pathcampo );
	//el path campo es de la forma: 
	//  arbol:Informes y Reportes:Informes:informe_0:seleccion
	var paths = field_path.split(":");
	var id_record = paths[paths.length - 2];


	
	//select or unselect all childs!!! <li><input> ...
					
	var inp = document.getElementById(idinput);
	log( "SelectField() > idinput: " + idinput );
	var section = inp.parentNode;
	log( "SelectField() > section: " + section );
	
	if (section) {
		iterSelect( section, iobject.checked );					
	}
	
	//once all checked or unchecked...
	//try to save field...
	
	//recorrer todos los inputs...
	var HTMLArbol = document.getElementById( "arbolseleccion_"+ field_id );
	//log(HTMLArbol);

	var selection_values = "";	
	var childsInputs = evaluateXPath( HTMLArbol, ".//html:input[@type='checkbox']" );
	for( var i=0; i<childsInputs.length; i++) {
				var inputN = childsInputs[i];
				var field_ref = inputN.getAttribute('pathsel');
				//log ("pathsel:"+pathsel);
				selection_values+= field_ref+"={"+inputN.checked +"}"+"\n";
		}
	
	log("SelectField() > " + selection_values );
	document.getElementById(field_id+"_valores").innerHTML = selection_values;	
	
	SaveField( field_path, field_id, selection_values );
	//log("saving field_id:" + field_id);
			
    
}


function iterSelect( HTMLLiNode, boolval ) {

					var childs_li = evaluateXPath( HTMLLiNode, "html:ul/html:li" );
					
					for( c in childs_li ) {
						
							var liNode = childs_li[c];
							
							log("iterSelect() : liNode:" + liNode.nodeName +" id:" + liNode.getAttribute("id"))							
							var li_inputs = evaluateXPath( liNode, "html:input" );							
							var	li_input = li_inputs[0];							
							if (li_input) li_input.checked = boolval;
								
							iterSelect( liNode, boolval ); 												
					}	
					
					return;
	
}

function isFromRecord( field_path ) {
	
	var dbField = _dbFields[field_path];
	if (dbField) 
		return (dbField.record_id && dbField.record_id!="");
	else
		return false;
}

function getParentObjectFieldPath( field_path ) {
	var dbField = _dbFields[field_path];
	var record_id = dbField.record_id;
	var dbRecord = _dbRecords[record_id];	
	var recordPath = dbRecord.recordPath; //herence
	return recordPath;
}

function markFieldSection( field_path, load_fields ) {
	
	//log("markFieldSection() > field_path: " + field_path );
	
	var section_path = getThisFieldSection( field_path );

	//log("markFieldSection() > section_path: " + section_path );
	
	markSection( section_path, load_fields );
	markField( field_path );
	
}

function markSection( section_path, load_fields ) {

	if (section_path==undefined) return;
	
	var dbTreeBranch = _dbTreeBranches[ section_path ];
	
	if (dbTreeBranch==undefined) return;
	
	var li_section_id = "seccion_"+dbTreeBranch["id"]+"_padre";
	var li_Element = document.getElementById( li_section_id );
	var isEmpty = sectionIsEmpty( section_path );
	
	if (!isEmpty && li_Element) {
		activateClass( li_Element, "marked");
		if (load_fields==true) {
			loadFields( section_path );
		}
	}
	var parent_path = getSectionParent(section_path);
	if (parent_path) 
		markSection( parent_path );
}

function getSectionParent( section_path ) {

	var dbTreeBranch = _dbTreeBranches[ section_path ];
	if (dbTreeBranch) 
		return dbTreeBranch["father_herence"];
	else
		return undefined;
}

function markField( field_path ) {
	var dbField = _dbFields[field_path];
	if (dbField==undefined) return;
	
	var field_id = dbField.field_id;

	if (GetMarker(field_path, field_id)!='amarillo') {
		if (!fieldIsEmpty(field_path))
			SetMarker( field_path, field_id, 'verde' );
		else
			SetMarker( field_path, field_id, 'blanco' );
	}
}


function getParentFieldPath( field_path ) {
		
		var new_field_path = "";
		
		if (field_path!=undefined) {

				var x_fields = field_path.split(":");
				var sep="";
				
				for( var i=0; i< x_fields.length - 1; i++ ) {
					var path = x_fields[i];					
					new_field_path+= sep + path;
					sep = ':';
				}
				
		}
	
		return new_field_path;
}

function RecalculateMarkers( xmlNode, field_path, forcingmark ) {
		
		//if we are a field, go up to parent section <seccion> or <categoria>
		// and rerun RecalculateMarkers

		var parent_field_path = getParentFieldPath(field_path);

		switch( xmlNode.nodeName ) {		
				case "registro":
					//check all the fields...
					var fields = evaluateXPath( xmlNode, "campo");
					
					var resultmark = xmlNode.getAttribute( "marker" );
					if (resultmark==undefined || resultmark=="") resultmark = "blanco";
					if (forcingmark!=undefined) resultmark = forcingmark;
					 
					
					for (var fi in fields) {
					
						var fieldNode = fields[fi];
						var childmark = GetAttribute( fieldNode, "marker" );
						
						if (childmark=="amarillo" && resultmark!="rojo") {
							resultmark = "amarillo";
						}
						
						// green always loose / verde siempre verde salvo...si era blanco o verde claro...
						if (childmark=="verde" && resultmark!="rojo" && resultmark!="amarillo" ) {
							resultmark = "verde";
						}
					}
					xmlNode.setAttribute( "marker", resultmark );
					//go up through the table/multiple field...
					if (xmlNode.parentNode && xmlNode.parentNode.parentNode)
						RecalculateMarkers( xmlNode.parentNode.parentNode /*registro <= valor <= campo*/, getParentFieldPath(field_path)  );
					break;
				
				case "campo":
					
					if (GetAttribute(xmlNode,"tipo").indexOf("multiple")>=0) {
						var dbfield = _dbFields[field_path];
						if (dbfield) {
							var field_id = _dbFields[field_path].field_id;
							var records = evaluateXPath( xmlNode, "valor/registro");
							var resultmark = xmlNode.getAttribute( "marker" );
							if (resultmark==undefined || resultmark=="") resultmark = "blanco";
							if (forcingmark!=undefined) resultmark = forcingmark;
						
							for (var ri in records) {
								var recordNode = records[ri];
								var childmark = GetAttribute( recordNode, "marker" );
								
								if (childmark=="amarillo" && resultmark!="rojo") {
									resultmark = "amarillo";
								}
								
								// green always loose / verde siempre verde salvo...si era blanco o verde claro...
								if (childmark=="verde" && resultmark!="rojo" && resultmark!="amarillo" ) {
									resultmark = "verde";
								}
							}
							xmlNode.setAttribute( "marker", resultmark );
							//como es un campo, lo fijamos tambien?! sip, tiene q reflejar lo q tiene adentro...
							var marker_selected = document.getElementById( "marcar_"+field_id+"_selected" );
							if (marker_selected) 
								marker_selected.setAttribute("class","marker-"+resultmark + " marker-selected" );
						}
					}
					RecalculateMarkers( xmlNode.parentNode /*campo<=registro o campo<=seccion*/, getParentFieldPath(field_path)  );
					break;
/**
				case "valor":				
						RecalculateMarkers( xmlNode.parentNode.parentNode );
						break;						

				case "registro": a definir
*/
				case "seccion":
				case "categoria":
						//check every child for attribute marker...
						//set automatically tree view ????
						var childs = xmlNode.childNodes;
						var resultmark = "blanco"; //las secciones son pasivas... (no se rellena nada)
						if (resultmark==undefined || resultmark=="") resultmark = "blanco";
						if (forcingmark!=undefined) resultmark = forcingmark;
						
						for( var ch=0; ch < childs.length; ch++ ) {
									var childNode = childs[ch];
									var childmark = GetAttribute( childNode, "marker" );
									if (childmark) {
									    //red always win / rojo gana siempre
									    /*
									   if (childmark=="rojo") {
									   		resultmark = "rojo";
									    }
									    */
										// yellow always win / amarillo gana sobre verde y blanco (pierde con rojo)
										if (childmark=="amarillo" && resultmark!="rojo") {
											resultmark = "amarillo";
										}
										// green always loose / verde siempre verde salvo...si era blanco o verde claro...
										if (childmark=="verde" && resultmark!="rojo" && resultmark!="amarillo" ) {
											resultmark = "verde";
										}
									  
										/*
									  	if (childNode.nodeName=="campo") {
											var field_id = _dbFields[field_path].field_id;
																	
											if (GetMarker(field_path, field_id)!='amarillo') {
												if (!fieldIsEmpty(field_path))
													SetMarker( field_path, field_id, 'verde' );
												else 
													SetMarker( field_path, field_id, 'blanco' );
											}
										}
										*/
									}
						}

						//setting it in the XML DOM
						xmlNode.setAttribute( "marker", resultmark );
						TreeBranch = _dbTreeBranches[ field_path ];
						
						//setting it in the HTML DOM
						if (TreeBranch) {							
							TreeBranchNode = TreeBranch.node;
							TreeBranchHtmlId = TreeBranch.id;
							//TreeBranchHtml = document.getElementById( "a_"+TreeBranchNode.nodeName+"_" + TreeBranch.id );							
							TreeBranchHtmlProgress = document.getElementById( "a_"+TreeBranchNode.nodeName+"_" + TreeBranch.id+"_progressbar" );
							
							//log("RecalculateMarkers() : setting HTML marker for section/category: " + field_path + " htmlid:" + "a_"+TreeBranchNode.nodeName+"_" + TreeBranch.id);
							//if (TreeBranchHtml) TreeBranchHtml.className = "calc-marker-"+resultmark;
							if (TreeBranchHtmlProgress)  {
								TreeBranchHtmlProgress.style.display = "block";
								TreeBranchHtmlProgress.className = "calc-marker-"+resultmark;
							}
						} 
							
						//continue to the root of the tree...						
						RecalculateMarkers( xmlNode.parentNode, getParentFieldPath(field_path)  );
						
						break;						
		}
			
}

function showProgress( nombreseccion ) {
	log("showProgress() > nombreseccion: [" + nombreseccion+"]" );
}

function GetMarker( field_path, field_id ) {

	var field_data = _dbFields[ field_path ];		
	var xmlNode = field_data.node;
	var mark = xmlNode.getAttribute( "marker" );
	if (mark==undefined) mark = "blanco";
	return mark;
}

function SetMarker( field_path, field_id, mark ) {
		if (field_id==undefined)
			return log("SetMarker() > field_path["+field_path+"] field_id["+field_id+"] mark["+mark+"]" );
		//log("SetMarker() > field_path ["+field_path+"] field_id ["+field_id+"] mark ["+mark+"]");
		//error("SetMarker(): field_path:" + field_path + " field_id: " + field_id + " mark:" + mark );
		//return;
		var field_data = _dbFields[ field_path ];		
		var xmlNode = field_data.node;
			
		xmlNode.setAttribute( "marker", mark );
		
		//hide marker options		
		if (document.getElementById('marcar_'+field_id+'_options')) 
			hidediv( 'marcar_'+field_id+'_options' );

	 //change and set selected marker class "marker-[color]"
		var marker_selected = document.getElementById( "marcar_"+field_id+"_selected" );
		if (marker_selected)
			marker_selected.setAttribute("class","marker-"+mark + " marker-selected" )
		
		var markers = document.getElementById( "markers_"+ field_id );
		if (markers) {
			deactivateClass( markers, "markers-blanco");
			deactivateClass( markers, "markers-verde");
			deactivateClass( markers, "markers-amarillo");
			activateClass( markers, "markers-"+mark);
		}
		RecalculateMarkers( xmlNode, field_path, mark );
		
		//finally save document
		PlaneaDocument.save();
		//log("SetMarker(): saved");
				
}