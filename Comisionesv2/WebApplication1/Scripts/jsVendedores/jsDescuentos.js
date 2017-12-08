function GetCliente(idEmpresa) {
    if (idEmpresa != "") {
        $("#module").text("Buscando conceptos...");
        $('#waitModal').modal('toggle')

        $.ajax({
            url: '/comisiones/vendedores/getConceptos',
            type: "GET",
            dataType: "JSON",
            data: { id_empresa: idEmpresa },
            success: function (conceptos) {
                var select = $("#cbbConceptos");
                select.empty();
                select.append($('<option/>', {
                    value: "",
                    text: "-- Selecciona un concepto --"
                }));
                $.each(conceptos.Conceptos, function (i, conceptos) {
                    select.append(
                        $('<option></option>').val(conceptos.Value.trim()).html(conceptos.Text.trim()));
                });

                $("#cbbConceptos").select2("val", "")
                $("#cbbConceptos option[value='0']").attr("selected", "selected");


                $('#waitModal').modal('toggle');
            },
            error: function (reponse) {
                $('#waitModal').modal('toggle');
                alert("error : " + reponse);
            }
        });

    }
}

$(".select2").select2({ allowClear: true })
    .on('change', function () {
        $(this).closest('form').validate().element($(this));
    });

//NUEVAS FUNCIONCES 1

$('#guardarAsociar').attr("disabled", true);
var GRPID = null;
var GRPDESCE = null;
var oTable3 = null;
var oTable2 = null;
var oTable1 = null;
var data_rowConcepto;

gridConceptos(null);
gridDescuentos(null);

function gridConceptos(dataSet) {
    if (oTable2 != null) {
        oTable2.destroy();
    }
    oTable2 = $('#table_conceptos').DataTable({
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
            { "data": "GRPID" },
            { "data": "GRPDESCE" },
            { "data": "Asociar" }
        ],
        bAutoWidth: false,
        aoColumns: [
            { sTitle: "ID", mData: "GRPID", bVisible: true, bSortable: false },
            { sTitle: "Descripcion", mData: "GRPDESCE", bVisible: true, bSortable: false },
            { sTitle: "Asociar", mData: "Asociar", bVisible: true, bSortable: false }

        ],
        /* inside datatable initialization */
        "aoColumnDefs": [
            {
                "aTargets": [2],
                "mData": null,
                "mRender": function (data, type, full) {
                    return '<input type="radio" id="asociarCon" name="select" class="singleRadio  asociarConcepto">';
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
            { "data": "SaldoTotal" }
        ],
        bAutoWidth: false,
        aoColumns: [
            { sTitle: "ID Periodo", mData: "idPeriodo", bVisible: true, bSortable: false },
            { sTitle: "Cantidad descontada", mData: "Descuento", bVisible: true, bSortable: false },
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
                { sTitle: "Vigencia Inicio", mData: "vigenciaInicio", bSortable: true },
                { sTitle: "Vigencia Fin", mData: "vigenciaFin", bSortable: false },
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
                            return '<a href="/comisiones/Vendedores/EditDescuentos/' + data['idDescuentoConceptoVendedor'] + '" class="edit-row tooltip-success" data-rel="tooltip" title="Editar" onclick="updateDescuento(' + data['idDescuentoConceptoVendedor'] + ');"><span class="green"><i class="ace-icon fa fa-pencil-square-o bigger-120"></i></span></a> <a href="#" class="delete-row tooltip-error" data-rel="tooltip" title="Eliminar" onclick="deleteDescuento(\'' + data['idDescuentoConceptoVendedor'] + '\'' + ', ' + '\'' + '' + data['idCodigoVendedor'] + '\');"><span class="red"><i class="ace-icon fa fa-trash-o bigger-120"></i></span></a> <a class=" btn-Resumen" data-rel="tooltip" style="margin-left:30px; cursor:pointer;" title="Resumen">Resumen</a>';
                        }
                        else if (hdnRolID == "Operador") {
                            return '<a href="/comisiones/Vendedores/EditDescuentos/' + data['idDescuentoConceptoVendedor'] + '" class="edit-row tooltip-success" data-rel="tooltip" title="Editar" onclick="updateDescuento(' + data['idDescuentoConceptoVendedor'] + ');"><span class="green"><i class="ace-icon fa fa-pencil-square-o bigger-120"></i></span></a>';
                        }
                        else {
                            return '<a href="/comisiones/Vendedores/EditDescuentos/' + data['idDescuentoConceptoVendedor'] + '" class="edit-row tooltip-success" data-rel="tooltip" title="Editar" onclick="updateDescuento(' + data['idDescuentoConceptoVendedor'] + ');"><span><i></i></span></a> <a class=" btn-Resumen" data-rel="tooltip" style="margin-left:30px; cursor:pointer;" title="Resumen">Resumen</a>';
                        }
                    }
                }
            ],
            "aaSorting": []

            //"iDisplayLength": 50
        });

}

