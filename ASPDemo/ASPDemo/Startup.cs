using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ASPDemo.Startup))]
namespace ASPDemo
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
