from PIL import Image

img = Image.open('public/teepul-logo.png').convert('RGBA')
datas = img.getdata()

newData = []
for item in datas:
    # Change white / near white pixels to transparent
    if item[0] > 240 and item[1] > 240 and item[2] > 240:
        newData.append((255, 255, 255, 0))
    else:
        newData.append(item)

img.putdata(newData)
img.save('public/teepul-logo-transparent.png', 'PNG')
print('Created public/teepul-logo-transparent.png successfully!')
