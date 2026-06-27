import { Controller, Get, Res, Req } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getDashboard(@Res() res: Response, @Req() req: Request) {
    const data = await this.appService.getDashboard();

    // Return JSON if requested (for testing or API calls)
    if (req.headers.accept?.includes('application/json')) {
      return res.json(data);
    }

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>${data.message} — Ledger Console</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
          <style>
            :root {
              --ink: #10172A;
              --ink-soft: #475569;
              --paper: #FAF8F3;
              --paper-raised: #FFFFFF;
              --line: #E3DFD4;
              --line-strong: #CFC9B8;
              --signal: #0F9D78;
              --signal-soft: #E4F4EE;
              --amber: #B5841F;
              --amber-soft: #FBF1DD;
              --violet: #6D5BD0;
              --violet-soft: #ECE9FB;
              --blue: #3568D4;
              --blue-soft: #E8EEFC;
              --rose: #C2486B;
              --rose-soft: #FBEAEF;
              --mono: 'IBM Plex Mono', monospace;
              --display: 'Space Grotesk', sans-serif;
              --body: 'Inter', -apple-system, sans-serif;
              --emoji: 'Noto Color Emoji', 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif;
            }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html { -webkit-font-smoothing: antialiased; }
            body {
              font-family: var(--body);
              background-color: var(--paper);
              background-image:
                linear-gradient(var(--line) 1px, transparent 1px),
                linear-gradient(90deg, var(--line) 1px, transparent 1px);
              background-size: 28px 28px;
              background-position: -1px -1px;
              color: var(--ink);
              min-height: 100vh;
              padding: 32px 24px 64px;
            }
            .dashboard { max-width: 1280px; margin: 0 auto; }
            @keyframes riseIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }

            /* ---------- Masthead ---------- */
            .masthead {
              background: var(--paper-raised);
              border: 1px solid var(--line-strong);
              border-radius: 14px;
              padding: 30px 34px;
              margin-bottom: 24px;
              position: relative;
              overflow: hidden;
              box-shadow: 0 4px 24px rgba(16, 23, 42, 0.06);
              animation: riseIn 0.5s ease both;
            }
            .masthead::before {
              content: '';
              position: absolute;
              top: 0; left: 0; right: 0;
              height: 4px;
              background: linear-gradient(90deg, var(--ink) 0%, var(--blue) 35%, var(--violet) 65%, var(--signal) 100%);
            }
            .masthead-row {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              flex-wrap: wrap;
              gap: 16px;
            }
            .masthead-eyebrow {
              font-family: var(--mono);
              font-size: 0.7rem;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              color: var(--ink-soft);
              margin-bottom: 8px;
            }
            .masthead h1 {
              font-family: var(--display);
              font-size: 2.1rem;
              font-weight: 700;
              letter-spacing: -0.015em;
              color: var(--ink);
            }
            .masthead-meta {
              text-align: right;
              font-family: var(--mono);
              font-size: 0.78rem;
              color: var(--ink-soft);
              line-height: 1.6;
            }
            .masthead-meta .status-dot {
              display: inline-block;
              width: 7px; height: 7px;
              border-radius: 50%;
              background: var(--signal);
              margin-right: 6px;
              box-shadow: 0 0 0 3px var(--signal-soft);
            }

            /* ---------- Stat cards ---------- */
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
              gap: 14px;
              margin-bottom: 24px;
            }
            .stat-card {
              background: var(--paper-raised);
              border: 1px solid var(--line-strong);
              border-radius: 12px;
              padding: 18px 20px;
              box-shadow: 0 2px 10px rgba(16, 23, 42, 0.05);
              transition: transform 0.2s ease, box-shadow 0.2s ease;
              animation: riseIn 0.5s ease both;
            }
            .stat-card:hover {
              transform: translateY(-3px);
              box-shadow: 0 10px 28px rgba(16, 23, 42, 0.10);
              border-color: var(--chip);
            }
            .stat-chip {
              width: 30px; height: 30px;
              border-radius: 9px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: var(--emoji);
              font-size: 0.95rem;
              background: var(--chip-soft);
              margin-bottom: 12px;
            }
            .stat-card .label {
              font-family: var(--mono);
              font-size: 0.64rem;
              letter-spacing: 0.07em;
              text-transform: uppercase;
              color: var(--ink-soft);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              margin-bottom: 6px;
            }
            .stat-card .value {
              font-family: var(--mono);
              font-size: 1.75rem;
              font-weight: 600;
              color: var(--ink);
              letter-spacing: -0.02em;
            }

            /* ---------- Panels row ---------- */
            .panels-row {
              display: grid;
              grid-template-columns: 1.6fr 1fr;
              gap: 18px;
              margin-bottom: 24px;
            }
            .panel {
              background: var(--paper-raised);
              border: 1px solid var(--line-strong);
              border-radius: 14px;
              padding: 26px 28px;
              box-shadow: 0 2px 10px rgba(16, 23, 42, 0.05);
              animation: riseIn 0.5s ease both;
              animation-delay: 0.1s;
            }
            .panel-head {
              display: flex;
              justify-content: space-between;
              align-items: baseline;
              margin-bottom: 20px;
              padding-bottom: 14px;
              border-bottom: 1px solid var(--line);
            }
            .panel-head h3 {
              font-family: var(--display);
              font-size: 0.95rem;
              font-weight: 600;
              color: var(--ink);
            }
            .panel-head span {
              font-family: var(--mono);
              font-size: 0.7rem;
              color: var(--ink-soft);
            }

            /* Distribution rows (replacing bar chart with ledger-style horizontal bars) */
            .dist-row {
              display: grid;
              grid-template-columns: 150px 1fr 56px;
              align-items: center;
              gap: 14px;
              padding: 10px 0;
              border-bottom: 1px solid var(--line);
            }
            .dist-row:last-child { border-bottom: none; }
            .dist-label {
              font-family: var(--mono);
              font-size: 0.7rem;
              color: var(--ink-soft);
              text-transform: uppercase;
              letter-spacing: 0.03em;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              display: flex;
              align-items: center;
              gap: 6px;
            }
            .dist-label .ic { font-family: var(--emoji); flex-shrink: 0; }
            .dist-track {
              height: 9px;
              background: var(--paper);
              border: 1px solid var(--line);
              border-radius: 5px;
              overflow: hidden;
            }
            .dist-fill {
              height: 100%;
              background: linear-gradient(90deg, var(--ink), var(--blue));
              width: 0%;
              border-radius: 5px;
              transition: width 0.9s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .dist-val {
              font-family: var(--mono);
              font-size: 0.78rem;
              text-align: right;
              color: var(--ink);
              font-weight: 500;
            }

            /* Summary panel */
            .summary-total {
              font-family: var(--mono);
              font-size: 2.8rem;
              font-weight: 700;
              letter-spacing: -0.02em;
              line-height: 1;
              background: linear-gradient(135deg, var(--ink), var(--blue));
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
            }
            .summary-caption {
              font-family: var(--mono);
              font-size: 0.7rem;
              color: var(--ink-soft);
              text-transform: uppercase;
              letter-spacing: 0.08em;
              margin-top: 6px;
              margin-bottom: 18px;
            }
            .summary-line {
              display: flex;
              justify-content: space-between;
              padding: 9px 0;
              border-bottom: 1px dashed var(--line-strong);
              font-size: 0.85rem;
            }
            .summary-line:last-child { border-bottom: none; }
            .summary-line .k { color: var(--ink-soft); }
            .summary-line .v { font-family: var(--mono); font-weight: 500; color: var(--ink); }

            /* ---------- Activity ---------- */
            .activity-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 18px;
              margin-bottom: 24px;
            }
            .activity-card {
              background: var(--paper-raised);
              border: 1px solid var(--line-strong);
              border-radius: 14px;
              padding: 24px 28px;
              box-shadow: 0 2px 10px rgba(16, 23, 42, 0.05);
              animation: riseIn 0.5s ease both;
              animation-delay: 0.15s;
            }
            .activity-card .panel-head h3 { font-size: 0.95rem; }
            .activity-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 12px 4px;
              margin: 0 -4px;
              border-bottom: 1px solid var(--line);
              border-radius: 3px;
              transition: background 0.15s ease;
            }
            .activity-item:hover { background: var(--paper); }
            .activity-item:last-child { border-bottom: none; }
            .activity-name {
              color: var(--ink);
              font-size: 0.86rem;
              font-weight: 500;
            }
            .activity-email {
              color: var(--ink-soft);
              font-size: 0.75rem;
              font-family: var(--mono);
            }
            .activity-date {
              font-family: var(--mono);
              color: var(--ink-soft);
              font-size: 0.72rem;
              white-space: nowrap;
            }
            .role-badge {
              padding: 3px 10px;
              border-radius: 6px;
              font-family: var(--mono);
              font-size: 0.62rem;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.04em;
              margin-right: 8px;
            }
            .role-badge.admin { background: var(--amber-soft); color: var(--amber); }
            .role-badge.user { background: var(--signal-soft); color: var(--signal); }
            .empty-note {
              color: var(--ink-soft);
              font-size: 0.82rem;
              font-family: var(--mono);
              padding: 8px 0;
            }

            /* ---------- Links ---------- */
            .links-panel {
              background: var(--paper-raised);
              border: 1px solid var(--line-strong);
              border-radius: 14px;
              padding: 24px 28px;
              margin-bottom: 24px;
              box-shadow: 0 2px 10px rgba(16, 23, 42, 0.05);
            }
            .links {
              display: flex;
              gap: 12px;
              flex-wrap: wrap;
            }
            .btn {
              display: inline-flex;
              align-items: center;
              gap: 9px;
              padding: 11px 22px;
              border-radius: 9px;
              text-decoration: none;
              font-weight: 500;
              font-size: 0.82rem;
              font-family: var(--body);
              transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease, color 0.15s ease;
              border: 1px solid var(--ink);
              cursor: pointer;
              color: var(--ink);
              background: transparent;
            }
            .btn:hover { background: var(--ink); color: var(--paper-raised); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(16, 23, 42, 0.18); }
            .btn-primary { background: var(--ink); color: var(--paper-raised); }
            .btn-primary:hover { background: #000; }
            .btn-signal { border-color: var(--signal); color: var(--signal); }
            .btn-signal:hover { background: var(--signal); color: #fff; box-shadow: 0 8px 20px rgba(15, 157, 120, 0.25); }

            /* ---------- Footer ---------- */
            .footer {
              text-align: center;
              padding: 28px 0 4px;
              margin-top: 8px;
              border-top: 1px solid var(--line);
              color: var(--ink-soft);
              font-size: 0.75rem;
              font-family: var(--mono);
            }
            .footer a { color: var(--ink); text-decoration: none; border-bottom: 1px solid var(--line-strong); }
            .footer a:hover { border-color: var(--ink); }

            @media (max-width: 860px) {
              .panels-row, .activity-grid { grid-template-columns: 1fr; }
              .masthead-row { flex-direction: column; align-items: flex-start; }
              .masthead-meta { text-align: left; }
            }
          </style>
        </head>
        <body>
          <div class="dashboard">

            <!-- Masthead -->
            <div class="masthead">
              <div class="masthead-row">
                <div>
                  <div class="masthead-eyebrow">Subscription &amp; Billing Ledger</div>
                  <h1>${data.message}</h1>
                </div>
                <div class="masthead-meta">
                  <div><span class="status-dot"></span>System online · v${data.version}</div>
                  <div>As of ${new Date(data.timestamp).toLocaleString()}</div>
                </div>
              </div>
            </div>

            <!-- Stat cards -->
            <div class="stats-grid">
              ${Object.entries(data.database.stats).map(([key, value], i) => `
                <div class="stat-card" style="--chip:${getAccent(key)};--chip-soft:${getAccentSoft(key)};animation-delay:${i * 0.05}s">
                  <div class="stat-chip">${getIcon(key)}</div>
                  <div class="label">${formatLabel(key)}</div>
                  <div class="value">${String(value).padStart(2, '0')}</div>
                </div>
              `).join('')}
            </div>

            <!-- Distribution + Summary -->
            <div class="panels-row">
              <div class="panel">
                <div class="panel-head">
                  <h3>Record Distribution</h3>
                  <span>by table</span>
                </div>
                ${generateDistribution(data.database.stats)}
              </div>
              <div class="panel">
                <div class="panel-head">
                  <h3>System Summary</h3>
                  <span>total</span>
                </div>
                <div class="summary-total">${data.database.totalRecords}</div>
                <div class="summary-caption">Total records across all tables</div>
                <div class="summary-line"><span class="k">🏢 Tenants</span><span class="v">${data.database.stats.tenants}</span></div>
                <div class="summary-line"><span class="k">👤 Users</span><span class="v">${data.database.stats.users}</span></div>
                <div class="summary-line"><span class="k">🔄 Subscriptions</span><span class="v">${data.database.stats.subscriptions}</span></div>
                <div class="summary-line"><span class="k">📄 Invoices</span><span class="v">${data.database.stats.invoices}</span></div>
              </div>
            </div>

            <!-- Recent activity -->
            <div class="activity-grid">
              <div class="activity-card">
                <div class="panel-head"><h3>🏢 Recent Tenants</h3><span>latest</span></div>
                ${data.recentActivity.tenants.map(t => `
                  <div class="activity-item">
                    <div>
                      <div class="activity-name">${t.name}</div>
                      <div class="activity-email">${t.email}</div>
                    </div>
                    <div class="activity-date">${new Date(t.createdAt).toLocaleDateString()}</div>
                  </div>
                `).join('') || '<div class="empty-note">No tenants found</div>'}
              </div>
              <div class="activity-card">
                <div class="panel-head"><h3>👤 Recent Users</h3><span>latest</span></div>
                ${data.recentActivity.users.map(u => `
                  <div class="activity-item">
                    <div>
                      <div class="activity-name">${u.name}</div>
                      <div class="activity-email">${u.email}</div>
                    </div>
                    <div style="display:flex;align-items:center;">
                      <span class="role-badge ${u.role === 'ADMIN' ? 'admin' : 'user'}">${u.role}</span>
                      <div class="activity-date">${new Date(u.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                `).join('') || '<div class="empty-note">No users found</div>'}
              </div>
            </div>

            <!-- Links -->
            <div class="links-panel">
              <div class="links">
                <a href="${data.links.swagger}" class="btn btn-primary">📚 Swagger API Docs</a>
                <a href="${data.links.prismaStudio}" class="btn btn-signal">🗄️ Prisma Studio</a>
                <a href="${data.links.github}" class="btn" target="_blank">🐙 GitHub Repository</a>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p>
                © ${new Date().getFullYear()} <a href="https://github.com/Islam412/SaaS-Subscription-Management-System" target="_blank">SaaS Subscription Management System</a>
                · Built with NestJS, Prisma &amp; PostgreSQL
              </p>
            </div>
          </div>

          <script>
            document.addEventListener('DOMContentLoaded', () => {
              document.querySelectorAll('.dist-fill').forEach((el, i) => {
                const w = el.getAttribute('data-width');
                setTimeout(() => { el.style.width = w + '%'; }, 150 + i * 70);
              });
            });
          </script>
        </body>
      </html>
    `);
  }
}

// ---------- Helper functions ----------
function getAccent(key: string) {
  const colors: Record<string, string> = {
    tenants: 'var(--blue)',
    users: 'var(--violet)',
    customers: 'var(--rose)',
    subscriptionPlans: 'var(--amber)',
    subscriptions: 'var(--signal)',
    invoices: 'var(--blue)',
    payments: 'var(--rose)',
    accounts: 'var(--violet)',
    journalEntries: 'var(--amber)',
    journalLines: 'var(--signal)',
  };
  return colors[key] || 'var(--ink)';
}

function getAccentSoft(key: string) {
  const colors: Record<string, string> = {
    tenants: 'var(--blue-soft)',
    users: 'var(--violet-soft)',
    customers: 'var(--rose-soft)',
    subscriptionPlans: 'var(--amber-soft)',
    subscriptions: 'var(--signal-soft)',
    invoices: 'var(--blue-soft)',
    payments: 'var(--rose-soft)',
    accounts: 'var(--violet-soft)',
    journalEntries: 'var(--amber-soft)',
    journalLines: 'var(--signal-soft)',
  };
  return colors[key] || 'var(--paper)';
}

function getIcon(key: string) {
  const icons: Record<string, string> = {
    tenants: '🏢',
    users: '👤',
    customers: '👥',
    subscriptionPlans: '📋',
    subscriptions: '🔄',
    invoices: '📄',
    payments: '💳',
    accounts: '📊',
    journalEntries: '📝',
    journalLines: '📏',
  };
  return icons[key] || '📌';
}

function formatLabel(key: string) {
  const labels: Record<string, string> = {
    tenants: 'Tenants',
    users: 'Users',
    customers: 'Customers',
    subscriptionPlans: 'Plans',
    subscriptions: 'Subscriptions',
    invoices: 'Invoices',
    payments: 'Payments',
    accounts: 'Accounts',
    journalEntries: 'Journal Entries',
    journalLines: 'Journal Lines',
  };
  return labels[key] || key;
}

function generateDistribution(stats: Record<string, number>) {
  const items = Object.entries(stats);
  const max = Math.max(...items.map(([, v]) => v), 1);
  return items
    .map(([key, value]) => {
      const pct = Math.max((value / max) * 100, 3);
      return `
        <div class="dist-row">
          <div class="dist-label"><span class="ic">${getIcon(key)}</span> ${formatLabel(key)}</div>
          <div class="dist-track"><div class="dist-fill" data-width="${pct}"></div></div>
          <div class="dist-val">${value}</div>
        </div>
      `;
    })
    .join('');
}