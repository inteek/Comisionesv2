using OneCoreData;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Validation;
using System.Linq;
using System.Net;
using System.Web.Mvc;
using WebApplication1.Models;



namespace WebApplication1.Controllers
{
    public class PatentesController : Controller
    {
        private COMISIONESEntities db = new COMISIONESEntities();

        // GET: patentes
        public ActionResult Index()
        {
            if (Session["RolID"] == null)
            {
                return View("~/Views/Home/Login.cshtml");
            }
            else
            {
                if (Session["RolID"].Equals("Administrador") || Session["RolID"].Equals("Operador"))
                {
                    ViewBag.hdnRolID = Session["RolID"].ToString();

                    List<Patentes> patentes = new List<Patentes>();
                    using (var context = new ELIEntities())
                    {
                        patentes.AddRange((from p in context.COMISIONES_PATENTE
                                           select new Patentes()
                                           {
                                               IdEmpresa = 1,
                                               Empresa = "ELI",
                                               IdPatente = p.ID_PATENTE,
                                               Descripcion = p.DESCRIPCION,
                                               Activo = p.ACTIVO,
                                               UsuarioAlta = p.USUARIO_ALTA,
                                               FechaAlta = p.FECHA_ALTA,
                                               UsuarioModifica = p.USUARIO_MODIFICO,
                                               FechaModifica = p.FECHA_MODIFICO,
                                               
                                           }).ToList());
                    }
                    using (var context = new RPFEntities())
                    {
                        patentes.AddRange((from p in context.COMISIONES_PATENTE
                                           select new Patentes()
                                           {
                                               IdEmpresa = 2,
                                               Empresa = "RPF",
                                               IdPatente = p.ID_PATENTE,
                                               Descripcion = p.DESCRIPCION,
                                               Activo = p.ACTIVO,
                                               UsuarioAlta = p.USUARIO_ALTA,
                                               FechaAlta = p.FECHA_ALTA,
                                               UsuarioModifica = p.USUARIO_MODIFICO,
                                               FechaModifica = p.FECHA_MODIFICO,

                                           }).ToList());
                    }
                    using (var context = new EILOEntities())
                    {
                        patentes.AddRange((from p in context.COMISIONES_PATENTE
                                           select new Patentes()
                                           {
                                               IdEmpresa = 3,
                                               Empresa = "EILO",
                                               IdPatente = p.ID_PATENTE,
                                               Descripcion = p.DESCRIPCION,
                                               Activo = p.ACTIVO,
                                               UsuarioAlta = p.USUARIO_ALTA,
                                               FechaAlta = p.FECHA_ALTA,
                                               UsuarioModifica = p.USUARIO_MODIFICO,
                                               FechaModifica = p.FECHA_MODIFICO,

                                           }).ToList());
                    }


                    return View(patentes);

                }
                else
                {
                    return View("~/Views/Home/Login.cshtml");
                }

            }

        }
        

        // GET: patentes/Create
        public ActionResult Create()
        {
            if (Session["RolID"] == null)
            {
                return View("~/Views/Home/Login.cshtml");
            }
            else
            {
                if (Session["RolID"].Equals("Administrador") || Session["RolID"].Equals("Operador"))
                {
                    ViewBag.BagEmpresas = new SelectList(db.com_empresas, "IdEmpresa", "strNombreEmpresa");
                    ViewBag.hdnRolID = Session["RolID"].ToString();
                    return View();
                }
                else
                {
                    return View("~/Views/Home/Login.cshtml");
                }
            }
        }
        
        
        
        




