import cv2
import numpy as np
from multiprocessing import Pool, cpu_count

### old film filter ###
def old_film_filter(img, setting):

    #sepia: https://medium.com/dataseries/designing-image-filters-using-opencv-like-abode-photoshop-express-part-2-4479f99fb35
    old_film = cv2.transform(img, np.matrix([[0.272, 0.534, 0.131],
                                            [0.349, 0.686, 0.168],
                                           [0.393, 0.769, 0.189]])) # multipying image with special sepia matrix
    
    np.clip(old_film, 0, 255, out=old_film) # normalizing values greater than 255 to 255

    #add noise (grain effect): https://www.askpython.com/python/examples/adding-noise-images-opencv
    intensity = int(setting)/2
    noise = np.random.randint(-intensity, intensity+1, old_film.shape, dtype=np.int16)
    old_film = np.clip(old_film + noise, 0, 255).astype(np.uint8)

    #vignette: https://dev.to/ethand91/creating-more-filters-with-opencv-and-python-3bhh
    h, w = old_film.shape[:2]
    level = 2.5
    x_resultant_kernel = cv2.getGaussianKernel(w, w/level)
    y_resultant_kernel = cv2.getGaussianKernel(h, h/level)

    resultant_kernel = y_resultant_kernel @ x_resultant_kernel.T
    mask = resultant_kernel/resultant_kernel.max()

    old_film = (old_film * mask[..., None]).astype(np.uint8)

    return old_film

### black and white TV ###
def bw_tv_filter(img, setting):
    bw_tv = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    #apply salt and pepper filter to b&w image
    h, w = bw_tv.shape[:2]
    setting = int(setting)
    noise_ratio = setting * 0.5 / 100
    noise_num = int(h*w*noise_ratio)
   
    noisy_pixels = (np.random.randint(0, h, noise_num), np.random.randint(0, w, noise_num)) #apply noise to random pixels
    values = np.random.choice([0, 255], noise_num) # salt or pepper (b or w)
    bw_tv[noisy_pixels] = values

    #apply scanlines
    for i in range(0, h, 10):  #every 10th row
        bw_tv[i:i+2] = (bw_tv[i:i+2] * 0.6).astype(np.uint8)  #darken by 60%

    return bw_tv


def vhs_filter(img, setting):
    frame = img.astype(np.uint8)
    b,g,r = cv2.split(frame)

    # for the vhs red and blue shift effect
    r_shifted = np.roll(r, shift=3+int(setting)/10, axis=1)
    g_shifted = np.roll(g, shift=-5-int(setting)/10, axis=1)
    b_shifted = np.roll(b, shift=-3-int(setting)/10, axis=1)
    frame = cv2.merge([b_shifted, g_shifted, r_shifted])

    # making the color a bit dull
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV).astype(np.float32)
    h,s,v = cv2.split(hsv)
    h = (h * 1.05) % 180  # since the maximum value of hue is 180
    s *= 0.7                        
    v *= 0.8
    hsv = np.clip(cv2.merge([h,s,v]), 0, 255).astype(np.uint8) 
    frame = cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)

    return frame

### pop art v2, andy warhol-like ###
def pop_art_filter_v2(img, setting):
    #pencil sketch: https://medium.com/@Kavya2099/image-to-pencil-sketch-using-opencv-ec3568443c5e#fe6b
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    inv_gray = 255-gray #invert
    kernel = 101
    blur = cv2.GaussianBlur(inv_gray, (kernel, kernel), 0)  
    inv_blur = 255-blur #invert again
    pop_art = cv2.divide(gray, inv_blur, scale=255)

    setting = int(int(setting)/3)
    if (setting % 2 == 0):
        setting += 1

    #threshold to make edges bolder for cartoon effect
    pop_art = cv2.resize(pop_art, (0,0), fx=0.5, fy=0.5)
    pop_art = cv2.adaptiveThreshold(pop_art, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY,  setting, 2)
    pop_art = cv2.resize(pop_art, (0,0), fx=2, fy=2)
    #apply colormap
    #options: https://docs.opencv.org/4.x/d3/d50/group__imgproc__colormap.html
    pop_art = cv2.applyColorMap(pop_art, cv2.COLORMAP_SPRING)   

    return pop_art

def neon_filter(img, setting):

    #read the image
    hsv_image = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    h, s, v= cv2.split(hsv_image)
    
    setting = int(setting)
    setting = setting * 255 / 100
    dark_threshold = setting
    bright_threshold = setting

   # threshold based on v
    dark_mask = cv2.inRange(v, 0, dark_threshold)
    bright_mask = cv2.inRange(v, bright_threshold, 255)

   # Create new H, S, V channels for the transformed image
    new_h = np.copy(h)
    new_s = cv2.add(s, 155)
    new_v = cv2.add(v, 20)

   # add new hue to each mask
    new_h[dark_mask > 0] = 120
    new_h[bright_mask > 0] = 170

    transformed_hsv = cv2.merge([new_h, new_s, new_v])
    neon = cv2.cvtColor(transformed_hsv, cv2.COLOR_HSV2BGR)

    return neon
