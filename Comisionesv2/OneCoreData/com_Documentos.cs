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
    
    public partial class com_Documentos
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public com_Documentos()
        {
            this.com_DocumentoVendedor = new HashSet<com_DocumentoVendedor>();
        }
    
        public int idDocumento { get; set; }
        public string name { get; set; }
        public string contentType { get; set; }
        public byte[] data { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<com_DocumentoVendedor> com_DocumentoVendedor { get; set; }
    }
}
