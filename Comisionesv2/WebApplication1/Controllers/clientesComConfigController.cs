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
    public class clientesComConfigController : Controller
    {
        private COMISIONESEntities db = new COMISIONESEntities();
        private ELIEntities dbELI = new ELIEntities();

        // GET: clientesComConfig
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
                    var com_clientesComConfig = db.com_clientesComConfig.Where(p => p.boolActivo == true).Include(c => c.com_empresas).Include(c => c.com_vendedores);

                    return View(com_clientesComConfig.ToList());
                }
                else
                {
                    return View("~/Views/Home/Login.cshtml");
                }
            }
        }

        public ActionResult IndexPrueba()
        {
            return View();
        }

        // GET: clientesComConfig/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            com_clientesComConfig com_clientesComConfig = db.com_clientesComConfig.Find(id);
            if (com_clientesComConfig == null)
            {
                return HttpNotFound();
            }
            return View(com_clientesComConfig);
        }
        
        
        // GET: clientesComConfig/Create
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
                    ViewBag.IdEmpresa = new SelectList(db.com_empresas, "IdEmpresa", "strNombreEmpresa");
                    ViewBag.idCodigoVendedor = new SelectList(ListaPersonalizadaVendedores(), "Value", "Text");// new SelectList(db.com_vendedores.Where(p => p.boolActivo == true), "idCodigoVendedor", "strNombre");
                    ViewBag.hdnRolID = Session["RolID"].ToString();
                    return View();
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

        public ActionResult getAduanas(string id_empresa)
        {
            string strCadenaEmpresa = "";

            List<AA140210> mtdListarPorEmpresa;

            strCadenaEmpresa = Utilidades.Utilidades.mtdRecuperaCadenaConexion(Convert.ToInt32(id_empresa));

            try
            {
                using (var ctx = new ELIEntities(strCadenaEmpresa))
                {
                    mtdListarPorEmpresa = ctx.AA140210.ToList();
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex.ToString());
                throw new Exception("Error al obtener la lista", ex);
            }

            var Aduana = new SelectList(mtdListarPorEmpresa, "DEX_ROW_ID", "ConcatAduana");
            return Json(new { error = false, Aduana = Aduana }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getPedimentos(string id_empresa)
        {
            string strCadenaEmpresa = "";

            List<CATCLAVE_PEDIMENTO> mtdListarPorEmpresa;

            strCadenaEmpresa = Utilidades.Utilidades.mtdRecuperaCadenaConexion(Convert.ToInt32(id_empresa));

            try
            {
                using (var ctx = new ELIEntities(strCadenaEmpresa))
                {
                    mtdListarPorEmpresa = ctx.CATCLAVE_PEDIMENTO.ToList();
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex.ToString());
                throw new Exception("Error al obtener la lista", ex);
            }

            var Pedimentos = new SelectList(mtdListarPorEmpresa, "Id_ClavePedimento", "ConcatPedimento");
            return Json(new { error = false, Pedimentos = Pedimentos }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getConceptos(string id_empresa)
        {
            string strCadenaEmpresa = "";

            List<AA710410> mtdListarPorEmpresa;

            strCadenaEmpresa = Utilidades.Utilidades.mtdRecuperaCadenaConexion(Convert.ToInt32(id_empresa));

            try
            {
                using (var ctx = new ELIEntities(strCadenaEmpresa))
                {
                    mtdListarPorEmpresa = ctx.AA710410.ToList();
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex.ToString());
                throw new Exception("Error al obtener la lista", ex);
            }

            var Conceptos = new SelectList(ListaPersonalizadaConceptos(strCadenaEmpresa), "Value", "Text");
            return Json(new { error = false, Conceptos = Conceptos }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "idClienteConfig,IdEmpresa,idCliente,strNombreCliente,idClientePedimento,strNombreClientePedimento,idCodigoVendedor,idAduana,strNombreAduana,strTipoOp,idPedimento,intDiasCredito,intDiasRetencion,intDiasGracia,strTipoCosto,strIntercia,strNotificacion, dDescuentoFijo, strTipoCambio,com_relConceptoVendedor,boolActivo,dtFechaAlta,dtFechaModifica,idUsuarioAlta,idUsuarioModifica")] com_clientesComConfig com_clientesComConfig)
        {
            string[] strValoresCorreo;
            Utils.Pie_tabla utils = new Utils.Pie_tabla();
            
            try
            {
                var existeConfiguracionCliente = db.com_clientesComConfig.Select(p => p).Where(p => p.boolActivo == true && p.idCliente.Equals(com_clientesComConfig.idCliente) && p.idClientePedimento.Equals(com_clientesComConfig.idClientePedimento) && p.IdEmpresa == com_clientesComConfig.IdEmpresa && p.idCodigoVendedor == com_clientesComConfig.idCodigoVendedor).FirstOrDefault();
                if(existeConfiguracionCliente == null)
                {
                    if (ModelState.IsValid)
                    {
                        com_clientesComConfig.boolActivo = true;
                        com_clientesComConfig.dtFechaModifica = null;
                        com_clientesComConfig.dtFechaAlta = utils.f_actual;
                        com_clientesComConfig.idUsuarioModifica = null;
                        com_clientesComConfig.idUsuarioAlta = utils.IDusuario;
                        com_clientesComConfig.strTipoCosto = com_clientesComConfig.com_relConceptoVendedor.ObtieneTiposOperacionConceptos();
                        string[] aduanas = com_clientesComConfig.strNombreAduana.Split('|');

                        com_clientesComConfig.strNombreAduana = aduanas[0].ToString();
                        if (com_clientesComConfig.strNotificacion == null)
                        {
                            com_clientesComConfig.strNotificacion = "";
                        }

                        string[] pedimentos = com_clientesComConfig.idPedimento.Split('|');

                        com_clientesComConfig.idPedimento = pedimentos[0].ToString();

                        string strClaves = "";
                        string[] idsPedimento = pedimentos[0].ToString().Split(',');
                        foreach(string idPedimento in idsPedimento)
                        {
                            int intIdPedimento = Convert.ToInt32(idPedimento);
                            string clavePedimento = dbELI.CATCLAVE_PEDIMENTO.Where(p => p.Id_ClavePedimento == intIdPedimento).Select(p => p.Clave).FirstOrDefault();
                            strClaves = strClaves + clavePedimento + ",";
                        }
                        strClaves = strClaves.Remove(strClaves.Length - 1);

                        if (com_clientesComConfig.idClientePedimento == null)
                        {
                            com_clientesComConfig.idClientePedimento = com_clientesComConfig.idCliente;
                            com_clientesComConfig.strNombreClientePedimento = com_clientesComConfig.strNombreCliente;
                        }

                        com_clientesComConfig.strClavePedimento = strClaves;
                        db.com_clientesComConfig.Add(com_clientesComConfig);
                        db.SaveChanges();
                        
                        var empresaActual = db.com_clientesComConfig
                          .Where(p => p.idClienteConfig == com_clientesComConfig.idClienteConfig)
                          .Include(e => e.com_empresas)
                          .Select(e => new
                          {
                              e.com_empresas.strNombreEmpresa
                          })
                          .SingleOrDefault();

                        var vendedores = db.com_vendedores.Where(p => p.idCodigoVendedor == com_clientesComConfig.idCodigoVendedor).Select(x => new SelectListItem
                        {
                            Value = x.idCodigoVendedor.ToString(),
                            Text = x.strNombre.Trim() + " " + x.strApellidoP.Trim() + " " + x.strApellidoM.Trim()
                        });

                        string strCuerpo = Utilidades.Utilidades.mtdCreaCuerpoAltaCliente(out strValoresCorreo, empresaActual.strNombreEmpresa, com_clientesComConfig.strNombreCliente, vendedores.FirstOrDefault().Text, aduanas[1].ToString(), com_clientesComConfig.strTipoOp, pedimentos[1].ToString(), com_clientesComConfig.intDiasCredito.ToString(), com_clientesComConfig.intDiasRetencion.ToString(), com_clientesComConfig.strTipoCosto, com_clientesComConfig.strIntercia, com_clientesComConfig.intDiasGracia.ToString(), com_clientesComConfig.strNotificacion, com_clientesComConfig.idClienteConfig.ToString(), com_clientesComConfig.com_relConceptoVendedor);

                        string RespuestaCorreo = CorreoCDO.mtdEnvioCorreo(com_clientesComConfig.strNotificacion, "Notificación de nuevo de cliente para Comisiones", strValoresCorreo);

                        if (RespuestaCorreo.Equals(""))
                        {
                            Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Proceso", "Clientes", "Alta de configuración cliente: " + com_clientesComConfig.strNombreCliente);
                            return Json(new { error = false, msg = "El registro se agrego de forma correcta y se envio la notificación de la operación." });
                        }
                        else
                        {
                            Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Proceso", "Clientes", "Alta de configuración cliente, error de notificación: " + com_clientesComConfig.strNombreCliente);
                            return Json(new { error = true, msg = "El registro se agrego de forma correcta, pero ocurrio un error al enviar la notificación" });
                        }


                    }
                    var msgs = string.Join(" | ", ModelState.Values
                              .SelectMany(v => v.Errors)
                              .Select(e => e.ErrorMessage));

                    return Json(new { error = true, msg = msgs });
                }
                else
                {
                    return Json(new { error = true, msg = "Ya existe una configuración para este cliente en esta empresa, seleccione algún otro o modifiquelo" });
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

        // GET: clientesComConfig/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            com_clientesComConfig com_clientesComConfig = db.com_clientesComConfig.Find(id);

            ViewBag.IdEmpresa = new SelectList(db.com_empresas, "IdEmpresa", "strNombreEmpresa");
            ViewBag.idCodigoVendedor = new SelectList(db.com_vendedores, "idCodigoVendedor", "strNombre");

            // Optimizar esta parte reusando metodos existentes
            string strCadenaEmpresa = "";

            List<AA710410> mtdListarPorEmpresaConceptos;
            List<RM00101> mtdListarPorEmpresaClientes;
            List<AA140210> mtdListarPorEmpresaAduanas;
            List<CATCLAVE_PEDIMENTO> mtdListarPorEmpresaPedimentos;

            strCadenaEmpresa = Utilidades.Utilidades.mtdRecuperaCadenaConexion(Convert.ToInt32(com_clientesComConfig.IdEmpresa));

            using (var ctx = new ELIEntities(strCadenaEmpresa))
            {
                mtdListarPorEmpresaConceptos = ctx.AA710410.ToList();
                mtdListarPorEmpresaClientes = ctx.RM00101.ToList();
                mtdListarPorEmpresaAduanas = ctx.AA140210.ToList();
            }
            
            using (var ctx = new ELIEntities(Utilidades.Utilidades.mtdRecuperaCadenaConexion(1)))
            {
                mtdListarPorEmpresaPedimentos = ctx.CATCLAVE_PEDIMENTO.ToList();
            }
            
            ViewBag.BagConceptos = new SelectList(ListaPersonalizadaConceptos(strCadenaEmpresa), "Value", "Text");
            ViewBag.BagClientes = new SelectList(ListaPersonalizadaClientes(strCadenaEmpresa), "Value", "Text");
            ViewBag.BagAduanas = new SelectList(mtdListarPorEmpresaAduanas, "DEX_ROW_ID", "ConcatAduana");
            ViewBag.BagPedimentos = new SelectList(mtdListarPorEmpresaPedimentos, "Id_ClavePedimento", "ConcatPedimento");
            ViewBag.BagidDiasCredito = com_clientesComConfig.intDiasCredito;
            ViewBag.BagidDiasGracia = com_clientesComConfig.intDiasGracia;
            ViewBag.BagidDiasRetencion = com_clientesComConfig.intDiasRetencion;
            ViewBag.BagstrTipoCosto = com_clientesComConfig.strTipoCosto;
            //ViewBag.BagdDescuentoFijo = com_clientesComConfig.dDescuentoFijo;

            ViewBag.hdnRolID = Session["RolID"].ToString();
            if (com_clientesComConfig == null)
            {
                return HttpNotFound();
            }



            return View(com_clientesComConfig);
        }

        public SelectList ListaPersonalizadaClientes(string strCadenaEmpresa)
        {
            ELIEntities dbContext = new ELIEntities(strCadenaEmpresa);
            var clientes = dbContext.RM00101.Select(x => new SelectListItem
            {
                Value = x.CUSTNMBR.Trim(),
                Text = "[" + x.CUSTNMBR.Trim() + "]" + " " + x.CUSTNAME.Trim()
            });
            return new SelectList(clientes, "Value", "Text");
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

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "idClienteConfig,IdEmpresa,idCliente,strNombreCliente,idClientePedimento,strNombreClientePedimento,idCodigoVendedor,idAduana,strNombreAduana,strTipoOp,idPedimento,intDiasCredito,intDiasRetencion,intDiasGracia,strTipoCosto,strIntercia,strNotificacion, dDescuentoFijo, strTipoCambio ,com_relConceptoVendedor,dtFechaModifica,idUsuarioModifica")] com_clientesComConfig com_clientesComConfig)
        {
            if (Session["UserID"] == null)
            {
                return View("~/Views/Home/Login.cshtml");
            }
            else
            {
                string[] strValoresCorreo = new string[3];
                Utils.Pie_tabla utils = new Utils.Pie_tabla();
                bool mismoCliente = false;
                string OldEmpresa, OldCliente, OldClientePedimento, OldVendedor, OldAduana, OldOperacion, OldPedimento, OldDiasCredito, OldDiasRetencion, OldDiasGracia, OldTipoCosto, OldIntercia, OldNotificacion, OldTipoCambio = "";
                
                try
                {
                    var registroAnterior = db.com_clientesComConfig.Select(p => p).Where(p => p.idClienteConfig == com_clientesComConfig.idClienteConfig).FirstOrDefault();
                    if (registroAnterior.idCliente.Equals(com_clientesComConfig.idCliente))
                    {
                        mismoCliente = true;
                    }
                    var existeConfiguracionCliente = db.com_clientesComConfig.Select(p => p).Where(p => p.boolActivo == true && p.idCliente.Equals(com_clientesComConfig.idCliente) && p.IdEmpresa == com_clientesComConfig.IdEmpresa && p.idCodigoVendedor == com_clientesComConfig.idCodigoVendedor).FirstOrDefault();
                    if (existeConfiguracionCliente == null || mismoCliente == true)
                    {
                        if (ModelState.IsValid)
                        {
                            //Recuperar datos anteriores
                            var ClienteOriginal = db.com_clientesComConfig.Find(com_clientesComConfig.idClienteConfig);
                            OldEmpresa = ClienteOriginal.com_empresas.strNombreEmpresa;
                            OldCliente = ClienteOriginal.strNombreCliente;
                            OldClientePedimento = ClienteOriginal.strNombreClientePedimento;
                            OldVendedor = ClienteOriginal.idCodigoVendedor.ToString();
                            OldAduana = AuxClientes.ObtieneAduanasAnteriores(ClienteOriginal.com_empresas.strNombreEmpresa, ClienteOriginal.strNombreAduana);  // ClienteOriginal.strNombreAduana;
                            OldOperacion = ClienteOriginal.strTipoOp;
                            OldPedimento = AuxClientes.ObtienePedimentosAnteriores(ClienteOriginal.idPedimento);// ClienteOriginal.idPedimento;
                            OldDiasCredito = ClienteOriginal.intDiasCredito.ToString();
                            OldDiasRetencion = ClienteOriginal.intDiasRetencion.ToString();
                            OldDiasGracia = ClienteOriginal.intDiasGracia.ToString();
                            OldTipoCosto = ClienteOriginal.strTipoCosto;
                            OldIntercia = ClienteOriginal.strIntercia;
                            OldNotificacion = ClienteOriginal.strNotificacion;
                            //OldDescuentoFijo = Convert.ToString(ClienteOriginal.dDescuentoFijo);
                            //OldTipoCambio = ClienteOriginal.strTipoCambio;


                            com_clientesComConfig.boolActivo = true;
                            com_clientesComConfig.idUsuarioAlta = ClienteOriginal.idUsuarioAlta;
                            com_clientesComConfig.dtFechaAlta = ClienteOriginal.dtFechaAlta;
                            com_clientesComConfig.dtFechaModifica = utils.f_actual;
                            com_clientesComConfig.idUsuarioModifica = utils.IDusuario;
                            com_clientesComConfig.strTipoCosto = com_clientesComConfig.com_relConceptoVendedor.ObtieneTiposOperacionConceptos();
                            string[] aduanas = com_clientesComConfig.strNombreAduana.Split('|');

                            com_clientesComConfig.strNombreAduana = aduanas[0].ToString();

                            string[] pedimentos = com_clientesComConfig.idPedimento.Split('|');

                            com_clientesComConfig.idPedimento = pedimentos[0].ToString();

                            string strClaves = "";
                            string[] idsPedimento = pedimentos[0].ToString().Split(',');
                            foreach (string idPedimento in idsPedimento)
                            {
                                int intIdPedimento = Convert.ToInt32(idPedimento);
                                string clavePedimento = dbELI.CATCLAVE_PEDIMENTO.Where(p => p.Id_ClavePedimento == intIdPedimento).Select(p => p.Clave).FirstOrDefault();
                                strClaves = strClaves + clavePedimento + ",";
                            }
                            strClaves = strClaves.Remove(strClaves.Length - 1);

                            com_clientesComConfig.strClavePedimento = strClaves;


                            if (com_clientesComConfig.idClientePedimento == null)
                            {
                                com_clientesComConfig.idClientePedimento = com_clientesComConfig.idCliente;
                                com_clientesComConfig.strNombreClientePedimento = com_clientesComConfig.strNombreCliente;
                            }



                            if (com_clientesComConfig.strNotificacion == null)
                            {
                                com_clientesComConfig.strNotificacion = "";
                            }

                            var existingParent = db.com_clientesComConfig
                                .Where(p => p.idClienteConfig == com_clientesComConfig.idClienteConfig)
                                .Include(p => p.com_relConceptoVendedor)
                                .Include(p => p.com_empresas)
                                .SingleOrDefault();

                            var empresaActual = db.com_clientesComConfig
                                .Where(p => p.idClienteConfig == com_clientesComConfig.idClienteConfig)
                                .Include(e => e.com_empresas)
                                .Select(e => new
                                {
                                    e.com_empresas.strNombreEmpresa
                                })
                                .SingleOrDefault();

                            if (existingParent != null)
                            {
                                // Update parent
                                db.Entry(existingParent).CurrentValues.SetValues(com_clientesComConfig);
                                db.SaveChanges();
                                // Delete children
                                foreach (var existingChild in existingParent.com_relConceptoVendedor.ToList())
                                {
                                    db.com_relConceptoVendedor.Remove(existingChild);
                                    db.SaveChanges();

                                }

                                foreach (com_relConceptoVendedor item in com_clientesComConfig.com_relConceptoVendedor.ToList())
                                {
                                    if (!db.com_relConceptoVendedor.Any(c => c.idRelConceptoVendedor == item.idRelConceptoVendedor))
                                    {
                                        db.com_relConceptoVendedor.Add(item);
                                        db.SaveChanges();
                                    }

                                    else
                                    {
                                        db.Entry(item).State = System.Data.Entity.EntityState.Modified;
                                        db.SaveChanges();
                                    }
                                }


                                db.SaveChanges();
                            }
                            

                            string strCuerpo = Utilidades.Utilidades.mtdCreaCuerpoModificaCliente(out strValoresCorreo, empresaActual.strNombreEmpresa, com_clientesComConfig.strNombreCliente, com_clientesComConfig.strNombreClientePedimento, com_clientesComConfig.idCodigoVendedor.ToString(), aduanas[1].ToString(), com_clientesComConfig.strTipoOp, pedimentos[1].ToString(), com_clientesComConfig.intDiasCredito.ToString(), com_clientesComConfig.intDiasRetencion.ToString(), com_clientesComConfig.intDiasGracia.ToString(), com_clientesComConfig.strTipoCosto, com_clientesComConfig.strIntercia, com_clientesComConfig.strNotificacion, com_clientesComConfig.idClienteConfig.ToString(), OldEmpresa, OldCliente, OldClientePedimento, OldVendedor, OldAduana, OldOperacion, OldPedimento, OldDiasCredito, OldDiasRetencion, OldDiasGracia, OldTipoCosto, OldIntercia, OldNotificacion, com_clientesComConfig.com_relConceptoVendedor);

                            string RespuestaCorreo = CorreoCDO.mtdEnvioCorreo(com_clientesComConfig.strNotificacion, "Notificación de modificación de cliente para Comisiones", strValoresCorreo);

                            if (RespuestaCorreo.Equals(""))
                            {
                                Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Proceso", "Clientes", "Modificación de cliente: " + com_clientesComConfig.strNombreCliente);
                                return Json(new { error = false, msg = "El registro se modificó de forma correcta y se envio la notificación de la operación." });
                            }
                            else
                            {
                                Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Proceso", "Clientes", "Modificación de cliente: " + com_clientesComConfig.strNombreCliente);
                                return Json(new { error = true, msg = "El registro se modificó de forma correcta, pero ocurrio un error al enviar la notificación" });
                            }

                        }
                        var msgs = string.Join(" | ", ModelState.Values
                                  .SelectMany(v => v.Errors)
                                  .Select(e => e.ErrorMessage));

                        return Json(new { error = true, msg = msgs });
                    }
                    else
                    {
                        return Json(new { error = true, msg = "Ya existe una configuración para este cliente en esta empresa, seleccione algún otro o modifiquelo" });
                    }
                        
                }
                catch (Exception e)
                {
                    Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Error", "Clientes", "Error al intentar modificar un cliente: " + e.Message);
                    return Json(new { error = true, msg = e.Message.ToString() });

                }
            }

            
            
        }

        // GET: clientesComConfig/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            com_clientesComConfig com_clientesComConfig = db.com_clientesComConfig.Find(id);
            if (com_clientesComConfig == null)
            {
                return HttpNotFound();
            }
            return View(com_clientesComConfig);
        }

        // POST: clientesComConfig/Delete/5
        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(int id)
        {
            try
            {
                if (Session["RolID"].Equals("Administrador"))
                {
                    string cliente = "";
                    com_clientesComConfig com_clientesComConfig = db.com_clientesComConfig.Find(id);
                    com_clientesComConfig.boolActivo = false;
                    cliente = com_clientesComConfig.strNombreCliente;
                    db.com_clientesComConfig.Attach(com_clientesComConfig);
                    db.Entry(com_clientesComConfig).Property(x => x.boolActivo).IsModified = true;
                    db.SaveChanges();

                    foreach (var concepto in com_clientesComConfig.com_relConceptoVendedor.ToList())
                    {
                        concepto.boolActivo = false;
                        db.com_relConceptoVendedor.Attach(concepto);
                        db.Entry(concepto).Property(x => x.boolActivo).IsModified = true;
                        db.SaveChanges();

                    }

                    // Guardar en la bitacora
                    Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Proceso", "Clientes", "Baja cliente: " + cliente);
                    return Json(new { error = false, msg = "El registro se elimino de forma correcta." });
                }
                else
                {
                    return Json(new { error = true, msg = "No se tienen los suficientes permisos para realizar esta acción" });
                }
            }
            catch (Exception e)
            {
                Utilidades.Utilidades.RegistrarEvento((string)(Session["UserName"]), "Error", "Clientes", "Error baja cliente " + e.Message);
                return Json(new { error = true, msg = e.Message.ToString() });
            }
            //com_clientesComConfig com_clientesComConfig = db.com_clientesComConfig.Find(id);
            //db.com_clientesComConfig.Remove(com_clientesComConfig);
            //db.SaveChanges();
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


        [HttpPost]
        [ValidateInput(false)]
        public ActionResult obtenerGP(int idEmpresa, string idCli)
        {
            string diasGP = "";
            try
            {
                
                if (idCli.Trim() != "")
                {

                    try
                    {

                        string strCadenaEmpresa = Utilidades.Utilidades.mtdRecuperaCadenaConexion(idEmpresa);
                        var Parameter1 = new SqlParameter
                        {
                            ParameterName = "idCliente",
                            Value = idCli
                        };

                        using (var ctx = new ELIEntities(strCadenaEmpresa))

                        {
                            var query = ctx.Database.SqlQuery<string>("exec csp_obtenerDiasCreditoClienteGp @idCliente", Parameter1).ToList();

                            diasGP = query[0].ToString();
                        }


                    }
                    catch (Exception e1)
                    {
                        return Json(new { error = true, msg = "Error con sp csp_obtenerDiasCreditoClienteGp" + e1.Message });
                    }
                                    if (diasGP!="")
                                    {
                                        return Json(new { error = false, msg = "", valor1 = diasGP});
                                    }
                                    else
                                    {

                        return Json(new { error = true, msg = "No fue posible obtener los días de crédito de GP", valor1 = diasGP });
                    }
                }
                else
                {
                    return Json(new { error = true, msg = "DEBE INGRESAR UN CLIENTE VÁLIDO" });
                }

            }
            catch (Exception e)
            {
                return Json(new { error = true, msg = "Catch principal:" + e.Message });
            }
        }
    }
}
