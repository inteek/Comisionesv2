var vigenciaIn = false;

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


var TableDataVendedoresCreate = function () {
    "use strict";

    $(".select2").select2({ allowClear: true })
       .on('change', function () {
           $(this).closest('form').validate().element($(this));
       });

    var runDataTable_VendedoresCreate = function () {



        $.mask.definitions['~'] = '[+-]';
        //$('#strTelefono').mask('(999) 999-9999');

        /*
        jQuery.validator.addMethod("strTelefono", function (value, element) {
            return this.optional(element) || /^\(\d{3}\) \d{3}\-\d{4}( x\d{1,6})?$/.test(value);
        }, "El número telefónico no es válido");
        */


        var $validation = false;
        $('#fuelux-wizard-container')
        .ace_wizard({

        })
        .on('actionclicked.fu.wizard', function (e, info) {
            if (info.step == 1) {
                if (!$('#vendedores-form').valid()) {
                    e.preventDefault();
                }
                else {
                    
                    if ($('#strIntercia').prop('checked')) {
                        vigenciaIn = true;
                    }
                    else {
                        vigenciaIn = false;
                    }

                    $("#lblEmpresa").html($("#idEmpresa option:selected").text().trim())
                    $("#lblVendedor").html($("#idCodigoVendedor option:selected").text().trim())
                    $("#lblConceptos").html($("#cbbConceptos option:selected").text().trim())

                    if (parseInt($("#totalAdeudo").val()) == 0) {
                        swal("Advertencia", "El total de adeudo debe ser mayor a 0.", "warning");
                        e.preventDefault();
                        return;
                    }

                    if (parseInt($("#totalAdeudo").val()) < parseInt($("#cantidadDescontar").val())) {
                        swal("Advertencia", "El total de adeudo debe ser mayor al descuento.", "warning");
                        e.preventDefault();
                        return;
                    }
                    if (parseInt($("#cantidadDescontar").val()) == 0) {
                        swal("Advertencia", "La cantidad a descontar debe ser mayor a 0.", "warning");
                        e.preventDefault();
                        return;
                    }
                    if (vigenciaIn != true) {
                        if (!validate_fechaMayorQue($("#vigenciaInicio").val(), $("#vigenciaFin").val())) {
                            swal("Advertencia", "La fecha de vigencia no puede ser mayor a la fecha final.", "warning");
                            e.preventDefault();
                            return;
                        }
                    }
                    $("#lblAdeudo").html($("#totalAdeudo").val().trim())
                    $("#lblDescontar").html($("#cantidadDescontar").val().trim())
                    $("#lblVigencia").html($("#vigenciaInicio").val().trim())
                    $("#lblAl").html($("#vigenciaFin").val().trim())
                    $("#lblIndefinida").html(vigenciaIn)

                }
            }
        })
        .on('finished.fu.wizard', function (e) {
            var dataNewDescuento = {
                IdEmpresa: $("#idEmpresa option:selected").val(),
                idCodigoVendedor: $("#idCodigoVendedor option:selected").val(),
                idConcepto: $("#cbbConceptos option:selected").val(),
                totalAdeudo: $("#totalAdeudo").val(),
                cantidadDescontar: $("#cantidadDescontar").val(),
                vigenciaInicio: $("#vigenciaInicio").val(),
                vigenciaFin: $("#vigenciaFin").val(),
                vigenciaIndefinida: vigenciaIn,
            };

            $.ajax({
                type: 'POST',
                url: '/comisiones/Vendedores/CreateDescuentos',
                data: JSON.stringify(dataNewDescuento),
                contentType: "application/json; charset=utf-8",
                success: function SuccessCallback(dataNewVendedores) {
                    if (!dataNewVendedores.error) {

                        swal({
                            title: "Guardado correctamente!",
                            text: dataNewVendedores.msg,
                            type: "success",
                            confirmButtonClass: 'btn-success',
                            confirmButtonText: 'ok!'
                        },
                        function (isConfirm) {
                            if (isConfirm) {
                                window.location.href = "/comisiones/Vendedores/IndexDescuentos";
                            }
                        });


                    } else {
                        swal("Error!", dataNewVendedores.msg, "error");
                    }
                },
                error: function FailureCallback(dataNewVendedores) {
                    swal("Error!", dataNewVendedores.msg, "error");

                }
            });


        }).on('stepclick.fu.wizard', function (e) {
            e.preventDefault();//this will prevent clicking and selecting steps
        });





        $('#vendedores-form').validate({
            errorElement: 'div',
            errorClass: 'help-block',
            focusInvalid: false,
            ignore: "",
            rules: {
                idEmpresa: {
                    required: true
                },
                idCodigoVendedor: {
                    required: true
                },
                cbbConceptos: {
                    required: true
                },
                totalAdeudo: {
                    required: true
                },
                cantidadDescontar: {
                    required: true
                }, 
                vigenciaInicio: {
                    required: true
                }
            },

            messages: {
                idEmpresa: {
                    required: "La empresa es un valor requerido",
                },
                idCodigoVendedor: {
                    required: "El vendedor es un valor requerido"
                },
                cbbConceptos: {
                    required: "El concepto es un valor requerido"
                },
                totalAdeudo: {
                    required: "El adeudo es un valor requerido"
                },
                cantidadDescontar: {
                    required: "La cantidad a descontar es un valor requerido"
                },
                vigenciaInicio: {
                    required: "La fecga de inicio es un valor requerido"
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
            runDataTable_VendedoresCreate();
        }
    };


}();


$(document).ready(function () {
    $("#strIntercia").change(function () {
        if ($('#strIntercia').prop('checked')) {
            $("#vigenciaFin").attr('disabled', 'disabled');
            $("#vigenciaFin").val("");
        }
        else {
            $("#vigenciaFin").removeAttr('disabled');
        }

    });
});