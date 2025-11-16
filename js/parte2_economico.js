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
            this.createEconomicTrendChart();
            this.renderCostAnalysis();
            this.renderMarginalita();
            this.renderMarginalitaTable();
            this.renderRedditabilita();
            this.renderRedditabilitaTable();
            this.renderComposizioneCostiTable();
            this.renderEffettoLevaTable();
            this.createLeverageChart();
            this.renderLeverageAnalysis();
            this.renderBenchmark();
            this.renderBenchmarkTable();
            this.renderCompetitivePositioning();
            this.createBenchmarkRadarChart();
            this.renderCompetitivePositioningTable();
            this.renderGapAnalysis();
            this.renderGapAnalysisTable();
            this.renderImprovementActions();
            this.renderImprovementActionsTable();
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
    renderMarginalitaTable() {
        const container = document.getElementById('marginalitaTable');
        if (!container) return;
        const data = this.data.tables?.parte2_economico?.indiciMarginalita;
        if (!data) return;
        const thead = '<thead><tr>' + data.headers.map(h => '<th>' + h + '</th>').join('') + '</tr></thead>';
        const tbody = '<tbody>' + data.rows.map(row => {
            const cls = row.highlight ? 'table-primary fw-bold' : '';
            return '<tr class="' + cls + '"><td>' + row.indicatore + '</td><td class="text-right">' + (row['2022'] !== undefined ? row['2022'].toFixed(1) + '%' : '-') + '</td><td class="text-right">' + (row['2023'] !== undefined ? row['2023'].toFixed(1) + '%' : '-') + '</td><td class="text-right">' + (row['2024'] !== undefined ? row['2024'].toFixed(1) + '%' : '-') + '</td><td class="text-right">' + (row.benchmark !== undefined ? row.benchmark.toFixed(1) + '%' : '-') + '</td><td class="text-right ' + (row.gap < 0 ? 'text-danger' : 'text-success') + '">' + (row.gap !== undefined ? (row.gap > 0 ? '+' : '') + row.gap.toFixed(1) + ' p.p.' : '-') + '</td></tr>';
        }).join('') + '</tbody>';
        container.innerHTML = thead + tbody;
    },
    renderRedditabilitaTable() {
        const container = document.getElementById('redditabilitaTable');
        if (!container) return;
        const data = this.data.tables?.parte2_economico?.indiciRedditività;
        if (!data) return;
        const thead = '<thead><tr>' + data.headers.map(h => '<th>' + h + '</th>').join('') + '</tr></thead>';
        const tbody = '<tbody>' + data.rows.map(row => {
            const valutazioneClass = row.valutazione === 'Critico' ? 'text-danger' : row.valutazione === 'Ottimo' ? 'text-success' : 'text-warning';
            return '<tr><td>' + row.indice + '</td><td class="text-right">' + (row['2022'] !== undefined ? row['2022'].toFixed(1) + '%' : '-') + '</td><td class="text-right">' + (row['2023'] !== undefined ? row['2023'].toFixed(1) + '%' : '-') + '</td><td class="text-right">' + (row['2024'] !== undefined ? row['2024'].toFixed(1) + '%' : '-') + '</td><td class="text-right">' + (row.benchmark !== undefined ? row.benchmark.toFixed(1) + '%' : '-') + '</td><td class="text-right ' + (row.gap < 0 ? 'text-danger' : 'text-success') + '">' + (row.gap !== undefined ? (row.gap > 0 ? '+' : '') + row.gap.toFixed(1) + ' p.p.' : '-') + '</td><td class="text-center"><span class="badge bg-' + (row.valutazione === 'Critico' ? 'danger' : row.valutazione === 'Ottimo' ? 'success' : 'warning') + '">' + row.valutazione + '</span></td></tr>';
        }).join('') + '</tbody>';
        container.innerHTML = thead + tbody;
    },
    renderComposizioneCostiTable() {
        const container = document.getElementById('composizioneCostiTable');
        if (!container) return;
        const data = this.data.tables?.parte2_economico?.composizioneCosti;
        if (!data) return;
        const thead = '<thead><tr>' + data.headers.map(h => '<th>' + h + '</th>').join('') + '</tr></thead>';
        const tbody = '<tbody>' + data.rows.map(row => {
            const cls = row.highlight ? 'table-primary fw-bold' : '';
            return '<tr class="' + cls + '"><td>' + row.voce + '</td><td class="text-right">' + Utils.formatCurrency(row['2024']) + '</td><td class="text-right">' + row.pctRicavi.toFixed(1) + '%</td><td class="text-right">' + row.pctCostiTotali.toFixed(1) + '%</td><td class="text-right ' + (row.varPct < 0 ? 'text-success' : 'text-danger') + '">' + (row.varPct > 0 ? '+' : '') + row.varPct.toFixed(1) + '%</td></tr>';
        }).join('') + '</tbody>';
        container.innerHTML = thead + tbody;
    },
    renderEffettoLevaTable() {
        const container = document.getElementById('effettoLevaTable');
        if (!container) return;
        const data = this.data.tables?.parte2_economico?.effettoLeva;
        if (!data) return;
        const thead = '<thead><tr>' + data.headers.map(h => '<th>' + h + '</th>').join('') + '</tr></thead>';
        const tbody = '<tbody>' + data.rows.map(row => {
            const cls = row.highlight ? 'table-primary fw-bold' : '';
            return '<tr class="' + cls + '"><td>' + row.componente + '</td><td class="text-right">' + (row['2024'] !== undefined ? row['2024'].toFixed(2) + '%' : '-') + '</td><td>' + row.descrizione + '</td></tr>';
        }).join('') + '</tbody>';
        container.innerHTML = thead + tbody;
    },
    renderBenchmark() {
        const container = document.getElementById('benchmarkIntro');
        if (!container) return;
        const title = this.data.content?.parte2_economico?.benchmarkTitle || 'Benchmark';
        const intro = this.data.content?.parte2_economico?.benchmarkIntro || '';
        const note = this.data.content?.parte2_economico?.benchmarkNote || '';
        container.innerHTML = `<h3>${title}</h3><p>${intro}</p><div class="alert alert-warning mt-2">${note}</div>`;
    },
    renderBenchmarkTable() {
        const container = document.getElementById('benchmarkTable');
        if (!container) return;
        const data = this.data.tables?.parte2_economico?.benchmarkSettoriale;
        if (!data) return;
        const thead = '<thead><tr>' + data.headers.map(h => '<th>' + h + '</th>').join('') + '</tr></thead>';
        const tbody = '<tbody>' + data.rows.map(row => {
            return '<tr><td>' + row.indicatore + '</td><td class="text-right">' + (row.azienda !== undefined ? row.azienda.toFixed(1) + (row.unit || '%') : '-') + '</td><td class="text-right">' + (row.settore !== undefined ? row.settore.toFixed(1) + (row.unit || '%') : '-') + '</td><td class="text-right ' + (row.gap < 0 ? 'text-danger' : 'text-success') + '"><strong>' + (row.gap !== undefined ? (row.gap > 0 ? '+' : '') + row.gap.toFixed(1) + (row.unit || '%') : '-') + '</strong></td><td class="text-center"><span class="badge bg-' + (row.performance === 'Sotto media' ? 'danger' : row.performance === 'Sopra media' ? 'success' : 'warning') + '">' + row.performance + '</span></td></tr>';
        }).join('') + '</tbody>';
        container.innerHTML = thead + tbody;
    },
    createEconomicTrendChart() {
        const ctx = document.getElementById('economicTrendChart');
        if (!ctx) return;
        const chartData = this.data.charts?.reports?.parte2?.economicTrendChart;
        if (!chartData) return;
        if (this.charts.economicTrend) this.charts.economicTrend.destroy();
        this.charts.economicTrend = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        label: chartData.datasets.revenue.label,
                        data: chartData.datasets.revenue.data,
                        backgroundColor: 'rgba(40, 167, 69, 0.8)',
                        borderColor: 'rgba(40, 167, 69, 1)',
                        borderWidth: 1,
                        yAxisID: 'y'
                    },
                    {
                        label: chartData.datasets.ebitda.label,
                        data: chartData.datasets.ebitda.data,
                        backgroundColor: 'rgba(255, 193, 7, 0.8)',
                        borderColor: 'rgba(255, 193, 7, 1)',
                        borderWidth: 1,
                        yAxisID: 'y'
                    },
                    {
                        label: chartData.datasets.ebitdaMarginPercent.label,
                        data: chartData.datasets.ebitdaMarginPercent.data,
                        type: 'line',
                        borderColor: 'rgba(25, 25, 112, 1)',
                        backgroundColor: 'rgba(25, 25, 112, 0.1)',
                        borderWidth: 3,
                        pointBackgroundColor: 'rgba(25, 25, 112, 1)',
                        pointRadius: 6,
                        fill: false,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                if (context.datasetIndex === 2) {
                                    return context.dataset.label + ': ' + context.raw.toFixed(2) + '%';
                                }
                                return context.dataset.label + ': €' + context.raw + 'K';
                            }
                        }
                    }
                },
                scales: {
                    x: { display: true, title: { display: true, text: 'Anno' } },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: { display: true, text: 'Valori (€000)' }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: { display: true, text: 'EBITDA Margin (%)' },
                        grid: { drawOnChartArea: false }
                    }
                }
            }
        });
    },
    createLeverageChart() {
        const ctx = document.getElementById('leverageChart');
        if (!ctx) return;
        const chartData = this.data.charts?.reports?.parte2?.leverageChart;
        if (!chartData) return;
        if (this.charts.leverage) this.charts.leverage.destroy();
        this.charts.leverage = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        label: chartData.datasets.roi.label,
                        data: chartData.datasets.roi.data,
                        backgroundColor: 'rgba(33, 150, 243, 0.8)',
                        borderColor: 'rgba(33, 150, 243, 1)',
                        borderWidth: 1
                    },
                    {
                        label: chartData.datasets.roe.label,
                        data: chartData.datasets.roe.data,
                        backgroundColor: 'rgba(255, 193, 7, 0.8)',
                        borderColor: 'rgba(255, 193, 7, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.raw.toFixed(2) + '%';
                            }
                        }
                    }
                },
                scales: {
                    x: { display: true, title: { display: true, text: 'Anno' } },
                    y: {
                        display: true,
                        title: { display: true, text: 'Percentuale (%)' },
                        ticks: { callback: v => v.toFixed(0) + '%' }
                    }
                }
            }
        });
    },
    createBenchmarkRadarChart() {
        const ctx = document.getElementById('benchmarkRadarChart');
        if (!ctx) return;
        const chartData = this.data.charts?.reports?.parte2?.benchmarkRadarChart;
        if (!chartData) return;
        if (this.charts.benchmarkRadar) this.charts.benchmarkRadar.destroy();
        this.charts.benchmarkRadar = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        label: chartData.datasets.company.label,
                        data: chartData.datasets.company.data,
                        fill: true,
                        backgroundColor: 'rgba(220, 53, 69, 0.2)',
                        borderColor: 'rgba(220, 53, 69, 1)',
                        pointBackgroundColor: 'rgba(220, 53, 69, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(220, 53, 69, 1)',
                        borderWidth: 2
                    },
                    {
                        label: chartData.datasets.sector.label,
                        data: chartData.datasets.sector.data,
                        fill: true,
                        backgroundColor: 'rgba(40, 167, 69, 0.2)',
                        borderColor: 'rgba(40, 167, 69, 1)',
                        pointBackgroundColor: 'rgba(40, 167, 69, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(40, 167, 69, 1)',
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
                scales: {
                    r: {
                        angleLines: { display: true },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                }
            }
        });
    },
    renderCompetitivePositioning() {
        const container = document.getElementById('competitivePositioningIntro');
        if (!container) return;
        const intro = this.data.content?.parte2_economico?.competitivePositioningIntro || '';
        container.innerHTML = `<p>${intro}</p>`;
    },
    renderCompetitivePositioningTable() {
        const container = document.getElementById('competitivePositioningTable');
        if (!container) return;
        const data = this.data.tables?.parte2_economico?.benchmarkSettoriale;
        if (!data) {
            container.innerHTML = '<tr><td colspan="5">Dati non disponibili</td></tr>';
            return;
        }
        const thead = '<thead><tr>' + data.headers.map(h => '<th>' + h + '</th>').join('') + '</tr></thead>';
        const tbody = '<tbody>' + data.rows.map(row => {
            const gapClass = row.gap < 0 ? 'text-danger' : 'text-success';
            const valutazioneClass = row.valutazione === 'Critico' ? 'danger' : row.valutazione === 'Ottimo' ? 'success' : row.valutazione === 'In linea' ? 'primary' : 'warning';
            return '<tr><td>' + row.indicatore + '</td><td class="text-right">' + row.varoli.toFixed(2) + '</td><td class="text-right">' + row.settore.toFixed(2) + '</td><td class="text-right ' + gapClass + '"><strong>' + (row.gap > 0 ? '+' : '') + row.gap.toFixed(2) + '</strong></td><td class="text-center"><span class="badge bg-' + valutazioneClass + '">' + row.valutazione + '</span></td></tr>';
        }).join('') + '</tbody>';
        container.innerHTML = thead + tbody;
    },
    renderGapAnalysis() {
        const container = document.getElementById('gapAnalysisIntro');
        if (!container) return;
        const intro = this.data.content?.parte2_economico?.gapAnalysisIntro || '';
        container.innerHTML = `<p>${intro}</p>`;
    },
    renderGapAnalysisTable() {
        const container = document.getElementById('gapAnalysisTable');
        if (!container) return;
        const data = this.data.tables?.parte2_economico?.gapAnalysisBestPractice;
        if (!data) {
            container.innerHTML = '<tr><td colspan="5">Dati non disponibili</td></tr>';
            return;
        }
        const thead = '<thead><tr>' + data.headers.map(h => '<th>' + h + '</th>').join('') + '</tr></thead>';
        const tbody = '<tbody>' + data.rows.map(row => {
            const gapClass = row.gap < 0 ? 'text-danger' : row.gap === 0 ? 'text-warning' : 'text-success';
            const priorityClass = row.priorita === 'Alta' ? 'danger' : row.priorita === 'Media' ? 'warning' : 'success';
            return '<tr><td>' + row.area + '</td><td class="text-right">' + row.valoreAttuale + '</td><td class="text-right">' + row.bestPractice + '</td><td class="text-right ' + gapClass + '"><strong>' + row.gap + '</strong></td><td class="text-center"><span class="badge bg-' + priorityClass + '">' + row.priorita + '</span></td></tr>';
        }).join('') + '</tbody>';
        container.innerHTML = thead + tbody;
    },
    renderImprovementActions() {
        const container = document.getElementById('improvementActionsIntro');
        if (!container) return;
        const intro = this.data.content?.parte2_economico?.improvementActionsIntro || '';
        container.innerHTML = `<p>${intro}</p>`;
    },
    renderImprovementActionsTable() {
        const container = document.getElementById('improvementActionsTable');
        if (!container) return;
        const data = this.data.tables?.parte2_economico?.azioniMiglioramento;
        if (!data) {
            container.innerHTML = '<tr><td colspan="5">Dati non disponibili</td></tr>';
            return;
        }
        const thead = '<thead><tr>' + data.headers.map(h => '<th>' + h + '</th>').join('') + '</tr></thead>';
        const tbody = '<tbody>' + data.rows.map(row => {
            const priorityClass = row.priorita === 'Alta' ? 'danger' : row.priorita === 'Media' ? 'warning' : 'success';
            return '<tr><td>' + row.area + '</td><td>' + row.azione + '</td><td>' + row.impattoAtteso + '</td><td>' + row.tempistiche + '</td><td class="text-center"><span class="badge bg-' + priorityClass + '">' + row.priorita + '</span></td></tr>';
        }).join('') + '</tbody>';
        container.innerHTML = thead + tbody;
    }
};
document.addEventListener('DOMContentLoaded', () => { Parte2Economico.init(); });
