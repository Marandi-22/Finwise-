import streamlit as st
import json
import time
import random
from datetime import datetime
import io
import base64

# Import optional dependencies with fallbacks
try:
    import plotly.express as px
    import plotly.graph_objects as go
    PLOTLY_AVAILABLE = True
except ImportError:
    PLOTLY_AVAILABLE = False

try:
    from streamlit_lottie import st_lottie
    LOTTIE_AVAILABLE = True
except ImportError:
    LOTTIE_AVAILABLE = False

try:
    import pandas as pd
    PANDAS_AVAILABLE = True
except ImportError:
    PANDAS_AVAILABLE = False

try:
    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.lib import colors
    REPORTLAB_AVAILABLE = True
except ImportError:
    REPORTLAB_AVAILABLE = False

# Mock function for run_analysis since engine.py is not available
def run_analysis(user_id, upi_id, reason, amount):
    """Mock analysis function that simulates the ML prediction"""
    # Simulate some processing time
    time.sleep(0.5)
    
    # Generate mock results based on input
    scam_probability = random.uniform(0.1, 0.9)
    
    if scam_probability < 0.3:
        risk_level = "low"
        confidence = "High"
    elif scam_probability < 0.7:
        risk_level = "moderate" 
        confidence = "Medium"
    else:
        risk_level = "high"
        confidence = "High"
    
    # Generate mock risk factors
    risk_factors = [
        ('amount_anomaly', random.uniform(0.1, 0.3)),
        ('merchant_trust', random.uniform(0.2, 0.4)),
        ('urgency_level', random.uniform(0.1, 0.2)),
        ('time_anomaly', random.uniform(0.05, 0.15)),
        ('new_merchant', random.uniform(0.1, 0.25))
    ]
    
    return {
        'ml_prediction': {
            'risk_level': risk_level,
            'scam_probability': scam_probability,
            'confidence': confidence,
            'top_risk_factors': risk_factors[:3]  # Top 3 factors
        },
        'explanation': f"Based on the analysis of the transaction amount (₹{amount:,.2f}) to {upi_id}, the AI model has identified several risk factors. The transaction description '{reason}' has been analyzed for suspicious patterns.",
        'final_recommendation': f"{'Proceed with caution' if risk_level == 'high' else 'Transaction appears safe' if risk_level == 'low' else 'Review transaction details carefully'}. Always verify recipient details before completing the transaction.",
        'risk_factors': [
            {'factor': 'amount_anomaly', 'weight': random.uniform(0.1, 0.3)},
            {'factor': 'merchant_trust', 'weight': random.uniform(0.2, 0.4)},
            {'factor': 'urgency_level', 'weight': random.uniform(0.1, 0.2)}
        ]
    }

#---- Mock User IDs since budget_db.json is not available ---
valid_user_ids = ["user_001", "user_002", "user_003", "user_004", "user_005"]

