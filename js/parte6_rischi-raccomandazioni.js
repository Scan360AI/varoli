const Parte6Rischi = {
    data: null,
    async init() {
        try {
            await App.init();
            this.data = App.getData();
            this.renderRiskMatrix();
            this.renderRecommendations();
            this.renderActionPlan();
        } catch (error) {
            console.error('Error initializing Parte 6:', error);
        }
    },
    renderRiskMatrix() {
        const container = document.getElementById('riskMatrixTable');
        if (!container) return;
        TableRenderer.renderTable(container, {
            columns: [
                { label: 'Rischio', width: '40%' },
                { label: 'Probabilità', align: 'text-center', width: '15%' },
                { label: 'Impatto', align: 'text-center', width: '15%' },
                { label: 'Priorità', align: 'text-center', width: '15%' },
                { label: 'Stato', align: 'text-center', width: '15%' }
            ],
            rows: [
                {
                    cells: [
                        { value: 'DSO Elevato - Rallentamento incassi' },
                        { value: 'Alta', align: 'text-center' },
                        { value: 'Alto', align: 'text-center' },
                        { value: { type: 'badge', text: 'Critico' }, align: 'text-center' },
                        { value: { type: 'badge', text: 'In Gestione' }, align: 'text-center' }
                    ]
                },
                {
                    cells: [
                        { value: 'Dipendenza da credito bancario a breve' },
                        { value: 'Media', align: 'text-center' },
                        { value: 'Alto', align: 'text-center' },
                        { value: { type: 'badge', text: 'Alto' }, align: 'text-center' },
                        { value: { type: 'badge', text: 'Monitorato' }, align: 'text-center' }
                    ]
                },
                {
                    cells: [
                        { value: 'Volatilità mercato di riferimento' },
                        { value: 'Media', align: 'text-center' },
                        { value: 'Medio', align: 'text-center' },
                        { value: { type: 'badge', text: 'Medio' }, align: 'text-center' },
                        { value: { type: 'badge', text: 'Accettato' }, align: 'text-center' }
                    ]
                },
                {
                    cells: [
                        { value: 'Concentrazione clientela' },
                        { value: 'Bassa', align: 'text-center' },
                        { value: 'Medio', align: 'text-center' },
                        { value: { type: 'badge', text: 'Basso' }, align: 'text-center' },
                        { value: { type: 'badge', text: 'Accettato' }, align: 'text-center' }
                    ]
                }
            ]
        });
    },
    renderRecommendations() {
        const container = document.getElementById('recommendationsContainer');
        if (!container) return;
        const recommendations = [
            {
                title: 'Ottimizzazione Gestione Crediti',
                priority: 'danger',
                description: 'Implementare azioni immediate per ridurre i giorni medi di incasso (DSO) da 173 a 120 giorni.',
                actions: [
                    'Analisi approfondita aging crediti',
                    'Implementazione solleciti automatizzati',
                    'Valutazione factoring per crediti oltre 90 giorni',
                    'Revisione condizioni di pagamento per nuovi contratti'
                ]
            },
            {
                title: 'Diversificazione Fonti Finanziarie',
                priority: 'warning',
                description: 'Ridurre la dipendenza da credito bancario a breve termine attraverso linee M/L termine.',
                actions: [
                    'Negoziazione linea credito a medio termine (3-5 anni)',
                    'Valutazione mini-bond o prestito obbligazionario',
                    'Ottimizzazione mix debito breve/lungo termine',
                    'Rafforzamento relazioni con sistema bancario'
                ]
            },
            {
                title: 'Potenziamento Controllo di Gestione',
                priority: 'info',
                description: 'Implementare sistema di reporting mensile per monitoraggio KPI critici.',
                actions: [
                    'Dashboard KPI economico-finanziari',
                    'Report mensile su liquidità e circolante',
                    'Budget rolling e forecast trimestrali',
                    'Analisi scostamenti e azioni correttive'
                ]
            }
        ];
        container.innerHTML = recommendations.map(rec => `
            <div class="alert-box ${rec.priority}">
                <div class="alert-title">${rec.title}</div>
                <div class="alert-content">
                    <p>${rec.description}</p>
                    <strong style="display: block; margin-top: 12px; margin-bottom: 8px;">Azioni specifiche:</strong>
                    <ul style="margin: 0; padding-left: 20px;">
                        ${rec.actions.map(action => '<li>' + action + '</li>').join('')}
                    </ul>
                </div>
            </div>
        `).join('');
    },
    renderActionPlan() {
        const container = document.getElementById('actionPlanTable');
        if (!container) return;
        TableRenderer.renderTable(container, {
            columns: [
                { label: 'Azione', width: '35%' },
                { label: 'Responsabile', width: '20%' },
                { label: 'Scadenza', align: 'text-center', width: '15%' },
                { label: 'Risorse', align: 'text-right', width: '15%' },
                { label: 'Stato', align: 'text-center', width: '15%' }
            ],
            rows: [
                {
                    cells: [
                        { value: 'Riduzione DSO target 120gg' },
                        { value: 'CFO / Amministrazione' },
                        { value: 'Q2 2025', align: 'text-center' },
                        { value: '15.000', type: 'currency' },
                        { value: { type: 'badge', text: 'In corso' }, align: 'text-center' }
                    ]
                },
                {
                    cells: [
                        { value: 'Negoziazione linea M/L termine' },
                        { value: 'CFO / Direzione' },
                        { value: 'Q1 2025', align: 'text-center' },
                        { value: '5.000', type: 'currency' },
                        { value: { type: 'badge', text: 'Pianificato' }, align: 'text-center' }
                    ]
                },
                {
                    cells: [
                        { value: 'Implementazione dashboard KPI' },
                        { value: 'CFO / IT' },
                        { value: 'Q1 2025', align: 'text-center' },
                        { value: '8.000', type: 'currency' },
                        { value: { type: 'badge', text: 'Pianificato' }, align: 'text-center' }
                    ]
                },
                {
                    cells: [
                        { value: 'Diversificazione mercati geografici' },
                        { value: 'Direzione Commerciale' },
                        { value: 'Q4 2025', align: 'text-center' },
                        { value: '25.000', type: 'currency' },
                        { value: { type: 'badge', text: 'Da avviare' }, align: 'text-center' }
                    ]
                }
            ]
        });
    }
};
document.addEventListener('DOMContentLoaded', () => { Parte6Rischi.init(); });
