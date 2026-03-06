document.addEventListener('DOMContentLoaded', () => {
    
    // NAVIGATION LOGIC
    const navItems = document.querySelectorAll('.nav-item');
    const viewSections = document.querySelectorAll('.view-section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active from all navs
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active to clicked
            item.classList.add('active');
            
            // Hide all sections
            viewSections.forEach(section => section.classList.remove('active'));
            
            // Show target section
            const targetId = item.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // ----------------------------------------------------
    // CHARTS INITIALIZATION (CHART.JS)
    // ----------------------------------------------------

    // 1. Dashboard - Cashflow (Bar/Line combo chart)
    const ctxCashflow = document.getElementById('cashflowChart');
    if (ctxCashflow) {
        new Chart(ctxCashflow, {
            type: 'bar',
            data: {
                labels: ['Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar (Atual)'],
                datasets: [
                    {
                        label: 'Receitas (€)',
                        data: [120000, 150000, 110000, 130000, 125000, 142500],
                        backgroundColor: 'rgba(16, 185, 129, 0.8)', // Success green
                        borderRadius: 4
                    },
                    {
                        label: 'Despesas (€)',
                        data: [80000, 95000, 140000, 85000, 100000, 95200],
                        backgroundColor: 'rgba(239, 68, 68, 0.8)', // Danger red
                        borderRadius: 4
                    },
                    {
                        type: 'line',
                        label: 'Margem Líquida',
                        data: [40000, 55000, -30000, 45000, 25000, 47300],
                        borderColor: '#f59e0b', // Accent amber
                        backgroundColor: '#f59e0b',
                        borderWidth: 2,
                        tension: 0.3,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        position: 'left',
                        grid: { color: 'rgba(0,0,0,0.05)' }
                    },
                    y1: {
                        beginAtZero: true,
                        position: 'right',
                        grid: { drawOnChartArea: false },
                    }
                },
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }

    // 2. Dashboard - Costs Allocation (Doughnut chart)
    const ctxCosts = document.getElementById('costsChart');
    if (ctxCosts) {
        new Chart(ctxCosts, {
            type: 'doughnut',
            data: {
                labels: ['Materiais', 'Mão de Obra', 'Subcontratados', 'Equipamentos', 'Licenças/Taxas'],
                datasets: [{
                    data: [45, 30, 15, 8, 2],
                    backgroundColor: [
                        '#0f172a', // Primary
                        '#f59e0b', // Accent
                        '#10b981', // Success
                        '#3b82f6', // Blue
                        '#8b5cf6'  // Purple
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                },
                cutout: '70%'
            }
        });
    }

    // 3. Previsões Financeiras (Forecast Line Chart)
    const ctxForecast = document.getElementById('forecastChart');
    if (ctxForecast) {
        new Chart(ctxForecast, {
            type: 'line',
            data: {
                labels: ['Abr 2026', 'Mai 2026', 'Jun 2026', 'Jul 2026', 'Ago 2026', 'Set 2026'],
                datasets: [
                    {
                        label: 'Previsão de Recebimentos Acumulados',
                        data: [300, 350, 400, 600, 650, 800],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Previsão de Pagamentos a Fornecedores',
                        data: [200, 450, 420, 480, 500, 520],
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': € ' + context.parsed.y + 'k';
                            }
                        }
                    }
                }
            }
        });
    }

    // ----------------------------------------------------
    // FUNCTIONALITY: FLUXO DE CAIXA - Add transaction
    // ----------------------------------------------------
    const addTrxForm = document.getElementById('add-transaction-form');
    if (addTrxForm) {
        addTrxForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const desc = document.getElementById('desc-trx').value;
            const tipo = document.getElementById('tipo-trx').value;
            const valor = parseFloat(document.getElementById('valor-trx').value);
            
            if (!desc || isNaN(valor)) return;

            // Generate today's date
            const today = new Date();
            const dateStr = today.toLocaleDateString('pt-PT', {day:'2-digit', month:'2-digit', year:'numeric'});
            
            // Format currency
            const formatter = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });
            const valorFormatado = formatter.format(valor);

            const tbody = document.getElementById('fluxo-table-body');
            const newRow = document.createElement('tr');
            
            newRow.style.animation = "fadeIn 0.5s ease";

            if (tipo === 'entrada') {
                newRow.innerHTML = `
                    <td>${dateStr}</td>
                    <td>${desc}</td>
                    <td>Manual</td>
                    <td><span class="badge badge-success">Entrada</span></td>
                    <td class="positive">+ ${valorFormatado}</td>
                `;
            } else {
                newRow.innerHTML = `
                    <td>${dateStr}</td>
                    <td>${desc}</td>
                    <td>Manual</td>
                    <td><span class="badge badge-danger">Saída</span></td>
                    <td class="negative">- ${valorFormatado}</td>
                `;
            }

            // Insert at the top
            tbody.insertBefore(newRow, tbody.firstChild);

            // Reset form
            addTrxForm.reset();
        });
    }
});
