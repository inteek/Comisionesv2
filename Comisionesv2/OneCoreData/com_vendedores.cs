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
    
    public partial class com_vendedores
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public com_vendedores()
        {
            this.com_periodos = new HashSet<com_periodos>();
            this.com_Descuentos = new HashSet<com_Descuentos>();
            this.com_DescuentoConceptoVendedor = new HashSet<com_DescuentoConceptoVendedor>();
            this.com_clientesComConfig = new HashSet<com_clientesComConfig>();
        }
    
        public int idCodigoVendedor { get; set; }
        public string strNombre { get; set; }
        public string strApellidoP { get; set; }
        public string strApellidoM { get; set; }
        public string strDireccion { get; set; }
        public string strTipoVendedor { get; set; }
        public string strTelefono { get; set; }
        public string strEmail { get; set; }
        public bool boolActivo { get; set; }
        public System.DateTime dtFechaAlta { get; set; }
        public Nullable<System.DateTime> dtFechaModifica { get; set; }
        public string idUsuarioAlta { get; set; }
        public string idUsuarioModifica { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<com_periodos> com_periodos { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<com_Descuentos> com_Descuentos { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<com_DescuentoConceptoVendedor> com_DescuentoConceptoVendedor { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<com_clientesComConfig> com_clientesComConfig { get; set; }
    }
}