# --- Page Configuration ---
st.set_page_config(
    page_title="FinWise AI - Smart Scam Detection",
    page_icon="🛡",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Initialize session state for dark mode and history
if 'dark_mode' not in st.session_state:
    st.session_state.dark_mode = True
if 'analysis_history' not in st.session_state:
    st.session_state.analysis_history = []

# --- Enhanced CSS Styling with Dark Mode ---
def get_css_styles():
    dark_mode = st.session_state.get('dark_mode', False)
    
    theme = {
        "dark": {
            "--bg-color": "#0d1117",
            "--card-bg-color": "#161b22",
            "--border-color": "#30363d",
            "--primary-text-color": "#c9d1d9",
            "--secondary-text-color": "#8b949e",
            "--accent-color": "#58a6ff",
            "--accent-hover-color": "#388bfd",
            "--success-color": "#3fb950",
            "--warning-color": "#d29922",
            "--danger-color": "#f85149",
            "--success-bg-color": "rgba(63, 185, 80, 0.15)",
            "--warning-bg-color": "rgba(210, 153, 34, 0.15)",
            "--danger-bg-color": "rgba(248, 81, 73, 0.15)"
        },
        "light": {}
    }
    
    current_theme = theme["dark"]
    
    css_variables = "\n".join([f"{key}: {value};" for key, value in current_theme.items()])
    
    return f"""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    :root {{
        {css_variables}
    }}
    
    body {{
        font-family: 'Inter', sans-serif;
        color: var(--primary-text-color);
    }}
    
    .stApp {{
        background-color: var(--bg-color);
    }}
    
    /* --- Card Layout --- */
    .card {{
        background-color: var(--card-bg-color);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease;
    }}
    
    .card:hover {{
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
        transform: translateY(-2px);
    }}
    
    /* --- Typography --- */
    .main-title {{
        font-size: 2.2rem;
        font-weight: 700;
        color: var(--primary-text-color);
        text-align: center;
        margin-bottom: 0.5rem;
    }}
    
    .subtitle {{
        font-size: 1.1rem;
        font-weight: 400;
        color: var(--secondary-text-color);
        text-align: center;
        margin-bottom: 2rem;
    }}
    
    .section-header {{
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--primary-text-color);
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--border-color);
    }}
    
    /* --- Metrics & Badges --- */
    .metric-card {{
        background-color: var(--bg-color);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 1.5rem;
        text-align: center;
        margin-bottom: 1rem;
    }}
    
    .metric-card h3 {{
        font-size: 1rem;
        font-weight: 500;
        color: var(--secondary-text-color);
        margin-bottom: 0.5rem;
    }}
    
    .metric-card h2 {{
        font-size: 2rem;
        font-weight: 700;
        color: var(--primary-text-color);
        margin: 0;
    }}
    
    .risk-badge {{
        padding: 1rem;
        border-radius: 10px;
        font-size: 1.3rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        text-align: center;
        border-width: 1px;
        border-style: solid;
    }}
    
    .risk-low {{ background-color: var(--success-bg-color); color: var(--success-color); border-color: var(--success-color); }}
    .risk-moderate {{ background-color: var(--warning-bg-color); color: var(--warning-color); border-color: var(--warning-color); }}
    .risk-high {{ background-color: var(--danger-bg-color); color: var(--danger-color); border-color: var(--danger-color); }}
    
    /* --- Interactive Elements --- */
    .stButton>button {{
        background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-hover-color) 100%);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        transition: all 0.3s ease;
    }}
    
    .stButton>button:hover {{
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }}
    
    .download-button a {{
        text-decoration: none;
    }}
    
    /* --- Customizations --- */
    .context-item {{
        background-color: var(--bg-color);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 0.5rem;
        border-left-width: 4px;
        border-left-style: solid;
    }}
    
    .recommendation-box {{
        background-color: var(--bg-color);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 1.5rem;
        border-left: 4px solid var(--success-color);
        margin-top: 1rem;
    }}
    
    </style>
    """

st.markdown(get_css_styles(), unsafe_allow_html=True)

# --- Utility Functions ---

def generate_pdf_report(result, user_inputs):
    """Generate PDF report of the analysis"""
    if not REPORTLAB_AVAILABLE:
        # Return a simple text report if reportlab is not available
        report_text = f"""
🛡 FinWise AI - Analysis Report
Generated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

📋 Transaction Details:
Amount: ₹{user_inputs['amount']:,.2f}
UPI ID: {user_inputs['upi_id']}
Description: {user_inputs['reason']}
User ID: {user_inputs['user_id']}

🚨 Risk Assessment:
Risk Level: {result['ml_prediction']['risk_level'].upper()}
Scam Probability: {result['ml_prediction']['scam_probability']*100:.1f}%
Confidence: {result['ml_prediction']['confidence']}

🧠 AI Analysis:
{result['explanation']}

✅ Recommendation:
{result['final_recommendation']}
        """
        buffer = io.BytesIO()
        buffer.write(report_text.encode('utf-8'))
        buffer.seek(0)
        return buffer
    
    # Original PDF generation code when reportlab is available
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    # Title
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=30,
        textColor=colors.darkblue,
        alignment=1  # Center alignment
    )
    story.append(Paragraph("🛡 FinWise AI - Analysis Report", title_style))
    story.append(Spacer(1, 20))
    
    # Transaction Details
    story.append(Paragraph("📋 Transaction Details", styles['Heading2']))
    transaction_data = [
        ['Field', 'Value'],
        ['Amount', f"₹{user_inputs['amount']:,.2f}"],
        ['UPI ID', user_inputs['upi_id']],
        ['Description', user_inputs['reason']],
        ['User ID', user_inputs['user_id']],
        ['Analysis Time', datetime.now().strftime("%Y-%m-%d %H:%M:%S")]
    ]
    
    transaction_table = Table(transaction_data)
    transaction_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 14),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    story.append(transaction_table)
    story.append(Spacer(1, 20))
    
    # Risk Assessment
    risk = result['ml_prediction']['risk_level'].upper()
    
    story.append(Paragraph("🚨 Risk Assessment", styles['Heading2']))
    risk_data = [
        ['Metric', 'Value'],
        ['Risk Level', risk],
        ['Scam Probability', f"{result['ml_prediction']['scam_probability']*100:.1f}%"],
        ['Confidence', result['ml_prediction']['confidence']]
    ]
    
    risk_table = Table(risk_data)
    risk_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 14),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    story.append(risk_table)
    story.append(Spacer(1, 20))
    
    # AI Explanation
    story.append(Paragraph("🧠 AI Analysis", styles['Heading2']))
    story.append(Paragraph(result['explanation'], styles['Normal']))
    story.append(Spacer(1, 20))
    
    # Recommendation
    story.append(Paragraph("✅ Recommendation", styles['Heading2']))
    story.append(Paragraph(result['final_recommendation'], styles['Normal']))
    
    doc.build(story)
    buffer.seek(0)
    return buffer

