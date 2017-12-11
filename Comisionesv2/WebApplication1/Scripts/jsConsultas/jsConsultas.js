var Report = 0;
    
function GetCliente(idEmpresa) {
    if (idEmpresa != "") {
     
        $("#module").text("Buscando clientes...");
        $("#waitModalLabel").text("Buscando clientes...");
        $("#modal-body").html("<div id='module' style='font-weight: bold;'></div> <div class='progress'><div class='progress-bar progress-bar-striped active' role='progressbar' aria-valuenow='100' aria-valuemin='0' aria-valuemax='100' style='width: 100%'> <span class='sr-only'>Cargando...</span></div></div>");
        $('#waitModal').modal('toggle')
        $.ajax({
            url: '/comisiones/Consultas/getCliente',
            type: "GET",
            dataType: "JSON",
            data: { id_empresa: idEmpresa },
            success: function (clientes) {
                var select = $("#idCliente");
                select.empty();
                select.append($('<option/>', {
                    value: "",
                    text: "-- Selecciona un cliente --"
                }));
                $.each(clientes.Cliente, function (i, cliente) {
                    select.append(
                        $('<option></option>').val(cliente.Value.trim()).html(cliente.Text));
                });

              //  $("#idCliente").select2("val", "")
                $("#idCliente option[value='0']").attr("selected", "selected")

                $('#waitModal').modal('toggle');

            },
            error: function (reponse) {
                $('#waitModal').modal('toggle');
                alert("error : " + reponse);
            }

        });
    }
    
}

$('#buscarFacturas').on('click', function (event) {
    var SplitFacturas = $("#txtBusquedaFacturas").val().trim().split(',');
    
    if (SplitFacturas != null && SplitFacturas!="") {

        $("#module").text("Buscando estado de factura(s)..., por favor, espere.");
        $("#waitModal_facturas-body").text("<div id='module' style='font-weight: bold;'></div> <div class='progress'><div class='progress-bar progress-bar-striped active' role='progressbar' aria-valuenow='100' aria-valuemin='0' aria-valuemax='100' style='width: 100%'> <span class='sr-only'>Cargando...</span></div></div>");
        $('#waitModal').modal('toggle');

        var stringFacturasOriginal = $("#txtBusquedaFacturas").val().trim();
        var splitFacturas = multiSplit(stringFacturasOriginal, [',', ';'])
        
        var FacturasGet = "";
        splitFacturas.forEach(function (factura) {
            FacturasGet = FacturasGet + factura.trim() + "_"
        })
        FacturasGet = FacturasGet.substring(0, FacturasGet.length - 1);

        $('#modal-body').load("/comisiones/Consultas/GetBuscaFacturas/?stringFacturas=" + FacturasGet);
        $("#module").text("");
        $("#waitModalLabel").text("Resultado de busqueda de facturas");
        //$.ajax({
        //    url: '/Consultas/buscarFactura',
        //    type: "POST",
        //    data: { facturas: SplitFacturas },
        //    dataType: "JSON",
        //    success: function SuccessCallback() {
                
        //    },
        //    error: function FailureCallback(result) {
        //        alert("error : " + result);
        //    }
        //});

    }
    else {
        fnMensajeModalError("Debe ingresar la(s) factura(s) a buscar");
    }

    //event.preventDefault();
});

var multiSplit = function (str, delimeters) {
    var result = [str];
    if (typeof (delimeters) == 'string')
        delimeters = [delimeters];
    while (delimeters.length > 0) {
        for (var i = 0; i < result.length; i++) {
            var tempSplit = result[i].split(delimeters[0]);
            result = result.slice(0, i).concat(tempSplit).concat(result.slice(i + 1));
        }
        delimeters.shift();
    }
    return result;
}

$('#generarComisionesVendedor').on('click', function (event) {
    //var SplitPeriodos = $("#strPeriodoResumenComisiones option:selected").text().trim().split('-');
    var idCodigoVendedor = $('#vendedoresResumenComisiones').val();
    var dtFechaInicio = $('#id-date-range-picker-1').val().slice(0, 10).trim();
    var dtFechaFin = $('#id-date-range-picker-1').val().slice(13, 23).trim();

    //if ((SplitPeriodos != null && idCodigoVendedor != "") || (dtFechaInicio!="" && dtFechaFin!="" && idCodigoVendedor!="")) {
     if ((dtFechaInicio!="" && dtFechaFin!="" && idCodigoVendedor!="")) {

        $('#Reportes').html("<div style='text-align: center;'><img style='vertical-align: middle;' src='../assets/img/progress_bar2.gif'/></div>");

        $("#reporteModalLabel").text("Resumen de Comisiones por Vendedor");
        $('#Reportes').load("/comisiones/Consultas/ResumenComisionesVendedor");

        $('#reporteModal').modal('toggle')

        $.ajax({
            url: '/comisiones/Consultas/obtenerComisionesVendedor',
            type: "POST",
            //data: { numPeriodo: SplitPeriodos[0], anioPeriodo: SplitPeriodos[1], codigoVendedor: idCodigoVendedor, fechaInicio:dtFechaInicio, fechaFin:dtFechaFin },
             data: { codigoVendedor: idCodigoVendedor, fechaInicio:dtFechaInicio, fechaFin:dtFechaFin },
          
            dataType: "JSON",
            success: function SuccessCallback(lista_clientes) {
                if (!lista_clientes.error) {
                    debugger
                    var suma = 0;
                    var tabla = '<div><span  class="user-info" style="font-weight: bold;">Fecha Inicio: </span><span  class="user-info">' + lista_clientes.fechaInicio + '</span><span class="user-info" style =" margin-left: 25px; font-weight: bold;" >Fecha Fin: </span><span  class="user-info">' + lista_clientes.fechaFin + '</span></div></br><div style="height: 280px; overflow-y: scroll;"><table class="table table-bordered table-hover" cellpadding="0" cellspacing="0" border="1" class="display" id="comision_cliente">';
                    tabla += '<thead>';
                    tabla += '<tr>';
                    tabla += '<th>CLIENTE</th><th>MONTO</th>';
                    tabla += '</tr>';
                    tabla += '</thead>';
                    tabla += '<tbody>';
                    var tr = '';

                    $(lista_clientes.lista_clientes).each(function (i) {
                        suma = suma + lista_clientes.lista_clientes[i].MONTO;
                        tr += '<tr>';
                        tr += '<td>' + lista_clientes.lista_clientes[i].CLIENTE + '</td><td>' + lista_clientes.lista_clientes[i].MONTO + '</td>';
                        tr += '</tr>';

                    });

                    tabla += tr;
                    tabla += '<tfoot><tr>  <th colspan="2" scope="col" style="text-align: center">' + suma + '</th> </tr></tfoot>'
                    tabla += '</tbody></table>';

                    tabla += '<table class="table table-margenout" cellpadding="0" cellspacing="0" border="0" class="display" id="comision_cliente_resumen">';
                    tabla += '<thead>';
                    tabla += '<tr>';
                    tabla += '<th rowspan="1" scope="col">Comisión</th><td style="text-align: right">' + lista_clientes.pieComisiones.COMISION + '</td>';
                    tabla += '</tr>';
                    tabla += '<tr>';
                    tabla += '<th rowspan="1" scope="col">No Comisionable</th><td style="text-align: right">' + lista_clientes.pieComisiones.NOCOMISIONABLE + '</td>';
                    tabla += '</tr>';
                    tabla += '<tr>';
                    tabla += '<th rowspan="1" scope="col">Retención</th><td style="text-align: right">' + lista_clientes.pieComisiones.RETENCION + '</td>';
                    tabla += '</tr>';
                    tabla += '<tr>';
                    tabla += '<th rowspan="1" scope="col">Total</th><td style="text-align: right">' + lista_clientes.pieComisiones.TOTAL + '</td>';
                    tabla += '</tr>';
                    tabla += '</thead>';
                    tabla += '<tbody>';
                    tabla += '<tr>';
                    tabla += '<th rowspan="1" scope="col">Liberar Retención</th><td style="text-align: right">' + lista_clientes.pieComisiones.LIBERARRETENCION + '</td>';
                    tabla += '</tr>';
                    tabla += '<tfoot><tr>  <th rowspan="1" scope="col">Total a Pagar</th> <td style="text-align: right">' + lista_clientes.pieComisiones.TOTALPAGAR + '</td> </tr></tfoot>'
                    tabla += '</tbody></table></div>';

                    $('#div_ResumenComisionesVendedor').html(tabla);
                }
            },
            error: function FailureCallback(result) {
                alert("error : " + result);
            }
        });

    }
    else {
        fnMensajeModalError("Debe seleccionar el periodo y vendedor");
    }

    //event.preventDefault();
});

