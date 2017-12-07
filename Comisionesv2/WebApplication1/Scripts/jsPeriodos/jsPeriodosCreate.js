

var TableDataPeriodosCreate = function () {
    "use strict";

  

    $(".select2").select2({ allowClear: true })
       .on('change', function () {
           $(this).closest('form').validate().element($(this));
       });

    moment.locale('es');
    //to translate the daterange picker, please copy the "examples/daterange-fr.js" contents here before initialization
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
    .prev().on(ace.click_event, function () {
        $(this).next().focus();
    });

    var runDataTable_TableDataPeriodosCreate = function () {

        $.mask.definitions['~'] = '[+-]';
        $('#strTelefono').mask('(999) 999-9999');

        jQuery.validator.addMethod("strTelefono", function (value, element) {
            return this.optional(element) || /^\(\d{3}\) \d{3}\-\d{4}( x\d{1,6})?$/.test(value);
        }, "El número telefónico no es válido");



        var $validation = false;
        $('#fuelux-wizard-container')
        .ace_wizard({

        })
        .on('actionclicked.fu.wizard', function (e, info) {
            if (info.step == 1) {
                if (!$('#periodos-form').valid()) {
                    e.preventDefault();
                }
                else {
                    $("#lblstrNombreVendedor").html($("#idCodigoVendedor option:selected").text().trim())
                    $("#lblPeriodo").html($("#strPeriodo option:selected").text().trim())
                    $("#lblFechas").html($("#id-date-range-picker-1").val())

                    // Notificamos por via AJAX a los clientes que no están configurados pero son nuevos

                    var SplitPeriodos = $("#strPeriodo option:selected").text().trim().split('-')
                    var idCodigoVendedor = $('#idCodigoVendedor').val();
                    var dtFechaInicio = $('#id-date-range-picker-1').val().slice(0, 10).trim();
                    var dtFechaFin = $('#id-date-range-picker-1').val().slice(13, 23).trim();

                    $('#box-clientes').load("/comisiones/Periodos/ARVResumenClientesFaltantes/?idCodigoVendedor=" + idCodigoVendedor + "&intPeriodo=" + SplitPeriodos[0].trim() + "&intYear=" + SplitPeriodos[1].trim() + "&dtFechaInicio=" + dtFechaInicio + "&tdFechaFin=" + dtFechaFin);

                   
                }
            }
        })
        .on('finished.fu.wizard', function (e) {
            bootbox.confirm({
                message: "Aún hay clientes no configurados ¿continuar de todos modos?",
                buttons: {
                    confirm: {
                        label: "Si",
                        className: "btn-primary btn-sm",
                    },
                    cancel: {
                        label: "No",
                        className: "btn-sm",
                    }
                },
                callback: function (result) {
                    if (result) {
                        $('#waitModal').modal('toggle')
                        $("#module").text("Generando periodo...");

                        var SplitPeriodos = $("#strPeriodo option:selected").text().trim().split('-')
                        var idCodigoVendedor = $('#idCodigoVendedor').val();
                        var dtFechaInicio = $('#id-date-range-picker-1').val().slice(0, 10).trim();
                        var dtFechaFin = $('#id-date-range-picker-1').val().slice(13, 23).trim();

                        var dataNewPeriodos = {
                            idCodigoVendedor: idCodigoVendedor,
                            strNumPeriodo: SplitPeriodos[0].trim(),
                            strAño: SplitPeriodos[1].trim(),
                            dtFechaInicio: dtFechaInicio,
                            dtFechaFin: dtFechaFin
                        };

                        var pruebas = false;

                        if (pruebas) {
                            $('#waitModal').modal('toggle');

                            swal({
                                title: "Guardar!",
                                text: dataNewPeriodos.msg,
                                type: "success",
                                confirmButtonClass: 'btn-success',
                                confirmButtonText: 'ok!'
                            },
                                        function (isConfirm) {
                                            if (isConfirm) {
                                                alert("Modal resumen");
                                                $("#ModalResumen").modal("toggle");
                                                $('#cnt_Historico').load("/comisiones/Periodos/HistoricoCliente/?idCodigoVendedor=" + idCodigoVendedor + "&intPeriodo=" + SplitPeriodos[0].trim());
                                               // window.location.href = "/comisiones/Periodos/Create?vendedor=" + idCodigoVendedor + "&periodo=" + SplitPeriodos[0].trim() + SplitPeriodos[1].trim();
                                            }
                                        });

                            $('#ModalResumen').on('hidden.bs.modal', function () {
                                // do something…
                            })
                        }
                        else {
                            $.ajax({
                                type: 'POST',
                                url: '/comisiones/Periodos/Create',
                                data: JSON.stringify(dataNewPeriodos),
                                contentType: "application/json; charset=utf-8",
                                success: function SuccessCallback(dataNewPeriodos) {
                                    $('#waitModal').modal('toggle');
                                    if (!dataNewPeriodos.error) {

                                        swal({
                                            title: "Guardar!",
                                            text: dataNewPeriodos.msg,
                                            type: "success",
                                            confirmButtonClass: 'btn-success',
                                            confirmButtonText: 'ok!'
                                        },
                                        function (isConfirm) {
                                            if (isConfirm) {
                                                $("#ModalResumen").modal("toggle");
                                                $('#cnt_Historico').load("/comisiones/Periodos/HistoricoCliente/?idCodigoVendedor=" + idCodigoVendedor + "&intPeriodo=" + SplitPeriodos[0].trim());

                                                $('#ModalResumen').on('hidden.bs.modal', function () {
                                                    // do something…
                                                    window.location.href = "/comisiones/Periodos/Create?vendedor=" + idCodigoVendedor + "&periodo=" + SplitPeriodos[0].trim() + SplitPeriodos[1].trim();
                                                })

                                              //  window.location.href = "/comisiones/Periodos/Create?vendedor=" + idCodigoVendedor + "&periodo=" + SplitPeriodos[0].trim() + SplitPeriodos[1].trim();
                                            }
                                        });

                                    } else {
                                        swal({
                                            title: "Error!",
                                            text: dataNewPeriodos.msg,
                                            type: "error",
                                            confirmButtonClass: 'btn-error',
                                            confirmButtonText: 'ok'
                                        },
                                        function (isConfirm) {
                                            if (isConfirm) {
                                                //window.location.href = "/clientesComConfig/";
                                            }
                                        });
                                        // swal("Error!", dataNewClientes.msg, "error");
                                    }
                                },
                                error: function FailureCallback(dataNewPeriodos) {
                                    alert("Error: " + dataNewPeriodos.msg);
                                }
                            });
                        }
                       

                    }
                }
            });
            

        }).on('stepclick.fu.wizard', function (e) {
            e.preventDefault();//this will prevent clicking and selecting steps
        });





        $('#periodos-form').validate({
            errorElement: 'div',
            errorClass: 'help-block',
            focusInvalid: false,
            ignore: "",
            rules: {
                idCodigoVendedor: {
                    required: true
                }
            },

            messages: {
                idCodigoVendedor: {
                    required: "Selecciona un vendedor."
                }
            },


            highlight: function (e) {
                $(e).closest('.form-group').removeClass('has-info').addClass('has-error');
            },

            success: function (e) {
                $(e).closest('.form-group').removeClass('has-error');//.addClass('has-info');
                $(e).remove();
            },

            errorPlacement: function (error, element) {
                if (element.is('input[type=checkbox]') || element.is('input[type=radio]')) {
                    var controls = element.closest('div[class*="col-"]');
                    if (controls.find(':checkbox,:radio').length > 1) controls.append(error);
                    else error.insertAfter(element.nextAll('.lbl:eq(0)').eq(0));
                }
                else if (element.is('.select2')) {
                    error.insertAfter(element.siblings('[class*="select2-container"]:eq(0)'));
                }
                else if (element.is('.chosen-select')) {
                    error.insertAfter(element.siblings('[class*="chosen-container"]:eq(0)'));
                }
                else error.insertAfter(element.parent());
            },

            submitHandler: function (form) {
            },
            invalidHandler: function (form) {

            }
        });




        $('#modal-wizard-container').ace_wizard();
        $('#modal-wizard .wizard-actions .btn[data-dismiss=modal]').removeAttr('disabled');


        $(document).one('ajaxloadstart.page', function (e) {
            //in ajax mode, remove remaining elements before leaving page
            $('[class*=select2]').remove();
        });

    };


    return {
        //main function to initiate template pages
        init: function () {
            runDataTable_TableDataPeriodosCreate();
        }
    };


}();

