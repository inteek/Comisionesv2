using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models
{
    public class detalleComisiones
    {
        //public string SLPRSNID { get; set; }
        //public string ITEMNMBR { get; set; }
        //public decimal XTNDPRCE { get; set; }
        //public decimal COMISION { get; set; }
        //public decimal SUBTOTAL { get; set; }
        //public decimal TOTAL { get; set; }
        //public string SOPNUMBE { get; set; }
        //public string CUSTNMBR { get; set; }
        //public string ADUASECC { get; set; }
        //public string IMPOEXP { get; set; }

        //public string CLPEID { get; set; }
        //public decimal TCFACSOP { get; set; }
        //public decimal TCPED { get; set; }
        //public int DIAS { get; set; }
        //public DateTime  DATEFACTURA { get; set; }
        //public DateTime DATEPAGO { get; set; }
        //public bool RETENCION { get; set; }
        //public bool ACTIVO { get; set; }
        //public Nullable<DateTime> DATESYS { get; set; }
        //public Nullable<DateTime> DATEMODIFY { get; set; }

        //public DateTime DATEENVIO { get; set; }
        //public bool COMISIONAR { get; set; }
        //public int PERIODO { get; set; }
        //public Nullable<DateTime> FECHAINICIO { get; set; }
        //public Nullable<DateTime> FECHAFIN { get; set; }
        //public int SOPTYPE { get; set; }
        //public string RENDICION { get; set; }
        //public int PERIO_LIBERA_RETENC { get; set; }
        //public int ID_RULE { get; set; }
        //public string NOTA { get; set; }

        //public string REFRENCE { get; set; }
        //public string CUSTNAME { get; set; }
        //public string GRUPONOMBRE { get; set; }

        public string SLPRSNID { get; set; }
        public string ITEMNMBR { get; set; }
        public Nullable<decimal> XTNDPRCE { get; set; }
        public Nullable<decimal> COMISION { get; set; }
        public Nullable<decimal> SUBTOTAL { get; set; }
        public decimal TOTAL { get; set; }
        public string SOPNUMBE { get; set; }
        public string CUSTNMBR { get; set; }
        public string GrupoNombre { get; set; }
        public string ADUASECC { get; set; }
        public string REFRENCE { get; set; }
        public string IMPOEXP { get; set; }
        public string CLPEID { get; set; }
        public decimal TCFACSOP { get; set; }
        public Nullable<decimal> TCPED { get; set; }
        public int DIAS { get; set; }
        public Nullable<System.DateTime> DATEFACTURA { get; set; }
        public Nullable<System.DateTime> DATEPAGO { get; set; }
        public Nullable<bool> RETENCION { get; set; }
        public Nullable<bool> ACTIVO { get; set; }
        public System.DateTime DATESYS { get; set; }
        public Nullable<System.DateTime> DATEMODIFY { get; set; }
        public System.DateTime DATEENVIO { get; set; }
        public Nullable<bool> COMISIONAR { get; set; }
        public Nullable<int> PERIODO { get; set; }
        public Nullable<System.DateTime> FECHAINICIO { get; set; }
        public Nullable<System.DateTime> FECHAFIN { get; set; }
        public Nullable<int> SOPTYPE { get; set; }
        public string RENDICION { get; set; }
        public Nullable<int> PERIO_LIBERA_RETENC { get; set; }
        public Nullable<int> ID_RULE { get; set; }
        public string NOTA { get; set; }
        public string CUSTNAME { get; set; }
    }
}