        // POST: patentes/Create
        [HttpPost]
        public ActionResult Create([Bind(Include = "IdEmpresa,Descripcion,IdPatente")] Patentes patente)
        {
            try
            {
                if (ModelState.IsValid)
                {

                    switch (patente.IdEmpresa) {
                        case 1: //ELI
                            return addPatenteELI(patente);
                        case 2: //RPF
                            return addPatenteRPF(patente);
                        case 3: //EILO
                            return addPatenteEILO(patente);
                    }
                }

                var msgs = string.Join(" | ", ModelState.Values
                       .SelectMany(v => v.Errors)
                       .Select(e => e.ErrorMessage));

                return Json(new { error = true, msg = msgs });
            }
            catch (Exception e)
            {
                Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Error", "Patentes", "Error al dar de alta patente: " + e.Message);
                return Json(new { error = true, msg = e.InnerException.InnerException.ToString() });

            }
        }
        

        private JsonResult addPatenteELI(Patentes patente)
        {
            using (var context = new ELIEntities())
            {
                var patente_val = context.COMISIONES_PATENTE.Where(p => p.ID_PATENTE == patente.IdPatente).FirstOrDefault();

                if (patente_val == null)
                {
                    context.COMISIONES_PATENTE.Add(new COMISIONES_PATENTE() {
                        ID_PATENTE = patente.IdPatente,
                        DESCRIPCION = patente.Descripcion,
                        ACTIVO = true,
                        USUARIO_ALTA = Session["UserName"] != null ? Session["UserName"].ToString() : null,
                        USUARIO_MODIFICO = null,
                        FECHA_ALTA = DateTime.Now,
                        FECHA_MODIFICO = null
                    });

                    context.SaveChanges();

                    //Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Proceso", "Vendedores", "Alta de vendedor: " + com_vendedores.strNombre + " " + com_vendedores.strApellidoP + " " + com_vendedores.strApellidoM);
                    return Json(new { error = false, msg = "Se guardo la patente de forma correcta." });
                }
                else
                {
                    return Json(new { error = true, msg = "Ya existe la patente con el mismo numero de patente" });
                }
            }
        }
        private JsonResult addPatenteRPF(Patentes patente)
        {
            using (var context = new RPFEntities())
            {
                var patente_val = context.COMISIONES_PATENTE.Where(p => p.ID_PATENTE == patente.IdPatente).FirstOrDefault();


                if (patente_val == null)
                {

                    context.COMISIONES_PATENTE.Add(new COMISIONES_PATENTE()
                    {
                        ID_PATENTE = patente.IdPatente,
                        DESCRIPCION = patente.Descripcion,
                        ACTIVO = true,
                        USUARIO_ALTA = Session["UserName"] != null ? Session["UserName"].ToString() : null,
                        USUARIO_MODIFICO = null,
                        FECHA_ALTA = DateTime.Now,
                        FECHA_MODIFICO = null
                    });
                    context.SaveChanges();

                    //Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Proceso", "Vendedores", "Alta de vendedor: " + com_vendedores.strNombre + " " + com_vendedores.strApellidoP + " " + com_vendedores.strApellidoM);
                    return Json(new { error = false, msg = "Se guardo la patente de forma correcta." });
                }
                else
                {
                    return Json(new { error = true, msg = "Ya existe la patente con el mismo numero de patente" });
                }
            }
        }
        private JsonResult addPatenteEILO(Patentes patente)
        {
            using (var context = new EILOEntities())
            {
                var patente_val = context.COMISIONES_PATENTE.Where(p => p.ID_PATENTE == patente.IdPatente).FirstOrDefault();


                if (patente_val == null)
                {
                    var patenteItem = new OneCoreData.COMISIONES_PATENTE();


                    context.COMISIONES_PATENTE.Add(new COMISIONES_PATENTE()
                    {
                        ID_PATENTE = patente.IdPatente,
                        DESCRIPCION = patente.Descripcion,
                        ACTIVO = true,
                        USUARIO_ALTA = Session["UserName"] != null ? Session["UserName"].ToString() : null,
                        USUARIO_MODIFICO = null,
                        FECHA_ALTA = DateTime.Now,
                        FECHA_MODIFICO = null
                    });
                    context.SaveChanges();

                    //Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Proceso", "Vendedores", "Alta de vendedor: " + com_vendedores.strNombre + " " + com_vendedores.strApellidoP + " " + com_vendedores.strApellidoM);
                    return Json(new { error = false, msg = "Se guardo la patente de forma correcta." });
                }
                else
                {
                    return Json(new { error = true, msg = "Ya existe la patente con el mismo numero de patente" });
                }
            }
        }

        






