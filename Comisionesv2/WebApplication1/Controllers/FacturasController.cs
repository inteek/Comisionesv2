using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using OneCoreData;
using Newtonsoft.Json;
using Comisiones.Models;
using WebApplication1.Models;
using System.Data.SqlClient;
using System.Threading.Tasks;
using System.Net;
using System.Net.Mime;

namespace WebApplication1.Controllers
{
    public class FacturasController : Controller
    {


        private COMISIONESEntities db = new COMISIONESEntities();

        // GET: Facturas
        /// <summary>
        /// Se ejecuta cuando se selecciona la opción 
        /// </summary>
        /// <returns></returns>
        public ActionResult LiberarComisiones()
        {
            if (Session["RolID"] == null)
            {
                return View("~/Views/Home/Login.cshtml");
            }
            else
            {
                List<SelectListItem> newList = new List<SelectListItem>();

                SelectListItem ListaItemPeriodos = new SelectListItem();

                SelectListItem ListaItemsPeriodos = new SelectListItem();
                for (int i = 0; i < 99; i++)
                {
                    string texto = (i + 1).ToString() + " - " + DateTime.Now.Year;
                    string valor = (i + 1).ToString() + DateTime.Now.Year.ToString().Substring(2, 2); ;
                    ListaItemsPeriodos = new SelectListItem { Text = texto, Value = valor };
                    newList.Add(ListaItemsPeriodos);
                }

                List<SelectListItem> ListaEmpresas = new List<SelectListItem>();

                ViewBag.BagPeriodos = new SelectList(newList, "Value", "Text");

                return View(ObtenerVendedores());
            }
            
        }

        [HttpGet, ActionName("ObtenerComisiones")]
        public ActionResult ObtenerComisiones(string vendedor, int periodo, int tipo)
        {
            if (Session["RolID"] == null)
            {
                return View("~/Views/Home/Login.cshtml");
            }
            else
            {
                try
                {
                    using (COMISIONESEntities dataBase = new COMISIONESEntities())
                    {
                        var facturas = (from f in dataBase.SP_COMISIONES_CONSULTAR_FACTURAS_COMISIONABLES(vendedor, periodo, tipo)
                                        select new SP_COMISIONES_CONSULTAR_FACTURAS_COMISIONABLES_Result()
                                        {
                                            Empresa = f.Empresa,
                                            TIPO_REPORTE = f.TIPO_REPORTE,
                                            NOMBRE = f.NOMBRE,
                                            PERIODO = f.PERIODO,
                                            SOPNUMBE = f.SOPNUMBE,
                                            DATEENVIO = f.DATEENVIO,
                                            DATEPAGO = f.DATEPAGO,
                                            DIAS = f.DIAS,
                                            CUSTNMBR = f.CUSTNMBR,
                                            CUSTNAME = f.CUSTNAME,
                                            ITEMNMBR = f.ITEMNMBR,
                                            GRPNM = f.GRPNM,
                                            COMISION = f.COMISION,
                                            ID = f.ID,
                                            IdVendedor = f.IdVendedor
                                        }).ToList();
                        return PartialView(facturas);
                    }
                }
                catch (Exception ex)
                {
                    return PartialView(new List<SP_COMISIONES_CONSULTAR_FACTURAS_COMISIONABLES_Result>());
                    //return new List<SP_COMISIONES_CONSULTAR_FACTURAS_COMISIONABLES_Result>();
                }

            }
        }


