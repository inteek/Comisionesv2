var ctrlPressed = false;
var teclaCtrl = 17, teclaC = 67;
var teclaEnter = 13, teclaTab = 9;

/// <summary>
/// <Autor>Claudia Razo Montes</Autor>
/// <Create-date>04/07/2017</Create-date>
/// <Description>Método que genera el evento keypress del textbox login y ejecuta validación de login con la tecla enter siempre y cuando el campo de usuario y password tenga información</Description>
/// </summary>
$('#Login').keypress(function (e) {

    if (e.keyCode == teclaEnter || e.keyCode == teclaTab) {
        var login = $('#Login').val();
        var password = $('#Password').val();

        if (login != "") {
            if (password != "") {
                fnValidaLogin();
            }
        }
    }
});

/// <summary>
/// <Autor>Claudia Razo Montes</Autor>
/// <Create-date>04/07/2017</Create-date>
/// <Description>Método que genera el evento keypress del textbox password y ejecuta validación de login con la tecla enter siempre y cuando el campo de usuario y password tenga información</Description>
/// </summary>
$('#Password').keypress(function (e) {

    if (e.keyCode == teclaEnter || e.keyCode == teclaTab) {
        var login = $('#Login').val();
        var password = $('#Password').val();

        if (login != "") {
            if (password != "") {
                fnValidaLogin();
            }
        }
    }
});


function fnValidaLogin() {
   
    var login = $('#Login').val();
    var password = $('#Password').val();
    
    if (login != "") {
        if (password != "") {
            var dataLogin = {
                Login: login,
                Password: password
            };
            $("#module").text("Autenticando...");
            $('#waitModal').modal('toggle')
            //var URL_AUTH = ROOT + 'Home/LoginAuth';
            $.ajax({
                type: 'POST',
                url: URL_LoginAuth,
                data: JSON.stringify(dataLogin),
                contentType: "application/json; charset=utf-8",
                success: function SuccessCallback(dataLogin) {
                    if (!dataLogin.error) {
                        window.location.href = URL_Home;

                    } else {
                        $('#waitModal').modal('toggle')
                        swal("Error!", dataLogin.msg, "error");
                    }
                },
                error: function FailureCallback(dataLogin) {
                    $('#waitModal').modal('toggle')
                    swal("Error!", dataLogin.msg, "error");

                }
            });
        }
        else {
            swal("Error!", "La contraseña no puede estar vacia", "error");
        }
    }
    else {
        swal("Error!", "El usuario no puede estar vacio", "error");
    }
}

function fnCambiaPass() {

    var txtLogin = $('#BagLogin').val();
    var txtNewPass1 = $('#txtNewPass1').val();
    var txtNewPass2 = $('#txtNewPass2').val();


    if (txtNewPass1 != "") {
        if (txtNewPass2 != "") {
            if (txtNewPass1 == txtNewPass2) {
                var dataLogin = {
                    Login: txtLogin,
                    Password: txtNewPass1
                };
                $("#module").text("Solicitando cambio...");
                $('#waitModal').modal('toggle')

                $.ajax({
                    type: 'POST',
                    url: URL_CambiaPassword,
                    data: JSON.stringify(dataLogin),
                    contentType: "application/json; charset=utf-8",
                    success: function SuccessCallback(dataLogin) {
                        if (!dataLogin.error) {
                            swal({
                                title: "Cambio correcto!",
                                text: dataLogin.msg,
                                type: "success",
                                confirmButtonClass: 'btn-success',
                                confirmButtonText: 'ok!'
                            },
                             function (isConfirm) {
                                 if (isConfirm) {
                                     window.location.href = URL_Home;
                                 }
                             });

                        } else {
                            $('#waitModal').modal('toggle')
                            swal("Error!", dataLogin.msg, "error");
                        }
                    },
                    error: function FailureCallback(dataLogin) {
                        $('#waitModal').modal('toggle')
                        swal("Error!", dataLogin.msg, "error");

                    }
                });
            }
            else {
                swal("Error!", "Las contraseñas no coinciden", "error");
            }
           
        }
        else {
            swal("Error!", "La contraseña no puede estar vacia", "error");
        }
    }
    else {
        swal("Error!", "La contraseña no puede ser vacia", "error");
    }
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function fnResetPassword() {

    var correo = $("#Correo").val();
    var cuenta = $("#LoginPass").val()

    if (cuenta != "") {
        if (correo != "") {
            if (validateEmail(correo)) {
                var dataCorreo = {
                    Correo: correo,
                    Login: cuenta
                };

                $("#module").text("Consultando datos...");
                $('#waitModal').modal('toggle')

                $.ajax({
                    type: 'POST',
                    url: URL_RecoverPass,
                    data: JSON.stringify(dataCorreo),
                    contentType: "application/json; charset=utf-8",
                    success: function SuccessCallback(dataNewClientes) {
                        if (!dataNewClientes.error) {
                            $('#waitModal').modal('toggle')
                            swal({
                                title: "Enviado!",
                                text: dataNewClientes.msg,
                                type: "success",
                                confirmButtonClass: 'btn-success',
                                confirmButtonText: 'ok!'
                            })
                        } else {
                            $('#waitModal').modal('toggle')
                            swal("Error!", dataNewClientes.msg, "error");
                        }
                    },
                    error: function FailureCallback(dataNewClientes) {
                        $('#waitModal').modal('toggle')
                        swal("Error!", dataNewClientes.msg, "error");

                    }
                });
            }
            else {
                swal("Error!", "El correo no tiene un formato correcto", "error");
            }
        }
        else {
            swal("Error!", "Favor de introducir el correo asociado a la cuenta", "error");
        }
    }
    else{
        swal("Error!", "Favor de introducir la cuenta de usuario", "error");
    }

}
