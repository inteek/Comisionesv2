using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models
{
    public class clienteVendedor
    {
        public int idEmpresa { get; set; }
        public string idCliente { get; set; }
        public string strNombreCliente { get; set; }
        public int intDiasCredito { get; set; }
        public int intDiasRetencion { get; set; }
        public int intDiasGracia { get; set; }
        public int idCodigoVendedor { get; set; }
        public string nombreVendedor { get; set; }
    }
}