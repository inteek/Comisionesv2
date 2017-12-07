using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(PruebasSPEntityWeb.Startup))]
namespace PruebasSPEntityWeb
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
