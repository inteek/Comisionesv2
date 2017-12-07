$("input:radio[name=rdBtnComisionable]").click(function () {
    if ($(this).is(':checked')) {

        $("#rdBtnComisionable").prop("disabled", true);
      
        $("#rdBtnNoComisionable").prop("disabled", false);
        $("#rdBtnNoComisionable").prop("checked", false);

        $("#rdBtnRetenciones").prop("disabled", false);
        $("#rdBtnRetenciones").prop("checked", false);
       
    }
});


$("input:radio[name=rdBtnNoComisionable]").click(function () {
    if ($(this).is(':checked')) {

        $("#rdBtnNoComisionable").prop("disabled", true);

        $("#rdBtnComisionable").prop("disabled", false);
        $("#rdBtnComisionable").prop("checked", false);

        $("#rdBtnRetenciones").prop("disabled", false);
        $("#rdBtnRetenciones").prop("checked", false);

    }
});

$("input:radio[name=rdBtnRetenciones]").click(function () {
    if ($(this).is(':checked')) {

        $("#rdBtnRetenciones").prop("disabled", true);

        $("#rdBtnComisionable").prop("disabled", false);
        $("#rdBtnComisionable").prop("checked", false);

        $("#rdBtnNoComisionable").prop("disabled", false);
        $("#rdBtnNoComisionable").prop("checked", false);

    }
});