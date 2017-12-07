var oTable1 =
$('#dynamic-table')
.dataTable({
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
    Columns: [
                //{ "data": "seleccionado" },
                //{ "data": "EMPRESA" },
                //{ "data": "RETENCION" },
                //{ "data": "PERIODO" },
                //{ "data": "NOMBRE" },
                //{ "data": "CUSTNAME" },
                //{ "data": "FACTURA" },
                //{ "data": "DATE_PAGO" },
                //{ "data": "DATE_FACTURA" },
                //{ "data": "DATE_ENVIO" },
                //{ "data": "MONTO_FACTURA" },
                //{ "data": "MONTO_RETENIDO" },
                //{ "data" : "RETENIDO"},
                //{ "data": "DATESYS" },
                //{ "data": "DATE_LIBERA" },
                //{ "data": "ACTIVO" },
                //{ "data": "PERIODO_LIBERADO" }
    ],
    
    //bAutoWidth: true,
    aoColumns: [
        { sTitle: "<input  class='ace' type='checkbox' id='example-select-all' style='opacity:100; position:relative;' />", mData: "seleccionado", bvisible: true, bSortable: false, },
        { sTitle: "EMPRESA", mData: "EMPRESA", bSortable: true },
        { sTitle: "RETENCIÓN", mData: "RETENCION", bSortable: true },
        { sTitle: "PERIODO", mData: "PERIODO", bSortable: true },
        { sTitle: "VENDEDOR", mData: "NOMBRE", bSortable: true },
        { sTitle: "CLIENTE", mData: "CUSTNAME", bSortable: false },
        { sTitle: "FACTURA", mData: "FACTURA", bSortable: true },
        { sTitle: "FECHA PAGO", mData: "DATE_PAGO", bSortable: true },
        { sTitle: "FECHA FACTURA", mData: "DATE_FACTURA", bSortable: true },
        { sTitle: "FECHA ENVÍO", mData: "DATE_ENVIO", bSortable: true },
        { sTitle: "MONTO FACTURA", mData: "MONTO_FACTURA", bSortable: true },
        { sTitle: "MONTO RETENIDO", mData: "MONTO_RETENIDO", bSortable: true },
        { sTitle: "RETENER", mData: "RETENER", bSortable: true },
        { sTitle: "FECHA SISTEMA", mData: "DATESYS", bSortable: true },
        { sTitle: "FECHA LIBERACIÓN", mData: "DATE_LIBERA", bSortable: true },
        { sTitle: "ACTIVO", mData: "ACTIVO", bSortable: true },
        { sTitle: "PERIODO LIBERADO", mData: "PERIODO_LIBERADO", bSortable: true }
    ]
    ,
    "aaSorting": []
});



//ColVis extension
var colvis = new $.fn.dataTable.ColVis(oTable1, {
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
$(colvis.button()).addClass('btn-group').find('button').addClass('btn btn-white btn-info btn-bold')

//and append it to our table tools btn-group, also add tooltip
$(colvis.button())
.prependTo('.tableTools-container .btn-group')
.attr('title', 'Show/hide columns').tooltip({ container: 'body' });

//initiate TableTools extension
//var tableTools_obj = new $.fn.dataTable.TableTools(oTable1, {
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

//    "sSelectedClass": "success"
//});

function buscarRetenidas() {
   // console.log("Buscar facturas retenidas del vendedor com id " + $("#idVendedor").val() + " y el " + $("#txtPeriodo").val());
    //var data = { idVendedor: $("#idVendedor").val(), periodo: $("#txtPeriodo").val() }
    if ($("#txtPeriodo")[0].selectedIndex) {
        $("#tablaRetenciones").html('<div style="width:100%; text-align:center;"><h3>Adquiriendo datos...</h3><img src="../../assets/images/103.gif"></div>');
        $("#tablaRetenciones").load("/comisiones/Facturas/ObtenerRetenciones?idVendedor=" + $("#idVendedor").val() + "&" + "periodo=" + $("#txtPeriodo").val());
    }
    else {
        alert("Selecciona un periodo");
    }
}

$("#btnLiberar").click(function () {
    
   
    var res = $("#dynamic-table").find("#chbLiberar:checked");
    alert(res);
});



//OBTENER LAS FILAS Y ARMAR LAS CADENAS... PENDIENTE
function guardarParametros(objDOM) {

    Array.prototype.remove = function (from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
    };

    datos = [];
  
    $("#chbLiberar:checked", oTable1.fnGetNodes()).each(function () {
        var factura = {}
        console.log("======================00");
        console.log($(this).parent("tr"));
    });
    }
