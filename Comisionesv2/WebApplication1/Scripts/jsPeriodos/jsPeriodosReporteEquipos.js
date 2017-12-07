$('#buscarResumenEquipos').on('click', function (event) {
    var SplitPeriodos = $("#strPeriodoReporteEquipo option:selected").text().trim().split('-')
    var idCodigoVendedor = $('#vendedoresCmbEquipo').val();
    var strCodigoVendedor = $('#vendedoresCmbEquipo option:selected').text();
    var idEmpresaSelect = $('#strEmpresaReporteEquipo').val();

    if (SplitPeriodos != null && idCodigoVendedor != "" && idEmpresaSelect != "") {
     
        $.ajax({
            url: '/comisiones/Periodos/obtenerReporteEquipos',
            type: "POST",
            data: { numPeriodo: SplitPeriodos[0], anioPeriodo: SplitPeriodos[1], codigoVendedor: idCodigoVendedor, idEmpresa: idEmpresaSelect },
            dataType: "JSON",
            success: function SuccessCallback(lista_equipos) {
                if (!lista_equipos.error) {

                    var fechaInicio;
                    var fechaFin;

                    try
                    {
                        if (lista_equipos.periodos[0].fechaFin != "" && lista_equipos.periodos[0].fechaFin != 'undefined' && lista_equipos.periodos[0].fechaFin != null) {
                            fechaInicio = ToJavaScriptDate(lista_equipos.periodos[0].fechaInicio)
                            fechaFin = ToJavaScriptDate(lista_equipos.periodos[0].fechaFin)
                        }
                    }
                    catch (e)
                    {
                        fechaInicio = '---';
                        fechaFin = '---';
                    }

                    var suma = 0;
                    var tabla = '<div><span  class="user-info" style="font-weight: bold;">Fecha Inicio: </span><span  class="user-info" id ="fechaInicio">' + fechaInicio + '</span><span class="user-info" style =" margin-left: 25px; font-weight: bold;" >Fecha Fin: </span><span  class="user-info" id ="fechaFin">' + fechaFin + '</span></div></br><div style="height: 280px; overflow-y: scroll;"><table class="table table-bordered table-hover" style="width:50%; margin: auto;" cellpadding="0" cellspacing="0" border="1" class="display" id="comision_cliente">';
                    tabla += '<thead>';
                    tabla += '<tr>';
                    tabla += '<th>EQUIPO</th><th>MONTO</th>';
                    tabla += '</tr>';
                    tabla += '</thead>';
                    tabla += '<tbody>';
                    var tr = '';
                    var conteoClientes = 0;
                    $(lista_equipos.lista_equipos).each(function (i) {
                        suma = suma + lista_equipos.lista_equipos[i].MONTO;
                        tr += '<tr>';
                        tr += '<td>' + lista_equipos.lista_equipos[i].EQUIPO + '</td><td>' + lista_equipos.lista_equipos[i].MONTO + '</td>';
                        tr += '</tr>';
                        conteoClientes = conteoClientes + 1;
                    });
                    tabla += tr;
                    tabla += '<tr>';
                    tabla += '<td rowspan="1" scope="col">Comisión</td><td style="text-align: right">$' + lista_equipos.pieComisiones.COMISION + '</td>';
                    tabla += '</tr>';
                    tabla += '<tr>';
                    tabla += '<td rowspan="1" scope="col">No Comisionable</td><td style="text-align: right">$' + lista_equipos.pieComisiones.NOCOMISIONABLE + '</td>';
                    tabla += '</tr>';
                    tabla += '<tr>';
                    tabla += '<td rowspan="1" scope="col">Retención</td><td style="text-align: right">$' + lista_equipos.pieComisiones.RETENCION + '</td>';
                    tabla += '</tr>';
                    tabla += '<tr>';
                    tabla += '<td rowspan="1" scope="col">Total</td><td style="text-align: right">$' + lista_equipos.pieComisiones.TOTAL + '</td>';
                    tabla += '</tr>';
                    tabla += '<tr>';
                    tabla += '<td rowspan="1" scope="col">Liberar Retención</td><td style="text-align: right">$' + lista_equipos.pieComisiones.LIBERARRETENCION + '</td>';
                    tabla += '</tr>';
                    tabla += '<tr><th rowspan="1" scope="col">Total a Pagar</th> <td style="text-align: right"$>' + lista_equipos.pieComisiones.TOTALPAGAR + '</td> </tr>'
                    tabla += '</tbody></table></div><div id="breakLine" style="display:none;">' + conteoClientes + '-' + suma + '</div>';

                    //Para Excel es especial, ya que exporta todo completo

                    var tabla2 = '<div><span  class="user-info" style="font-weight: bold;">Fecha Inicio: </span><span  class="user-info" id ="fechaInicio">' + fechaInicio + '</span><span class="user-info" style =" margin-left: 25px; font-weight: bold;" >Fecha Fin: </span><span  class="user-info" id ="fechaFin">' + fechaFin + '</span></div></br><div style="height: 280px; overflow-y: scroll;"><table class="table table-bordered table-hover" style="width:100%; margin: auto;" cellpadding="0" cellspacing="0" border="1" class="display"  id="comision_cliente2">';
                    tabla2 += '<thead>';
                    tabla2 += '<tr>';
                    tabla2 += '<th colspan = "2" rowspan="4" style="text-align: center"><img src="http://cdn2.hubspot.net/hub/2039173/hubfs/site/GrupoEi-agencia-aduanal-en-mexico-logo.png?t=1501783955921&width=190&name=GrupoEi-agencia-aduanal-en-mexico-logo.png" alt="IMAGES" /></th><th colspan = "2"  rowspan="4" style="text-align: center">Grupo EI SA de CV</th><th colspan = "2"  rowspan="4" style="text-align: center">Resumen de Comisiones por Equipo</th>';
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
                    tabla2 += '<th colspan="2" ></th><th style="text-align: center; background-color: #87b87f; color: #fff">EQUIPO</th><th style="text-align: center; background-color: #87b87f; color: #fff">MONTO</th><th colspan="2"></th>';
                    tabla2 += '</tr>';
                    tabla2 += '</thead>';
                    tabla2 += '<tbody>';
                    var tr2 = '';

                    $(lista_equipos.lista_equipos).each(function (i) {
                        tr2 += '<tr>';
                        tr2 += '<td colspan="2"></td><td>' + lista_equipos.lista_equipos[i].EQUIPO + '</td><td style="text-align: right">$' + lista_equipos.lista_equipos[i].MONTO + '</td><td colspan="2"></td>';
                        tr2 += '</tr>';
                    });
                    tabla2 += tr2;
                    tabla2 += '<tr>';
                    tabla2 += '<td colspan="2"></td><td rowspan="1" scope="col">Comisión</td><td style="text-align: right">$' + lista_equipos.pieComisiones.COMISION + '</td><td colspan="2"></td>';
                    tabla2 += '</tr>';
                    tabla2 += '<tr>';
                    tabla2 += '<td colspan="2"></td><td rowspan="1" scope="col">No Comisionable</td><td style="text-align: right">$' + lista_equipos.pieComisiones.NOCOMISIONABLE + '</td><td colspan="2"></td>';
                    tabla2 += '</tr>';
                    tabla2 += '<tr>';
                    tabla2 += '<td colspan="2"></td><td rowspan="1" scope="col">Retención</td><td style="text-align: right">$' + lista_equipos.pieComisiones.RETENCION + '</td><td colspan="2"></td>';
                    tabla2 += '</tr>';
                    tabla2 += '<tr>';
                    tabla2 += '<td colspan="2"></td><td rowspan="1" scope="col">Total</td><td style="text-align: right">$' + lista_equipos.pieComisiones.TOTAL + '</td><td colspan="2"></td>';
                    tabla2 += '</tr>';
                    tabla2 += '<tr>';
                    tabla2 += '<td colspan="2"></td><td rowspan="1" scope="col">Liberar Retención</td><td style="text-align: right">$' + lista_equipos.pieComisiones.LIBERARRETENCION + '</td><td colspan="2"></td>';
                    tabla2 += '</tr>';
                    tabla2 += '<tr><td colspan="2"></td><th rowspan="1" scope="col">Total a Pagar</th> <td style="text-align: right"$>' + lista_equipos.pieComisiones.TOTALPAGAR + '</td> <td colspan="2"></td> </tr>'
                    tabla2 += '</tbody></table></div><div id="breakLine" style="display:none;">' + conteoClientes + '-' + suma + '</div>';

                    $('#div_ListaEquiposParcial').html(tabla);

                    $('#div_ListaEquiposParcial2').html(tabla2);

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
        fnMensajeModalError("Debe seleccionar periodo, vendedor y empresa");
    }

    event.preventDefault();
});

$('#cmd_excel').on('click', function (event) {
    event.preventDefault();
    var utc = new Date().toJSON().slice(0, 10).replace(/-/g, '_');

    tableToExcel('comision_cliente2', 'Resumen de Comisiones por Equipo');
});

$('#cmd').on('click', function (event) {

    //alert("Exportar a PDF");
    //doc.fromHTML($('#div_ListaParcial').html(), 15, 15, {
    //    'width': 170,
    //    'elementHandlers': specialElementHandlers
    //});

    event.preventDefault();

    //var columns = ['ID', 'Name', 'Address', 'Age'];
    //var rows = [
    //[1, 'John', 'Vilnius', 22],
    //[2, 'Jack', 'Riga', 25]
    //];

    var doc = new jsPDF('l', 'pt', 'letter');

    //doc.setFontSize(20);
    //doc.text(30, 30, 'Table');
    //doc.text(300, 30, 'Table 2');
    //var a = tableToJson($('#comision_cliente').get(0));
    var res = doc.autoTableHtmlToJson(document.getElementById("comision_cliente"));

    var totalPagesExp = "{total_pages_count_string}";
    var base64Img = "data:image/png;base64,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";

    var SplitPeriodos = $("#strPeriodoReporteEquipo option:selected").text().trim().split('-')
    var idCodigoVendedor = $('#vendedoresCmbEquipo').val();
    var strCodigoVendedor = $('#vendedoresCmbEquipo option:selected').text();
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
        doc.text("Resumen de Comisiones por Equipo", 500, 22);

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
        margin: { top: 70, left: 140, right: 140, bottom: 20 },
        theme: 'grid',
            drawRow: function (row, data) {
                if(row.key == '')
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
            }

    });



    doc.save('Resumen de Comisiones por Equipo.pdf');
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
    if (value != null && value != "") {
        var dt = new Date(parseFloat(results[1]));
        return dt.getDate() + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear();
    }
    else { return value; }
}