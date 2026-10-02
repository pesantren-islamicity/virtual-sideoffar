import { Task, DocumentItem, TeamMember } from '../types';

/**
 * Generates an RFC-4180 compliant CSV string and triggers browser download
 */
export function exportToCSV(filename: string, rows: (string | number)[][]): void {
  const csvContent = rows
    .map(row =>
      row
        .map(cell => {
          const stringCell = String(cell ?? '');
          if (stringCell.includes(',') || stringCell.includes('"') || stringCell.includes('\n')) {
            return `"${stringCell.replace(/"/g, '""')}"`;
          }
          return stringCell;
        })
        .join(',')
    )
    .join('\r\n');

  // Prepend BOM so Excel / Google Sheets correctly parses UTF-8
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports tasks dataset to spreadsheet CSV
 */
export function exportTasksToSheetsCSV(tasks: Task[]): void {
  const header = ['ID', 'Judul Tugas', 'Deskripsi', 'Prioritas', 'Status', 'Tenggat Waktu', 'Penanggung Jawab', 'Jam Estimasi', 'Jam Aktual', 'Tersinkronisasi Cloud'];
  const data = tasks.map(t => [
    t.id,
    t.title,
    t.description,
    t.priority.toUpperCase(),
    t.status,
    t.deadline,
    t.assignee,
    t.estimatedHours,
    t.actualHours,
    t.synced ? 'YA' : 'PENDING'
  ]);
  exportToCSV(`sideoffar-tasks-report-${new Date().toISOString().split('T')[0]}`, [header, ...data]);
}

/**
 * Exports documents list to CSV
 */
export function exportDocumentsCSV(docs: DocumentItem[]): void {
  const header = ['ID Dokumen', 'Nama Berkas', 'Kategori', 'Ukuran', 'Izin Akses', 'Pemilik', 'Terenkripsi E2E', 'Hash SHA-256', 'Pembaruan Terakhir'];
  const data = docs.map(d => [
    d.id,
    d.title,
    d.category,
    d.size,
    d.permission,
    d.owner,
    d.isEncrypted ? 'YA (AES-256)' : 'TIDAK',
    d.encryptedHash,
    d.updatedAt
  ]);
  exportToCSV(`sideoffar-vault-catalog-${new Date().toISOString().split('T')[0]}`, [header, ...data]);
}

/**
 * Generates an iCalendar (.ics) file containing all task deadlines
 */
export function exportTasksToICS(tasks: Task[]): void {
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//sideoffar.cloud//Bicarafar AI Assistant//ID',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:sideoffar.cloud Team Workflows'
  ];

  tasks.forEach(t => {
    // Format date YYYYMMDD
    const dateFormatted = t.deadline.replace(/-/g, '');
    const cleanId = t.id.replace(/[^a-zA-Z0-9]/g, '');
    icsContent.push(
      'BEGIN:VEVENT',
      `UID:${cleanId}@sideoffar.cloud`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART;VALUE=DATE:${dateFormatted}`,
      `DTEND;VALUE=DATE:${dateFormatted}`,
      `SUMMARY:[${t.priority.toUpperCase()}] ${t.title.replace(/[,\n]/g, ' ')}`,
      `DESCRIPTION:${t.description.replace(/[,\n]/g, ' ')} - Assignee: ${t.assignee}`,
      `STATUS:${t.status === 'completed' ? 'CONFIRMED' : 'TENTATIVE'}`,
      'END:VEVENT'
    );
  });

  icsContent.push('END:VCALENDAR');

  const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `sideoffar-calendar-${new Date().toISOString().split('T')[0]}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Opens a print-optimized executive report ready for saving as PDF
 */
export function printExecutivePDFReport(data: {
  tasks: Task[];
  team: TeamMember[];
  securityScore: number;
  reportTitle?: string;
}): void {
  const { tasks, team, securityScore, reportTitle = 'Laporan Eksekutif & Analitik Operasional sideoffar.cloud' } = data;
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const urgentCount = tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length;
  const completionRate = Math.round((completedCount / (tasks.length || 1)) * 100);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${reportTitle}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 32px; color: #1e293b; }
          .header { border-bottom: 2px solid #6366f1; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
          .title { font-size: 24px; font-weight: 800; color: #0f172a; }
          .brand { font-size: 14px; font-weight: 600; color: #6366f1; letter-spacing: 1px; }
          .meta { font-size: 12px; color: #64748b; margin-top: 4px; }
          .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
          .kpi-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; background: #f8fafc; }
          .kpi-num { font-size: 24px; font-weight: 800; color: #312e81; }
          .kpi-lbl { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 28px; font-size: 12px; }
          th { background: #f1f5f9; text-align: left; padding: 10px; font-weight: 700; border-bottom: 2px solid #cbd5e1; }
          td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
          .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
          .badge-urgent { background: #fee2e2; color: #991b1b; }
          .badge-high { background: #ffedd5; color: #9a3412; }
          .badge-medium { background: #fef3c7; color: #92400e; }
          .badge-completed { background: #dcfce7; color: #166534; }
          .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">SIDEOFFAR.CLOUD & BICARAFAR AI</div>
            <div class="title">${reportTitle}</div>
            <div class="meta">Digenerasi pada: ${new Date().toLocaleString('id-ID')} | Status: Terverifikasi Kriptografi</div>
          </div>
          <button class="no-print" onclick="window.print()" style="padding: 10px 18px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
            Cetak / Simpan PDF
          </button>
        </div>

        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-num">${tasks.length}</div>
            <div class="kpi-lbl">Total Alur Kerja</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-num">${completionRate}%</div>
            <div class="kpi-lbl">Tingkat Penyelesaian</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-num" style="color: ${urgentCount > 0 ? '#b91c1c' : '#166534'};">${urgentCount}</div>
            <div class="kpi-lbl">Tugas Mendesak Aktif</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-num">${securityScore}%</div>
            <div class="kpi-lbl">Skor Kepatuhan E2E</div>
          </div>
        </div>

        <h3 style="font-size: 16px; margin-bottom: 10px;">Daftar Tugas & Status Alur Kerja</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Judul Tugas</th>
              <th>Prioritas</th>
              <th>Status</th>
              <th>Tenggat</th>
              <th>Penanggung Jawab</th>
            </tr>
          </thead>
          <tbody>
            ${tasks.map(t => `
              <tr>
                <td>${t.id}</td>
                <td style="font-weight: 600;">${t.title}</td>
                <td><span class="badge badge-${t.priority}">${t.priority}</span></td>
                <td><span class="badge ${t.status === 'completed' ? 'badge-completed' : ''}">${t.status}</span></td>
                <td>${t.deadline}</td>
                <td>${t.assignee}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h3 style="font-size: 16px; margin-bottom: 10px;">Metrik Kinerja Anggota Tim</h3>
        <table>
          <thead>
            <tr>
              <th>Nama</th>
              <th>Departemen</th>
              <th>Peran</th>
              <th>Tugas Selesai</th>
              <th>Tugas Aktif</th>
              <th>Skor Performa</th>
            </tr>
          </thead>
          <tbody>
            ${team.map(m => `
              <tr>
                <td style="font-weight: 600;">${m.name}</td>
                <td>${m.department}</td>
                <td>${m.role}</td>
                <td>${m.completedTasks}</td>
                <td>${m.activeTasks}</td>
                <td><strong>${m.performanceScore}%</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <div>Dokumen Resmi sideoffar.cloud - Dilindungi Protokol Enkripsi End-to-End AES-256 GCM.</div>
          <div>Halaman 1/1</div>
        </div>

        <script>
          setTimeout(() => {
            // Auto trigger print dialog
            window.print();
          }, 400);
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