$('#resumenCliente').on('click', function () {
    $('#ReporteClientes').html("<div style='text-align: center;'><img style='vertical-align: middle;' src='../assets/img/progress_bar2.gif'/></div>");


        var SplitPeriodos = $("#strPeriodo option:selected").text().trim().split('-')
        var idCodigoVendedor = $('#idCodigoVendedor').val();
        var dtFechaInicio = $('#id-date-range-picker-1').val().slice(0, 10).trim();
        var dtFechaFin = $('#id-date-range-picker-1').val().slice(13, 23).trim();

        var vendedorDefault = $('#hdnVendedorID').val();
        var periodoDefault = $('#hdnPeriodoID').val();

        $("#waitModalLabel").text("Resumen de Comisiones por Cliente");

        debugger;
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


$('#generarReporteAnterior').on('click', function (event) {
    Report = 3;

    var vendedorDefault = $('#hdnVendedorID').val();
    var periodoDefault = $('#hdnPeriodoID').val();

    var SplitPeriodos = $("#strPeriodoPeriodosAnteriores option:selected").text().trim().split('-');
    var idCodigoVendedor = $('#vendedoresPeriodosAnteriores').val();
    var strCodigoVendedor = $('#vendedoresPeriodosAnteriores option:selected').text();

   var vende="";
   var per="";
   var anio="";

   if (vendedorDefault != "0" && periodoDefault != "0")
   {
       vende = vendedorDefault;
       per = periodoDefault.substring(0, periodoDefault.length - 4);
       anio = periodoDefault.substring(per.length, periodoDefault.length);
   }
   else
   {
       vende = idCodigoVendedor;
       per = SplitPeriodos[0];
       anio = SplitPeriodos[1];

   }

    //if (SplitPeriodos != null && SplitPeriodos!="" && idCodigoVendedor != "") {
   if (per != "" && anio != "" && vende != "") {
        $('#Reportes').html("<div style='text-align: center;'><img style='vertical-align: middle;' src='../assets/img/progress_bar2.gif'/></div>");

        $('#container_report').html('');
        $('#container_report2').html('');
        $("#ContainerModal").modal('toggle');
        $("#ContainerModalLabel").html('Reporte de Periodos anteriores')

        $.ajax({
            url: '/comisiones/Consultas/generarReporteAnterior',
            type: "POST",
            //data: { numPeriodo: SplitPeriodos[0], anioPeriodo: SplitPeriodos[1], codigoVendedor: idCodigoVendedor},
            data: { numPeriodo: per, anioPeriodo: anio, codigoVendedor: vende },
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
                        tabla += '<th>FACTURA</th><th>FECHA FACTURA</th><th>FECHA ENVÍO</th><th>FECHA PAGO</th><th>DÍAS</th><th>NO. CLIENTE</th><th>CLIENTE</th><th>EQUIPO</th><th>T.C.</th><th>NO. CONCEPTO</th><th>COMISIÓN</th><th>VENTA</th><th>TOTAL FACTURA</th><th>ADUANA</th><th>REFERENCIA</th><th>RENDICION</th>';
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

                        var tabla2 = '<div><span  class="user-info" style="font-weight: bold;">Fecha Inicio: </span><span  class="user-info" id="fecha1">' + fechaInicio + '</span><span class="user-info" style =" margin-left: 25px; font-weight: bold;" >Fecha Fin: </span><span  class="user-info" id="fecha2">' + fechaFin + '</span></div></br><div style="height: 400px; overflow-y: scroll;"><table class="table table-bordered table-hover" style="width:100%; margin: auto;" cellpadding="0" cellspacing="0" border="1" class="display" id="comision_cliente6">';
                        tabla2 += '<thead>';
                        tabla2 += '<tr>';
                        tabla2 += '<th colspan = "3" rowspan="4" style="text-align: center"><img src="http://cdn2.hubspot.net/hub/2039173/hubfs/site/GrupoEi-agencia-aduanal-en-mexico-logo.png?t=1501783955921&width=190&name=GrupoEi-agencia-aduanal-en-mexico-logo.png" alt="IMAGES" /></th><th colspan = "10" rowspan="4" style="text-align: center">Grupo EI SA de CV</th><th colspan = "3" rowspan="4" style="text-align: center">Reporte de Periodos Anteriores</th>';
                        tabla2 += '</tr>';

                        tabla2 += '<tr>';
                        tabla2 += '</tr>';

                        tabla2 += '<tr>';
                        tabla2 += '</tr>';

                        tabla2 += '<tr>';
                        tabla2 += '</tr>';

                        tabla2 += '<tr>';
                        tabla2 += '<th colspan = "3">Fecha Inicio: ' + fechaInicio + '</th><th colspan = "3">Fecha Fin: ' + fechaFin + '</th><th colspan = "5">Vendedor: ' + idCodigoVendedor + ' - ' + strCodigoVendedor + '</th><th colspan = "3">Periodo: ' + SplitPeriodos[0] + '</th><th colspan = "2" style="text-align: right">Pag. 1</th>';
                        tabla2 += '</tr>';
                        tabla2 += '<tr>';
                        tabla2 += '<th>FACTURA</th><th>FECHA FACTURA</th><th>FECHA ENVÍO</th><th>FECHA PAGO</th><th>DÍAS</th><th>NO. CLIENTE</th><th>CLIENTE</th><th>EQUIPO</th><th>T.C.</th><th>NO. CONCEPTO</th><th>COMISIÓN</th><th>VENTA</th><th>TOTAL FACTURA</th><th>ADUANA</th><th>REFERENCIA</th><th>RENDICION</th>';
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

                        $("#cmd").show();
                        $("#cmd_excel").show();

                      
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




///





