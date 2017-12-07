using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models
{
    public class facturasComisionables
    {
        public string Empresa { get; set; }
        public string TIPO_REPORTE { get; set; }
        public string NOMBRE { get; set; }
        public Nullable<int> PERIODO { get; set; }
        public string SOPNUMBE { get; set; }
        public string DATEENVIO { get; set; }
        public string DATEPAGO { get; set; }
        public int DIAS { get; set; }
        public string CUSTNMBR { get; set; }
        public string CUSTNAME { get; set; }
        public string ITEMNMBR { get; set; }
        public string GRPNM { get; set; }
        public Nullable<decimal> COMISION { get; set; }
        public int ID { get; set; }
        public int IdVendedor { get; set; }
    }
}