$('#buscarResumenClientes').on('click', function (event) {
    Report = 1;
    var SplitPeriodos = $("#strPeriodoResumenComisiones option:selected").text().trim().split('-');
    var idCodigoVendedor = $('#vendedoresResumenComisiones').val();
    var strCodigoVendedor = $('#vendedoresResumenComisiones option:selected').text();
    var dtFechaInicio = $('#id-date-range-picker-1').val().slice(0, 10).trim();
    var dtFechaFin = $('#id-date-range-picker-1').val().slice(13, 23).trim();
    var idEmpresaSelect = 0;

    if (SplitPeriodos != null && idCodigoVendedor.length > 0) {

        $('#container_report').html('');
        $('#container_report2').html('');
        $('#container_report3').html('');
        $("#ContainerModal").modal('toggle');
        $("#ContainerModalLabel").html('Resumen de comisiones por vendedor');
        //$.ajax({
        //    url: '/comisiones/Periodos/obtenerReporte',
        //    type: "POST",
        //    data: { numPeriodo: SplitPeriodos[0], anioPeriodo: SplitPeriodos[1], codigoVendedor: idCodigoVendedor, idEmpresa: idEmpresaSelect },
        //    dataType: "JSON",
        //    success: function SuccessCallback(lista_clientes) {
        $.ajax({
            url: '/comisiones/Consultas/obtenerComisionesVendedor',
            type: "POST",
            data: { numPeriodo: SplitPeriodos[0], anioPeriodo: SplitPeriodos[1], codigoVendedor: idCodigoVendedor, fechaInicio: dtFechaInicio, fechaFin: dtFechaFin },
            dataType: "JSON",
            success: function SuccessCallback(lista_clientes) {
                if (!lista_clientes.error) {

                    var fechaInicio = lista_clientes.fechaInicio  // ToJavaScriptDate(lista_clientes.fechaInicio);
                    var fechaFin = lista_clientes.fechaFin // ToJavaScriptDate(lista_clientes.fechaFin);

                    try {
                        fechaInicio = fechaInicio.substring(0, 10)
                        fechaFin = fechaFin.substring(0, 10)
                        //if (lista_clientes.periodos[0].fechaFin != "" && lista_clientes.periodos[0].fechaFin != 'undefined' && lista_clientes.periodos[0].fechaFin != null) {
                        //    fechaInicio = ToJavaScriptDate(lista_clientes.fechaInicio)
                        //    fechaFin = ToJavaScriptDate(lista_clientes.fechaFin)
                        //}
                    }
                    catch (e) {
                        fechaInicio = '---';
                        fechaFin = '---';
                    }


                    var suma = 0;
                    var tabla = '<div><span  class="user-info" style="font-weight: bold;">Fecha Inicio: </span><span  class="user-info" id ="fechaInicio">' + fechaInicio + '</span><span class="user-info" style =" margin-left: 25px; font-weight: bold;" >Fecha Fin: </span><span  class="user-info" id ="fechaFin">' + fechaFin + '</span></div></br><div style="height: 400px; overflow-y: scroll;"><table class="table table-bordered table-hover" style="width:50%; margin: auto;" cellpadding="0" cellspacing="0" border="1" class="display" id="comision_cliente">';
                    tabla += '<thead>';
                    tabla += '<tr>';
                    tabla += '<th>CLIENTE</th><th>MONTO</th>';
                    tabla += '</tr>';
                    tabla += '</thead>';
                    tabla += '<tbody>';
                    var tr = '';
                    var conteoClientes = 0;
                    $(lista_clientes.lista_clientes).each(function (i) {
                        suma = suma + lista_clientes.lista_clientes[i].MONTO;
                        tr += '<tr>';
                        tr += '<td>' + lista_clientes.lista_clientes[i].CLIENTE + '</td><td style="text-align: right">$' + lista_clientes.lista_clientes[i].MONTO + '</td>';
                        tr += '</tr>';
                        conteoClientes = conteoClientes + 1;
                    });

                    tabla += tr;
                    //tabla += '<tr>  <td colspan="2" scope="col" style="text-align: center">' + suma + '</td> </tr>'

                    //tabla += '<table class="table table-margenout" style="width:50%; margin: auto;" cellpadding="0" cellspacing="0" border="0" class="display" id="comision_cliente_resumen">';
                    tabla += '<tr>';
                    tabla += '<td rowspan="1" scope="col">Comisión</td><td style="text-align: right">$' + lista_clientes.pieComisiones.COMISION + '</td>';
                    tabla += '</tr>';
                    tabla += '<tr>';
                    tabla += '<td rowspan="1" scope="col">No Comisionable</td><td style="text-align: right">$' + lista_clientes.pieComisiones.NOCOMISIONABLE + '</td>';
                    tabla += '</tr>';
                    tabla += '<tr>';
                    tabla += '<td rowspan="1" scope="col">Retención</td><td style="text-align: right">$' + lista_clientes.pieComisiones.RETENCION + '</td>';
                    tabla += '</tr>';
                    tabla += '<tr>';
                    tabla += '<td rowspan="1" scope="col">Total</td><td style="text-align: right">$' + lista_clientes.pieComisiones.TOTAL + '</td>';
                    tabla += '</tr>';
                    tabla += '<tr>';
                    tabla += '<td rowspan="1" scope="col">Liberar Retención</td><td style="text-align: right">$' + lista_clientes.pieComisiones.LIBERARRETENCION + '</td>';
                    tabla += '</tr>';
                    tabla += '<tr><th rowspan="1" scope="col">Total a Pagar</th> <td style="text-align: right"$>' + lista_clientes.pieComisiones.TOTALPAGAR + '</td> </tr>'
                    tabla += '</tbody></table></div><div id="breakLine" style="display:none;">' + conteoClientes + '-' + suma + '</div>';

                    //Para Excel es especial, ya que exporta todo completo

                    var tabla2 = '<div><span  class="user-info" style="font-weight: bold;">Fecha Inicio: </span><span  class="user-info">' + fechaInicio + '</span><span class="user-info" style =" margin-left: 25px; font-weight: bold;" >Fecha Fin: </span><span  class="user-info">' + fechaFin + '</span></div></br><div style="height: 400px; overflow-y: scroll;"><table class="table table-bordered table-hover" style="width:100%; margin: auto;" cellpadding="0" cellspacing="0" border="1" class="display" id="comision_cliente2">';
                    tabla2 += '<thead>';
                    tabla2 += '<tr>';
                    tabla2 += '<th colspan = "2" rowspan="4" style="text-align: center"><img src="http://cdn2.hubspot.net/hub/2039173/hubfs/site/GrupoEi-agencia-aduanal-en-mexico-logo.png?t=1501783955921&width=190&name=GrupoEi-agencia-aduanal-en-mexico-logo.png" alt="IMAGES" /></th><th colspan = "2"  rowspan="4" style="text-align: center">Grupo EI SA de CV</th><th colspan = "2"  rowspan="4" style="text-align: center">Resumen de Comisiones por Cliente</th>';
                    tabla2 += '</tr>';

                    tabla2 += '<tr>';
                    tabla2 += '</tr>';

                    tabla2 += '<tr>';
                    tabla2 += '</tr>';

                    tabla2 += '<tr>';
                    tabla2 += '</tr>';

                    tabla2 += '<tr>';
                    tabla2 += '<th>Fecha Inicio: ' + fechaInicio + '</th><th>Fecha Fin: ' + fechaFin + '</th><th>Periodo: ' + SplitPeriodos[0] + '</th><th>Vendedor: ' + idCodigoVendedor + ' - ' + strCodigoVendedor + '</th><th colspan = "2" style="text-align: right">Pag. 1</th>';
                    tabla2 += '</tr>';
                    tabla2 += '<tr>';
                    tabla2 += '<th colspan="2" ></th><th style="text-align: center; background-color: #87b87f; color: #fff">CLIENTE</th><th style="text-align: center; background-color: #87b87f; color: #fff">MONTO</th><th colspan="2"></th>';
                    tabla2 += '</tr>';
                    tabla2 += '</thead>';
                    tabla2 += '<tbody>';
                    var tr2 = '';
                    $(lista_clientes.lista_clientes).each(function (i) {
                        tr2 += '<tr>';
                        tr2 += '<td colspan="2"></td><td>' + lista_clientes.lista_clientes[i].CLIENTE + '</td><td style="text-align: right">$' + lista_clientes.lista_clientes[i].MONTO + '</td><td colspan="2"></td>';
                        tr2 += '</tr>';
                    });

                    tabla2 += tr2;
                    tabla2 += '<tr><td colspan="2"></td> <td colspan="2" scope="col" style="text-align: center">' + suma + '</td> <td colspan="2"></tr>'

                    //tabla += '<table class="table table-margenout" style="width:50%; margin: auto;" cellpadding="0" cellspacing="0" border="0" class="display" id="comision_cliente_resumen">';
                    tabla2 += '<tr>';
                    tabla2 += '<td colspan="2"></td><td rowspan="1" scope="col">Comisión</td><td style="text-align: right">$' + lista_clientes.pieComisiones.COMISION + '</td><td colspan="2"></td>';
                    tabla2 += '</tr>';
                    tabla2 += '<tr>';
                    tabla2 += '<td colspan="2"></td><td rowspan="1" scope="col">No Comisionable</td><td style="text-align: right">$' + lista_clientes.pieComisiones.NOCOMISIONABLE + '</td><td colspan="2"></td>';
                    tabla2 += '</tr>';
                    tabla2 += '<tr>';
                    tabla2 += '<td colspan="2"></td><td rowspan="1" scope="col">Retención</td><td style="text-align: right">$' + lista_clientes.pieComisiones.RETENCION + '</td><td colspan="2"></td>';
                    tabla2 += '</tr>';
                    tabla2 += '<tr>';
                    tabla2 += '<td colspan="2"></td><td rowspan="1" scope="col">Total</td><td style="text-align: right">$' + lista_clientes.pieComisiones.TOTAL + '</td><td colspan="2"></td>';
                    tabla2 += '</tr>';
                    tabla2 += '<tr>';
                    tabla2 += '<td colspan="2"></td><td rowspan="1" scope="col">Liberar Retenci&oacuten</td><td style="text-align: right">$' + lista_clientes.pieComisiones.LIBERARRETENCION + '</td><td colspan="2"></td>';
                    tabla2 += '</tr>';
                    tabla2 += '<tr><td colspan="2"></td><th rowspan="1" scope="col">Total a Pagar</th> <td style="text-align: right"$>' + lista_clientes.pieComisiones.TOTALPAGAR + '</td><td colspan="2"></td> </tr>'
                    tabla2 += '</tbody></table></div>';


                    $('#container_report').html(tabla);
                    $('#container_report2').html(tabla2);
                    $("#cmd").show();
                    $("#cmd_excel").show();
                }
            },
            error: function FailureCallback(result) {
                alert("error : " + result);
            }
        });
    }
    else {
        fnMensajeModalError("Debe seleccionar un vendedor");
    }


    //if (SplitPeriodos != null && idCodigoVendedor != "" && idEmpresaSelect != "") {

    //    $.ajax({
    //        url: '/comisiones/Periodos/obtenerReporte',
    //        type: "POST",
    //        data: { numPeriodo: SplitPeriodos[0], anioPeriodo: SplitPeriodos[1], codigoVendedor: idCodigoVendedor, idEmpresa: idEmpresaSelect },
    //        dataType: "JSON",
    //        success: function SuccessCallback(lista_clientes) {
    //            if (!lista_clientes.error) {

    //                var fechaInicio;
    //                var fechaFin;

    //                try {
    //                    if (lista_clientes.periodos[0].fechaFin != "" && lista_clientes.periodos[0].fechaFin != 'undefined' && lista_clientes.periodos[0].fechaFin != null) {
    //                        fechaInicio = ToJavaScriptDate(lista_clientes.periodos[0].fechaInicio)
    //                        fechaFin = ToJavaScriptDate(lista_clientes.periodos[0].fechaFin)
    //                    }
    //                }
    //                catch (e) {
    //                    fechaInicio = '---';
    //                    fechaFin = '---';
    //                }


    //                var suma = 0;
    //                var tabla = '<div><span  class="user-info" style="font-weight: bold;">Fecha Inicio: </span><span  class="user-info" id ="fechaInicio">' + fechaInicio + '</span><span class="user-info" style =" margin-left: 25px; font-weight: bold;" >Fecha Fin: </span><span  class="user-info" id ="fechaFin">' + fechaFin + '</span></div></br><div style="height: 280px; overflow-y: scroll;"><table class="table table-bordered table-hover" style="width:50%; margin: auto;" cellpadding="0" cellspacing="0" border="1" class="display" id="comision_cliente">';
    //                tabla += '<thead>';
    //                tabla += '<tr>';
    //                tabla += '<th>CLIENTE</th><th>MONTO</th>';
    //                tabla += '</tr>';
    //                tabla += '</thead>';
    //                tabla += '<tbody>';
    //                var tr = '';
    //                var conteoClientes = 0;
    //                $(lista_clientes.lista_clientes).each(function (i) {
    //                    suma = suma + lista_clientes.lista_clientes[i].MONTO;
    //                    tr += '<tr>';
    //                    tr += '<td>' + lista_clientes.lista_clientes[i].CLIENTE + '</td><td style="text-align: right">$' + lista_clientes.lista_clientes[i].MONTO + '</td>';
    //                    tr += '</tr>';
    //                    conteoClientes = conteoClientes + 1;
    //                });

    //                tabla += tr;
    //                //tabla += '<tr>  <td colspan="2" scope="col" style="text-align: center">' + suma + '</td> </tr>'

    //                //tabla += '<table class="table table-margenout" style="width:50%; margin: auto;" cellpadding="0" cellspacing="0" border="0" class="display" id="comision_cliente_resumen">';
    //                tabla += '<tr>';
    //                tabla += '<td rowspan="1" scope="col">Comisión</td><td style="text-align: right">$' + lista_clientes.pieComisiones.COMISION + '</td>';
    //                tabla += '</tr>';
    //                tabla += '<tr>';
    //                tabla += '<td rowspan="1" scope="col">No Comisionable</td><td style="text-align: right">$' + lista_clientes.pieComisiones.NOCOMISIONABLE + '</td>';
    //                tabla += '</tr>';
    //                tabla += '<tr>';
    //                tabla += '<td rowspan="1" scope="col">Retención</td><td style="text-align: right">$' + lista_clientes.pieComisiones.RETENCION + '</td>';
    //                tabla += '</tr>';
    //                tabla += '<tr>';
    //                tabla += '<td rowspan="1" scope="col">Total</td><td style="text-align: right">$' + lista_clientes.pieComisiones.TOTAL + '</td>';
    //                tabla += '</tr>';
    //                tabla += '<tr>';
    //                tabla += '<td rowspan="1" scope="col">Liberar Retención</td><td style="text-align: right">$' + lista_clientes.pieComisiones.LIBERARRETENCION + '</td>';
    //                tabla += '</tr>';
    //                tabla += '<tr><th rowspan="1" scope="col">Total a Pagar</th> <td style="text-align: right"$>' + lista_clientes.pieComisiones.TOTALPAGAR + '</td> </tr>'
    //                tabla += '</tbody></table></div><div id="breakLine" style="display:none;">' + conteoClientes + '-' + suma + '</div>';

    //                //Para Excel es especial, ya que exporta todo completo

    //                var tabla2 = '<div><span  class="user-info" style="font-weight: bold;">Fecha Inicio: </span><span  class="user-info">' + fechaInicio + '</span><span class="user-info" style =" margin-left: 25px; font-weight: bold;" >Fecha Fin: </span><span  class="user-info">' + fechaFin + '</span></div></br><div style="height: 280px; overflow-y: scroll;"><table class="table table-bordered table-hover" style="width:100%; margin: auto;" cellpadding="0" cellspacing="0" border="1" class="display" id="comision_cliente2">';
    //                tabla2 += '<thead>';
    //                tabla2 += '<tr>';
    //                tabla2 += '<th colspan = "2" rowspan="4" style="text-align: center"><img src="http://cdn2.hubspot.net/hub/2039173/hubfs/site/GrupoEi-agencia-aduanal-en-mexico-logo.png?t=1501783955921&width=190&name=GrupoEi-agencia-aduanal-en-mexico-logo.png" alt="IMAGES" /></th><th colspan = "2"  rowspan="4" style="text-align: center">Grupo EI SA de CV</th><th colspan = "2"  rowspan="4" style="text-align: center">Resumen de Comisiones por Cliente</th>';
    //                tabla2 += '</tr>';

    //                tabla2 += '<tr>';
    //                tabla2 += '</tr>';

    //                tabla2 += '<tr>';
    //                tabla2 += '</tr>';

    //                tabla2 += '<tr>';
    //                tabla2 += '</tr>';

    //                tabla2 += '<tr>';
    //                tabla2 += '<th>Fecha Inicio: ' + fechaInicio + '</th><th>Fecha Fin: ' + fechaFin + '</th><th>Periodo: ' + SplitPeriodos[0] + '</th><th>Vendedor: ' + idCodigoVendedor + ' - ' + strCodigoVendedor + '</th><th colspan = "2" style="text-align: right">Pag. 1</th>';
    //                tabla2 += '</tr>';
    //                tabla2 += '<tr>';
    //                tabla2 += '<th colspan="2" ></th><th style="text-align: center; background-color: #87b87f; color: #fff">CLIENTE</th><th style="text-align: center; background-color: #87b87f; color: #fff">MONTO</th><th colspan="2"></th>';
    //                tabla2 += '</tr>';
    //                tabla2 += '</thead>';
    //                tabla2 += '<tbody>';
    //                var tr2 = '';
    //                $(lista_clientes.lista_clientes).each(function (i) {
    //                    tr2 += '<tr>';
    //                    tr2 += '<td colspan="2"></td><td>' + lista_clientes.lista_clientes[i].CLIENTE + '</td><td style="text-align: right">$' + lista_clientes.lista_clientes[i].MONTO + '</td><td colspan="2"></td>';
    //                    tr2 += '</tr>';
    //                });

    //                tabla2 += tr2;
    //                tabla2 += '<tr><td colspan="2"></td> <td colspan="2" scope="col" style="text-align: center">' + suma + '</td> <td colspan="2"></tr>'

    //                //tabla += '<table class="table table-margenout" style="width:50%; margin: auto;" cellpadding="0" cellspacing="0" border="0" class="display" id="comision_cliente_resumen">';
    //                tabla2 += '<tr>';
    //                tabla2 += '<td colspan="2"></td><td rowspan="1" scope="col">Comisión</td><td style="text-align: right">$' + lista_clientes.pieComisiones.COMISION + '</td><td colspan="2"></td>';
    //                tabla2 += '</tr>';
    //                tabla2 += '<tr>';
    //                tabla2 += '<td colspan="2"></td><td rowspan="1" scope="col">No Comisionable</td><td style="text-align: right">$' + lista_clientes.pieComisiones.NOCOMISIONABLE + '</td><td colspan="2"></td>';
    //                tabla2 += '</tr>';
    //                tabla2 += '<tr>';
    //                tabla2 += '<td colspan="2"></td><td rowspan="1" scope="col">Retención</td><td style="text-align: right">$' + lista_clientes.pieComisiones.RETENCION + '</td><td colspan="2"></td>';
    //                tabla2 += '</tr>';
    //                tabla2 += '<tr>';
    //                tabla2 += '<td colspan="2"></td><td rowspan="1" scope="col">Total</td><td style="text-align: right">$' + lista_clientes.pieComisiones.TOTAL + '</td><td colspan="2"></td>';
    //                tabla2 += '</tr>';
    //                tabla2 += '<tr>';
    //                tabla2 += '<td colspan="2"></td><td rowspan="1" scope="col">Liberar Retenci&oacuten</td><td style="text-align: right">$' + lista_clientes.pieComisiones.LIBERARRETENCION + '</td><td colspan="2"></td>';
    //                tabla2 += '</tr>';
    //                tabla2 += '<tr><td colspan="2"></td><th rowspan="1" scope="col">Total a Pagar</th> <td style="text-align: right"$>' + lista_clientes.pieComisiones.TOTALPAGAR + '</td><td colspan="2"></td> </tr>'
    //                tabla2 += '</tbody></table></div>';


    //                $('#div_ListaParcial').html(tabla);
    //                $('#div_ListaParcial2').html(tabla2);

    //                $("#cmd").show();
    //                $("#cmd_excel").show();
    //            }
    //        },
    //        error: function FailureCallback(result) {
    //            alert("error : " + result);
    //        }
    //    });

    //}
    //else {
    //    fnMensajeModalError("Debe seleccionar periodo, vendedor y empresa");
    //}

    event.preventDefault();
});


