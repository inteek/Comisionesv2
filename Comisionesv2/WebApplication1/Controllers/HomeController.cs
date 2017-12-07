using OneCoreData;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication1.Utilidades;

namespace WebApplication1.Controllers
{
    public class HomeController : Controller
    {
        private VERTICAL_V2Entities db = new VERTICAL_V2Entities();

        public ActionResult Index()
        {
            if (Session["UserID"] == null) {
                return View("~/Views/Home/Login.cshtml");
            }
            else
            {
                return View(db.CatUsuarios.ToList());
            }
            
        }
        
        public ActionResult Login()
        {
            if (Session["UserID"] != null)
            {
                return View("~/Views/Home/Index.cshtml");
            }
            else
            {
                ViewBag.Message = "Login";

                return View(db.CatUsuarios.ToList());
            }
           
        }

        public ActionResult RecuperarPassword(string token)
        {
            ViewBag.BagLogin = token;
            return View();
        }

        [HttpPost]
        public ActionResult LoginAuth([Bind(Include = "Login,Password")] CatUsuarios cat_usuarios)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    //Validación de login
                    if(cat_usuarios.Login != "")
                    {
                        if(cat_usuarios.Password != "")
                        {
                            string UsuarioReal = cat_usuarios.Login.ToString().ToLower();

                            //string desencriptar = Seguridad.DesEncriptarPwd(cat_usuarios.Password, UsuarioReal);
                            //cat_usuarios.Password = desencriptar;


                            string PasswordReal = Seguridad.EncriptarPwd(cat_usuarios.Password, UsuarioReal);
                               
                            var LogOkUsuario = db.CatUsuarios //.Include(p=> p.RelUsuarioRol)
                            .Where(p => p.Login.Equals(cat_usuarios.Login))
                            .SingleOrDefault();

                            var LogOk= db.CatUsuarios //.Include(p=> p.RelUsuarioRol)
                            .Where(p => p.Login.Equals(cat_usuarios.Login) && p.Password.Equals(PasswordReal))
                            .SingleOrDefault();

                            if (LogOkUsuario != null)
                            {
                                if(LogOk != null)
                                {
                                    var RolOk = LogOk.RelUsuarioRol.FirstOrDefault();
                                    //.Where(p => p.Id_Usuario == LogOk.Id_Usuario)
                                    //.FirstOrDefault();

                                    Session["UserID"] = LogOk.Id_Usuario.ToString();
                                    Session["UserName"] = LogOk.Login.ToString();
                                    Session["RolID"] = RolOk.CatRoles.Rol;
                                    return Json(new { error = false, msg = "" });
                                }
                                else
                                {
                                    return Json(new { error = true, msg = "Contraseña incorrecta" });
                                }
                                
                            }
                            else
                            {
                                return Json(new { error = true, msg = "El usuario no existe" });
                            }
                        }
                        else
                        {
                            return Json(new { error = true, msg = "No se ha colocado la contraseña" });
                        }
                    }
                    else
                    {
                        return Json(new { error = true, msg = "No se ha colocado el usuario" });
                    }
                    
                }

                var msgs = string.Join(" | ", ModelState.Values
                       .SelectMany(v => v.Errors)
                       .Select(e => e.ErrorMessage));

