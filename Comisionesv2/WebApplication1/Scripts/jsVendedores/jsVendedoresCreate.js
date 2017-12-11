//$(document).on('change', ':file', function () {

//    var input = $(this);
//    var numFiles = input.get(0).files ? input.get(0).files.length : 1;
//    var label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
//    console.log(input.mozFullPath);
//    input.trigger('fileselect', [numFiles, label, input.val()]);
//});

//$(':file').on('fileselect', function (event, numFiles, label, dirFile) {
    
//    var input = $(this).parents('.input-group').find(':text'),
//        log = numFiles > 1 ? numFiles + ' files selected' : label;

//    if (input.length) {
//        //debugger;
//        input.val(log);
//    } else {
//        var param = {
//            file: dirFile
//        }

//        $.ajax({
//            type: 'POST',
//            url: '/comisiones/vendedores/ValidarArchivo_Abierto',
//            data: JSON.stringify(param),
//            contentType: "application/json; charset=utf-8",
//            success: function SuccessCallback(param) {
//                label = label.replace(".", "").replace(/ /g, "");
//                if (!param.error) {
//                    $('#simple-table').append('<tr id="' + label + '">' +
//                    '<td>' + dirFile + '</td>' +
//                    '<td style="width: 10px;"><button id="aa" class="btn btn-danger btn-xs" onclick="fnEliminarDocumento(&quot;' + label + '&quot;)"><i class="ace-icon fa fa-trash-o bigger-120"></i></button></td>' +
//                    '</tr>');
//                } else {
//                    swal("Error!", param.msg, "error");
//                }
//            },
//            error: function FailureCallback(param) {
//                //debugger;
//                swal("Error!", param.msg, "error");

//            }
//        });
//    }
//});

$('#txtUploadFile').on('change', function (e) {
    var files = e.target.files;

    if (files.length > 0) {
        if (window.FormData !== undefined) {
            var data = new FormData();
            //debugger;
            for (var x = 0; x < files.length; x++) {

    data.append(files[x].name, files[x]);
            }

            $.ajax({
                type: "POST",
                url: '/comisiones/Vendedores/UploadFile',
                contentType: false,
                processData: false,
                data: data,
                success: function (data) {
                    var label = data.msg.replace(".", "").replace(/ /g, "");
                    if (!data.error) {
                        $('#simple-table').append('<tr id="' + label + '">' +
                        '<td>' + data.msg + '</td>' +
                        '<td style="width: 10px;"><button id="aa" class="btn btn-danger btn-xs" onclick="fnEliminarDocumento(&quot;' + label + '&quot;)"><i class="ace-icon fa fa-trash-o bigger-120"></i></button></td>' +
                        '</tr>');
                    } else {
                        swal("Error!", data.msg, "error");
                    }
                },
                error: function (xhr, status, p3, p4) {
                    swal("Error!", data.msg, "error");
                }
            });
        } else {
            alert("This browser doesn't support HTML5 file uploads!");
            swal("Error!", "Este navegador no soporta la carga de archivos vía HTML5!", "error");
        }
    }
});

function fnCerrarPopup() {
    $('#adjuntarEvidenciaModal').modal('toggle');
}


function fnAdjuntarEvidencia() {
    $("#adjuntarEvidenciaModal").modal('toggle');
}

function fnEliminarDocumento(val) {
    $("#" + val).remove();
}

function fnGuardarEvidencias() {

}

var TableDataVendedoresCreate = function () {
    "use strict";

    $(".select2").select2({ allowClear: true })
       .on('change', function () {
           $(this).closest('form').validate().element($(this));
       });

    var runDataTable_VendedoresCreate = function () {

        $.mask.definitions['~'] = '[+-]';
        $('#strTelefono').mask('(999) 999-9999');

        jQuery.validator.addMethod("strTelefono", function (value, element) {
            return this.optional(element) || /^\(\d{3}\) \d{3}\-\d{4}( x\d{1,6})?$/.test(value);
        }, "El número telefónico no es válido");



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


                    $("#lblNombre").html($("#strNombre").val().trim())
                    $("#lblPaterno").html($("#strApellidoP").val().trim())
                    $("#lblMaterno").html($("#strApellidoM").val().trim())
                    $("#lblDireccion").html($("#strDireccion").val().trim())
                    $("#lblTipo").html($('#strTipoVendedor option:selected').text().trim())
                    $("#lblTelefono").html($("#strTelefono").val().trim())
                    $("#lblEmail").html($("#strEmail").val().trim())
                }
            }
        })
        .on('finished.fu.wizard', function (e) {
            var strNombre = $("#strNombre").val();
            var strApellidoP = $("#strApellidoP").val();
            var strApellidoM = $("#strApellidoM").val();
            var strDireccion = $("#strDireccion").val();
            var strTipoVendedor = $('#strTipoVendedor option:selected').text();
            var strTelefono = $("#strTelefono").val();
            var strEmail = $("#strEmail").val();

            var dataNewVendedores = {
                strNombre: strNombre,
                strApellidoP: strApellidoP,
                strApellidoM: strApellidoM,
                strDireccion: strDireccion,
                strTipoVendedor: strTipoVendedor,
                strTelefono: strTelefono,
                strEmail: strEmail
            };

            $.ajax({
                type: 'POST',
                url: '/comisiones/Vendedores/Create',
                data: JSON.stringify(dataNewVendedores),
                contentType: "application/json; charset=utf-8",
                success: function SuccessCallback(dataNewVendedores) {
                    if (!dataNewVendedores.error) {

                        //debugger;
                        var dataFilesEvidencia = {
                            Files: [],
                            IdVendedor: dataNewVendedores.Id
                        };

                        var hdnRolID = $("#hdnRolID").val();

                        if (hdnRolID == "Operador" || hdnRolID == "Administrador") {
                            var table = $("#simple-table tbody");

                            table.find('tr').each(function (i, el) {
                                var tds = $(this).find('td');
                                dataFilesEvidencia.Files.push(tds.eq(0).text());
                            });
                        }

                        //debugger;
                        if (dataFilesEvidencia.Files.length > 0) {
                            swal({
                                title: "Guardar!",
                                text: dataNewVendedores.msg,
                                type: "success",
                                confirmButtonClass: 'btn-success',
                                confirmButtonText: 'ok!'
                            });

                            $.ajax({
                                type: 'POST',
                                url: '/comisiones/vendedores/GuardarEvidencias',
                                data: JSON.stringify(dataFilesEvidencia),
                                contentType: "application/json; charset=utf-8",
                                success: function SuccessCallback(dataFilesEvidencia) {
                                    //debugger;
                                    if (!dataFilesEvidencia.error) {
                                        swal({
                                            title: "Guardar evidencia!",
                                            text: dataFilesEvidencia.msg,
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
                                        swal("Error!", dataFilesEvidencia.msg, "error");
                                        window.location.href = "/comisiones/Vendedores/";
                                    }
                                },
                                error: function FailureCallback(dataFilesEvidencia) {
                                    debugger;
                                    swal("Error!", dataFilesEvidencia.msg, "error");
                                    window.location.href = "/comisiones/Vendedores/";
                                }
                            });
                        } else {

                            swal({
                                title: "Guardar!",
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

                        }
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
                    strTelefono: 'required'
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
                },
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

