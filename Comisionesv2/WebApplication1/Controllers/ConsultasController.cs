using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using OneCoreData;
using WebApplication1.Models;
using System.Data.Entity.Validation;
using WebApplication1.Utilidades;
using System.Data.SqlClient;

namespace WebApplication1.Controllers
{
    public class ConsultasController : Controller
    {
        private COMISIONESEntities db = new COMISIONESEntities();

        // GET: Consultas
        public ActionResult Consultas()
        {
            if (Session["RolID"] == null)
            {
                return View("~/Views/Home/Login.cshtml");
            }
            else
            {
                if (Session["RolID"].Equals("Administrador") || Session["RolID"].Equals("Operador"))
                {
                    //ViewBag.IdEmpresa = new SelectList(db.com_empresas, "IdEmpresa", "strNombreEmpresa");
                    //ViewBag.idCodigoVendedor = new SelectList(db.com_vendedores.Where(p => p.boolActivo == true), "idCodigoVendedor", "strNombre");
                    //var com_clientesComConfig = db.com_clientesComConfig.Where(p => p.boolActivo == true).Include(c => c.com_empresas).Include(c => c.com_vendedores);
                    //ViewBag.hdnRolID = Session["RolID"].ToString();

                    ViewBag.BagVendedores = new SelectList(ListaPersonalizadaVendedores(), "Value", "Text");
                    List<SelectListItem> newList = new List<SelectListItem>();

                    SelectListItem ListaItemPeriodos = new SelectListItem();
                    //ListaItemPeriodos = new SelectListItem { Text = "", Value = "" };
                    //newList.Add(ListaItemPeriodos);


                    SelectListItem ListaItemsPeriodos = new SelectListItem();
                    for (int i = 0; i < 99; i++)
                    {
                        string texto = (i + 1).ToString() + " - " + DateTime.Now.Year;
                        string valor = (i + 1).ToString() + DateTime.Now.Year;
                        ListaItemsPeriodos = new SelectListItem { Text = texto, Value = valor };
                        newList.Add(ListaItemsPeriodos);
                    }

                    List<SelectListItem> ListaEmpresas = new List<SelectListItem>();

                   
                    ListaEmpresas = new SelectList(db.com_empresas, "IdEmpresa", "strNombreEmpresa").ToList();

                   

                    ViewBag.BagPeriodos = new SelectList(newList, "Value", "Text");

                    ViewBag.BagEmpresas = new SelectList(ListaEmpresas, "Value", "Text");

                    return View();
                }
                else
                {
                    return View("~/Views/Home/Login.cshtml");
                }
            }
        }

        public ActionResult GetBuscaFacturas(string stringFacturas)
        {
            //stringFacturas = stringFacturas.Replace(',', '_');
            //stringFacturas = stringFacturas.Replace(';', '_');
            try
            {
                var query = (from p in db.csp_ConsultaStatusFacturas(stringFacturas) select new FacturasStatus() { FACTURA = p.FACTURA, DOCNUMBR = p.DOCNUMBR, ESTADO = p.ESTADO, ADEUDO_DECIMAL = p.ADEUDO_DECIMAL, PERIODO_PAGADO = p.PERIODO_PAGADO, CONCEPTOS_COMISIONBLES = Convert.ToInt32(p.CONCEPTOS_COMISIONABLES), CANCELADA = p.CANCELADA, COMISIONADA = p.COMISIONADA, PERIODO = p.PERIODO, CONCEPTOS = p.CONCEPTOS, FECHA = p.FECHA}).ToList();
                if (query.Count > 0)
                {
                    ViewBag.Facturas = query;
                }
                else
                {
                    ViewBag.Facturas = null;
                }
                ViewBag.CadenaFacturas = stringFacturas;

                return View(query);
            }
            catch(Exception ex)
            {
                var a = ex;
            }
           
            
            return View();
        }

        public ActionResult DetallesComisionada(String factura, String periodo)
        {
            ViewBag.strFactura = factura;
            ViewBag.strPeriodo = periodo;
            return PartialView();
        }

        public ActionResult DetallesConceptos(String conceptos)
        {
            ViewBag.strConceptos = conceptos;
            return PartialView();
        }

        public ActionResult DetallesPagada(String pagada, String fecha, String monto)
        {
            ViewBag.strPagada = pagada;
            ViewBag.strFecha = DateTime.Parse(fecha).ToShortDateString();
            ViewBag.strMonto = monto;
            return PartialView();
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

            var Cliente = new SelectList(ListaPersonalizadaClientes(strCadenaEmpresa), "Value", "Text");
            return Json(new { error = false, Cliente = Cliente }, JsonRequestBehavior.AllowGet);
        }