        // GET: patentes/Edit/5/4
        public ActionResult Edit(int? idPatente, int idEmpresa)
        {
            ViewBag.BagEmpresas = new SelectList(db.com_empresas, "IdEmpresa", "strNombreEmpresa");

            if (idPatente == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }


            Patentes patente = new Patentes();
            switch (idEmpresa)
            {
                case 1: //ELI
                    patente = selectPatenteELI((int)idPatente);
                    break;
                case 2: //RPF
                    patente = selectPatenteRPF((int)idPatente);
                    break;
                case 3: //EILO
                    patente = selectPatenteEILO((int)idPatente);
                    break;
            }


            if (patente == null)
            {
                return HttpNotFound();
            }


            return View(patente);
        }


        private Patentes selectPatenteELI(int idPatente)
        {
            Patentes patente = new Patentes();
            using (var context = new ELIEntities())
            {
                patente = (from p in context.COMISIONES_PATENTE
                           where p.ID_PATENTE == idPatente.ToString()
                           select new Patentes()
                            {
                                IdEmpresa = 1,
                                Empresa = "ELI",
                                IdPatente = p.ID_PATENTE,
                                Descripcion = p.DESCRIPCION,
                                Activo = p.ACTIVO,
                                UsuarioAlta = p.USUARIO_ALTA,
                                FechaAlta = p.FECHA_ALTA,
                                UsuarioModifica = p.USUARIO_MODIFICO,
                                FechaModifica = p.FECHA_MODIFICO

                            }).FirstOrDefault();

            }

            return patente;
        }
        private Patentes selectPatenteRPF(int idPatente)
        {
            Patentes patente = new Patentes();
            using (var context = new RPFEntities())
            {
                patente = (from p in context.COMISIONES_PATENTE
                           where p.ID_PATENTE == idPatente.ToString()
                           select new Patentes()
                           {
                               IdEmpresa = 2,
                               Empresa = "RPF",
                               IdPatente = p.ID_PATENTE,
                               Descripcion = p.DESCRIPCION,
                               Activo = p.ACTIVO,
                               UsuarioAlta = p.USUARIO_ALTA,
                               FechaAlta = p.FECHA_ALTA,
                               UsuarioModifica = p.USUARIO_MODIFICO,
                               FechaModifica = p.FECHA_MODIFICO

                           }).FirstOrDefault();

            }

            return patente;
        }
        private Patentes selectPatenteEILO(int idPatente)
        {
            Patentes patente = new Patentes();
            using (var context = new EILOEntities())
            {
                patente = (from p in context.COMISIONES_PATENTE
                           where p.ID_PATENTE == idPatente.ToString()
                           select new Patentes()
                           {
                               IdEmpresa = 3,
                               Empresa = "EILO",
                               IdPatente = p.ID_PATENTE,
                               Descripcion = p.DESCRIPCION,
                               Activo = p.ACTIVO,
                               UsuarioAlta = p.USUARIO_ALTA,
                               FechaAlta = p.FECHA_ALTA,
                               UsuarioModifica = p.USUARIO_MODIFICO,
                               FechaModifica = p.FECHA_MODIFICO

                           }).FirstOrDefault();

            }

            return patente;
        }

        





