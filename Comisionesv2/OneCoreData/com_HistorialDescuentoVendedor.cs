//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace OneCoreData
{
    using System;
    using System.Collections.Generic;
    
    public partial class com_HistorialDescuentoVendedor
    {
        public int idRow { get; set; }
        public int idDescuentoConceptoVendedor { get; set; }
        public int idCodigoVendedor { get; set; }
        public int idPeriodo { get; set; }
        public decimal Descuento { get; set; }
        public decimal SaldoTotal { get; set; }
        public Nullable<int> idEmpresa { get; set; }
        public Nullable<System.DateTime> FechaInicioPeriodo { get; set; }
        public Nullable<System.DateTime> FechaFinPeriodo { get; set; }
    }
}
