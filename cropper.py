import cv2
import numpy as np
import os

# Load the image
img_path = "./public/badges.jpeg"  # Assuming this is the path
img = cv2.imread(img_path)
img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

# Convert to grayscale and threshold
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
# Invert: background is light, objects are dark/colored
# Use adaptive threshold or simple threshold based on background brightness
# The background is cream (~240-250), so we threshold below that.
ret, thresh = cv2.threshold(gray, 220, 255, cv2.THRESH_BINARY_INV)

# Find contours
contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Filter contours by area to remove noise and small text
min_area = 2000  # Heuristic based on image size
valid_contours = [c for c in contours if cv2.contourArea(c) > min_area]


# Sort contours: Top-to-bottom, then Left-to-right
# 1. Sort by Y centroid
def get_centroid(c):
    M = cv2.moments(c)
    if M["m00"] != 0:
        cx = int(M["m10"] / M["m00"])
        cy = int(M["m01"] / M["m00"])
    else:
        cx, cy = 0, 0
    return cx, cy


valid_contours.sort(key=lambda c: get_centroid(c)[1])  # Sort by Y first

# 2. Group into rows
rows = []
current_row = []
if valid_contours:
    current_row.append(valid_contours[0])
    first_y = get_centroid(valid_contours[0])[1]

    for c in valid_contours[1:]:
        cy = get_centroid(c)[1]
        if abs(cy - first_y) < 100:  # Threshold for same row
            current_row.append(c)
        else:
            rows.append(current_row)
            current_row = [c]
            first_y = cy
    rows.append(current_row)

# 3. Sort each row by X
final_contours = []
for row in rows:
    row.sort(key=lambda c: get_centroid(c)[0])
    final_contours.extend(row)

# Save the crops to public folder
import os

output_dir = "./public/badges"
os.makedirs(output_dir, exist_ok=True)

for i, c in enumerate(final_contours):
    if i >= 10:
        break
    x, y, w, h = cv2.boundingRect(c)
    # Add larger padding to capture full badge
    pad = 20
    crop = img_rgb[
        max(0, y - pad) : min(img.shape[0], y + h + pad),
        max(0, x - pad) : min(img.shape[1], x + w + pad),
    ]

    # Convert back to BGR for cv2.imwrite
    crop_bgr = cv2.cvtColor(crop, cv2.COLOR_RGB2BGR)
    cv2.imwrite(os.path.join(output_dir, f"badge_{i + 1}.png"), crop_bgr)

print(f"Saved {len(final_contours)} badges to {output_dir}")