                return Json(new { error = true, msg = msgs });
            }
            catch (Exception e)
            {
                return Json(new { error = true, msg = e.Message.ToString() });

            }
        }

        [HttpPost]
        public ActionResult CambiaPassword([Bind(Include = "Login,Password")] CatUsuarios cat_usuarios)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    string LoginReal = Seguridad.DesEncriptarPwd(cat_usuarios.Login, "ComisionesApp");
                    var existeLogin = db.CatUsuarios
                           .Where(p => p.Login.Equals(LoginReal))
                           .FirstOrDefault();

                    //Validación de login
                    if (existeLogin != null)
                    {
                        existeLogin.Id_Usuario = existeLogin.Id_Usuario;
                        existeLogin.Login = existeLogin.Login;
                        existeLogin.Password = Seguridad.EncriptarPwd(cat_usuarios.Password, existeLogin.Login);
                        db.Entry(existeLogin).State = EntityState.Modified;
                        db.SaveChanges();

                        return Json(new { error = false, msg = "La contraseña fue cambiada exitosamente" });
                    }
                    else
                    {
                        return Json(new { error = true, msg = "El usuario es inexistente, intentelo de nuevo" });
                    }

                }

                var msgs = string.Join(" | ", ModelState.Values
                       .SelectMany(v => v.Errors)
                       .Select(e => e.ErrorMessage));

                return Json(new { error = true, msg = msgs });
            }
            catch (Exception e)
            {
                return Json(new { error = true, msg = e.Message.ToString() });

            }
        }

        [HttpPost]
        public ActionResult RecoverPass([Bind(Include = "correo,Login")] CatUsuarios cat_usuarios)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var correoExiste = db.CatUsuarios
                            .Where(p => p.Correo.Equals(cat_usuarios.Correo) && p.Login.Equals(cat_usuarios.Login))
                            .SingleOrDefault();

                    if (correoExiste != null)
                    {
                        string [] strCuerpo = new string[4];
                        strCuerpo[0] = "Se ha solicitado la recuperación de contraseña para el usuario enlanzado a este correo";
                        strCuerpo[1] = "Sigue el siguiente enlace para renovar tu contraseña, una vez cambiada, intenta acceder al sistema nuevamente";

                        //string strTexto = DateTime.Now.Date.ToShortDateString() + "||" + cat_usuarios.Login;
                        //string strGetTokenPassword = Seguridad.EncriptarPwd(strTexto, "appComisiones");
                        //string strGetTokenPassword = Seguridad.DesEncriptarPwd(correoExiste.Password, correoExiste.Login);
                        //strCuerpo[2] = "<b>Usuario:</b>" + correoExiste.Login + "<br> <b>Password:</b>" +  strGetTokenPassword;
                        Uri myuri = new Uri(System.Web.HttpContext.Current.Request.Url.AbsoluteUri);
                        string pathQuery = myuri.PathAndQuery;
                        string hostName = myuri.ToString().Replace(pathQuery, "");
                        strCuerpo[2] = hostName + "/Home/RecuperarPassword?token=" + Seguridad.EncriptarPwd(correoExiste.Login, "ComisionesApp");
                        strCuerpo[3] = "";
                        string respuestaCDO = CorreoCDO.mtdEnvioCorreo(correoExiste.Correo.Trim(), "Se ha solicitado la recuperación de contraseña para sistema de comisiones", strCuerpo);

                        return Json(new { error = false, msg = "Se han enviado instrucciones a la cuenta de correo " + correoExiste.Correo + " , revisa tu bandeja de entrada" });
                    }
                    else
                    {
                        return Json(new { error = true, msg = "No se han encontrado coincidencias de los datos enviados, revisa nuevamente" });
                    }
                }

                var msgs = string.Join(" | ", ModelState.Values
                       .SelectMany(v => v.Errors)
                       .Select(e => e.ErrorMessage));

                return Json(new { error = true, msg = msgs });
            }
            catch (Exception e)
            {
                return Json(new { error = true, msg = e.Message.ToString() });

            }
        }

        [HttpPost]
        public ActionResult SignOut()
        {
            try
            {
                if (ModelState.IsValid)
                {
                    Session.Clear();
                    return Json(new { error = false, msg = "" });
                }

                var msgs = string.Join(" | ", ModelState.Values
                       .SelectMany(v => v.Errors)
                       .Select(e => e.ErrorMessage));

                return Json(new { error = true, msg = msgs });
            }
            catch (Exception e)
            {
                return Json(new { error = true, msg = e.Message.ToString() });

            }
        }
    }
}