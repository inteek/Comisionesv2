﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Data.Entity.Core.Objects;
    using System.Linq;
    
    public partial class ELIEntities : DbContext
    {
        public ELIEntities()
            : base("name=ELIEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<AA140210> AA140210 { get; set; }
        public virtual DbSet<AA710410> AA710410 { get; set; }
        public virtual DbSet<CATCLAVE_PEDIMENTO> CATCLAVE_PEDIMENTO { get; set; }
        public virtual DbSet<RM00101> RM00101 { get; set; }
        public virtual DbSet<RM20101> RM20101 { get; set; }
        public virtual DbSet<COMISIONES_PATENTE> COMISIONES_PATENTE { get; set; }
    
        public virtual ObjectResult<string> csp_ConsultarFacturas(Nullable<int> idEmpresa, string empresa, string idVendedor, Nullable<int> periodo, Nullable<System.DateTime> fechaInicio, Nullable<System.DateTime> fechaFin)
        {
            var idEmpresaParameter = idEmpresa.HasValue ?
                new ObjectParameter("idEmpresa", idEmpresa) :
                new ObjectParameter("idEmpresa", typeof(int));
    
            var empresaParameter = empresa != null ?
                new ObjectParameter("Empresa", empresa) :
                new ObjectParameter("Empresa", typeof(string));
    
            var idVendedorParameter = idVendedor != null ?
                new ObjectParameter("idVendedor", idVendedor) :
                new ObjectParameter("idVendedor", typeof(string));
    
            var periodoParameter = periodo.HasValue ?
                new ObjectParameter("Periodo", periodo) :
                new ObjectParameter("Periodo", typeof(int));
    
            var fechaInicioParameter = fechaInicio.HasValue ?
                new ObjectParameter("fechaInicio", fechaInicio) :
                new ObjectParameter("fechaInicio", typeof(System.DateTime));
    
            var fechaFinParameter = fechaFin.HasValue ?
                new ObjectParameter("fechaFin", fechaFin) :
                new ObjectParameter("fechaFin", typeof(System.DateTime));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<string>("csp_ConsultarFacturas", idEmpresaParameter, empresaParameter, idVendedorParameter, periodoParameter, fechaInicioParameter, fechaFinParameter);
        }
    
        public virtual ObjectResult<csp_detalleComisiones_Result> csp_detalleComisiones(string idVendedor, Nullable<int> periodo)
        {
            var idVendedorParameter = idVendedor != null ?
                new ObjectParameter("idVendedor", idVendedor) :
                new ObjectParameter("idVendedor", typeof(string));
    
            var periodoParameter = periodo.HasValue ?
                new ObjectParameter("Periodo", periodo) :
                new ObjectParameter("Periodo", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<csp_detalleComisiones_Result>("csp_detalleComisiones", idVendedorParameter, periodoParameter);
        }
    
        public virtual int csp_resumenComisionesEquipo(string idVendedor, Nullable<int> periodo)
        {
            var idVendedorParameter = idVendedor != null ?
                new ObjectParameter("idVendedor", idVendedor) :
                new ObjectParameter("idVendedor", typeof(string));
    
            var periodoParameter = periodo.HasValue ?
                new ObjectParameter("Periodo", periodo) :
                new ObjectParameter("Periodo", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("csp_resumenComisionesEquipo", idVendedorParameter, periodoParameter);
        }
    
        public virtual int csp_resumenComisionesCliente(string idVendedor, Nullable<int> periodo)
        {
            var idVendedorParameter = idVendedor != null ?
                new ObjectParameter("idVendedor", idVendedor) :
                new ObjectParameter("idVendedor", typeof(string));
    
            var periodoParameter = periodo.HasValue ?
                new ObjectParameter("Periodo", periodo) :
                new ObjectParameter("Periodo", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("csp_resumenComisionesCliente", idVendedorParameter, periodoParameter);
        }
    
        public virtual int csp_resumenComisionesClientePie(string idVendedor, Nullable<int> periodo)
        {
            var idVendedorParameter = idVendedor != null ?
                new ObjectParameter("idVendedor", idVendedor) :
                new ObjectParameter("idVendedor", typeof(string));
    
            var periodoParameter = periodo.HasValue ?
                new ObjectParameter("Periodo", periodo) :
                new ObjectParameter("Periodo", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("csp_resumenComisionesClientePie", idVendedorParameter, periodoParameter);
        }
    
        public virtual ObjectResult<csp_detalleRetenciones_Result1> csp_detalleRetenciones(string idVendedor, Nullable<int> periodo)
        {
            var idVendedorParameter = idVendedor != null ?
                new ObjectParameter("idVendedor", idVendedor) :
                new ObjectParameter("idVendedor", typeof(string));
    
            var periodoParameter = periodo.HasValue ?
                new ObjectParameter("Periodo", periodo) :
                new ObjectParameter("Periodo", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<csp_detalleRetenciones_Result1>("csp_detalleRetenciones", idVendedorParameter, periodoParameter);
        }
    
        public virtual ObjectResult<csp_resumenComisionesEquipoPie_Result> csp_resumenComisionesEquipoPie(string idVendedor, Nullable<int> periodo)
        {
            var idVendedorParameter = idVendedor != null ?
                new ObjectParameter("idVendedor", idVendedor) :
                new ObjectParameter("idVendedor", typeof(string));
    
            var periodoParameter = periodo.HasValue ?
                new ObjectParameter("Periodo", periodo) :
                new ObjectParameter("Periodo", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<csp_resumenComisionesEquipoPie_Result>("csp_resumenComisionesEquipoPie", idVendedorParameter, periodoParameter);
        }
    }
}
