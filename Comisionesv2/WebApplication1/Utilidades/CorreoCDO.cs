using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;

namespace WebApplication1.Utilidades
{
    public class CorreoCDO
    {
        public static string mtdEnvioCorreo(string strCorreosCadena, string strAsunto, string [] strCuerpo)
        {
            string strRespuesta = "";
            //ConfigurationManager.AppSettings 
            string strBaseBody =
                @"
<style>
table.strValues {
  border-collapse: collapse;
}
table.strValues td, table#strValues th {
  border: 1px solid black;
  padding: 5px;
}

table.strValues thead tr {
    background-color: #67C8CA;
}

</style>
<img style='border: 0; margin: 0; padding: 0; display: block; text - decoration:none; ' src='http://www.onecore.mx/hubfs/sitio/img/header/Sistema-Integral-de-Comercio-Exterior-logo-onecore-2.png?t=1494426584346' alt='Sistema Integral de Comercio Exterior - OneCore' class='hs-site-logo'>

<table class='body-wrap'>
	<tr>
		<td></td>
		<td class='container' bgcolor='#FFFFFF'>

			<div class='content'>
			<table>
				<tr>
					<td>
						
						<h3>" + strCuerpo[0] + @"</h3>
						<p class='lead'>" + strCuerpo[1] + @"</p>
				        "+ strCuerpo[2] + @"						
						<br>
						 " + strCuerpo[3] + @"		
						<!-- social & contact -->
						<table class='social' width='100%'>
							<tr>
								<td>
									
									<!--- column 1 -->
									<table align = 'left' class='column'>
										<tr>
											<td>				
												
												<h5 class=''>Contacta con nosotros:</h5>
												<p class=''><a href = 'http://www.onecore.mx/' class='soc-btn fb'>GrupoEI | Onecore</a>
						
												
											</td>
										</tr>
									</table><!-- /column 1 -->	
									
									<!--- column 2 -->
									<table align = 'left' class='column'>
										<tr>
											<td>				
																			
												<h5 class=''>Información de contacto:</h5>												
												<p>Telefonp: <strong>2721568819</strong><br/>
                Email: <strong><a href = 'emailto:villamar.sys@gmail.com' > villamar.sys@gmail.com</a></strong></p>
                
											</td>
										</tr>
									</table><!-- /column 2 -->
									
									<span class='clear'></span>	
									
								</td>
							</tr>
						</table><!-- /social & contact -->
					
					
					</td>
				</tr>
			</table>
			</div>
									
		</td>
		<td></td>
	</tr>
</table><!-- /BODY -->

</body>
</html>";
            
            try
            {
                CDO.Message oMsg = new CDO.Message();
                CDO.IConfiguration iConfg;
                iConfg = oMsg.Configuration;
                ADODB.Fields oFields;
                oFields = iConfg.Fields;

                string SMTP_EmailSend = System.Configuration.ConfigurationManager.AppSettings["SMTP_EmailSend"];
                string SMTP_EmailPass = System.Configuration.ConfigurationManager.AppSettings["SMTP_EmailPass"];
                string SMTP_EmailMask = System.Configuration.ConfigurationManager.AppSettings["SMTP_EmailMask"];
                string SMTP_Server = System.Configuration.ConfigurationManager.AppSettings["SMTP_Server"];
                string SMTP_Port = System.Configuration.ConfigurationManager.AppSettings["SMTP_Port"];
                string SMTP_SSL = System.Configuration.ConfigurationManager.AppSettings["SMTP_SSL"];
                string SMTP_Auth = System.Configuration.ConfigurationManager.AppSettings["SMTP_Auth"];
                string EmailGerenteVentas = System.Configuration.ConfigurationManager.AppSettings["Email_GerenteVentas"];

                oFields["http://schemas.microsoft.com/cdo/configuration/sendusing"].Value = 2;
                oFields["http://schemas.microsoft.com/cdo/configuration/smtpserver"].Value = SMTP_Server;
                oFields["http://schemas.microsoft.com/cdo/configuration/smtpusessl"].Value = SMTP_SSL;
                oFields["http://schemas.microsoft.com/cdo/configuration/smtpserverport"].Value = SMTP_Port;
                oFields["http://schemas.microsoft.com/cdo/configuration/smtpauthenticate"].Value = 1;
                oFields["http://schemas.microsoft.com/cdo/configuration/sendusername"].Value  = SMTP_EmailSend;
                oFields["http://schemas.microsoft.com/cdo/configuration/sendpassword"].Value = SMTP_EmailPass;

                oFields.Update();
                oMsg.Subject = strAsunto;
                oMsg.From = SMTP_EmailMask;
                string[] correosReceptores;
                if (!strCorreosCadena.Equals(""))
                {
                    correosReceptores = strCorreosCadena.Split(',');
                    oMsg.To = EmailGerenteVentas + ";" + correosReceptores[0];

                    int i = 0;
                    string strCadenaCorreosEnvio = "";
                    foreach (string correoExtra in correosReceptores)
                    {
                        if (i != 0)
                        {
                            if (i != correosReceptores.Length)
                            {
                                strCadenaCorreosEnvio = strCadenaCorreosEnvio + correoExtra + ";";
                            }
                        }
                        i++;
                    }
                    if (!strCadenaCorreosEnvio.Equals(""))
                    {
                        oMsg.BCC = strCadenaCorreosEnvio; //Opcional
                    }
                }
               else
                {
                    oMsg.To = EmailGerenteVentas;
                }
                
                //oMsg.TextBody = Cuerpo;
                oMsg.HTMLBody = strBaseBody;
                oMsg.Send();


            }
            catch (Exception ex)
            //catch (System.Net.Mail.SmtpException ex)
            {
                strRespuesta = ex.ToString();
            }

            return strRespuesta;
        }
    }
}