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
using System.IO;
using System.Threading;
using System.Threading.Tasks;

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
            ViewBag.Bancos = new SelectList(ListaPersonalizadaBancos(), "Value", "Text");
            ViewBag.TipoPago = new SelectList(ListaTipoPago(), "Value", "Text");
            ViewBag.hdnRolID = Session["RolID"].ToString();
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
                if (Session["RolID"].Equals("Administrador") || Session["RolID"].Equals("Operador") || Session["RolID"].Equals("Vendedor"))
                {
                    ViewBag.IdEmpresa = new SelectList(db.com_empresas, "IdEmpresa", "strNombreEmpresa");
                    ViewBag.idCodigoVendedor = new SelectList(ListaPersonalizadaVendedores(), "Value", "Text");// new SelectList(db.com_vendedores.Where(p => p.boolActivo == true), "idCodigoVendedor", "strNombre");
                    ViewBag.idVendedor = new SelectList(ListaPersonalizadaVendedores(), "Value", "Text");// new SelectList(db.com_vendedores.Where(p => p.boolActivo == true), "idCodigoVendedor", "strNombre");
                    ViewBag.hdnRolID = Session["RolID"].ToString();
                    //var com_DescuentoConceptoVenededor = (from a in db.com_DescuentoConceptoVendedor where (a.idCodigoVendedor.ToString() == id_vendedor) select new { a.idDescConcepto, a.idEmpresa, a.idCodigoVendedor, a.idConcepto, a.strConcepto, a.cantidadDescontar, a.vigenciaInicio, a.vigenciaFin, a.status });
                    if (!Session["RolID"].Equals("Vendedor"))
                    {
                        ViewBag.BagVendedores = new SelectList(ListaPersonalizadaVendedores(), "Value", "Text");
                    }
                    else
                    {
                        ViewBag.BagVendedores = new SelectList(ListaPersonalizadaVendedor(), "Value", "Text");
                    }
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
        public ActionResult Create([Bind(Include = "idCodigoVendedor,strNombre,strApellidoP,strApellidoM,strDireccion,strTipoVendedor,strTelefono,strEmail,boolActivo,dtFechaAlta,dtFechaModifica,idUsuarioAlta,idUsuarioModifica,idBanco,ClabeInterbancaria,TipoPago")] com_vendedores com_vendedores)
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
                        return Json(new { error = false, msg = "Se guardo el Vendedor de forma correcta.", Id = com_vendedores.idCodigoVendedor });
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

        [HttpPost]
        public ActionResult GetDocsEvidencia(int IdVendedor)
        {
            try
            {
                IList<SelectListItem> docs = new List<SelectListItem>();

                var dv = db.com_DocumentoVendedor.Include("com_Documentos").Where(x => x.idCodigoVendedor == IdVendedor).ToList();

                foreach (var d in dv)
                {
                    if (d.com_Documentos != null)
                        docs.Add(new SelectListItem { Text = d.com_Documentos.name, Value = d.com_Documentos.idDocumento.ToString() });
                }

                return Json(new { data = docs, error = false, msg = "Success" });
            }
            catch (Exception ex)
            {
                return Json(new { error = true, msg = ex.Message });
            }
        }

        public ActionResult DownloadDoc(int IdDoc)
        {
            var file = db.com_Documentos.FirstOrDefault(x => x.idDocumento == IdDoc);

            byte[] fileBytes = file.data;

            return File(fileBytes, System.Net.Mime.MediaTypeNames.Application.Octet, file.name);
        }

        [HttpPost]
        public ActionResult DeleteDoc(int IdDoc)
        {
            try
            {
                IList<SelectListItem> docs = new List<SelectListItem>();

                var dv = db.com_DocumentoVendedor.Where(x => x.idDocumento == IdDoc).FirstOrDefault();

                if (dv != null)
                {
                    db.Entry(dv).State = System.Data.Entity.EntityState.Deleted;
                    db.SaveChanges();

                    var d = db.com_Documentos.Where(x => x.idDocumento == IdDoc).FirstOrDefault();
                    if (d != null)
                    {
                        db.Entry(d).State = System.Data.Entity.EntityState.Deleted;
                        db.SaveChanges();
                    }
                }

                return Json(new { error = false, msg = "Documento eliminado con éxito!" });
            }
            catch (Exception ex)
            {
                return Json(new { error = true, msg = ex.Message });
            }
        }

        [HttpPost]
        public ActionResult GuardarEvidencias(List<string> Files, int IdVendedor)
        {
            try
            {
                com_Documentos doc;
                com_DocumentoVendedor docVend;
                System.IO.FileInfo fi;

                if (Files.Count > 0)
                {
                    foreach (var f in Files)
                    {

                        var pathFile = Path.Combine(Server.MapPath("~/App_Data/TempDocs"), f);

                        if (System.IO.File.Exists(pathFile))
                        {
                            byte[] array = System.IO.File.ReadAllBytes(pathFile);
                            doc = new com_Documentos();
                            fi = new System.IO.FileInfo(pathFile);

                            doc.name = fi.Name;
                            doc.contentType = fi.Extension;
                            doc.data = array;

                            //db.com_Documentos.Add(doc);

                            db.Entry(doc).State = System.Data.Entity.EntityState.Added;

                            docVend = new com_DocumentoVendedor();

                            docVend.idCodigoVendedor = IdVendedor;
                            docVend.idDocumento = doc.idDocumento;

                            db.Entry(docVend).State = System.Data.Entity.EntityState.Added;
                            //db.com_DocumentoVendedor.Add(docVend);

                            db.SaveChanges();

                            try
                            {
                                System.IO.File.Delete(pathFile);

                            }
                            catch
                            {
                            }


                        }
                    }

                }

                return Json(new { error = false, msg = "Se subió correctamente la evidencia" });
            }
            catch (Exception ex)
            {
                return Json(new { error = true, msg = ex.Message });
            }
        }

        [HttpPost]
        public async Task<JsonResult> UploadFile()
        {
            string strFileName = string.Empty;
            try
            {
                foreach (string file in Request.Files)
                {
                    var fileContent = Request.Files[file];
                    if (fileContent != null && fileContent.ContentLength > 0)
                    {
                        try
                        {
                            System.IO.FileInfo fi;

                            if (System.IO.File.Exists(file))
                            {
                                byte[] array = System.IO.File.ReadAllBytes(file);
                                fi = new System.IO.FileInfo(file);
                            }

                            var stream = fileContent.InputStream;
                            var fileName = Path.GetFileName(file);
                            strFileName = fileName;
                            var path = Path.Combine(Server.MapPath("~/App_Data/TempDocs"), fileName);
                            using (var fileStream = System.IO.File.Create(path))
                            {
                                stream.CopyTo(fileStream);
                            }

                        }
                        catch (Exception ex)
                        {
                            return Json(new { error = true, msg = ex.Message });
                        }


                    }
                    else
                    {
                        return Json(new { error = true, msg = "Error, fileContent is null!" });
                    }
                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { error = true, msg = ex.Message });
            }

            return Json(new { error = false, msg = strFileName });
        }

        [HttpPost]
        public ActionResult ValidarArchivo_Abierto(string file)
        {
            try
            {
                System.IO.FileInfo fi;

                if (System.IO.File.Exists(file))
                {
                    byte[] array = System.IO.File.ReadAllBytes(file);
                    fi = new System.IO.FileInfo(file);
                }

                return Json(new { error = false, msg = "Success" });
            }
            catch (Exception ex)
            {
                return Json(new { error = true, msg = ex.Message });
            }
        }

        // GET: vendedores/Edit/5
        public ActionResult Edit(int? id)
        {
            ViewBag.Bancos = new SelectList(ListaPersonalizadaBancos(), "Value", "Text");
            ViewBag.TipoPago = new SelectList(ListaTipoPago(), "Value", "Text");
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
        public JsonResult Edit([Bind(Include = "idCodigoVendedor,strNombre,strApellidoP,strApellidoM,strDireccion,strTipoVendedor,strTelefono,strEmail,dtFechaModifica,idUsuarioModifica,idBanco,ClabeInterbancaria,TipoPago")] com_vendedores com_vendedores)
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
                    VendedorOriginal.idBanco = com_vendedores.idBanco;
                    VendedorOriginal.ClabeInterbancaria = com_vendedores.ClabeInterbancaria;
                    VendedorOriginal.TipoPago = com_vendedores.TipoPago;
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

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }



   

        //Metodos Nuevos
        public SelectList ListaPersonalizadaVendedor()
        {
            var usuario = Session["UserID"];
            int codigousuario = int.Parse(string.Format("{0}", usuario));
            var codVendedor = db.com_UsuarioVendedor.Where(s => s.Id_Usuario == codigousuario).Select(a => a.idCodigoVendedor).FirstOrDefault();
            int codigovendedor = int.Parse(string.Format("{0}", codVendedor));
            var vendedores = db.com_vendedores.Where(p => p.idCodigoVendedor == codigovendedor).Select(x => new SelectListItem
            {
                Value = x.idCodigoVendedor.ToString(),
                Text = x.strNombre.Trim() + " " + x.strApellidoP.Trim() + " " + x.strApellidoM.Trim()
            });
            return new SelectList(vendedores, "Value", "Text");
        }

        //CREATE DESCUENTOS
        [HttpPost]
        public ActionResult CreateDescuentos([Bind(Include = "idDescuentoConceptoVendedor,idEmpresa,idCodigoVendedor,idConcepto,strConcepto,totalAdeudo,cantidadDescontar,vigenciaInicio,vigenciaFin,vigenciaIndefinida,status")] com_DescuentoConceptoVendedor com_Descuentos)
        {
            try
            {
                var validarConfiguracionporDescuento = (dynamic)null;
                var validarConfiguracionporDescuentosaldo = (dynamic)null;

                //var existeConfiguracionDescuento = db.com_DescuentoConceptoVendedor.Where(p => p.idEmpresa == com_Descuentos.idEmpresa && p.idCodigoVendedor == com_Descuentos.idCodigoVendedor && p.idConcepto == com_Descuentos.idConcepto && p.totalAdeudo == com_Descuentos.totalAdeudo && p.cantidadDescontar == com_Descuentos.cantidadDescontar && p.vigenciaInicio == com_Descuentos.vigenciaInicio && p.vigenciaFin == com_Descuentos.vigenciaFin).FirstOrDefault();
                var existeConfiguracionDescuento = db.com_DescuentoConceptoVendedor.Where(p => p.idEmpresa == com_Descuentos.idEmpresa && p.idCodigoVendedor == com_Descuentos.idCodigoVendedor && p.idConcepto == com_Descuentos.idConcepto).FirstOrDefault();
                if (existeConfiguracionDescuento != null)
                {
                    validarConfiguracionporDescuento = (from CHP in db.com_HistorialDescuentoVendedor
                                                        join DCV in db.com_DescuentoConceptoVendedor on CHP.idDescuentoConceptoVendedor equals DCV.idDescuentoConceptoVendedor
                                                        where (DCV.idEmpresa == com_Descuentos.idEmpresa && DCV.idConcepto == com_Descuentos.idConcepto && DCV.idCodigoVendedor == com_Descuentos.idCodigoVendedor)
                                                        select new { CHP.idRow, CHP.SaldoTotal }).FirstOrDefault();
                    validarConfiguracionporDescuentosaldo = (from CHP in db.com_HistorialDescuentoVendedor
                                                             join DCV in db.com_DescuentoConceptoVendedor on CHP.idDescuentoConceptoVendedor equals DCV.idDescuentoConceptoVendedor
                                                             where (CHP.SaldoTotal == 0 && DCV.idEmpresa == com_Descuentos.idEmpresa && DCV.idConcepto == com_Descuentos.idConcepto && DCV.idCodigoVendedor == com_Descuentos.idCodigoVendedor)
                                                             select new { CHP.idRow, CHP.SaldoTotal }).FirstOrDefault();
                }



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
                else if (validarConfiguracionporDescuento != null)
                {
                    if (validarConfiguracionporDescuentosaldo != null)
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
                        return Json(new { error = true, msg = "El concepto ya esta siendo aplicado y aun no se termina de saldar para esta empresa y vendedor." });
                    }
                }
                else
                {
                    //FALTANTE
                    return Json(new { error = true, msg = "El concepto ya esta siendo aplicado y aun no se termina de saldar para esta empresa y vendedor." });
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
            var com_DescuentoConceptoVenededor = (from a in db.com_DescuentoConceptoVendedor where (a.idCodigoVendedor.ToString() == id_vendedor) select new { a.idDescuentoConceptoVendedor, a.idEmpresa, a.idCodigoVendedor, a.idConcepto, a.strConcepto, a.cantidadDescontar, a.vigenciaInicio, a.vigenciaFin, a.status });
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

        public JsonResult getAsociarConceptos(string idEmpresa)
        {
            int idempresa = Convert.ToInt32(idEmpresa);

            var conceptos = db.SP_COMISIONES_CONSULTAR_CONCEPTOS(idempresa).ToList();
            return Json(conceptos, JsonRequestBehavior.AllowGet);

        }

        public JsonResult getConceptosEdit(string idEmpresa)
        {
            int idempresa = Convert.ToInt32(idEmpresa);

            var conceptos = (from a in db.com_Conceptos
                             join b in db.com_EmpresaConceptos on a.GRPID equals b.GRPID
                             where b.IdEmpresa.ToString() == idEmpresa
                             select new { a.GRPID, a.GRPDESCE }).ToList();
            return Json(conceptos, JsonRequestBehavior.AllowGet);

        }

        public JsonResult getConceptoPorEmpresa(string idEmpresa, string id)
        {
            int idempresa = Convert.ToInt32(idEmpresa);

            var concepto = db.com_DescuentoConceptoVendedor.Where(s => s.idEmpresa.ToString() == idEmpresa && s.idDescuentoConceptoVendedor.ToString() == id).Select(s => s.idConcepto).FirstOrDefault();
            if (String.IsNullOrWhiteSpace(concepto))
            {
                concepto = "";

            }

            return Json(concepto, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult crearAsociacionConcepto([Bind(Include = "idRow,IdEmpresa,GRPID")] com_EmpresaConceptos com_conceptosEmpresas)
        {
            try
            {
                var existeAsocicion = db.com_EmpresaConceptos.Where(p => p.GRPID == com_conceptosEmpresas.GRPID && p.IdEmpresa == com_conceptosEmpresas.IdEmpresa).FirstOrDefault();
                if (existeAsocicion == null)
                {
                    if (ModelState.IsValid)
                    {
                        db.com_EmpresaConceptos.Add(com_conceptosEmpresas);
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

        public ActionResult getConceptos(string id_empresa)
        {
            string strCadenaEmpresa = "";

            strCadenaEmpresa = Utilidades.Utilidades.mtdRecuperaCadenaConexion(Convert.ToInt32(id_empresa));
            try
            {
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
            List<SelectListItem> ListaEmpresas = new List<SelectListItem>();
            SelectListItem ListaItemEmpresas = new SelectListItem();
            List<SelectListItem> ListConcepto = new List<SelectListItem>();

            ListaEmpresas = new SelectList(db.com_empresas, "IdEmpresa", "strNombreEmpresa").ToList();
            ListConcepto = new SelectList(db.com_Conceptos, "GRPID", "GRPDESCE").ToList();

            ViewBag.BagVendedores = new SelectList(ListaPersonalizadaVendedores(), "Value", "Text");
            ViewBag.BagConceptos = new SelectList(ListConcepto, "Value", "Text");
            ViewBag.BagEmpresas = new SelectList(ListaEmpresas, "Value", "Text");

            return View(com_DescuentoConceptoVendedor);
        }

        [HttpPost]
        public JsonResult EditDescuentos([Bind(Include = "idDescuentoConceptoVendedor,totalAdeudo,idEmpresa,idConcepto,cantidadDescontar,vigenciaInicio,vigenciaFin,status,vigenciaindefinida")] com_DescuentoConceptoVendedor com_descuento)
        {

            try
            {
                if (ModelState.IsValid)
                {

                    Utils.Pie_tabla utils = new Utils.Pie_tabla();

                    var DescuentoOriginal = db.com_DescuentoConceptoVendedor.Find(com_descuento.idDescuentoConceptoVendedor);
                    var descripcionconcepto = db.com_Conceptos.Where(s => s.GRPID == DescuentoOriginal.idConcepto).Select(s => s.GRPDESCE).FirstOrDefault();
                    //DescuentoOriginal.dtFechaModifica = utils.f_actual;
                    //DescuentoOriginal.idUsuarioModifica = utils.IDusuario;
                    descripcionconcepto = descripcionconcepto.Trim();
                    DescuentoOriginal.idEmpresa = com_descuento.idEmpresa;
                    DescuentoOriginal.idConcepto = com_descuento.idConcepto;
                    DescuentoOriginal.strConcepto = descripcionconcepto;
                    DescuentoOriginal.totalAdeudo = com_descuento.totalAdeudo;
                    DescuentoOriginal.cantidadDescontar = com_descuento.cantidadDescontar;
                    DescuentoOriginal.vigenciaInicio = com_descuento.vigenciaInicio;
                    DescuentoOriginal.vigenciaFin = com_descuento.vigenciaFin;
                    DescuentoOriginal.vigenciaIndefinida = com_descuento.vigenciaIndefinida;
                    DescuentoOriginal.status = com_descuento.status;
                    db.Entry(DescuentoOriginal).State = EntityState.Modified;
                    db.SaveChanges();
                    Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Proceso", "Vendedores", "Modificación de descuento con id: " + DescuentoOriginal.idDescuentoConceptoVendedor);
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

        public ActionResult getCliente(string id_empresa)
        {
            string strCadenaEmpresa = "";

            List<RM00101> mtdListarPorEmpresa;

            strCadenaEmpresa = Utilidades.Utilidades.mtdRecuperaCadenaConexion(Convert.ToInt32(id_empresa));

            try
            {
                using (var ctx = new ELIEntities(strCadenaEmpresa))
                {
                    mtdListarPorEmpresa = ctx.RM00101.ToList();
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex.ToString());
                throw new Exception("Error al obtener la lista", ex);
            }

            var Cliente = new SelectList(ListaPersonalizadadescuentos(strCadenaEmpresa), "Value", "Text");
            return Json(new { error = false, Cliente = Cliente }, JsonRequestBehavior.AllowGet);
        }

        public SelectList ListaPersonalizadadescuentos(string strCadenaEmpresa)
        {
            ELIEntities dbContext = new ELIEntities(strCadenaEmpresa);
            var clientes = dbContext.RM00101.Select(x => new SelectListItem
            {
                Value = x.CUSTNMBR.Trim(),
                Text = "[" + x.CUSTNMBR.Trim() + "]" + " " + x.CUSTNAME.Trim()
            });
            return new SelectList(clientes, "Value", "Text");
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
                            .Where(s => s.idDescuentoConceptoVendedor == id).SingleOrDefault();
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


        public JsonResult getDescuentosHistorial1(string id_descuento)
        {
            var com_DescuentoHistorial = (dynamic)null;
            com_DescuentoHistorial = (from HIS in db.com_HistorialDescuentoVendedor
                                      join DESCU in db.com_DescuentoConceptoVendedor on HIS.idDescuentoConceptoVendedor equals DESCU.idDescuentoConceptoVendedor
                                      where (HIS.idDescuentoConceptoVendedor.ToString() == id_descuento)
                                      select new { HIS.idCodigoVendedor, HIS.SaldoTotal, DESCU.totalAdeudo, DESCU.idConcepto, HIS.idRow }).OrderByDescending(s => s.idRow).FirstOrDefault();

            if (com_DescuentoHistorial == null)
            {
                com_DescuentoHistorial = new { idCodigoVendedor = 0, SaldoTotal = 0.0m, totalAdeudo = 0.0m, idConcepto = 0, idRow = 0 };
            }
            return Json(com_DescuentoHistorial, JsonRequestBehavior.AllowGet);

        }

        public JsonResult getDescuentosHistorial2(string id_descuento)
        {
            var com_DescuentoHistorial = (dynamic)null;
            com_DescuentoHistorial = (from HIS in db.com_HistorialDescuentoVendedor
                                      join DESCU in db.com_DescuentoConceptoVendedor on HIS.idDescuentoConceptoVendedor equals DESCU.idDescuentoConceptoVendedor
                                      where (HIS.idDescuentoConceptoVendedor.ToString() == id_descuento)
                                      select new { HIS.idPeriodo, HIS.Descuento, HIS.SaldoTotal }).ToList();

            //if (com_DescuentoHistorial == null)
            //{
            //    com_DescuentoHistorial = new { idCodigoVendedor = 0, SaldoTotal = 0.0m, totalAdeudo = 0.0m, idConcepto = 0, idRow = 0 };
            //}
            return Json(com_DescuentoHistorial, JsonRequestBehavior.AllowGet);

        }

        public SelectList ListaPersonalizadaBancos()
        {
            var vendedores = db.com_bancos.Select(x => new SelectListItem
            {
                Value = x.idBanco.ToString(),
                Text = x.Descripcion.Trim()
            });
            return new SelectList(vendedores, "Value", "Text");
        }

        public SelectList ListaTipoPago()
        {

            List<TipoPago> tipoPago = new List<TipoPago>();
            TipoPago tipopago1 = new TipoPago();
            tipopago1.Text = "Asimilados";
            tipopago1.Value = "A";
            tipoPago.Add(tipopago1);
            TipoPago tipopago2 = new TipoPago();
            tipopago2.Text = "Directos";
            tipopago2.Value = "D";
            tipoPago.Add(tipopago2);

            return new SelectList(tipoPago, "Value", "Text");
        }

        public ActionResult CreateDescuentos()
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
                    return View();
                }
                else
                {
                    return View("~/Views/Home/Login.cshtml");
                }
            }
        }

        public ActionResult IndexDescuentos()
        {
            if (Session["RolID"] == null)
            {
                return View("~/Views/Home/Login.cshtml");
            }
            else
            {
                if (Session["RolID"].Equals("Administrador") || Session["RolID"].Equals("Operador"))
                {
                    if (!Session["RolID"].Equals("Vendedor"))
                    {
                        ViewBag.BagVendedores = new SelectList(ListaPersonalizadaVendedores(), "Value", "Text");
                    }
                    else
                    {
                        ViewBag.BagVendedores = new SelectList(ListaPersonalizadaVendedor(), "Value", "Text");
                    }

                    ViewBag.hdnRolID = Session["RolID"].ToString();

                    return View();

                }
                else
                {
                    return View("~/Views/Home/Login.cshtml");
                }

            }

        }
    }
}
