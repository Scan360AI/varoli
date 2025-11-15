const IRPDettaglio = {
    data: null,
    charts: {},
    async init() {
        try {
            await App.init();
            this.data = App.getData();
            this.renderIRPMain();
            this.renderComponents();
            this.renderComposition();
            this.renderIndicators();
            this.renderTrend();
        } catch (error) {
            console.error('Error initializing IRP Dettaglio:', error);
        }
    },
    renderIRPMain() {
        const irpData = this.data.kpis?.irp || {};
        const score = irpData.value || 0;
        const category = irpData.category || 'N/A';
        const riskLevel = irpData.categoryLabel || 'Non disponibile';
        const riskClass = Utils.getRiskLevel(score);
        const scoreCircle = document.getElementById('irpMainCircle');
        if (scoreCircle) scoreCircle.className = 'irp-score-circle risk-' + riskClass;
        const scoreValue = document.getElementById('irpMainValue');
        if (scoreValue) scoreValue.textContent = score.toFixed(1);
        const categoryBadge = document.getElementById('irpMainBadge');
        if (categoryBadge) {
            categoryBadge.className = 'badge ' + (irpData.status || 'danger');
            categoryBadge.textContent = 'Categoria ' + category;
        }
        const riskLevelEl = document.getElementById('irpMainRisk');
        if (riskLevelEl) riskLevelEl.textContent = riskLevel;
        const visualSection = document.getElementById('irpMainSection');
        if (visualSection) visualSection.className = 'irp-visual-section risk-' + riskClass;
        const marker = document.getElementById('irpMainMarker');
        if (marker) marker.style.left = score + '%';
        const narrative = document.getElementById('irpMainNarrative');
        if (narrative) {
            narrative.textContent = 'L\'IRP di ' + score.toFixed(1) + '/100 (Categoria ' + category + ') riflette la situazione finanziaria dell\'azienda. ' + (irpData.description || '');
        }
    },
    renderComponents() {
        const container = document.getElementById('irpComponentsGrid');
        if (!container) return;
        const components = [
            { label: 'Solidità Patrimoniale', score: 45, weight: 30, icon: 'fa-shield-alt', iconType: 'warning' },
            { label: 'Redditività', score: 35, weight: 25, icon: 'fa-chart-line', iconType: 'danger' },
            { label: 'Liquidità', score: 65, weight: 25, icon: 'fa-tint', iconType: 'warning' },
            { label: 'Sostenibilità Debito', score: 40, weight: 20, icon: 'fa-balance-scale', iconType: 'danger' }
        ];
        container.innerHTML = components.map(comp => {
            const contribution = (comp.score * comp.weight / 100).toFixed(1);
            return '<div class="kpi-card-v4"><div class="icon-circle ' + comp.iconType + '"><i class="fas ' + comp.icon + '"></i></div><div class="kpi-content"><div class="kpi-label">' + comp.label + '</div><div class="kpi-value">' + comp.score + '/100</div><div class="kpi-subtitle">Peso: ' + comp.weight + '% • Contributo: ' + contribution + '</div></div></div>';
        }).join('');
    },
    renderComposition() {
        const ctx = document.getElementById('irpCompositionChart');
        if (!ctx) return;
        if (this.charts.composition) this.charts.composition.destroy();
        this.charts.composition = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Solidità (30%)', 'Redditività (25%)', 'Liquidità (25%)', 'Debito (20%)'],
                datasets: [{
                    data: [13.5, 8.75, 16.25, 8.0],
                    backgroundColor: ['#24b47e', '#2196F3', '#FFC107', '#191970']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
            }
        });
        const table = document.getElementById('irpWeightsTable');
        if (table) {
            table.innerHTML = '<thead><tr><th>Area</th><th class="text-right">Peso</th><th class="text-right">Contributo</th></tr></thead><tbody><tr><td>Solidità Patrimoniale</td><td class="text-right">30%</td><td class="text-right">13.5</td></tr><tr><td>Redditività</td><td class="text-right">25%</td><td class="text-right">8.8</td></tr><tr><td>Liquidità</td><td class="text-right">25%</td><td class="text-right">16.3</td></tr><tr><td>Sostenibilità Debito</td><td class="text-right">20%</td><td class="text-right">8.0</td></tr><tr><td colspan="3"></td></tr><tr class="table-primary"><td><strong>TOTALE IRP</strong></td><td class="text-right"><strong>100%</strong></td><td class="text-right"><strong>' + (this.data.kpis?.irp?.value || 0).toFixed(1) + '</strong></td></tr></tbody>';
        }
    },
    renderIndicators() {
        const container = document.getElementById('irpIndicatorsTable');
        if (!container) return;
        const indici = this.data.tables?.parte2_economico?.indiciRedditività?.rows || [];
        const rows = [
            { area: 'Solidità', indicatore: 'Indipendenza Finanziaria', valore: 'N/A', score: 45, valutazione: 'Critico' },
            { area: 'Redditività', indicatore: 'ROE', valore: (indici.find(r => r.indice === 'ROE')?.[2024] || 0).toFixed(1) + '%', score: 35, valutazione: 'Critico' },
            { area: 'Redditività', indicatore: 'ROS', valore: (indici.find(r => r.indice === 'ROS')?.[2024] || 0).toFixed(1) + '%', score: 30, valutazione: 'Critico' },
            { area: 'Liquidità', indicatore: 'Current Ratio', valore: '3.45', score: 90, valutazione: 'Ottimo' },
            { area: 'Debito', indicatore: 'D/E', valore: (this.data.kpis?.leverageDE?.displayValue || 'N/A'), score: 30, valutazione: 'Critico' }
        ];
        container.innerHTML = '<thead><tr><th>Area</th><th>Indicatore</th><th class="text-right">Valore</th><th class="text-right">Score</th><th class="text-center">Valutazione</th></tr></thead><tbody>' + rows.map(row => '<tr><td>' + row.area + '</td><td>' + row.indicatore + '</td><td class="text-right">' + row.valore + '</td><td class="text-right">' + row.score + '</td><td class="text-center"><span class="badge ' + (row.valutazione === 'Critico' ? 'danger' : row.valutazione === 'Ottimo' ? 'success' : 'warning') + '">' + row.valutazione + '</span></td></tr>').join('') + '</tbody>';
    },
    renderTrend() {
        const ctx = document.getElementById('irpTrendChart');
        if (!ctx) return;
        if (this.charts.trend) this.charts.trend.destroy();
        this.charts.trend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2022', '2023', '2024'],
                datasets: [
                    { label: 'IRP Complessivo', data: [65, 58, this.data.kpis?.irp?.value || 51], borderColor: '#191970', borderWidth: 3, tension: 0 },
                    { label: 'Solidità', data: [70, 60, 45], borderColor: '#24b47e', borderWidth: 2, tension: 0 },
                    { label: 'Redditività', data: [75, 70, 35], borderColor: '#2196F3', borderWidth: 2, tension: 0 },
                    { label: 'Liquidità', data: [65, 68, 65], borderColor: '#FFC107', borderWidth: 2, tension: 0 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
                scales: { y: { min: 0, max: 100 } }
            }
        });
    }
};
document.addEventListener('DOMContentLoaded', () => { IRPDettaglio.init(); });
