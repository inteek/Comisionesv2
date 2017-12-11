
var oTable1 = null;
var oTable3 = null;
gridDescuentos(null);

if (Rol == "Vendedor") {
    getVendedor();
}


function getVendedor() {

    var idvendedor = $("#idVendedor").val();

    ajaxVendedores(idvendedor);
}


function ajaxVendedores(idVendedor) {
    $.ajax({
        url: '/comisiones/vendedores/getDescuentos',
        type: "GET",
        dataType: "JSON",
        data: { id_vendedor: idVendedor },
        success: function (descuentos) {
            gridDescuentos(descuentos);
        },
        error: function (reponse) {
            alert("error : " + reponse);
        }
    });
}


function gridDescuentos(dataSet) {
    if (oTable1 != null) {
        //oTable1.fnDestroy();
        //oTable1.fnClearTable();
        oTable1.destroy();
    }
    oTable1 = $('#dynamic-table')
        .DataTable({
            data: dataSet,
            language: {
                "sProcessing": "Procesando...",
                "sLengthMenu": "Mostrar MENU registros",
                "sZeroRecords": "No se encontraron resultados",
                "sEmptyTable": "Ningún dato disponible en esta tabla",
                "sInfo": "Mostrando registros del START al END de un total de TOTAL registros",
                "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                "sInfoFiltered": "(filtrado de un total de MAX registros)",
                "sInfoPostFix": "",
                "sSearch": "Buscar:",
                "sUrl": "",
                "sInfoThousands": ",",
                "sLoadingRecords": "Cargando...",
                "oPaginate": {
                    "sFirst": "Primero",
                    "sLast": "Último",
                    "sNext": "Siguiente",
                    "sPrevious": "Anterior"
                },
                "oAria": {
                    "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                }
            },
            dom: 'Bfrtlip',
            buttons: [
                {
                    extend: 'copy',
                    text: '<i class="fa fa-copy bigger-110 pink"></i>',
                    titleAttr: 'Copiar tabla',
                    className: 'btn btn-white btn-primary btn-bold'

                },
                {
                    extend: 'pdf',
                    text: '<i class="fa fa-file-pdf-o bigger-110 red"></i>',
                    titleAttr: 'Exportar a PDF',
                    orientation: 'landscape',
                    className: 'btn btn-white btn-primary btn-bold'
                },
                {
                    text: '<i class="fa fa-file-excel-o bigger-110 green"></i>',
                    titleAttr: 'Exportar a XLS',
                    className: 'btn btn-white btn-primary btn-bold',
                    action: function () {
                        var utc = new Date().toJSON().slice(0, 10).replace(/-/g, '_');
                        var table = $('#dynamic-table').DataTable();
                        $('<table>')
                            .append($(table.table().header()).clone())
                            .append(table.$('tr').clone()).table2excel({
                                //$('<table>').append(table.$('tr').clone()).table2excel({
                                // exclude CSS class
                                exclude: ".noExl",
                                name: "Vendedores",
                                filename: "Comisiones - Reporte Descuentos Vendedores " + utc //do not include extension
                            });
                    }
                },
                {
                    extend: 'print',
                    text: '<i class="fa fa-print bigger-110 grey"></i>',
                    titleAttr: 'Vista de impresión',
                    className: 'btn btn-white btn-primary btn-bold'
                }
            ],
            Columns: [
                { "data": "idDescuentoConceptoVendedor" },
                { "data": "idEmpresa" },
                { "data": "idCodigoVendedor" },
                { "data": "idConcepto" },
                { "data": "strConcepto" },
                { "data": "cantidadDescontar" },
                { "data": "vigenciaInicio" },
                { "data": "vigenciaFin" },
                { "data": "status" }
            ],
            bAutoWidth: false,
            aoColumns: [
                { sTitle: "ID", mData: "idCodigoVendedor", bVisible: false, bSortable: false, sName: "ID" },
                { sTitle: "Empresa", mData: "idEmpresa", bVisible: false, bSortable: false, sName: "IdEmpresa" },
                { sTitle: "Código", mData: "idDescuentoConceptoVendedor", bSortable: true },
                { sTitle: "ID Concepto", mData: "idConcepto", bSortable: true },
                { sTitle: "Concepto", mData: "strConcepto", bSortable: true },
                { sTitle: "Monto a Descontar", mData: "cantidadDescontar", bSortable: false },
                {
                    sTitle: "Vigencia Inicio", mData: "vigenciaInicio", bSortable: true, "render": function (value) {//CAMBIOS
                        if (value === null) return "";

                        var pattern = /Date\(([^)]+)\)/;
                        var results = pattern.exec(value);
                        var dt = new Date(parseFloat(results[1]));
                        var month = dt.getMonth() + 1;

                        return dt.getDate() + "/" + (month > 9 ? month : "0" + month) + "/" + dt.getFullYear();
                    }
                },
                    {
                        sTitle: "Vigencia Fin", mData: "vigenciaFin", bSortable: false, "render": function (value) {//CAMBIOS
                            if (value === null) return "";

                            var pattern = /Date\(([^)]+)\)/;
                            var results = pattern.exec(value);
                            var dt = new Date(parseFloat(results[1]));
                            var month = dt.getMonth() + 1;

                            return dt.getDate() + "/" + (month > 9 ? month : "0" + month) + "/" + dt.getFullYear();
                        }
                    },
                { sTitle: "Status", mData: "status", bVisible: true, bSortable: false }

            ],
            /* inside datatable initialization */
            "aoColumnDefs": [
                {
                    "aTargets": [9],
                    "mData": null,
                    "mRender": function (data, type, full) {
                        var hdnRolID = $("#hdnRolID").val();
                        if (hdnRolID == "Administrador") {
                            return '<a href="/comisiones/Vendedores/EditDescuentos/' + data['idDescuentoConceptoVendedor'] + '" class="edit-row tooltip-success" data-rel="tooltip" title="Editar" onclick="updateDescuento(' + data['idDescuentoConceptoVendedor'] + ');"><span class="green"><i class="ace-icon fa fa-pencil-square-o bigger-120"></i></span></a> <a href="#" class="delete-row tooltip-error" data-rel="tooltip" title="Eliminar" onclick="deleteDescuento(\'' + data['idDescuentoConceptoVendedor'] + '\'' + ', ' + '\'' + '' + data['idCodigoVendedor'] + '\');"><span class="red"><i class="ace-icon fa fa-trash-o bigger-120"></i></span></a> <a class=" btn-Resumen" data-rel="tooltip" style="margin-left:30px; cursor:pointer;" title="Resumen">Historial</a>';
                        }
                        else if (hdnRolID == "Operador") {
                            return '<a href="/comisiones/Vendedores/EditDescuentos/' + data['idDescuentoConceptoVendedor'] + '" class="edit-row tooltip-success" data-rel="tooltip" title="Editar" onclick="updateDescuento(' + data['idDescuentoConceptoVendedor'] + ');"><span class="green"><i class="ace-icon fa fa-pencil-square-o bigger-120"></i></span></a>';
                        }
                        else {
                            return '<a href="/comisiones/Vendedores/EditDescuentos/' + data['idDescuentoConceptoVendedor'] + '" class="edit-row tooltip-success" data-rel="tooltip" title="Editar" onclick="updateDescuento(' + data['idDescuentoConceptoVendedor'] + ');"><span><i></i></span></a> <a class=" btn-Resumen" data-rel="tooltip" style="margin-left:30px; cursor:pointer;" title="Resumen">Historial</a>';
                        }
                    }
                }
            ],
            "aaSorting": []

            //"iDisplayLength": 50
        });

}