        /// <summary>
        /// Retorna una vista parcial con la tabla de facturas retenidas que se obtienen de acuerdo al vendedor y periodo seleccionados
        /// </summary>
        /// <param name="idVendedor"></param>
        /// <param name="periodo"></param>
        /// <returns>vista parcial ObtenerRetenciones</returns>
        [HttpGet, ActionName("ObtenerRetenciones")]
        public ActionResult ObtenerRetenciones(string idVendedor, int periodo)
        {
            try
            {
                using (COMISIONESEntities dataBase = new COMISIONESEntities())
                {
                    var facturasRetenidas2 = (from p in dataBase.SP_COMISIONES_CONSULTAR_FACTURAS_RETENIDAS(idVendedor, periodo)
                                              select new SP_COMISIONES_CONSULTAR_FACTURAS_RETENIDAS_Result()
                                              {
                                                  EMPRESA = p.EMPRESA,
                                                  ID_RETENCION = p.ID_RETENCION,
                                                  PERIODO = p.PERIODO,
                                                  SLPRSNID = p.SLPRSNID,
                                                  NOMBRE = p.NOMBRE,
                                                  CUSTNMBR = p.CUSTNMBR,
                                                  CUSTNAME = p.CUSTNAME,
                                                  FACTURA = p.FACTURA,
                                                  DATE_PAGO = p.DATE_PAGO,
                                                  DATE_FACTURA = p.DATE_FACTURA,
                                                  DATE_ENVIO = p.DATE_ENVIO,
                                                  MONTO_FACTURA = p.MONTO_FACTURA,
                                                  MONTO_RETENIDO = p.MONTO_RETENIDO,
                                                  RETENER = p.RETENER,
                                                  DATESYS = p.DATESYS,
                                                  DATE_LIBERA = p.DATE_LIBERA,
                                                  ACTIVO = p.ACTIVO,
                                                  PERIODO_LIBERADO = p.PERIODO_LIBERADO
                                              }).ToList();
                    return PartialView(facturasRetenidas2);
                }
            }
            catch (Exception ex)
            {
                return PartialView(new List<SP_COMISIONES_CONSULTAR_FACTURAS_RETENIDAS_Result>());
            }
        }


        [HttpPost]
        public async Task<ActionResult> envioFacturasComisiones(string facturas)
        {
            try
            {
                using (COMISIONESEntities dataBase = new COMISIONESEntities())
                {
                    SqlParameter param1 = new SqlParameter("@Facturas", facturas);
                    var Query = await dataBase.Database.SqlQuery<string>("SP_COMISIONES_LIBERAR_COMISION @Facturas", param1).ToListAsync();

                    string[] words = facturas.Split(',');
                    
                    string facturaHistorico = "";
                    for(int i = 0; i < words.Count(); i++)
                    {
                        string[] facts = words[i].Split('-');
                        for (int y = 0; y < facts.Count(); y++)
                        {
                            if (y == 2)
                            {
                                facturaHistorico = facturaHistorico + facts[y] + ",";
                            }
                        }
                    }
                    facturaHistorico = facturaHistorico.Remove(facturaHistorico.Length - 1);
                    Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Proceso", "Liberarar Comisiones", "Comisiones liberadas de las siguientes facturas: " + facturaHistorico);
                    //var facturas = (from f in dataBase.SP_COMISIONES_LIBERAR_COMISION("").Select();
                }

                return Json(new { error = false, msg = "Comisiones liberadas correctamente" });

            }
            catch (Exception ex)
            {
                return Json(new { error = true, msg = ex.Message });
                // return PartialView(new List<SP_COMISIONES_CONSULTAR_FACTURAS_COMISIONABLES_Result>());
                //return new List<SP_COMISIONES_CONSULTAR_FACTURAS_COMISIONABLES_Result>();
            }
        }

        [HttpPost]
        public async Task<ActionResult> envioFacturasRetenciones(string facturas, string retenidas)
        {
            try
            {
                using (COMISIONESEntities dataBase = new COMISIONESEntities())
                {
                    SqlParameter param1 = new SqlParameter("@Facturas", facturas);
                    SqlParameter param2 = new SqlParameter("@NOTA", "");
                    var Query = await dataBase.Database.SqlQuery<string>("SP_COMISIONES_LIBERAR_FACTURA_RETENIDA @Facturas,@NOTA", param1, param2).ToListAsync();

                    string[] words = retenidas.Split(',');
                    string facturaHistorico = "";
                    for (int i = 0; i < words.Count(); i++)
                    {
                        facturaHistorico = facturaHistorico + words[i] + ",";
                    }

                    facturaHistorico = facturaHistorico.Remove(facturaHistorico.Length - 1);
                    Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Proceso", "Liberarar Comisiones", "Comisiones liberadas de las siguientes facturas: " + facturaHistorico);
                    //var facturas = (from f in dataBase.SP_COMISIONES_LIBERAR_COMISION("").Select();
                }

                return Json(new { error = false, msg = "Retenciones liberadas correctamente" });

            }
            catch (Exception ex)
            {
                return Json(new { error = true, msg = ex.Message });
                // return PartialView(new List<SP_COMISIONES_CONSULTAR_FACTURAS_COMISIONABLES_Result>());
                //return new List<SP_COMISIONES_CONSULTAR_FACTURAS_COMISIONABLES_Result>();
            }
        }

        public void LiberarComisionablesNoComisionables()
        {
            try
            {
            }
            catch(Exception ex)
            {

            }
        }



