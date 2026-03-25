// ============================================================================
// NIH Grant Terminations 2025 - Interactive Visualization JavaScript
// ============================================================================

// Global data variable
let data = null;

// Load data when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadData();
});

// Load JSON data
async function loadData() {
    try {
        const response = await fetch('data.json');
        data = await response.json();
        
        // Create all visualizations
        createPlot1();
        createPlot2();
        createPlot3();
        
        // Initialize data explorer
        initializeDataExplorer();
        
    } catch (error) {
        console.error('Error loading data:', error);
        const plot1 = document.getElementById('plot1');
        if (plot1) {
            plot1.innerHTML = `
                <div style="color: #af1e37; text-align: center; padding: 2rem;">
                    <h3>Data Load Error</h3>
                    <p>Unable to load data.json. This usually happens if you open the HTML file directly instead of using a web server.</p>
                    <p>To view the visualizations, please use a local server: <code>python3 -m http.server 8000</code></p>
                </div>`;
        }
    }
}

// Helper to get status color
function getStatusColor(status) {
    const colorMap = {
        'Terminated': '#AF1E37',                 // Harvard Crimson/Red
        'Frozen Funding': '#5A5A5A',             // Dark Gray
        'Possibly Reinstated': '#2563EB',        // Blue
        'Unfrozen Funding': '#16A34A',           // Green
        'Possibly Unfrozen Funding': '#059669'   // Teal
    };
    return colorMap[status] || '#C8C8C8';        // Light Gray default
}

// ============================================================================
// PLOT 1: Funding Disruption by Category (Bar Chart)
// ============================================================================
function createPlot1() {
    const statuses = data.status_breakdown.map(d => d.status);
    const totalAwards = data.status_breakdown.map(d => d.total_award_billions);
    const counts = data.status_breakdown.map(d => d.count);
    const colors = statuses.map(s => getStatusColor(s));
    
    const trace = {
        x: statuses,
        y: totalAwards,
        type: 'bar',
        marker: {
            color: colors,
            line: {
                color: '#323232',
                width: 1.5
            }
        },
        text: counts.map(c => `N=${c.toLocaleString()}`),
        textposition: 'outside',
        textfont: {
            size: 11,
            color: '#323232'
        },
        hovertemplate: '<b>%{x}</b><br>' +
                      'Total Award: $%{y:.2f}B<br>' +
                      'Count: %{text}<br>' +
                      '<extra></extra>'
    };
    
    const layout = {
        title: {
            text: 'NIH Funding Disruption and Recovery by Category (2025)',
            font: { size: 16, color: '#323232', family: 'Arial, sans-serif' }
        },
        xaxis: {
            title: 'Grant Status',
            tickangle: -45,
            tickfont: { size: 11 }
        },
        yaxis: {
            title: 'Total Award Amount (Billions USD)',
            tickformat: '$,.1f'
        },
        plot_bgcolor: '#FAFAFA',
        paper_bgcolor: 'white',
        margin: { l: 70, r: 40, t: 80, b: 120 },
        hovermode: 'closest'
    };
    
    const config = {
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
    };
    
    Plotly.newPlot('plot1', [trace], layout, config);
}

// ============================================================================
// PLOT 2: Temporal Distribution (Line Chart)
// ============================================================================
function createPlot2() {
    const months = data.temporal_data.map(d => d.month);
    const frozen = data.temporal_data.map(d => d.frozen);
    const terminated = data.temporal_data.map(d => d.terminated);
    
    const traceFrozen = {
        x: months,
        y: frozen,
        name: 'Frozen',
        type: 'scatter',
        mode: 'lines+markers',
        line: {
            color: '#5A5A5A',
            width: 3
        },
        marker: {
            size: 8,
            color: '#5A5A5A',
            line: {
                color: 'white',
                width: 2
            }
        },
        hovertemplate: '<b>%{x}</b><br>' +
                      'Frozen: %{y:,}<br>' +
                      '<extra></extra>'
    };
    
    const traceTerminated = {
        x: months,
        y: terminated,
        name: 'Terminated',
        type: 'scatter',
        mode: 'lines+markers',
        line: {
            color: '#AF1E37',
            width: 3
        },
        marker: {
            size: 8,
            color: '#AF1E37',
            line: {
                color: 'white',
                width: 2
            }
        },
        hovertemplate: '<b>%{x}</b><br>' +
                      'Terminated: %{y:,}<br>' +
                      '<extra></extra>'
    };
    
    const layout = {
        title: {
            text: 'Temporal Distribution of NIH Funding Disruptions',
            font: { size: 16, color: '#323232', family: 'Arial, sans-serif' }
        },
        xaxis: {
            title: 'Month',
            tickangle: -45
        },
        yaxis: {
            title: 'Number of Grants',
            tickformat: ',d'
        },
        plot_bgcolor: '#FAFAFA',
        paper_bgcolor: 'white',
        margin: { l: 70, r: 40, t: 80, b: 100 },
        hovermode: 'x unified',
        legend: {
            x: 0.02,
            y: 0.98,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            bordercolor: '#C8C8C8',
            borderwidth: 1
        }
    };
    
    const config = {
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
    };
    
    Plotly.newPlot('plot2', [traceFrozen, traceTerminated], layout, config);
}

