using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models
{
    public class Descuentos
    {
        public int idDescuentoConceptoVendedor { get; set; }
        public int idEmpresa { get; set; }
        public int idCodigoVendedor { get; set; }
        public int idConcepto { get; set; }
        public string strConcepto { get; set; }
        public decimal total { get; set; }
        public decimal cantidadDescontar { get; set; }
        public bool vigenciaIndefinida { get; set; }
        public bool status { get; set; }
        public DateTime vigenciaInicio { get; set; }
        public DateTime vigenciaFin { get; set; }
    }
}