def save_to_history(result, user_inputs):
    """Save analysis to session history"""
    history_entry = {
        'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        'amount': user_inputs['amount'],
        'upi_id': user_inputs['upi_id'],
        'reason': user_inputs['reason'],
        'user_id': user_inputs['user_id'],
        'risk_level': result['ml_prediction']['risk_level'],
        'scam_probability': result['ml_prediction']['scam_probability'],
        'confidence': result['ml_prediction']['confidence'],
        'explanation': result['explanation'],
        'recommendation': result['final_recommendation']
    }
    st.session_state.analysis_history.append(history_entry)

def create_risk_factor_explanation(factor_name, weight):
    """Create explanation for each risk factor"""
    explanations = {
        'amount_anomaly': f"Transaction amount appears unusual compared to typical patterns (Weight: {weight:.1%})",
        'time_anomaly': f"Transaction timing is outside normal hours (Weight: {weight:.1%})",
        'merchant_trust': f"Merchant/UPI ID has low trust score (Weight: {weight:.1%})",
        'urgency_level': f"Transaction shows high urgency indicators (Weight: {weight:.1%})",
        'new_merchant': f"First-time transaction with this merchant (Weight: {weight:.1%})",
        'budget_exceeded': f"Transaction exceeds user's typical spending patterns (Weight: {weight:.1%})",
        'category_risk': f"Transaction category has elevated risk profile (Weight: {weight:.1%})"
    }
    return explanations.get(factor_name, f"Risk factor: {factor_name} (Weight: {weight:.1%})")

# --- Header Section ---
st.markdown("""
    <div class="main-header">
        <div class="main-title">🛡 FinWise AI</div>
        <div class="subtitle">⚡ Next-Generation Scam Detection Platform</div>
    </div>
""", unsafe_allow_html=True)

# --- Sidebar for History ---
with st.sidebar:
    st.markdown("## 📈 Analysis History")
    if st.session_state.analysis_history:
        for i, entry in enumerate(reversed(st.session_state.analysis_history[-5:])):  # Show last 5
            with st.expander(f"Transaction {len(st.session_state.analysis_history)-i}"):
                st.write(f"*Amount:* ₹{entry['amount']:,.2f}")
                st.write(f"*Risk:* {entry['risk_level']}")
                st.write(f"*Time:* {entry['timestamp']}")
                st.write(f"*Probability:* {entry['scam_probability']*100:.1f}%")
    else:
        st.write("No analysis history yet.")

# --- Input Section ---
st.markdown('<div class="card">', unsafe_allow_html=True)
st.markdown('<div class="section-header">💳 Transaction Analysis</div>', unsafe_allow_html=True)

with st.form("transaction_form"):
    col1, col2 = st.columns(2)
    
    with col1:
        amount = st.number_input("💰 Transaction Amount (₹)", min_value=1.0, step=1.0, help="Enter the transaction amount")
        upi_id = st.text_input("👤 Recipient UPI ID", help="Enter the UPI ID of the recipient")
    
    with col2:
        user_id = st.selectbox("🔑 Select User ID", options=valid_user_ids, index=0)
        st.markdown("<br>", unsafe_allow_html=True)
    
    reason = st.text_area("📝 Transaction Description", height=100, help="Describe the purpose of this transaction")
    
    col1, col2, col3 = st.columns([2, 3, 2])
    with col2:
        submitted = st.form_submit_button("🚀 Analyze Transaction", use_container_width=True)

