using OneCoreData;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace WebApplication1.Models
{
    public class ClientesRel
    {
        [Key]
        public string UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual com_clientesComConfig  clientes { get; set; }
    }
}