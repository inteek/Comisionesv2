using OneCoreData;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace EncriptaConexionesEmpresas
{
    public partial class frmConexionesComisiones : Form
    {
        DataTable dt;
        COMISIONESEntities db = new COMISIONESEntities();

        public frmConexionesComisiones()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            rdbNuevaEmr.Checked = true;
            cbbEmpresas.Enabled = false;
            mtdCargaGrid();
        }

        private void mtdCargaGrid()
        {
            try
            {
              

                List<com_empresas> list = (from emp in db.com_empresas
                                       select emp).ToList();
                dt = ToDataTable<com_empresas>(list);
                dt.PrimaryKey = new DataColumn[] { dt.Columns["IdEmpresa"] };
                dgvEmpresas.DataSource = dt;

                cbbEmpresas.DataSource = dt;
                cbbEmpresas.ValueMember = "IdEmpresa";
                cbbEmpresas.DisplayMember = "strNombreEmpresa";

            }
            catch (Exception ex)
            {
                MessageBox.Show("Ocurrio un error:" + ex.Message);
            }
        }

        public static DataTable ToDataTable<T>(List<T> items)
        {
            DataTable dataTable = new DataTable(typeof(T).Name);

            //Get all the properties
            PropertyInfo[] Props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            foreach (PropertyInfo prop in Props)
            {
                //Setting column names as Property names
                dataTable.Columns.Add(prop.Name);
            }
            foreach (T item in items)
            {
                var values = new object[Props.Length];
                for (int i = 0; i < Props.Length; i++)
                {
                    //inserting property values to datatable rows
                    values[i] = Props[i].GetValue(item, null);
                }
                dataTable.Rows.Add(values);
            }
            //put a breakpoint here and check datatable
            return dataTable;
        }

        private void btnGuardar_Click(object sender, EventArgs e)
        {
            
        }

        private void rdbNuevaEmr_CheckedChanged(object sender, EventArgs e)
        {
            txtEmpresa.Enabled = true;
            cbbEmpresas.Enabled = false;
        }

        private void rdbEmpresaExiste_CheckedChanged(object sender, EventArgs e)
        {
            if (rdbEmpresaExiste.Checked)
            {
                cbbEmpresas.Enabled = true;
                txtEmpresa.Enabled = true;

                mtdCargarDatosEmpresa(Convert.ToInt32(cbbEmpresas.SelectedValue));
            }
        }

        private void mtdCargarDatosEmpresa(int idEmpresa)
        {
            try
            {
                DataRow dr = dt.Rows.Find(idEmpresa);
                string strCadenaEncriptada = dr["strCadenaConexion"].ToString();
                txtCadenaConexion.Text = Seguridad.DesEncriptarPwd(strCadenaEncriptada, "comisionesApp");
            }
            catch (Exception ex)
            {
                MessageBox.Show("Ocurrio un error:" + ex.Message);
            }
        }

        private void dgvEmpresas_CellMouseDoubleClick(object sender, DataGridViewCellMouseEventArgs e)
        {
            mtdCargarDatosEmpresa(Convert.ToInt32(cbbEmpresas.SelectedValue));
        }

        private void guardarToolStripMenuItem_Click(object sender, EventArgs e)
        {
            try
            {
                COMISIONESEntities db = new COMISIONESEntities();
                string cadenaConexionEnc = Seguridad.EncriptarPwd(txtCadenaConexion.Text, "comisionesApp");
                string NombreEmpresa = txtEmpresa.Text;

                if (rdbNuevaEmr.Checked)
                {
                    com_empresas _empresas = new com_empresas();
                    _empresas.strNombreEmpresa = NombreEmpresa;
                    _empresas.strCadenaConexion = cadenaConexionEnc;
                    _empresas.idUsuarioAlta = "nmonte";
                    _empresas.idUsuarioModifica = null;
                    _empresas.dtFechaAlta = DateTime.Now.Date;
                    _empresas.dtFechaModifica = null;
                    _empresas.boolActivo = true;
                    db.com_empresas.Add(_empresas);
                    db.SaveChanges();

                    MessageBox.Show("Empresa guardada con exito");
                }
                else
                {
                    int index = dgvEmpresas.CurrentCell.RowIndex;

                    int idEmpresa = Convert.ToInt32(dgvEmpresas.Rows[index].Cells["IdEmpresa"].Value);
                    var Empresa = db.com_empresas.SingleOrDefault(b => b.IdEmpresa == idEmpresa);
                    if (Empresa != null)
                    {
                        Empresa.strCadenaConexion = cadenaConexionEnc;
                        db.SaveChanges();

                        MessageBox.Show("Cambios actualizados con exito");
                    }
                }
                mtdCargaGrid();
                //string ca = Seguridad.DesEncriptarPwd("4ifHvNyG90oBEZPTgic5RhLOeqVaFoydGObk81bI%2fdF%2f42PuWonCnruUZsGHjNAOUzDnZMI5DBEOLSy0FVjtKIJzufYEx8svsQmH%2bSZhrEw%3d", "comisionesApp");
            }
            catch (Exception ex)
            {
                MessageBox.Show("Ocurrio un error:" + ex.Message);
            }
        }

        private void eliminarToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (MessageBox.Show("", "¿Seguro de eliminar esta empresa?", MessageBoxButtons.YesNo) == DialogResult.Yes)
            {
                int index = dgvEmpresas.CurrentCell.RowIndex;

                int idEmpresa = Convert.ToInt32(dgvEmpresas.Rows[index].Cells["IdEmpresa"].Value);
                var Empresa = db.com_empresas.SingleOrDefault(b => b.IdEmpresa == idEmpresa);
                if (Empresa != null)
                {
                    db.com_empresas.Remove(Empresa);
                    db.SaveChanges();

                    MessageBox.Show("Eliminación exitosa");

                    mtdCargaGrid();
                }
            }
                
        }

        private void cbbEmpresas_SelectionChangeCommitted(object sender, EventArgs e)
        {
            mtdCargarDatosEmpresa(Convert.ToInt32(cbbEmpresas.SelectedValue));
        }

        private void dgvEmpresas_CellMouseClick(object sender, DataGridViewCellMouseEventArgs e)
        {
            if (rdbEmpresaExiste.Checked)
            {
                int index = dgvEmpresas.CurrentCell.RowIndex;

                int idEmpresa = Convert.ToInt32(dgvEmpresas.Rows[index].Cells["IdEmpresa"].Value);
                mtdCargarDatosEmpresa(idEmpresa);
            }
        }
    }
}
