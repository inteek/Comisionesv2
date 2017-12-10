using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models
{   
    public class ResumenPagoComisiones
    {
        public int IDCODIGOVENDEDOR { get; set; }
        public string VENDEDOR { get; set; }
        public int PERIODO { get; set; }
        public DateTime FECHAINICIO { get; set; }
        public DateTime FECHAFIN { get; set; }
        public decimal TOTALPAGAR { get; set; }
        public string CLABEINTERBANCARIA { get; set; }
        public string BANCO { get; set; }
        public string ESQUEMA { get; set; }
        public string CORREO { get; set; }



    }
}