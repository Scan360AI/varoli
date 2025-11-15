const Dashboard = {
    data: null,
    async init() {
        try {
            await App.init();
            this.data = App.getData();
            this.renderKPIs();
            this.renderIRPSection();
            this.renderAlerts();
        } catch (error) {
            console.error('Error initializing dashboard:', error);
        }
    },
    renderKPIs() {
        const container = document.getElementById('dashboardKPIs');
        if (!container) return;
        const kpis = this.data.kpis || {};
        const kpiConfigs = [
            { kpi: 'revenue', icon: 'fa-chart-line' },
            { kpi: 'ebitda', icon: 'fa-piggy-bank' },
            { kpi: 'netIncome', icon: 'fa-coins' },
            { kpi: 'irp', icon: 'fa-shield-alt' }
        ];
        container.innerHTML = kpiConfigs.map(cfg => {
            const kpi = kpis[cfg.kpi] || {};
            const trendDir = kpi.trend?.direction === 'up' ? 'up' : kpi.trend?.direction === 'down' ? 'down' : 'minus';
            const trendType = kpi.trend?.direction === 'up' ? 'positive' : kpi.trend?.direction === 'down' ? 'negative' : 'neutral';
            return `<div class="kpi-card-v4">
                <div class="icon-circle ${kpi.status || 'warning'}"><i class="fas ${cfg.icon}"></i></div>
                <div class="kpi-content">
                    <div class="kpi-label">${kpi.title || 'N/A'}</div>
                    <div class="kpi-value">${kpi.displayValue || '-'}</div>
                    <div class="kpi-trend ${trendType}">
                        <i class="fas fa-arrow-${trendDir}"></i>
                        <span>${kpi.trend?.displayValue || kpi.categoryLabel || '-'}</span>
                    </div>
                </div>
            </div>`;
        }).join('');
    },
    renderIRPSection() {
        const irpData = this.data.kpis?.irp || {};
        const score = irpData.value || 0;
        const category = irpData.category || 'N/A';
        const riskLevel = irpData.categoryLabel || 'Non disponibile';
        const riskClass = Utils.getRiskLevel(score);
        const scoreCircle = document.getElementById('dashboardIRPCircle');
        if (scoreCircle) scoreCircle.className = 'irp-score-circle risk-' + riskClass;
        const scoreValue = document.getElementById('dashboardIRPValue');
        if (scoreValue) scoreValue.textContent = score.toFixed(1);
        const categoryBadge = document.getElementById('dashboardIRPBadge');
        if (categoryBadge) {
            const badgeClass = irpData.status || 'danger';
            categoryBadge.className = 'badge ' + badgeClass;
            categoryBadge.textContent = 'Categoria ' + category;
        }
        const riskLevelEl = document.getElementById('dashboardRiskLevel');
        if (riskLevelEl) riskLevelEl.textContent = riskLevel;
        const visualSection = document.getElementById('dashboardIRPSection');
        if (visualSection) visualSection.className = 'irp-visual-section risk-' + riskClass;
        const marker = document.getElementById('dashboardIRPMarker');
        if (marker) marker.style.left = score + '%';
        const narrative = document.getElementById('dashboardIRPNarrative');
        if (narrative) {
            narrative.innerHTML = this.data.content?.parte1_sintesi?.irpDescription ||
                'L\'<strong>Indice di Rischio Ponderato (IRP)</strong> si attesta a <strong>' + score.toFixed(1) + '/100</strong>, collocando l\'azienda in <strong>categoria ' + category + '</strong>.';
        }
    },
    renderAlerts() {
        const container = document.getElementById('dashboardAlerts');
        if (!container) return;
        const alerts = [];
        const ebitdaMargin = this.data.kpis?.ebitdaMargin?.value || 0;
        const dso = this.data.kpis?.dso?.value || 0;
        const roe = this.data.tables?.parte2_economico?.indiciRedditività?.rows?.find(r => r.indice === 'ROE');
        if (ebitdaMargin < 0) {
            alerts.push({
                type: 'danger',
                title: 'Criticità: EBITDA Negativo',
                message: this.data.content?.parte2_economico?.ebitdaAlert?.description || 'L\'EBITDA è negativo, segnalando una grave criticità operativa.',
                action: 'Vedi Analisi Economica',
                link: 'parte2_economico.html'
            });
        }
        if (dso > 60) {
            alerts.push({
                type: 'warning',
                title: 'Attenzione: Tempi di Incasso',
                message: 'I giorni medi di incasso (DSO) sono ' + dso + ' giorni. Si raccomanda di implementare azioni per migliorare la gestione del credito.',
                action: 'Vedi Circolante e Flussi',
                link: 'parte5_circolante_flussi.html'
            });
        }
        if (roe && roe['2024'] > 15) {
            alerts.push({
                type: 'success',
                title: 'Punto di Forza: Redditività',
                message: 'Il ROE mostra performance positive nella generazione di valore dal capitale investito.',
                action: 'Vedi Analisi Economica',
                link: 'parte2_economico.html'
            });
        }
        if (alerts.length === 0) {
            alerts.push({
                type: 'info',
                title: 'Monitoraggio Attivo',
                message: 'La situazione aziendale richiede attenzione continua su tutti gli indicatori chiave.',
                action: 'Vedi Sintesi',
                link: 'parte1_sintesi.html'
            });
        }
        container.innerHTML = alerts.map(alert => `<div class="alert-box ${alert.type}"><div class="alert-title">${alert.title}</div><div class="alert-content">${alert.message}<br><a href="${alert.link}" class="btn btn-sm btn-outline-primary mt-2"><i class="fas fa-arrow-right"></i> ${alert.action}</a></div></div>`).join('');
    }
};
document.addEventListener('DOMContentLoaded', () => { Dashboard.init(); });