        /// <summary>
        /// Retorna la vista LiberarRetenciones y le envía una lista del modelo com_vendedores para mostrarlos en un elemento option
        /// </summary>
        /// <returns></returns>
        public ActionResult LiberarRetenciones()
        {
            if (Session["RolID"] == null)
            {
                return View("~/Views/Home/Login.cshtml");
            }
            else
            {
                if (Session["RolID"].Equals("Administrador") || Session["RolID"].Equals("Operador"))
                {
                    List<SelectListItem> newList = new List<SelectListItem>();

                    SelectListItem ListaItemPeriodos = new SelectListItem();

                    SelectListItem ListaItemsPeriodos = new SelectListItem();
                    for (int i = 0; i < 99; i++)
                    {
                        string texto = (i + 1).ToString() + " - " + DateTime.Now.Year;
                        string valor = (i + 1).ToString() + DateTime.Now.Year.ToString().Substring(2, 2); ;
                        ListaItemsPeriodos = new SelectListItem { Text = texto, Value = valor };
                        newList.Add(ListaItemsPeriodos);
                    }

                    List<SelectListItem> ListaEmpresas = new List<SelectListItem>();

                    ViewBag.BagPeriodos = new SelectList(newList, "Value", "Text");

                    return View(ObtenerVendedores());
                }
                else
                {
                    return View("~/Views/Home/Login.cshtml");
                }

            }
        }

