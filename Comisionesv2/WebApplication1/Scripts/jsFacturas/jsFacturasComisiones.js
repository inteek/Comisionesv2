
var oTable2 =
$("#dynamic-table-com")
.DataTable({
    bAutoWidth: true,
    "sScrollX": "100%",
    "sScrollXInner": "120%",
    "bScrollCollapse": true,

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
    ajax: "/comisiones/Facturas/AjaxHandlerGet",
    Columns: [
                //{ "data": "TIPO_REPORTE" },
                //{ "data": "NOMBRE" }
                //{ "data": "PERIODO" }
                //{ "data": "seleccionado" },
                //{ "data": "TIPO_REPORTE" },
                //{ "data": "NOMBRE" }
                //{ "data": "PERIODO" },
                //{ "data": "SOPNUMBE" },
                //{ "data": "DATEENVIO" },
                //{ "data": "DATEPAGO" },
                //{ "data": "DIAS" },
                //{ "data": "CUSTNMBR" },
                //{ "data": "CUSTNAME" },
                //{ "data": "ITEMNMBR" },
                //{ "data": "COMISION" },
                //{ "data": "ID" }
    ],
    //aoColumns: [
    //{ sTitle: "Nombre", mData: "Nombre", bSortable: true }
    //    //{ sTitle: "<input  class='ace' type='checkbox' id='example-select-all' style='opacity:100; position:relative;' />", mData: "seleccionado", bvisible: true, bSortable: false, },
    //    //{ sTitle: "TIPO REPORTE", mData: "TIPO_REPORTE", bSortable: true },
    //    //{ sTitle: "NOMBRE", mData: "NOMBRE", bSortable: true },
    //    //{ sTitle: "PERIODO", mData: "PERIODO", bSortable: true },
    //    //{ sTitle: "FACTURA ", mData: "SOPNUMBE", bSortable: false },
    //    //{ sTitle: "FECHA ENVIO", mData: "DATEENVIO", bSortable: true },
    //    //{ sTitle: "FECHA PAGO", mData: "DATEPAGO", bSortable: true },
    //    //{ sTitle: "DIAS", mData: "DIAS", bSortable: true },
    //    //{ sTitle: "ID CLIENTE", mData: "CUSTNMBR", bSortable: true },
    //    //{ sTitle: "CLIENTE", mData: "CUSTNAME", bSortable: true },
    //    //{ sTitle: "CONCEPTO", mData: "ITEMNMBR", bSortable: true },
    //    //{ sTitle: "COMISION", mData: "COMISION", bSortable: true },
    //    //{ sTitle: "ID", mData: "ID", bSortable: true }
    //],
    aoColumns: [
                { sTitle: "<input  class='ace' type='checkbox' id='example-select-all' style='opacity:100; position:relative;' />", mData: "seleccionado", bvisible: true, bSortable: false, },
                { sTitle: "Empresa", mData: "Empresa", bSortable: true },
        { sTitle: "TIPO REPORTE", mData: "TIPO_REPORTE", bSortable: true },
        { sTitle: "NOMBRE", mData: "NOMBRE", bSortable: true },
        { sTitle: "PERIODO", mData: "PERIODO", bSortable: true },
        { sTitle: "FACTURA ", mData: "SOPNUMBE", bSortable: false },
        { sTitle: "FECHA ENVIO", mData: "DATEENVIO", bSortable: true },
        { sTitle: "FECHA PAGO", mData: "DATEPAGO", bSortable: true },
        { sTitle: "DIAS", mData: "DIAS", bSortable: true },
        { sTitle: "ID CLIENTE", mData: "CUSTNMBR", bSortable: true },
        { sTitle: "CLIENTE", mData: "CUSTNAME", bSortable: true },
        { sTitle: "CONCEPTO", mData: "ITEMNMBR", bSortable: true },
        { sTitle: "COMISION", mData: "COMISION", bSortable: true },
        { sTitle: "ID", mData: "ID", bSortable: true }
    ],
    "aoColumnDefs": [
           {
               "aTargets": [0],
               "mData": "seleccionado",
               "mRender": function (data, type, full) {
                   return '<input type="checkbox" name="id[]" value="' + $('<div/>').text(data).html() + '">';
               }
           }
    ],
    aaSorting: [],
    //bServerSide: true,
    //ajax:
    // {
    //     url: "/comisiones/Facturas/AjaxHandler",
    //     type: "POST",
    //     dataType: "JSON",
    //     contentType:"application/json; charset=utf-8",
    //     dataSrc: function (data) {
    //         data = JSON.stringify(data);
    //     }
    // },
    "serverSide": true,
    "ajax": {
        "type": "POST",
        "url": '/comisiones/Facturas/DataHandler?idVendedor=' + 0 +'&periodo='+ 0 + '&comisionar=' + 1 ,
        "contentType": 'application/json; charset=utf-8',
        'data': function (data) { return data = JSON.stringify(data); }
    },
    bProcessing: true,

   });





