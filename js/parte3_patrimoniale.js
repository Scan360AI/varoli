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
