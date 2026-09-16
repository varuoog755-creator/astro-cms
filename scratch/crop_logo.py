from PIL import Image

img = Image.open('public/teepul-header-logo.png').convert('RGB')
w, h = img.size
print(f"Original dimensions: {w}x{h}")

# Find bounding box of non-white pixels
non_white_pixels = []
for y in range(h):
    for x in range(w):
        r, g, b = img.getpixel((x, y))
        if r < 240 or g < 240 or b < 240:
            non_white_pixels.append((x, y))

if non_white_pixels:
    min_x = min(p[0] for p in non_white_pixels)
    max_x = max(p[0] for p in non_white_pixels)
    min_y = min(p[1] for p in non_white_pixels)
    max_y = max(p[1] for p in non_white_pixels)

    print(f"Content Bounding Box: min_x={min_x}, min_y={min_y}, max_x={max_x}, max_y={max_y}")
    print(f"Cropped width={max_x - min_x + 1}, cropped height={max_y - min_y + 1}")
    print(f"Padding removed: Left={min_x}, Top={min_y}, Right={w - 1 - max_x}, Bottom={h - 1 - max_y}")

    # Crop tightly to the content with a tiny comfortable 10px margin
    margin = 15
    crop_box = (
        max(0, min_x - margin),
        max(0, min_y - margin),
        min(w, max_x + margin + 1),
        min(h, max_y + margin + 1)
    )
    cropped = img.crop(crop_box)
    cropped.save('public/teepul-header-logo-cropped.png')
    print("Saved cropped logo to public/teepul-header-logo-cropped.png!")

    # Also make a transparent cropped version
    img_rgba = Image.open('public/teepul-header-logo.png').convert('RGBA')
    cropped_rgba = img_rgba.crop(crop_box)
    datas = cropped_rgba.getdata()
    newData = []
    for item in datas:
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
    cropped_rgba.putdata(newData)
    cropped_rgba.save('public/teepul-header-logo-cropped-transparent.png')
    print("Saved cropped transparent logo to public/teepul-header-logo-cropped-transparent.png!")
