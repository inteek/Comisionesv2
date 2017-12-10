$('#buscarResumenPagoComisiones').on('click', function (event) {
    var SplitPeriodos = $("#strPeriodoDetalleNoComisionable option:selected").text().trim().split('-')
    //var idCodigoVendedor = $('#vendedoresCmbDetalleNoComisionable').val();
    //var strCodigoVendedor = $('#vendedoresCmbDetalleNoComisionable option:selected').text();
    var idEmpresaSelect = $('#strEmpresaDetalleNoComisionable').val();

    //if (SplitPeriodos != null && idCodigoVendedor != "" && idEmpresaSelect != "") {
    if (SplitPeriodos != null && idEmpresaSelect != "") {

        $.ajax({
            url: '/comisiones/Periodos/obtenerResumenPagoComisiones',
            type: "POST",
            //data: { numPeriodo: SplitPeriodos[0], anioPeriodo: SplitPeriodos[1], codigoVendedor: idCodigoVendedor, idEmpresa: idEmpresaSelect },
            data: { numPeriodo: SplitPeriodos[0], anioPeriodo: SplitPeriodos[1], idEmpresa: idEmpresaSelect },
            dataType: "JSON",
            success: function SuccessCallback(lista_detalles) {
                if (!lista_detalles.error) {

                    var fechaInicio;
                    var fechaFin;

                    try {
                        if (lista_detalles.periodos.length > 0 && lista_detalles.periodos[0].fechaFin != "" && lista_detalles.periodos[0].fechaFin != 'undefined' && lista_detalles.periodos[0].fechaFin != null) {
                            fechaInicio = ToJavaScriptDate(lista_detalles.periodos[0].fechaInicio)
                            fechaFin = ToJavaScriptDate(lista_detalles.periodos[0].fechaFin)
                        }
                    }
                    catch (e) {
                        fechaInicio = '---';
                        fechaFin = '---';
                    }

                    var tabla = '<div><span  class="user-info" style="font-weight: bold;">Fecha Inicio: </span><span  class="user-info" id ="fechaInicio">' + fechaInicio + '</span><span class="user-info" style =" margin-left: 25px; font-weight: bold;" >Fecha Fin: </span><span  class="user-info" id ="fechaFin">' + fechaFin + '</span></div></br><div style="height: 280px; overflow-y: scroll;">';
                    tabla += '<table id="dynamic-table" class="table hola table-striped table-bordered table-hover" cellpadding="0" cellspacing="0" border="1" class="display" >';
                    tabla += '<thead>';
                    tabla += '<tr>';
                    tabla += '<th>ID CODIGO VENDEDOR</th>';
                    tabla += '<th>VENDEDOR</th>';
                    tabla += '<th>PERIODO</th>';
                    tabla += '<th>FECHA INICIO</th>';
                    tabla += '<th>FECHA FIN</th>';
                    tabla += '<th>DEPOSITO</th>';
                    tabla += '<th>CLABEINTERBANCARIA</th>';
                    tabla += '<th>BANCO</th>';
                    tabla += '<th>ESQUEMA</th>';
                    tabla += '<th>CORREO</th>';
                    tabla += '</tr>';
                    tabla += '</thead>';
                    tabla += '<tbody>';
                    var tr = '';

                    $(lista_detalles.lista_detalles).each(function (i) {

                        tr += '<tr>';
                        tr += '<td>' + lista_detalles.lista_detalles[i].IDCODIGOVENDEDOR + '</td>';
                        tr += '<td>' + lista_detalles.lista_detalles[i].VENDEDOR + '</td>';
                        tr += '<td>' + lista_detalles.lista_detalles[i].PERIODO + '</td>';
                        tr += '<td>' + ToJavaScriptDate(lista_detalles.lista_detalles[i].FECHAINICIO) + '</td>';
                        tr += '<td>' + ToJavaScriptDate(lista_detalles.lista_detalles[i].FECHAFIN) + '</td>';
                        tr += '<td>' + lista_detalles.lista_detalles[i].TOTALPAGAR + '</td>';
                        tr += '<td>' + lista_detalles.lista_detalles[i].CLABEINTERBANCARIA + '</td>';
                        tr += '<td>' + lista_detalles.lista_detalles[i].BANCO + '</td>';
                        tr += '<td>' + lista_detalles.lista_detalles[i].ESQUEMA + '</td>';
                        tr += '<td>' + lista_detalles.lista_detalles[i].CORREO + '</td>';
                        tr += '</tr>';

                    });

                    tabla += tr;

                    tabla += '</tbody></table></div>';


                    var tabla2 = '<div><span  class="user-info" style="font-weight: bold;">Fecha Inicio: </span><span  class="user-info" id ="fechaInicio">' + fechaInicio + '</span><span class="user-info" style =" margin-left: 25px; font-weight: bold;" >Fecha Fin: </span><span  class="user-info" id ="fechaFin">' + fechaFin + '</span></div></br><div style="height: 280px; overflow-y: scroll;">';
                    tabla2 += '<table id="table2" class="table hola table-striped table-bordered table-hover" cellpadding="0" cellspacing="0" border="1" class="display" >';
                    tabla2 += '<thead>';
                    tabla2 += '<tr>';
                    tabla2 += '<th colspan = "6" rowspan="4" style="text-align: center"><img src="http://cdn2.hubspot.net/hub/2039173/hubfs/site/GrupoEi-agencia-aduanal-en-mexico-logo.png?t=1501783955921&width=190&name=GrupoEi-agencia-aduanal-en-mexico-logo.png" alt="IMAGES" /></th><th colspan = "5"  rowspan="4" style="text-align: center">Grupo EI SA de CV</th><th colspan = "5"  rowspan="4" style="text-align: center">Resumen de Pago de Comisiones</th>';
                    tabla2 += '</tr>';

                    tabla2 += '<tr>';
                    tabla2 += '</tr>';

                    tabla2 += '<tr>';
                    tabla2 += '</tr>';

                    tabla2 += '<tr>';
                    tabla2 += '</tr>';

                    tabla2 += '<tr>';
                    //tabla2 += '<th colspan = "3">Fecha Inicio: ' + fechaInicio + '</th><th colspan = "3">Fecha Fin: ' + fechaFin + '</th><th colspan = "3">Periodo: ' + SplitPeriodos[0] + '</th><th colspan = "5">Vendedor: ' + idCodigoVendedor + ' - ' + strCodigoVendedor + '</th><th colspan = "2" style="text-align: right">Pag. 1</th>';
                    tabla2 += '<th colspan = "3">Fecha Inicio: ' + fechaInicio + '</th><th colspan = "3">Fecha Fin: ' + fechaFin + '</th><th colspan = "3">Periodo: ' + SplitPeriodos[0] + '</th><th colspan = "2" style="text-align: right">Pag. 1</th>';
                    tabla2 += '</tr>';
                    tabla2 += '<tr>';
                    //tabla2 += '<th style="text-align: center; background-color: #87b87f; color: #fff">FACTURA</th><th style="text-align: center; background-color: #87b87f; color: #fff">FECHA FACTURA</th><th style="text-align: center; background-color: #87b87f; color: #fff">FECHA ENVÍO</th><th style="text-align: center; background-color: #87b87f; color: #fff">FECHA PAGO</th><th style="text-align: center; background-color: #87b87f; color: #fff">DÍAS</th><th style="text-align: center; background-color: #87b87f; color: #fff">NO. CLIENTE</th><th style="text-align: center; background-color: #87b87f; color: #fff">CLIENTE</th><th style="text-align: center; background-color: #87b87f; color: #fff">EQUIPO</th><th style="text-align: center; background-color: #87b87f; color: #fff">T.C.</th><th style="text-align: center; background-color: #87b87f; color: #fff">NO. CONCEPTO</th><th style="text-align: center; background-color: #87b87f; color: #fff">COMISIÓN</th><th style="text-align: center; background-color: #87b87f; color: #fff">VENTA</th><th style="text-align: center; background-color: #87b87f; color: #fff">TOTAL FACTURA</th><th style="text-align: center; background-color: #87b87f; color: #fff">ADUANA</th><th style="text-align: center; background-color: #87b87f; color: #fff">REFERENCIA</th><th style="text-align: center; background-color: #87b87f; color: #fff">RENDICION</th>';
                    tabla2 += '<th style="text-align: center; background-color: #87b87f; color: #fff">ID CODIGO VENDEDOR</th>'
                    tabla2 += '<th style="text-align: center; background-color: #87b87f; color: #fff">VENDEDOR</th>'
                    tabla2 += '<th style="text-align: center; background-color: #87b87f; color: #fff">PERIODO</th>'
                    tabla2 += '<th style="text-align: center; background-color: #87b87f; color: #fff">FECHA INICIO</th>'
                    tabla2 += '<th style="text-align: center; background-color: #87b87f; color: #fff">FECHA FIN</th>'
                    tabla2 += '<th style="text-align: center; background-color: #87b87f; color: #fff">DEPOSITO</th>'
                    tabla2 += '<th style="text-align: center; background-color: #87b87f; color: #fff">CLABEINTERBANCARIA</th>'
                    tabla2 += '<th style="text-align: center; background-color: #87b87f; color: #fff">BANCO</th>'
                    tabla2 += '<th style="text-align: center; background-color: #87b87f; color: #fff">ESQUEMA</th>'
                    tabla2 += '<th style="text-align: center; background-color: #87b87f; color: #fff">CORREO</th>'
                    tabla2 += '</tr>';
                    tabla2 += '</thead>';
                    tabla2 += '<tbody>';
                    var tr2 = '';


                    $(lista_detalles.lista_detalles).each(function (i) {

                        tr2 += '<tr>';
                        tr2 += '<td>' + lista_detalles.lista_detalles[i].IDCODIGOVENDEDOR + '</td>';
                        tr2 += '<td>' + lista_detalles.lista_detalles[i].VENDEDOR + '</td>';
                        tr2 += '<td>' + lista_detalles.lista_detalles[i].PERIODO + '</td>';
                        tr2 += '<td>' + ToJavaScriptDate(lista_detalles.lista_detalles[i].FECHAINICIO) + '</td>';
                        tr2 += '<td>' + ToJavaScriptDate(lista_detalles.lista_detalles[i].FECHAFIN) + '</td>';
                        tr2 += '<td>' + lista_detalles.lista_detalles[i].TOTALPAGAR + '</td>';
                        tr2 += '<td>' + lista_detalles.lista_detalles[i].CLABEINTERBANCARIA + '</td>';
                        tr2 += '<td>' + lista_detalles.lista_detalles[i].BANCO + '</td>';
                        tr2 += '<td>' + lista_detalles.lista_detalles[i].ESQUEMA + '</td>';
                        tr2 += '<td>' + lista_detalles.lista_detalles[i].CORREO + '</td>';
                        tr2 += '</tr>';
                    });

                    tabla2 += tr2;

                    tabla2 += '</tbody></table></div>';

                    $('#div_ResumenPagoComisionesParcial').html(tabla);

                    $('#div_ResumenPagoComisionesParcial2').html(tabla2);

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
//    var table = $('#dynamic-table').DataTable();
//    $('<table>')
//.append($(table.table().header()).clone())
//.append(table.$('tr').clone())
//    .table2excel({
//        // exclude CSS class
//        exclude: ".noExl",
//        name: "Worksheet Name",
//        filename: "Comisiones - Reporte no Comisionables " + utc //do not include extension
//    });
    //    table.destroy();

    tableToExcel('table2', 'Reporte No Comisionable');
});

$('#cmd').on('click', function (event) {

    event.preventDefault();


    var doc = new jsPDF('l', 'pt', 'letter');

    var res = doc.autoTableHtmlToJson(document.getElementById("dynamic-table"));

    var totalPagesExp = "{total_pages_count_string}";
    var base64Img = "data:image/png;base64,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";

    var SplitPeriodos = $("#strPeriodoDetalleNoComisionable option:selected").text().trim().split('-')
    var idCodigoVendedor = $('#vendedoresCmbDetalleNoComisionable').val();
    var strCodigoVendedor = $('#vendedoresCmbDetalleNoComisionable option:selected').text();
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
        doc.text("Reporte No Comisionable", 580, 22);

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

    //pdf.autoTable(res.columns, res.data);
    doc.autoTable(res.columns, res.data, {
        addPageContent: pageContent,
        margin: { top: 70, left: 20, right: 20, bottom: 20 },
        theme: 'grid',
        styles: { fontSize: 5 },

    });



    doc.save('Reporte No Comisionable.pdf');
});

function ToJavaScriptDate(value) {
    var pattern = /Date\(([^)]+)\)/;
    var results = pattern.exec(value);
    var dt = new Date(parseFloat(results[1]));
    return dt.getDate() + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear();
    //return (dt.getMonth() + 1) + "/" + dt.getDate() + "/" + dt.getFullYear();
}

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