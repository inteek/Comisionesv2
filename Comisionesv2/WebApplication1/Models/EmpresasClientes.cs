using OneCoreData;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace WebApplication1.Models
{
    public class ClienteAduanasELIContext : DbContext
    {
        public ClienteAduanasELIContext()
            : base("ELIEntities")
        {
        }

        public DbSet<RM00101> Cliente { get; set; }
    }


    public class ClienteAduanasEILOContext : DbContext
    {
        public ClienteAduanasEILOContext()
            : base("EILOEntities")
        {
        }

        public DbSet<RM00101> Cliente { get; set; }
    }

    public class ClienteAduanasRPFContext : DbContext
    {
        public ClienteAduanasRPFContext()
            : base("RPFEntities")
        {
        }

        public DbSet<RM00101> Cliente { get; set; }
    }
    
}