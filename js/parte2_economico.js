const Parte2Economico = {
    data: null,
    charts: {},
    async init() {
        try {
            await App.init();
            this.data = App.getData();
            this.renderContoEconomico();
            this.renderMarginalita();
            this.renderRedditabilita();
            this.renderValoreAggiunto();
            this.renderRicaviTrend();
        } catch (error) {
            console.error('Error initializing Parte 2:', error);
        }
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
    renderMarginalita() {
        const container = document.getElementById('marginalitaGrid');
        if (!container) return;
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
        const redditabilita = this.data.tables?.parte2_economico?.indiciRedditività?.rows || [];
        ['ROE', 'ROI', 'ROS', 'EBITDA Margin'].forEach(indice => {
            const row = redditabilita.find(r => r.indice === indice);
            if (!row) return;
            const val = row['2024'] || 0;
            const status = row.valutazione === 'Critico' ? 'danger' : row.valutazione === 'Ottimo' ? 'success' : 'warning';
            container.innerHTML += '<div class="kpi-card-v4"><div class="icon-circle ' + status + '"><i class="fas fa-chart-pie"></i></div><div class="kpi-content"><div class="kpi-label">' + indice + '</div><div class="kpi-value">' + val.toFixed(1) + '%</div><div class="kpi-subtitle">' + row.valutazione + '</div></div></div>';
        });
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
    renderValoreAggiunto() {
        const table = document.getElementById('valoreAggiuntoTable');
        if (table) table.innerHTML = '<tr><td>Dati VA placeholder</td></tr>';
    },
    renderRicaviTrend() {
        const ctx = document.getElementById('ricaviTrendChart');
        if (!ctx) return;
        const chartData = this.data.charts?.reports?.parte2?.economicTrendChart;
        if (!chartData) return;
        if (this.charts.ricaviTrend) this.charts.ricaviTrend.destroy();
        this.charts.ricaviTrend = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: Object.keys(chartData.datasets).map(key => {
                    const ds = chartData.datasets[key];
                    return {
                        label: ds.label,
                        data: ds.data,
                        type: ds.type || 'bar',
                        yAxisID: ds.yAxisID || 'y',
                        borderColor: '#191970',
                        backgroundColor: ['#191970', '#24b47e', '#2196F3'][Object.keys(chartData.datasets).indexOf(key)]
                    };
                })
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }
};
document.addEventListener('DOMContentLoaded', () => { Parte2Economico.init(); });
