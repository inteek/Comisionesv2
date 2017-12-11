﻿jQuery(function ($) {
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
            if (!$('#vendedores-form').valid()) {
                e.preventDefault();
            }
            else {
                $("#lblIdVendedor").html($("#idCodigoVendedor").val().trim())
                $("#lblNombre").html($("#strNombre").val().trim())
                $("#lblPaterno").html($("#strApellidoP").val().trim())
                $("#lblMaterno").html($("#strApellidoM").val().trim())
                $("#lblDireccion").html($("#strDireccion").val().trim())
                $("#lblTipo").html($('#strTipoVendedor option:selected').text().trim())
                $("#lblTelefono").html($("#strTelefono").val().trim())
                $("#lblEmail").html($("#strEmail").val().trim())
                $("#lblBanco").html($('#idBanco option:selected').text().trim())
                $("#lblClabe").html($("#ClabeInterbancaria").val().trim())
                $("#lblTipoPago").html($('#idTipoPago option:selected').text().trim())
            }
        }
    })
    .on('finished.fu.wizard', function (e) {
        //Aquí se deberia poner el submit}
        var dataNewVendedores = {
            idCodigoVendedor: $("#idCodigoVendedor").val().trim(),
            strNombre: $("#lblNombre").html(),
            strApellidoP: $("#lblPaterno").html(),
            strApellidoM: $("#lblMaterno").html(),
            strDireccion: $("#lblDireccion").html(),
            strTipoVendedor: $("#lblTipo").html(),
            strTelefono: $("#lblTelefono").html(),
            strEmail: $("#lblEmail").html(),
            idBanco: $('#idBanco option:selected').val().trim(),
            ClabeInterbancaria: $("#lblClabe").html(),
            TipoPago: $('#idTipoPago option:selected').val().trim(),
        };
        
        $.ajax({
            type: 'POST',
            url: '/comisiones/Vendedores/Edit',
            data:  JSON.stringify(dataNewVendedores) ,
            contentType: 'application/json; charset=utf-8',
            success: function SuccessCallback(dataNewVendedores) {
                if (!dataNewVendedores.error) {

                    swal({
                        title: "Modificado!",
                        text: dataNewVendedores.msg,
                        type: "success",
                        confirmButtonClass: 'btn-success',
                        confirmButtonText: 'ok!'
                    },
                    function (isConfirm) {
                        if (isConfirm) {
                            window.location.href = "/comisiones/Vendedores/";
                        }
                    });


                } else {
                    swal("Error!", dataNewVendedores.msg, "error");
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
            },
            idBanco: {
                required: true
            },
            ClabeInterbancaria: {
                required: true
            },
            TipoPago: {
                required: true
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
            },
            idBanco: {
                required: "Debe de seleccionar un banco."//CAMBIOS
            },
            ClabeInterbancaria: {
                required: "Debe de ingresar una clabe interbancaria de 18 dijitos."//CAMBIOS
            },
            TipoPago: {
                required: "Debe de seleccionar un tipo de pago."//CAMBIOS
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