function SignOut() {
    $.ajax({
        type: 'POST',
        url: URL_SignOut,
        data: '',
        contentType: "application/json; charset=utf-8",
        success: function SuccessCallback(dataNewClientes) {
            if (!dataNewClientes.error) {

                window.location.href = URL_Home;


            } else {
                swal("Error!", dataNewClientes.msg, "error");
            }
        },
        error: function FailureCallback(dataNewClientes) {
            swal("Error!", dataNewClientes.msg, "error");

        }
    });
}
