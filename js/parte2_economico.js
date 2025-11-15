const Parte2Economico = {
    data: null,
    charts: {},
    async init() {
        try {
            await App.init();
            this.data = App.getData();
            this.renderSectionIntro();
            this.renderRevenueAnalysis();
            this.renderContoEconomico();
            this.renderCostAnalysis();
            this.renderMarginalita();
            this.renderRedditabilita();
            this.renderLeverageAnalysis();
            this.renderBenchmark();
        } catch (error) {
            console.error('Error initializing Parte 2:', error);
        }
    },
    renderSectionIntro() {
        const container = document.getElementById('sectionIntro');
        if (!container) return;
        const intro = this.data.content?.parte2_economico?.sectionIntro || '';
        container.innerHTML = `<div class="alert alert-info"><i class="fas fa-info-circle me-2"></i>${intro}</div>`;
    },
    renderRevenueAnalysis() {
        const container = document.getElementById('revenueAnalysis');
        if (!container) return;
        const ebitdaAlert = this.data.content?.parte2_economico?.ebitdaAlert || {};
        const revenueText = this.data.content?.parte2_economico?.revenueAnalysis || '';
        const title = this.data.content?.parte2_economico?.revenueTitle || 'Analisi Ricavi';
        container.innerHTML = `
            <div class="content-section">
                <div class="section-header"><h3>${title}</h3></div>
                <p>${revenueText}</p>
            </div>
            <div class="alert alert-danger mt-3">
                <h5 class="alert-heading"><i class="fas fa-exclamation-triangle me-2"></i>${ebitdaAlert.title || ''}</h5>
                <p style="margin:0;">${ebitdaAlert.description || ''}</p>
            </div>`;
    },
    renderContoEconomico() {
        const container = document.getElementById('contoEconomicoTable');
        if (!container) return;
        const data = this.data.tables?.parte2_economico?.contoEconomicoRiclassificato;
        if (!data) {
            container.innerHTML = '<tr><td colspan="8">Dati non disponibili</td></tr>';
            return;
        }
        const thead = '<thead><tr>' + data.headers.map(h => '<th>' + h + '</th>').join('') + '</tr></thead>';
        const tbody = '<tbody>' + data.rows.map(row => {
            const cls = row.highlight ? 'table-primary' : '';
            return '<tr class="' + cls + '"><td>' + row.voce + '</td><td class="text-right">' + (row['2022'] ? Utils.formatCurrency(row['2022']) : '-') + '</td><td class="text-right">' + (row.pct2022 ? row.pct2022.toFixed(1) + '%' : '-') + '</td><td class="text-right">' + (row['2023'] ? Utils.formatCurrency(row['2023']) : '-') + '</td><td class="text-right">' + (row.pct2023 ? row.pct2023.toFixed(1) + '%' : '-') + '</td><td class="text-right">' + (row['2024'] ? Utils.formatCurrency(row['2024']) : '-') + '</td><td class="text-right">' + (row.pct2024 ? row.pct2024.toFixed(1) + '%' : '-') + '</td><td class="text-right">' + (row.var ? row.var.toFixed(1) + '%' : '-') + '</td></tr>';
        }).join('') + '</tbody>';
        container.innerHTML = thead + tbody;
    },
    renderCostAnalysis() {
        const container = document.getElementById('costAnalysis');
        if (!container) return;
        const title = this.data.content?.parte2_economico?.costTitle || 'Analisi Costi';
        const text = this.data.content?.parte2_economico?.costAnalysis || '';
        const valueAddedNote = this.data.content?.parte2_economico?.valueAddedNote || '';
        container.innerHTML = `
            <div class="content-section">
                <div class="section-header"><h3>${title}</h3></div>
                <p>${text}</p>
                <div class="alert alert-warning mt-2"><strong>Valore Aggiunto:</strong> ${valueAddedNote}</div>
            </div>`;
    },
    renderMarginalita() {
        const container = document.getElementById('marginalitaGrid');
        if (!container) return;
        const marginIntro = document.getElementById('marginIntro');
        if (marginIntro) {
            const title = this.data.content?.parte2_economico?.marginTitle || '';
            const text = this.data.content?.parte2_economico?.marginAnalysis || '';
            marginIntro.innerHTML = `<h3>${title}</h3><p>${text}</p>`;
        }
        const margini = this.data.tables?.parte2_economico?.indiciMarginalita?.rows || [];
        const kpis = this.data.kpis || {};
        container.innerHTML = '<div class="kpi-card-v4"><div class="icon-circle success"><i class="fas fa-chart-line"></i></div><div class="kpi-content"><div class="kpi-label">Valore Aggiunto</div><div class="kpi-value">' + (margini.find(m => m.indicatore === 'Valore Aggiunto/Ricavi')?.[2024] || '-') + '%</div><div class="kpi-subtitle">su Ricavi</div></div></div><div class="kpi-card-v4"><div class="icon-circle warning"><i class="fas fa-percentage"></i></div><div class="kpi-content"><div class="kpi-label">EBITDA Margin</div><div class="kpi-value">' + (kpis.ebitdaMargin?.displayValue || '-') + '</div><div class="kpi-subtitle">' + (kpis.ebitdaMargin?.description || '') + '</div></div></div><div class="kpi-card-v4"><div class="icon-circle warning"><i class="fas fa-chart-area"></i></div><div class="kpi-content"><div class="kpi-label">ROS (EBIT Margin)</div><div class="kpi-value">' + (margini.find(m => m.indicatore === 'ROS (EBIT/Ricavi)')?.[2024] || '-') + '%</div><div class="kpi-subtitle">Reddito Operativo</div></div></div><div class="kpi-card-v4"><div class="icon-circle danger"><i class="fas fa-trophy"></i></div><div class="kpi-content"><div class="kpi-label">Margine Netto</div><div class="kpi-value">' + (margini.find(m => m.indicatore === 'Utile Netto/Ricavi')?.[2024] || '-') + '%</div><div class="kpi-subtitle">Utile su Ricavi</div></div></div>';
        this.createMarginalitaChart();
    },
    createMarginalitaChart() {
        const ctx = document.getElementById('marginalitaChart');
        if (!ctx) return;
        const chartData = this.data.charts?.reports?.parte2?.marginalityChart;
        if (!chartData) return;
        if (this.charts.marginalita) this.charts.marginalita.destroy();
        this.charts.marginalita = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: Object.keys(chartData.datasets).map(key => ({
                    label: chartData.datasets[key].label,
                    data: chartData.datasets[key].data,
                    borderColor: ['#24b47e', '#2196F3', '#FFC107', '#191970'][Object.keys(chartData.datasets).indexOf(key)],
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    tension: 0
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
                scales: { y: { beginAtZero: true, ticks: { callback: v => v + '%' } } }
            }
        });
    },
    renderRedditabilita() {
        const container = document.getElementById('reditabilitaGrid');
        if (!container) return;
        const profIntro = document.getElementById('profitabilityIntro');
        if (profIntro) {
            const title = this.data.content?.parte2_economico?.profitabilityTitle || '';
            const text = this.data.content?.parte2_economico?.profitabilityIntro || '';
            profIntro.innerHTML = `<h3>${title}</h3><p>${text}</p>`;
        }
        const redditabilita = this.data.tables?.parte2_economico?.indiciRedditività?.rows || [];
        ['ROE', 'ROI', 'ROS', 'EBITDA Margin'].forEach(indice => {
            const row = redditabilita.find(r => r.indice === indice);
            if (!row) return;
            const val = row['2024'] || 0;
            const status = row.valutazione === 'Critico' ? 'danger' : row.valutazione === 'Ottimo' ? 'success' : 'warning';
            container.innerHTML += '<div class="kpi-card-v4"><div class="icon-circle ' + status + '"><i class="fas fa-chart-pie"></i></div><div class="kpi-content"><div class="kpi-label">' + indice + '</div><div class="kpi-value">' + val.toFixed(1) + '%</div><div class="kpi-subtitle">' + row.valutazione + '</div></div></div>';
        });
        const profNote = document.getElementById('profitabilityNote');
        if (profNote) profNote.innerHTML = `<div class="alert alert-danger mt-3">${this.data.content?.parte2_economico?.profitabilityNote || ''}</div>`;
        this.createRedditabilitaChart();
    },
    createRedditabilitaChart() {
        const ctx = document.getElementById('reditabilitaChart');
        if (!ctx) return;
        const chartData = this.data.charts?.reports?.parte2?.profitabilityIndicesChart;
        if (!chartData) return;
        if (this.charts.reditabilita) this.charts.reditabilita.destroy();
        this.charts.reditabilita = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: Object.keys(chartData.datasets).map(key => ({
                    label: chartData.datasets[key].label,
                    data: chartData.datasets[key].data,
                    borderColor: ['#24b47e', '#2196F3', '#FFC107'][Object.keys(chartData.datasets).indexOf(key)],
                    tension: 0
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
                scales: { y: { ticks: { callback: v => v + '%' } } }
            }
        });
    },
    renderLeverageAnalysis() {
        const container = document.getElementById('leverageAnalysis');
        if (!container) return;
        const title = this.data.content?.parte2_economico?.leverageTitle || 'Effetto Leva';
        const text = this.data.content?.parte2_economico?.leverageNote || '';
        container.innerHTML = `
            <div class="content-section">
                <div class="section-header"><h3>${title}</h3></div>
                <div class="alert alert-danger">${text}</div>
            </div>`;
    },
    renderBenchmark() {
        const container = document.getElementById('benchmarkIntro');
        if (!container) return;
        const title = this.data.content?.parte2_economico?.benchmarkTitle || 'Benchmark';
        const intro = this.data.content?.parte2_economico?.benchmarkIntro || '';
        const note = this.data.content?.parte2_economico?.benchmarkNote || '';
        container.innerHTML = `<h3>${title}</h3><p>${intro}</p><div class="alert alert-warning mt-2">${note}</div>`;
    }
};
document.addEventListener('DOMContentLoaded', () => { Parte2Economico.init(); });
