using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using OneCoreData;
using WebApplication1.Models;

namespace WebApplication1.Utilidades
{
    public static class AuxClientes
    {
        public static string ObtieneTiposOperacionConceptos(this IEnumerable<com_relConceptoVendedor> com_conceptos)
        {
            string cadena = "";
            cadena = string.Join(",", com_conceptos.Select(s => s.strCostoVenta).Distinct());
            return cadena;
        }

        public static string ObtieneAduanasAnteriores(string NombreEmpresa, string GrupoAduanas)
        {
            string strCadenaEmpresaReal = "";
            string strCadenaEmpresaEnc = "";
            string[] idAduanas = GrupoAduanas.Split(',');

            string retornoAduanas = "";
            

            try
            {
                using (var ctx = new COMISIONESEntities())
                {

                    strCadenaEmpresaEnc = (from emp in ctx.com_empresas
                                           where emp.strNombreEmpresa == NombreEmpresa
                                           select emp.strCadenaConexion).First().ToString();


                }
                strCadenaEmpresaReal = Seguridad.DesEncriptarPwd(strCadenaEmpresaEnc, "comisionesApp");

                using (var ctx = new ELIEntities(strCadenaEmpresaReal))
                {
                    foreach (string idAduana in idAduanas)
                    {
                        if(idAduana != "")
                        {
                            int id_Aduana = Convert.ToInt32(idAduana);
                            var Aduana = ctx.AA140210.Select(s => s).Where(p => p.DEX_ROW_ID == id_Aduana).FirstOrDefault();
                            string aduanaAnexada = Aduana.CUSTOM.Trim() + Aduana.SECTION.Trim() + " - " + Aduana.DENOMC.Trim() + "<br>";
                            retornoAduanas = retornoAduanas + aduanaAnexada;
                        }
                    }
                    
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex.ToString());
                throw new Exception("Error al obtener la lista", ex);
            }

            
            return retornoAduanas;
        }

        public static string ObtienePedimentosAnteriores(string GrupoPedimentos)
        {
            string strCadenaEmpresaReal = "";
            string strCadenaEmpresaEnc = "";
            string[] idsPedimentos = GrupoPedimentos.Split(',');

            string retornoPedimento = "";


            try
            {
                using (var ctx = new COMISIONESEntities())
                {

                    strCadenaEmpresaEnc = (from emp in ctx.com_empresas
                                           where emp.strNombreEmpresa.Equals("ELI")
                                           select emp.strCadenaConexion).First().ToString();


                }
                strCadenaEmpresaReal = Seguridad.DesEncriptarPwd(strCadenaEmpresaEnc, "comisionesApp");

                using (var ctx = new ELIEntities(strCadenaEmpresaReal))
                {
                    foreach (string idPedimento in idsPedimentos)
                    {
                        int pedimentoInt = Convert.ToInt32(idPedimento);
                        if (idPedimento != "")
                        {
                            int id_Pedimento = Convert.ToInt32(idPedimento);
                            var Pedimento = ctx.CATCLAVE_PEDIMENTO.Select(s => s).Where(p => p.Id_ClavePedimento == pedimentoInt).FirstOrDefault();
                            string pedimentoAnexada = Pedimento.Clave.Trim() + " - " + Pedimento.Descripcion.Trim() + "<br>";
                            retornoPedimento = retornoPedimento + pedimentoAnexada;
                        }
                    }

                }
            }
            catch (Exception ex)
            {
                Console.Write(ex.ToString());
                throw new Exception("Error al obtener la lista", ex);
            }


            return retornoPedimento;
        }

    }
}