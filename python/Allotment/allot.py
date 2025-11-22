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

# Create figure with extra space on the left for the legend
fig, ax = plt.subplots(figsize=(9, 6))
plt.subplots_adjust(left=0.3)  # reserve space on the left

# Pie chart with percentages inside slices
wedges, texts, autotexts = ax.pie(
    allotments,
    colors=colors,
    autopct='%1.1f%%',
    startangle=90,
    pctdistance=0.7,          # position percentages inside
    wedgeprops=dict(edgecolor="white")
)

# Customize percentage font
for autotext in autotexts:
    autotext.set_color('white')
    autotext.set_fontsize(10)
    autotext.set_weight('bold')

# Legend on the left with bigger color squares
ax.legend(
    wedges,
    sectors,
    title="Sectors",
    loc="center left",
    bbox_to_anchor=(-0.35, 0.5),  # adjust horizontal position
    fontsize=10,
    title_fontsize=12,
    markerscale=1.5,               # increase marker size
    frameon=False                  # remove box border
)

# Title
ax.set_title('Budget Allotment', fontsize=16, pad=20)
ax.axis("equal")  # keep pie circular

plt.show()
