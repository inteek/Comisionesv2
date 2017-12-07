var hdnRolID = $("#hdnRolID").val();

//Bloquear botones usados por JS dependiendo del rol
if (hdnRolID == "Operador") { // Operador
    $("#cbbConceptos").prop("disabled", true);
    $("#dcmComision").prop("disabled", true);
    $("#btnAgregarConcepto").hide();
}

activaCostoVenta();

var conceptosList = [];

function GetCliente(idEmpresa) {
    if (idEmpresa != "") {
        if (idEmpresa == 1) {
            $("#strIntercia").prop("disabled", true);
            $("#strIntercia").prop("checked", false);
        }
        else {
            $("#strIntercia").prop("disabled", false);
        }

        $('#simple-table tbody').remove();

        $("#module").text("Buscando clientes...");
        $('#waitModal').modal('toggle')
        $.ajax({
            url: '/comisiones/clientesComConfig/getCliente',
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
                var select2 = $("#cboClientePedimento");
                select2.empty();
                select2.append($('<option/>', {
                    value: "",
                    text: "-- Selecciona un cliente --"
                }));

                $.each(clientes.Cliente, function (i, cliente) {
                    select.append(
                        $('<option></option>').val(cliente.Value.trim()).html(cliente.Text));
                    select2.append(
                        $('<option></option>').val(cliente.Value.trim()).html(cliente.Text));
                });

                $("#idCliente").select2("val", "")
                $("#idCliente option[value='0']").attr("selected", "selected");



                $("#strCtePedimento").attr('checked', false);
                $("#cboClientePedimento").select2("val", "")
                $("#cboClientePedimento option[value='0']").attr("selected", "selected");




                $("#module").text("Buscando aduanas...");
                $.ajax({
                    url: '/comisiones/clientesComConfig/getAduanas',
                    type: "GET",
                    dataType: "JSON",
                    data: { id_empresa: idEmpresa },
                    success: function (aduanas) {
                        var select = $("#idAduana");
                        select.empty();
                        //select.append($('<option/>', {
                        //    value: "",
                        //    text: "-- Selecciona una aduana --"
                        //}));
                        $.each(aduanas.Aduana, function (i, aduanas) {
                            select.append(
                                $('<option></option>').val(aduanas.Value).html(aduanas.Text));
                        });

                        $("#idAduana").select2("val", "")
                        $("#idAduana option[value='0']").attr("selected", "selected");

                        $("#module").text("Buscando pedimentos...");
                        $.ajax({
                            url: '/comisiones/clientesComConfig/getPedimentos',
                            type: "GET",
                            dataType: "JSON",
                            data: { id_empresa: 1 },
                            success: function (pedimentos) {
                                var select = $("#idPedimento");
                                select.empty();
                                //select.append($('<option/>', {
                                //    value: "",
                                //    text: "-- Selecciona un pedimento --"
                                //}));
                                $.each(pedimentos.Pedimentos, function (i, pedimentos) {
                                    select.append(
                                        $('<option></option>').val(pedimentos.Value).html(pedimentos.Text));
                                });

                                $("#idPedimento").select2("val", "")
                                $("#idPedimento option[value='0']").attr("selected", "selected");


                                var typeCost = $("input:radio[name=strTipoCosto]").val()
                                if ($('input:radio[name=strTipoCosto]').is(':checked')) {
                                    // Obtener ID de empresa seleccionada
                                    var idEmpresa = $('#IdEmpresa option:selected').val();
                                    if (typeCost == "Costo de Venta Nivel Cliente") {
                                        $("#CostoVentaConcepto").prop("disabled", true);
                                        $("#CostoVentaConcepto").prop("checked", false);

                                        // Se cambia a solo concepto de costo venta

                                        var select = $("#cbbConceptos");
                                        select.empty();
                                        select.append($('<option/>', {
                                            value: "",
                                            text: "-- Selecciona un concepto --"
                                        }));

                                        select.append($('<option></option>').val('OPECTE_CTO_VTA').html('CPTO_COSTO_VENTA'));

                                        $("#cbbConceptos").select2("val", "")
                                        $("#cbbConceptos option[value='0']").attr("selected", "selected");

                                    }
                                    else {
                                        $("#CostoVentaConcepto").prop("disabled", false);
                                        $("#CostoVentaConcepto").prop("checked", false);

                                        // Regresamos a total de conceptos
                                        $("#module").text("Renovando conceptos...");
                                        $('#waitModal').modal('toggle')

                                        $.ajax({
                                            url: '/comisiones/clientesComConfig/getConceptos',
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

                                $('#waitModal').modal('toggle');

                                //$("#module").text("Buscando conceptos...");
                                //$.ajax({
                                //    url: '/clientesComConfig/getConceptos',
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
                    },
                    error: function (reponse) {
                        $('#waitModal').modal('toggle');
                        alert("error : " + reponse);
                    }
                });

            },
            error: function (reponse) {
                $('#waitModal').modal('toggle');
                alert("error : " + reponse);
            }

        });
    }

}

function activaCostoVenta() {
    
    var CostoNivelReferencia = $('input[name=strTipoCosto]:checked').val();

    // if ($("#OPECTE_CTO_VTA").length != 0) {
    if (CostoNivelReferencia != "Costo de Venta Nivel Cliente") {
        $("#CostoVentaConcepto").prop("disabled", false);
        $("#CostoVentaConcepto").prop("checked", false);

        // Regresamos a total de conceptos
        $("#module").text("Renovando conceptos...");
        $('#waitModal').modal('toggle')

        var idEmpresa = $('#IdEmpresa option:selected').val();


        $.ajax({
            url: '/comisiones/clientesComConfig/getConceptos',
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
    else {
        $("#CostoVentaConcepto").prop("disabled", true);
        $("#CostoVentaConcepto").prop("checked", false);

        // Se cambia a solo concepto de costo venta

        var select = $("#cbbConceptos");
        select.empty();
        select.append($('<option/>', {
            value: "",
            text: "-- Selecciona un concepto --"
        }));

        select.append($('<option></option>').val('OPECTE_CTO_VTA').html('CPTO_COSTO_VENTA'));

        $("#cbbConceptos").select2("val", "")
        $("#cbbConceptos option[value='0']").attr("selected", "selected");
    }
}

function fnEliminarConcepto(idConcepto) {
    //Bloquear botones usados por JS dependiendo del rol
    if (hdnRolID == 9) { // Operador
        swal("Error!","El perfil no tiene los suficientes permisos para realizar esta acción", "error");
    }
    else {
        $("#" + idConcepto).remove();
    }
};


var TableDataVendedoresCreate = function () {
    "use strict";

    var jsonConceptos = "";
    $(document).ready(function () {
        if ($('#IdEmpresa option:selected').text().trim() == 'ELI') {
            $("#strIntercia").prop("disabled", true);
        }

        var splitAduana = $('#hdnAduanas').val();
        var arr = splitAduana.split(',');
        for (var i = 0; i < arr.length; i++) {
            $("#idAduana").select2().select2("val", arr);
        }

        var splitPedimentos = $('#hdnPedimentos').val();
        var arr = splitPedimentos.split(',');
        for (var i = 0; i < arr.length; i++) {
            $("#idPedimento").select2().select2("val", arr);
        }
    });

    function fnMensajeModalError(msj) {
        bootbox.dialog({
            message: "<span class='bigger-110'>" + msj + "</span>",
            buttons:
            {
                "danger":
                {
                    "label": "Cerrar aviso",
                    "className": "btn-sm btn-danger",
                    "callback": function () {
                        //Example.show("uh oh, look out!");
                    }
                }
            }
        });
    }


    $("input:radio[name=strTipoCosto]").click(function () {
        if ($(this).is(':checked')) {
            // Obtener ID de empresa seleccionada
            var idEmpresa = $('#IdEmpresa option:selected').val();
            if (this.value == "Costo de Venta Nivel Cliente") {
                $("#CostoVentaConcepto").prop("disabled", true);
                $("#CostoVentaConcepto").prop("checked", false);

                // Se cambia a solo concepto de costo venta

                var select = $("#cbbConceptos");
                select.empty();
                select.append($('<option/>', {
                    value: "",
                    text: "-- Selecciona un concepto --"
                }));

                select.append($('<option></option>').val('OPECTE_CTO_VTA').html('CPTO_COSTO_VENTA'));

                $("#cbbConceptos").select2("val", "")
                $("#cbbConceptos option[value='0']").attr("selected", "selected");

            }
            else {
                $("#CostoVentaConcepto").prop("disabled", false);
                $("#CostoVentaConcepto").prop("checked", false);

                // Regresamos a total de conceptos
                $("#module").text("Renovando conceptos...");
                $('#waitModal').modal('toggle')

                $.ajax({
                    url: '/comisiones/clientesComConfig/getConceptos',
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
    });

    //$("input:radio[name=strTipoCosto]").click(function () {
    //    if ($(this).is(':checked')) {
    //        if (this.value == "Costo de Venta Nivel Cliente") {
    //            $("#CostoVentaConcepto").prop("disabled", true);
    //            $("#CostoVentaConcepto").prop("checked", false);
    //        }
    //        else {
    //            $("#CostoVentaConcepto").prop("disabled", false);
    //            $("#CostoVentaConcepto").prop("checked", false);
    //        }
    //    }
    //});

    $('#btnAgregarConcepto').on('click', function () {
        var conceptoId = $("#cbbConceptos option:selected").val();
        var idCreate = conceptoId

        if (conceptoId != "") {
            if ($('#' + idCreate).length == 0) {
                var comision = $("#dcmComision").val();
                if (comision != "") {
                    var conceptoText = $("#cbbConceptos option:selected").text().trim();
                    var costoVenta = ""
                    var costos = $("input:radio[name=strTipoCosto]:checked").val();
                    if (costos == "Costo de Venta Nivel Cliente") {
                        costoVenta = "Costo de venta nivel Referencia"
                        $("#simple-table tbody").remove();
                    }
                    else {
                        if ($("#CostoVentaConcepto").is(':checked')) {
                            costoVenta = "Costo de venta nivel concepto"
                        }
                        else {
                            costoVenta = "Precio de Venta"
                        }
                    }
                    $('#simple-table').append('<tr id="' + conceptoId + '"><td style="display: none;" >' + 0 + '</td><td>' + conceptoText.trim() + '</td><td>' + costoVenta.trim() + '</td><td>' + comision.trim() + '</td><td><button class="btn btn-xs btn-danger" type="button" onclick="fnEliminarConcepto(&quot;' + conceptoId + '&quot;)"><i class="ace-icon fa fa-trash-o bigger-120"></i></button></td></tr>');
                }
                else {
                    fnMensajeModalError("No es posible agregar un concepto sin un porcentaje de comisión");
                }
            }
            else {
                fnMensajeModalError("No es posible agregar dos veces el mismo concepto");
            }
        }
        else {
            fnMensajeModalError("Selecciona un concepto de la lista antes de agregarlo");
        }


    });


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

        var IdsAduanas = "";
        var TextoAduana = "";
        var IdsPedimentos = "";
        var TextoPedimento = "";

        var $validation = false;
        $('#fuelux-wizard-container')
        .ace_wizard({

        })
        .on('actionclicked.fu.wizard', function (e, info) {
            if (info.step == 1) {
                var valida = true
                if (hdnRolID == "Administrador") {
                    if ($("#simple-table tbody").children().length != 0) {
                        valida = true;
                    }
                    else {
                        e.preventDefault();
                        fnMensajeModalError("No es posible avanzar sin antes tener mínimo un concepto comisionable");
                        valida = false
                    }
                }

                if (valida) {
                    if ($("#idAduana").select2("val") != "")
                    {

                        if ($("#idPedimento").select2("val") == ""){
                            e.preventDefault();
                            fnMensajeModalError("Selecciona mínimo un pedimento clave del catálogo");
                            return;
                        }

                        if ($("#strCtePedimento").is(':checked')) {
                            if ($('#cboClientePedimento').val() == "" || $('#cboClientePedimento').val() == null) {
                                $("#cboClientePedimento").closest('form').validate().element($("#cboClientePedimento"));
                                e.preventDefault();
                                fnMensajeModalError("Si es cliente pedimeto debes de seleccionar uno");
                                return;
                            }
                        }


                        if (!$('#clientesComConfig-form').valid()) {
                            e.preventDefault();
                        }
                        else {
                            var intercia = "No";
                            if ($('#strIntercia').is(':checked')) {
                                intercia = "Si";
                            }

                            var data = $('#idAduana').select2('data');

                            TextoAduana = "";
                            IdsAduanas = "";
                            for (var a = 0; a < data.length; a++) {
                                TextoAduana = TextoAduana + data[a].text + "<br>";
                                IdsAduanas = IdsAduanas + data[a].id + ","
                            }

                            var dataPedimentos = $('#idPedimento').select2('data');

                            TextoPedimento = "";
                            IdsPedimentos = "";
                            for (var a = 0; a < dataPedimentos.length; a++) {
                                TextoPedimento = TextoPedimento + dataPedimentos[a].text + "<br>";
                                IdsPedimentos = IdsPedimentos + dataPedimentos[a].id + ","
                            }

                            IdsPedimentos = IdsPedimentos.substring(0, IdsPedimentos.length - 1);

                            $("#lblEmpresa").html($('#IdEmpresa option:selected').text().trim())
                            $("#lblCliente").html($('#idCliente option:selected').text().trim()) 
                            $("#lblClientePedimento").html($('#cboClientePedimento option:selected').text().trim())
                            $("#lblVendedor").html($('#idCodigoVendedor option:selected').text().trim())
                            $("#lblAduana").html(TextoAduana)
                            $("#lblOperacion").html($('#strTipoOp option:selected').text().trim())
                            $("#lblPedimento").html(TextoPedimento)
                            $("#lblDiasCredito").html($("#intDiasCredito").val())
                            $("#lblDiasGracia").html($("#intDiasGracia").val())
                            $("#lblDiasRetención").html($("#intDiasRetencion").val())
                            //$("#lblCostos").html($("input[name='strTipoCosto']:checked").next('span:first').html())
                            $("#lblIntercia").html(intercia)
                            $("#lblNotificacion").html($("#strNotificacion").val().trim())
                            //$("#lblDescuentoFijo").html($("#dDescuentoFijo").val())
                            $("#lblTipoCambio").html($('#strTipoCambio option:selected').text().trim())

                            $("#simple-table2 tbody").empty();
                            $("#simple-table tbody tr").each(function (index) {
                                var id = $(this).attr('id')
                                var idRelConceptoVendedor, strConcepto, strCostoVenta, dcmComision;
                                $(this).children("td").each(function (index2) {
                                    switch (index2) {
                                        case 0: idRelConceptoVendedor = $(this).text();
                                            break;
                                        case 1: strConcepto = $(this).text();
                                            break;
                                        case 2: strCostoVenta = $(this).text();
                                            break;
                                        case 3: dcmComision = $(this).text();
                                            break;
                                    }
                                })
                                $("#simple-table2 tbody").append("<tr><td style='display: none;'>" + id + "</td><td style='display: none;'>" + idRelConceptoVendedor + "</td><td>" + strConcepto + "</td><td>" + strCostoVenta + "</td><td>" + dcmComision + "%</td></tr>");
                            })
                        }
                    }
                    else {
                        e.preventDefault();
                        fnMensajeModalError("Selecciona mínimo una aduana del catálogo");
                    }
                }

                //if ($("#simple-table tbody").children().length != 0 && hdnRolID == "Administrador") {
                    
                //}
                //else {
                //    e.preventDefault();
                //    fnMensajeModalError("No es posible avanzar sin antes tener mínimo un concepto comisionable");
                //}
            }
        })
        .on('finished.fu.wizard', function (e) {
            bootbox.confirm({
                message: "¿Los datos son correctos?",
                buttons: {
                    confirm: {
                        label: "OK",
                        className: "btn-primary btn-sm",
                    },
                    cancel: {
                        label: "Cancelar",
                        className: "btn-sm",
                    }
                },
                callback: function (result) {
                    if (result) {
                        $('#waitModal').modal('toggle');
                        $("#module").text("Modificando cliente...");
                        var intercia = "No";
                        if ($('#strIntercia').is(':checked')) {
                            intercia = "Si";
                        }

                        var conceptosData = {};

                        $("#simple-table tbody tr").each(function (index) {
                            var id = $(this).attr('id')
                            var idRelConceptoVendedor, strConcepto, strCostoVenta, dcmComision;
                            $(this).children("td").each(function (index2) {
                                switch (index2) {
                                    case 0: idRelConceptoVendedor = $(this).text();
                                        break;
                                    case 1: strConcepto = $(this).text();
                                        break;
                                    case 2: strCostoVenta = $(this).text();
                                        break;
                                    case 3: dcmComision = $(this).text();
                                        break;
                                }
                            })

                            var dataNewConceptos = {
                                idRelConceptoVendedor: idRelConceptoVendedor,
                                IdConcepto: id,
                                idClienteConfig: $("#idClienteConfig").val(),
                            //idClienteConfig.value,
                                strConcepto: strConcepto,
                                strCostoVenta: strCostoVenta,
                                dcmComision: dcmComision,
                                boolActivo: true
                            };

                            conceptosList.push(dataNewConceptos)
                        })
                      
                        var dataNewClientes = {
                            idClienteConfig:   $("#idClienteConfig").val(),
                                //idClienteConfig.value,
                            IdEmpresa: $("#IdEmpresa").val(),
                                //IdEmpresa.value,
                            idCliente: $('#idCliente').val(),
                            strNombreCliente: $('#idCliente :selected').text(),


                            idClientePedimento: $('#cboClientePedimento').val(),
                            strNombreClientePedimento: $('#cboClientePedimento :selected').text(),



                            idCodigoVendedor: $('#idCodigoVendedor').val(),
                            idAduana: 0,
                            strNombreAduana: IdsAduanas + "|" + TextoAduana,
                            strTipoOp: $('#strTipoOp').val(),
                            idPedimento: IdsPedimentos + "|" + TextoPedimento,
                            intDiasCredito: $('#intDiasCredito').val(),
                            intDiasRetencion: $('#intDiasRetencion').val(),
                            intDiasGracia: $('#intDiasGracia').val(),
                            strTipoCosto: $("input[name='strTipoCosto']:checked").next('span:first').html(),
                            strIntercia: intercia,
                            strNotificacion: $('#strNotificacion').val(),
                            //dDescuentoFijo: parseFloat($("#dDescuentoFijo").val()),
                            strTipoCambio: $('#strTipoCambio option:selected').text().trim(),
                            com_relConceptoVendedor: conceptosList
                        };

                        debugger;

                        $.ajax({
                            type: 'POST',
                            url: '/comisiones/clientesComConfig/Edit',
                            data: JSON.stringify(dataNewClientes),
                            contentType: "application/json; charset=utf-8",
                            success: function SuccessCallback(dataNewClientes) {
                                $('#waitModal').modal('toggle');
                                if (!dataNewClientes.error) {

                                    swal({
                                        title: "Guardar!",
                                        text: dataNewClientes.msg,
                                        type: "success",
                                        confirmButtonClass: 'btn-success',
                                        confirmButtonText: 'ok!'
                                    },
                                    function (isConfirm) {
                                        if (isConfirm) {
                                            window.location.href = "/comisiones/clientesComConfig/";
                                        }
                                    });


                                } else {
                                    swal({
                                        title: "Error!",
                                        text: dataNewClientes.msg,
                                        type: "error",
                                        confirmButtonClass: 'btn-error',
                                        confirmButtonText: 'ok'
                                    },
                                    function (isConfirm) {
                                        if (isConfirm) {
                                            //window.location.href = "/clientesComConfig/";
                                        }
                                    });
                                }
                            },
                            error: function FailureCallback(dataNewClientes) {
                                $('#waitModal').modal('toggle');
                                swal("Error!", dataNewClientes.msg, "error");

                            }
                        });

                    }
                }
            });

        }).on('stepclick.fu.wizard', function (e) {
            e.preventDefault();
        });

        function html2json(tabla) {
            var json = '{';
            var otArr = [];
            var tbl2 = $('#' + tabla + ' tr').each(function (i) {
                x = $(this).children();
                var itArr = [];
                x.each(function () {
                    itArr.push('"' + $(this).text().trim() + '"');
                });
                otArr.push('"' + i + '": [' + itArr.join(',') + ']');
            })
            json += otArr.join(",") + '}'

            return json;
        }

        $('#clientesComConfig-form').validate({
            errorElement: 'div',
            errorClass: 'help-block',
            focusInvalid: false,
            ignore: "",
            rules: {
                strNotificacion: {
                    email: true
                },
                IdEmpresa: {
                    required: true
                },
                idCliente: {
                    required: true
                },
                cboClientePedimento: {
                    required: true
                },
                idCodigoVendedor: {
                    required: true
                },
                idAduana: {
                    required: true
                },
                idPedimento: {
                    required: true
                },
                intDiasCredito: {
                    required: true
                },
                intDiasGracia: {
                    required: true
                },
                intDiasRetencion: {
                    required: true
                }
            },

            messages: {
                strNotificacion: {
                    email: "El correo no tiene el formato correcto."
                },
                IdEmpresa: {
                    required: "Selecciona una empresa"
                },
                idCliente: {
                    required: "Selecciona un cliente"
                },
                cboClientePedimento: {
                    required: "Selecciona un cliente"
                },
                idCodigoVendedor: {
                    required: "Selecciona un vendedor"
                },
                idAduana: {
                    required: "Selecciona una aduana"
                },
                idPedimento: {
                    required: "Selecciona un pedimento"
                },
                intDiasCredito: {
                    required: "Valor no válido.",
                },
                intDiasGracia: {
                    required: "Valor no válido.",
                },
                intDiasRetencion: {
                    required: "Valor no válido.",
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




        $("#strCtePedimento").on("change", function () {
            if ($(this).is(':checked')) {
                $("#cboClientePedimento").attr("disabled", false);
                $("#cboClientePedimento").select2("val", "")
                //$("#cboClientePedimento option[value='0']").attr("selected", "selected");
                //$("#cboClientePedimento").closest('form').validate().element($("#cboClientePedimento"));
            }
            else {
                $("#cboClientePedimento").attr("disabled", true);

                if ($('#idCliente').val() != "" && $('#idCliente').val() != null) {
                    $("#cboClientePedimento option[value=" + $('#idCliente').val() + "]").prop('selected', 'selected').change();
                }
                //else {
                //    $("#divClientepedimento").filter('.form-group').removeClass('has-error');
                //    $("#divClientepedimento").find('.help-block').remove();
                //}

            }

        })

        $("#idCliente").on("change", function () {
            if (!$("#strCtePedimento").is(':checked')) {
                $("#cboClientePedimento option[value='" + $('#idCliente').val() + "']").prop('selected', 'selected').change();
            }
        })





    };


    return {
        //main function to initiate template pages
        init: function () {
            runDataTable_VendedoresCreate();
        }
    };


}();




