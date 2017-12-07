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


                    $("#lblEmpresa").html($("#IdEmpresa option:selected").text().trim())
                    $("#lblDescripcion").html($("#Descripcion").val().trim())
                    $("#lblNumPatente").html($("#IdPatente").val().trim())
                    //$("#lblDireccion").html($("#strDireccion").val().trim())
                    //$("#lblTipo").html($('#strTipoVendedor option:selected').text().trim())
                    //$("#lblTelefono").html($("#strTelefono").val().trim())
                    //$("#lblEmail").html($("#strEmail").val().trim())
                }
            }
        })
        .on('finished.fu.wizard', function (e) {
           
            var dataNewPatente = {
                IdEmpresa: $("#IdEmpresa option:selected").val(),
                    Descripcion: $("#Descripcion").val(),
                    IdPatente: $("#IdPatente").val()
            };

            $.ajax({
                type: 'POST',
                url: '/comisiones/Patentes/Create',
                data: JSON.stringify(dataNewPatente),
                contentType: "application/json; charset=utf-8",
                success: function SuccessCallback(dataNewVendedores) {
                    if (!dataNewVendedores.error) {

                        swal({
                            title: "Guardar!",
                            text: dataNewVendedores.msg,
                            type: "success",
                            confirmButtonClass: 'btn-success',
                            confirmButtonText: 'ok!'
                        },
                        function (isConfirm) {
                            if (isConfirm) {
                                window.location.href = "/comisiones/Patentes/";
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
                IdEmpresa: {
                    required: true
                },
                Descripcion: {
                    required: true
                },
                IdPatente: {
                    required: true
                }
            },

            messages: {
                IdEmpresa: {
                    required: "La empresa es un valor requerido",
                },
                Descripcion: {
                    required: "La Descripción es un valor requerido"
                },
                IdPatente: {
                    required: "El Num. Patente es un valor requerido"
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

