from flask import Flask, render_template_string
import plotly.graph_objects as go

app = Flask(__name__)

@app.route("/")
def pie_chart():
    # Data
    sectors = [
        "Health", "S.S.F. and Welfare", "Infrastructure",
        "Governance and Defense", "Sports", "Research and Innovation",
        "Debts", "Environment", "Education"
    ]
    allotments = [15, 10, 9, 11, 5, 8, 7, 5, 20]

    colors = [
        "#08306b", "#0e2982", "#2a6fb9", "#428bce",
        "#6baed6", "#9ecae1", "#c6dbef", "#e6f0fa", "#f7fbff"
    ]

    # Create Plotly pie chart without built-in legend
    fig = go.Figure(go.Pie(
        labels=sectors,
        values=allotments,
        marker=dict(colors=colors, line=dict(color='white', width=1)),
        textinfo='percent',
        insidetextorientation='radial',
        sort=False,
        showlegend=False
    ))

    # Bold, centered title
    fig.update_layout(
        margin=dict(l=10, r=10, t=80, b=10),
        title_text="<b>Budget Allotment</b>",
        title_x=0.5,
        title_font=dict(size=22)
    )

    # Convert Plotly figure to HTML div
    graph_html = fig.to_html(full_html=False, include_plotlyjs='cdn', config={'responsive': True})

    # Build the legend items
    legend_items = ''
    for s, c in zip(sectors, colors):
        legend_items += f'<li><span class="color-box" style="background:{c};"></span>{s}</li>'

    # HTML template (CSS safe)
    html = """
    <!doctype html>
    <html>
    <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Responsive Pie + Index</title>
    <style>
    :root{
      --legend-width: 280px;
      --legend-padding: 14px;
      --legend-title-size: 16px;
      --legend-font-size: 14px;
      --color-box-size: 18px;
      --gap: 20px;
      --container-max-width: 1000px;
    }

    body{
      font-family: Arial, sans-serif;
      margin: 20px;
      display:flex;
      justify-content:center;
    }

    .wrap {
      width: 95%;
      max-width: var(--container-max-width);
    }

    .container {
      display: flex;
      gap: var(--gap);
      align-items: flex-start; /* align legend with pie chart vertically */
    }

    .legend {
      width: var(--legend-width);
      min-width: 180px;
      box-sizing: border-box;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: var(--legend-padding);
      background: #fff;
      box-shadow: 0 2px 6px rgba(0,0,0,0.04);
      flex-shrink: 0;
      margin-top: 40px; /* push it slightly below title */
    }

    .legend h3 {
      margin: 0 0 8px 0;
      font-size: var(--legend-title-size);
      font-weight: 700;
    }

    .legend ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .legend li {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
      font-size: var(--legend-font-size);
      font-weight: 400;
      line-height: 1.1;
      word-break: break-word;
    }

    .color-box {
      width: var(--color-box-size);
      height: var(--color-box-size);
      border-radius: 4px;
      flex-shrink: 0;
      border: 1px solid rgba(0,0,0,0.08);
    }

    .chart {
      flex: 1 1 0;
      min-width: 0;
    }

    @media (max-width: 700px) {
      .container {
        flex-direction: column;
        align-items: stretch;
      }
      .legend {
        width: 100%;
      }
      .chart {
        width: 100%;
      }
    }

    @media (max-width: 420px) {
      :root{
        --legend-font-size: 13px;
        --legend-title-size: 15px;
        --color-box-size: 16px;
        --legend-padding: 10px;
      }
    }
    </style>
    </head>
    <body>
    <div class="wrap">
      <div class="container">
        <div class="legend">
          <h3>Sectors</h3>
          <ul>
            """ + legend_items + """
          </ul>
        </div>

        <div class="chart">
          """ + graph_html + """
        </div>
      </div>
    </div>
    </body>
    </html>
    """
    return render_template_string(html)


if __name__ == "__main__":
    app.run(debug=True)