        [HttpGet]
        public JsonResult AjaxHandlerGet()
        {
            using (COMISIONESEntities dataBase = new COMISIONESEntities())
            {
                var jsonData = (from f in dataBase.SP_COMISIONES_CONSULTAR_FACTURAS_COMISIONABLES("31", 117, 1)
                                select new SP_COMISIONES_CONSULTAR_FACTURAS_COMISIONABLES_Result()
                                {
                                    NOMBRE = f.NOMBRE
                                    //Empresa = f.Empresa,
                                    //TIPO_REPORTE = f.TIPO_REPORTE,
                                    //NOMBRE = f.NOMBRE,
                                    //PERIODO = f.PERIODO,
                                    //SOPNUMBE = f.SOPNUMBE,
                                    //DATEENVIO = f.DATEENVIO,
                                    //DATEPAGO = f.DATEPAGO,
                                    //DIAS = f.DIAS,
                                    //CUSTNMBR = f.CUSTNMBR,
                                    //CUSTNAME = f.CUSTNAME,
                                    //ITEMNMBR = f.ITEMNMBR,
                                    //GRPNM = f.GRPNM,
                                    //COMISION = f.COMISION,
                                    //ID = f.ID,
                                    //IdVendedor = f.IdVendedor
                                }).ToList();

                return Json(jsonData, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult AjaxHandler()
        {
            ComisionesLiberadas Comi = new ComisionesLiberadas();
            Comi.data.Add(new LiberaComisiones { Nombre = "1-12VEXP" });

            //using (COMISIONESEntities dataBase = new COMISIONESEntities())
            //{
            //    var facturas = (from f in dataBase.SP_COMISIONES_CONSULTAR_FACTURAS_COMISIONABLES("31", 117, 1)
            //                    select new SP_COMISIONES_CONSULTAR_FACTURAS_COMISIONABLES_Result()
            //                    {
            //                        Empresa = f.Empresa,
            //                        TIPO_REPORTE = f.TIPO_REPORTE,
            //                        NOMBRE = f.NOMBRE,
            //                        PERIODO = f.PERIODO,
            //                        SOPNUMBE = f.SOPNUMBE,
            //                        DATEENVIO = f.DATEENVIO,
            //                        DATEPAGO = f.DATEPAGO,
            //                        DIAS = f.DIAS,
            //                        CUSTNMBR = f.CUSTNMBR,
            //                        CUSTNAME = f.CUSTNAME,
            //                        ITEMNMBR = f.ITEMNMBR,
            //                        GRPNM = f.GRPNM,
            //                        COMISION = f.COMISION,
            //                        ID = f.ID,
            //                        IdVendedor = f.IdVendedor
            //                    }).ToList();

            //    Comi.data.AddRange(facturas);
            //}

            
            List<LiberaComisiones> keys = new List<LiberaComisiones>() { new LiberaComisiones { Nombre = "1-12VEXP" } };

            JsonConvert.SerializeObject(keys);

            return Json(Comi,
            JsonRequestBehavior.AllowGet);

            //return Json(new
            //{
            //    aadata = new List<string[]>() {
            //        new string[] {"1", "Microsoft", "Redmond"},
            //        new string[] {"2", "Google", "Mountain View"},
            //        new string[] {"3", "Gowi", "Pancevo"}
            //        }
            //},
            //JsonRequestBehavior.AllowGet);
        }


        public JsonResult DataHandler(DTParameters param, string idVendedor, int periodo, int comisionar)
        {
            try
            {
                //List<SP_COMISIONES_CONSULTAR_FACTURAS_COMISIONABLES_Result> comi = new List<SP_COMISIONES_CONSULTAR_FACTURAS_COMISIONABLES_Result>();
                ////comi.Add(new LiberaComisiones { Nombre = "1-12VEXP" });
                
                //using (COMISIONESEntities dataBase = new COMISIONESEntities())
                //{
                //    var facturas = (from f in dataBase.SP_COMISIONES_CONSULTAR_FACTURAS_COMISIONABLES("31", 117, 1)
                //                    select new SP_COMISIONES_CONSULTAR_FACTURAS_COMISIONABLES_Result()
                //                    {
                //                        Empresa = f.Empresa,
                //                        TIPO_REPORTE = f.TIPO_REPORTE,
                //                        NOMBRE = f.NOMBRE,
                //                        PERIODO = f.PERIODO,
                //                        SOPNUMBE = f.SOPNUMBE,
                //                        DATEENVIO = f.DATEENVIO,
                //                        DATEPAGO = f.DATEPAGO,
                //                        DIAS = f.DIAS,
                //                        CUSTNMBR = f.CUSTNMBR,
                //                        CUSTNAME = f.CUSTNAME,
                //                        ITEMNMBR = f.ITEMNMBR,
                //                        GRPNM = f.GRPNM,
                //                        COMISION = f.COMISION,
                //                        ID = f.ID,
                //                        IdVendedor = f.IdVendedor
                //                    }).ToList();

                //    comi.AddRange(facturas);
                //}

                var dtsource = new List<facturasComisionables>();
                using (COMISIONESEntities dataBase = new COMISIONESEntities())
                {
                    //dtsource = (from f in dataBase.SP_COMISIONES_CONSULTAR_FACTURAS_COMISIONABLES("31", 117, 1)
                    //            select new SP_COMISIONES_CONSULTAR_FACTURAS_COMISIONABLES_Result()
                    //            {
                    //                Empresa = f.Empresa,
                    //                TIPO_REPORTE = f.TIPO_REPORTE,
                    //                NOMBRE = f.NOMBRE,
                    //                PERIODO = f.PERIODO,
                    //                SOPNUMBE = f.SOPNUMBE,
                    //                DATEENVIO = f.DATEENVIO,
                    //                DATEPAGO = f.DATEPAGO,
                    //                DIAS = f.DIAS,
                    //                CUSTNMBR = f.CUSTNMBR,
                    //                CUSTNAME = f.CUSTNAME,
                    //                ITEMNMBR = f.ITEMNMBR,
                    //                GRPNM = f.GRPNM,
                    //                COMISION = f.COMISION,
                    //                ID = f.ID,
                    //                IdVendedor = f.IdVendedor
                    //            }).ToList();


                    var query = dataBase.SP_COMISIONES_CONSULTAR_FACTURAS_COMISIONABLES(idVendedor, periodo, comisionar);
                        //ctx.Database.SqlQuery<comisionesCliente>("exec " + spEjecutar + " @idVendedor, @Periodo, @fechaInicio, @fechaFin", Parameter1, Parameter2, Parameter3, Parameter4).ToList();

                    foreach (SP_COMISIONES_CONSULTAR_FACTURAS_COMISIONABLES_Result datos_tabla in query)
                    {//lleno la lista
                        dtsource.Add(new facturasComisionables
                        {
                            Empresa = datos_tabla.Empresa,
                            TIPO_REPORTE = datos_tabla.TIPO_REPORTE,
                            NOMBRE = datos_tabla.NOMBRE,
                            PERIODO = datos_tabla.PERIODO,
                            SOPNUMBE = datos_tabla.SOPNUMBE,
                            DATEENVIO = String.Format("{0:dd/MM/yyyy}", datos_tabla.DATEENVIO),
                            DATEPAGO = String.Format("{0:dd/MM/yyyy}", datos_tabla.DATEPAGO),
                            DIAS = datos_tabla.DIAS,
                            CUSTNMBR = datos_tabla.CUSTNMBR,
                            CUSTNAME = datos_tabla.CUSTNAME,
                            ITEMNMBR = datos_tabla.ITEMNMBR,
                            GRPNM = datos_tabla.GRPNM,
                            COMISION = datos_tabla.COMISION,
                            ID = datos_tabla.ID,
                            IdVendedor = datos_tabla.IdVendedor

                        });
                    }
                }

                List<String> columnSearch = new List<string>();

                foreach (var col in param.Columns)
                {
                    columnSearch.Add(col.Search.Value);
                }

                List<facturasComisionables> data = new ResultSet().GetResult(param.Search.Value, param.SortOrder, param.Start, param.Length, dtsource, columnSearch);
                int count = new ResultSet().Count(param.Search.Value, dtsource, columnSearch);
                
                DTResult<facturasComisionables> result = new DTResult<facturasComisionables>
                {
                    draw = param.Draw,
                    data = data,
                    recordsFiltered = count,
                    recordsTotal = count
                };
                return Json(result);
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Ejecuta el stored procedure SP_COMISIONES_LIBERAR_FACTURA_RETENIDA para liberar las facturas retenidas. Recibe un array desde el cliente con elementos de triadas idVendedor, periodo y factura. Cada triada es concatenada para formar una cadena separada por guiones. Finalmente, las cadenas compuestas son concatenadas en una sóla cadena que separa cada trada por comas para mandarla al stored procedure.
        /// </summary>
        /// <param name="idVendedor"></param>
        /// <param name="periodo"></param>
        /// <param name="factura"></param>
        [HttpPost, ActionName("LiberarFacturasRetenidas")]
        public void LiberarRetenidas(string idVendedor, string periodo, int factura)
        {
            try
            {
                using (COMISIONESEntities dataBase = new COMISIONESEntities())
                {
                    //var result = dataBase.SP_COMISIONES_LIBERAR_FACTURA_RETENIDA(idVendedor, int.Parse(periodo), retenida.ToString());
                }
            }
            catch (Exception ex)
            {

            }
        }



        /// <summary>
        /// Obtiene una lista del modelo com_vendedores de la base de datos COMISIONES
        /// </summary>
        /// <returns>List<com_vendedores></returns>
        private IList<com_vendedores> ObtenerVendedores()
        {
            try
            {
                List<com_vendedores> listaVendedores;
                using (COMISIONESEntities dataBase = new COMISIONESEntities())
                {
                    listaVendedores = dataBase.com_vendedores.ToList();
                }
                return listaVendedores;
            }
            catch (Exception ex)
            {
                return new List<com_vendedores>();
            }
        }



        //[HttpPost]
        //public ActionResult LiberarFacturasRetenidas(string facturas, string notaFacturasRetenidas)
        //{
        //    try
        //    {
        //        if (Session["RolID"] == null)
        //        {
        //            return View("~/Views/Home/Login.cshtml");
        //        }
        //        else
        //        {
        //            if (Session["RolID"].Equals("Administrador"))
        //            {
        //                var response = db.SP_COMISIONES_LIBERAR_FACTURA_RETENIDA(facturas, notaFacturasRetenidas).ToList();

        //                if (response.Count > 0)
        //                {
        //                    return Json(new { error = false, msg = response[0].ToString() });
        //                }
        //                else
        //                {
        //                    return Json(new { error = true, msg = "No se han podido liberar las facturas seleccionadas" });
        //                }
        //            }
        //            else
        //            {
        //                return Json(new { error = true, msg = "No se tienen los suficientes permisos para liberar facturas, contacte con el administrador" });
        //            }

        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        return Json(new { error = true, msg = e.Message });
        //    }
        //}


        //[HttpPost]
        //public ActionResult LiberarFacturaComisionable(string facturas)
        //{
        //    try
        //    {
        //        if (Session["RolID"] == null)
        //        {
        //            return View("~/Views/Home/Login.cshtml");
        //        }
        //        else
        //        {
        //            if (Session["RolID"].Equals("Administrador"))
        //            {
        //                var response = db.SP_COMISIONES_LIBERAR_COMISION(facturas).ToList();

        //                if (response.Count > 0)
        //                {
        //                    return Json(new { error = false, msg = response[0].ToString() });
        //                }
        //                else
        //                {
        //                    return Json(new { error = true, msg = "No se han podido liberar las facturas seleccionadas" });
        //                }
        //            }
        //            else
        //            {
        //                return Json(new { error = true, msg = "No se tienen los suficientes permisos para liberar facturas, contacte con el administrador" });
        //            }

        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        return Json(new { error = true, msg = e.Message });
        //    }
        //}
    }
}