$('#generarComisionesCliente').on('click', function (event) {
    Report = 2;
    var idCliente = $('#idCliente').val();
    var idEmpresaSelect = $('#IdEmpresa').val();
    var idCodigoVendedor = $('#vendedoresResumenComisiones2').val();
    var strCodigoVendedor = $('#vendedoresResumenComisiones2 option:selected').text();

   
    var strCliente = $('#idCliente option:selected').text();
    var strEmpresa = $('#IdEmpresa option:selected').text();

    var dtFechaInicio = $('#id-date-range-picker-2').val().slice(0, 10).trim();
    var dtFechaFin = $('#id-date-range-picker-2').val().slice(13, 23).trim();

    var fechaInicio = dtFechaInicio;
    var fechaFin = dtFechaFin;

    var cualquierFecha = "No";
    if ($('#strFecha').is(':checked')) {
        cualquierFecha = "Si";

        fechaInicio = "---";
        fechaFin = "---";
    }

    if (idCliente != "" && idEmpresaSelect != "" && idCodigoVendedor != "") {

        $('#Reportes').html("<div style='text-align: center;'><img style='vertical-align: middle;' src='../assets/img/progress_bar2.gif'/></div>");

        $('#container_report').html('');
        $('#container_report2').html('');
        $('#container_report3').html('');
        $("#ContainerModal").modal('toggle');
        $("#ContainerModalLabel").html('Reporte de Comisiones por Cliente y fechas')

        $.ajax({
            url: '/comisiones/Consultas/generarReporteCliente',
            type: "POST",
            data: { codigoCliente: idCliente, idEmpresa: idEmpresaSelect, chkFecha:cualquierFecha, fechaInicio:dtFechaInicio, fechaFin: dtFechaFin },
            dataType: "JSON",
            success: function SuccessCallback(lista_detalles) {
                if (!lista_detalles.error) {

                    var tabla = '<div><span  class="user-info" style="font-weight: bold;">Fecha Inicio: </span><span  class="user-info">' + fechaInicio + '</span><span class="user-info" style =" margin-left: 25px; font-weight: bold;" >Fecha Fin: </span><span  class="user-info">' + fechaFin + '</span></div></br><div style="height: 500px; overflow-y: scroll;"><table id="dynamic-table2" class="table hola table-striped table-bordered table-hover" cellpadding="0" cellspacing="0" border="1" class="display">';
                    tabla += '<thead>';
                    tabla += '<tr>';
                    //tabla += '<th>FACTURA</th><th>FECHA FACTURA</th><th>FECHA ENVÍO</th><th>FECHA PAGO</th><th>DÍAS</th><th>NO. CLIENTE</th><th>CLIENTE</th><th>EQUIPO</th><th>T.C.</th><th>NO. CONCEPTO</th><th>COMISIÓN</th><th>VENTA</th><th>TOTAL FACTURA</th><th>ADUANA</th><th>REFERENCIA</th><th>RENDICION</th>';
                    //
                    tabla += '<th>FACTURA</th><th>FECHA FACTURA</th><th>FECHA ENVÍO</th><th>FECHA PAGO</th><th>DÍAS TRANSCURRIDOS</th><th>NO. CLIENTE</th><th>CLIENTE</th><th>EQUIPO</th><th>T.C.</th><th>NO. CONCEPTO</th><th>COMISIÓN</th><th>VENTA</th><th>ADUANA</th><th>REFERENCIA</th><th>RENDICION</th>';
                   
                    tabla += '</tr>';
                    tabla += '</thead>';
                    tabla += '<tbody>';
                    var tr = '';

                    $(lista_detalles.lista_detalles).each(function (i) {

                        tr += '<tr>';
                        tr += '<td>' + lista_detalles.lista_detalles[i].SOPNUMBE + '</td><td>' + ToJavaScriptDate(lista_detalles.lista_detalles[i].DATEFACTURA) + '</td>' + '<td>' + ToJavaScriptDate(lista_detalles.lista_detalles[i].DATEENVIO) + '</td><td>' + ToJavaScriptDate(lista_detalles.lista_detalles[i].DATEPAGO) + '</td>' + '<td>' + lista_detalles.lista_detalles[i].DIAS + '</td><td>' + lista_detalles.lista_detalles[i].CUSTNMBR + '</td>';
                        //tr += '<td>' + lista_detalles.lista_detalles[i].CUSTNAME + '</td><td>' + lista_detalles.lista_detalles[i].GRUPONOMBRE + '</td><td>' + lista_detalles.lista_detalles[i].TCPED + '</td>' + '<td>' + lista_detalles.lista_detalles[i].ITEMNMBR + '</td><td>' + lista_detalles.lista_detalles[i].COMISION + '</td>' + '<td>' + lista_detalles.lista_detalles[i].XTNDPRCE + '</td><td>' + lista_detalles.lista_detalles[i].SUBTOTAL + '</td>';
                        tr += '<td>' + lista_detalles.lista_detalles[i].CUSTNAME + '</td><td>' + lista_detalles.lista_detalles[i].GRUPONOMBRE + '</td><td>' + lista_detalles.lista_detalles[i].TCPED + '</td>' + '<td>' + lista_detalles.lista_detalles[i].ITEMNMBR + '</td><td>' + lista_detalles.lista_detalles[i].COMISION + '</td>' + '<td>' + lista_detalles.lista_detalles[i].XTNDPRCE + '</td>';
                        tr += '<td>' + lista_detalles.lista_detalles[i].ADUASECC + '</td><td>' + lista_detalles.lista_detalles[i].REFRENCE + '</td>' + '<td>' + lista_detalles.lista_detalles[i].RENDICION + '</td>';
                        tr += '</tr>';

                    });

                    tabla += tr;

                    tabla += '</tbody></table></div>';

                    //Aqui inicia el nuevo Layout con Excel y PDF

                    var tabla3 = '<div><span  class="user-info" style="font-weight: bold;">Fecha Inicio: </span><span  class="user-info">' + fechaFin + '</span><span class="user-info" style =" margin-left: 25px; font-weight: bold;" >Fecha Fin: </span><span  class="user-info">' + fechaFin + '</span><span class="user-info" style =" margin-left: 25px; font-weight: bold;" >Vendedor: </span><span  class="user-info">' + idCodigoVendedor + ' - ' + strCodigoVendedor + '</span></div></br><div style="height: 160px; overflow-y: hidden;">';
                    tabla3 += '<table class="table table-bordered table-hover" style="width:100%; margin: auto;" cellpadding="0" cellspacing="0" border="1" class="display" id="comision_cliente4">';
                    tabla3 += '<thead>';
                    tabla3 += '<tr>';
                    tabla3 += '<th colspan = "3" rowspan="4" style="text-align: center"><img src="http://cdn2.hubspot.net/hub/2039173/hubfs/site/GrupoEi-agencia-aduanal-en-mexico-logo.png?t=1501783955921&width=190&name=GrupoEi-agencia-aduanal-en-mexico-logo.png" alt="IMAGES" /></th><th colspan = "10" rowspan="4" style="text-align: center">Grupo EI SA de CV</th><th colspan = "3" rowspan="4" style="text-align: center">Res. de Comisiones por Cliente y fechas</th>';
                    tabla3 += '</tr>';

                    tabla3 += '<tr>';
                    tabla3 += '</tr>';

                    tabla3 += '<tr>';
                    tabla3 += '</tr>';

                    tabla3 += '<tr>';
                    tabla3 += '</tr>';

                    tabla3 += '<tr>';
                    tabla3 += '<th colspan = "3">Fecha Inicio: ' + fechaInicio + '</th><th colspan = "3">Fecha Fin: ' + fechaFin + '</th><th colspan = "5">Cliente: ' + idCliente + ' - ' + strCliente + '</th><th colspan = "3">Empresa: ' + strEmpresa + '</th><th colspan = "2" style="text-align: right">Pag. 1</th>';
                    tabla3 += '</tr>';

                    tabla3 += '</thead></br></table>';


                    var tabla2 = '<div style="height: 280px; overflow-y: scroll;">';
                    tabla2 += '<table id="table2" class="table hola table-striped table-bordered table-hover" cellpadding="0" cellspacing="0" border="1" class="display" >';
                    tabla2 += '<thead>';
                    tabla2 += '<tr>';
                    tabla2 += '<th>FACTURA</th><th>FECHA FACTURA</th><th>FECHA ENVÍO</th><th>FECHA PAGO</th><th>DÍAS TRANSCURRIDOS</th><th>NO. CLIENTE</th><th>CLIENTE</th><th>EQUIPO</th><th>T.C.</th><th>NO. CONCEPTO</th><th>COMISIÓN</th><th>VENTA</th><th>ADUANA</th><th>REFERENCIA</th><th>RENDICION</th>';
                    tabla2 += '</tr>';
                    tabla2 += '</thead>';
                    tabla2 += '<tbody>';
                    var tr = '';
                    $(lista_detalles.lista_detalles).each(function (i) {

                        tr += '<tr>';
                        tr += '<td>' + lista_detalles.lista_detalles[i].SOPNUMBE + '</td><td>' + ToJavaScriptDate(lista_detalles.lista_detalles[i].DATEFACTURA) + '</td>' + '<td>' + ToJavaScriptDate(lista_detalles.lista_detalles[i].DATEENVIO) + '</td><td>' + ToJavaScriptDate(lista_detalles.lista_detalles[i].DATEPAGO) + '</td>' + '<td>' + lista_detalles.lista_detalles[i].DIAS + '</td><td>' + lista_detalles.lista_detalles[i].CUSTNMBR + '</td>';
                        //tr += '<td>' + lista_detalles.lista_detalles[i].CUSTNAME + '</td><td>' + lista_detalles.lista_detalles[i].GRUPONOMBRE + '</td><td>' + lista_detalles.lista_detalles[i].TCPED + '</td>' + '<td>' + lista_detalles.lista_detalles[i].ITEMNMBR + '</td><td>' + lista_detalles.lista_detalles[i].COMISION + '</td>' + '<td>' + lista_detalles.lista_detalles[i].XTNDPRCE + '</td><td>' + lista_detalles.lista_detalles[i].SUBTOTAL + '</td>';
                        tr += '<td>' + lista_detalles.lista_detalles[i].CUSTNAME + '</td><td>' + lista_detalles.lista_detalles[i].GRUPONOMBRE + '</td><td>' + lista_detalles.lista_detalles[i].TCPED + '</td>' + '<td>' + lista_detalles.lista_detalles[i].ITEMNMBR + '</td><td>' + lista_detalles.lista_detalles[i].COMISION + '</td>' + '<td>' + lista_detalles.lista_detalles[i].XTNDPRCE + '</td>';
                        tr += '<td>' + lista_detalles.lista_detalles[i].ADUASECC + '</td><td>' + lista_detalles.lista_detalles[i].REFRENCE + '</td>' + '<td>' + lista_detalles.lista_detalles[i].RENDICION + '</td>';
                        tr += '</tr>';

                    });

                    tabla2 += tr;

                    tabla2 += '</tbody></table></div>';


                    $('#container_report').html(tabla);
                    $('#container_report2').html(tabla2);
                    $('#container_report3').html(tabla3);
                    

                    $('#table2')
                        .dataTable({
                            "paging": false,
                            language: {
                                "sProcessing": "Procesando...",
                                "sLengthMenu": "Mostrar _MENU_ registros",
                                "sZeroRecords": "No se encontraron resultados",
                                "sEmptyTable": "Ningún dato disponible en esta tabla",
                                "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                                "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                                "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                                "sInfoPostFix": "",
                                "sSearch": "Buscar:",
                                "sUrl": "",
                                "sInfoThousands": ",",
                                "sLoadingRecords": "Cargando...",
                                "oPaginate": true,
                                //"oPaginate": {
                                //    "sFirst": "Primero",
                                //    "sLast": "Último",
                                //    "sNext": "Siguiente",
                                //    "sPrevious": "Anterior"
                                //},
                                "oAria": {
                                    "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                                }
                            },
                            dom: 'Bfrtlip',
                            buttons: [
                            ],
                            Columns: [
                                       { "data": "SOPNUMBE" },
                                       { "data": "DATEFACTURA" },
                                       { "data": "DATEENVIO" },
                                       { "data": "DATEPAGO" },
                                       { "data": "DIAS" },
                                       { "data": "CUSTNMBR" },
                                       { "data": "CUSTNAME" },
                                       { "data": "GRUPONOMBRE" },
                                       { "data": "TCPED" },
                                       { "data": "ITEMNMBR" },
                                       { "data": "COMISION" },
                                       { "data": "XTNDPRCE" },
                                       { "data": "ADUASECC" },
                                       { "data": "REFRENCE" },
                                       { "data": "RENDICION" }
                            ],
                            bAutoWidth: true,
                            aoColumns: [
                                { sTitle: "", mData: "SOPNUMBE", bSortable: true },
                                { sTitle: "", mData: "DATEFACTURA", bSortable: true },
                                { sTitle: "", mData: "DATEENVIO", bSortable: true },
                                { sTitle: "", mData: "DATEPAGO", bSortable: true },
                                { sTitle: "", mData: "DIAS", bSortable: true },
                                { sTitle: "", mData: "CUSTNMBR", bSortable: true },
                                { sTitle: "", mData: "CUSTNAME", bSortable: true },
                                { sTitle: "", mData: "GRUPONOMBRE", bSortable: true },
                                { sTitle: "", mData: "TCPED", bSortable: true },
                                { sTitle: "", mData: "ITEMNMBR", bSortable: true },
                                { sTitle: "", mData: "COMISION", bSortable: true },
                                { sTitle: "", mData: "XTNDPRCE", bSortable: true },
                                { sTitle: "", mData: "ADUASECC", bSortable: true },
                                { sTitle: "", mData: "REFRENCE", bSortable: true },
                                { sTitle: "", mData: "RENDICION", bSortable: true }
                            ],
                            /* inside datatable initialization */
                            "aoColumnDefs": [
                            ],
                            "aaSorting": []
                        });





                    $("#cmd").show();
                    $("#cmd_excel").show();

                    $('#div_ComisionesCliente').html(tabla);
                }
            },
            error: function FailureCallback(result) {
                alert("error : " + result);
            }
        });

    }
    else if (idEmpresaSelect == "") {
        fnMensajeModalError("Debe seleccionar una empresa");
    }
    else if (idCliente == "") {
        fnMensajeModalError("Debe seleccionar un cliente");
    }
    else if (idCodigoVendedor == "") {
        fnMensajeModalError("Debe seleccionar un vendedor");
    }

    //event.preventDefault();
});

$('#generarReporteAnterior').on('click', function (event) {
    Report = 3;
    var SplitPeriodos = $("#strPeriodoPeriodosAnteriores option:selected").text().trim().split('-');
    var idCodigoVendedor = $('#vendedoresPeriodosAnteriores').val();
    var strCodigoVendedor = $('#vendedoresPeriodosAnteriores option:selected').text();

    if (SplitPeriodos != null && SplitPeriodos != "" && idCodigoVendedor != "" && SplitPeriodos[2] != " Selecciona periodo ") {

        //$('#Reportes').html("<div style='text-align: center;'><img style='vertical-align: middle;' src='../assets/img/progress_bar2.gif'/></div>");

        //$("#reporteModalLabel").text("Reporte de Periodos Anteriores");
        //$('#Reportes').load("/comisiones/Consultas/ReportePeriodoAnterior");

        //$('#reporteModal').modal('toggle')

        $('#Reportes').html("<div style='text-align: center;'><img style='vertical-align: middle;' src='../assets/img/progress_bar2.gif'/></div>");

        $('#container_report').html('');
        $('#container_report2').html('');
        $('#container_report3').html('');
        $("#ContainerModal").modal('toggle');
        $("#ContainerModalLabel").html('Reporte de Periodos anteriores')

        $.ajax({
            url: '/comisiones/Consultas/generarReporteAnterior',
            type: "POST",
            data: { numPeriodo: SplitPeriodos[0], anioPeriodo: SplitPeriodos[1], codigoVendedor: idCodigoVendedor},
            dataType: "JSON",
            success: function SuccessCallback(lista_detalles) {
                if (!lista_detalles.error) {

                    if (lista_detalles.conteo > 0) {
                        var fechaInicio;
                        var fechaFin;

                        try {
                            if (lista_detalles.periodos[0].fechaFin != "" && lista_detalles.periodos[0].fechaFin != 'undefined' && lista_detalles.periodos[0].fechaFin != null) {
                                fechaInicio = ToJavaScriptDate(lista_detalles.periodos[0].fechaInicio)
                                fechaFin = ToJavaScriptDate(lista_detalles.periodos[0].fechaFin)
                            }
                        }
                        catch (e) {
                            fechaInicio = '---';
                            fechaFin = '---';
                        }

                        var tabla = '<div><span  class="user-info" style="font-weight: bold;">Fecha Inicio: </span><span  class="user-info">' + fechaInicio + '</span><span class="user-info" style =" margin-left: 25px; font-weight: bold;" >Fecha Fin: </span><span  class="user-info">' + fechaFin + '</span></div></br><div style="height: 500px; overflow-y: scroll;"><table id="dynamic-table3" class="table hola table-striped table-bordered table-hover" cellpadding="0" cellspacing="0" border="1" class="display">';
                        tabla += '<thead>';
                        tabla += '<tr>';
                        tabla += '<th>FACTURA</th><th>FECHA FACTURA</th><th>FECHA ENVÍO</th><th>FECHA PAGO</th><th>DÍAS TRANSCURRIDOS</th><th>NO. CLIENTE</th><th>CLIENTE</th><th>EQUIPO</th><th>T.C.</th><th>NO. CONCEPTO</th><th>COMISIÓN</th><th>VENTA</th><th>TOTAL FACTURA</th><th>ADUANA</th><th>REFERENCIA</th><th>RENDICION</th>';
                        tabla += '</tr>';
                        tabla += '</thead>';
                        tabla += '<tbody>';
                        var tr = '';
                        $(lista_detalles.lista_detalles).each(function (i) {

                            tr += '<tr>';
                            tr += '<td>' + lista_detalles.lista_detalles[i].SOPNUMBE + '</td><td>' + ToJavaScriptDate(lista_detalles.lista_detalles[i].DATEFACTURA) + '</td>' + '<td>' + ToJavaScriptDate(lista_detalles.lista_detalles[i].DATEENVIO) + '</td><td>' + ToJavaScriptDate(lista_detalles.lista_detalles[i].DATEPAGO) + '</td>' + '<td>' + lista_detalles.lista_detalles[i].DIAS + '</td><td>' + lista_detalles.lista_detalles[i].CUSTNMBR + '</td>';
                            tr += '<td>' + lista_detalles.lista_detalles[i].CUSTNAME + '</td><td>' + lista_detalles.lista_detalles[i].GrupoNombre + '</td><td>' + lista_detalles.lista_detalles[i].TCPED + '</td>' + '<td>' + lista_detalles.lista_detalles[i].ITEMNMBR + '</td><td>' + lista_detalles.lista_detalles[i].COMISION + '</td>' + '<td>' + lista_detalles.lista_detalles[i].XTNDPRCE + '</td><td>' + lista_detalles.lista_detalles[i].SUBTOTAL + '</td>';
                            tr += '<td>' + lista_detalles.lista_detalles[i].ADUASECC + '</td><td>' + lista_detalles.lista_detalles[i].REFRENCE + '</td>' + '<td>' + lista_detalles.lista_detalles[i].RENDICION + '</td>';
                            tr += '</tr>';

                        });

                        tabla += tr;

                        tabla += '</tbody></table></div>';

                        //Aqui inicia el nuevo Layout con Excel y PDF

                        var tabla3 = '<div><span  class="user-info" style="font-weight: bold;">Fecha Inicio: </span><span  class="user-info" id="fecha1">' + fechaInicio + '</span><span class="user-info" style =" margin-left: 25px; font-weight: bold;" >Fecha Fin: </span><span  class="user-info" id="fecha2">' + fechaFin + '</span></div></br><div style="height: 160px; overflow-y: hidden;">';
                        tabla3 += '<table class="table table-bordered table-hover" style="width:100%; margin: auto;" cellpadding="0" cellspacing="0" border="1" class="display" id="comision_cliente6">';
                        tabla3 += '<thead>';
                        tabla3 += '<tr>';
                        tabla3 += '<th colspan = "3" rowspan="4" style="text-align: center"><img src="http://cdn2.hubspot.net/hub/2039173/hubfs/site/GrupoEi-agencia-aduanal-en-mexico-logo.png?t=1501783955921&width=190&name=GrupoEi-agencia-aduanal-en-mexico-logo.png" alt="IMAGES" /></th><th colspan = "10" rowspan="4" style="text-align: center">Grupo EI SA de CV</th><th colspan = "3" rowspan="4" style="text-align: center">Reporte de Periodos Anteriores</th>';
                        tabla3 += '</tr>';

                        tabla3 += '<tr>';
                        tabla3 += '</tr>';

                        tabla3 += '<tr>';
                        tabla3 += '</tr>';

                        tabla3 += '<tr>';
                        tabla3 += '</tr>';

                        tabla3 += '<tr>';
                        tabla3 += '<th colspan = "3">Fecha Inicio: ' + fechaInicio + '</th><th colspan = "3">Fecha Fin: ' + fechaFin + '</th><th colspan = "5">Vendedor: ' + idCodigoVendedor + ' - ' + strCodigoVendedor + '</th><th colspan = "3">Periodo: ' + SplitPeriodos[0] + '</th><th colspan = "2" style="text-align: right">Pag. 1</th>';
                        tabla3 += '</tr>';
                        tabla3 += '</thead></br></table>';


                        var tabla2 = '<div style="height: 280px; overflow-y: scroll;">';
                        tabla2 += '<table id="table2" class="table hola table-striped table-bordered table-hover" cellpadding="0" cellspacing="0" border="1" class="display" >';
                        tabla2 += '<thead>';
                        tabla2 += '<tr>';
                        tabla2 += '<th>FACTURA</th><th>FECHA FACTURA</th><th>FECHA ENVÍO</th><th>FECHA PAGO</th><th>DÍAS TRANSCURRIDOS</th><th>NO. CLIENTE</th><th>CLIENTE</th><th>EQUIPO</th><th>T.C.</th><th>NO. CONCEPTO</th><th>COMISIÓN</th><th>VENTA</th><th>TOTAL FACTURA</th><th>ADUANA</th><th>REFERENCIA</th><th>RENDICION</th>';
                        tabla2 += '</tr>';
                        tabla2 += '</thead>';
                        tabla2 += '<tbody>';
                        var tr = '';
                        $(lista_detalles.lista_detalles).each(function (i) {

                            tr += '<tr>';
                            tr += '<td>' + lista_detalles.lista_detalles[i].SOPNUMBE + '</td><td>' + ToJavaScriptDate(lista_detalles.lista_detalles[i].DATEFACTURA) + '</td>' + '<td>' + ToJavaScriptDate(lista_detalles.lista_detalles[i].DATEENVIO) + '</td><td>' + ToJavaScriptDate(lista_detalles.lista_detalles[i].DATEPAGO) + '</td>' + '<td>' + lista_detalles.lista_detalles[i].DIAS + '</td><td>' + lista_detalles.lista_detalles[i].CUSTNMBR + '</td>';
                            tr += '<td>' + lista_detalles.lista_detalles[i].CUSTNAME + '</td><td>' + lista_detalles.lista_detalles[i].GrupoNombre + '</td><td>' + lista_detalles.lista_detalles[i].TCPED + '</td>' + '<td>' + lista_detalles.lista_detalles[i].ITEMNMBR + '</td><td>' + lista_detalles.lista_detalles[i].COMISION + '</td>' + '<td>' + lista_detalles.lista_detalles[i].XTNDPRCE + '</td><td>' + lista_detalles.lista_detalles[i].SUBTOTAL + '</td>';
                            tr += '<td>' + lista_detalles.lista_detalles[i].ADUASECC + '</td><td>' + lista_detalles.lista_detalles[i].REFRENCE + '</td>' + '<td>' + lista_detalles.lista_detalles[i].RENDICION + '</td>';
                            tr += '</tr>';

                        });

                        tabla2 += tr;

                        tabla2 += '</tbody></table></div>';

                        $('#container_report').html(tabla);
                        $('#container_report2').html(tabla2);
                        $('#container_report3').html(tabla3);


                        $('#table2')
                        .dataTable({
                            "paging": false,
                            language: {
                                "sProcessing": "Procesando...",
                                "sLengthMenu": "Mostrar _MENU_ registros",
                                "sZeroRecords": "No se encontraron resultados",
                                "sEmptyTable": "Ningún dato disponible en esta tabla",
                                "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                                "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                                "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                                "sInfoPostFix": "",
                                "sSearch": "Buscar:",
                                "sUrl": "",
                                "sInfoThousands": ",",
                                "sLoadingRecords": "Cargando...",
                                "oPaginate": true,
                                //"oPaginate": {
                                //    "sFirst": "Primero",
                                //    "sLast": "Último",
                                //    "sNext": "Siguiente",
                                //    "sPrevious": "Anterior"
                                //},
                                "oAria": {
                                    "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                                }
                            },
                            dom: 'Bfrtlip',
                            buttons: [
                            ],
                            Columns: [
                                       { "data": "SOPNUMBE" },
                                       { "data": "DATEFACTURA" },
                                       { "data": "DATEENVIO" },
                                       { "data": "DATEPAGO" },
                                       { "data": "DIAS" },
                                       { "data": "CUSTNMBR" },
                                       { "data": "CUSTNAME" },
                                       { "data": "GrupoNombre" },
                                       { "data": "TCPED" },
                                       { "data": "ITEMNMBR" },
                                       { "data": "COMISION" },
                                       { "data": "XTNDPRCE" },
                                       { "data": "SUBTOTAL" },
                                       { "data": "ADUASECC" },
                                       { "data": "REFRENCE" },
                                       { "data": "RENDICION" }
                            ],
                            bAutoWidth: true,
                            aoColumns: [
                                { sTitle: "FACTURA", mData: "SOPNUMBE", bSortable: true },
                                { sTitle: "FECHA FACTURA", mData: "DATEFACTURA", bSortable: true },
                                { sTitle: "FECHA ENVÍO", mData: "DATEENVIO", bSortable: true },
                                { sTitle: "FECHA PAGO", mData: "DATEPAGO", bSortable: true },
                                { sTitle: "DÍAS TRANSCURRIDOS", mData: "DIAS", bSortable: true },
                                { sTitle: "NO. CLIENTE", mData: "CUSTNMBR", bSortable: true },
                                { sTitle: "CLIENTE", mData: "CUSTNAME", bSortable: true },
                                { sTitle: "EQUIPO", mData: "GrupoNombre", bSortable: true },
                                { sTitle: "T.C.", mData: "TCPED", bSortable: true },
                                { sTitle: "NO. CONCEPTO", mData: "ITEMNMBR", bSortable: true },
                                { sTitle: "COMISIÓN", mData: "COMISION", bSortable: true },
                                { sTitle: "VENTA", mData: "XTNDPRCE", bSortable: true },
                                { sTitle: "TOTAL FACTURA", mData: "SUBTOTAL", bSortable: true },
                                { sTitle: "ADUANA", mData: "ADUASECC", bSortable: true },
                                { sTitle: "REFERENCIA", mData: "REFRENCE", bSortable: true },
                                { sTitle: "RENDICION", mData: "RENDICION", bSortable: true }
                            ],
                            /* inside datatable initialization */
                            "aoColumnDefs": [
                            ],
                            "aaSorting": []
                        });


                        $("#cmd").show();
                        $("#cmd_excel").show();

                        //$('#div_ComisionesCliente').html(tabla);


                        //var tabla = '<div><span  class="user-info" style="font-weight: bold;">Fecha Inicio: </span><span  class="user-info">' + fechaInicio + '</span><span class="user-info" style =" margin-left: 25px; font-weight: bold;" >Fecha Fin: </span><span  class="user-info">' + fechaFin + '</span></div></br><div style="height: 280px; overflow-y: scroll;"><table id="dynamic-table" class="table hola table-striped table-bordered table-hover" cellpadding="0" cellspacing="0" border="1" class="display" >';
                        //tabla += '<thead>';
                        //tabla += '<tr>';
                        //tabla += '<th>FACTURA</th><th>FECHA FACTURA</th><th>FECHA ENVÍO</th><th>FECHA PAGO</th><th>DÍAS</th><th>NO. CLIENTE</th><th>CLIENTE</th><th>EQUIPO</th><th>T.C.</th><th>NO. CONCEPTO</th><th>COMISIÓN</th><th>VENTA</th><th>TOTAL FACTURA</th><th>ADUANA</th><th>REFERENCIA</th><th>RENDICION</th>';
                        //tabla += '</tr>';
                        //tabla += '</thead>';
                        //tabla += '<tbody>';
                        //var tr = '';

                        //$(lista_detalles.lista_detalles).each(function (i) {

                        //    tr += '<tr>';
                        //    tr += '<td>' + lista_detalles.lista_detalles[i].SOPNUMBE + '</td><td>' + ToJavaScriptDate(lista_detalles.lista_detalles[i].DATEFACTURA) + '</td>' + '<td>' + ToJavaScriptDate(lista_detalles.lista_detalles[i].DATEENVIO) + '</td><td>' + ToJavaScriptDate(lista_detalles.lista_detalles[i].DATEPAGO) + '</td>' + '<td>' + lista_detalles.lista_detalles[i].DIAS + '</td><td>' + lista_detalles.lista_detalles[i].CUSTNMBR + '</td>';
                        //    tr += '<td>' + lista_detalles.lista_detalles[i].CUSTNAME + '</td><td>' + lista_detalles.lista_detalles[i].GrupoNombre + '</td><td>' + lista_detalles.lista_detalles[i].TCPED + '</td>' + '<td>' + lista_detalles.lista_detalles[i].ITEMNMBR + '</td><td>' + lista_detalles.lista_detalles[i].COMISION + '</td>' + '<td>' + lista_detalles.lista_detalles[i].XTNDPRCE + '</td><td>' + lista_detalles.lista_detalles[i].SUBTOTAL + '</td>';
                        //    tr += '<td>' + lista_detalles.lista_detalles[i].ADUASECC + '</td><td>' + lista_detalles.lista_detalles[i].REFRENCE + '</td>' + '<td>' + lista_detalles.lista_detalles[i].RENDICION + '</td>';
                        //    tr += '</tr>';

                        //});

                        //tabla += tr;

                        //tabla += '</tbody></table></div>';

                        //$('#div_ReportePeriodoAnterior').html(tabla);
                    }
                    else {
                        var tabla = '<div class="alert alert-danger"><i class="ace-icon fa fa-times"></i></button><strong></i>Atención! </strong>El periodo seleccionado no existe para este vendedor, o fue generado con comisiones en ceros.<br></div>'
                        $('#div_ReportePeriodoAnterior').html(tabla);
                    }
                   

                   
                }
            },
            error: function FailureCallback(result) {
                alert("error : " + result);
            }
        });

    }
    else {
        fnMensajeModalError("Debe seleccionar el periodo y vendedor");
    }

    //event.preventDefault();
});

$('#generarClienteVendedor').on('click', function (event) {
    Report = 4;
    var idCodigoVendedor = $('#vendedoresClienteVendedor').val();

    if (idCodigoVendedor != null && idCodigoVendedor != "") {

        $('#Reportes').html("<div style='text-align: center;'><img style='vertical-align: middle;' src='../assets/img/progress_bar2.gif'/></div>");

        $('#container_report').html('');
        $('#container_report2').html('');
        $('#container_report3').html('');
        $("#ContainerModal").modal('toggle');
        $("#ContainerModalLabel").html('Reporte Catalogo Cliente - Vendedor')


        $.ajax({
            url: '/comisiones/Consultas/generarCatalogoClienteVendedor',
            type: "POST",
            data: { codigoVendedor: idCodigoVendedor },
            dataType: "JSON",
            success: function SuccessCallback(lista_vendedores) {
                if (!lista_vendedores.error) {

                    var tabla = '<div style="height: 500px; overflow-y: scroll;"><table id="dynamic-table4" class="table hola table-striped table-bordered table-hover" cellpadding="0" cellspacing="0" border="1" class="display">';
                    tabla += '<thead>';
                    tabla += '<tr>';
                    tabla += '<th>EMPRESA</th><th>ID CLIENTE</th><th>NOMBRE CLIENTE</th><th>DÍAS DE CREDITO</th><th>DÍAS DE RETENCIÓN</th><th>DÍAS DE GRACIA</th><th>ID VENDEDOR</th><th>NOMBRE VENDEDOR</th>';
                    tabla += '</tr>';
                    tabla += '</thead>';
                    tabla += '<tbody>';
                    var tr = '';
                    $(lista_vendedores.lista_vendedores).each(function (i) {

                        tr += '<tr>';
                        tr += '<td>' + lista_vendedores.lista_vendedores[i].idEmpresa + '</td><td>' + lista_vendedores.lista_vendedores[i].idCliente + '</td>' + '<td>' + lista_vendedores.lista_vendedores[i].strNombreCliente + '</td><td>' + lista_vendedores.lista_vendedores[i].intDiasCredito + '</td>' + '<td>' + lista_vendedores.lista_vendedores[i].intDiasRetencion + '</td><td>' + lista_vendedores.lista_vendedores[i].intDiasGracia + '</td>';
                        tr += '<td>' + lista_vendedores.lista_vendedores[i].idCodigoVendedor + '</td><td>' + lista_vendedores.lista_vendedores[i].nombreVendedor + '</td>';
                        tr += '</tr>';

                    });

                    tabla2 += tr;

                    tabla += tr;

                    tabla += '</tbody></table></div>';

                    //Aqui inicia el nuevo Layout con Excel y PDF

                    
                    var tabla3 = '<div style="height: 120px; overflow-y: hidden;">';
                    tabla3 += '<table class="table table-bordered table-hover" style="width:100%; margin: auto;" cellpadding="0" cellspacing="0" border="1" class="display" id="comision_cliente8">';
                    tabla3 += '<thead>';
                    tabla3 += '<tr>';
                    tabla3 += '<th colspan = "2" rowspan="4" style="text-align: center"><img src="http://cdn2.hubspot.net/hub/2039173/hubfs/site/GrupoEi-agencia-aduanal-en-mexico-logo.png?t=1501783955921&width=190&name=GrupoEi-agencia-aduanal-en-mexico-logo.png" alt="IMAGES" /></th><th colspan = "4" rowspan="4" style="text-align: center">Grupo EI SA de CV</th><th colspan = "2" rowspan="4" style="text-align: center">Reporte de Periodos Anteriores</th>';
                    tabla3 += '</tr>';

                    tabla3 += '<tr>';
                    tabla3 += '</tr>';

                    tabla3 += '<tr>';
                    tabla3 += '</tr>';

                    tabla3 += '<tr>';
                    tabla3 += '</tr>';

                    tabla3 += '</thead></br></table>';


                    var tabla2 = '<div style="height: 280px; overflow-y: scroll;">';
                    tabla2 += '<table id="table2" class="table hola table-striped table-bordered table-hover" cellpadding="0" cellspacing="0" border="1" class="display" >';
                    tabla2 += '<thead>';
                    tabla2 += '<tr>';
                    tabla2 += '<th>EMPRESA</th><th>ID CLIENTE</th><th>NOMBRE CLIENTE</th><th>DÍAS DE CREDITO</th><th>DÍAS DE RETENCIÓN</th><th>DÍAS DE GRACIA</th><th>ID VENDEDOR</th><th>NOMBRE VENDEDOR</th>';
                    tabla2 += '</tr>';
                    tabla2 += '</thead>';
                    tabla2 += '<tbody>';
                    var tr = '';
                    $(lista_vendedores.lista_vendedores).each(function (i) {

                        tr += '<tr>';
                        tr += '<td>' + lista_vendedores.lista_vendedores[i].idEmpresa + '</td><td>' + lista_vendedores.lista_vendedores[i].idCliente + '</td>' + '<td>' + lista_vendedores.lista_vendedores[i].strNombreCliente + '</td><td>' + lista_vendedores.lista_vendedores[i].intDiasCredito + '</td>' + '<td>' + lista_vendedores.lista_vendedores[i].intDiasRetencion + '</td><td>' + lista_vendedores.lista_vendedores[i].intDiasGracia + '</td>';
                        tr += '<td>' + lista_vendedores.lista_vendedores[i].idCodigoVendedor + '</td><td>' + lista_vendedores.lista_vendedores[i].nombreVendedor + '</td>';
                        tr += '</tr>';

                    });

                    tabla2 += tr;

                    tabla2 += '</tbody></table></div>';

                    $('#container_report').html(tabla);
                    $('#container_report2').html(tabla2);
                    $('#container_report3').html(tabla3);
                    
                    $('#table2')
                        .dataTable({
                            "paging": false,
                            language: {
                                "sProcessing": "Procesando...",
                                "sLengthMenu": "Mostrar _MENU_ registros",
                                "sZeroRecords": "No se encontraron resultados",
                                "sEmptyTable": "Ningún dato disponible en esta tabla",
                                "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                                "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                                "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                                "sInfoPostFix": "",
                                "sSearch": "Buscar:",
                                "sUrl": "",
                                "sInfoThousands": ",",
                                "sLoadingRecords": "Cargando...",
                                "oPaginate": true,
                                //"oPaginate": {
                                //    "sFirst": "Primero",
                                //    "sLast": "Último",
                                //    "sNext": "Siguiente",
                                //    "sPrevious": "Anterior"
                                //},
                                "oAria": {
                                    "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                                }
                            },
                            dom: 'Bfrtlip',
                            buttons: [
                            ],
                            Columns: [
                                       { "data": "idEmpresa" },
                                       { "data": "idCliente" },
                                       { "data": "strNombreCliente" },
                                       { "data": "intDiasCredito" },
                                       { "data": "intDiasRetencion" },
                                       { "data": "intDiasGracia" },
                                       { "data": "idCodigoVendedor" },
                                       { "data": "nombreVendedor" }
                            ],
                            bAutoWidth: true,
                            aoColumns: [
                                { sTitle: "EMPRESA", mData: "idEmpresa", bSortable: true },
                                { sTitle: "ID CLIENTE", mData: "idCliente", bSortable: true },
                                { sTitle: "NOMBRE CLIENTE", mData: "strNombreCliente", bSortable: true },
                                { sTitle: "DÍAS DE CREDITO", mData: "intDiasCredito", bSortable: true },
                                { sTitle: "DÍAS DE RETENCIÓN", mData: "intDiasRetencion", bSortable: true },
                                { sTitle: "DÍAS DE GRACIA", mData: "intDiasGracia", bSortable: true },
                                { sTitle: "ID VENDEDOR", mData: "idCodigoVendedor", bSortable: true },
                                { sTitle: "NOMBRE VENDEDOR", mData: "nombreVendedor", bSortable: true }
                            ],
                            /* inside datatable initialization */
                            "aoColumnDefs": [
                            ],
                            "aaSorting": []
                        });

                    $("#cmd").show();
                    $("#cmd_excel").show();

                    //var tabla = '<div style="height: 280px; overflow-y: scroll;"><table id="dynamic-table" class="table hola table-striped table-bordered table-hover" cellpadding="0" cellspacing="0" border="1" class="display" >';
                    //tabla += '<thead>';
                    //tabla += '<tr>';
                    //tabla += '<th>EMPRESA</th><th>ID CLIENTE</th><th>NOMBRE CLIENTE</th><th>DÍAS DE CREDITO</th><th>DÍAS DE RETENCIÓN</th><th>DÍAS DE GRACIA</th><th>ID VENDEDOR</th><th>NOMBRE VENDEDOR</th>';
                    //tabla += '</tr>';
                    //tabla += '</thead>';
                    //tabla += '<tbody>';
                    //var tr = '';

                    //$(lista_vendedores.lista_vendedores).each(function (i) {

                    //    tr += '<tr>';
                    //    tr += '<td>' + lista_vendedores.lista_vendedores[i].idEmpresa + '</td><td>' + lista_vendedores.lista_vendedores[i].idCliente + '</td>' + '<td>' + lista_vendedores.lista_vendedores[i].strNombreCliente + '</td><td>' + lista_vendedores.lista_vendedores[i].intDiasCredito + '</td>' + '<td>' + lista_vendedores.lista_vendedores[i].intDiasRetencion + '</td><td>' + lista_vendedores.lista_vendedores[i].intDiasGracia + '</td>';
                    //    tr += '<td>' + lista_vendedores.lista_vendedores[i].idCodigoVendedor + '</td><td>' + lista_vendedores.lista_vendedores[i].nombreVendedor + '</td>';
                    //    tr += '</tr>';

                    //});

                    //tabla += tr;

                    //tabla += '</tbody></table></div>';

                    $('#div_ClienteVendedor').html(tabla);
                }
            },
            error: function FailureCallback(result) {
                alert("error : " + result);
            }
        });

    }
    else {
        fnMensajeModalError("Debe seleccionar el vendedor");
    }

    //event.preventDefault();
});

function fnMensajeModalError(msj) {
    bootbox.dialog({
        message: "<span class='bigger-110'>" + msj + "</span>",
        buttons:
        {
            "danger":
            {
                "label": "Cerrar aviso",
                "className": "btn-sm btn-danger",
                "callback": function () {
                    //Example.show("uh oh, look out!");
                }
            }
        }
    });
}

function ToJavaScriptDate(value) {
    var pattern = /Date\(([^)]+)\)/;
    var results = pattern.exec(value);
    var dt = new Date(parseFloat(results[1]));
    return dt.getDate() + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear();
    //return (dt.getMonth() + 1) + "/" + dt.getDate() + "/" + dt.getFullYear();
}

$('input[name=date-range-picker]').daterangepicker({
    'applyClass': 'btn-sm btn-success',
    'cancelClass': 'btn-sm btn-default',
    locale: {
        format: 'DD-MM-YYYY',
        applyLabel: 'Aplicar',
        cancelLabel: 'Cancelar',
        daysOfWeek: [
       "Do",
       "Lu",
       "Ma",
       "Mi",
       "Ju",
       "Vi",
       "Sb"
        ],
        monthNames: [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre"
        ]
    }
})

$(".select2").select2({ allowClear: true })
      .on('change', function () {
          $(this).closest('form').validate().element($(this));
      });
   

$("#strPeriodoResumenComisiones").change(function () {
    if ($(this).val() != "") {
        $("#id-date-range-picker-1").prop("disabled", true);
    }
    else {
        $("#id-date-range-picker-1").prop("disabled", false);
    }
    //

});



//-------------------------------------------------------------------------------------


$('#cmd_excel').on('click', function (event) {
    event.preventDefault();
    var utc = new Date().toJSON().slice(0, 10).replace(/-/g, '_');
    //alert(Report);
   // ResumenComisionesVendedor_Excel();

    if (Report == 1) {
        ResumenComisionesVendedor_Excel();
    }
    if (Report == 2) {
        ReporteComisionesClientesFechas_Excel();
    }
     if (Report == 3) {
        ReportePeriodosAnteriores_Excel();
    }
     if (Report == 4) {
         ClienteVendedor_Excel();
     }
    // tableToExcel('comision_cliente2', 'Resumen de comisiones por vendedor');



});

$('#cmd').on('click', function (event) {

    event.preventDefault();

    if (Report == 1) {
        ResumenComisionesVendedor_PDF();
    }
    if (Report == 2) {
        ReporteComisionesClientesFechas_PDF();
    }
    if (Report == 3) {
        ReportePeriodosAnteriores_PDF();
    }
    if (Report == 4) {
        ClienteVendedor_PDF();
    }
});

function tableToJson(table) {
    var data = [];

    var headers = [];
    for (var i = 0; i < table.rows[0].cells.length; i++) {
        headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi, '');
    }

    for (var i = 1; i < table.rows.length; i++) {

        var tableRow = table.rows[i];
        var rowData = {};

        for (var j = 0; j < tableRow.cells.length; j++) {
            rowData[headers[j]] = tableRow.cells[j].innerHTML;

        }

        data.push(rowData);
    }

    return data;
}


function ResumenComisionesVendedor_Excel() {
    tableToExcel('comision_cliente2', 'Resumen de comisiones por vendedor');
}

function ResumenComisionesVendedor_PDF() {
    var doc = new jsPDF('l', 'pt', 'letter');

    var a = tableToJson($('#comision_cliente').get(0));
    var res = doc.autoTableHtmlToJson(document.getElementById("comision_cliente"));

    var totalPagesExp = "{total_pages_count_string}";
    var base64Img = "data:image/png;base64,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";

    var SplitPeriodos = $("#strPeriodoReporte option:selected").text().trim().split('-')
    var idCodigoVendedor = $('#vendedoresCmb').val();
    var strCodigoVendedor = $('#vendedoresCmb option:selected').text();
    var fechaInicio = $('#fechaInicio').html();
    var fechaFin = $('#fechaFin').html();

    var pageContent = function (data) {
        // HEADER
        doc.setFontSize(16);
        doc.setTextColor(40);
        doc.setFontStyle('normal');
        if (base64Img) {
            doc.addImage(base64Img, 'JPEG', 40, 10, 80, 30);
        }
        doc.setFontType("bold");
        doc.text("Grupo EI SA de CV", 330, 22);
        doc.setFontType("normal");
        doc.text("Reporte", 380, 40);
        doc.setFontType("bold");
        doc.text("Resumen de comisiones por vendedor", 485, 22);

        doc.setFontSize(10);
        doc.setFontType("bold");
        doc.text("Fecha Inicio:", 15, 60);
        doc.setFontType("normal");
        doc.text(fechaInicio, 80, 60);

        doc.setFontType("bold");
        doc.text("Fecha Fin:", 140, 60);
        doc.setFontType("normal");
        doc.text(fechaFin, 195, 60);

        doc.setFontType("bold");
        doc.text("Periodo:", 255, 60);
        doc.setFontType("normal");
        doc.text(SplitPeriodos[0], 300, 60);

        doc.setFontType("bold");
        doc.text("Nombre:", 320, 60);
        doc.setFontType("normal");
        doc.text(idCodigoVendedor + " - " + strCodigoVendedor, 365, 60);

        doc.setFontType("bold");
        doc.text("Pag.", 720, 60);
        doc.setFontType("normal");
        doc.text("" + data.pageCount, 750, 60);

    };

    //OBTENER ROW PERSONALIZADA
    var hidden = $("#breakLine").html();
    var filaEspecial = hidden.split("-");
    var LineSpe = parseInt(filaEspecial[0]);

    //pdf.autoTable(res.columns, res.data);
    doc.autoTable(res.columns, res.data, {
        addPageContent: pageContent,
        margin: { top: 70, left: 160, right: 160, bottom: 0 },
        theme: 'grid',
        drawRow: function (row, data) {
            if (row.key == '')
                // Colspan
                doc.setFontStyle('bold');
            doc.setFontSize(10);
            if (row.index === LineSpe) {
                doc.setTextColor(0, 0, 0);
                doc.rect(data.settings.margin.left, row.y, data.table.width, 20, 'S');
                doc.autoTableText("$ " + filaEspecial[1], data.settings.margin.left + data.table.width / 2, row.y + row.height / 2, {
                    halign: 'center',
                    valign: 'middle'
                });
                data.cursor.y += 20;
            }
        },
        drawCell: function (cell, data) {
            if (data.column.dataKey === 'MONTO') {
                doc.rect(cell.x, cell.y, data.table.width, cell.height * 5, 'S');
                doc.autoTableText(data.row.index / 5 + 1 + '', cell.x + cell.width / 2, cell.y + cell.height * 5 / 2, {
                    halign: 'center',
                    valign: 'right'
                });
            }
        }

    });
    doc.save('Resumen de comisiones por vendedor.pdf');
}

function ReporteComisionesClientesFechas_Excel() {
    tableToExcel('comision_cliente4', 'Reporte de Comisiones por Cliente y fechas');
}

function ReporteComisionesClientesFechas_PDF() {
    var doc = new jsPDF('l', 'pt', 'letter');

    //var res = doc.autoTableHtmlToJson(document.getElementById("comision_cliente3"));

    var a = tableToJson($('#dynamic-table2').get(0));
    var res = doc.autoTableHtmlToJson(document.getElementById("dynamic-table2"));

    var totalPagesExp = "{total_pages_count_string}";
    var base64Img = "data:image/png;base64,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";

    var idCliente = $('#idCliente').val();
    var idEmpresaSelect = $('#IdEmpresa').val();

    var strCliente = $('#idCliente option:selected').text();
    var strEmpresa = $('#IdEmpresa option:selected').text();

    var dtFechaInicio = $('#id-date-range-picker-2').val().slice(0, 10).trim();
    var dtFechaFin = $('#id-date-range-picker-2').val().slice(13, 23).trim();

    var fechaInicio = dtFechaInicio;
    var fechaFin = dtFechaFin;

    var cualquierFecha = "No";
    if ($('#strFecha').is(':checked')) {
        cualquierFecha = "Si";

        fechaInicio = "---";
        fechaFin = "---";
    }

    var pageContent = function (data) {
        // HEADER
        doc.setFontSize(16);
        doc.setTextColor(40);
        doc.setFontStyle('normal');
        if (base64Img) {
            doc.addImage(base64Img, 'JPEG', 40, 10, 80, 30);
        }
        doc.setFontType("bold");
        doc.text("Grupo EI SA de CV", 330, 22);
        doc.setFontType("normal");
        doc.text("Reporte", 380, 40);
       

        doc.setFontSize(10);
        doc.setFontType("bold");
        doc.text("Rep. de Comisiones por Cliente y Fechas", 550, 22);
        doc.setFontType("bold");
        doc.text("Fecha Inicio:", 15, 60);
        doc.setFontType("normal");
        doc.text(fechaInicio, 80, 60);

        doc.setFontType("bold");
        doc.text("Fecha Fin:", 140, 60);
        doc.setFontType("normal");
        doc.text(fechaFin, 195, 60);

        doc.setFontType("bold");
        doc.text("Empresa:", 255, 60);
        doc.setFontType("normal");
        doc.text(strEmpresa, 300, 60);

        doc.setFontType("bold");
        doc.text("Cliente:", 320, 60);
        doc.setFontType("normal");
        doc.text(idCliente + " - " + strCliente, 365, 60);

        doc.setFontType("bold");
        doc.text("Pag.", 720, 60);
        doc.setFontType("normal");
        doc.text("" + data.pageCount, 750, 60);


    };

    //pdf.autoTable(res.columns, res.data);
    doc.autoTable(res.columns, res.data, {
        addPageContent: pageContent,
        margin: { top: 70, left: 20, right: 20, bottom: 20 },
        theme: 'grid',
        styles: { fontSize: 5 },

    });



    doc.save('Rep. de Comisiones por Cliente y Fechas.pdf');
}

function ReportePeriodosAnteriores_Excel() {
    tableToExcel('comision_cliente6', 'Reporte de Periodos Anteriores');
}

function ReportePeriodosAnteriores_PDF() {
    var doc = new jsPDF('l', 'pt', 'letter');

    //var res = doc.autoTableHtmlToJson(document.getElementById("comision_cliente3"));

    var a = tableToJson($('#dynamic-table3').get(0));
    var res = doc.autoTableHtmlToJson(document.getElementById("dynamic-table3"));

    var totalPagesExp = "{total_pages_count_string}";
    var base64Img = "data:image/png;base64,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";

    var SplitPeriodos = $("#strPeriodoPeriodosAnteriores option:selected").text().trim().split('-');
    var idCodigoVendedor = $('#vendedoresPeriodosAnteriores').val();
    var strCodigoVendedor = $('#vendedoresPeriodosAnteriores option:selected').text();

    var fechaInicio = $("#fecha1").html();
    var fechaFin = $("#fecha2").html();
    var pageContent = function (data) {
        // HEADER
        doc.setFontSize(16);
        doc.setTextColor(40);
        doc.setFontStyle('normal');
        if (base64Img) {
            doc.addImage(base64Img, 'JPEG', 40, 10, 80, 30);
        }
        doc.setFontType("bold");
        doc.text("Grupo EI SA de CV", 330, 22);
        doc.setFontType("normal");
        doc.text("Reporte", 380, 40);


        doc.setFontSize(10);
        doc.setFontType("bold");
        doc.text("Reporte Periodos Anteriores", 600, 22);
        doc.setFontType("bold");
        doc.text("Fecha Inicio:", 15, 60);
        doc.setFontType("normal");
        doc.text(fechaInicio, 80, 60);

        doc.setFontType("bold");
        doc.text("Fecha Fin:", 140, 60);
        doc.setFontType("normal");
        doc.text(fechaFin, 195, 60);

        doc.setFontType("bold");
        doc.text("Periodo:", 255, 60);
        doc.setFontType("normal");
        doc.text(SplitPeriodos[0], 300, 60);

        doc.setFontType("bold");
        doc.text("Cliente:", 320, 60);
        doc.setFontType("normal");
        doc.text(idCodigoVendedor + " - " + strCodigoVendedor, 365, 60);

        doc.setFontType("bold");
        doc.text("Pag.", 720, 60);
        doc.setFontType("normal");
        doc.text("" + data.pageCount, 750, 60);


    };

    //pdf.autoTable(res.columns, res.data);
    doc.autoTable(res.columns, res.data, {
        addPageContent: pageContent,
        margin: { top: 70, left: 20, right: 20, bottom: 20 },
        theme: 'grid',
        styles: { fontSize: 5 },

    });



    doc.save('Reporte de periodos anteriores.pdf');
}

function ClienteVendedor_Excel() {
    tableToExcel('comision_cliente8', 'Reporte Catalogo Cliente-Vendedor ');
}

function ClienteVendedor_PDF() {
    var doc = new jsPDF('l', 'pt', 'letter');

    //var res = doc.autoTableHtmlToJson(document.getElementById("comision_cliente3"));

    var a = tableToJson($('#dynamic-table4').get(0));
    var res = doc.autoTableHtmlToJson(document.getElementById("dynamic-table4"));

    var totalPagesExp = "{total_pages_count_string}";
    var base64Img = "data:image/png;base64,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";

    var idCodigoVendedor = $('#vendedoresClienteVendedor').val();
    var strCodigoVendedor = $('#vendedoresClienteVendedor option:selected').text();

    var fechaInicio = $("#fecha1").html();
    var fechaFin = $("#fecha2").html();
    var pageContent = function (data) {
        // HEADER
        doc.setFontSize(16);
        doc.setTextColor(40);
        doc.setFontStyle('normal');
        if (base64Img) {
            doc.addImage(base64Img, 'JPEG', 40, 10, 80, 30);
        }
        doc.setFontType("bold");
        doc.text("Grupo EI SA de CV", 330, 22);
        doc.setFontType("normal");
        doc.text("Reporte", 380, 40);


        doc.setFontSize(10);
        doc.setFontType("bold");
        doc.text("Reporte Catalogo Cliente-Vendedor", 600, 22);

        doc.setFontType("bold");
        doc.text("Vendedor:", 40, 60);
        doc.setFontType("normal");
        doc.text(idCodigoVendedor + " - " + strCodigoVendedor, 100, 60);

        doc.setFontType("bold");
        doc.text("Pag.", 720, 60);
        doc.setFontType("normal");
        doc.text("" + data.pageCount, 750, 60);


    };

    //pdf.autoTable(res.columns, res.data);
    doc.autoTable(res.columns, res.data, {
        addPageContent: pageContent,
        margin: { top: 70, left: 20, right: 20, bottom: 20 },
        theme: 'grid',
        styles: { fontSize: 5 },

    });



    doc.save('Reporte Catalogo Cliente-Vendedor.pdf');
}

$('#resumenCliente').on('click', function () {
    $('#ReporteClientes').html("<div style='text-align: center;'><img style='vertical-align: middle;' src='../assets/img/progress_bar2.gif'/></div>");


    var SplitPeriodos = $("#strPeriodo option:selected").text().trim().split('-')
    var idCodigoVendedor = $('#idCodigoVendedor').val();
    var dtFechaInicio = $('#id-date-range-picker-1').val().slice(0, 10).trim();
    var dtFechaFin = $('#id-date-range-picker-1').val().slice(13, 23).trim();

    var vendedorDefault = $('#hdnVendedorID').val();
    var periodoDefault = $('#hdnPeriodoID').val();

    $("#waitModalLabel").text("Resumen de Comisiones por Cliente");
    $('#ReporteClientes').load("/comisiones/Periodos/ReporteClientes?vendedorDefault=" + vendedorDefault + "&periodoDefault=" + periodoDefault, function () {
        verificaContenidoSesion();
    });
    $('#resumenModal').modal('toggle')



});

function verificaContenidoSesion() {
    var SinSesion = $("#ReporteClientes").html();
    //alert(SinSesion);

    if (SinSesion == "Sesión caducada") {
        window.location.href = '/comisiones/Home/';
    }
}

$('#detalleComisiones').on('click', function () {

    $('#ReporteClientes').html("<div style='text-align: center;'><img style='vertical-align: middle;' src='../assets/img/progress_bar2.gif'/></div>");

    var SplitPeriodos = $("#strPeriodo option:selected").text().trim().split('-')
    var idCodigoVendedor = $('#idCodigoVendedor').val();
    var dtFechaInicio = $('#id-date-range-picker-1').val().slice(0, 10).trim();
    var dtFechaFin = $('#id-date-range-picker-1').val().slice(13, 23).trim();

    var vendedorDefault = $('#hdnVendedorID').val();
    var periodoDefault = $('#hdnPeriodoID').val();

    $("#waitModalLabel").text("Detalle de Cálculo de Comisiones");
    $('#ReporteClientes').load("/comisiones/Periodos/DetalleComisiones?vendedorDefault=" + vendedorDefault + "&periodoDefault=" + periodoDefault, function () {
        verificaContenidoSesion();
    });
    $('#resumenModal').modal('toggle')



});

$('#detalleComisionesEquipo').on('click', function () {

    $('#ReporteClientes').html("<div style='text-align: center;'><img style='vertical-align: middle;' src='../assets/img/progress_bar2.gif'/></div>");

    var SplitPeriodos = $("#strPeriodo option:selected").text().trim().split('-')
    var idCodigoVendedor = $('#idCodigoVendedor').val();
    var dtFechaInicio = $('#id-date-range-picker-1').val().slice(0, 10).trim();
    var dtFechaFin = $('#id-date-range-picker-1').val().slice(13, 23).trim();

    var vendedorDefault = $('#hdnVendedorID').val();
    var periodoDefault = $('#hdnPeriodoID').val();

    $("#waitModalLabel").text("Resumen de Comisiones por Equipo");
    $('#ReporteClientes').load("/comisiones/Periodos/ComisionesEquipo?vendedorDefault=" + vendedorDefault + "&periodoDefault=" + periodoDefault, function () {
        verificaContenidoSesion();
    });

    $('#resumenModal').modal('toggle')




});

$('#detalleNoComisionables').on('click', function () {

    $('#ReporteClientes').html("<div style='text-align: center;'><img style='vertical-align: middle;' src='../assets/img/progress_bar2.gif'/></div>");

    var SplitPeriodos = $("#strPeriodo option:selected").text().trim().split('-')
    var idCodigoVendedor = $('#idCodigoVendedor').val();
    var dtFechaInicio = $('#id-date-range-picker-1').val().slice(0, 10).trim();
    var dtFechaFin = $('#id-date-range-picker-1').val().slice(13, 23).trim();

    var vendedorDefault = $('#hdnVendedorID').val();
    var periodoDefault = $('#hdnPeriodoID').val();

    $("#waitModalLabel").text("Detalle de No Comisionables");
    $('#ReporteClientes').load("/comisiones/Periodos/DetalleNoComisionables?vendedorDefault=" + vendedorDefault + "&periodoDefault=" + periodoDefault, function () {
        verificaContenidoSesion();
    });

    $('#resumenModal').modal('toggle')


});

$('#detalleRetenciones').on('click', function () {

    $('#ReporteClientes').html("<div style='text-align: center;'><img style='vertical-align: middle;' src='../assets/img/progress_bar2.gif'/></div>");

    var SplitPeriodos = $("#strPeriodo option:selected").text().trim().split('-')
    var idCodigoVendedor = $('#idCodigoVendedor').val();
    var dtFechaInicio = $('#id-date-range-picker-1').val().slice(0, 10).trim();
    var dtFechaFin = $('#id-date-range-picker-1').val().slice(13, 23).trim();

    var vendedorDefault = $('#hdnVendedorID').val();
    var periodoDefault = $('#hdnPeriodoID').val();

    $("#waitModalLabel").text("Detalle de Retenciones");
    $('#ReporteClientes').load("/comisiones/Periodos/DetalleRetenciones?vendedorDefault=" + vendedorDefault + "&periodoDefault=" + periodoDefault, function () {
        verificaContenidoSesion();
    });
    $('#resumenModal').modal('toggle')


});



$('#reseumenPagoComisionCuentaBancaria').on('click', function () {

    $('#ReporteClientes').html("<div style='text-align: center;'><img style='vertical-align: middle;' src='../assets/img/progress_bar2.gif'/></div>");

    var SplitPeriodos = $("#strPeriodo option:selected").text().trim().split('-')
    var idCodigoVendedor = $('#idCodigoVendedor').val();
    var dtFechaInicio = $('#id-date-range-picker-1').val().slice(0, 10).trim();
    var dtFechaFin = $('#id-date-range-picker-1').val().slice(13, 23).trim();

    var vendedorDefault = $('#hdnVendedorID').val();
    var periodoDefault = $('#hdnPeriodoID').val();

    $("#waitModalLabel").text("Resumen de Pagos de Comisiones");
    $('#ReporteClientes').load("/comisiones/Periodos/PagoComisionCuentaBancaria?vendedorDefault=" + vendedorDefault + "&periodoDefault=" + periodoDefault, function () {
        verificaContenidoSesion();
    });

    $('#resumenModal').modal('toggle')


});