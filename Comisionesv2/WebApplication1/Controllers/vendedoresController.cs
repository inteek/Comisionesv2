using OneCoreData;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Validation;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    public class vendedoresController : Controller
    {

        private COMISIONESEntities db = new COMISIONESEntities();

        // GET: vendedores
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
                    return View(db.com_vendedores.Where(p => p.boolActivo == true).ToList());
                }
                else
                {
                    return View("~/Views/Home/Login.cshtml");
                }
               
            }
           
        }

        // GET: vendedores/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            com_vendedores com_vendedores = db.com_vendedores.Find(id);
            if (com_vendedores == null)
            {
                return HttpNotFound();
            }
            return View(com_vendedores);
        }

        // GET: vendedores/Create
        public ActionResult Create()
        {
            return View();
        }

        // GET: vendedores/DescuentosV
        public ActionResult DescuentosV(string idVendedor)
        {
            if (Session["RolID"] == null)
            {
                return View("~/Views/Home/Login.cshtml");
            }
            else
            {
                if (Session["RolID"].Equals("Administrador") || Session["RolID"].Equals("Operador"))
                {
                    ViewBag.IdEmpresa = new SelectList(db.com_empresas, "IdEmpresa", "strNombreEmpresa");
                    ViewBag.idCodigoVendedor = new SelectList(ListaPersonalizadaVendedores(), "Value", "Text");// new SelectList(db.com_vendedores.Where(p => p.boolActivo == true), "idCodigoVendedor", "strNombre");
                    ViewBag.idVendedor = new SelectList(ListaPersonalizadaVendedores(), "Value", "Text");// new SelectList(db.com_vendedores.Where(p => p.boolActivo == true), "idCodigoVendedor", "strNombre");
                    ViewBag.hdnRolID = Session["RolID"].ToString();
                    //var com_DescuentoConceptoVenededor = (from a in db.com_DescuentoConceptoVendedor where (a.idCodigoVendedor.ToString() == id_vendedor) select new { a.idDescConcepto, a.idEmpresa, a.idCodigoVendedor, a.idConcepto, a.strConcepto, a.cantidadDescontar, a.vigenciaInicio, a.vigenciaFin, a.status });

                    return View(db.com_DescuentoConceptoVendedor.Where(p => p.idCodigoVendedor.ToString() == idVendedor).ToList());
                    //return View(db.com_DescuentoConceptoVendedor.Where(p => p.status == true).ToList());
                }
                else
                {
                    return View("~/Views/Home/Login.cshtml");
                }
            }
        }

        public SelectList ListaPersonalizadaVendedores()
        {
            var vendedores = db.com_vendedores.Where(p => p.boolActivo == true).Select(x => new SelectListItem
            {
                Value = x.idCodigoVendedor.ToString(),
                Text = x.strNombre.Trim() + " " + x.strApellidoP.Trim() + " " + x.strApellidoM.Trim()
            });
            return new SelectList(vendedores, "Value", "Text");
        }

        //public ActionResult getConceptos(string id_empresa)
        //{
        //    string strCadenaEmpresa = "";

        //    List<AA710410> mtdListarPorEmpresa;

        //    strCadenaEmpresa = Utilidades.Utilidades.mtdRecuperaCadenaConexion(Convert.ToInt32(id_empresa));

        //    try
        //    {
        //        using (var ctx = new ELIEntities(strCadenaEmpresa))
        //        {
        //            mtdListarPorEmpresa = ctx.AA710410.ToList();
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.Write(ex.ToString());
        //        throw new Exception("Error al obtener la lista", ex);
        //    }

        //    var Conceptos = new SelectList(ListaPersonalizadaConceptos(strCadenaEmpresa), "Value", "Text");
        //    return Json(new { error = false, Conceptos = Conceptos }, JsonRequestBehavior.AllowGet);
        //}

        public ActionResult getConceptos(string id_empresa)
        {
            string strCadenaEmpresa = "";

            //List<AA710410> mtdListarPorEmpresa;

            strCadenaEmpresa = Utilidades.Utilidades.mtdRecuperaCadenaConexion(Convert.ToInt32(id_empresa));
            try
            {
                using (var ctx = new ELIEntities(strCadenaEmpresa))
                {
                    //mtdListarPorEmpresa = ctx.AA710410.ToList();

                }
                var mtdListarPorEmpresa = (from a in db.com_Conceptos
                                           join b in db.com_EmpresaConceptos on a.GRPID equals b.GRPID
                                           where b.IdEmpresa.ToString() == id_empresa
                                           select new { a.GRPID, a.GRPDESCE }).ToList();
                var conceptos = mtdListarPorEmpresa.Select(x => new SelectListItem
                {
                    Value = x.GRPID.Trim(),
                    Text = "[" + x.GRPID.Trim() + "] " + x.GRPDESCE.Trim()
                });

                return Json(new { error = false, Conceptos = new SelectList(conceptos, "Value", "Text") }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Console.Write(ex.ToString());
                throw new Exception("Error al obtener la lista", ex);
            }

            //var Conceptos = new SelectList(ListaPersonalizadaConceptos(mtdListarPorEmpresa), "Value", "Text");
            //return Json(new { error = false, Conceptos = Conceptos }, JsonRequestBehavior.AllowGet);
        }

        public SelectList ListaPersonalizadaConceptos(string strCadenaEmpresa)
        {
            ELIEntities dbContext = new ELIEntities(strCadenaEmpresa);
            var conceptos = dbContext.AA710410.Select(x => new SelectListItem
            {
                Value = x.GRPID.Trim(),
                Text = "[" + x.GRPID.Trim() + "] " + x.GRPDESCI.Trim()
            });
            return new SelectList(conceptos, "Value", "Text");
        }
        // POST: vendedores/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        //[ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "idCodigoVendedor,strNombre,strApellidoP,strApellidoM,strDireccion,strTipoVendedor,strTelefono,strEmail,boolActivo,dtFechaAlta,dtFechaModifica,idUsuarioAlta,idUsuarioModifica")] com_vendedores com_vendedores)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var vendedorExistente_val1 = db.com_vendedores.Where(p => p.strNombre == com_vendedores.strNombre && p.strEmail == com_vendedores.strEmail).FirstOrDefault();

                    var vendedorExistente_val2 = db.com_vendedores.Where(p => p.strNombre == com_vendedores.strNombre && p.strTelefono == com_vendedores.strTelefono).FirstOrDefault();


                    if ((vendedorExistente_val1 == null) && (vendedorExistente_val2 == null))
                    {
                        Utils.Pie_tabla pieTabla = new Utils.Pie_tabla();

                        com_vendedores.idUsuarioAlta = pieTabla.IDusuario;
                        com_vendedores.idUsuarioModifica = null;
                        com_vendedores.dtFechaAlta = pieTabla.f_actual;
                        com_vendedores.dtFechaModifica = null;
                        com_vendedores.boolActivo = true;

                        db.com_vendedores.Add(com_vendedores);
                        db.SaveChanges();
                        Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Proceso", "Vendedores", "Alta de vendedor: " + com_vendedores.strNombre + " " + com_vendedores.strApellidoP + " " + com_vendedores.strApellidoM);
                        return Json(new { error = false, msg = "Se guardo el Vendedor de forma correcta." });
                    }
                    else
                    {
                        return Json(new { error = true, msg = "Ya existe un vendedor con estos datos en el sistema" });
                    }

                   
                }

                var msgs = string.Join(" | ", ModelState.Values
                       .SelectMany(v => v.Errors)
                       .Select(e => e.ErrorMessage));

                return Json(new { error = true, msg = msgs });
            }
            catch (Exception e)
            {
                Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Error", "Vendedores", "Error al dar de alta vendedor: " + e.Message);
                return Json(new { error = true, msg = e.InnerException.InnerException.ToString() });

            }
        }

        // GET: vendedores/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            com_vendedores com_vendedores = db.com_vendedores.Find(id);
            if (com_vendedores == null)
            {
                return HttpNotFound();
            }
            return View(com_vendedores);
        }

        // POST: vendedores/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        //[ValidateAntiForgeryToken]
        public JsonResult Edit([Bind(Include = "idCodigoVendedor,strNombre,strApellidoP,strApellidoM,strDireccion,strTipoVendedor,strTelefono,strEmail,dtFechaModifica,idUsuarioModifica")] com_vendedores com_vendedores)
        {
           
            try
            {
                if (ModelState.IsValid)
                {
                    
                    Utils.Pie_tabla utils = new Utils.Pie_tabla();

                    var VendedorOriginal = db.com_vendedores.Find(com_vendedores.idCodigoVendedor);
                    
                    VendedorOriginal.dtFechaModifica = utils.f_actual;
                    VendedorOriginal.idUsuarioModifica = utils.IDusuario;

                    VendedorOriginal.strNombre = com_vendedores.strNombre;
                    VendedorOriginal.strApellidoP = com_vendedores.strApellidoP;
                    VendedorOriginal.strApellidoM = com_vendedores.strApellidoM;
                    VendedorOriginal.strEmail = com_vendedores.strEmail;
                    VendedorOriginal.strDireccion = com_vendedores.strDireccion;
                    VendedorOriginal.strTipoVendedor = com_vendedores.strTipoVendedor;
                    VendedorOriginal.strTelefono = com_vendedores.strTelefono;
                    db.Entry(VendedorOriginal).State = EntityState.Modified;
                    db.SaveChanges();
                    Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Proceso", "Vendedores", "Modificación de vendedor: " + VendedorOriginal.strNombre + " " + VendedorOriginal.strApellidoP + " " + VendedorOriginal.strApellidoM);
                    return Json(new { error = false, msg = "El registro se agrego de forma correcta." });
                }
                var msgs = string.Join(" | ", ModelState.Values
                          .SelectMany(v => v.Errors)
                          .Select(e => e.ErrorMessage));

                return Json(new { error = true, msg = msgs });
            }
            catch (Exception e)
            {
                return Json(new { error = true, msg = e.InnerException.ToString() });

            }

        }

        // GET: vendedores/Delete/5


        public ActionResult EditDescuentos(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            com_DescuentoConceptoVendedor com_DescuentoConceptoVendedor = db.com_DescuentoConceptoVendedor.Find(id);
            if (com_DescuentoConceptoVendedor == null)
            {
                return HttpNotFound();
            }
            return View(com_DescuentoConceptoVendedor);
        }

        [HttpPost]
        public JsonResult EditDescuentos([Bind(Include = "idDescConcepto,idEmpresa,idCodigoVendedor,idConcepto,strConcepto,totalAdeudo,cantidadDescontar,vigenciaInicio,vigenciaFin,vigenciaIndefinida,status")] com_vendedores com_vendedores)
        {

            try
            {
                if (ModelState.IsValid)
                {

                    Utils.Pie_tabla utils = new Utils.Pie_tabla();

                    var VendedorOriginal = db.com_vendedores.Find(com_vendedores.idCodigoVendedor);

                    VendedorOriginal.dtFechaModifica = utils.f_actual;
                    VendedorOriginal.idUsuarioModifica = utils.IDusuario;

                    VendedorOriginal.strNombre = com_vendedores.strNombre;
                    VendedorOriginal.strApellidoP = com_vendedores.strApellidoP;
                    VendedorOriginal.strApellidoM = com_vendedores.strApellidoM;
                    VendedorOriginal.strEmail = com_vendedores.strEmail;
                    VendedorOriginal.strDireccion = com_vendedores.strDireccion;
                    VendedorOriginal.strTipoVendedor = com_vendedores.strTipoVendedor;
                    VendedorOriginal.strTelefono = com_vendedores.strTelefono;
                    db.Entry(VendedorOriginal).State = EntityState.Modified;
                    db.SaveChanges();
                    Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Proceso", "Vendedores", "Modificación de vendedor: " + VendedorOriginal.strNombre + " " + VendedorOriginal.strApellidoP + " " + VendedorOriginal.strApellidoM);
                    return Json(new { error = false, msg = "El registro se agrego de forma correcta." });
                }
                var msgs = string.Join(" | ", ModelState.Values
                          .SelectMany(v => v.Errors)
                          .Select(e => e.ErrorMessage));

                return Json(new { error = true, msg = msgs });
            }
            catch (Exception e)
            {
                return Json(new { error = true, msg = e.InnerException.ToString() });

            }

        }



        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            com_vendedores com_vendedores = db.com_vendedores.Find(id);
            if (com_vendedores == null)
            {
                return HttpNotFound();
            }
            return View(com_vendedores);
        }

        // POST: vendedores/Delete/5
        [HttpPost, ActionName("Delete")]
        // [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            try
            {
                if (Session["RolID"].Equals("Administrador"))
                {
                    com_vendedores com_vendedores = db.com_vendedores.Find(id);
                    com_vendedores.boolActivo = false;
                    db.com_vendedores.Attach(com_vendedores);
                    db.Entry(com_vendedores).Property(x => x.boolActivo).IsModified = true;
                    db.SaveChanges();
                    Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Proceso", "Vendedores", "Eliminación de vendedor: " + com_vendedores.strNombre + " " + com_vendedores.strApellidoP + " " + com_vendedores.strApellidoM);

                    return Json(new { error = false, msg = "El registro se elimino de forma correcta." });
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

        [HttpPost, ActionName("DeleteDescuento")]
        // [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed2(int id)
        {
            try
            {
                if (Session["RolID"].Equals("Administrador"))
                {
                    var item = db.com_DescuentoConceptoVendedor
                            .Where(s => s.idDescConcepto == id).SingleOrDefault();
                    if (item != null)
                    {
                        db.com_DescuentoConceptoVendedor.Remove(item);
                        db.SaveChanges();
                    }

                    return Json(new { error = false, msg = "El registro se elimino de forma correcta." });
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

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        //CREATE DESCUENTOS
        [HttpPost]      
        public ActionResult Create2([Bind(Include = "idDescConcepto,idEmpresa,idCodigoVendedor,idConcepto,strConcepto,totalAdeudo,cantidadDescontar,vigenciaInicio,vigenciaFin,vigenciaIndefinida,status")] com_DescuentoConceptoVendedor com_Descuentos)
        {       
            try
            {
                var existeConfiguracionDescuento = db.com_DescuentoConceptoVendedor.Where(p => p.idEmpresa == com_Descuentos.idEmpresa && p.idCodigoVendedor == com_Descuentos.idCodigoVendedor && p.idConcepto == com_Descuentos.idConcepto && p.totalAdeudo == com_Descuentos.totalAdeudo && p.cantidadDescontar == com_Descuentos.cantidadDescontar && p.vigenciaInicio == com_Descuentos.vigenciaInicio && p.vigenciaFin == com_Descuentos.vigenciaFin).FirstOrDefault();
                if (existeConfiguracionDescuento == null)
                {
                    if (ModelState.IsValid)
                    {
                        var DescConcepto = db.com_Conceptos.Where(p => p.GRPID == com_Descuentos.idConcepto).Select(s => s.GRPDESCE).FirstOrDefault();
                        DescConcepto = DescConcepto.Trim();
                        com_Descuentos.status = true;
                        com_Descuentos.strConcepto = DescConcepto.ToString();                                           

                        db.com_DescuentoConceptoVendedor.Add(com_Descuentos);
                        db.SaveChanges();                     
                    }
                    var msgs = string.Join(" | ", ModelState.Values
                              .SelectMany(v => v.Errors)
                              .Select(e => e.ErrorMessage));

                    return Json(new { error = false, msg = msgs });
                }
                else
                {
                    //FALTANTE
                    return Json(new { error = true, msg = "Ya existe" });
                }

            }
            catch (DbEntityValidationException e)
            {
                string strMensaje = "";
                foreach (var eve in e.EntityValidationErrors)
                {
                    strMensaje = strMensaje + "Se han encontrado los siguiente errores de validación:";
                    foreach (var ve in eve.ValidationErrors)
                    {
                        strMensaje = strMensaje + "- Propiedad: " + ve.PropertyName + ", Error: " + ve.ErrorMessage;
                    }
                }
                Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Error", "Clientes", "Error alta de clientes: " + e.Message);
                return Json(new { error = true, msg = strMensaje });
            }
            catch (Exception e)
            {
                Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Error", "Clientes", "Error alta de clientes: " + e.Message);
                return Json(new { error = true, msg = e.Message.ToString() });

            }
        }

        public JsonResult getDescuentos(string id_vendedor)
        {
            //var com_DescuentoConceptoVendedor = db.com_DescuentoConceptoVendedor.Where(s => s.idCodigoVendedor.ToString() == id_vendedor);
            var com_DescuentoConceptoVenededor = (from a in db.com_DescuentoConceptoVendedor where (a.idCodigoVendedor.ToString() == id_vendedor)select new { a.idDescConcepto, a.idEmpresa, a.idCodigoVendedor, a.idConcepto, a.strConcepto, a.cantidadDescontar, a.vigenciaInicio, a.vigenciaFin, a.status });
            //return  Json(com_DescuentoConceptoVenededor.ToList());
            return Json(com_DescuentoConceptoVenededor, JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        public ActionResult crearConcepto([Bind(Include = "GRPID,GRPDESCE")] com_Conceptos com_conceptos)
        {
            try
            {
                var existeConcepto = db.com_Conceptos.Where(p => p.GRPID == com_conceptos.GRPID).FirstOrDefault();
                if (existeConcepto == null)
                {
                    if (ModelState.IsValid)
                    {
                        db.com_Conceptos.Add(com_conceptos);
                        db.SaveChanges();
                    }
                    var msgs = string.Join(" | ", ModelState.Values
                              .SelectMany(v => v.Errors)
                              .Select(e => e.ErrorMessage));

                    return Json(new { error = false, msg = msgs });
                }
                else
                {
                    //FALTANTE
                    return Json(new { error = true, msg = "Ya existe" });
                }

            }
            catch (DbEntityValidationException e)
            {
                string strMensaje = "";
                foreach (var eve in e.EntityValidationErrors)
                {
                    strMensaje = strMensaje + "Se han encontrado los siguiente errores de validación:";
                    foreach (var ve in eve.ValidationErrors)
                    {
                        strMensaje = strMensaje + "- Propiedad: " + ve.PropertyName + ", Error: " + ve.ErrorMessage;
                    }
                }
                Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Error", "Clientes", "Error alta de clientes: " + e.Message);
                return Json(new { error = true, msg = strMensaje });
            }
            catch (Exception e)
            {
                Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Error", "Clientes", "Error alta de clientes: " + e.Message);
                return Json(new { error = true, msg = e.Message.ToString() });

            }
        }


        [HttpPost]
        public ActionResult crearEmpresaConcepto([Bind(Include = "idRow,IdEmpresa,GRPID")] com_EmpresaConceptos com_empresaconceptos)
        {
            try
            {
                var existeEmpresaConcepto = db.com_EmpresaConceptos.Where(p => p.IdEmpresa == com_empresaconceptos.IdEmpresa && p.GRPID == com_empresaconceptos.GRPID).FirstOrDefault();
                if (existeEmpresaConcepto == null)
                {
                    if (ModelState.IsValid)
                    {
                        db.com_EmpresaConceptos.Add(com_empresaconceptos);
                        db.SaveChanges();
                    }
                    var msgs = string.Join(" | ", ModelState.Values
                              .SelectMany(v => v.Errors)
                              .Select(e => e.ErrorMessage));

                    return Json(new { error = false, msg = msgs });
                }
                else
                {
                    //FALTANTE
                    return Json(new { error = true, msg = "Ya existe" });
                }

            }
            catch (DbEntityValidationException e)
            {
                string strMensaje = "";
                foreach (var eve in e.EntityValidationErrors)
                {
                    strMensaje = strMensaje + "Se han encontrado los siguiente errores de validación:";
                    foreach (var ve in eve.ValidationErrors)
                    {
                        strMensaje = strMensaje + "- Propiedad: " + ve.PropertyName + ", Error: " + ve.ErrorMessage;
                    }
                }
                Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Error", "Clientes", "Error alta de clientes: " + e.Message);
                return Json(new { error = true, msg = strMensaje });
            }
            catch (Exception e)
            {
                Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Error", "Clientes", "Error alta de clientes: " + e.Message);
                return Json(new { error = true, msg = e.Message.ToString() });

            }
        }

        //public ActionResult DescuentosV(string[] lista)
        //{
        //    return View(lista);
        //}
    }
}