        public SelectList ListaPersonalizadaClientes(string strCadenaEmpresa)
        {
            ELIEntities dbContext = new ELIEntities();
            var clientes = dbContext.RM00101.Select(x => new SelectListItem
            {
                Value = x.CUSTNMBR.Trim(),
                Text = x.CUSTNAME.Trim()
            });
            return new SelectList(clientes, "Value", "Text");
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

        // GET: Consultas/ClienteVendedor/
        [HttpGet]
        public ActionResult ClienteVendedor()
        {
            if (Session["RolID"] == null)
            {
                return View("~/Views/Home/Login.cshtml");
            }
            else
            {
                if (Session["RolID"].Equals("Administrador") || Session["RolID"].Equals("Operador"))
                {

                    return PartialView("ClienteVendedor");
                }
                else
                {
                    return View("~/Views/Home/Login.cshtml");
                }

            }
        }

        // POST: Consultas/generarCatalogoClienteVendedor/
        [HttpPost]
        public ActionResult generarCatalogoClienteVendedor(int codigoVendedor)
        {
            string spEjecutar = "csp_GeneraClienteVendedor";
            
            List<clienteVendedor> lista_vendedores = new List<clienteVendedor>();

            try
            {

                var Parameter1 = new SqlParameter
                {
                    ParameterName = "codigoVendedor",
                    Value = codigoVendedor
                };
                
                using (var ctx = new COMISIONESEntities())

                {
                    var query = ctx.Database.SqlQuery<clienteVendedor>("exec " + spEjecutar + " @codigoVendedor", Parameter1).ToList();

                    foreach (clienteVendedor datos_tabla in query)
                    {//lleno la lista
                        
                        lista_vendedores.Add(new clienteVendedor
                        {
                            idEmpresa = datos_tabla.idEmpresa,
                            idCliente = datos_tabla.idCliente,

                            strNombreCliente = datos_tabla.strNombreCliente,

                            intDiasCredito = datos_tabla.intDiasCredito,

                            intDiasRetencion = datos_tabla.intDiasRetencion,
                            intDiasGracia = datos_tabla.intDiasGracia,
                            idCodigoVendedor = datos_tabla.idCodigoVendedor,
                            nombreVendedor = datos_tabla.nombreVendedor
                        });
                    }
                }

            }
            catch (Exception ex)
            {
                Console.Write(ex.ToString());
                throw new Exception("Error al obtener la lista", ex);
            }

            return Json(new { lista_vendedores });

        }

        // GET: Consultas/ReportePeriodoAnterior/
        [HttpGet]
        public ActionResult ReportePeriodoAnterior()
        {
            if (Session["RolID"] == null)
            {
                return View("~/Views/Home/Login.cshtml");
            }
            else
            {
                if (Session["RolID"].Equals("Administrador") || Session["RolID"].Equals("Operador"))
                {

                    return PartialView("ReportePeriodoAnterior");
                }
                else
                {
                    return View("~/Views/Home/Login.cshtml");
                }

            }
        }

        // POST: Consultas/generarReporteAnterior/
        [HttpPost]
        public ActionResult generarReporteAnterior(string numPeriodo, string anioPeriodo, string codigoVendedor)
        {
            string periodo = numPeriodo.Trim() + anioPeriodo.Substring(3, 2).Trim();
            int periodoInt = Convert.ToInt32(periodo);

            //codigoVendedor = "AGV003         ";

            string spEjecutar = "csp_detalleComisionesTodas";

            List<detalleComisiones> lista_detalles = new List<detalleComisiones>();
            string strCadenaEmpresa = Utilidades.Utilidades.mtdRecuperaCadenaConexion(1);

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
                    {
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
                            ADUASECC = datos_tabla.ADUASECC.ToString(),
                            REFRENCE = datos_tabla.REFRENCE.ToString(),
                            RENDICION = datos_tabla.RENDICION.ToString(),
                            GrupoNombre = datos_tabla.GrupoNombre.ToString()
                        });
                    }
                }

                var periodos = db.com_configPeriodos.Where(p => p.Activo == true && p.Periodo == periodoInt && p.idVendedor == codigoVendedor).ToList();

                int conteo = lista_detalles.Count();

