using OneCoreData;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApplication1.Models;

namespace WebApplication1.Utilidades
{
    public class Utilidades
    {
        public static string mtdRecuperaCadenaConexion(int idEmpresa)
        {
            string strCadenaEmpresaEnc = "";
            string strCadenaEmpresaReal = "";
            try
            {
                using (var ctx = new COMISIONESEntities())
                {

                    strCadenaEmpresaEnc = (from emp in ctx.com_empresas
                                        where emp.IdEmpresa == idEmpresa
                                        select emp.strCadenaConexion).First().ToString();

                    
                }
                strCadenaEmpresaReal = Seguridad.DesEncriptarPwd(strCadenaEmpresaEnc, "comisionesApp");
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return strCadenaEmpresaReal;
        }

        public static string mtdCreaCuerpoAltaCliente(out string[] strValoresCorreo, string strNombreEmpresa, string strNombreCliente, string idCodigoVendedor, string strNombreAduana, string strTipoOp, string strPedimentos, string intDiasCredito, string intDiasRetencion, string strTipoCosto, string strIntercia, string intDiasGracia, string strNotificacion, string idClienteConfig, IEnumerable<com_relConceptoVendedor> com_conceptos)
        {
            string strCuerpoHTML = "";
            string strConceptos = "";
            Utils.Pie_tabla utils = new Utils.Pie_tabla();
            strValoresCorreo = new string[4];

            try
            {
                strValoresCorreo[0] = "El usuario " + utils.LoginUsuario + " ha agregado un nuevo cliente";

                strCuerpoHTML = "<tr><td style='font-weight: bold;'>Empresa</td><td>" + strNombreEmpresa + "</td></tr>";
                strCuerpoHTML += "<tr><td style='font-weight: bold;'>Cliente</td><td>" + strNombreCliente + "</td></tr>";
                strCuerpoHTML += "<tr><td style='font-weight: bold;'>Vendedor</td><td>" + idCodigoVendedor + "</td></tr>";
                strCuerpoHTML += "<tr><td style='font-weight: bold;'>Aduana</td><td>" + strNombreAduana + "</td></tr>";
                strCuerpoHTML += "<tr><td style='font-weight: bold;'>Tipo Op</td><td>" + strTipoOp + "</td></tr>";
                strCuerpoHTML += "<tr><td style='font-weight: bold;'>Tipo Pedimento</td><td>" + strPedimentos + "</td></tr>";
                strCuerpoHTML += "<tr><td style='font-weight: bold;'>Dias credito</td><td>" + intDiasCredito + "</td></tr>";
                strCuerpoHTML += "<tr><td style='font-weight: bold;'>Dias retencion</td><td>" + intDiasRetencion + "</td></tr>";
                strCuerpoHTML += "<tr><td style='font-weight: bold;'>Dias gracia</td><td>" + intDiasGracia + "</td></tr>";
                strCuerpoHTML += "<tr><td style='font-weight: bold;'>Tipos Comisión</td><td>" + strTipoCosto + "</td></tr>";
                strCuerpoHTML += "<tr><td style='font-weight: bold;'>Intercia</td><td>" + strIntercia + "</td></tr>";
                strCuerpoHTML += "<tr><td style='font-weight: bold;'>Notificaciones a</td><td>" + strNotificacion + "</td></tr>";

                strValoresCorreo[1] = "Se ha creado un nuevo cliente con el ID <b>" + idClienteConfig + "</b>,a continuación se muestran los datos";
                strValoresCorreo[2] = "<table class='strValues' style='border-collapse: collapse;'><thead><tr><th>LLave</th><th>Valor nuevo</th></tr></thead><tbody>" + strCuerpoHTML + "</tbody></table>";
                
                foreach (var concepto in com_conceptos.Select(p => p))
                {
                    strConceptos += "<tr><td>" + concepto.strConcepto + "</td><td>" + concepto.strCostoVenta + "</td><td>" + concepto.dcmComision + "%</td></tr>";
                }

                strValoresCorreo[3] = "<table class='strValues' style='border-collapse: collapse;'><thead><tr><th>Concepto</th><th>Tipo Comision</th><th>Porcentaje</th></tr></thead><tbody>" + strConceptos + "</tbody></table>";

            }
            catch (Exception ex)
            {

                throw ex;
            }
            return strCuerpoHTML;
        }

        public static void RegistrarEvento(string strUsuario, string strTipoEvento, string strSeccion, string strDescripcion)
        {
            try
            {
                using (COMISIONESEntities db = new COMISIONESEntities())
                {
                    com_bitacora evento = new com_bitacora();
                    evento.nombre_usuario = strUsuario;
                    evento.tipo = strTipoEvento;
                    evento.seccion = strSeccion;
                    evento.descripcion = strDescripcion;
                    evento.fecha = DateTime.Now;
                    db.com_bitacora.Add(evento);
                    var result = db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static string mtdCreaCuerpoModificaCliente(out string[] strValoresCorreo, string strNombreEmpresa, string strNombreCliente, string strNombreClientePedimento, string idCodigoVendedor, string strNombreAduana, string strTipoOp, string strPedimentos, string intDiasCredito, string intDiasRetencion, string intDiasGracia, string strTipoCosto, string strIntercia, string strNotificacion, string idClienteConfig, string OldEmpresa, string OldCliente, string OldClientePedimento, string OldVendedor, string OldAduana, string OldOperacion, string OldPedimentos, string OldDiasCredito, string OldDiasRetencion, string OldDiasGracia, string OldTipoCosto, string OldIntercia, string OldNotificacion, IEnumerable<com_relConceptoVendedor> com_conceptos)
        {
            string strCuerpoHTML = "";
            string strConceptos = "";
            Utils.Pie_tabla utils = new Utils.Pie_tabla();
            strValoresCorreo = new string[4];

            try
            {
                strValoresCorreo[0] = "El usuario " + utils.LoginUsuario + " ha realizado una modificación sobre un cliente";
                strValoresCorreo[1] = "Se ha realizado una modificación de cliente con el ID <b>" + idClienteConfig + "</b>,a continuación se realizaron los siguientes cambios";

                strCuerpoHTML = "<tr><td style='font-weight: bold;'>Empresa</td><td>" + OldEmpresa + "</td><td>" + strNombreEmpresa + "</td></tr>";
                strCuerpoHTML += "<tr><td style='font-weight: bold;'>Cliente</td><td>" + OldCliente + "</td><td>" + strNombreCliente + "</td></tr>";
                strCuerpoHTML += "<tr><td style='font-weight: bold;'>Cliente</td><td>" + OldClientePedimento + "</td><td>" + strNombreClientePedimento + "</td></tr>";
                strCuerpoHTML += "<tr><td style='font-weight: bold;'>Vendedor</td><td>" + OldVendedor + "</td><td>" + idCodigoVendedor + "</td></tr>";
                strCuerpoHTML += "<tr><td style='font-weight: bold;'>Aduana</td><td>" + OldAduana + "</td><td>" + strNombreAduana + "</td></tr>";
                strCuerpoHTML += "<tr><td style='font-weight: bold;'>Tipo Op</td><td>" + OldOperacion + "</td><td>" + strTipoOp + "</td></tr>";
                strCuerpoHTML += "<tr><td style='font-weight: bold;'>Pedimentos</td><td>" + OldPedimentos + "</td><td>" + strPedimentos + "</td></tr>";
                strCuerpoHTML += "<tr><td style='font-weight: bold;'>Dias credito</td><td>" + OldDiasCredito + "</td><td>" + intDiasCredito + "</td></tr>";
                strCuerpoHTML += "<tr><td style='font-weight: bold;'>Dias retencion</td><td>" + OldDiasRetencion + "</td><td>" + intDiasRetencion + "</td></tr>";
                strCuerpoHTML += "<tr><td style='font-weight: bold;'>Dias gracia</td><td>" + OldDiasGracia + "</td><td>" + intDiasGracia + "</td></tr>";
                strCuerpoHTML += "<tr><td style='font-weight: bold;'>Tipos Comisión</td><td>" + OldTipoCosto + "</td><td>" + strTipoCosto + "</td></tr>";
                strCuerpoHTML += "<tr><td style='font-weight: bold;'>Intercia</td><td>" + OldIntercia + "</td><td>" + strIntercia + "</td></tr>";
                strCuerpoHTML += "<tr><td style='font-weight: bold;'>Notificaciones a</td><td>" + OldNotificacion + "</td><td>" + strNotificacion + "</td></tr>";

                strValoresCorreo[2] = "<table class='strValues' style='border-collapse: collapse;'><thead><tr><th>LLave</th><th>Valor anterior</th><th>Valor nuevo</th></tr></thead><tbody>" + strCuerpoHTML + "</tbody></table>";

                foreach (var concepto in com_conceptos.Select(p => p))
                {
                    strConceptos += "<tr><td>" + concepto.strConcepto + "</td><td>" + concepto.strCostoVenta + "</td><td>" + concepto.dcmComision + "%</td></tr>";
                }

                strValoresCorreo[3] = "<table class='strValues' style='border-collapse: collapse;'><thead><tr><th>Concepto</th><th>Tipo Comision</th><th>Porcentaje</th></tr></thead><tbody>" + strConceptos + "</tbody></table>";

            }
            catch (Exception ex)
            {

                throw ex;
            }
            return strCuerpoHTML;
        }
    }
}