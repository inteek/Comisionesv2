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
    lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
    Columns: [
               { "data": "tipo" },
               { "data": "nombre_usuario" },
               { "data": "seccion" },
               { "data": "descripcion" },
               { "data": "fecha" }
    ],
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
            className: 'btn btn-white btn-primary btn-bold',
            orientation: 'landscape',
            title: "Historial de eventos "
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
              name: "Historico Eventos",
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
    bAutoWidth: false,
    aoColumns: [
        { sTitle: "Tipo evento", mData: "tipo", bvisible: true, bSortable: true },
        { sTitle: "Usuario", mData: "nombre_usuario", bVisible: true, bSortable: true },
        { sTitle: "Pantalla", mData: "seccion", bSortable: true },
        { sTitle: "Descripción", mData: "descripcion", bSortable: true },
        { sTitle: "Fecha y hora", mData: "fecha", bSortable: true }
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