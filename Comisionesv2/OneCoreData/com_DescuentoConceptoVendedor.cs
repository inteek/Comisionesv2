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
    
    public partial class com_DescuentoConceptoVendedor
    {
        public int idDescuentoConceptoVendedor { get; set; }
        public int idEmpresa { get; set; }
        public int idCodigoVendedor { get; set; }
        public string idConcepto { get; set; }
        public string strConcepto { get; set; }
        public decimal totalAdeudo { get; set; }
        public decimal cantidadDescontar { get; set; }
        public string vigenciaInicio { get; set; }
        public string vigenciaFin { get; set; }
        public bool vigenciaIndefinida { get; set; }
        public Nullable<bool> status { get; set; }
    
        public virtual com_empresas com_empresas { get; set; }
        public virtual com_vendedores com_vendedores { get; set; }
    }
}
