using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models
{
    public class comisionesEquipoPie
    {
        public decimal COMISION { get; set; }
        public decimal NOCOMISIONABLE { get; set; }
        public decimal RETENCION { get; set; }
        public decimal TOTAL { get; set; }
        public decimal LIBERARRETENCION { get; set; }
        public decimal TOTALPAGAR { get; set; }
        public string VENDEDOR { get; set; }
        public int PERIODO { get; set; }
        public DateTime FECHAINICIO { get; set; }
        public DateTime FECHAFIN { get; set; }
    }
}