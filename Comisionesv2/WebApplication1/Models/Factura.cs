using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using OneCoreData;

namespace WebApplication1.Models
{
    public class Factura
    {
        #region :::: FACTURAS COMISIONABLES :::: 
        public List<com_vendedores> listaVendedores { get; set; }
        public List<SP_COMISIONES_CONSULTAR_FACTURAS_COMISIONABLES_Result> facturasComisionables { get; set; }
        public List<SP_COMISIONES_CONSULTAR_FACTURAS_RETENIDAS_Result> facturasRetenidas { get; set; }
        #endregion

        #region :::: FACTURAS RETENIDAS :::: 

        #endregion
    }
}