using OneCoreData;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Web.Mvc;
using WebApplication1.Models;
using System.Data.SqlClient;
using System.IO;
using iTextSharp.text;
using iTextSharp.text.pdf;
using iTextSharp.tool.xml;
using iTextSharp.text.html.simpleparser;

namespace WebApplication1.Controllers
{
    public class PeriodosController : Controller
    {
        private COMISIONESEntities db = new COMISIONESEntities();
        private ELIEntities dbELI = new ELIEntities();

        // GET: Periodos
        public ActionResult Index()
        {
            return View();
        }

        // GET: Periodos/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: Periodos/Liberar
        public ActionResult LiberarPeriodo()
        {
            if (Session["RolID"] == null)
            {
                return View("~/Views/Home/Login.cshtml");
            }
            else
            {
                if (Session["RolID"].Equals("Administrador") || Session["RolID"].Equals("Operador"))
                {
                    ViewBag.BagVendedores = new SelectList(ListaPersonalizadaVendedores(), "Value", "Text");
                    List<SelectListItem> newList = new List<SelectListItem>();
                    SelectListItem ListaItemsPeriodos = new SelectListItem();
                    for (int i = 0; i < 99; i++)
                    {
                        string texto = (i + 1).ToString() + " - " + DateTime.Now.Year;
                        string valor = (i + 1).ToString() + DateTime.Now.Year;
                        ListaItemsPeriodos = new SelectListItem { Text = texto, Value = valor };
                        newList.Add(ListaItemsPeriodos);
                    }
                    ViewBag.BagPeriodos = new SelectList(newList, "Value", "Text");
                    return View();
                }
                else
                {
                    return View("~/Views/Home/Login.cshtml");
                }

            }

        }

        // GET: Periodos/Create
        public ActionResult Create(string vendedor, string periodo)
        {
            if (Session["RolID"] == null)
            {
                return View("~/Views/Home/Login.cshtml");
            }
            else
            {
                if (Session["RolID"].Equals("Administrador") || Session["RolID"].Equals("Operador"))
                {
                    ViewBag.BagVendedores = new SelectList(ListaPersonalizadaVendedores(), "Value", "Text");
                    List<SelectListItem> newList = new List<SelectListItem>();
                    SelectListItem ListaItemsPeriodos = new SelectListItem();
                    for (int i = 0; i < 99; i++)
                    {
                        string texto = (i + 1).ToString() + " - " + DateTime.Now.Year;
                        string valor = (i + 1).ToString() + DateTime.Now.Year;
                        ListaItemsPeriodos = new SelectListItem { Text = texto, Value = valor };
                        newList.Add(ListaItemsPeriodos);
                    }
                    ViewBag.BagPeriodos = new SelectList(newList, "Value", "Text");
                    ViewBag.vendedorDefault = vendedor;
                    ViewBag.periodoDefault = periodo;
                    
                    return View();
                }
                else
                {
                    return View("~/Views/Home/Login.cshtml");
                }

            }
           
        }

