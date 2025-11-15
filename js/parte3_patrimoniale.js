const Parte3Patrimoniale = {
    data: null,
    charts: {},
    async init() {
        try {
            await App.init();
            this.data = App.getData();
            this.renderSectionIntro();
            this.renderEquityAlert();
            this.renderPFNAnalysis();
            this.renderDebtAnalysis();
            this.renderBalanceSheetIntro();
            this.renderStatoPatrimoniale();
            this.renderPFNTable();
            this.renderIndiciSoliditaTable();
            this.renderSolidityAnalysis();
            this.renderLiquidityNote();
        } catch (error) {
            console.error('Error initializing Parte 3:', error);
        }
    },
    renderSectionIntro() {
        const container = document.getElementById('sectionIntro');
        if (!container) return;
        const intro = this.data.content?.parte3_patrimoniale?.sectionIntro || '';
        container.innerHTML = `<div class="alert alert-info"><i class="fas fa-info-circle me-2"></i>${intro}</div>`;
    },
    renderEquityAlert() {
        const container = document.getElementById('equityAlert');
        if (!container) return;
        const alert = this.data.content?.parte3_patrimoniale?.equityAlert || {};
        container.innerHTML = `<div class="alert alert-danger"><h5 class="alert-heading"><i class="fas fa-exclamation-triangle me-2"></i>${alert.title || ''}</h5><p style="margin:0;">${alert.description || ''}</p></div>`;
    },
    renderPFNAnalysis() {
        const container = document.getElementById('pfnAnalysis');
        if (!container) return;
        const title = this.data.content?.parte3_patrimoniale?.pfnTitle || 'PFN';
        const text = this.data.content?.parte3_patrimoniale?.pfnAnalysis || '';
        container.innerHTML = `<div class="content-section"><h3>${title}</h3><div class="alert alert-warning">${text}</div></div>`;
    },
    renderDebtAnalysis() {
        const container = document.getElementById('debtAnalysis');
        if (!container) return;
        const title = this.data.content?.parte3_patrimoniale?.debtTitle || 'Indebitamento';
        const text = this.data.content?.parte3_patrimoniale?.debtAnalysis || '';
        container.innerHTML = `<div class="content-section"><h3>${title}</h3><p>${text}</p></div>`;
    },
    renderBalanceSheetIntro() {
        const container = document.getElementById('balanceSheetIntro');
        if (!container) return;
        const intro = this.data.content?.parte3_patrimoniale?.balanceSheetIntro || '';
        const assetsComp = this.data.content?.parte3_patrimoniale?.assetsComposition || '';
        const liabComp = this.data.content?.parte3_patrimoniale?.liabilitiesComposition || '';
        container.innerHTML = `<p>${intro}</p><div class="row"><div class="col-md-6"><div class="alert alert-light"><strong>Impieghi:</strong> ${assetsComp}</div></div><div class="col-md-6"><div class="alert alert-light"><strong>Fonti:</strong> ${liabComp}</div></div></div>`;
    },
    renderStatoPatrimoniale() {
        const impieghiTable = document.getElementById('impieghiTable');
        const fontiTable = document.getElementById('fontiTable');
        const impieghi = this.data.tables?.parte3_patrimoniale?.statoPatrimonialeImpieghi;
        const fonti = this.data.tables?.parte3_patrimoniale?.statoPatrimonialeFonti;
        if (impieghiTable && impieghi) {
            const thead = '<thead><tr>' + impieghi.headers.map(h => '<th>' + h + '</th>').join('') + '</tr></thead>';
            const tbody = '<tbody>' + impieghi.rows.map(row => {
                const cls = row.highlight ? 'table-primary' : '';
                return '<tr class="' + cls + '"><td>' + row.categoria + '</td><td class="text-right">' + Utils.formatCurrency(row['2022']) + '</td><td class="text-right">' + row.pct2022.toFixed(1) + '%</td><td class="text-right">' + Utils.formatCurrency(row['2023']) + '</td><td class="text-right">' + row.pct2023.toFixed(1) + '%</td><td class="text-right">' + Utils.formatCurrency(row['2024']) + '</td><td class="text-right">' + row.pct2024.toFixed(1) + '%</td><td class="text-right">' + row.var.toFixed(1) + '%</td></tr>';
            }).join('') + '</tbody>';
            impieghiTable.innerHTML = thead + tbody;
        }
        if (fontiTable && fonti) {
            const thead = '<thead><tr>' + fonti.headers.map(h => '<th>' + h + '</th>').join('') + '</tr></thead>';
            const tbody = '<tbody>' + fonti.rows.map(row => {
                const cls = row.highlight ? 'table-primary' : '';
                return '<tr class="' + cls + '"><td>' + row.categoria + '</td><td class="text-right">' + Utils.formatCurrency(row['2022']) + '</td><td class="text-right">' + row.pct2022.toFixed(1) + '%</td><td class="text-right">' + Utils.formatCurrency(row['2023']) + '</td><td class="text-right">' + row.pct2023.toFixed(1) + '%</td><td class="text-right">' + Utils.formatCurrency(row['2024']) + '</td><td class="text-right">' + row.pct2024.toFixed(1) + '%</td><td class="text-right">' + row.var.toFixed(1) + '%</td></tr>';
            }).join('') + '</tbody>';
            fontiTable.innerHTML = thead + tbody;
        }
    },
    renderPFNTable() {
        const container = document.getElementById('pfnTable');
        if (!container) return;
        const data = this.data.tables?.parte3_patrimoniale?.pfn;
        if (!data) return;
        const thead = '<thead><tr>' + data.headers.map(h => '<th>' + h + '</th>').join('') + '</tr></thead>';
        const tbody = '<tbody>' + data.rows.map(row => {
            const cls = row.highlight ? 'fw-bold table-primary' : '';
            const valueClass = row.voce.includes('Totale') ? 'fw-bold' : '';
            return '<tr class="' + cls + '"><td class="' + valueClass + '">' + row.voce + '</td><td class="text-right ' + valueClass + '">' + Utils.formatCurrency(row['2022']) + '</td><td class="text-right ' + valueClass + '">' + Utils.formatCurrency(row['2023']) + '</td><td class="text-right ' + valueClass + '">' + Utils.formatCurrency(row['2024']) + '</td><td class="text-right ' + (row.var > 0 ? 'text-danger' : 'text-success') + '">' + row.var.toFixed(1) + '%</td></tr>';
        }).join('') + '</tbody>';
        container.innerHTML = thead + tbody;
    },
    renderIndiciSoliditaTable() {
        const container = document.getElementById('indiciSoliditaTable');
        if (!container) return;
        const data = this.data.tables?.parte3_patrimoniale?.indiciSolidita;
        if (!data) return;
        const thead = '<thead><tr>' + data.headers.map(h => '<th>' + h + '</th>').join('') + '</tr></thead>';
        const tbody = '<tbody>' + data.rows.map(row => {
            const badgeColor = row.valutazione === 'Critico' ? 'danger' : row.valutazione === 'Allerta' ? 'warning' : row.valutazione === 'Ottimo' ? 'success' : 'info';
            return '<tr><td><i class="fas ' + row.icon + ' text-' + row.iconColor + ' me-2"></i>' + row.indicatore + '</td><td class="text-center">' + row['2022'] + '</td><td class="text-center">' + row['2023'] + '</td><td class="text-center">' + row['2024'] + '</td><td class="text-center"><span class="badge bg-' + badgeColor + '">' + row.valutazione + '</span></td><td>' + row.note + '</td></tr>';
        }).join('') + '</tbody>';
        container.innerHTML = thead + tbody;
    },
    renderSolidityAnalysis() {
        const container = document.getElementById('solidityAnalysis');
        if (!container) return;
        const title = this.data.content?.parte3_patrimoniale?.solidityTitle || 'Solidità';
        const intro = this.data.content?.parte3_patrimoniale?.solidityIntro || '';
        const note = this.data.content?.parte3_patrimoniale?.solidityNote || '';
        const coverageNote = this.data.content?.parte3_patrimoniale?.coverageNote || '';
        container.innerHTML = `<div class="content-section"><h3>${title}</h3><p>${intro}</p><div class="alert alert-danger mt-2">${note}</div><div class="alert alert-warning mt-2"><strong>Copertura:</strong> ${coverageNote}</div></div>`;
    },
    renderLiquidityNote() {
        const container = document.getElementById('liquidityNote');
        if (!container) return;
        const title = this.data.content?.parte3_patrimoniale?.liquidityTitle || 'Liquidità';
        const note = this.data.content?.parte3_patrimoniale?.liquidityNote || '';
        container.innerHTML = `<div class="alert alert-success"><strong>${title}:</strong> ${note}</div>`;
    }
};
document.addEventListener('DOMContentLoaded', () => { Parte3Patrimoniale.init(); });
