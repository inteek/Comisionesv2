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
    
    public partial class com_DocumentoVendedor
    {
        public int idDocumentoVendedor { get; set; }
        public int idDocumento { get; set; }
        public int idCodigoVendedor { get; set; }
    
        public virtual com_Documentos com_Documentos { get; set; }
        public virtual com_vendedores com_vendedores { get; set; }
    }
}