st.markdown('</div>', unsafe_allow_html=True)

# --- Processing & Results ---
if submitted:
    # Create placeholder for auto-scroll
    if not user_id.strip():
        st.error("User ID is a required field.")
        st.stop()
    
    with st.spinner("🔍 Analyzing transaction for potential threats..."):
        result = run_analysis(
            user_id=user_id,
            upi_id=upi_id,
            reason=reason,
            amount=amount
        )
        time.sleep(1.5)

    if "error" in result:
        st.error(f"❌ Error: {result['error']}")
    else:
        # Save to history
        user_inputs = {
            'amount': amount,
            'upi_id': upi_id, 
            'reason': reason,
            'user_id': user_id
        }
        save_to_history(result, user_inputs)

        # Display results
        st.markdown('<div id="results-section" class="card">', unsafe_allow_html=True)

        # Determine risk level to select animation
        risk = result['ml_prediction']['risk_level']
        risk_key = risk.upper()  # Normalize to uppercase

        # Display animation if Lottie is available (skip file loading since files don't exist)
        if LOTTIE_AVAILABLE:
            # Create a simple placeholder animation or skip
            col1, col2, col3 = st.columns([1, 1, 1])
            with col2:
                st.markdown(f"<div style='text-align: center; font-size: 4rem; margin: 1rem 0;'>{'🛡️' if risk_key == 'LOW' else '⚠️' if risk_key == 'MODERATE' else '🚨'}</div>", unsafe_allow_html=True)

        # Risk Level Badge
        risk_class = f"risk-{risk_key.lower()}"
        risk_icons = {"LOW": "✅", "MODERATE": "⚠", "HIGH": "🚨"}
        risk_icon = risk_icons.get(risk_key, "❓")  # Fallback icon if not found

        st.markdown(f"""
            <div class="risk-badge {risk_class}">
                {risk_icon} Risk Level: {risk_key}
            </div>
        """, unsafe_allow_html=True)

        # Metrics Dashboard
        st.markdown('<div class="section-header">📊 Risk Metrics</div>', unsafe_allow_html=True)
        
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.markdown(f"""
                <div class="metric-card">
                    <h3 style="color: #3b82f6; margin-bottom: 0.5rem;">🎯 Scam Probability</h3>
                    <h2 style="color: #1e293b; margin: 0;">{result['ml_prediction']['scam_probability']*100:.1f}%</h2>
                </div>
            """, unsafe_allow_html=True)
        
        with col2:
            st.markdown(f"""
                <div class="metric-card">
                    <h3 style="color: #3b82f6; margin-bottom: 0.5rem;">🔒 Confidence</h3>
                    <h2 style="color: #1e293b; margin: 0;">{result['ml_prediction']['confidence']}</h2>
                </div>
            """, unsafe_allow_html=True)
        
        with col3:
            st.markdown(f"""
                <div class="metric-card">
                    <h3 style="color: #3b82f6; margin-bottom: 0.5rem;">💸 Amount</h3>
                    <h2 style="color: #1e293b; margin: 0;">₹{amount:,.0f}</h2>
                </div>
            """, unsafe_allow_html=True)

        # Risk Factors Visualization with Explanations
        st.markdown('<div class="section-header">📈 Risk Factor Analysis</div>', unsafe_allow_html=True)
        
        top_factors = result['ml_prediction']['top_risk_factors']
        if top_factors:
            if PLOTLY_AVAILABLE:
                factors_df = {
                    "Factor": [f[0].replace('_', ' ').title() for f in top_factors],
                    "Weight": [round(f[1]*100, 2) for f in top_factors]
                }
                
                # Create a more attractive bar chart
                fig = go.Figure(data=[
                    go.Bar(
                        x=factors_df["Factor"],
                        y=factors_df["Weight"],
                        marker=dict(
                            color=factors_df["Weight"],
                            colorscale=[[0, '#3fb950'], [0.5, '#d29922'], [1, '#f85149']],
                            showscale=True,
                            colorbar=dict(title="Risk Weight (%)")
                        ),
                        text=[f"{w}%" for w in factors_df["Weight"]],
                        textposition='outside',
                        hovertemplate='<b>%{x}</b><br>Weight: %{y}%<extra></extra>'
                    )
                ])
                
                fig.update_layout(
                    title="Top Risk Factors by Weight",
                    xaxis_title="Risk Factors",
                    yaxis_title="Weight (%)",
                    height=400,
                    showlegend=False,
                    plot_bgcolor='rgba(0,0,0,0)',
                    paper_bgcolor='rgba(0,0,0,0)',
                    font=dict(color='#94a3b8'),
                    title_font=dict(size=16, color='#f8fafc')
                )
                
                fig.update_xaxes(showgrid=False)
                fig.update_yaxes(showgrid=True, gridwidth=1, gridcolor='rgba(100,116,139,0.1)')
                
                st.plotly_chart(fig, use_container_width=True)
            else:
                # Fallback display when plotly is not available
                st.write("**Top Risk Factors:**")
                for factor, weight in top_factors:
                    factor_name = factor.replace('_', ' ').title()
                    weight_percent = round(weight * 100, 2)
                    st.write(f"• {factor_name}: {weight_percent}%")

        # Risk factor explanations (collapsible)
        with st.expander("View Detailed Risk Factor Explanations"):
            for factor, weight in top_factors:
                explanation = create_risk_factor_explanation(factor, weight)
                st.markdown(f"""
                    <div class="context-item">
                        <strong>{factor.replace('_', ' ').title()}:</strong> {explanation}
                    </div>
                """, unsafe_allow_html=True)

        # AI Explanation Section
        st.markdown('<div class="section-header">🧠 AI Analysis</div>', unsafe_allow_html=True)
        st.markdown(f"""
            <div class="recommendation-box">
                {result['explanation']}
            </div>
        """, unsafe_allow_html=True)

        # Final Recommendation
        st.markdown('<div class="section-header">✅ Final Recommendation</div>', unsafe_allow_html=True)
        st.markdown(f"""
            <div class="recommendation-box">
                <strong>{result['final_recommendation']}</strong>
            </div>
        """, unsafe_allow_html=True)

        # Download Report Button
        if st.button("📄 Download Analysis Report", key="download_report"):
            pdf_buffer = generate_pdf_report(result, user_inputs)
            file_extension = "txt" if not REPORTLAB_AVAILABLE else "pdf"
            mime_type = "text/plain" if not REPORTLAB_AVAILABLE else "application/pdf"
            
            st.download_button(
                label=f"📥 Download Report (.{file_extension})",
                data=pdf_buffer,
                file_name=f"finwise_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.{file_extension}",
                mime=mime_type,
                key="download_button"
            )

        st.markdown('</div>', unsafe_allow_html=True)

