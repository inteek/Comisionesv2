//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace OneCoreData
{
    using System;
    using System.Collections.Generic;
    
    public partial class com_relConceptoVendedor
    {
        public int idRelConceptoVendedor { get; set; }
        public int idClienteConfig { get; set; }
        public string idConcepto { get; set; }
        public string strConcepto { get; set; }
        public string strCostoVenta { get; set; }
        public decimal dcmComision { get; set; }
        public bool boolActivo { get; set; }
        public Nullable<decimal> dDescuentoFijo { get; set; }
        public string strTipoCambio { get; set; }
    
        public virtual com_clientesComConfig com_clientesComConfig { get; set; }
    }
}
