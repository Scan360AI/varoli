const Parte6Rischi = {
    data: null,
    async init() {
        try {
            await App.init();
            this.data = App.getData();
            this.renderSectionIntro();
            this.renderRiskMatrix();
            this.renderRedFlags();
            this.renderActionPlan();
            this.renderGovernanceNote();
            this.renderScenarioAnalysis();
        } catch (error) {
            console.error('Error initializing Parte 6:', error);
        }
    },
    renderSectionIntro() {
        const container = document.getElementById('sectionIntro');
        if (!container) return;
        const intro = this.data.content?.parte6_rischi_raccomandazioni?.sectionIntro || '';
        container.innerHTML = `<div class="alert alert-info"><i class="fas fa-info-circle me-2"></i>${intro}</div>`;
    },
    renderRiskMatrix() {
        const container = document.getElementById('riskMatrixIntro');
        if (!container) return;
        const title = this.data.content?.parte6_rischi_raccomandazioni?.riskMatrixTitle || 'Matrice Rischi';
        const intro = this.data.content?.parte6_rischi_raccomandazioni?.riskMatrixIntro || '';
        const finRisk = this.data.content?.parte6_rischi_raccomandazioni?.financialRisk || {};
        const opRisk = this.data.content?.parte6_rischi_raccomandazioni?.operationalRisk || {};
        const liqRisk = this.data.content?.parte6_rischi_raccomandazioni?.liquidityRisk || {};
        const mktRisk = this.data.content?.parte6_rischi_raccomandazioni?.marketRisk || {};
        container.innerHTML = `<h3>${title}</h3><p>${intro}</p>
            <div class="row">
                <div class="col-md-6"><div class="alert alert-danger"><strong>Rischio Finanziario (${finRisk.impact || ''} / ${finRisk.probability || ''}):</strong> ${finRisk.description || ''}</div></div>
                <div class="col-md-6"><div class="alert alert-danger"><strong>Rischio Operativo (${opRisk.impact || ''} / ${opRisk.probability || ''}):</strong> ${opRisk.description || ''}</div></div>
                <div class="col-md-6"><div class="alert alert-warning"><strong>Rischio Liquidità (${liqRisk.impact || ''} / ${liqRisk.probability || ''}):</strong> ${liqRisk.description || ''}</div></div>
                <div class="col-md-6"><div class="alert alert-warning"><strong>Rischio Mercato (${mktRisk.impact || ''} / ${mktRisk.probability || ''}):</strong> ${mktRisk.description || ''}</div></div>
            </div>`;
    },
    renderRedFlags() {
        const container = document.getElementById('redFlagsSection');
        if (!container) return;
        const title = this.data.content?.parte6_rischi_raccomandazioni?.redFlagsTitle || 'Segnali di Allarme';
        const intro = this.data.content?.parte6_rischi_raccomandazioni?.redFlagsIntro || '';
        const redFlags = this.data.tables?.parte6_rischi?.redFlags?.rows || [];
        const flagsHTML = redFlags.map(flag => `<tr><td><span class="badge bg-danger">${flag.area}</span></td><td>${flag.segnale}</td><td class="text-right">${flag.valore}</td><td>${flag.rischio}</td></tr>`).join('');
        container.innerHTML = `<div class="content-section"><h3>${title}</h3><p>${intro}</p><table class="table table-sm"><thead><tr><th>Area</th><th>Segnale</th><th>Valore</th><th>Rischio</th></tr></thead><tbody>${flagsHTML}</tbody></table></div>`;
    },
    renderActionPlan() {
        const container = document.getElementById('actionPlanSection');
        if (!container) return;
        const title = this.data.content?.parte6_rischi_raccomandazioni?.actionPlanTitle || 'Piano Azione';
        const intro = this.data.content?.parte6_rischi_raccomandazioni?.actionPlanIntro || '';
        const actionPlan = this.data.content?.parte6_rischi_raccomandazioni?.actionPlan || {};
        container.innerHTML = `<div class="content-section"><h3>${title}</h3><p>${intro}</p>
            <div class="alert alert-danger"><strong>Urgente (0-3 mesi):</strong> ${actionPlan.urgentActions || ''}</div>
            <div class="alert alert-warning"><strong>Breve Termine (3-6 mesi):</strong> ${actionPlan.shortTerm || ''}</div>
            <div class="alert alert-info"><strong>Medio Termine (6-12 mesi):</strong> ${actionPlan.mediumTerm || ''}</div>
        </div>`;
        const continuityNote = this.data.content?.parte6_rischi_raccomandazioni?.continuityNote || '';
        const contContainer = document.getElementById('continuityNote');
        if (contContainer) contContainer.innerHTML = `<div class="alert alert-danger mt-3">${continuityNote}</div>`;
    },
    renderGovernanceNote() {
        const container = document.getElementById('governanceNote');
        if (!container) return;
        const note = this.data.content?.parte6_rischi_raccomandazioni?.governanceNote || '';
        container.innerHTML = `<div class="alert alert-light"><strong>Governance e Adeguati Assetti:</strong> ${note}</div>`;
    },
    renderScenarioAnalysis() {
        const container = document.getElementById('scenarioAnalysis');
        if (!container) return;
        const analysis = this.data.content?.parte6_rischi_raccomandazioni?.scenarioAnalysis || '';
        container.innerHTML = `<div class="alert alert-warning mt-3"><strong>Analisi di Scenario:</strong> ${analysis}</div>`;
    }
};
document.addEventListener('DOMContentLoaded', () => { Parte6Rischi.init(); });
