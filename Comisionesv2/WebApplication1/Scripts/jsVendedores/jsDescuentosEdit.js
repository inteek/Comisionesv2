var hdnRolID = $("#hdnRolID").val();
var GRPID = null;
var GRPDESCE = null;
var oTable2 = null;
var data_rowConcepto;
$('#guardarConceptoEditar').attr("disabled", true);

$("#ui-datepicker-div").hide();

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
        dom: 'Bfrtlip',
        Columns: [
            { "data": "GRPID" },
            { "data": "GRPDESCE" },
            { "data": "Seleccionar" }
        ],
        bAutoWidth: false,
        aoColumns: [
            { sTitle: "ID", mData: "GRPID", bVisible: true, bSortable: false },
            { sTitle: "Descripcion", mData: "GRPDESCE", bVisible: true, bSortable: false },
            { sTitle: "Seleccionar", mData: "Seleccionar", bVisible: true, bSortable: false }

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

function GetEmpresa(idEmpresa) {
    if (idEmpresa != "") {

        $('#simple-table tbody').remove();
        $.ajax({
            url: '/comisiones/vendedores/getCliente',
            type: "GET",
            dataType: "JSON",
            data: { id_empresa: idEmpresa },
            success: function (clientes) {
                var select = $("#idCliente");
                select.empty();
                select.append($('<option/>', {
                    value: "",
                    text: "-- Selecciona un cliente --"
                }));
                $.each(clientes.Cliente, function (i, cliente) {
                    select.append(
                        $('<option></option>').val(cliente.Value.trim()).html(cliente.Text));
                });

                $("#idCliente").select2("val", "")
                $("#idCliente option[value='0']").attr("selected", "selected");                    
            },
            error: function (reponse) {
                $('#waitModal').modal('toggle');
                alert("error : " + reponse);
            }

        });
    }

}

function GetEmpresayConcepto(idEmpresa) {
    if ($("#idEmpresa").val() != "") {

 
    if (idEmpresa != "") {

        $('#simple-table tbody').remove();

        //$("#module").text("Buscando conceptos...");
        //$('#waitModal').modal('toggle')
        $.ajax({
            url: '/comisiones/vendedores/getCliente',
            type: "GET",
            dataType: "JSON",
            data: { id_empresa: idEmpresa },
            success: function (clientes) {
                var select = $("#idCliente");
                select.empty();
                select.append($('<option/>', {
                    value: "",
                    text: "-- Selecciona un cliente --"
                }));
                $.each(clientes.Cliente, function (i, cliente) {
                    select.append(
                        $('<option></option>').val(cliente.Value.trim()).html(cliente.Text));
                });

                $("#idCliente").select2("val", "")
                $("#idCliente option[value='0']").attr("selected", "selected");

                //$.ajax({
                //    url: '/comisiones/vendedores/getConceptos',
                //    type: "GET",
                //    dataType: "JSON",
                //    data: { id_empresa: idEmpresa },
                //    success: function (conceptos) {
                //        var select = $("#cbbConceptos");
                //        select.empty();
                //        select.append($('<option/>', {
                //            value: "",
                //            text: "-- Selecciona un concepto --"
                //        }));
                //        $.each(conceptos.Conceptos, function (i, conceptos) {
                //            select.append(
                //                $('<option></option>').val(conceptos.Value.trim()).html(conceptos.Text.trim()));
                //        });

                //        $("#cbbConceptos").select2("val", "")
                //        $("#cbbConceptos option[value='0']").attr("selected", "selected");

                //        $('#waitModal').modal('toggle');
                //    },
                //    error: function (reponse) {
                //        $('#waitModal').modal('toggle');
                //        alert("error : " + reponse);
                //    }
                //});
            },
            error: function (reponse) {
                $('#waitModal').modal('toggle');
                alert("error : " + reponse);
            }

        });
    }
    }
}

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

$("#vigenciaindefinida").change(function () {
    if ($('#vigenciaindefinida').prop('checked')) {
        $("#vigenciaFin").attr('disabled', 'disabled');
        $("#vigenciaFin").val("");
    }
    else {
        $("#vigenciaFin").removeAttr('disabled');
    }

});

$("#idEmpresa").change(function () {
    var idrow = $("#idDescuentoConceptoVendedor").val();
    var idEmpresa = $("#idEmpresa").val();
    if (idEmpresa == "") {
        return;
    }
    $.ajax({
        url: '/comisiones/vendedores/getConceptoPorEmpresa',
        type: "GET",
        dataType: "JSON",
        data: {
            idEmpresa: idEmpresa,
            id: idrow
        },
        success: function (concepto) {
            if (concepto != "") {
                $("#idConcepto").val(concepto);
            }
            else {
                $("#idConcepto").val("");
            }
        },
        error: function (reponse) {
            alert("error : " + reponse);
        }
    }); 

});

$('#Editarconcepto').on('click', function () {

    var idEmpresa = $('#idEmpresa').val();

    $.ajax({
        url: '/comisiones/vendedores/getConceptosEdit',
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

$('#guardarConceptoEditar').on('click', function () {

    var idEmpresa = $('#idEmpresa').val();
    $("#idConcepto").val(GRPID);
    $("#asociarModal").modal('hide');

});

$('#table_conceptos').on('click', '.asociarConcepto', function () {
    $("#guardarConceptoEditar").removeAttr("disabled");

    $("#btnGuardar").removeAttr("disabled");
    data_rowConcepto = oTable2.row($(this).closest('tr')).data();
    GRPID = data_rowConcepto["GRPID"];
    GRPDESCE = data_rowConcepto["GRPDESCE"];

});

jQuery(function ($) {
    $(".select2").select2({ allowClear: true })
        .on('change', function () {
            $(this).closest('form').validate().element($(this));
        });

    $('#fuelux-wizard-container')
    .ace_wizard({
        //step: 2 //optional argument. wizard will jump to step "2" at first
        //buttons: '.wizard-actions:eq(0)'
    })
    .on('actionclicked.fu.wizard', function (e, info) {
        if (info.step == 1) {
            if (!$('#DescuentosEdit-form').valid()) {
                e.preventDefault();
            }
            else {
                var statust = "false";
                var vigenciaind = "false";
                if ($('#status').is(':checked')) {
                   statust = "true";
                }
                if ($('#vigenciaindefinida').is(':checked')) {
                    vigenciaind = "true";
                }
                $("#idRegistro").html($("#idDescuentoConceptoVendedor").val().trim())
                $("#totaladeudo").html($("#totalAdeudo").val().trim())
                $("#empresa").html($('#idEmpresa option:selected').val().trim())
                $("#concepto").html($("#idConcepto").val().trim())        
                $("#cantidaddescontar").html($("#cantidadDescontar").val().trim())
                $("#vigenciainicio").html($("#vigenciaInicio").val().trim())
                $("#vigenciafin").html($("#vigenciaFin").val().trim())
                $("#status1").html(statust)
                $("#vigenciaindefinida1").html(vigenciaind)
            }
        }
    })
    .on('finished.fu.wizard', function (e) {
        //Aquí se deberia poner el submit}
        if ($('#empresa').html() == "") {
            swal("Advertencia", "Debe de seleccionar una empresa.", "warning");
            return;
        }
        if ($('#concepto').html() == "") {
            swal("Advertencia", "Debe de seleccionar un concepto.", "warning");
            return;
        }

        if ($("#totaladeudo").html() < $("#cantidaddescontar").html()) {
            swal("Advertencia", "El aduedo no puede ser menor a la cantidad de descuento.", "warning");
            return;
        }
        if ($("#vigenciaindefinida1").html() != true) {
            if (!validate_fechaMayorQue($("#vigenciainicio").html(), $("#vigenciafin").html())) {
                swal("Advertencia", "La fecha de vigencia no puede ser mayor a la fecha final", "warning");
                return;
            }
        }
        var dataNewDescuento = {
            idDescuentoConceptoVendedor: $("#idRegistro").html(),
            totalAdeudo: $("#totaladeudo").html(),
            idEmpresa: $("#empresa").html(),
            idConcepto: $("#concepto").html(),
            cantidadDescontar: $("#cantidaddescontar").html(),
            vigenciaInicio: $("#vigenciainicio").html(),
            vigenciaFin: $("#vigenciafin").html(),
            vigenciaindefinida: $("#vigenciaindefinida1").html(),
            status: $("#status1").html()
        };
        
        $.ajax({
            type: 'POST',
            url: '/comisiones/Vendedores/EditDescuentos',
            data:  JSON.stringify(dataNewDescuento) ,
            contentType: 'application/json; charset=utf-8',
            success: function SuccessCallback(dataNewDescuento) {
                if (!dataNewDescuento.error) {

                    swal({
                        title: "Modificado!",
                        text: dataNewDescuento.msg,
                        type: "success",
                        confirmButtonClass: 'btn-success',
                        confirmButtonText: 'ok!'
                    },
                    function (isConfirm) {
                        if (isConfirm) {
                            window.location.href = "/comisiones/Vendedores/DescuentosV/";
                        }
                    });


                } else {
                    swal("Error!", dataNewDescuento.msg, "error");
                }
            },
            error: function FailureCallback(courseNew) {
                swal("Error!", courseNew.msg, "error");

            }
        });

    }).on('stepclick.fu.wizard', function (e) {
        e.preventDefault();//this will prevent clicking and selecting steps
    });


    $.mask.definitions['~'] = '[+-]';
    $('#strTelefono').mask('(999) 999-9999');

    jQuery.validator.addMethod("phone", function (value, element) {
        return this.optional(element) || /^\(\d{3}\) \d{3}\-\d{4}( x\d{1,6})?$/.test(value);
    }, "El número telefónico no es válido");

    $('#vendedores-form').validate({
        errorElement: 'div',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: "",
        rules: {
            strNombre: {
                required: true
            },
            strApellidoP: {
                required: true
            },
            strApellidoM: {
                required: true
            },
            strDireccion: {
                required: true
            },
            strTelefono: {
                required: true,
                phone: 'required'
            },
            strEmail: {
                required: true,
                email: true
            }
        },

        messages: {
            strEmail: {
                required: "El correo es obligatorio.",
                email: "El correo no tiene el formato correcto."
            },
            strNombre: {
                required: "El nombre es obligatorio."
            }
            ,
            strApellidoP: {
                required: "El apellido paterno es obligatorio."
            },
            strApellidoM: {
                required: "El apellido materno es obligatorio."
            },
            strDireccion: {
                required: "La dirección es obligatoria."
            },
            strTelefono: {
                required: "El telefono es requerido."
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

});


$(document).ready(function () {
    $("#vigenciaindefinida").change(function () {
        if ($('#vigenciaindefinida').prop('checked')) {
            $("#vigenciaFin").attr('disabled', 'disabled');
            $("#vigenciaFin").val("");
        }
        else {
            $("#vigenciaFin").removeAttr('disabled');
        }
        
    });
    //$("#Cancelar").click(function () {
    //    window.location.href = "/comisiones/Vendedores/DescuentosV/";

    //});
 
    
    var idEmpresa1 = $("#idEmpresa").val();
    GetEmpresayConcepto(idEmpresa1);
});