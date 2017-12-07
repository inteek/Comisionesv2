using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI.WebControls; //For SortBy method
using System.Web.Mvc;
using WebApplication1.Models;
using OneCoreData;


namespace WebApplication1
{
    public class ResultSet
    {
        public List<facturasComisionables> GetResult(string search, string sortOrder, int start, int length, List<facturasComisionables> dtResult, List<string> columnFilters)
        {
            return FilterResult(search, dtResult,columnFilters).SortBy(sortOrder).Skip(start).Take(length).ToList();
        }

        public int Count(string search, List<facturasComisionables> dtResult, List<string> columnFilters)
        {
            return FilterResult(search, dtResult, columnFilters).Count();
        }

        private IQueryable<facturasComisionables> FilterResult(string search, List<facturasComisionables> dtResult, List<string> columnFilters)
        {
            IQueryable<facturasComisionables> results = dtResult.AsQueryable();

            results = results.Where(p => (search == null || (p.Empresa != null && p.Empresa.ToLower().Contains(search.ToLower()) || p.TIPO_REPORTE != null && p.TIPO_REPORTE.ToLower().Contains(search.ToLower())
                || p.NOMBRE != null && p.NOMBRE.ToLower().Contains(search.ToLower()) || p.SOPNUMBE != null && p.SOPNUMBE.ToLower().Contains(search.ToLower()) || p.CUSTNAME != null && p.CUSTNAME.ToLower().Contains(search.ToLower()) || p.ITEMNMBR != null && p.ITEMNMBR.ToLower().Contains(search.ToLower())
                || p.GRPNM != null && p.GRPNM.ToLower().Contains(search.ToLower()))) 
                && (columnFilters[0] == null || (p.Empresa != null && p.Empresa.ToLower().Contains(columnFilters[0].ToLower())))
                && (columnFilters[1] == null || (p.TIPO_REPORTE != null && p.TIPO_REPORTE.ToLower().Contains(columnFilters[1].ToLower())))
                && (columnFilters[2] == null || (p.NOMBRE != null && p.NOMBRE.ToLower().Contains(columnFilters[2].ToLower())))
                && (columnFilters[3] == null || (p.SOPNUMBE != null && p.SOPNUMBE.ToLower().Contains(columnFilters[3].ToLower())))
                && (columnFilters[4] == null || (p.CUSTNAME != null && p.CUSTNAME.ToLower().Contains(columnFilters[4].ToLower())))
                && (columnFilters[5] == null || (p.ITEMNMBR != null && p.ITEMNMBR.ToLower().Contains(columnFilters[5].ToLower())))
                && (columnFilters[6] == null || (p.GRPNM != null && p.GRPNM.ToLower().Contains(columnFilters[6].ToLower())))
                );

            return results;
        }
    }
}