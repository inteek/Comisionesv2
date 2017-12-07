using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OneCoreData
{
    public class FacturasStatus
    {
        public string FACTURA { get; set; }
        public string DOCNUMBR { get; set; }
        public string ESTADO { get; set; }
        public string ADEUDO_DECIMAL { get; set; }
        public string PERIODO_PAGADO { get; set; }
        public int CONCEPTOS_COMISIONBLES { get; set; }
        public string CANCELADA { get; set; }
        public string COMISIONADA { get; set; }
        public string PERIODO { get; set; }
        public string CONCEPTOS { get; set; }
        public string FECHA { get; set; }
    }
}
