namespace EncriptaConexionesEmpresas
{
    partial class frmConexionesComisiones
    {
        /// <summary>
        /// Variable del diseñador necesaria.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Limpiar los recursos que se estén usando.
        /// </summary>
        /// <param name="disposing">true si los recursos administrados se deben desechar; false en caso contrario.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Código generado por el Diseñador de Windows Forms

        /// <summary>
        /// Método necesario para admitir el Diseñador. No se puede modificar
        /// el contenido de este método con el editor de código.
        /// </summary>
        private void InitializeComponent()
        {
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.cbbEmpresas = new System.Windows.Forms.ComboBox();
            this.rdbEmpresaExiste = new System.Windows.Forms.RadioButton();
            this.rdbNuevaEmr = new System.Windows.Forms.RadioButton();
            this.txtEmpresa = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.txtCadenaConexion = new System.Windows.Forms.TextBox();
            this.dgvEmpresas = new System.Windows.Forms.DataGridView();
            this.IdEmpresa = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.strNombreEmpresa = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.boolActivo = new System.Windows.Forms.DataGridViewCheckBoxColumn();
            this.dtFechaAlta = new System.Windows.Forms.DataGridViewButtonColumn();
            this.dtFechaModifica = new System.Windows.Forms.DataGridViewButtonColumn();
            this.idUsuarioAlta = new System.Windows.Forms.DataGridViewButtonColumn();
            this.idUsuarioModifica = new System.Windows.Forms.DataGridViewButtonColumn();
            this.strCadenaConexion = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.com_clientesComConfig = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.menuStrip1 = new System.Windows.Forms.MenuStrip();
            this.guardarToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.eliminarToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.groupBox1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.dgvEmpresas)).BeginInit();
            this.menuStrip1.SuspendLayout();
            this.SuspendLayout();
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.txtCadenaConexion);
            this.groupBox1.Controls.Add(this.label1);
            this.groupBox1.Controls.Add(this.txtEmpresa);
            this.groupBox1.Controls.Add(this.rdbNuevaEmr);
            this.groupBox1.Controls.Add(this.rdbEmpresaExiste);
            this.groupBox1.Controls.Add(this.cbbEmpresas);
            this.groupBox1.Location = new System.Drawing.Point(12, 31);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(827, 106);
            this.groupBox1.TabIndex = 0;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "Administración empresas";
            // 
            // cbbEmpresas
            // 
            this.cbbEmpresas.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cbbEmpresas.FormattingEnabled = true;
            this.cbbEmpresas.Location = new System.Drawing.Point(541, 25);
            this.cbbEmpresas.Name = "cbbEmpresas";
            this.cbbEmpresas.Size = new System.Drawing.Size(199, 24);
            this.cbbEmpresas.TabIndex = 0;
            this.cbbEmpresas.SelectionChangeCommitted += new System.EventHandler(this.cbbEmpresas_SelectionChangeCommitted);
            // 
            // rdbEmpresaExiste
            // 
            this.rdbEmpresaExiste.AutoSize = true;
            this.rdbEmpresaExiste.Location = new System.Drawing.Point(380, 26);
            this.rdbEmpresaExiste.Name = "rdbEmpresaExiste";
            this.rdbEmpresaExiste.Size = new System.Drawing.Size(145, 21);
            this.rdbEmpresaExiste.TabIndex = 1;
            this.rdbEmpresaExiste.TabStop = true;
            this.rdbEmpresaExiste.Text = "Empresa existente";
            this.rdbEmpresaExiste.UseVisualStyleBackColor = true;
            this.rdbEmpresaExiste.CheckedChanged += new System.EventHandler(this.rdbEmpresaExiste_CheckedChanged);
            // 
            // rdbNuevaEmr
            // 
            this.rdbNuevaEmr.AutoSize = true;
            this.rdbNuevaEmr.Location = new System.Drawing.Point(15, 23);
            this.rdbNuevaEmr.Name = "rdbNuevaEmr";
            this.rdbNuevaEmr.Size = new System.Drawing.Size(129, 21);
            this.rdbNuevaEmr.TabIndex = 2;
            this.rdbNuevaEmr.TabStop = true;
            this.rdbNuevaEmr.Text = "Nueva empresa";
            this.rdbNuevaEmr.UseVisualStyleBackColor = true;
            this.rdbNuevaEmr.CheckedChanged += new System.EventHandler(this.rdbNuevaEmr_CheckedChanged);
            // 
            // txtEmpresa
            // 
            this.txtEmpresa.Location = new System.Drawing.Point(150, 25);
            this.txtEmpresa.Name = "txtEmpresa";
            this.txtEmpresa.Size = new System.Drawing.Size(168, 22);
            this.txtEmpresa.TabIndex = 3;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(3, 67);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(141, 17);
            this.label1.TabIndex = 4;
            this.label1.Text = "Cadena de conexión:";
            // 
            // txtCadenaConexion
            // 
            this.txtCadenaConexion.Location = new System.Drawing.Point(150, 64);
            this.txtCadenaConexion.Name = "txtCadenaConexion";
            this.txtCadenaConexion.Size = new System.Drawing.Size(590, 22);
            this.txtCadenaConexion.TabIndex = 5;
            // 
            // dgvEmpresas
            // 
            this.dgvEmpresas.AllowUserToAddRows = false;
            this.dgvEmpresas.AllowUserToDeleteRows = false;
            this.dgvEmpresas.BackgroundColor = System.Drawing.SystemColors.ButtonHighlight;
            this.dgvEmpresas.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.dgvEmpresas.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.IdEmpresa,
            this.strNombreEmpresa,
            this.boolActivo,
            this.dtFechaAlta,
            this.dtFechaModifica,
            this.idUsuarioAlta,
            this.idUsuarioModifica,
            this.strCadenaConexion,
            this.com_clientesComConfig});
            this.dgvEmpresas.Location = new System.Drawing.Point(12, 143);
            this.dgvEmpresas.MultiSelect = false;
            this.dgvEmpresas.Name = "dgvEmpresas";
            this.dgvEmpresas.ReadOnly = true;
            this.dgvEmpresas.RowHeadersVisible = false;
            this.dgvEmpresas.RowTemplate.Height = 24;
            this.dgvEmpresas.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.dgvEmpresas.Size = new System.Drawing.Size(740, 243);
            this.dgvEmpresas.TabIndex = 1;
            this.dgvEmpresas.CellMouseClick += new System.Windows.Forms.DataGridViewCellMouseEventHandler(this.dgvEmpresas_CellMouseClick);
            // 
            // IdEmpresa
            // 
            this.IdEmpresa.DataPropertyName = "IdEmpresa";
            this.IdEmpresa.HeaderText = "Column1";
            this.IdEmpresa.Name = "IdEmpresa";
            this.IdEmpresa.ReadOnly = true;
            this.IdEmpresa.Visible = false;
            // 
            // strNombreEmpresa
            // 
            this.strNombreEmpresa.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.None;
            this.strNombreEmpresa.DataPropertyName = "strNombreEmpresa";
            this.strNombreEmpresa.FillWeight = 200F;
            this.strNombreEmpresa.HeaderText = "Empresa";
            this.strNombreEmpresa.Name = "strNombreEmpresa";
            this.strNombreEmpresa.ReadOnly = true;
            // 
            // boolActivo
            // 
            this.boolActivo.DataPropertyName = "boolActivo";
            this.boolActivo.HeaderText = "boolActivo";
            this.boolActivo.Name = "boolActivo";
            this.boolActivo.ReadOnly = true;
            this.boolActivo.Visible = false;
            // 
            // dtFechaAlta
            // 
            this.dtFechaAlta.DataPropertyName = "dtFechaAlta";
            this.dtFechaAlta.HeaderText = "dtFechaAlta";
            this.dtFechaAlta.Name = "dtFechaAlta";
            this.dtFechaAlta.ReadOnly = true;
            this.dtFechaAlta.Visible = false;
            // 
            // dtFechaModifica
            // 
            this.dtFechaModifica.DataPropertyName = "dtFechaModifica";
            this.dtFechaModifica.HeaderText = "dtFechaModifica";
            this.dtFechaModifica.Name = "dtFechaModifica";
            this.dtFechaModifica.ReadOnly = true;
            this.dtFechaModifica.Visible = false;
            // 
            // idUsuarioAlta
            // 
            this.idUsuarioAlta.DataPropertyName = "idUsuarioAlta";
            this.idUsuarioAlta.HeaderText = "Column1";
            this.idUsuarioAlta.Name = "idUsuarioAlta";
            this.idUsuarioAlta.ReadOnly = true;
            this.idUsuarioAlta.Visible = false;
            // 
            // idUsuarioModifica
            // 
            this.idUsuarioModifica.DataPropertyName = "idUsuarioModifica";
            this.idUsuarioModifica.HeaderText = "Column1";
            this.idUsuarioModifica.Name = "idUsuarioModifica";
            this.idUsuarioModifica.ReadOnly = true;
            this.idUsuarioModifica.Visible = false;
            // 
            // strCadenaConexion
            // 
            this.strCadenaConexion.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.Fill;
            this.strCadenaConexion.DataPropertyName = "strCadenaConexion";
            this.strCadenaConexion.HeaderText = "Cadena Conexion";
            this.strCadenaConexion.Name = "strCadenaConexion";
            this.strCadenaConexion.ReadOnly = true;
            this.strCadenaConexion.Resizable = System.Windows.Forms.DataGridViewTriState.True;
            this.strCadenaConexion.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            // 
            // com_clientesComConfig
            // 
            this.com_clientesComConfig.DataPropertyName = "com_clientesComConfig";
            this.com_clientesComConfig.HeaderText = "Column1";
            this.com_clientesComConfig.Name = "com_clientesComConfig";
            this.com_clientesComConfig.ReadOnly = true;
            this.com_clientesComConfig.Visible = false;
            // 
            // menuStrip1
            // 
            this.menuStrip1.ImageScalingSize = new System.Drawing.Size(20, 20);
            this.menuStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.guardarToolStripMenuItem,
            this.eliminarToolStripMenuItem});
            this.menuStrip1.Location = new System.Drawing.Point(0, 0);
            this.menuStrip1.Name = "menuStrip1";
            this.menuStrip1.Size = new System.Drawing.Size(772, 28);
            this.menuStrip1.TabIndex = 2;
            this.menuStrip1.Text = "menuStrip1";
            // 
            // guardarToolStripMenuItem
            // 
            this.guardarToolStripMenuItem.Name = "guardarToolStripMenuItem";
            this.guardarToolStripMenuItem.Size = new System.Drawing.Size(74, 24);
            this.guardarToolStripMenuItem.Text = "Guardar";
            this.guardarToolStripMenuItem.Click += new System.EventHandler(this.guardarToolStripMenuItem_Click);
            // 
            // eliminarToolStripMenuItem
            // 
            this.eliminarToolStripMenuItem.Name = "eliminarToolStripMenuItem";
            this.eliminarToolStripMenuItem.Size = new System.Drawing.Size(75, 24);
            this.eliminarToolStripMenuItem.Text = "Eliminar";
            this.eliminarToolStripMenuItem.Click += new System.EventHandler(this.eliminarToolStripMenuItem_Click);
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(772, 403);
            this.Controls.Add(this.dgvEmpresas);
            this.Controls.Add(this.groupBox1);
            this.Controls.Add(this.menuStrip1);
            this.MainMenuStrip = this.menuStrip1;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "Form1";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Conexiones Empresas";
            this.Load += new System.EventHandler(this.Form1_Load);
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.dgvEmpresas)).EndInit();
            this.menuStrip1.ResumeLayout(false);
            this.menuStrip1.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.RadioButton rdbNuevaEmr;
        private System.Windows.Forms.RadioButton rdbEmpresaExiste;
        private System.Windows.Forms.ComboBox cbbEmpresas;
        private System.Windows.Forms.TextBox txtCadenaConexion;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TextBox txtEmpresa;
        private System.Windows.Forms.DataGridView dgvEmpresas;
        private System.Windows.Forms.DataGridViewTextBoxColumn IdEmpresa;
        private System.Windows.Forms.DataGridViewTextBoxColumn strNombreEmpresa;
        private System.Windows.Forms.DataGridViewCheckBoxColumn boolActivo;
        private System.Windows.Forms.DataGridViewButtonColumn dtFechaAlta;
        private System.Windows.Forms.DataGridViewButtonColumn dtFechaModifica;
        private System.Windows.Forms.DataGridViewButtonColumn idUsuarioAlta;
        private System.Windows.Forms.DataGridViewButtonColumn idUsuarioModifica;
        private System.Windows.Forms.DataGridViewTextBoxColumn strCadenaConexion;
        private System.Windows.Forms.DataGridViewTextBoxColumn com_clientesComConfig;
        private System.Windows.Forms.MenuStrip menuStrip1;
        private System.Windows.Forms.ToolStripMenuItem guardarToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem eliminarToolStripMenuItem;
    }
}

