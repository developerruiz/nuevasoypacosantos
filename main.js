/**
 * Calendario simple
 */
 function calendarioGrego(id) {

	// Arreglo con los días de la semana
    
    this.arrDiasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
	this.primerDiaSemana =  2  ; // Lunes
	this.arrMesesAnio = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
	this.idhtml = id;
	this.periodoActual = {'dia':0, 'mes':0, 'anio':0};
	

    // Acciones cuando arranca la nueva instancia del calendario
	this.init = function () {
        var ext = this;
		$(document).ready(function(){
			$(window).resize(function(){ext.resizeme()});
			$(window).load(function(){ext.resizeme()});
		});
		return this;
	}

    
	// Implementa el menu superior
	this.menuSuperior = function () {
		var html = '<div id="barcal"><a class="nav-left" href="#"></a>'+this.arrMesesAnio[this.periodoActual.mes]+ ' - '+ this.periodoActual.anio +'<a class="nav-right" href="#"></a></div>';
		return html;
	}

    
	// Genera el HTMl de la cabecera
	this.generaCabecera = function () {
		var x=0, html = '', n = this.primerDiaSemana;
		for (x in this.arrDiasSemana) {
			html += '<th>' + this.arrDiasSemana[ n++ ] + '</th>';
			if ( n >= this.arrDiasSemana.length ) {
				n = 0;
			}
		}
		return '<thead><tr>'+html+'</tr></thead>';
	}

	
	// general el contendido del calendario
	this.contenido = function () {
		
		var html = '' , n = 1 , someDay = new Date() , inicial = 1 , flagDespliegaLineaCajas = true;
        
        // Setea el primer día a evaluar
		someDay.setFullYear( this.periodoActual.anio, this.periodoActual.mes, n );
		
        // Calcula los días previos al comienzo del mes
		if ((someDay.getDay() + this.primerDiaSemana ) > 0) { 

            var preRango = ( someDay.getDay() >= this.primerDiaSemana ) ? someDay.getDay() - 
                            this.primerDiaSemana : this.arrDiasSemana.length - 
                            this.primerDiaSemana + someDay.getDay();
        
			n = (preRango * -1) + 1;
			inicial = n;
		};
        
        while ( n <= 1  || this.periodoActual.mes == someDay.getMonth() || 
               ( n > 1 && this.periodoActual.mes != someDay.getMonth() && someDay.getDay() != this.primerDiaSemana ) ) {
            
            someDay.setFullYear( this.periodoActual.anio, this.periodoActual.mes, n++ );
            
            // Si el calendario se extiede mas de lo que corresponde, corta la ejecución
            console.log(someDay.getDay());  
            if ( n > 3 &&  (this.periodoActual.mes < someDay.getMonth() || this.periodoActual.anio < someDay.getFullYear() ) && someDay.getDay() ==this.primerDiaSemana ) {
                break;
            }
            
            // pertenece el día al mes consultado
			var habilitado = this.periodoActual.mes == someDay.getMonth();
		      // Flag en el caso
			flagDespliegaLineaCajas = ( this.periodoActual.mes < someDay.getMonth() && someDay.getDay() == 0 &&  someDay.getDate() == 1 ) ? false : true;

            
            if ( flagDespliegaLineaCajas ) {
                if ( someDay.getDay() == this.primerDiaSemana && (inicial + 1) != n ) { 
					html += '</tr><tr>';	
				}
				html += this.celdaHtml( someDay.getDate(), someDay.getMonth(), habilitado, someDay.getFullYear() );        
			}
        }
		return '<tbody><tr>' + html + '</tr></tbody>';
	}

	
	// dibuja la celda del calendario
	this.celdaHtml = function ( numero, mes, activo, anio ) {
		var fechaActual	= new Date();
		var cssHoy = (activo && numero == fechaActual.getDate() && mes == fechaActual.getMonth() && anio == fechaActual.getFullYear() ) ? 'cssHoy' : '';
		var flagActivo = ( activo ) ? '': ' class="disabled" ';
		return '<td data="'+ anio+'-'+mes+'-'+numero+'" ' + flagActivo + '><div class="headbox '+cssHoy+'">' + numero + '</div><div class="bodybox '+cssHoy+'" id="cell_'+ anio+'_'+mes+'_'+numero+'"></div></td>';
	}

	// Recalcula el tamaño en relacion con el contenedor
	this.resizeme = function () {
		var wscr 	= $('#' + this.idhtml).width();
		var hscr 	= $('#' + this.idhtml).height()-1-$('#barcal').height();
		var counttr = $("#minical tr").length-1; //numero de filas menos cabecera
		var counttd = $("#minical th").length; //numero de filas menos cabecera
		
		$('#minical').css("width", wscr);
		$('#minical').css("height", hscr);
		//alto de cada bodybox menos alto de headbox
		$('.bodybox').css("height",(hscr/counttr)-($('.headbody').height()+$('#barcal').height()))
		//ancho de cada columna (ancho pantalla/numero columnas)
		$('#minical th').css("width",(wscr/counttd));
	}

	// Inserta informacion en la celda especificada
	this.insertData = function ( anio, mes, dia, valor ) {
		mes--;
		$("#cell_"+anio+'_'+mes+'_'+dia).append(valor);
	}

	// Limpia todos los elementos del calendario
	this.clearData = function () {
		$('.bodybox').html("");
	}
	
	// Imprime el contenido en el cuerpo del calendario
	this.imprime = function () {
		var fechaActual		= new Date();
		var numeroDia		= fechaActual.getDate();
		var numeroMes 		= fechaActual.getMonth();
		var numeroAnio		= fechaActual.getFullYear();

		if (arguments[0] != undefined) // argumento como día actual
			numeroDia = parseInt(arguments[0],10);
		if (arguments[1] != undefined) // argumeto como mes actual
			numeroMes = parseInt(arguments[1],10);
		if (arguments[2] != undefined) // argumeto como año actual
			numeroAnio = parseInt(arguments[2],10);

		this.periodoActual.dia 	= numeroDia;
		this.periodoActual.mes 	= numeroMes;
		this.periodoActual.anio = numeroAnio;

		
		// Contenido que se insertara finalmente en el DOM
		var contenidoHtml = '';
		contenidoHtml += this.menuSuperior();
		contenidoHtml += '<table class="calendargrego" id="minical" cellpadding="0" cellspacing="0">';
		contenidoHtml += this.generaCabecera();
		contenidoHtml += this.contenido(numeroMes, numeroAnio);
		contenidoHtml += '</table>';
		$('#' + this.idhtml).html( contenidoHtml );
		this.resizeme();

		// Acciones adicionales
		var objeto = this;
		$('.nav-left').click(function () { // resta un mes al calendario
			objeto.periodoActual.mes--;
			if ((objeto.periodoActual.mes) < 0) {
				objeto.periodoActual.mes = 11;
				objeto.periodoActual.anio--;
			}
			objeto.imprime(objeto.dia, objeto.periodoActual.mes, objeto.periodoActual.anio);
		});
		$('.nav-right').click(function () { // resta un mes al calendario
			objeto.periodoActual.mes++;
			if ((objeto.periodoActual.mes) > 11) {
				objeto.periodoActual.mes = 0;
				objeto.periodoActual.anio++;
			}
			objeto.imprime(objeto.dia, objeto.periodoActual.mes, objeto.periodoActual.anio);
		});
	}
}


// Inicia el calendario y el boton asignar mensajes
var miCalendario = new calendarioGrego('calendarview').init();
$(document).ready(function(){
	miCalendario.imprime();
  $("#accion").click(function(){
    miCalendario.insertData( $("#celda").val(), $("#mensaje").val() );
  });
});