        // POST: patentes/Edit
        [HttpPost]
        public JsonResult Edit([Bind(Include = "IdEmpresa,Descripcion,IdPatente,Activo,IdPatenteOld")] Patentes patente)
        {

            try
            {
                if (ModelState.IsValid)
                {
                    switch (patente.IdEmpresa)
                    {
                        case 1: //ELI
                            return editPatenteELI(patente);
                        case 2: //RPF
                            return editPatenteRPF(patente);
                        case 3: //EILO
                            return editPatenteEILO(patente);
                    }
                }


                var msgs = string.Join(" | ", ModelState.Values
                          .SelectMany(v => v.Errors)
                          .Select(e => e.ErrorMessage));

                return Json(new { error = true, msg = msgs });
            }
            catch (Exception e)
            {
                Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Error", "Patentes", "Error al actualizar una patente: " + e.Message);
                return Json(new { error = true, msg = e.InnerException.ToString() });

            }

        }



        private JsonResult editPatenteELI(Patentes patente)
        {

            using (var context = new ELIEntities())
            {
                var patente_verifica = context.COMISIONES_PATENTE.Where(p => p.ID_PATENTE != patente.IdPatenteOld && p.ID_PATENTE == patente.IdPatente).FirstOrDefault();
                var patente_val = context.COMISIONES_PATENTE.Where(p => p.ID_PATENTE == patente.IdPatenteOld).FirstOrDefault();



                if (patente_verifica == null)
                {
                    patente_val.ID_PATENTE = patente.IdPatente;
                    patente_val.DESCRIPCION = patente.Descripcion;
                    patente_val.ACTIVO = patente.Activo;
                    patente_val.USUARIO_MODIFICO = Session["UserName"] != null ? Session["UserName"].ToString() : null;
                    patente_val.FECHA_MODIFICO = DateTime.Now;


                    context.SaveChanges();

                    //Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Proceso", "Vendedores", "Alta de vendedor: " + com_vendedores.strNombre + " " + com_vendedores.strApellidoP + " " + com_vendedores.strApellidoM);
                    return Json(new { error = false, msg = "Se guardo la patente de forma correcta." });
                }
                else
                {
                    return Json(new { error = true, msg = "Ya existe la patente con el mismo numero de patente" });
                }
            }
        }
        private JsonResult editPatenteRPF(Patentes patente)
        {
            using (var context = new RPFEntities())
            {
                var patente_verifica = context.COMISIONES_PATENTE.Where(p => p.ID_PATENTE != patente.IdPatenteOld && p.ID_PATENTE == patente.IdPatente).FirstOrDefault();
                var patente_val = context.COMISIONES_PATENTE.Where(p => p.ID_PATENTE == patente.IdPatenteOld).FirstOrDefault();
                

                if (patente_verifica == null)
                {
                    patente_val.ID_PATENTE = patente.IdPatente;
                    patente_val.DESCRIPCION = patente.Descripcion;
                    patente_val.ACTIVO = patente.Activo;
                    patente_val.USUARIO_MODIFICO = Session["UserName"] != null ? Session["UserName"].ToString() : null;
                    patente_val.FECHA_MODIFICO = DateTime.Now;


                    context.SaveChanges();

                    //Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Proceso", "Vendedores", "Alta de vendedor: " + com_vendedores.strNombre + " " + com_vendedores.strApellidoP + " " + com_vendedores.strApellidoM);
                    return Json(new { error = false, msg = "Se guardo la patente de forma correcta." });
                }
                else
                {
                    return Json(new { error = true, msg = "Ya existe la patente con el mismo numero de patente" });
                }
            }
        }
        private JsonResult editPatenteEILO(Patentes patente)
        {
            using (var context = new EILOEntities())
            {
                var patente_verifica = context.COMISIONES_PATENTE.Where(p => p.ID_PATENTE != patente.IdPatenteOld && p.ID_PATENTE == patente.IdPatente).FirstOrDefault();
                var patente_val = context.COMISIONES_PATENTE.Where(p => p.ID_PATENTE == patente.IdPatenteOld).FirstOrDefault();


                if (patente_verifica == null)
                {
                    patente_val.ID_PATENTE = patente.IdPatente;
                    patente_val.DESCRIPCION = patente.Descripcion;
                    patente_val.ACTIVO = patente.Activo;
                    patente_val.USUARIO_MODIFICO = Session["UserName"] != null ? Session["UserName"].ToString() : null;
                    patente_val.FECHA_MODIFICO = DateTime.Now;


                    context.SaveChanges();
                    //Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Proceso", "Vendedores", "Alta de vendedor: " + com_vendedores.strNombre + " " + com_vendedores.strApellidoP + " " + com_vendedores.strApellidoM);
                    return Json(new { error = false, msg = "Se guardo la patente de forma correcta." });
                }
                else
                {
                    return Json(new { error = true, msg = "Ya existe la patente con el mismo numero de patente" });
                }
            }
        }









