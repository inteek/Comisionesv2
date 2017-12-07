var oTable1 =
$('#dynamic-table')
.dataTable({
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
                     filename: "Comisiones - Reporte Vendedores " + utc //do not include extension
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
               { "data": "idVendedor" },
               { "data": "strNombre" },
               { "data": "strDireccion" },
               { "data": "strTelefono" },
               { "data": "strEmail" },
               { "data": "strTipo" },
               { "data": "dtFechaAlta" },
               { "data": "dtFechaModifica" },
               { "data": "boolActivo" }
    ],
    bAutoWidth: false,
    aoColumns: [
        { sTitle: "Código", mData: "idVendedor", bSortable: true },
        { sTitle: "Nombre", mData: "strNombre", bSortable: true },
        { sTitle: "Dirección", mData: "strDireccion", bSortable: true },
        { sTitle: "Telefono", mData: "strTelefono", bSortable: false },
        { sTitle: "Email", mData: "strEmail", bSortable: true },
        { sTitle: "Tipo", mData: "strTipo", bSortable: false },
        { sTitle: "Fecha Alta", mData: "dtFechaAlta", bSortable: true },
        { sTitle: "Fecha Mod", mData: "dtFechaModifica", bSortable: true },
        { sTitle: "Activo", mData: "boolActivo", bVisible: false, bSortable: false }
     
    ],
    /* inside datatable initialization */
    "aoColumnDefs": [
           {
               "aTargets": [9],
               "mData": null,
               "mRender": function (data, type, full) {
                   var hdnRolID = $("#hdnRolID").val();
                   if (hdnRolID == "Administrador") {
                       return '<a href="/comisiones/Vendedores/Edit/' + data['idVendedor'] + '" class="edit-row tooltip-success" data-rel="tooltip" title="Editar" onclick="updateVendedores(' + data['idVendedor'] + ');"><span class="green"><i class="ace-icon fa fa-pencil-square-o bigger-120"></i></span></a> <a href="#" class="delete-row tooltip-error" data-rel="tooltip" title="Eliminar" onclick="deleteVendedores(\'' + data['idVendedor'] + '\');"><span class="red"><i class="ace-icon fa fa-trash-o bigger-120"></i></span></a>';
                   }
                   else {
                       return '<a href="/comisiones/Vendedores/Edit/' + data['idVendedor'] + '" class="edit-row tooltip-success" data-rel="tooltip" title="Editar" onclick="updateVendedores(' + data['idVendedor'] + ');"><span class="green"><i class="ace-icon fa fa-pencil-square-o bigger-120"></i></span></a>';
                   }
               }
           }
    ],
    "aaSorting": []

    //"iDisplayLength": 50
});
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
        filename: "Comisiones - Reporte Vendedores " + utc //do not include extension
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

function updateVendedores(id_vendedor) {
    var url = window.location.host + '/comisiones/Vendedores/Edit/' + id_vendedor;
    window.location.href = window.location.host + url;

}

function deleteVendedores(id_vendedor) {
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
                      url: '/comisiones/Vendedores/Delete',
                      data: 'id=' + id_vendedor,
                      //contentType: 'application/json',
                      success: function (deteleCourse) {
                          if (!deteleCourse.error) {
                              swal({
                                  title: "Eliminado!",
                                  text: deteleCourse.msg,
                                  type: "success",
                                  confirmButtonClass: 'btn-success',
                                  confirmButtonText: 'ok!'
                              },
                              function (isConfirm) {
                                  window.location.href = "/comisiones/Vendedores/";

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

function editVendedor(id_vendedor) {

    window.location.href = "/comisiones/Vendedores/Edit/" + id_vendedor;
}


