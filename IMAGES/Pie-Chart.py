import matplotlib.pyplot as plt
import numpy as np

# Sectors and allotments
sectors = [
    "Health", "S.S.F. and Welfare", "Infrastructure", 
    "Governance and Defense", "Sports", "Research and Innovation", 
    "Debts", "Environment", "Education"
]
allotments = [15, 10, 9, 11, 5, 8, 7, 5, 20]

# Colors from colormap
cmap = plt.get_cmap("Blues")
colors = cmap(np.linspace(0.25, 0.9, len(sectors)))

# Create figure with extra space for legend
fig, ax = plt.subplots(figsize=(10, 6))
plt.subplots_adjust(left=0.35)  # increase or decrease to move pie chart horizontally

# Pie chart with percentages inside slices
wedges, texts, autotexts = ax.pie(
    allotments,
    colors=colors,
    autopct='%1.1f%%',
    startangle=90,
    pctdistance=0.7,  # percentage text inside slice
    wedgeprops=dict(edgecolor="white")
)

# Customize percentage font size
for autotext in autotexts:
    autotext.set_color('white')
    autotext.set_fontsize(10)      # increase/decrease percentage font here
    autotext.set_weight('bold')

# Legend (index) inside a bordered box
legend = ax.legend(
    wedges,
    sectors,
    title="Sectors",
    loc="center left",
    bbox_to_anchor=(-0.4, 0.5),   # move left/right to adjust distance from pie
    fontsize=10,                  # size of sector names (increase/decrease)
    title_fontsize=12,            # size of the title "Sectors"
    markerscale=1.5,              # size of the colored squares
    frameon=True,
    facecolor='white',
    edgecolor='black',
    labelspacing=1.0              # vertical spacing between lines
)

# Only the legend title is bold by default, sector names remain normal

# Title of the chart
ax.set_title('Budget Allotment', fontsize=16, pad=20)  # increase/decrease title size here
ax.axis("equal")  # keep pie circular

plt.show()
