using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OneCoreData
{
    public partial class ELIEntities : DbContext
    {
        public ELIEntities(string connectionString)
        {
            this.Database.Connection.ConnectionString = connectionString;
            this.Database.CommandTimeout = 180;
        }
    }
}