# --- Footer ---
st.markdown("---")
st.markdown("""
    <div style="text-align: center; padding: 2rem; color: #64748b;">
        <p>🛡 <strong>FinWise AI</strong> - Protecting your financial transactions with advanced AI</p>
        <p>⚡ Powered by Machine Learning • 🔒 Secure • 🎯 Accurate</p>
        <p style="font-size: 0.9rem;">© 2024 FinWise AI. All rights reserved.</p>
    </div>
""", unsafe_allow_html=True)

# --- Real-time Updates ---
if st.session_state.analysis_history:
    # Show some statistics
    with st.sidebar:
        st.markdown("---")
        st.markdown("## 📊 Statistics")
        
        total_transactions = len(st.session_state.analysis_history)
        high_risk_count = sum(1 for entry in st.session_state.analysis_history if entry['risk_level'].upper() == 'HIGH')
        avg_risk = sum(entry['scam_probability'] for entry in st.session_state.analysis_history) / total_transactions
        
        st.metric("Total Analyses", total_transactions)
        st.metric("High Risk Transactions", high_risk_count)
        st.metric("Average Risk Score", f"{avg_risk*100:.1f}%")
        
        # Clear history button
        if st.button("🗑 Clear History"):
            st.session_state.analysis_history = []
            st.rerun()

# --- Session State Management ---
# Ensure session state is properly maintained
if 'initialized' not in st.session_state:
    st.session_state.initialized = True
    st.session_state.session_id = datetime.now().strftime("%Y%m%d_%H%M%S")