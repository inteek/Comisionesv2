using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models
{
    public class comisionRetenciones
    {

        public Nullable<int> PERIODO { get; set; }
        public string SLPRSNID { get; set; }
        public string CUSTNMBR { get; set; }
        public string CUSTNAME { get; set; }
        public string FACTURA { get; set; }
        public string FACTURA_RETENER { get; set; }
        public System.DateTime DATE_PAGO { get; set; }
        public Nullable<System.DateTime> DATE_FACTURA { get; set; }
        public Nullable<System.DateTime> DATE_ENVIO { get; set; }
        public Nullable<decimal> COMISION { get; set; }
        public Nullable<decimal> MONTO_FACTURA { get; set; }
        public Nullable<decimal> MONTO_RETENIDO { get; set; }
        public Nullable<bool> RETENER { get; set; }
        public Nullable<System.DateTime> DATESYS { get; set; }
        public Nullable<System.DateTime> DATE_LIBERA { get; set; }
        public Nullable<bool> ACTIVO { get; set; }
        public Nullable<int> PERIODO_LIBERADO { get; set; }
    }
}