const IRPDettaglio = {
    data: null,
    charts: {},
    async init() {
        try {
            await App.init();
            this.data = App.getData();
            this.renderIRPOverview();
            this.renderIRPExplanation();
            this.renderComponents();
            this.renderCPDetail();
            this.renderLeanusDetail();
            this.renderMCCDetail();
            this.renderZScoreDetail();
            this.renderImprovementTargets();
        } catch (error) {
            console.error('Error initializing IRP Dettaglio:', error);
        }
    },
    renderIRPOverview() {
        const container = document.getElementById('irpOverview');
        if (!container) return;
        const irp = this.data.kpis?.irp || {};
        const score = irp.value || 0;
        const riskClass = Utils.getRiskLevel(score);
        container.innerHTML = `
            <div class="irp-score-circle risk-${riskClass}">
                <div class="irp-score-value">${score.toFixed(1)}</div>
                <div class="irp-score-max">/ 100</div>
            </div>
            <h3 class="text-center mt-3">${irp.categoryLabel || ''}</h3>
            <span class="badge ${irp.status || 'danger'} d-block text-center">Categoria ${irp.category || 'D+'}</span>`;
    },
    renderIRPExplanation() {
        const container = document.getElementById('irpExplanation');
        if (!container) return;
        const explanation = this.data.content?.irp_dettaglio?.irpExplanation || '';
        const interpretation = this.data.content?.irp_dettaglio?.scoreInterpretation || '';
        const weights = this.data.content?.irp_dettaglio?.componentWeights || '';
        container.innerHTML = `<p>${explanation}</p><div class="alert alert-danger mt-2">${interpretation}</div><div class="alert alert-light mt-2"><strong>Pesi:</strong> ${weights}</div>`;
    },
    renderComponents() {
        const container = document.getElementById('componentsIntro');
        if (!container) return;
        const title = this.data.content?.irp_dettaglio?.componentsTitle || 'Componenti';
        const intro = this.data.content?.irp_dettaglio?.componentsIntro || '';
        const redScore = this.data.content?.irp_dettaglio?.redditivityScore || '';
        const solScore = this.data.content?.irp_dettaglio?.solidityScore || '';
        const debtScore = this.data.content?.irp_dettaglio?.debtScore || '';
        const effScore = this.data.content?.irp_dettaglio?.efficiencyScore || '';
        const liqScore = this.data.content?.irp_dettaglio?.liquidityScore || '';
        container.innerHTML = `<h3>${title}</h3><p>${intro}</p>
            <div class="row">
                <div class="col-md-4"><div class="alert alert-danger"><strong>Redditività:</strong> ${redScore}</div></div>
                <div class="col-md-4"><div class="alert alert-warning"><strong>Solidità:</strong> ${solScore}</div></div>
                <div class="col-md-4"><div class="alert alert-warning"><strong>Debito:</strong> ${debtScore}</div></div>
                <div class="col-md-6"><div class="alert alert-warning"><strong>Efficienza:</strong> ${effScore}</div></div>
                <div class="col-md-6"><div class="alert alert-success"><strong>Liquidità:</strong> ${liqScore}</div></div>
            </div>`;
    },
    renderCPDetail() {
        const container = document.getElementById('cpDetail');
        if (!container) return;
        const cpExpl = this.data.content?.irp_dettaglio?.cpExplanation || '';
        container.innerHTML = `<div class="alert alert-light"><strong>Coefficiente di Ponderazione:</strong> ${cpExpl}</div>`;
    },
    renderLeanusDetail() {
        const container = document.getElementById('leanusDetail');
        if (!container) return;
        const leanusExpl = this.data.content?.irp_dettaglio?.leanusExplanation || '';
        container.innerHTML = `<div class="alert alert-light"><strong>Leanus Score:</strong> ${leanusExpl}</div>`;
    },
    renderMCCDetail() {
        const container = document.getElementById('mccDetail');
        if (!container) return;
        const mccExpl = this.data.content?.irp_dettaglio?.mccExplanation || '';
        container.innerHTML = `<div class="alert alert-light"><strong>Rating MCC:</strong> ${mccExpl}</div>`;
    },
    renderZScoreDetail() {
        const container = document.getElementById('zscoreDetail');
        if (!container) return;
        const zscoreExpl = this.data.content?.irp_dettaglio?.zscoreExplanation || '';
        container.innerHTML = `<div class="alert alert-light"><strong>Z-Score Altman:</strong> ${zscoreExpl}</div>`;
    },
    renderImprovementTargets() {
        const container = document.getElementById('improvementTargets');
        if (!container) return;
        const title = this.data.content?.irp_dettaglio?.improvementTitle || 'Obiettivi';
        const intro = this.data.content?.irp_dettaglio?.improvementIntro || '';
        const sixMonth = this.data.content?.irp_dettaglio?.sixMonthTarget || '';
        const twelveMonth = this.data.content?.irp_dettaglio?.twelveMonthTarget || '';
        const twentyFourMonth = this.data.content?.irp_dettaglio?.twentyFourMonthTarget || '';
        const historical = this.data.content?.irp_dettaglio?.historicalTrend || '';
        const peer = this.data.content?.irp_dettaglio?.peerComparison || '';
        container.innerHTML = `<div class="content-section"><h3>${title}</h3><p>${intro}</p>
            <div class="alert alert-danger"><strong>6 mesi:</strong> ${sixMonth}</div>
            <div class="alert alert-warning"><strong>12 mesi:</strong> ${twelveMonth}</div>
            <div class="alert alert-info"><strong>24 mesi:</strong> ${twentyFourMonth}</div>
            <div class="alert alert-light mt-3"><strong>Trend Storico:</strong> ${historical}</div>
            <div class="alert alert-light mt-2"><strong>Confronto con Peers:</strong> ${peer}</div>
        </div>`;
    }
};
document.addEventListener('DOMContentLoaded', () => { IRPDettaglio.init(); });
