// ============================================================================
// NIH Grant Disruptions 2025 - Interactive Visualizations
// Uses Plotly.js for interactive charts
// ============================================================================

// Global data variable
let appData = null;

// Load data and initialize visualizations
async function loadData() {
    try {
        const response = await fetch('data.json');
        appData = await response.json();
        initializeVisualizations();
        populateTables();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Initialize all Plotly charts
function initializeVisualizations() {
    createStatusPieChart();
    createStateBarChart();
    createFinancialBarChart();
    createHubComparisonChart();
}

// ============================================================================
// CHART 1: Grant Status Distribution (Pie Chart)
// ============================================================================
function createStatusPieChart() {
    const statuses = appData.status_breakdown.map(d => d.status);
    const counts = appData.status_breakdown.map(d => d.count);
    
    const data = [{
        values: counts,
        labels: statuses,
        type: 'pie',
        hole: 0.4,
        marker: {
            colors: ['#4472C4', '#70AD47', '#C55A11', '#FFC000', '#7030A0']
        },
        textinfo: 'label+percent',
        textposition: 'outside',
        hovertemplate: '<b>%{label}</b><br>' +
                       'Grants: %{value}<br>' +
                       'Percentage: %{percent}<br>' +
                       '<extra></extra>'
    }];
    
    const layout = {
        title: {
            text: 'Distribution of Grants by Final Status',
            font: { size: 18, color: '#323232' }
        },
        showlegend: true,
        legend: {
            orientation: 'h',
            y: -0.2
        },
        height: 500,
        margin: { t: 80, b: 100, l: 50, r: 50 }
    };
    
    const config = {
        responsive: true,
        displayModeBar: true,
        displaylogo: false
    };
    
    Plotly.newPlot('status-pie-chart', data, layout, config);
}

// ============================================================================
// CHART 2: Geographic Impact - Top 10 States (Bar Chart)
// ============================================================================
function createStateBarChart() {
    const states = appData.top_10_states.map(d => d.state);
    const remainingFunds = appData.top_10_states.map(d => d.remaining_billions);
    const grantCounts = appData.top_10_states.map(d => d.grants);
    
    const trace1 = {
        x: remainingFunds,
        y: states,
        type: 'bar',
        orientation: 'h',
        name: 'Remaining Funds Lost',
        marker: {
            color: '#af1e37',
            line: {
                color: '#8b1729',
                width: 1.5
            }
        },
        text: remainingFunds.map(d => '$' + d.toFixed(2) + 'B'),
        textposition: 'auto',
        hovertemplate: '<b>%{y}</b><br>' +
                       'Funds Lost: $%{x:.2f}B<br>' +
                       '<extra></extra>'
    };
    
    const data = [trace1];
    
    const layout = {
        title: {
            text: 'Top 10 States by Estimated Remaining Funds Lost',
            font: { size: 18, color: '#323232' }
        },
        xaxis: {
            title: 'Estimated Remaining Funds Lost (Billions USD)',
            gridcolor: '#e0e0e0'
        },
        yaxis: {
            title: 'State',
            autorange: 'reversed'
        },
        height: 500,
        margin: { t: 80, b: 80, l: 80, r: 50 },
        hovermode: 'closest',
        plot_bgcolor: '#f9f9f9',
        paper_bgcolor: '#f9f9f9'
    };
    
    const config = {
        responsive: true,
        displayModeBar: true,
        displaylogo: false
    };
    
    Plotly.newPlot('state-bar-chart', data, layout, config);
}

// ============================================================================
// CHART 3: Financial Impact by Grant Status (Grouped Bar Chart)
// ============================================================================
function createFinancialBarChart() {
    const statuses = appData.status_breakdown.map(d => d.status);
    const totalAwards = appData.status_breakdown.map(d => d.total_award);
    const remainingFunds = appData.status_breakdown.map(d => d.remaining);
    
    const trace1 = {
        x: statuses,
        y: totalAwards,
        name: 'Total Award',
        type: 'bar',
        marker: {
            color: '#4472C4'
        },
        text: totalAwards.map(d => '$' + d.toFixed(2) + 'B'),
        textposition: 'auto',
        hovertemplate: '<b>%{x}</b><br>' +
                       'Total Award: $%{y:.2f}B<br>' +
                       '<extra></extra>'
    };
    
    const trace2 = {
        x: statuses,
        y: remainingFunds,
        name: 'Remaining Funds',
        type: 'bar',
        marker: {
            color: '#af1e37'
        },
        text: remainingFunds.map(d => '$' + d.toFixed(2) + 'B'),
        textposition: 'auto',
        hovertemplate: '<b>%{x}</b><br>' +
                       'Remaining: $%{y:.2f}B<br>' +
                       '<extra></extra>'
    };
    
    const data = [trace1, trace2];
    
    const layout = {
        title: {
            text: 'Financial Impact by Grant Status',
            font: { size: 18, color: '#323232' }
        },
        xaxis: {
            title: 'Grant Status',
            tickangle: -45
        },
        yaxis: {
            title: 'Amount (Billions USD)',
            gridcolor: '#e0e0e0'
        },
        barmode: 'group',
        height: 500,
        margin: { t: 80, b: 150, l: 80, r: 50 },
        plot_bgcolor: '#f9f9f9',
        paper_bgcolor: '#f9f9f9',
        legend: {
            x: 0.7,
            y: 1.0
        }
    };
    
    const config = {
        responsive: true,
        displayModeBar: true,
        displaylogo: false
    };
    
    Plotly.newPlot('financial-bar-chart', data, layout, config);
}

// ============================================================================
// CHART 4: Major Research Hubs vs Other States (Comparison)
// ============================================================================
function createHubComparisonChart() {
    const categories = ['Grant Count', 'Affected Funds (Billions)', 'Mean per Grant (Millions)'];
    
    const hubValues = [
        appData.geographic_impact.major_hubs.grant_count,
        appData.geographic_impact.major_hubs.affected_funds_billions,
        appData.geographic_impact.major_hubs.mean_per_grant_millions
    ];
    
    const otherValues = [
        appData.geographic_impact.other_states.grant_count,
        appData.geographic_impact.other_states.affected_funds_billions,
        appData.geographic_impact.other_states.mean_per_grant_millions
    ];
    
    const trace1 = {
        x: categories,
        y: hubValues,
        name: 'Major Hubs (NY, MA, IL, CA)',
        type: 'bar',
        marker: {
            color: '#af1e37'
        },
        text: hubValues.map((v, i) => {
            if (i === 0) return v.toLocaleString();
            if (i === 1) return '$' + v.toFixed(2) + 'B';
            return '$' + v.toFixed(2) + 'M';
        }),
        textposition: 'auto',
        hovertemplate: '<b>Major Hubs</b><br>' +
                       '%{x}: %{text}<br>' +
                       '<extra></extra>'
    };
    
    const trace2 = {
        x: categories,
        y: otherValues,
        name: 'Other States (46 states)',
        type: 'bar',
        marker: {
            color: '#4472C4'
        },
        text: otherValues.map((v, i) => {
            if (i === 0) return v.toLocaleString();
            if (i === 1) return '$' + v.toFixed(2) + 'B';
            return '$' + v.toFixed(2) + 'M';
        }),
        textposition: 'auto',
        hovertemplate: '<b>Other States</b><br>' +
                       '%{x}: %{text}<br>' +
                       '<extra></extra>'
    };
    
    const data = [trace1, trace2];
    
    const layout = {
        title: {
            text: 'Major Research Hubs vs Other States: Impact Comparison',
            font: { size: 18, color: '#323232' }
        },
        xaxis: {
            title: 'Metric',
            tickangle: -20
        },
        yaxis: {
            title: 'Value (varying units)',
            gridcolor: '#e0e0e0'
        },
        barmode: 'group',
        height: 500,
        margin: { t: 80, b: 100, l: 80, r: 50 },
        plot_bgcolor: '#f9f9f9',
        paper_bgcolor: '#f9f9f9',
        legend: {
            x: 0.3,
            y: 1.0
        },
        annotations: [{
            text: 'Note: Major Hubs account for 75% of total impact',
            showarrow: false,
            x: 0.5,
            y: -0.25,
            xref: 'paper',
            yref: 'paper',
            xanchor: 'center',
            yanchor: 'top',
            font: {
                size: 12,
                color: '#5a5a5a',
                family: 'Arial'
            }
        }]
    };
    
    const config = {
        responsive: true,
        displayModeBar: true,
        displaylogo: false
    };
    
    Plotly.newPlot('hub-comparison-chart', data, layout, config);
}

// ============================================================================
// Populate Data Tables
// ============================================================================
function populateTables() {
    // Populate State Table
    const stateTableBody = document.getElementById('state-table-body');
    stateTableBody.innerHTML = '';
    
    appData.top_10_states.forEach((state, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${state.state}</strong></td>
            <td>${state.grants.toLocaleString()}</td>
            <td>$${state.remaining_billions.toFixed(3)}B</td>
        `;
        stateTableBody.appendChild(row);
    });
    
    // Populate Status Table
    const statusTableBody = document.getElementById('status-table-body');
    statusTableBody.innerHTML = '';
    
    const totalGrants = appData.summary_stats.total_grants;
    
    appData.status_breakdown.forEach(status => {
        const percentage = ((status.count / totalGrants) * 100).toFixed(1);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${status.status}</strong></td>
            <td>${status.count.toLocaleString()}</td>
            <td>$${status.total_award.toFixed(2)}B</td>
            <td>$${status.remaining.toFixed(2)}B</td>
            <td>${percentage}%</td>
        `;
        statusTableBody.appendChild(row);
    });
}

// ============================================================================
// Data Explorer Functionality
// ============================================================================
function setupDataExplorer() {
    const stateFilter = document.getElementById('state-filter');
    const statusFilter = document.getElementById('status-filter');
    const resultsDiv = document.getElementById('explorer-results');
    
    function updateExplorer() {
        const selectedState = stateFilter.value;
        const selectedStatus = statusFilter.value;
        
        if (selectedState === 'all' && selectedStatus === 'all') {
            resultsDiv.innerHTML = '<p style="text-align: center; color: #5a5a5a; margin-top: 2rem;">Select filters above to explore the data</p>';
            return;
        }
        
        // Find matching data
        let results = '';
        
        if (selectedState !== 'all') {
            const stateData = appData.top_10_states.find(s => s.state === selectedState);
            if (stateData) {
                results += `<div class="highlight-box">
                    <h4>${stateData.state} Statistics</h4>
                    <p><strong>Number of Grants:</strong> ${stateData.grants.toLocaleString()}</p>
                    <p><strong>Remaining Funds Lost:</strong> $${stateData.remaining_billions.toFixed(3)} billion</p>
                    <p><strong>Average per Grant:</strong> $${(stateData.remaining_billions * 1000 / stateData.grants).toFixed(2)} million</p>
                </div>`;
            }
        }
        
        if (selectedStatus !== 'all') {
            const statusMap = {
                'terminated': 'Terminated',
                'reinstated': 'Possibly Reinstated',
                'unfrozen': 'Unfrozen Funding',
                'frozen': 'Frozen Funding'
            };
            
            const statusData = appData.status_breakdown.find(s => s.status === statusMap[selectedStatus]);
            if (statusData) {
                results += `<div class="highlight-box">
                    <h4>${statusData.status} Statistics</h4>
                    <p><strong>Number of Grants:</strong> ${statusData.count.toLocaleString()}</p>
                    <p><strong>Total Award Amount:</strong> $${statusData.total_award.toFixed(2)} billion</p>
                    <p><strong>Remaining Funds:</strong> $${statusData.remaining.toFixed(2)} billion</p>
                    <p><strong>Percentage of Total:</strong> ${((statusData.count / appData.summary_stats.total_grants) * 100).toFixed(1)}%</p>
                </div>`;
            }
        }
        
        resultsDiv.innerHTML = results || '<p style="text-align: center; color: #5a5a5a; margin-top: 2rem;">No data available for selected filters</p>';
    }
    
    stateFilter.addEventListener('change', updateExplorer);
    statusFilter.addEventListener('change', updateExplorer);
}

// ============================================================================
// Initialize on Page Load
// ============================================================================
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupDataExplorer();
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