function gridDescuentoHistorial(dataSet) {
    if (oTable3 != null) {
        oTable3.destroy();
    }
    oTable3 = $('#table_descuentohist').DataTable({
        "lengthMenu": [5],
        data: dataSet,
        language: {
            "sProcessing": "Procesando...",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible en esta tabla",
            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered": "(filtrado de un total de MAX registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        },
        Columns: [
            { "data": "idPeriodo" },
            { "data": "Descuento" },
            { "data": "FechaInicioPeriodo" },
            { "data": "FechaFinPeriodo" },
            { "data": "SaldoTotal" }
        ],
        bAutoWidth: false,
        aoColumns: [
            { sTitle: "ID Periodo", mData: "idPeriodo", bVisible: true, bSortable: false },
            { sTitle: "Cantidad descontada", mData: "Descuento", bVisible: true, bSortable: false },
            { sTitle: "Fecha Inicio", mData: "FechaInicioPeriodo", bSortable: true, "render": function (value) {//CAMBIOS
                    if (value === null) return "";

                    var pattern = /Date\(([^)]+)\)/;
                    var results = pattern.exec(value);
                    var dt = new Date(parseFloat(results[1]));
                    var month = dt.getMonth() + 1;

                    return dt.getDate() + "/" + (month > 9 ? month : "0" + month) + "/" + dt.getFullYear();
                }
            },
            { sTitle: "Fecha Fin", mData: "FechaFinPeriodo", bSortable: true, "render": function (value) {//CAMBIOS
                    if (value === null) return "";

                    var pattern = /Date\(([^)]+)\)/;
                    var results = pattern.exec(value);
                    var dt = new Date(parseFloat(results[1]));
                    var month = dt.getMonth() + 1;

                    return dt.getDate() + "/" + (month > 9 ? month : "0" + month) + "/" + dt.getFullYear();
                }
            },
            { sTitle: "Saldo total", mData: "SaldoTotal", bVisible: true, bSortable: false }

        ],
        /* inside datatable initialization */
        "aoColumnDefs": [
            {
                "aTargets": [2],
                "mData": null
            }
        ],
        "aaSorting": []

        //"iDisplayLength": 50
    });
}