// ============================================================================
// PLOT 3: Geographic Impact (Horizontal Bar Chart)
// ============================================================================
function createPlot3() {
    // Sort states by remaining funds (descending)
    const stateData = [...data.state_impact].sort((a, b) => b.remaining_billions - a.remaining_billions);
    
    const states = stateData.map(d => d.state);
    const remaining = stateData.map(d => d.remaining_billions);
    const grantCounts = stateData.map(d => d.grants);
    
    // Color major hubs differently
    const majorHubs = ['NY', 'MA', 'IL', 'CA'];
    const colors = states.map(state => 
        majorHubs.includes(state) ? '#AF1E37' : '#5A5A5A'
    );
    
    const trace = {
        x: remaining,
        y: states,
        type: 'bar',
        orientation: 'h',
        marker: {
            color: colors,
            line: {
                color: '#323232',
                width: 1
            }
        },
        text: grantCounts.map(c => `${c.toLocaleString()} grants`),
        textposition: 'outside',
        textfont: {
            size: 10,
            color: '#323232'
        },
        hovertemplate: '<b>%{y}</b><br>' +
                      'Remaining Funds Lost: $%{x:.2f}B<br>' +
                      'Grants: %{text}<br>' +
                      '<extra></extra>'
    };
    
    const layout = {
        title: {
            text: 'Top 10 States by NIH Funding Loss',
            font: { size: 16, color: '#323232', family: 'Arial, sans-serif' }
        },
        xaxis: {
            title: 'Estimated Remaining Funds Lost (Billions USD)',
            tickformat: '$,.1f'
        },
        yaxis: {
            title: '',
            autorange: 'reversed'
        },
        plot_bgcolor: '#FAFAFA',
        paper_bgcolor: 'white',
        margin: { l: 50, r: 120, t: 80, b: 60 },
        hovermode: 'closest'
    };
    
    const config = {
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
    };
    
    Plotly.newPlot('plot3', [trace], layout, config);
}

// ============================================================================
// DATA EXPLORER
// ============================================================================
function initializeDataExplorer() {
    // Populate state selector
    const stateSelect = document.getElementById('stateSelector');
    if (stateSelect) {
        data.state_impact.forEach(state => {
            const option = document.createElement('option');
            option.value = state.state;
            option.textContent = state.state;
            stateSelect.appendChild(option);
        });
    }
    
    // Add event listener to update button
    const updateBtn = document.getElementById('updateExplorer');
    if (updateBtn) {
        updateBtn.addEventListener('click', updateExplorer);
    }
    
    // Initial display
    updateExplorer();
}

function updateExplorer() {
    const selectedStatus = document.getElementById('statusFilter')?.value || 'all';
    const selectedState = document.getElementById('stateSelector')?.value || 'all';
    
    // Filter data
    let filteredData = data.status_breakdown;
    
    if (selectedStatus !== 'all') {
        filteredData = filteredData.filter(d => d.status === selectedStatus);
    }
    
    // Calculate totals
    const totalGrants = filteredData.reduce((sum, d) => sum + d.count, 0);
    const totalAward = filteredData.reduce((sum, d) => sum + d.total_award_billions, 0);
    
    // Update display
    const explorerResults = document.getElementById('explorerResults');
    if (explorerResults) {
        let html = '<h3>Filtered Results</h3>';
        html += `<p><strong>Total Grants:</strong> ${totalGrants.toLocaleString()}</p>`;
        html += `<p><strong>Total Award:</strong> $${totalAward.toFixed(2)} Billion</p>`;
        
        if (selectedState !== 'all') {
            const stateInfo = data.state_impact.find(s => s.state === selectedState);
            if (stateInfo) {
                html += `<h4>State: ${selectedState}</h4>`;
                html += `<p><strong>Grants:</strong> ${stateInfo.grants.toLocaleString()}</p>`;
                html += `<p><strong>Remaining Funds Lost:</strong> $${stateInfo.remaining_billions.toFixed(2)} Billion</p>`;
            }
        }
        
        html += '<table><thead><tr><th>Status</th><th>Count</th><th>Total Award (B)</th><th>Mean Award (M)</th></tr></thead><tbody>';
        filteredData.forEach(d => {
            html += `<tr>
                <td>${d.status}</td>
                <td>${d.count.toLocaleString()}</td>
                <td>$${d.total_award_billions.toFixed(2)}</td>
                <td>$${d.mean_award_millions.toFixed(2)}</td>
            </tr>`;
        });
        html += '</tbody></table>';
        
        explorerResults.innerHTML = html;
    }
}

// ============================================================================
// SMOOTH SCROLLING FOR NAVIGATION
// ============================================================================
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
