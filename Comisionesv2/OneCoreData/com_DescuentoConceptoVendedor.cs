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
    
    public partial class com_DescuentoConceptoVendedor
    {
        public int idDescuentoConceptoVendedor { get; set; }
        public int idEmpresa { get; set; }
        public int idCodigoVendedor { get; set; }
        public string idConcepto { get; set; }
        public string strConcepto { get; set; }
        public decimal totalAdeudo { get; set; }
        public decimal cantidadDescontar { get; set; }
        public bool vigenciaIndefinida { get; set; }
        public Nullable<bool> status { get; set; }
        public Nullable<System.DateTime> vigenciaInicio { get; set; }
        public Nullable<System.DateTime> vigenciaFin { get; set; }
    
        public virtual com_empresas com_empresas { get; set; }
        public virtual com_vendedores com_vendedores { get; set; }
    }
}