function deleteDescuento(id_descuento, id_vendedor) {
    swal({
        title: "Estas seguro?",
        text: "Usted no será capaz de recuperar este registro si lo elimina!",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: 'btn-danger',
        confirmButtonText: 'Si, estoy seguro!',
        cancelButtonText: "No, cancelar!",
        closeOnConfirm: false,
        closeOnCancel: false
    },
        function (isConfirm) {
            if (isConfirm) {
                $.ajax({
                    type: 'POST',
                    url: '/comisiones/Vendedores/DeleteDescuento',
                    data: 'id=' + id_descuento,
                    //contentType: 'application/json',
                    success: function (deteleCourse) {
                        if (!deteleCourse.error) {
                            swal({
                                title: "Eliminado!",
                                text: deteleCourse.msg,
                                type: "success",
                                confirmButtonClass: 'btn-success',
                                confirmButtonText: 'ok!'
                            });
                            $.ajax({
                                url: '/comisiones/vendedores/getDescuentos',
                                type: "GET",
                                dataType: "JSON",
                                data: { id_vendedor: id_vendedor },
                                success: function (descuentos) {
                                    gridDescuentos(descuentos);
                                },
                                error: function (reponse) {
                                    alert("error : " + reponse);
                                }
                            });
                        } else {
                            swal("Error!", deteleCourse.msg, "error");
                        }
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });


            } else {
                swal("Cancelado", "No se elimino el registro.", "error");
            }
        });
}


$("#idVendedor").change(function () {

    var idvendedor = $("#idVendedor").val();

    $.ajax({
        url: '/comisiones/vendedores/getDescuentos',
        type: "GET",
        dataType: "JSON",
        data: { id_vendedor: idvendedor },
        success: function (descuentos) {
            gridDescuentos(descuentos);
        },
        error: function (reponse) {
            alert("error : " + reponse);
        }
    });

});


$('#dynamic-table').on('click', '.btn-Resumen', function ()  {//Carga el modal para editar y obtiene los datos de la fila seleccionada
    var idvendedor = $("#idVendedor option:selected").text().trim()

    //$("#chk_ActivoTT").prop('checked', false);
    var data_row = oTable1.row($(this).closest('tr')).data();
    $("#idVende").text("");
    $("#idConcep").text("");
    $("#idtotalad").text("");
    $("#idsaldototal").text("");
    var idRow = data_row["idDescuentoConceptoVendedor"];
    $.ajax({
        url: '/comisiones/vendedores/getDescuentosHistorial1',
        type: "GET",
        dataType: "JSON",
        data: { id_descuento: idRow },
        success: function (historial) {
            if (historial['idRow'] == 0) {
                $("#idVende").text(idvendedor);
                $("#idConcep").text("");
                $("#idtotalad").text("");
                $("#idsaldototal").text("");
            }
            else {
                $("#idVende").text(idvendedor);
                $("#idConcep").text(historial['idConcepto']);
                $("#idtotalad").text(historial['totalAdeudo']);
                $("#idsaldototal").text(historial['SaldoTotal']);
            }
            $.ajax({
                url: '/comisiones/vendedores/getDescuentosHistorial2',
                type: "GET",
                dataType: "JSON",
                data: { id_descuento: idRow },
                success: function (historial2) {
                    gridDescuentoHistorial(historial2);
                },
                error: function (reponse) {
                    Console.log("error : " + reponse);
                }
            });
        },
        error: function (reponse) {
            Console.log("error : " + reponse);
        }
    });

    //$("#txt_idTT").val(id);
    $('#ResumenModal').modal('show');

});
