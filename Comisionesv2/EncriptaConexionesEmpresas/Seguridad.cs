using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using static System.Windows.Forms.VisualStyles.VisualStyleElement;

namespace EncriptaConexionesEmpresas
{
    class Seguridad
    {
        public static string EncriptarPwd(string texto, string Llave)
        {
            string functionReturnValue = null;
            TripleDESCryptoServiceProvider desEncripta = new TripleDESCryptoServiceProvider();
            MD5CryptoServiceProvider hashmd5Encripta = new MD5CryptoServiceProvider();
            if (texto.Trim().Equals(""))
            {
                functionReturnValue = "";
            }
            else
            {
                desEncripta.Key = hashmd5Encripta.ComputeHash((new UnicodeEncoding()).GetBytes(Llave));
                desEncripta.Mode = CipherMode.ECB;
                ICryptoTransform encrypt = desEncripta.CreateEncryptor();
                byte[] buff = UnicodeEncoding.ASCII.GetBytes(texto);
                functionReturnValue = Convert.ToBase64String(encrypt.TransformFinalBlock(buff, 0, buff.Length));
               
            }
            return functionReturnValue;
        }
        public static string DesEncriptarPwd(string texto, string Llave)
        {
            string functionReturnValue = null;
            TripleDESCryptoServiceProvider desDesencripta = new TripleDESCryptoServiceProvider();
            MD5CryptoServiceProvider hashmd5Desencripta = new MD5CryptoServiceProvider();
            if (texto.Trim().Equals(""))
            {
                functionReturnValue = "";
            }
            else
            {
                
                desDesencripta.Key = hashmd5Desencripta.ComputeHash((new UnicodeEncoding()).GetBytes(Llave));
                desDesencripta.Mode = CipherMode.ECB;
                ICryptoTransform desencrypta = desDesencripta.CreateDecryptor();
                byte[] buff = Convert.FromBase64String(texto);
                functionReturnValue = (UnicodeEncoding.ASCII.GetString(desencrypta.TransformFinalBlock(buff, 0, buff.Length)));

            }
            return functionReturnValue;
        }
    }
}