                return Json(new { lista_detalles, periodos, conteo });

            }
            catch (Exception ex)
            {
                Console.Write(ex.ToString());
                throw new Exception("Error al obtener la lista", ex);
            }

        }

        // GET: Consultas/ReporteComisionesCliente/
        [HttpGet]
        public ActionResult ReporteComisionesCliente()
        {
            if (Session["RolID"] == null)
            {
                return View("~/Views/Home/Login.cshtml");
            }
            else
            {
                if (Session["RolID"].Equals("Administrador") || Session["RolID"].Equals("Operador"))
                {

                    return PartialView("ReporteComisionesCliente");
                }
                else
                {
                    return View("~/Views/Home/Login.cshtml");
                }

            }
        }

        public ActionResult generarReporteCliente(string codigoCliente, int idEmpresa, string chkFecha, string fechaInicio, string fechaFin)
        {

            string spEjecutar = "csp_ComisionesCliente";

            List<detalleComisiones> lista_detalles = new List<detalleComisiones>();
            string strCadenaEmpresa = Utilidades.Utilidades.mtdRecuperaCadenaConexion(idEmpresa);

            if (chkFecha == "Si")
            {
                fechaInicio = "";
                fechaFin = "";
            }

            try
            {

                var Parameter1 = new SqlParameter
                {
                    ParameterName = "idCliente",
                    Value = codigoCliente
                };

                var Parameter2 = new SqlParameter
                {
                    ParameterName = "FechaInicio",
                    Value = fechaInicio
                };

                var Parameter3 = new SqlParameter
                {
                    ParameterName = "FechaFin",
                    Value = fechaFin
                };


                using (var ctx = new ELIEntities(strCadenaEmpresa))

                {
                    var query = ctx.Database.SqlQuery<detalleComisiones>("exec " + spEjecutar + " @idCliente, @FechaInicio, @FechaFin", Parameter1, Parameter2, Parameter3).ToList();

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
                            ADUASECC = datos_tabla.ADUASECC.ToString(),
                            REFRENCE = datos_tabla.REFRENCE.ToString(),
                            RENDICION = datos_tabla.RENDICION.ToString(),
                            GrupoNombre = datos_tabla.GrupoNombre.ToString()
                        });
                    }
                }

            }
            catch (Exception ex)
            {
                Console.Write(ex.ToString());
                throw new Exception("Error al obtener la lista", ex);
            }

            return Json(new { lista_detalles });

        }

        // GET: Consultas/ResumenComisionesVendedor/
        [HttpGet]
        public ActionResult ResumenComisionesVendedor()
        {
            if (Session["RolID"] == null)
            {
                return View("~/Views/Home/Login.cshtml");
            }
            else
            {
                if (Session["RolID"].Equals("Administrador") || Session["RolID"].Equals("Operador"))
                {

                    return PartialView("ResumenComisionesVendedor");
                }
                else
                {
                    return View("~/Views/Home/Login.cshtml");
                }

            }
        }
        
        // POST: Consultas/obtenerComisionesVendedor/
        [HttpPost]
        //public ActionResult obtenerComisionesVendedor(string numPeriodo, string anioPeriodo, string codigoVendedor, string fechaInicio, string fechaFin)
        public ActionResult obtenerComisionesVendedor(string codigoVendedor, string fechaInicio, string fechaFin)

        {
            string periodo = "";
            int periodoInt=0;

            //if (numPeriodo != "")
            //{
            //    periodo=numPeriodo.Trim() + anioPeriodo.Substring(3, 2).Trim();
            //    periodoInt=Convert.ToInt32(periodo);
            //}
            
            string spEjecutar = "csp_resumenComisionesVendedor";
            string spEjecutarResumen = "csp_resumenComisionesVendedorPie";

            string strCadenaEmpresa = Utilidades.Utilidades.mtdRecuperaCadenaConexion(1);

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
                    ParameterName = "fechaInicio",
                    Value = fechaInicio
                };

                var Parameter4 = new SqlParameter
                {
                    ParameterName = "fechaFin",
                    Value = fechaFin
                };

                var ParameterPie1 = new SqlParameter
                {
                    ParameterName = "idVendedor",
                    Value = codigoVendedor
                };

                var ParameterPie2 = new SqlParameter
                {
                    ParameterName = "Periodo",
                    Value = periodo
                };

                var ParameterPie3 = new SqlParameter
                {
                    ParameterName = "fechaInicio",
                    Value = fechaInicio
                };

                var ParameterPie4 = new SqlParameter
                {
                    ParameterName = "fechaFin",
                    Value = fechaFin
                };

                using (var ctx = new ELIEntities(strCadenaEmpresa))

                {
                    var query = ctx.Database.SqlQuery<comisionesCliente>("exec " + spEjecutar + " @idVendedor, @Periodo, @fechaInicio, @fechaFin", Parameter1, Parameter2, Parameter3, Parameter4).ToList();

                    foreach (comisionesCliente datos_tabla in query)
                    {//lleno la lista
                        lista_clientes.Add(new comisionesCliente
                        {
                            MONTO = decimal.Parse(datos_tabla.MONTO.ToString()),
                            CLIENTE = datos_tabla.CLIENTE.ToString()

                        });
                    }

                    var queryPie = ctx.Database.SqlQuery<comisionesClientePie>("exec " + spEjecutarResumen + " @idVendedor, @Periodo, @fechaInicio, @fechaFin", ParameterPie1, ParameterPie2, ParameterPie3, ParameterPie4).ToList();

                    foreach (comisionesClientePie datos_tabla in queryPie)
                    {
                        pieComisiones = datos_tabla;
                    }
                }

                if (periodo != "")
                {
                    fechaInicio = "---";
                    fechaFin = "---";

                    var periodos = db.com_configPeriodos.Where(p => p.Activo == true && p.Periodo == periodoInt && p.idVendedor == codigoVendedor).ToList();

                    foreach (com_configPeriodos datos_tabla in periodos)
                    {
                        fechaInicio = datos_tabla.fechaInicio.ToString();
                        fechaFin = datos_tabla.fechaFin.ToString();
                    }
                    
                    return Json(new { lista_clientes, pieComisiones, fechaInicio, fechaFin });
                }
                else
                {
                    return Json(new { lista_clientes, pieComisiones, fechaInicio, fechaFin });
                }

            }
            catch (Exception ex)
            {
                Console.Write(ex.ToString());
                throw new Exception("Error al obtener la lista", ex);
            }

            

        }
    }
}