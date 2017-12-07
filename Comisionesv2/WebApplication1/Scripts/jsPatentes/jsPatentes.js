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
               { "data": "IdEmpresa" },
               { "data": "Empresa" },
               { "data": "IdPatente" },
               { "data": "Descripcion" },
               { "data": "UsuarioAlta" },
               { "data": "FechaAlta" },
               { "data": "UsuarioModifica" },
               { "data": "FechaModifica" },
               { "data": "Activo" }
    ],
    bAutoWidth: false,
    aoColumns: [
        { sTitle: "IdEmpresa", mData: "IdEmpresa", bVisible: false, bSortable: true },
        { sTitle: "Empresa", mData: "Empresa", bSortable: true },
        { sTitle: "Num. Patente", mData: "IdPatente", bSortable: true },
        { sTitle: "Descripcion", mData: "Descripcion", bSortable: false },
        { sTitle: "Usuario Alta", mData: "UsuarioAlta", bSortable: true },
        { sTitle: "Fecha Alta", mData: "FechaAlta", bSortable: false },
        { sTitle: "Usuario Mod", mData: "UsuarioModifica", bSortable: true },
        { sTitle: "Fecha Mod", mData: "FechaModifica", bSortable: true },
        { sTitle: "Activo", mData: "Activo", bSortable: false }
     
    ],
    /* inside datatable initialization */
    "aoColumnDefs": [
           {
               "aTargets": [9],
               "mData": null,
               "mRender": function (data, type, full) {
                   var hdnRolID = $("#hdnRolID").val();
                   if (hdnRolID == "Administrador") {
                       return '<a href="/comisiones/Patentes/Edit/?idPatente=' + data['IdPatente'] + '&idEmpresa=' + data['IdEmpresa'] + '" class="edit-row tooltip-success" data-rel="tooltip" title="Editar" onclick="updatePatentes(' + data['IdPatente'] + ',' + data['IdEmpresa'] + ');"><span class="green"><i class="ace-icon fa fa-pencil-square-o bigger-120"></i></span></a> <a href="#" class="delete-row tooltip-error" data-rel="tooltip" title="Eliminar" onclick="deletePatentes(' + data['IdPatente'] + ',' + data['IdEmpresa'] + ');"><span class="red"><i class="ace-icon fa fa-trash-o bigger-120"></i></span></a>';
                   }
                   else {
                       return '<a href="/comisiones/Patentes/Edit/?idPatente=' + data['IdPatente'] + '&idEmpresa=' + data['IdEmpresa'] + '" class="edit-row tooltip-success" data-rel="tooltip" title="Editar" onclick="updatePatentes(' + data['IdPatente'] + ',' + data['IdEmpresa'] + ');"><span class="green"><i class="ace-icon fa fa-pencil-square-o bigger-120"></i></span></a>';
                   }
               }
           }
    ],
    "aaSorting": []

});


$("#btnXLS").click(function () {
    var utc = new Date().toJSON().slice(0, 10).replace(/-/g, '_');
    $("#dynamic-table").table2excel({
        // exclude CSS class
        exclude: ".noExl",
        name: "Worksheet Name",
        filename: "Comisiones - Reporte Vendedores " + utc //do not include extension
    });
});



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




$('th input[type=checkbox], td input[type=checkbox]').prop('checked', false);

$('#dynamic-table > thead > tr > th input[type=checkbox]').eq(0).on('click', function () {
    var th_checked = this.checked;//checkbox inside "TH" table header

    $(this).closest('table').find('tbody > tr').each(function () {
        var row = this;
        if (th_checked) tableTools_obj.fnSelect(row);
        else tableTools_obj.fnDeselect(row);
    });
});

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



var active_class = 'active';
$('#simple-table > thead > tr > th input[type=checkbox]').eq(0).on('click', function () {
    var th_checked = this.checked;//checkbox inside "TH" table header

    $(this).closest('table').find('tbody > tr').each(function () {
        var row = this;
        if (th_checked) $(row).addClass(active_class).find('input[type=checkbox]').eq(0).prop('checked', true);
        else $(row).removeClass(active_class).find('input[type=checkbox]').eq(0).prop('checked', false);
    });
});


$('#simple-table').on('click', 'td input[type=checkbox]', function () {
    var $row = $(this).closest('tr');
    if (this.checked) $row.addClass(active_class);
    else $row.removeClass(active_class);
});


$('[data-rel="tooltip"]').tooltip({ placement: tooltip_placement });




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

function updatePatentes(id_patente, id_empresa) {
    var url = window.location.host + '/comisiones/Patentes/Edit/' + id_patente + '/' + id_empresa;
    window.location.href = window.location.host + url;
}

function deletePatentes(id_patente, id_empresa) {

    alert("id_patente: " + id_patente);

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
                      url: '/comisiones/Patentes/Delete',
                      data: 'idPatente=' + id_patente + "&idEmpresa=" + id_empresa,
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
                                  window.location.href = "/comisiones/Patentes/";

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

function editPatente(id_patente) {

    window.location.href = "/comisiones/Patentes/Edit/" + id_patente;
}