//ColVis extension
var colvis2 = new $.fn.dataTable.ColVis(oTable2, {
    "buttonText": "<i class='fa fa-search'></i>",
    "aiExclude": [0, 6],
    "bShowAll": true,
    //"bRestore": true,
    "sAlign": "Center",
    "fnLabel": function (i, title, th) {
        return $(th).text();//remove icons, etc
    }

});

//style it
$(colvis2.button()).addClass('btn-group').find('button').addClass('btn btn-white btn-info btn-bold')

//and append it to our table tools btn-group, also add tooltip
$(colvis2.button())
.prependTo('.tableTools-container .btn-group')
.attr('title', 'Show/hide columns').tooltip({ container: 'body' });


function buscarComisiones() {
    $("#tablaComisiones").html('<div style="width:100%; text-align:center;"><h3>Adquiriendo datos...</h3><img src="../../assets/images/103.gif"></div>');

    var radioValue = $("input[name='rbComisionable']:checked").val();
    $("#tablaComisiones").load("/comisiones/Facturas/ObtenerComisiones?vendedor=" + $("#idVendedor").val() + "&periodo=" + $("#txtPeriodo").val() + "&tipo=" + radioValue);
}

//initiate TableTools extension
var tableTools_obj = new $.fn.dataTable.TableTools(oTable2, {
    "sRowSelector": "td:not(:last-child)",
    "sRowSelect": "multi",
    "fnRowSelected": function (row) {
        //check checkbox when row is selected
        try { $(row).find('input[type=checkbox]').get(0).checked = true }
        catch (e) { }
    },
    "fnRowDeselected": function (row) {
        //uncheck checkbox
        try { $(row).find('input[type=checkbox]').get(0).checked = false }
        catch (e) { }
    },

    "sSelectedClass": "success"
});

//$('#example-select-all').on('click', function () {
//    // Get all rows with search applied
//    var rows = oTable2.rows({ 'search': 'applied' }).nodes();
//    // Check/uncheck checkboxes for all rows in the table
//    $('input[type="checkbox"]', rows).prop('checked', this.checked);
//});

//And for the first simple table, which doesn't have TableTools or dataTables
//select/deselect all rows according to table header checkbox

    //alert("Seleccionar");
    //var th_checked = this.checked;//checkbox inside "TH" table header

    //$(this).closest('table').find('tbody > tr').each(function () {
    //    var row = this;
    //    if (th_checked) $(row).addClass(active_class).find('input[type=checkbox]').eq(0).prop('checked', true);
    //    else $(row).removeClass(active_class).find('input[type=checkbox]').eq(0).prop('checked', false);
    //});
    //alert("Seleccionar 2");
//}

//$('#example-select-all').change(function () {
//    var cells = table.cells().nodes();
//    $(cells).find(':checkbox').prop('checked', $(this).is(':checked'));
//});

//var active_class = 'active';
//$('#dynamic-table-com > thead > tr > th input[type=checkbox]').eq(0).on('click', function () {
//    var th_checked = this.checked;//checkbox inside "TH" table header

//    $(this).closest('table').find('tbody > tr').each(function () {
//        var row = this;
//        if (th_checked) $(row).addClass(active_class).find('input[type=checkbox]').eq(0).prop('checked', true);
//        else $(row).removeClass(active_class).find('input[type=checkbox]').eq(0).prop('checked', false);
//    });
//});

////select/deselect a row when the checkbox is checked/unchecked
//$('#dynamic-table-com').on('click', 'td input[type=checkbox]', function () {
//    var $row = $(this).closest('tr');
//    if (this.checked) $row.addClass(active_class);
//    else $row.removeClass(active_class);
//});