        // GET: Periodos/HistoricoCliente/
        public ActionResult HistoricoCliente(string idCodigoVendedor, int intPeriodo)
        {
            int idCodigoVendedorInt = Convert.ToInt32(idCodigoVendedor);
            List<ResumenHistorico> _ListHistorico = new List<ResumenHistorico>();

            ResumenHistorico _Historico = new ResumenHistorico();

            var ResumenPeriodos = (from Con in db.com_clientesComConfig
                                   join Per in db.com_configPeriodos on Con.idClienteConfig equals Per.idConfiguracionPeriodo
                                   join Emp in db.com_empresas on Con.IdEmpresa equals Emp.IdEmpresa
                                   join Hist in db.com_clientesHistoricoPeriodos on new {  idCliente = Con.idCliente } equals new { idCliente = Hist.idCliente }
                                   //    ////into Hist
                                   //    //into temp
                                   //select new { });
                                   ////from x in temp.DefaultIfEmpty()
                                   select new { Con, Per, Emp, Hist }).Where(p => p.Con.idCodigoVendedor == idCodigoVendedorInt && p.Per.Activo == true);

            if (ResumenPeriodos.Count() > 0)
            {
                foreach (var Registro in ResumenPeriodos)
                {
                    _ListHistorico.Add(new ResumenHistorico
                    {
                        ID_EMPRESA = Registro.Emp.IdEmpresa,
                        NOMBRE_EMPRESA = Registro.Emp.strNombreEmpresa,
                        ID_CLIENTE = Registro.Con.idCliente,
                        NOMBRE_CLIENTE = Registro.Con.strNombreCliente,
                        DIAS_CREDITO = Registro.Hist.intDiasCredito,
                        DIAS_RETENCION = Registro.Hist.intDiasRetencion,
                        DIAS_GRACIA = Registro.Hist.intDiasGracia,
                        PERIODO = Convert.ToInt32(Registro.Hist.Periodo)
                    });
                }
            }

            IEnumerable<string> DistEmpresas = _ListHistorico.Select(x => x.NOMBRE_EMPRESA).Distinct();
            string[] arrayEmpresa = new string[DistEmpresas.Count()];
            for(int i = 0; i < DistEmpresas.Count(); i++)
            {
                arrayEmpresa[i] = DistEmpresas.ElementAt(i);
            }
            ViewBag.Emp = arrayEmpresa;

            //var periodos = db.com_configPeriodos.Select(p => p).OrderByDescending(p => p.Periodo).Where(p => p.idVendedor == idCodigoVendedor && p.Activo == true).ToList();

            //var configuraciones = db.com_clientesComConfig.Select(p => p).Where(p => p.idCodigoVendedor == idCodigoVendedorInt).ToList();

            //if(configuraciones.Count > 0)
            //{
            //    foreach(var configuracion in configuraciones)
            //    {
            //        configuracion
            //    }
            //}

            //if(periodos.Count > 1)
            //{

            //}
            //else
            //{

            //}


         return View(_ListHistorico);
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

        // POST: Periodos/Create
        [HttpPost]
        public ActionResult Create2([Bind(Include = "idPeriodo,idCodigoVendedor,strNumPeriodo,strAño,dtFechaInicio,dtFechaFin")] com_periodos com_periodos)
        {
            try
            {
                Utils.Pie_tabla utils = new Utils.Pie_tabla();

                if (ModelState.IsValid)
                {

                    var empresas = db.com_empresas.Select(p => p).Where(p => p.boolActivo == true).ToList();
                    bool correcto = false;
                    string vendedor = "";
                    string periodoCompuesto = "";
                    foreach (var empresa in empresas)
                    {
                        string ClientesConfig = string.Join(",", db.com_clientesComConfig.Where(p => p.IdEmpresa == 1)
                                 .Select(p => p.idCliente.ToString()));

                        var queryVendedor = db.com_vendedores.Where(p => p.idCodigoVendedor == com_periodos.idCodigoVendedor).Select(p=> p).FirstOrDefault();
                        vendedor = queryVendedor.strNombre + " " + queryVendedor.strApellidoP + " " + queryVendedor.strApellidoM;
                        

                        string strCadenaEmpresa = Utilidades.Utilidades.mtdRecuperaCadenaConexion(Convert.ToInt32(empresa.IdEmpresa));

                        DateTime GetDate = DateTime.Now; // random date
                        periodoCompuesto = GetDate.ToString("yy");
                        periodoCompuesto = com_periodos.strNumPeriodo + "" + periodoCompuesto;
                        using (var ctx = new ELIEntities(strCadenaEmpresa))
                        {
                            var query = ctx.csp_ConsultarFacturas(empresa.IdEmpresa, empresa.strNombreEmpresa, com_periodos.idCodigoVendedor.ToString(), Convert.ToInt32(periodoCompuesto), com_periodos.dtFechaInicio, com_periodos.dtFechaFin);//.ToList();
                            correcto = true;
                        }


                    }

                    if (correcto)
                    {
                        Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Proceso", "Generación Periodos", "Periodo generado correctamente con datos: Vendedor: " + vendedor + " Periodo: " + periodoCompuesto);

                        return Json(new { error = false, msg = "El periodo se generó correctamente." });
                    }
                    else
                    {
                        Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Error", "Generación Periodos", "No se pudo generar el periodo");
                        return Json(new { error = true, msg = "El periodo no se generó correctamente" });
                    }
                }
                var msgs = string.Join(" | ", ModelState.Values
                          .SelectMany(v => v.Errors)
                          .Select(e => e.ErrorMessage));

                return Json(new { error = true, msg = msgs });
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
                Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Error", "Generación Periodos", "No se pudo generar el periodo: " + strMensaje);
                return Json(new { error = true, msg = strMensaje });
            }
            catch (Exception e)
            {
                Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Error", "Generación Periodos", "No se pudo generar el periodo: " + e.Message);
                throw new Exception ("Error personalizado");
                // return Json(new { error = true, msg = e.InnerException});

            }
        }

        [HttpPost]
        public async System.Threading.Tasks.Task<ActionResult> Create([Bind(Include = "idPeriodo,idCodigoVendedor,strNumPeriodo,strAño,dtFechaInicio,dtFechaFin")] com_periodos com_periodos)
        {
            try
            {
                Utils.Pie_tabla utils = new Utils.Pie_tabla();

                if (ModelState.IsValid)
                {

                    var empresas = db.com_empresas.Select(p => p).Where(p => p.boolActivo == true && p.IdEmpresa == 1).ToList();
                    foreach (var empresa in empresas)
                    {
                        string ClientesConfig = string.Join(",", db.com_clientesComConfig.Where(p => p.IdEmpresa == empresa.IdEmpresa)
                                 .Select(p => p.idCliente.ToString()));

                        string strCadenaEmpresa = Utilidades.Utilidades.mtdRecuperaCadenaConexion(Convert.ToInt32(empresa.IdEmpresa));

                        DateTime GetDate = DateTime.Now; // random date
                        string periodoCompuesto = GetDate.ToString("yy");
                        periodoCompuesto = com_periodos.strNumPeriodo + "" + periodoCompuesto;

                        int idCodigoVendedor = com_periodos.idCodigoVendedor;
                       
                        var queryVendedor = db.com_vendedores.Where(p => p.idCodigoVendedor == com_periodos.idCodigoVendedor).Select(p => p).FirstOrDefault();
                        string vendedor = queryVendedor.strNombre + " " + queryVendedor.strApellidoP + " " + queryVendedor.strApellidoM;

                        try
                        {

                            var Configuraciones = db.com_clientesComConfig.Select(p => p).Where(p => p.boolActivo == true && p.idCodigoVendedor == idCodigoVendedor).Count();

                            if(Configuraciones > 0)
                            {
                                using (var ctx = new ELIEntities(strCadenaEmpresa))
                                {
                                    SqlParameter param1 = new SqlParameter("@idEmpresa", empresa.IdEmpresa);
                                    SqlParameter param2 = new SqlParameter("@Empresa", empresa.strNombreEmpresa);
                                    SqlParameter param3 = new SqlParameter("@idVendedor", com_periodos.idCodigoVendedor.ToString());
                                    SqlParameter param4 = new SqlParameter("@Periodo", periodoCompuesto);
                                    SqlParameter param5 = new SqlParameter("@fechaInicio", com_periodos.dtFechaInicio);
                                    SqlParameter param6 = new SqlParameter("@fechaFin", com_periodos.dtFechaFin);
                                    var Query = await ctx.Database.SqlQuery<string>("csp_ConsultarFacturas @idEmpresa,@Empresa,@idVendedor,@Periodo,@fechaInicio,@fechaFin", param1, param2, param3, param4, param5, param6).ToListAsync();

                                    if (Query[0].Equals("Ya se generaron periodos con el mismo rango de fechas para el vendedor seleccionado."))
                                    {
                                        return Json(new { error = true, msg = "Ya se generaron periodos con el mismo rango de fechas para el vendedor seleccionado." });
                                    }
                                    if (Query[0].Equals("Ya se genero el numero de periodo para el vendedor seleccionado."))
                                    {
                                        return Json(new { error = true, msg = "Ya se genero el numero de periodo para el vendedor seleccionado." });
                                    }
                                    if (Query[0].Equals("Ya se genero el periodo para el vendedor seleccionado."))
                                    {
                                        return Json(new { error = true, msg = "Ya se genero el periodo para el vendedor seleccionado." });
                                    }
                                    else
                                    {
                                        Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Proceso", "Generación Periodos", "Periodo generado correctamente con datos: Vendedor: " + vendedor + " Periodo: " + periodoCompuesto);
                                        return Json(new { error = false, msg = "Periodo generado correctamente" });
                                    }
                                }
                            }
                            else
                            { 
                                return Json(new { error = true, msg = "No existen configuraciones de clientes para este vendedor." });
                            }

                         
                        }
                        catch(SqlException ex)
                        {
                            Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Error", "Generación Periodos", ex.Message.ToString());
                            throw new Exception("Error SQL: " + ex.Message.ToString(), ex);
                        }
                        catch (Exception ex)
                        {
                            string IE = "IE";
                            if (ex.InnerException != null)
                            {
                                IE = IE + ": " + ex.InnerException;
                            }
                            Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Error", "Generación Periodos", ex.Message.ToString());
                            throw new Exception("Error: " + ex.GetType().ToString() + " " + IE, ex);
                        }

                    }
                    
                }
                var msgs = string.Join(" | ", ModelState.Values
                          .SelectMany(v => v.Errors)
                          .Select(e => e.ErrorMessage));

                return Json(new { error = false, msg = msgs });
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
                Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Error", "Generación Periodos", strMensaje);
                return Json(new { error = true, msg = strMensaje });
            }
            catch (Exception e)
            {
                return Json(new { error = true, msg = e.Message.ToString() });

            }
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public ActionResult ActualizarPeriodo(int idPeriodo, int accion)
        {
            try
            {
                if (Session["RolID"] == null)
                {
                    return View("~/Views/Home/Login.cshtml");
                }
                else
                {
                    if (Session["RolID"].Equals("Administrador"))
                    {
                        var response = db.SP_COMISIONES_ACTUALIZAR_PERIODO(idPeriodo, accion).ToList();

                        var empresas = db.com_periodos.Where(p=> p.idPeriodo == idPeriodo).FirstOrDefault();

                        string variable;
                        if(accion == 0)
                        {
                            variable = "cerrado";
                        }
                        else
                        {
                            variable = "abierto";
                        }


                        if (response.Count > 0)
                        {
                            Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Proceso", "Cerrar - Abrir Periodo", "Se ha "+ variable +" el siguiente periodo: " + empresas.strNumPeriodo);
                            return Json(new { error = false, msg = response[0].ToString() });
                        }
                        else
                        {
                            Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Error", "Cerrar - Abrir Periodo", "Periodo "+ empresas.strNumPeriodo +" no " + variable);
                            return Json(new { error = true, msg = "No se ha podido cambiar el estatus del periodo" });
                        }
                    }
                    else
                    {
                        return Json(new { error = true, msg = "No se tienen los suficientes permisos para cambiar el estatus del periodo, contacte con el administrador" });
                    }

                }
                
            }
            catch (Exception e)
            {
                return Json(new { error = true, msg = e.Message });
            }

        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public ActionResult ReCalcularPeriodo(int idVendedor, int periodo, DateTime fechaInicio, DateTime fechaFin, int idPeriodo)
        {
            try
            {
                if (Session["RolID"] == null)
                {
                    return View("~/Views/Home/Login.cshtml");
                }
                else
                {
                    if (Session["RolID"].Equals("Administrador"))
                    {
                        var response = db.SP_COMISIONES_RECALCULAR_PERIODO(idVendedor.ToString(), periodo, fechaInicio, fechaFin, idPeriodo).ToList();

                        if (response.Count > 0)
                        {
                            return Json(new { error = false, msg = response[0].ToString() });
                        }
                        else
                        {
                            return Json(new { error = true, msg = "No se ha podido recalcular el periodo" });
                        }
                    }
                    else
                    {
                        return Json(new { error = true, msg = "No se tienen los suficientes permisos para recalcular el periodo, contacte con el administrador" });
                    }

                }

            }
            catch (Exception e)
            {
                return Json(new { error = true, msg = e.Message });
            }

        }

        // GET: Periodos/TempResumen/
        [HttpGet]
        public ActionResult TempResumen(int idCodigoVendedor, int intPeriodo, int intYear, string dtFechaInicio, string tdFechaFin)
        {
            DateTime dtFechaInicio_Real = Convert.ToDateTime(dtFechaInicio);
            DateTime tdFechaFin_Real = Convert.ToDateTime(tdFechaFin);

            System.Data.DataTable dtCambiosUltimoPeriodoClientes = new System.Data.DataTable();

            var _PeriodoActualClientes = db.com_clientesComConfig.Where(p => p.boolActivo == true && p.idCodigoVendedor == idCodigoVendedor && (p.dtFechaAlta >= dtFechaInicio_Real.Date && p.dtFechaAlta <= tdFechaFin_Real.Date)).ToList();
            var _PeriodoAnterior = db.com_periodos.OrderByDescending(p => p.idPeriodo).Take(2).Where(p => p.boolActivo == true).ToList();

            if(_PeriodoAnterior.Count > 1) // Mas de un periodo
            {

            }
            else
            {

            }

            ViewBag.dtCambiosClientes = dtCambiosUltimoPeriodoClientes;

            ViewBag.prueba = "Pruebas de vista parcial";
            return PartialView("TempResumen", db.com_clientesComConfig.Where(p => p.boolActivo == true && p.idCodigoVendedor == idCodigoVendedor && (p.dtFechaAlta >= dtFechaInicio_Real.Date && p.dtFechaAlta <= tdFechaFin_Real.Date)).ToList());
        }

        // GET: Periodos/ARVResumenClientesFaltantes/
        [HttpGet]
        public ActionResult ARVResumenClientesFaltantes(int idCodigoVendedor, int intPeriodo, int intYear, string dtFechaInicio, string tdFechaFin)
        {
            DateTime dtFechaInicio_Real = Convert.ToDateTime(dtFechaInicio);
            DateTime tdFechaFin_Real = Convert.ToDateTime(tdFechaFin);

            ViewBag.qryEmpresas = db.com_empresas.Select(p => p).Where(p => p.boolActivo == true).ToList();
            ViewBag.dtFechaInicio_Real = dtFechaInicio_Real;
            ViewBag.tdFechaFin_Real = tdFechaFin_Real;

            return PartialView("ARVResumenClientesFaltantes");
        }

        // GET: Periodos/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: Periodos/Edit/5
        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: Periodos/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: Periodos/Delete/5
        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: Periodos/ImageHtml/
        [HttpGet]
        public ActionResult ImageHtml()
        {
            if (Session["RolID"] == null)
            {
                return View("~/Views/Home/Login.cshtml");
            }
            else
            {
                if (Session["RolID"].Equals("Administrador") || Session["RolID"].Equals("Operador"))
                {
                    return PartialView("ImageHtml");
                }
                else
                {
                    return View("~/Views/Home/Login.cshtml");
                }

            }

        }

        // GET: Periodos/ReporteClientes/
        [HttpGet]
        public ActionResult ReporteClientes(string vendedorDefault, string periodoDefault)
        {
            if (Session["RolID"] == null)
            {
                return Content("Sesión caducada");
            }
            else
            {
                
                if (Session["RolID"].Equals("Administrador") || Session["RolID"].Equals("Operador"))
                {

                    List<SelectListItem> newList = new List<SelectListItem>();
                    SelectListItem ListaItemsPeriodos = new SelectListItem();
                    for (int i = 0; i < 99; i++)
                    {
                        string texto = (i + 1).ToString() + " - " + DateTime.Now.Year;
                        string valor = (i + 1).ToString() + DateTime.Now.Year;
                        ListaItemsPeriodos = new SelectListItem { Text = texto, Value = valor };
                        newList.Add(ListaItemsPeriodos);
                    }

                    List<SelectListItem> ListaEmpresas = new List<SelectListItem>();
                    SelectListItem ListaItemEmpresas = new SelectListItem();

                    ListaItemEmpresas = new SelectListItem { Text = "Todas", Value = "0" };

                    ListaEmpresas = new SelectList(db.com_empresas, "IdEmpresa", "strNombreEmpresa").ToList();

                    ListaEmpresas.Insert(0, ListaItemEmpresas);

                    ViewBag.BagVendedores = new SelectList(ListaPersonalizadaVendedores(), "Value", "Text", vendedorDefault);
                    ViewBag.BagPeriodos = new SelectList(newList, "Value", "Text", periodoDefault);

                    ViewBag.BagEmpresas = new SelectList(ListaEmpresas, "Value", "Text");

                    return PartialView("ReporteClientes");
                }
                else
                {
                    return Content("Sesión caducada");
                    //return Redirect("~/Views/Home/Login.cshtml");
                    //return View("~/Views/Home/Login.cshtml");
                }

            }
            
        }
        
        // GET: Periodos/DetalleComisiones/
        [HttpGet]
        public ActionResult DetalleComisiones(string vendedorDefault, string periodoDefault)
        {

            if (Session["RolID"] == null)
            {
                return Content("Sesión caducada");
            }
            else
            {
                if (Session["RolID"].Equals("Administrador") || Session["RolID"].Equals("Operador"))
                {
                    List<SelectListItem> newList = new List<SelectListItem>();
                    SelectListItem ListaItemsPeriodos = new SelectListItem();
                    for (int i = 0; i < 99; i++)
                    {
                        string texto = (i + 1).ToString() + " - " + DateTime.Now.Year;
                        string valor = (i + 1).ToString() + DateTime.Now.Year;
                        ListaItemsPeriodos = new SelectListItem { Text = texto, Value = valor };
                        newList.Add(ListaItemsPeriodos);
                    }

                    List<SelectListItem> ListaEmpresas = new List<SelectListItem>();
                    SelectListItem ListaItemEmpresas = new SelectListItem();
                    ListaItemEmpresas = new SelectListItem { Text = "Todas", Value = "0" };

                    ListaEmpresas= new SelectList(db.com_empresas, "IdEmpresa", "strNombreEmpresa").ToList();

                    ListaEmpresas.Insert(0, ListaItemEmpresas);

                    ViewBag.BagVendedores = new SelectList(ListaPersonalizadaVendedores(), "Value", "Text", vendedorDefault);
                    ViewBag.BagPeriodos = new SelectList(newList, "Value", "Text", periodoDefault);

                    ViewBag.BagEmpresas = new SelectList( ListaEmpresas, "Value", "Text");

                 

                    return PartialView("DetalleComisiones");
                }
                else
                {
                    return Content("Sesión caducada");
                    //return View("~/Views/Home/Login.cshtml");
                }

            }

        }
        
        // GET: Periodos/ComisionesEquipo/
        [HttpGet]
        public ActionResult ComisionesEquipo(string vendedorDefault, string periodoDefault)
        {
            if (Session["RolID"] == null)
            {
                return Content("Sesión caducada");
            }
            else
            {
                if (Session["RolID"].Equals("Administrador") || Session["RolID"].Equals("Operador"))
                {
                    List<SelectListItem> newList = new List<SelectListItem>();
                    SelectListItem ListaItemsPeriodos = new SelectListItem();
                    for (int i = 0; i < 99; i++)
                    {
                        string texto = (i + 1).ToString() + " - " + DateTime.Now.Year;
                        string valor = (i + 1).ToString() + DateTime.Now.Year;
                        ListaItemsPeriodos = new SelectListItem { Text = texto, Value = valor };
                        newList.Add(ListaItemsPeriodos);
                    }
                    List<SelectListItem> ListaEmpresas = new List<SelectListItem>();
                    SelectListItem ListaItemEmpresas = new SelectListItem();
                    ListaItemEmpresas = new SelectListItem { Text = "Todas", Value = "0" };

                    ListaEmpresas = new SelectList(db.com_empresas, "IdEmpresa", "strNombreEmpresa").ToList();

                    ListaEmpresas.Insert(0, ListaItemEmpresas);

                    ViewBag.BagVendedores = new SelectList(ListaPersonalizadaVendedores(), "Value", "Text", vendedorDefault);
                    ViewBag.BagPeriodos = new SelectList(newList, "Value", "Text", periodoDefault);

                    ViewBag.BagEmpresas = new SelectList(ListaEmpresas, "Value", "Text");
                    
                    return PartialView("ComisionesEquipo");
                }
                else
                {
                    return Content("Sesión caducada");
                    //return View("~/Views/Home/Login.cshtml");
                }

            }

        }
     
        // GET: Periodos/DetalleNoComisionables/
        [HttpGet]
        public ActionResult DetalleNoComisionables(string vendedorDefault, string periodoDefault)
        {

            if (Session["RolID"] == null)
            {
                return Content("Sesión caducada");
            }
            else
            {
                if (Session["RolID"].Equals("Administrador") || Session["RolID"].Equals("Operador"))
                {
                    List<SelectListItem> newList = new List<SelectListItem>();
                    SelectListItem ListaItemsPeriodos = new SelectListItem();
                    for (int i = 0; i < 99; i++)
                    {
                        string texto = (i + 1).ToString() + " - " + DateTime.Now.Year;
                        string valor = (i + 1).ToString() + DateTime.Now.Year;
                        ListaItemsPeriodos = new SelectListItem { Text = texto, Value = valor };
                        newList.Add(ListaItemsPeriodos);
                    }

                    List<SelectListItem> ListaEmpresas = new List<SelectListItem>();
                    SelectListItem ListaItemEmpresas = new SelectListItem();
                    ListaItemEmpresas = new SelectListItem { Text = "Todas", Value = "0" };

                    ListaEmpresas = new SelectList(db.com_empresas, "IdEmpresa", "strNombreEmpresa").ToList();

                    ListaEmpresas.Insert(0, ListaItemEmpresas);

                    ViewBag.BagVendedores = new SelectList(ListaPersonalizadaVendedores(), "Value", "Text", vendedorDefault);
                    ViewBag.BagPeriodos = new SelectList(newList, "Value", "Text", periodoDefault);

                    ViewBag.BagEmpresas = new SelectList(ListaEmpresas, "Value", "Text");



                    return PartialView("DetalleNoComisionables");
                }
                else
                {
                    return Content("Sesión caducada");
                    //return View("~/Views/Home/Login.cshtml");
                }

            }

        }
        
        // GET: Periodos/DetalleRetenciones/
        [HttpGet]
        public ActionResult DetalleRetenciones(string vendedorDefault, string periodoDefault)
        {
            if (Session["RolID"] == null)
            {
                return Content("Sesión caducada");
            }
            else
            {
                if (Session["RolID"].Equals("Administrador") || Session["RolID"].Equals("Operador"))
                {
                    List<SelectListItem> newList = new List<SelectListItem>();
                    SelectListItem ListaItemsPeriodos = new SelectListItem();
                    for (int i = 0; i < 99; i++)
                    {
                        string texto = (i + 1).ToString() + " - " + DateTime.Now.Year;
                        string valor = (i + 1).ToString() + DateTime.Now.Year;
                        ListaItemsPeriodos = new SelectListItem { Text = texto, Value = valor };
                        newList.Add(ListaItemsPeriodos);
                    }

                    List<SelectListItem> ListaEmpresas = new List<SelectListItem>();
                    SelectListItem ListaItemEmpresas = new SelectListItem();
                    ListaItemEmpresas = new SelectListItem { Text = "Todas", Value = "0" };

                    ListaEmpresas = new SelectList(db.com_empresas, "IdEmpresa", "strNombreEmpresa").ToList();

                    ListaEmpresas.Insert(0, ListaItemEmpresas);

                    ViewBag.BagVendedores = new SelectList(ListaPersonalizadaVendedores(), "Value", "Text", vendedorDefault);
                    ViewBag.BagPeriodos = new SelectList(newList, "Value", "Text", periodoDefault);

                    ViewBag.BagEmpresas = new SelectList(ListaEmpresas, "Value", "Text");
                    
                    return PartialView("DetalleRetenciones");
                }
                else
                {
                    return Content("Sesión caducada");
                    //return View("~/Views/Home/Login.cshtml");
                }

            }

        }

        [HttpGet]
        public ActionResult HistoricoPeriodos()
        {
            if (Session["RolID"] == null)
            {
                return View("~/Views/Home/Login.cshtml");
            }
            else
            {
                if (Session["RolID"].Equals("Administrador") || Session["RolID"].Equals("Operador"))
                {
                    ViewBag.BagVendedores = new SelectList(ListaPersonalizadaVendedores(), "Value", "Text");
                    List<SelectListItem> newList = new List<SelectListItem>();
                    SelectListItem ListaItemsPeriodos = new SelectListItem();
                    for (int i = 0; i < 10; i++)
                    {
                        int añoActual = DateTime.Now.Year;
                        string añoCombo = (añoActual - i).ToString();
                        string texto = añoCombo;
                        string valor = añoCombo.Substring(2,2);
                        ListaItemsPeriodos = new SelectListItem { Text = texto, Value = valor };
                        newList.Add(ListaItemsPeriodos);
                    }

                    //List<SelectListItem> ListaEmpresas = new List<SelectListItem>();
                    //SelectListItem ListaItemEmpresas = new SelectListItem();
                    //ListaItemEmpresas = new SelectListItem { Text = "Todas", Value = "0" };

                    //ListaEmpresas = new SelectList(db.com_empresas, "IdEmpresa", "strNombreEmpresa").ToList();

                    //ListaEmpresas.Add(ListaItemEmpresas);

                    ViewBag.BagPeriodos = new SelectList(newList, "Value", "Text");

                    //ViewBag.BagEmpresas = new SelectList(ListaEmpresas, "Value", "Text");

                    return View();
                }
                else
                {
                    return View("~/Views/Home/Login.cshtml");
                }

            }

        }

        [HttpGet]
        public ActionResult CargaTablaPeriodos(string idCodigoVendedor, string periodo)
        {

            var Historico = (from p in db.SP_COMISIONES_CONSULTAR_HISTORIAL_PERIODOS(idCodigoVendedor, periodo) select new SP_COMISIONES_CONSULTAR_HISTORIAL_PERIODOS_Result() { Estatus = p.Estatus, Ver_Periodo = p.Ver_Periodo, Vendedor = p.Vendedor, Recalcular_Periodo = p.Recalcular_Periodo, Rango_Fechas = p.Rango_Fechas, Estatus_Periodo = p.Estatus_Periodo, fechaFin = p.fechaFin, fechaInicio = p.fechaInicio, idVendedor = p.idVendedor, Periodo = p.Periodo, idConfiguracionPeriodo = p.idConfiguracionPeriodo }).ToList();
            
            return View(Historico);
        }

        // POST: Periodos/obtenerReporte/
        [HttpPost]
        public ActionResult obtenerReporte(string numPeriodo, string anioPeriodo, string codigoVendedor, string idEmpresa)
        {
            string periodo = "";
            if (anioPeriodo.Length == 4)
            {
                periodo = numPeriodo.Trim() + anioPeriodo.Substring(2, 2).Trim();
            }
            else
            {
                periodo = numPeriodo.Trim() + anioPeriodo.Substring(3, 2).Trim();
            }
            int periodoInt = Convert.ToInt32(periodo);

            //codigoVendedor = "AGV003         ";
            var empresas = db.com_empresas.Select(p => p).Where(p => p.boolActivo == true).ToList();

            int claveEmpresa = Convert.ToInt32(idEmpresa);
            string spEjecutar = "csp_resumenComisionesCliente";
            string spEjecutarResumen= "csp_resumenComisionesClientePie";
            
            if (claveEmpresa == 0)
            {
                claveEmpresa = 1;
                spEjecutar = "csp_resumenComisionesClienteTodas";
                spEjecutarResumen= "csp_resumenComisionesClientePieTodas";
            }

            string strCadenaEmpresa = Utilidades.Utilidades.mtdRecuperaCadenaConexion(claveEmpresa);
           
            List<comisionesCliente> lista_clientes = new List<comisionesCliente>();
            comisionesClientePie pieComisiones = new comisionesClientePie();
            try
            {

                var Parameter1 = new SqlParameter
                {
                    ParameterName = "idVendedor",
                    Value = codigoVendedor
                };

                var Parameter2 = new SqlParameter
                {
                    ParameterName = "Periodo",
                    Value = periodo
                };

                var Parameter3 = new SqlParameter
                {
                    ParameterName = "idVendedor",
                    Value = codigoVendedor
                };

                var Parameter4 = new SqlParameter
                {
                    ParameterName = "Periodo",
                    Value = periodo
                };

                using (var ctx = new ELIEntities(strCadenaEmpresa))

                {
                    var query = ctx.Database.SqlQuery<comisionesCliente>("exec " + spEjecutar +  " @idVendedor, @Periodo", Parameter1, Parameter2).ToList();

                    foreach (comisionesCliente datos_tabla in query)
                    {//lleno la lista
                        lista_clientes.Add(new comisionesCliente
                        {
                            MONTO = decimal.Parse(datos_tabla.MONTO.ToString()),
                            CLIENTE = datos_tabla.CLIENTE.ToString()

                        });
                    }

                    var queryPie= ctx.Database.SqlQuery<comisionesClientePie>("exec " + spEjecutarResumen + " @idVendedor, @Periodo", Parameter3, Parameter4).ToList();

                    foreach (comisionesClientePie datos_tabla in queryPie)
                    {
                        pieComisiones = datos_tabla;
                    }
                }

                var periodos = db.com_configPeriodos.Where(p => p.Activo == true && p.Periodo == periodoInt && p.idVendedor == codigoVendedor).ToList();

                return Json(new { lista_clientes, pieComisiones, periodos });

            }
            catch (Exception ex)
            {
                return Json(new { error = true, msg = "Ocurrio un error al recuperar el reporte: " + ex.Message });
            }

        }
        
        // POST: Periodos/obtenerDetalle/
        [HttpPost]
        public ActionResult obtenerDetalle(string numPeriodo, string anioPeriodo, string codigoVendedor, string idEmpresa)
        {
            string periodo = "";
            if(anioPeriodo.Length == 4)
            {
                periodo = numPeriodo.Trim() + anioPeriodo.Substring(2, 2).Trim();
            }
            else
            {
                periodo = numPeriodo.Trim() + anioPeriodo.Substring(3, 2).Trim();
            }

            int periodoInt = Convert.ToInt32(periodo);

            //codigoVendedor = "AGV003         ";
            var empresas = db.com_empresas.Select(p => p).Where(p => p.boolActivo == true).ToList();

            int claveEmpresa = Convert.ToInt32(idEmpresa);
            string spEjecutar = "csp_detalleComisiones";

            if (claveEmpresa == 0)
            {
                claveEmpresa = 1;
                spEjecutar = "csp_detalleComisionesTodas";
            }

            string strCadenaEmpresa = Utilidades.Utilidades.mtdRecuperaCadenaConexion(claveEmpresa);

            List<detalleComisiones> lista_detalles = new List<detalleComisiones>();
            
            try
            {

                var Parameter1 = new SqlParameter
                {
                    ParameterName = "idVendedor",
                    Value = codigoVendedor
                };

                var Parameter2 = new SqlParameter
                {
                    ParameterName = "Periodo",
                    Value = periodo
                };

           
                using (var ctx = new ELIEntities(strCadenaEmpresa))

                {
                    var query = ctx.Database.SqlQuery<detalleComisiones>("exec " + spEjecutar + " @idVendedor, @Periodo", Parameter1, Parameter2).ToList();

                    foreach (detalleComisiones datos_tabla in query)
                    {//lleno la lista
                        var dateEnviar = datos_tabla.DATEENVIO.ToString();
                        var datePago = datos_tabla.DATEPAGO.ToString();
                        if (dateEnviar == null || dateEnviar == "")
                        {
                            dateEnviar = datos_tabla.DATEFACTURA.ToString();
                        }

                        if (datePago == null || datePago == "")
                        {
                            datePago = "01/01/0001";
                        }

                        lista_detalles.Add(new detalleComisiones
                        {
                            SOPNUMBE = datos_tabla.SOPNUMBE.ToString(),
                            DATEFACTURA = DateTime.Parse(datos_tabla.DATEFACTURA.ToString()),

                            DATEENVIO = DateTime.Parse(dateEnviar),

                            DATEPAGO = DateTime.Parse(datePago),

                            DIAS = int.Parse(datos_tabla.DIAS.ToString()),
                            CUSTNMBR = datos_tabla.CUSTNMBR.ToString(),
                            CUSTNAME= datos_tabla.CUSTNAME.ToString(),
                            TCPED = decimal.Parse(datos_tabla.TCPED.ToString()),

                            ITEMNMBR = datos_tabla.ITEMNMBR.ToString(),
                            COMISION = decimal.Parse(datos_tabla.COMISION.ToString()),
                            XTNDPRCE = decimal.Parse(datos_tabla.XTNDPRCE.ToString()),

                            SUBTOTAL = decimal.Parse(datos_tabla.SUBTOTAL.ToString()),
                            TOTAL = decimal.Parse(datos_tabla.TOTAL.ToString()),
                            ADUASECC = datos_tabla.ADUASECC.ToString(),
                            REFRENCE = datos_tabla.REFRENCE.ToString(),
                            RENDICION = datos_tabla.RENDICION.ToString(),
                            GrupoNombre= datos_tabla.GrupoNombre.ToString()
                        });
                    }
                }

                var periodos = db.com_configPeriodos.Where(p => p.Activo == true && p.Periodo == periodoInt && p.idVendedor == codigoVendedor).ToList();

                return Json(new { lista_detalles, periodos });

            }
            catch (Exception ex)
            {
                return Json(new { error = true, msg = "Ocurrio un error al recuperar el reporte: " + ex.Message });
            }

            

        }

        // POST: Periodos/obtenerDetalleNoComisionables/
        [HttpPost]
        public ActionResult obtenerDetalleNoComisionables(string numPeriodo, string anioPeriodo, string codigoVendedor, string idEmpresa)
        {
            string periodo = "";
            if (anioPeriodo.Length == 4)
            {
                periodo = numPeriodo.Trim() + anioPeriodo.Substring(2, 2).Trim();
            }
            else
            {
                periodo = numPeriodo.Trim() + anioPeriodo.Substring(3, 2).Trim();
            }
            int periodoInt = Convert.ToInt32(periodo);

            //codigoVendedor = "AGV003         ";
            var empresas = db.com_empresas.Select(p => p).Where(p => p.boolActivo == true).ToList();

            int claveEmpresa = Convert.ToInt32(idEmpresa);
            string spEjecutar = "csp_detalleNoComisionables";

            if (claveEmpresa == 0)
            {
                claveEmpresa = 1;
                spEjecutar = "csp_detalleNoComisionablesTodas";
            }

            string strCadenaEmpresa = Utilidades.Utilidades.mtdRecuperaCadenaConexion(claveEmpresa);

            List<detalleComisiones> lista_detalles = new List<detalleComisiones>();

            try
            {

                var Parameter1 = new SqlParameter
                {
                    ParameterName = "idVendedor",
                    Value = codigoVendedor
                };

                var Parameter2 = new SqlParameter
                {
                    ParameterName = "Periodo",
                    Value = periodo
                };


                using (var ctx = new ELIEntities(strCadenaEmpresa))

                {
                    var query = ctx.Database.SqlQuery<detalleComisiones>("exec " + spEjecutar + " @idVendedor, @Periodo", Parameter1, Parameter2).ToList();

                    foreach (detalleComisiones datos_tabla in query)
                    {//lleno la lista
                        var dateEnviar = datos_tabla.DATEENVIO.ToString();
                        var datePago = datos_tabla.DATEPAGO.ToString();
                        if (dateEnviar == null || dateEnviar == "")
                        {
                            dateEnviar = datos_tabla.DATEFACTURA.ToString();
                        }

                        if (datePago == null || datePago == "")
                        {
                            datePago = "01/01/0001";
                        }

                        lista_detalles.Add(new detalleComisiones
                        {
                            SOPNUMBE = datos_tabla.SOPNUMBE.ToString(),
                            DATEFACTURA = DateTime.Parse(datos_tabla.DATEFACTURA.ToString()),

                            DATEENVIO = DateTime.Parse(dateEnviar),

                            DATEPAGO = DateTime.Parse(datePago),

                            DIAS = int.Parse(datos_tabla.DIAS.ToString()),
                            CUSTNMBR = datos_tabla.CUSTNMBR.ToString(),
                            CUSTNAME = datos_tabla.CUSTNAME.ToString(),
                            TCPED = decimal.Parse(datos_tabla.TCPED.ToString()),

                            ITEMNMBR = datos_tabla.ITEMNMBR.ToString(),
                            COMISION = decimal.Parse(datos_tabla.COMISION.ToString()),
                            XTNDPRCE = decimal.Parse(datos_tabla.XTNDPRCE.ToString()),

                            SUBTOTAL = decimal.Parse(datos_tabla.SUBTOTAL.ToString()),
                            TOTAL = decimal.Parse(datos_tabla.TOTAL.ToString()),
                            ADUASECC = datos_tabla.ADUASECC.ToString(),
                            REFRENCE = datos_tabla.REFRENCE.ToString(),
                            RENDICION = datos_tabla.RENDICION.ToString(),
                            GrupoNombre = datos_tabla.GrupoNombre.ToString()
                        });
                    }
                }


                var periodos = db.com_configPeriodos.Where(p => p.Activo == true && p.Periodo == periodoInt && p.idVendedor == codigoVendedor).ToList();

                return Json(new { lista_detalles, periodos });

            }
            catch (Exception ex)
            {
                return Json(new { error = true, msg = "Ocurrio un error al recuperar el reporte: " + ex.Message });
            }
        }

        // POST: Periodos/obtenerDetalleRetenciones/
        [HttpPost]
        public ActionResult obtenerDetalleRetenciones(string numPeriodo, string anioPeriodo, string codigoVendedor, string idEmpresa)
        {
            string periodo = "";
            if (anioPeriodo.Length == 4)
            {
                periodo = numPeriodo.Trim() + anioPeriodo.Substring(2, 2).Trim();
            }
            else
            {
                periodo = numPeriodo.Trim() + anioPeriodo.Substring(3, 2).Trim();
            }
            int periodoInt = Convert.ToInt32(periodo);

            //codigoVendedor = "AGV003         ";
            var empresas = db.com_empresas.Select(p => p).Where(p => p.boolActivo == true).ToList();

            int claveEmpresa = Convert.ToInt32(idEmpresa);
            string spEjecutar = "csp_detalleRetenciones";

            if (claveEmpresa == 0)
            {
                claveEmpresa = 1;
                spEjecutar = "csp_detalleRetencionesTodas";
            }

            string strCadenaEmpresa = Utilidades.Utilidades.mtdRecuperaCadenaConexion(claveEmpresa);

            List<comisionRetenciones> lista_detalles = new List<comisionRetenciones>();

            try
            {

                var Parameter1 = new SqlParameter
                {
                    ParameterName = "idVendedor",
                    Value = codigoVendedor
                };

                var Parameter2 = new SqlParameter
                {
                    ParameterName = "Periodo",
                    Value = periodo
                };


                using (var ctx = new ELIEntities(strCadenaEmpresa))

                {
                    var query = ctx.Database.SqlQuery<comisionRetenciones>("exec " + spEjecutar + " @idVendedor, @Periodo", Parameter1, Parameter2).ToList();

                    foreach (comisionRetenciones datos_tabla in query)
                    {//lleno la lista
                       
                        lista_detalles.Add(new comisionRetenciones
                        {
                            PERIODO = datos_tabla.PERIODO,
                            PERIODO_LIBERADO = datos_tabla.PERIODO_LIBERADO,
                            CUSTNMBR = datos_tabla.CUSTNMBR,
                            CUSTNAME = datos_tabla.CUSTNAME,
                            FACTURA = datos_tabla.FACTURA,

                            DATE_FACTURA = datos_tabla.DATE_FACTURA,

                            DATE_ENVIO = datos_tabla.DATE_ENVIO,
                            DATESYS = datos_tabla.DATESYS,
                            DATE_LIBERA = datos_tabla.DATE_LIBERA,
                            DATE_PAGO = datos_tabla.DATE_PAGO,

                            MONTO_FACTURA = datos_tabla.MONTO_FACTURA,
                            MONTO_RETENIDO = datos_tabla.MONTO_RETENIDO,
                            RETENER = datos_tabla.RETENER,

                            ACTIVO = datos_tabla.ACTIVO
                        });
                    }
                }

                var periodos = db.com_configPeriodos.Where(p => p.Activo == true && p.Periodo == periodoInt && p.idVendedor == codigoVendedor).ToList();

                return Json(new { lista_detalles, periodos });

            }
            catch (Exception ex)
            {
                return Json(new { error = true, msg = "Ocurrio un error al recuperar el reporte: " + ex.Message });
            }

        }

        // POST: Periodos/obtenerReporteEquipos/
        [HttpPost]
        public ActionResult obtenerReporteEquipos(string numPeriodo, string anioPeriodo, string codigoVendedor, string idEmpresa)
        {
            string periodo = "";
            if (anioPeriodo.Length == 4)
            {
                periodo = numPeriodo.Trim() + anioPeriodo.Substring(2, 2).Trim();
            }
            else
            {
                periodo = numPeriodo.Trim() + anioPeriodo.Substring(3, 2).Trim();
            }
            int periodoInt = Convert.ToInt32(periodo);

            //codigoVendedor = "AGV003         ";
            var empresas = db.com_empresas.Select(p => p).Where(p => p.boolActivo == true).ToList();

            int claveEmpresa = Convert.ToInt32(idEmpresa);
            string spEjecutar = "csp_resumenComisionesEquipo";
            string spEjecutarResumen = "csp_resumenComisionesEquipoPie";

            if (claveEmpresa == 0)
            {
                claveEmpresa = 1;
                spEjecutar = "csp_resumenComisionesEquipoTodas";
                spEjecutarResumen = "csp_resumenComisionesEquipoPieTodas";
            }

            string strCadenaEmpresa = Utilidades.Utilidades.mtdRecuperaCadenaConexion(claveEmpresa);

            List<comisionesEquipo> lista_equipos = new List<comisionesEquipo>();
            comisionesEquipoPie pieComisiones = new comisionesEquipoPie();
            try
            {

                var Parameter1 = new SqlParameter
                {
                    ParameterName = "idVendedor",
                    Value = codigoVendedor
                };

                var Parameter2 = new SqlParameter
                {
                    ParameterName = "Periodo",
                    Value = periodo
                };

                var Parameter3 = new SqlParameter
                {
                    ParameterName = "idVendedor",
                    Value = codigoVendedor
                };

                var Parameter4 = new SqlParameter
                {
                    ParameterName = "Periodo",
                    Value = periodo
                };

                using (var ctx = new ELIEntities(strCadenaEmpresa))

                {
                    var query = ctx.Database.SqlQuery<comisionesEquipo>("exec " + spEjecutar + " @idVendedor, @Periodo", Parameter1, Parameter2).ToList();

                    foreach (comisionesEquipo datos_tabla in query)
                    {//lleno la lista
                        lista_equipos.Add(new comisionesEquipo
                        {
                            MONTO = decimal.Parse(datos_tabla.MONTO.ToString()),
                            EQUIPO = datos_tabla.EQUIPO.ToString()

                        });
                    }

                    var queryPie = ctx.Database.SqlQuery<comisionesEquipoPie>("exec " + spEjecutarResumen + " @idVendedor, @Periodo", Parameter3, Parameter4).ToList();

                    foreach (comisionesEquipoPie datos_tabla in queryPie)
                    {
                        pieComisiones = datos_tabla;
                    }
                }

                var periodos = db.com_configPeriodos.Where(p => p.Activo == true && p.Periodo == periodoInt && p.idVendedor == codigoVendedor).ToList();

                return Json(new { lista_equipos, pieComisiones, periodos });

            }
            catch (Exception ex)
            {
                return Json(new { error = true, msg = "Ocurrio un error al recuperar el reporte: " + ex.Message });
            }
        }

        



    }
}