        // POST: patentes/Delete/5
        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(int? idPatente, int idEmpresa)
        {
            try
            {
                JsonResult result = new JsonResult();

                if (Session["RolID"].Equals("Administrador"))
                {
                    Patentes patente = new Patentes();
                    switch (idEmpresa)
                    {
                        case 1: //ELI
                            result = deletePatenteELI((int)idPatente);
                            break;
                        case 2: //RPF
                            result = deletePatenteRPF((int)idPatente);
                            break;
                        case 3: //EILO
                            result = deletePatenteELIO((int)idPatente);
                            break;
                    }


                    return result;

                }
                else
                {
                    return Json(new { error = true, msg = "No se tienen los suficientes permisos para realizar esta acción" });
                }

            }
            catch (Exception e)
            {
                Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Error", "Vendedores", "Error al modificar vendedor: " + e.Message);
                return Json(new { error = true, msg = e.Message.ToString() });
            }
            //return RedirectToAction("Index");
        }




        private JsonResult deletePatenteELI(int idPatente)
        {

            using (var context = new ELIEntities())
            {
                var patente_val = context.COMISIONES_PATENTE.Where(p => p.ID_PATENTE == idPatente.ToString()).FirstOrDefault();
                
                if (patente_val != null)
                {

                    context.COMISIONES_PATENTE.Remove(patente_val);
                    context.SaveChanges();


                    //Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Proceso", "Vendedores", "Alta de vendedor: " + com_vendedores.strNombre + " " + com_vendedores.strApellidoP + " " + com_vendedores.strApellidoM);
                    return Json(new { error = false, msg = "Se elimino la patente de forma correcta." });
                }
                else
                {
                    return Json(new { error = true, msg = "No existe la patente que desea eliminar" });
                }
            }
        }
        private JsonResult deletePatenteRPF(int idPatente)
        {

            using (var context = new RPFEntities())
            {
                var patente_val = context.COMISIONES_PATENTE.Where(p => p.ID_PATENTE == idPatente.ToString()).FirstOrDefault();

                if (patente_val != null)
                {

                    context.COMISIONES_PATENTE.Remove(patente_val);
                    context.SaveChanges();


                    //Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Proceso", "Vendedores", "Alta de vendedor: " + com_vendedores.strNombre + " " + com_vendedores.strApellidoP + " " + com_vendedores.strApellidoM);
                    return Json(new { error = false, msg = "Se elimino la patente de forma correcta." });
                }
                else
                {
                    return Json(new { error = true, msg = "No existe la patente que desea eliminar" });
                }
            }
        }
        private JsonResult deletePatenteELIO(int idPatente)
        {

            using (var context = new RPFEntities())
            {
                var patente_val = context.COMISIONES_PATENTE.Where(p => p.ID_PATENTE == idPatente.ToString()).FirstOrDefault();

                if (patente_val != null)
                {

                    context.COMISIONES_PATENTE.Remove(patente_val);
                    context.SaveChanges();


                    //Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Proceso", "Vendedores", "Alta de vendedor: " + com_vendedores.strNombre + " " + com_vendedores.strApellidoP + " " + com_vendedores.strApellidoM);
                    return Json(new { error = false, msg = "Se elimino la patente de forma correcta." });
                }
                else
                {
                    return Json(new { error = true, msg = "No existe la patente que desea eliminar" });
                }
            }
        }



        


        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

     



    }
}