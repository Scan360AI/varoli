const DashboardV2 = {
    data: null,
    charts: {},
    async init() {
        try {
            await App.init();
            this.data = App.getData();
            this.renderWelcome();
            this.renderIRPSummary();
            this.renderKPICards();
            this.renderKeyHighlights();
            this.renderUrgentActions();
        } catch (error) {
            console.error('Error initializing Dashboard:', error);
        }
    },
    renderWelcome() {
        const container = document.getElementById('welcomeMessage');
        if (!container) return;
        const welcome = this.data.content?.dashboard_v2?.welcomeMessage || '';
        const navGuide = this.data.content?.dashboard_v2?.navigationGuide || '';
        container.innerHTML = `<div class="alert alert-info"><i class="fas fa-info-circle me-2"></i>${welcome}</div><p class="text-muted">${navGuide}</p>`;
    },
    renderIRPSummary() {
        const container = document.getElementById('irpSummary');
        if (!container) return;
        const irp = this.data.kpis?.irp || {};
        const summary = this.data.content?.dashboard_v2?.irpSummary || '';
        const score = irp.value || 0;
        const riskClass = Utils.getRiskLevel(score);
        container.innerHTML = `
            <div class="row align-items-center">
                <div class="col-md-3 text-center">
                    <div class="irp-score-circle risk-${riskClass}">
                        <div class="irp-score-value">${score.toFixed(1)}</div>
                        <div class="irp-score-max">/ 100</div>
                    </div>
                </div>
                <div class="col-md-9">
                    <h3>Indice di Rischio Ponderato</h3>
                    <span class="badge ${irp.status || 'danger'}">Categoria ${irp.category || 'D+'}</span>
                    <p class="mt-3">${summary}</p>
                    <a href="irp_dettaglio.html" class="btn btn-sm btn-outline-primary mt-2">
                        <i class="fas fa-arrow-right"></i> Vai al dettaglio IRP
                    </a>
                </div>
            </div>`;
    },
    renderKPICards() {
        const container = document.getElementById('kpiMainGrid');
        if (!container) return;
        const kpis = this.data.kpis || {};
        const kpiConfigs = [
            { kpi: 'revenue', icon: 'fa-chart-line', link: 'parte2_economico.html' },
            { kpi: 'ebitda', icon: 'fa-piggy-bank', link: 'parte2_economico.html' },
            { kpi: 'equity', icon: 'fa-university', link: 'parte3_patrimoniale.html' },
            { kpi: 'liquidity', icon: 'fa-coins', link: 'parte3_patrimoniale.html' },
            { kpi: 'leverageDE', icon: 'fa-balance-scale', link: 'parte3_patrimoniale.html' },
            { kpi: 'dso', icon: 'fa-calendar-check', link: 'parte5_circolante_flussi.html' }
        ];
        container.innerHTML = kpiConfigs.map(cfg => {
            const kpi = kpis[cfg.kpi] || {};
            const trendDir = kpi.trend?.direction === 'up' ? 'up' : kpi.trend?.direction === 'down' ? 'down' : 'minus';
            const trendType = kpi.trend?.direction === 'up' ? 'positive' : kpi.trend?.direction === 'down' ? 'negative' : 'neutral';
            return `<a href="${cfg.link}" style="text-decoration: none; color: inherit;"><div class="kpi-card-v4">
                <div class="icon-circle ${kpi.status || 'warning'}"><i class="fas ${cfg.icon}"></i></div>
                <div class="kpi-content">
                    <div class="kpi-label">${kpi.title || 'N/A'}</div>
                    <div class="kpi-value">${kpi.displayValue || '-'}</div>
                    <div class="kpi-trend ${trendType}">
                        <i class="fas fa-arrow-${trendDir}"></i>
                        <span>${kpi.trend?.displayValue || '-'} ${kpi.trend?.label || ''}</span>
                    </div>
                </div>
            </div></a>`;
        }).join('');
    },
    renderKeyHighlights() {
        const container = document.getElementById('keyHighlights');
        if (!container) return;
        const highlights = this.data.content?.dashboard_v2?.keyHighlights || '';
        container.innerHTML = `<div class="alert alert-warning"><h5 class="alert-heading"><i class="fas fa-lightbulb me-2"></i>Evidenze Principali</h5><p style="margin:0;">${highlights}</p></div>`;
    },
    renderUrgentActions() {
        const container = document.getElementById('urgentActions');
        if (!container) return;
        const actions = this.data.content?.dashboard_v2?.urgentActions || '';
        container.innerHTML = `<div class="alert alert-danger"><h5 class="alert-heading"><i class="fas fa-exclamation-triangle me-2"></i>Azioni Urgenti Richieste</h5><p style="margin:0;">${actions}</p><a href="parte6_rischi-raccomandazioni.html" class="btn btn-sm btn-danger mt-2"><i class="fas fa-arrow-right"></i> Vai al Piano d'Azione</a></div>`;
    }
};
document.addEventListener('DOMContentLoaded', () => { DashboardV2.init(); });