if (Rol == "Vendedor") {
    deshabilitarVendedor();
}

function deshabilitarVendedor() {
    $("#idEmpresa").attr('disabled', 'disabled');
    $("#idCodigoVendedor").attr('disabled', 'disabled');
    $("#cbbConceptos").attr('disabled', 'disabled');
    $('#btnConfirmaCliente').attr("disabled", true);

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


//FIN NUEVAS FUNCIONES 1


//oTable1.fnAdjustColumnSizing();

//var tableTools = new $.fn.dataTable.TableTools(oTable1, {
//    'aButtons': [
//        {
//            "sExtends": "copy",
//            "sToolTip": "Copy to clipboard",
//            "sButtonClass": "btn btn-white btn-primary btn-bold",
//            "sButtonText": "<i class='fa fa-copy bigger-110 pink'></i>",
//            "fnComplete": function () {
//                this.fnInfo('<h3 class="no-margin-top smaller">Table copied</h3>\
//            									<p>Copied '+ (oTable1.fnSettings().fnRecordsTotal()) + ' row(s) to the clipboard.</p>',
//                    1500
//                );
//            }
//        },
//        {
//            'sExtends': 'xls',
//            "sButtonClass": "btn btn-white btn-primary  btn-bold",
//            "sButtonText": "<i class='fa fa-file-excel-o bigger-110 green'></i>",
//            'sFileName': 'Comisiones - Reporte Vendedores.xls',
//        },
//        {
//            "sExtends": "print",
//            "sToolTip": "Impresión",
//            "sButtonClass": "btn btn-white btn-primary  btn-bold",
//            "sButtonText": "<i class='fa fa-print bigger-110 grey'></i>",

//            "sMessage": "<div class='navbar navbar-default'><div class='navbar-header pull-left'><a class='navbar-brand' href='#'><small>Sistema Comisiones - Resumen de Vendedores</small></a></div></div>",

//            "sInfo": "<h3 class='no-margin-top'>Vista de impresión</h3>\
//            									  <p>Por favor usa la función de\
//            									  imprimir esta tabla.\
//            									  <br />Presiona <b>escape</b> cuando finalices.</p>",
//            'bShowAll': true,
//        },
//        {
//            "sExtends": "pdf",
//            "sToolTip": "Exportar a PDF",
//            "sButtonClass": "btn btn-white btn-primary  btn-bold",
//            "sButtonText": "<i class='fa fa-file-pdf-o bigger-110 red'></i>",
//            'bFooter': false
//        }
//        //'csv'
//    ],
//    'sSwfPath': '//cdn.datatables.net/tabletools/2.2.4/swf/copy_csv_xls_pdf.swf'
//});
//$(tableTools.fnContainer()).appendTo($('.tableTools-container'));

//$('table.data-table').DataTable({
//    paging: false,
//    columnDefs: [{
//        targets: 'no-sort',
//        orderable: false
//    }],
//    dom: '<"row"<"col-sm-6"Bl><"col-sm-6"f>>' +
//      '<"row"<"col-sm-12"<"table-responsive"tr>>>' +
//      '<"row"<"col-sm-5"i><"col-sm-7"p>>',
//    fixedHeader: {
//        header: true
//    },
//    buttons: {
//        buttons: [{
//            extend: 'print',
//            text: '<i class="fa fa-print"></i> Print',
//            title: $('h1').text(),
//            exportOptions: {
//                columns: ':not(.no-print)'
//            },
//            footer: true,
//            autoPrint: false
//        }, {
//            extend: 'pdf',
//            text: '<i class="fa fa-file-pdf-o"></i> PDF',
//            title: $('h1').text(),
//            exportOptions: {
//                columns: ':not(.no-print)'
//            },
//            footer: true
//        }],
//        dom: {
//            container: {
//                className: 'dt-buttons'
//            },
//            button: {
//                className: 'btn btn-default'
//            }
//        }
//    }
//});

$("#btnXLS").click(function () {
    var utc = new Date().toJSON().slice(0, 10).replace(/-/g, '_');
    $("#dynamic-table").table2excel({
        // exclude CSS class
        exclude: ".noExl",
        name: "Worksheet Name",
        filename: "Comisiones - Reporte Descuentos Vendedores " + utc //do not include extension
    });
});


//TableTools settings
//TableTools.classes.container = "btn-group btn-overlap";
//TableTools.classes.print = {
//    "body": "DTTT_Print",
//    "info": "tableTools-alert gritter-item-wrapper gritter-info gritter-center white",
//    "message": "tableTools-print-navbar"
//}

////initiate TableTools extension
//var tableTools_obj = new $.fn.dataTable.TableTools(oTable1, {
//    "sSwfPath": "http://cdn.datatables.net/tabletools/2.2.4/swf/copy_csv_xls_pdf.swf", //in Ace demo ../assets will be replaced by correct assets path

//    "sRowSelector": "td:not(:last-child)",
//    "sRowSelect": "multi",
//    "fnRowSelected": function (row) {
//        //check checkbox when row is selected
//        try { $(row).find('input[type=checkbox]').get(0).checked = true }
//        catch (e) { }
//    },
//    "fnRowDeselected": function (row) {
//        //uncheck checkbox
//        try { $(row).find('input[type=checkbox]').get(0).checked = false }
//        catch (e) { }
//    },

//    "sSelectedClass": "success",
//    //aButtons: ['select_all', 'select_none', 'copy', 'csv', 'xls', 'pdf', 'print'],
//    aButtons: [
//        {
//            "sExtends": "copy",
//            "sToolTip": "Copy to clipboard",
//            "sButtonClass": "btn btn-white btn-primary btn-bold",
//            "sButtonText": "<i class='fa fa-copy bigger-110 pink'></i>",
//            "fnComplete": function () {
//                this.fnInfo('<h3 class="no-margin-top smaller">Table copied</h3>\
//									<p>Copied '+ (oTable1.fnSettings().fnRecordsTotal()) + ' row(s) to the clipboard.</p>',
//                    1500
//                );
//            }
//        },

//        {   
//            "sExtends": "csv",
//            "sToolTip": "Export to CSV",
//            "sButtonClass": "btn btn-white btn-primary  btn-bold",
//            mColumns: 'visible',
//            "sButtonText": "<i class='fa fa-file-excel-o bigger-110 green'></i>"
//        },

//        {
//            "sExtends": "pdf",
//            "sToolTip": "Export to PDF",
//            "sButtonClass": "btn btn-white btn-primary  btn-bold",
//            mColumns: 'visible',
//            "sButtonText": "<i class='fa fa-file-pdf-o bigger-110 red'></i>"
//        },

//        {
//            "sExtends": "print",
//            "sToolTip": "Impresión",
//            "sButtonClass": "btn btn-white btn-primary  btn-bold",
//            "sButtonText": "<i class='fa fa-print bigger-110 grey'></i>",

//            "sMessage": "<div class='navbar navbar-default'><div class='navbar-header pull-left'><a class='navbar-brand' href='#'><small>Optional Navbar &amp; Text</small></a></div></div>",

//            "sInfo": "<h3 class='no-margin-top'>Print view</h3>\
//									  <p>Please use your browser's print function to\
//									  print this table.\
//									  <br />Press <b>escape</b> when finished.</p>",
//        }
//    ]
//});

////we put a container before our table and append TableTools element to it
//$(tableTools_obj.fnContainer()).appendTo($('.tableTools-container'));

////also add tooltips to table tools buttons
////addding tooltips directly to "A" buttons results in buttons disappearing (weired! don't know why!)
////so we add tooltips to the "DIV" child after it becomes inserted
////flash objects inside table tools buttons are inserted with some delay (100ms) (for some reason)
//setTimeout(function () {
//    $(tableTools_obj.fnContainer()).find('a.DTTT_button').each(function () {
//        var div = $(this).find('> div');
//        if (div.length > 0) div.tooltip({ container: 'body' });
//        else $(this).tooltip({ container: 'body' });
//    });
//}, 200);



//ColVis extension
var colvis = new $.fn.dataTable.ColVis(oTable1, {
    "buttonText": "<i class='fa fa-search'></i>",
    "aiExclude": [0, 6],
    "bShowAll": true,
    //"bRestore": true,
    "sAlign": "right",
    "fnLabel": function (i, title, th) {
        return $(th).text();//remove icons, etc
    }

});


//style it
$(colvis.button()).addClass('btn-group').find('button').addClass('btn btn-white btn-info btn-bold')

//and append it to our table tools btn-group, also add tooltip
$(colvis.button())
    .prependTo('.tableTools-container .btn-group')
    .attr('title', 'Show/hide columns').tooltip({ container: 'body' });

//and make the list, buttons and checkboxed Ace-like
$(colvis.dom.collection)
    .addClass('dropdown-menu dropdown-light dropdown-caret dropdown-caret-right')
    .find('li').wrapInner('<a href="javascript:void(0)" />') //'A' tag is required for better styling
    .find('input[type=checkbox]').addClass('ace').next().addClass('lbl padding-8');



/////////////////////////////////
//table checkboxes
$('th input[type=checkbox], td input[type=checkbox]').prop('checked', false);

//select/deselect all rows according to table header checkbox
$('#dynamic-table > thead > tr > th input[type=checkbox]').eq(0).on('click', function () {
    var th_checked = this.checked;//checkbox inside "TH" table header

    $(this).closest('table').find('tbody > tr').each(function () {
        var row = this;
        if (th_checked) tableTools_obj.fnSelect(row);
        else tableTools_obj.fnDeselect(row);
    });
});

//select/deselect a row when the checkbox is checked/unchecked
$('#dynamic-table').on('click', 'td input[type=checkbox]', function () {
    var row = $(this).closest('tr').get(0);
    if (!this.checked) tableTools_obj.fnSelect(row);
    else tableTools_obj.fnDeselect($(this).closest('tr').get(0));
});




$(document).on('click', '#dynamic-table .dropdown-toggle', function (e) {

    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();
});


//And for the first simple table, which doesn't have TableTools or dataTables
//select/deselect all rows according to table header checkbox
var active_class = 'active';
$('#simple-table > thead > tr > th input[type=checkbox]').eq(0).on('click', function () {
    var th_checked = this.checked;//checkbox inside "TH" table header

    $(this).closest('table').find('tbody > tr').each(function () {
        var row = this;
        if (th_checked) $(row).addClass(active_class).find('input[type=checkbox]').eq(0).prop('checked', true);
        else $(row).removeClass(active_class).find('input[type=checkbox]').eq(0).prop('checked', false);
    });
});

//select/deselect a row when the checkbox is checked/unchecked
$('#simple-table').on('click', 'td input[type=checkbox]', function () {
    var $row = $(this).closest('tr');
    if (this.checked) $row.addClass(active_class);
    else $row.removeClass(active_class);
});

/********************************/
//add tooltip for small view action buttons in dropdown menu
$('[data-rel="tooltip"]').tooltip({ placement: tooltip_placement });

//$(".select2").select2({ allowClear: true })
//       .on('change', function () {
//           $(this).closest('form').validate().element($(this));
//       });

//tooltip placement on right or left
function tooltip_placement(context, source) {
    var $source = $(source);
    var $parent = $source.closest('table')
    var off1 = $parent.offset();
    var w1 = $parent.width();

    var off2 = $source.offset();
    //var w2 = $source.width();

    if (parseInt(off2.left) < parseInt(off1.left) + parseInt(w1 / 2)) return 'right';
    return 'left';
}


function editVendedor(id_vendedor) {

    window.location.href = "/comisiones/Vendedores/Edit/" + id_vendedor;
}


// FUNCIONES MODIFICADAS

$('#dynamic-table').on('click', '.btn-Resumen', function () {//Carga el modal para editar y obtiene los datos de la fila seleccionada

    //$("#chk_ActivoTT").prop('checked', false);
    var data_row = oTable1.row($(this).closest('tr')).data();
    $("#idVende").val("");
    $("#idConcep").val("");
    $("#idtotalad").val("");
    $("#idsaldototal").val("");
    var idRow = data_row["idDescuentoConceptoVendedor"];
    $.ajax({
        url: '/comisiones/vendedores/getDescuentosHistorial1',
        type: "GET",
        dataType: "JSON",
        data: { id_descuento: idRow },
        success: function (historial) {
            if (historial['idRow'] == 0) {
                $("#idVende").val("");
                $("#idConcep").val("");
                $("#idtotalad").val("");
                $("#idsaldototal").val("");
            }
            else {
                $("#idVende").val(historial['idCodigoVendedor']);
                $("#idConcep").val(historial['idConcepto']);
                $("#idtotalad").val(historial['totalAdeudo']);
                $("#idsaldototal").val(historial['SaldoTotal']);
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

function updateDescuento(id_descuento) {
    var url = window.location.host + '/comisiones/Vendedores/EditDescuentos/' + id_descuento;
    window.location.href = window.location.host + url;

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

// FIN FUNCIONES MODIFICADAS


// NUEVAS FUNCIONES 2

//ASOCIACION CONCEPTO
$('#asociar').on('click', function () {

    var idEmpresa = $('#idEmpresa').val();

    $.ajax({
        url: '/comisiones/vendedores/getAsociarConceptos',
        type: "GET",
        dataType: "JSON",
        data: { idEmpresa: idEmpresa },
        success: function (conceptos) {
            gridConceptos(conceptos);
        },
        error: function (reponse) {
            alert("error : " + reponse);
        }
    });


    $('#asociarModal').modal('toggle');

});

$('#table_conceptos').on('click', '.asociarConcepto', function () {
    $("#guardarAsociar").removeAttr("disabled");

    $("#btnGuardar").removeAttr("disabled");
    data_rowConcepto = oTable2.row($(this).closest('tr')).data();
    GRPID = data_rowConcepto["GRPID"];
    GRPDESCE = data_rowConcepto["GRPDESCE"];

});

$('#guardarAsociar').on('click', function () {

    var idEmpresa = $('#idEmpresa').val();

    var dataNewAsociarConcepto = {
        idEmpresa,
        GRPID
    };

    $.ajax({
        type: 'POST',
        url: '/comisiones/Vendedores/crearAsociacionConcepto',
        data: JSON.stringify(dataNewAsociarConcepto),
        contentType: "application/json; charset=utf-8",
        success: function SuccessCallback(dataNewAsociarConcepto) {
            //$('#waitModal').modal('toggle');
            if (!dataNewAsociarConcepto.error) {
                swal({
                    title: "Informacion guardada exitosamente!",
                    text: dataNewAsociarConcepto.msg,
                    type: "success",
                    confirmButtonClass: 'btn-success',
                    confirmButtonText: 'ok!'
                });
                GetEmpresayConcepto(idEmpresa);
                $('#asociarModal').modal('hide');
            } else {
                swal({
                    title: "Registro existente",
                    text: dataNewAsociarConcepto.msg,
                    type: "warning",
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
        error: function FailureCallback(dataNewAsociarConcepto) {
            //$('#waitModal').modal('toggle');
            swal("Error!", dataNewAsociarConcepto.msg, "error");

        }
    });

});

$('#cerrarAsociacion').on('click', function () {
    $('#asociarModal').modal('hide');
});

function GetEmpresayConcepto(idEmpresa) {
    if ($("#idEmpresa").val() != "") {


        if (idEmpresa != "") {

            $('#simple-table tbody').remove();

            $.ajax({
                url: '/comisiones/vendedores/getConceptos',
                type: "GET",
                dataType: "JSON",
                data: { id_empresa: idEmpresa },
                success: function (conceptos) {
                    var select = $("#cbbConceptos");
                    select.empty();
                    select.append($('<option/>', {
                        value: "",
                        text: "-- Selecciona un concepto --"
                    }));
                    $.each(conceptos.Conceptos, function (i, conceptos) {
                        select.append(
                            $('<option></option>').val(conceptos.Value.trim()).html(conceptos.Text.trim()));
                    });

                    $("#cbbConceptos").select2("val", "")
                    $("#cbbConceptos option[value='0']").attr("selected", "selected");

                },
                error: function (reponse) {
                    $('#waitModal').modal('toggle');
                    alert("error : " + reponse);
                }
            });
        }
    }
}
//FIN ASOCIACION CONCEPTO

//NUEVO CONCEPTO
$('#nuevo').on('click', function () {
    $("#txtGRPID").val("");
    $("#txtDesc").val("");
    $('#nuevoModal1').modal('toggle');
});

$("#idEmpresa").change(function () {
    var comboEmpresa = $("#idEmpresa").val();
    if (comboEmpresa == "") {
        $("#nuevo").hide();
        $("#asociar").hide();
    }
    else {
        $("#nuevo").show();
        $("#asociar").show();
    }

});

$('#btnGuardarConcepto').on('click', function () {

    var IdEmpresa = $('#idEmpresa').val();
    var GRPID = $('#txtGRPID').val();
    var GRPDESCE = $('#txtDesc').val();

    if (GRPID == "") {
        $("#mensaje1").show();
        $("#mensaje2").hide();
        return;
    }
    if (GRPDESCE == "") {
        $("#mensaje1").hide();
        $("#mensaje2").show();
        return;
    }

    var dataNewConcepto = {
        GRPID,
        GRPDESCE
    };

    var dataNewEmpresaConcepto = {
        IdEmpresa,
        GRPID
    };

    $.ajax({
        type: 'POST',
        url: '/comisiones/Vendedores/crearConcepto',
        data: JSON.stringify(dataNewConcepto),
        contentType: "application/json; charset=utf-8",
        success: function SuccessCallback(dataNewConcepto) {
            //$('#waitModal').modal('toggle');
            if (!dataNewConcepto.error) {
                $.ajax({
                    type: 'POST',
                    url: '/comisiones/Vendedores/crearEmpresaConcepto',
                    data: JSON.stringify(dataNewEmpresaConcepto),
                    contentType: "application/json; charset=utf-8",
                    success: function SuccessCallback(dataNewEmpresaConcepto) {
                        //$('#waitModal').modal('toggle');
                        if (!dataNewEmpresaConcepto.error) {
                            swal({
                                title: "Informacion guardada exitosamente!",
                                text: dataNewEmpresaConcepto.msg,
                                type: "success",
                                confirmButtonClass: 'btn-success',
                                confirmButtonText: 'ok!'
                            });
                            limpiarCoceptos();
                            GetEmpresayConcepto(IdEmpresa);
                            $('#nuevoModal1').modal('hide');
                        } else {
                            swal({
                                title: "Registro existente",
                                text: dataNewEmpresaConcepto.msg,
                                type: "warning",
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
                    error: function FailureCallback(dataNewEmpresaConcepto) {
                        //$('#waitModal').modal('toggle');
                        swal("Error!", dataNewEmpresaConcepto.msg, "error");

                    }
                });
            } else {
                swal({
                    title: "Registro existente",
                    text: dataNewConcepto.msg,
                    type: "warning",
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
        error: function FailureCallback(dataNewConcepto) {
            //$('#waitModal').modal('toggle');
            swal("Error!", dataNewConcepto.msg, "error");

        }
    });

});

$('#cerrarConcepto').on('click', function () {
    $('#nuevoModal1').modal('hide');
});
//FIN CONCEPTO

//DESCUENTOS AGREGAR

$('#btnConfirmaCliente').on('click', function () {

    var idEmpresa = $('#idEmpresa').val();
    var idCodigoVendedor = $("#idCodigoVendedor").val();
    var idConcepto = $("#cbbConceptos").val();
    var totalAdeudo = parseInt($("#totalAdeudo").val());
    var cantidadDescontar = parseInt($("#cantidadDescontar").val());
    var vigenciaInicio = $("#vigenciaInicio").val();
    var vigenciaFin = $("#vigenciaFin").val();
    var vigenciaIndefinida;
    if ($('#strIntercia').prop('checked')) {
        vigenciaIndefinida = true;
    }
    else {
        vigenciaIndefinida = false;
    }

    if ($('#idEmpresa').val() == "") {
        swal("Advertencia", "Debe de seleccionar una empresa.", "warning");
        return;
    }
    if ($('#idCodigoVendedor').val() == "") {
        swal("Advertencia", "Debe de seleccionar un vendedor.", "warning");
        return;
    }
    if ($('#cbbConceptos').val() == "") {
        swal("Advertencia", "Debe de seleccionar un concepto.", "warning");
        return;
    }

    if (totalAdeudo < cantidadDescontar) {
        swal("Advertencia", "El aduedo no puede ser menor a la cantidad de descuento.", "warning");
        return;
    }
    if (vigenciaIndefinida != true) {
        if (vigenciaFin == "" || vigenciaInicio=="") {
            swal("Advertencia", "Debe de ingresar una fecha.", "warning");
            return;
        }
        if (!validate_fechaMayorQue(vigenciaInicio, vigenciaFin)) {
            swal("Advertencia", "La fecha de vigencia no puede ser mayor a la fecha final.", "warning");
            return;
        }
    }

    if (vigenciaFin == "") {
        vigenciaFin = null;
    }


    var dataNewDescuento = {
        idEmpresa,
        idCodigoVendedor,
        idConcepto,
        totalAdeudo,
        cantidadDescontar,
        vigenciaInicio,
        vigenciaFin,
        vigenciaIndefinida
    };

    $.ajax({
        type: 'POST',
        url: '/comisiones/Vendedores/CreateDescuentos',
        data: JSON.stringify(dataNewDescuento),
        contentType: "application/json; charset=utf-8",
        success: function SuccessCallback(dataNewDescuento) {
            //$('#waitModal').modal('toggle');
            if (!dataNewDescuento.error) {

                swal({
                    title: "Informacion guardada exitosamente!",
                    text: dataNewDescuento.msg,
                    type: "success",
                    confirmButtonClass: 'btn-success',
                    confirmButtonText: 'ok!'
                });
                if (oTable1 != null) {
                    oTable1.destroy();
                }
                limpiarDescuentos();

            } else {
                swal({
                    title: "Registro existente",
                    text: dataNewDescuento.msg,
                    type: "warning",
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
        error: function FailureCallback(dataNewDescuento) {
            //$('#waitModal').modal('toggle');
            swal("Error!", dataNewDescuento.msg, "error");

        }
    });

});

$("#cbbConceptos").change(function () {
    var comboConcepto = $("#cbbConceptos").val();
    if (comboConcepto == "") {
        $("#totalAdeudo").attr('disabled', 'disabled');
        $("#cantidadDescontar").attr('disabled', 'disabled');
        $("#totalAdeudo").val(0);
        $("#cantidadDescontar").val(0);
        $("#vigenciaInicio").attr('disabled', 'disabled');
        $("#vigenciaFin").attr('disabled', 'disabled');
        $("#strIntercia").attr('disabled', 'disabled');
        $("#vigenciaInicio").val('Ingesa la fecha aquí...');
        $("#vigenciaFin").val('Ingesa la fecha aquí...');
        $("#strIntercia").prop('checked', false);

        return;
    }
    $("#totalAdeudo").removeAttr('disabled');
    $("#cantidadDescontar").removeAttr('disabled');
    $("#vigenciaInicio").removeAttr('disabled');
    $("#vigenciaFin").removeAttr('disabled');
    $("#strIntercia").removeAttr('disabled');
});

$("#strIntercia").change(function () {
    if ($('#strIntercia').prop('checked')) {
        $("#vigenciaFin").attr('disabled', 'disabled');
        $("#vigenciaFin").val("");
    }
    else {
        $("#vigenciaFin").removeAttr('disabled');
    }

});

function validate_fechaMayorQue(vigenciaInicio, vigenciaFin) {
    valuesStart = vigenciaInicio.split("/");
    valuesEnd = vigenciaFin.split("/");

    // Verificamos que la fecha no sea posterior a la actual
    var dateStart = new Date(valuesStart[2], (valuesStart[1] - 1), valuesStart[0]);
    var dateEnd = new Date(valuesEnd[2], (valuesEnd[1] - 1), valuesEnd[0]);
    if (dateStart >= dateEnd) {
        return 0;
    }
    return 1;
}

function limpiarDescuentos() {
    $("#idEmpresa").val('0');
    $("#idCodigoVendedor").val(0);
    $("#cbbConceptos").val(0);
    $("#totalAdeudo").val(0);
    $("#cantidadDescontar").val(0);
    $("#vigenciaInicio").val('Ingesa la fecha aquí...');
    $("#vigenciaFin").val('Ingesa la fecha aquí...');
    $("#strIntercia").prop('checked', false);
}

function limpiarCoceptos() {
    $("#txtGRPID").val("");
    $("#txtDesc").val("");
    $('#nuevoModal').modal('hide');

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

    //$.ajax({
    //    url: '/comisiones/vendedores/DescuentosV',
    //    method: "post",
    //    data: { idVendedor: idvendedor },
    //    success: function (response) {
    //        alert('ENTRO');
    //    },
    //    async: true
    //});


});

//FIN DESCUENTOS AGREGAR

//DESCUENTOS AGREGAR
$(document).ready(function () {
    $("#totalAdeudo").attr('disabled', 'disabled');
    $("#cantidadDescontar").attr('disabled', 'disabled');
    $("#vigenciaInicio").attr('disabled', 'disabled');
    $("#vigenciaFin").attr('disabled', 'disabled');
    $("#strIntercia").attr('disabled', 'disabled');
});
//FIN DESCUENTOS AGREGAR

//FIN NUEVAS FUNCIONES 2