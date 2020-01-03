import {
  Injectable
} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IconsService {

  icons: {} = {
    'default':{
      'white': {
        '20': "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAABJ0lEQVQ4ja3SsUrDUBjF8f93E42aR8hgRkFwEzIrOBYiLg6+g4ODLqJTkA76CMGli2ChUwlkzCIIDsFZpzxBpbbN5yCmdb3JmS6/5YNzLnQc0fc8BQJEE9k5zAHamAsUUIcsnM+VQ9Ymfw99G/u4axFQye5BaWumueU5MUYzjA47sa4iH093qaIBRpPw+CoHaGMuIoXUhGauy7JbWDNK9dj3p5t1hGi1fXJZ2lozynRrEauQKTLswjqLPN+epiIEpibp3QxygDbmIlKoaqg4/8q2tWaUcf/Mn0xmkSNS9a4Hpa01o0y+5rEgWa3L397GOouc9/ZT0ACtk4fRaw7QxlyBQtFQhNVi29hvLo72/O91L3KE6n70UtpaM8psw4uN0UxlWayN/QDKPng3mo0/zgAAAABJRU5ErkJggg==",
      }
    },
    'home' : {
      'default' : {
        '20': "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAACCUlEQVQ4jd2SX0hTcRTHzzm/m9u6LGaD9E4Z0gYp9FCspTCR7MGHegliEor0KsUehF4UH4LAh5CiVvTUQwS96MMIMQghi9LBlkwIAtmsbHUdRf650zl37z29FVt128KnPo+/8/19DpxzAKqgN5oI9UYToWqyaFU8dfOZ67DNcfu4R5xBAJFSjSfpncKl2aHu9dqEzDhwNx5pclIk5CV/QkUdADCosHi1YqY/aWb04eWOKCDyX4Xno8nWRrt+r6tFhFQNiOv2i3C7BwgRphZy8G1jw/C5AJ6/M5K5LTE4MXQy9Vth+Macw+Wg8ZZ67DviFgferkl4NqCg120va6iuFeHxgsp+Z4k/a6wtrupT77/sDM5e7c7/EF64Ndd3SKbRHr/UupgD9jcdpNNH3ZYDnk+vw+ulr2ZAMenlB176qPH1R5H2+zhwZ/5aj0+6ohWxriQ56FxQAdkmLFQ/2SoaEEuosE8vmE4b7z7N6OMkkJR4lvOBNg/1dzZXLQMAkG0C+jubIdDmoXiW8wJJoewmjekkTfsa5KpFlfgaZNBJms5u0hjNDAeXkX9df60gI88MB5clq9BEfBWYy3shIoQ7Gv/4x1JY2N6GLq9R9vZixXrGZFn9B/4z4YOUvrfCi8csd1i7sBr2XCgBAJQMiI1MZuyVxeKufuJNjssOz2DTGJnMJCuzhoExAIDvFlS9a0B4iOQAAAAASUVORK5CYII=",
      }
    },
    'menu':{
      'default': {
        '20': "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAAVElEQVQ4jWNgGHGAMXH6WR92VqYQahj28/e/NSzsrEwhLSFK8dQwsGbNPQYmahiEDFh+/v63pmbNPaoY9vP3vzVUMQgZjEYKZWA0UqgDBn+kDH4AAOjuOV5mdqZsAAAAAElFTkSuQmCC",
      },
      'blue-ui-true': {
        '20': "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAAVElEQVQ4jWNgGHGAMW76BR8OVqYQahj24/e/NSwcrEwhlSE68dQwsH3NFQYmahiEDFh+/P63pn3NFaoY9uP3vzVUMQgZjEYKZWA0UqgDBn+kDH4AAOvWOV7jfut1AAAAAElFTkSuQmCC",
      },
      'blue-ui-false': {
        '20': "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAAVElEQVQ4jWNgGHGAMXH6WR92VqYQahj28/e/NSzsrEwhLSFK8dQwsGbNPQYmahiEDFh+/v63pmbNPaoY9vP3vzVUMQgZjEYKZWA0UqgDBn+kDH4AAOjuOV5mdqZsAAAAAElFTkSuQmCC",
      },
    },
    'wrong-entry':{
      'default': {
        '20': "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAACp0lEQVQ4jaWUXUhTYRzGf2fT7Wx+NNtRZ7OYsw+/SFDDIUQRgdSFF8IgvRASVtRVSIUXXkYIid1JpaJIWKAYdFFRVDc1KyobmUpmeZFOj18L9WxT3LqQHTDdzHquXh7+/x/P857DK7CNyq+/PYomdBNAQLj0pN7xKta8EDmca/twNUsyXhCEdWtqfMqc5h0xjIoZoZm4VPuKIU5jXfR+OxDwauSMHL/FZpkDCIfD/JhRWu64im8AxEWAGjR5ruN7bEZRD8C9hz5OP7vLtDGVzsM1I2FF4OxQpy5dmeVRUVNSVbktCUAJBGno/Z4f4ajAiAz6dWB+biYPylwYVgMUrsmJAAP5p/DHixTnZqpzSiC4YX8TMKLSAiulBTWxrmtLaXa8sY2iJozo3dgCH8cXACi2pXAkOyXm/LYJB8YXcJZIOEskFfxfwJ1q28pFthR63s8CUJIVu+5fAaVkPVKSCMDuRP2/A8PAffdPxHgo2msEwDM+x8tBGXFpHuXbKKHlJUKiAVZNDmez29BTV+aPCnz6WWZ/mg57qqh6juxkWrteUfGmHYsyo/rHdaZDtw5WvXA2u09E/Shj3sUNMIDHL4epeNOONVGLrqAQAF1BIZJJpHast9Q8N9EUNaGoj+fBx/kN3uyXUSzKDFp7Iab6ayz3dZNQWY2vsYF02SNY/dOOqMDaY/s2ea2vnwOwMuhhua+bpLMXWexoYWXQA4B+LbBrZ/+hMVGtmVBZzWJHCwmV1Wr9oFb8tSmhPxj801JlsNvxuU2Y5Wl8jQ2sDHpY/TrEmjzNvM4UnhRT+9UH1tU2cDnPmnBeGyNgKBQWJj8NW6s8XaJFkVV/XmcK38450++V7CeFGPtbytnsNpjnJpoy/LJDvxY0BbV635Qo9c9Ke6/01JX5fwOqTOLSaSbEsAAAAABJRU5ErkJggg==",
      },
      'blue-ui-true': {
        '20': "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAACoUlEQVQ4jaWUW0jTYRjGfzu4g5vzr9vwMA2PFR7ajSeELgqjwjtJKgvBIKSuQiq88DJCSOzODC9MEAkUuwhBCrwpFNOo6RqRLgSbuTnnPGzTybYuZH8yncN8rr7v4X1/PO/3fXwS4ujy08nzSMPPASRIHoy2Vn08ql4SXdx6MfM4LUVzL+r4HA59ltOmtqszw265IS+olkszN5fn8wNL0l9pRQGNybQKQARc61td/c3mZwDyKFAGRTVluTmFqXv70dFVro31s5xopO9c4/eIX0KT7ZUize9myNyZdOVSbhLAnAdev7cWRzkiMKqClL2I5aWZvKm+i3p3G3PIpQX4UnyVQIKKitJMsW7OE9nXfwAYVWWJicqSxqOO61BJj90RRzETRjVp9zK9sAFAeY6OinzhyPq4CT8vbFBblk1tWbYIPhHwuIo7clmOjpHpRQAqcnUnBxp0CvSaBABStYr/B0aAvg9LbITkmIx6AEZsa8hn3ST73Pjn5wj7ttiSa1GFdVX1nePqwZbqQEzgiGUFaWIShYJW9HIzDIy/fUf1VA/p/hXRX1MIZ7pP3xyr7xy/GPNSrA4/xr9gAN8+feX6VA8mrQxFiRkARYkZg6Dijn2oUr/q6IiZMEUt5efC4j4vbLeR7l9BlmdGaH2Cb3gATV0D3vY20lwWiSngrIoJbL6QfcDrmQgCELRa8A0PkNR0n83eLoJWCwDK0Hby8d5holYcU1PXwGZvF5q6BnH8HZlq/UDC+bXIv5ao8KkCvEoBvcuJt72NoNXC7g8bIZcTj0KILKmME+IHe7vb8jDLmNwsiYmDMBFJ0DZjapztU6X7XaLvUQiRl2dvTPw25NUc1X+o6jvH1fpVR0dGwFWlDO0IOzKld1llmHAbsh8NtlQH/gBdtuFAbIhUvwAAAABJRU5ErkJggg==",
      },
      'blue-ui-false': {
        '20': "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAACp0lEQVQ4jaWUXUhTYRzGf2fT7Wx+NNtRZ7OYsw+/SFDDIUQRgdSFF8IgvRASVtRVSIUXXkYIid1JpaJIWKAYdFFRVDc1KyobmUpmeZFOj18L9WxT3LqQHTDdzHquXh7+/x/P857DK7CNyq+/PYomdBNAQLj0pN7xKta8EDmca/twNUsyXhCEdWtqfMqc5h0xjIoZoZm4VPuKIU5jXfR+OxDwauSMHL/FZpkDCIfD/JhRWu64im8AxEWAGjR5ruN7bEZRD8C9hz5OP7vLtDGVzsM1I2FF4OxQpy5dmeVRUVNSVbktCUAJBGno/Z4f4ajAiAz6dWB+biYPylwYVgMUrsmJAAP5p/DHixTnZqpzSiC4YX8TMKLSAiulBTWxrmtLaXa8sY2iJozo3dgCH8cXACi2pXAkOyXm/LYJB8YXcJZIOEskFfxfwJ1q28pFthR63s8CUJIVu+5fAaVkPVKSCMDuRP2/A8PAffdPxHgo2msEwDM+x8tBGXFpHuXbKKHlJUKiAVZNDmez29BTV+aPCnz6WWZ/mg57qqh6juxkWrteUfGmHYsyo/rHdaZDtw5WvXA2u09E/Shj3sUNMIDHL4epeNOONVGLrqAQAF1BIZJJpHast9Q8N9EUNaGoj+fBx/kN3uyXUSzKDFp7Iab6ayz3dZNQWY2vsYF02SNY/dOOqMDaY/s2ea2vnwOwMuhhua+bpLMXWexoYWXQA4B+LbBrZ/+hMVGtmVBZzWJHCwmV1Wr9oFb8tSmhPxj801JlsNvxuU2Y5Wl8jQ2sDHpY/TrEmjzNvM4UnhRT+9UH1tU2cDnPmnBeGyNgKBQWJj8NW6s8XaJFkVV/XmcK38450++V7CeFGPtbytnsNpjnJpoy/LJDvxY0BbV635Qo9c9Ke6/01JX5fwOqTOLSaSbEsAAAAABJRU5ErkJggg==",
      },
    },
    'sort':{
      'orange': {
        '20': "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAAp0lEQVQ4jWNgGOyAEcZ4Vqtoy8jIIEGOIf//M7yQar5/mIGBgYEFYTTjkv8MDHJkOusRAwODPFl6CZsNBc/qlCYwMDBKEa2R8f9fxr9/qyRaHt5HFmdCMvo/VZxIbYDs5UcMDAyyROjok2q8V4xLGhHL//9HE5NsGP/+O4NPngWfJMIuRDojBIhLh7RMZ4QAznSIK50RAkMxHRJIZ4QARjoklM6GPgAAJ0E6Q6H2z8sAAAAASUVORK5CYII=",
      }
    },
    'batterie': {
      'white': {
        '30': "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAABc0lEQVRIie2VMS8EQRTHf48tNORINCf4AEfh+AYKhWh9BBUKfAWd9hQkErlCIRI0coXOF5DQiCgkNBJOh+L+ip11s5cLuzLX7T/Z7Oybee83s/PeDBQqVCiQLGlIioA1YBEoBWQ8A3UzO/aNkdfeBRaAGtAMCJ4ADiQNm9leqkdSSVJL0kxAoB9/RdJdt46qYlkXvxDgOUkt39bn3gZgZuoFGBBePvng/JGk6RzDP5yPJJ3/CyxpXtIFcJ3Vx8xugSlgGyhDOqt/g0XAMrAFzHj2IWDcPWPAC9Aws89ucEmPyfefYEklYIl4jzaBJ2AUuALeifevAeyY2WWWhWQCm1kTqHdMZhD4Ao4c8CbDAirENZ0yzkrKnNGSRiSVc4yvqK0zyLjHnTKz15wuA87vp6SSrJabWU8OEOL8SP3RBPzgOnpyZAJV4N43RBAnkKR94FRSDXgLCJ0E1oEN3+hfi/3AKnHphL4WD83sJGDMQoUKtfUNiqmf+u12lJsAAAAASUVORK5CYII=",
      },
      'blue-ui' : {
        '20' : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAA70lEQVQ4jWNgGAWUAsaUWReeGCny/6HUoHP3P7LMSTOQYZi2+/6D/1QA03bff8DAwMDARLEfoYCFiZEjddaFGSzUMjDVSV78z7//HkS5sH7NTYbpex4wvPz4k6Bagi689OgTw8m77xkYGBgYNp17wWCmJMgQZiHFoC3DS7yBt198Zdhw5jnDgetvGf7++8/AwMDA0BWpxaAnx0eeC1UluBlKfVQY4mxlGTaefcHw7P0PogzDaSAMiPOzM6Q5yRNlEAxQLdnM3vfw5fn7H3dQzcA///7/mJ1mkMFy7v5Hlul7Hjyk1MBz9z9SLU2PdAAATw+RZv4OwYcAAAAASUVORK5CYII=",
      }
    },
    'hum': {
      'white' : {
        '30': "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAACfUlEQVRIie2Wz0tUURTHz4MSKiUomahRCpVGyEUtpP6ERK2WTf0F1QRB6B/Qj1UQ9mNjtGgXk6REWS2y/oNaJJWrSN0UFOhIpI18Wrzvc242c+c6M7XqwIN3zvue+7nnnvfufWb/7R9ZFCoE2s3suJn1m9k+M2vXozkz+2hmk2b2KIqi+YbMDEgDo8BPqtsq8ADYWy/0GLCoQZeBPJAFMsA2XRnF8tKgnMFaoedVAcBDoCMgpxMYd6rP1VLpqq4hJ74ZuAZMAwVgSfcjQI+jG3bywypXT5PlHQJ2AheBVj0/CRTL9LcI3AKaHDjAArA7BHw3WV75F+S/BVKKdQA71OPDAib9feHAJxQbrQZt18yXk55q0MTW4GVyDwLz0t1UrAtYIf4i0j5wTol5+T3qUxGY0bNpD/yQJl0EDig2pryzPvBTibLrqr0HpFRxNfhtaa7LPy3/iQ+cVLVf/jv5vfJd+AowB/StG+NI0hb5GfnvfeDkbW6RvyR/i6NJCZrY7LoxWhRfLOcntqniLMwsiqLmMrEvwGcza6uQUzDnDIiiqKC2nPBV/NtSe3R9WuZZ4KhPG2TOy3Wq7sFsrb8zwAcg4xOeEzjfAGgT8MZ5F16jjaWcuI34Y18GOusEX+FPu+RLuCPReB3QbkpbqGs/Ki45sMf5rIZrBD8vA03smS9xkNKxtiE48aFRzXp9A+Qo/QhMAF2B4HwA+H61QQaIz1OId6sx4r23G2gGthL/dWSBSDnfAsBfQypoBW5Q/Wdvu/SFAPBCyOolE0gDZ4BJ4sOjAHwHPgGPgV3SvQoATwWDNzDBwQBwf8PBgl/1QC//FagDHwBeqiUFYMqt9BcEsCcuduo+iQAAAABJRU5ErkJggg=="
      },
      'blue-ui' : {
        '20' : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAD9klEQVQ4jY2TX0xbVRzHv+e2vfe29/ZC/0gLLRud0OGGYSCCShawGhTng85gshiNJkajJr45jE99MBrFLD4piS97GQ+aTJMtahTcMolE5lQI4AoDRvhTC72lve1tb//cHh8KjLIa/SYn5+T3y+9zfr9zfj+CCgoGKXNDvPEIz7MBxkBcRZ1GUunsWFe6YyIYJMVKMbsiB0FzzulBSbScqXPbjtitosCajMjlC5ATSXU9El9SVPVCS7R16N/Ae8De4BWx1u28eMLf0EOhs9mUgmoeMBBAp0BcAzhRAmDITc+vXI0m9dM/vNOqVgQGg5SZd89813l/Y190awu9TQICx+xl6VMAY7Myri1m4HA6MTl9a9QfaXniYKYGAHANPDvY1nzklfi2bHjt5D1orbfiva/mkaQWrKSMWE8CeR1oP2SBv4bF+M0oPHUu77Qa0ua+Hf5lP5AJBikjCpYXKHS2p0mA18ZjMkxhrzJjYSWMPh/BA24CNQ9c36Dw2nj03GuGAUXWKvAvgtKyf2D+kH7v9rjtvmxKwWPH7FiKA0YGeLO3Dr8txhBNZiGywAkXgYkBlhNA4LgD2ZSCerfDd+rc9YfLgBxnDDgkUajiCQiAtSTFUTuBwBnw6HEnPr68jKRWAAD4HQSrCgUBIPEE1ZIgChwfKAMyBG6T0QgTQwEA2QJgNpWcnMkEyeHCl5MRAIDFVPIDgNFAwZmMYBjqKQMWdbKRyxdQ2PkrkQWUbOk80OmCEougkM8DKNlFtuTTdSCXK6BYxGoZMJnJ/iQnkmpcK7VGvUQQkkvZWnkjzp7yYTWmAQBCMkW9REABJDRgK55UjUR/pm9oStgDdqU7JtYj8SVOlDA2F4NXKkF3VSNxeH+gGdi5zCsBo7MyOFHCZiRSeKvf39FgJyP72oYUFVW9ABhy126lsRbT4LGiojxWYC2mYXwxDXlb0fvbavk6u4U82e4JvPrF1BvATmM/3/n5xJy20N3k8zaO34xCL+Thq7HcNSmjszK+nkpAstlR1OKZ/naPGQBqbWb29pbaYG1+6fxeTN/QlOAUmIstzYd7GVpkc6oCad8sKzuzrFOSW1haDb/9VOOhaoHdi4+lsnT4+4VPDbuGxR+H8889+NnItBrSUpms21pVJfDWatZkqUbBwCOdR2p5Qw7dDm+eO2znjnbfV+Pe/xxm1kj+Wouby8bmTn2UPP3J5EMWi/lxwhA31Wk4o6ZHL53t+hWE0A8uLYXOnGzwHwwb+Xl53lgRSAi9DEygtO5osLQlUvlNAHcBlVR+k6kI/A+tb2tDV2ci8n7blZm/5XBc+6hyyf9DLw//edph5d6VBJNNSRdicjLz4fnX2775B0Clmnr6wfqjAAAAAElFTkSuQmCC",
        '10' : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAABmJLR0QA/wD/AP+gvaeTAAABZ0lEQVQYlVXMv0sCYQDG8ed93zv1Ok09vaJUMIoyRCQUh5SCWgtsKLGIqBwcov6KViNocKlF2toK2m0tFwNzuEihlKD8caZidbQk1Gf9PjwEvxIZJS6bxWVCqLHd7ipK9fXo8iBY7ncCAPsX5ZNJWUxODTFmYATVlob7Su/psVpbzex6bgGAJjJKfFIWk2sBCys8qxi2mTDjtmBu3OB2SOZU/5HKZnHJM8TYW5dgws6jUW9CEgCvcxAjEh+OpXN+AKAcx4x6RsAI4HNZcJV/h1EHdL4AgWOUweAAANr66ChVVYPAEzglPdZDMhpdgNM+8VLrNL1OYRUAmBzZKBCdGDXxmnXMrofNpIPa6eG68AGrQXtd8A3POiJbJQIAm6cPwRFpMOWQdGGRZ7TS6L23VTW7s+iOcoziTnm7Ifgjls759VRwfXcb2YBndG8l5DwEgHypXvw3/Gv7LCfPT4+eWwd4d7GiHv8AMWxuy0zZYDwAAAAASUVORK5CYII=",
      }
    },
    'temp': {
      'white' : {
        '30': "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAABiklEQVRIie2Vzy4DURSH75SykfAAhIRVu1As6Bv0HTxGLazFljRtPALCG6hY2YukT6AVfyOIhKLyWfiNjNG5U71tI+IkNyfnnt+c79y5d+4Y82+/zYAcUCPaqkCuG+CqBfoJ7wYYgHbzYUt0pq1vDRz2HOzz4wT9bVfWa/U8zwvOh+Mo69aKew/+G3sMtLRvsoTnebHg2BULWlT4ZJH6ueIPG40EL2nfzoCZwPyXCwOYBc41nXeFTgCPwLMPBaaArcA1uQlMKjcHvOiZcRfwqoqXAtCrJnf0RQC+obkVF/Cxiswr3o36OwDb0mQVH7mA71RkWPG1BXwpzYjiW1vtuFPt59/kBy1aP+dr+1zANfmU/IFFuyeflj9xAZflF+WXjTHNXuGNMSYf0pab6FozIA00gDowrbkxHbJ7jR1gVLkMH59eA0jZq8fDizosNR8eocsAp9IWnKAqmAT2VbCuRhaAIY0sUNJKkTbpDBZ8QMCG5XN6BQodg4YaSAPrQAV40KgAa857+m/dsnftk0qwLxQduAAAAABJRU5ErkJggg==",
      },
      'blue-ui' : {
        '20' : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAABmklEQVQ4ja2SMUvDUBSFb5r2ERO1sdZK0WJTRISKIjhURF066eQkKP4B0U3BzYwubg7ugoJLwdlFN6VYMNgiWodqFcWWarWNSV6eU0AjL9LQOz3Ol/NxhjDwzyW30v5IAK0CQ8h9Sd853hh7+6/jKFs7yCmZokoyRZWsHWSV5Fba79TxOMFIAK0uTklDooBAFBAsTMaGIp2+FaeO1wn6PNAvCggAAE6unkHVMOi6OeFa+POm490AAHCRL780RWgtrGk41BRhUxbqGHpS549/MtdCzYQoHwj/zvLlqGuhSUjZet89vIBhYNA0Q3fqOP6HJsC19Y71hmAgGgYPy6ZdL2RMMO0LDQMHXS2UZeIhDEj2hT7k5WWZUHtUkO1S5NF4LGHPRwel8VxQ2WxY2N7aMiO28sie+9t51CZwsw0LWZbpoDIvKzYs1HX8QWOablAZVVh5r6VKlWrNnpcr1Xq1/rVP67E0MJ/YPc2qt5KJcR/HId7AGApPr683hafDw+XhDVqPoQHr5rbPRhDHLREGiPpZ3ztaT1w6ff8NY9afcbpG6HYAAAAASUVORK5CYII=",
        '10' : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAABmJLR0QA/wD/AP+gvaeTAAAAwUlEQVQYlWNkQAIODftZwu1Up/xjYGBYfeh2zoEGxz8wOSZkhYZKop4u+hLpSmLc6RryQiHIcigKGRiYuFmYmRiYmRkZmP4xcSPLsCBzfvz5z3fhwUcGBgYGhv+MTMw4Ff78x6j08g8fw5sPnxi+//qnhdPqv/8ZL8LYf/4xXsGpkI+X3YSBgYFBRICPQVCISxOnQhEBfh8YW1iAzxenwp+//r6AsX///vcUp2devnqT/efvnzJGRsb/Lz6860KWAwCJaTfpF81fUAAAAABJRU5ErkJggg==",
      }
    },
    'pressure': {
      'white' : {
        '30': "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAAB50lEQVRIie2WzUpbQRTH/2OMCK1bV7YPoLjprquK3fkBiVR9A0MNKvoUodJHyEbQdfsAXVRpd13UuKhfKESkdumqFfTnIufCNObeZCapqx4Ybphz/h8598wk0v94pHCdFgIDkgq2XkgasdSFpG+SPkr64Jy76Zk7YA44pX2cAMVeCPYB7zzi78AqMAo8sTUGrAH7Xl0F6OtGOBH9DZSyyMzkW6sFqMSKznmirwJwE554IVR0wHunpQjTy4Y9BvIhwAXvnWa+K2AY+Ap89vZyQM043rTCpZEmLao65+6yRCV9kvRS0mCy75y7lVRt4mofwKG5HU3JTwMXwI3V1cyEXzNmuR8hwtcGGkrJ172j86dZ1GqGLH/diiOt1R3faJKunHO/MvItudKEf9rzWUp+SY2rsm6fW8Vze15mmPo7gG1r01rHoIccG8axFQJa9IYmFyGaAw6MYz4EmPcukHKE8Iphj4D+UHDRm9rJANxrw9wBs6GmE5L3nng5q+3W3hWrBdiMEjUyB2x6Z7YGrAPjwFNb47Z34NVVgJAjmWpgBjinfZwBU10LNonnafxU7tjQJHFI4/gVgwcp0ggAsfj4vyddRpAw8KX5m3ot3+vKCbDXwRCFxgNTj9Xq6FlooLO7sdsjk/827gHZjgVqi/49fwAAAABJRU5ErkJggg==",
      },
      'blue-ui' : {
        '20' : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAADb0lEQVQ4jY2UX2hbVRzHv/dPb27+J73JTWu7pttSCTa6tZsgThHUuTEU6pqBOFQYiFpfZPqgD0JgDx0oFeqDgqh7El3VIeLDNhnUVcpaGqaxm11tepfdLpq0W5osucn9d3yY6dL0dvP3dH6/8/19zjm/c86Pwl3s6eMTXV6na5BlmQgxzNWaoU7IPHV25rXd2mY5lFVwcGSq1+5yjLYJ/li76BPtNg66YaJQrNSu/Z1PF0uVr795c8cxUBS5JzA+evFgKOAd6e4Qw3PpDFqIAdbGAbqGikogCD60+jzqb3PSz1dodaB5t2yj8/wH07FQwDsS9DvDfy2kkRiIoMPPI5UjeFC8vfZn5zK4sJjh+mM9+5Ca/2IGeKmRQTc6Lq99tLtTDGez/+DwU71o8/EAsAYDgFef7EJ/lxML6atM133B/c+NzjxiCTzw4a/hkNDae2VBwvsDEezZQoFuKsjSzSqm0wUc2CGiXKmgLeANuG22dyyP7LC5DrWHfOKt4g10+Pl1IEU18N1UFrNLJRyLR8EyFHpEJyQ5B6fNttUSyNBUxM5xsNk4XMoTPBC8s72hL1NQDROfHnkILHM73uHnIUtlsBzvtgSCUEXdNGBq2joYABx5YgsiISfc/B15WTNBsyxM01Qta1g11fOlklKraBueFh6PCmhvKINuEMxdL0EM+FHTtGVLIHeDPy1dzy+2+r34fPwa0jcJdHMDGwDwQzKLgmLA63aaZUUbtwSOJXrV1VvKWEDwq5OLZSQXC2DpjbCqbuLM78uI3r8Vf8xnLuWXV4Yb59cVK5Eg9Fxb6qddsZ698wsZxsEYGHw4hL5uD1ZKKn5M5jAlFRHZFkYuX5Cz2ZUXvz266/ymQAA4lJjl2KB+ItwZeiYouIWMnINSUUCzNIKCHz6Px0zNS5eLRWXo+7f6f2nOt2wOAHDwo+k9drvjbaed69YJ6WNA5TXdvFypKeOkVhkeO/qoslnuPW3f8Umyf3gy8X+0FAC8/MnFZ/kWOt48WTNJX6vHsc0kxEVTlLpcUKp2FqeadapmVk+8sfN14L+HzbfQ8ffisVeahacuyIhu76y7XPJPmTv8WOcG3ckJ6Wp9zNZXaAzWTV6pBqLb4az75Zqun5yQlpp1s/Lq2hfa9FIA4IWPk7tbOGatmxgGkb4a2vnu3XL+BatlWdx+9Y/XAAAAAElFTkSuQmCC",
      }
    },
    'light': {
      'default' : {
        '20' : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAABmJLR0QA/wD/AP+gvaeTAAADX0lEQVRIia3WTWzTZhgH8L9jJ67tYNKQpGUdY7LoukyCAxpbE5VqVUdFEWl7AsaNjwO7gYQGqBqypnWHfZzX26RJy2HbZUwRiwhbF0FV0U7aDhudVqBFK5A1Tdqmjh37tc2FIiVxUnfiuVj28/79e19/yRRc1pHPb+82DSpK2UabTXlzJmX9lbnc89BNlmrWlGXbc8d7832aaOdYbSnkq+SCjKn5CN2iV9i2ZYOL5E0PO36A9I/LMmVtGekfm2rjrJVUoPh7lFce8LBthzQFRZCUtdZ9d8ue1qM3R7tzrpHBT7Jh2ijdastlXqOJ0myxAABCC1jaeehv8JGeHy++ma/te+oStk3RpnIt4hIAAMZUEH6S6bLU/A9O/TrkyNjPJ7atzr7BuASeQ2Qd4urdvYMfZ45vitCmdt6/NituSXhW/rXZbYxZudAUeUf+xU+TUjuF6pscCAQwMjICSZIAAJIkYXh4GIFAoGocBRsMWWsf+OwPoSHCtgi7fZUCXzuToaEhTE9PIxaLIZFIIBaLYWZmBolEom41Xn2Ft6zyKw0RG2Q7bWlsbXB+fh6SJCGZTGJ5eRnJZBKSJGFhYaEOoU2txWPbrQ0RWCiYDKfVBrPZLHieR29vLyYnJxGPxyGKIrLZbB1CaE5lLLrqMa5CdL0yp7ORUl0SQDqdRmdnJwAgGo0ilUo5DYPOhkvCnoV7DZEJuY8QRrhv0XVXDABgGEbVtrYsugWmT5j77tgxsyECAIZPHF0J7v/P8Syb1Epwf86mhdHa43VI+lL8jsZ1pDWuo7IVQOU6NJV76afUlYO/bYoAwDrxni6Eum+XuZdVVwC/Sy2Eum8pxHvWqe+ITMh9hOtaHSiG3v46Hz74mNCC0zAQRkA+0vuoEHzrK75r9fCE3EecxjGNZvfs5p079OnUFxU29BFf/rcfQHijXwweWCoLuzKEEa+mr8Tnmiy0MbJRNz7o/gfAe8NXv61683TfdjX14eGTm+VdIRvF7ni1/fqiQLR9p4zri6KX3eFtd5t1jewM+pfODLzeUVzXGWLZ+ObXB4svHPEylAkArX5f1f4LRRSNUABQXNdBLBuKajb9CflfSEkl42Pf/3kBsEKAJ6/q5Eu3WdezAYBBeUq0OftdH8wb1y71OH5IneopkiFJ+1xUk6sAAAAASUVORK5CYII=",
      },
      'white' : {
        '30': "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAABu0lEQVRIie3UvY8NURzG8ZkrawsvQSQqL1Ho7JIoFKJhhSgoZGkl/oSt+BskItHQ0CkkqFAolmZbiYRus1axXiN2s4VYH83vciL3zp05d64o/JLJyfzmeZ7vOWdmTlH8r3+xMIVbeI2VuF7hJo6NArgPswbXU+xtC3oUnyN4CZcxiQ1xHcAVvAvNBxxuY6Vd6F1srNBuxr3QvseeYcCzCbSsoe/gfnge5UKnku3tu9Ievi34GN4j/XSdiozpGK+XZblSF1yW5ZeiKG7E7YW6vl8VvwxMZHgPhfdlDng5zLW3OfFuCu/XfpqqrV6LcV1TcJI7lgNeiHF3BnhnjEs54O77OZEBPh7jXGMnTnc/EFRN8E9fBy/CeyYHPIb5CLjUwHcxPAtY3xgcIeci5BMGvmvsCi2cz4ImYQ8iaA7jFbrx0MDDOkfsIPDWZMtvV+juhGYe24aCJqETyYEy0+P5TDxbxmQr0CT8LNbwHQeT/n58ww9MV2UMA78aK3uS9B5H79pIoAHZHpDVpLcavR1Nshp/edAzqCwbZdU+kdquHPDbHr3FYScysHAKi37XG5wcOTiZwHM8+2vAtuonXZkp1abMg2kAAAAASUVORK5CYII=",
      },
      'blue-ui' : {
        '20' : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAACV0lEQVQ4ja2TTWgTQRTH33az2exnaA0xpsWgkqJ40AiJpXqJB220iKCiKKg3QRTRS685+XHxIPXgRfQi0uYg0kMPIoWKSShYK1bEUNZgPrQxMc0mu5vtZsdDiGa32UTBPwzM+/q9N8MMBl10/O5rjmboEwRhCyAESNO0d1JNev5i4qBoVYN1cp6+94ZiGG5yi4sLD2/d5BvgqT4AgGJF1lPpH+lMqfpKqYrXpm+Oyj2Bx27P93vcA7Nj+3cEGYe9Y8OarKLZ5MrCirh6ZO5GuNwe6zMnu939sfFRf8gKBgDAUHZs/IA/tJ11T5tjBuCZB4vnQzsHR0jCZsX6LZKwQXCXd+Tc5NJZS6CTdlzwbXbS7T4M67wHAPB5nCzL2C+2+wyjcBThbbe9LABPYlBvoOZUOAaVOoJc9U8OSxGDlkDchlPm6QoSAtSyAQFpug3chhlOZDiypjWUdjsrAvAkAELNxZMAOdMLbDTA8HQMwKq8ngWThDKAi24uoWyOAog11VBjAFZk5Un6e1naWNZZQv5nbU2qP7IEPrsSeJr8mIvXVa0nTFE1WPiUT0xd3TtlCQQA+FItnJqJp5I1WUXmWEuipKKZeCqZKSonzTHLv0wx3H2viz0U8Hu27RsiMQCAt5k6Wvz8TcgWxZdf88Xrc9Gw0qneUpFogp+ICUKqpKNUSUcTMUGIRBN8txrL/9rSpYdLld1DvB0AYDlTUR9f3tMVuOEOzWIcuBocdpEcTZCUHV/vld8T+K/qCWzo6MP88qpeWKvrCKH3/6Xr2K3E0cN34pG/yf0FNoLasE/hVVIAAAAASUVORK5CYII=",
      },
      'blue-ui-true' : {
        '20' : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAABmJLR0QA/wD/AP+gvaeTAAADhklEQVRIia2Vb2gTdxjHv9e7XNr8uTQxaa4UkzfrH/tiUKdVtAy7zjKHezUQ6puiyND5Zs6idZ16Crrh9qYgW+nAjkFAmI6t64ZujtXRQtmQqKxu1aTdtVibJs2lTdIk93cvtsGSu7RX8PvmuOd5vs/n+XEPvyNgUq9/PB5UJGKLzbLqX5VsMYVQH93pbZs14yXWSnKcVvGna+RYNSUcbXBOeeuZRx43LdCC6BafpJuXHqebEsuia6Bx5Y0BjiPUDUM6Lk34g47Z794MhLbs9t21EdB0NRoIjMf3ZG/yB//gs4H9P/XtjJmG7Lv8i2+zc27sTPO5Bo81sdZhAQBLBR8+nLww9UxsbPu2Z5vOUKEfTyNYx8Lw6ebzpgAAsMkax6nmC41eeuYbozxZGuhy7uzaX3fj0IvusNUU4V/ZqSw0jaimdn8w/fut0OT/c7qTMHTynb213zMbAfynztoRJ0OmTpTGiyB7uJ8d/qp5liSUoiKCZmENngXpbAUAkM5WWIPvg6DZojqSUOCvmmc7P3pgLwuxVtqDAceMrXSSykAfpPhNWGq6YA30wlLTBSn+FSoD7+lOE7DxNlVdDZSFaJBdDLWi+xZKJgyKaUU+ehJqfg756ElQTCuUTFgHYahUZYWmuctCoCKZkjz5UqO4cA0gXaDZQ5AWQ7D4D4Kw1EBcGNJBBGlTjlLJorUsgohiIRJZaUrrnADEp/0gXbsAAFR1OwpzV4zKEEk3pO0v8NGykFGuXU6I3umM7DRsALVQ/CxRWnYhKXkjXx44ULQ5uhVelNm+63z3ojFlbV3/qzuWLHj7SuM6yMi7L//6ILX19kOhxXjcMrqfein/cLnl1tc9r9xbFwIAs4Ln8GeR4+P3hW05M4BwcnvuWvT42KzgPmKUN4SMcu1yrk7rHIoe/eLqVM+zpYLPsHmi4MPVx6fmP58+NrRaq7w2yrXLRnVr/k8AYO+VifrNVv7iVs9vHW91tvhyT95GVf0nGPwhHL8n7Lgzn607d/vMrsh6fUypd7CfF2MhbXnMpYmxkNY72M+b9VJmC/nCDvbymF2OJYclf8xj4QtZdn3XBiE11Uy8u6OpTsiIlKxqEO7OPH3uEAv1z9XsdtBF788Vks3LBAAIGRGyqiGbU9Zdmg1D0jl54NKNyROA6gUqEjlR/tSs1/Q0ALCPm2C0Ku1VGsqPw6fbDC9SI/0NsSNdkFIWmmYAAAAASUVORK5CYII=",
      },
      'blue-ui-false' : {
        '20' : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAABmJLR0QA/wD/AP+gvaeTAAADX0lEQVRIia3WTWzTZhgH8L9jJ67tYNKQpGUdY7LoukyCAxpbE5VqVUdFEWl7AsaNjwO7gYQGqBqypnWHfZzX26RJy2HbZUwRiwhbF0FV0U7aDhudVqBFK5A1Tdqmjh37tc2FIiVxUnfiuVj28/79e19/yRRc1pHPb+82DSpK2UabTXlzJmX9lbnc89BNlmrWlGXbc8d7832aaOdYbSnkq+SCjKn5CN2iV9i2ZYOL5E0PO36A9I/LMmVtGekfm2rjrJVUoPh7lFce8LBthzQFRZCUtdZ9d8ue1qM3R7tzrpHBT7Jh2ijdastlXqOJ0myxAABCC1jaeehv8JGeHy++ma/te+oStk3RpnIt4hIAAMZUEH6S6bLU/A9O/TrkyNjPJ7atzr7BuASeQ2Qd4urdvYMfZ45vitCmdt6/NituSXhW/rXZbYxZudAUeUf+xU+TUjuF6pscCAQwMjICSZIAAJIkYXh4GIFAoGocBRsMWWsf+OwPoSHCtgi7fZUCXzuToaEhTE9PIxaLIZFIIBaLYWZmBolEom41Xn2Ft6zyKw0RG2Q7bWlsbXB+fh6SJCGZTGJ5eRnJZBKSJGFhYaEOoU2txWPbrQ0RWCiYDKfVBrPZLHieR29vLyYnJxGPxyGKIrLZbB1CaE5lLLrqMa5CdL0yp7ORUl0SQDqdRmdnJwAgGo0ilUo5DYPOhkvCnoV7DZEJuY8QRrhv0XVXDABgGEbVtrYsugWmT5j77tgxsyECAIZPHF0J7v/P8Syb1Epwf86mhdHa43VI+lL8jsZ1pDWuo7IVQOU6NJV76afUlYO/bYoAwDrxni6Eum+XuZdVVwC/Sy2Eum8pxHvWqe+ITMh9hOtaHSiG3v46Hz74mNCC0zAQRkA+0vuoEHzrK75r9fCE3EecxjGNZvfs5p079OnUFxU29BFf/rcfQHijXwweWCoLuzKEEa+mr8Tnmiy0MbJRNz7o/gfAe8NXv61683TfdjX14eGTm+VdIRvF7ni1/fqiQLR9p4zri6KX3eFtd5t1jewM+pfODLzeUVzXGWLZ+ObXB4svHPEylAkArX5f1f4LRRSNUABQXNdBLBuKajb9CflfSEkl42Pf/3kBsEKAJ6/q5Eu3WdezAYBBeUq0OftdH8wb1y71OH5IneopkiFJ+1xUk6sAAAAASUVORK5CYII=",
      }
    },
    'doors': {
      'default' : {
        '20' : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAAcElEQVQ4je2UMQ5AQBRE34qGUqOh03ABtxDXcwsHUXMGF6DVbphkv0QlO+XLzKt+vuOZDsgEVzmB1QdOlHZgNgpHoAyVFqNMdpMXY1Oi8EfCHii+FA5AYy3Hw47CQFLBamAy7qs7UB+7BXKj8AA2H1xQxQrhNTZ0HQAAAABJRU5ErkJggg==",
      },
      'white' : {
        '30': "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAAAfElEQVRIie2V0QmAMAxEL+IY4iLiAOL+E9Q9zi9RSiO1FYtw7zvk5ShcAdESkivJjfUEkkvKYY44ABheyhHMbMyaPM6tNd7t6WqXl9LnDD1Nb2bJJ7zSLLHEEkvsMQGYW4g7OL3v4X0SBM4GKm2ueE98aRMkllji/4vFZ+z6N3OnwoRkyAAAAABJRU5ErkJggg==",
      },
      'blue-ui-false' : {
        '20' : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAAcElEQVQ4je2UMQ5AQBRE34qGUqOh03ABtxDXcwsHUXMGF6DVbphkv0QlO+XLzKt+vuOZDsgEVzmB1QdOlHZgNgpHoAyVFqNMdpMXY1Oi8EfCHii+FA5AYy3Hw47CQFLBamAy7qs7UB+7BXKj8AA2H1xQxQrhNTZ0HQAAAABJRU5ErkJggg==",
      },
      'blue-ui-true' : {
        '20' : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAABJklEQVQ4jWNkwAMaGv4z3Re/EMnFyerw89e/dfPS9LbjU8/AwMDAiMyJm3H+ibYM/59///8zfvz6m5eFmYnbQkOE1VtHkLF46fWv4gIcb9ANuPrkI8uiDEMZGJ8FWVJbhv8PPw+b/JtPPxn8zWUZJAQ54XLMzEzcrKws3MjqNWX4GBgYGB4ii6EYyMDAwHD3+ReGLE81DK+wsHMxcAlLM8gJIDx1/e4TDHVMGCIUglED6WDgs3ffqGsgqYCggVJCXNQ1kFQwauAgNBCl+Lr65CMLOwvL74sP3rOqSvEycLEhpH/+/v3/w4eP/x8+/PAPJvbx8/cfX378QjEDpcRmYGBg8Jy0jZ3pj7CZBB9nAD8XqzYfJ6u0l76o1NRd91ctzDDIJORCAKjCT1dYInoHAAAAAElFTkSuQmCC",
      }
    },
    'window': {
      'default' : {
        '20' : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAApElEQVQ4je2ToQ6DMBRFzwifMI+uHh+Bnp5mll9BMgkevY+YHnp/MkOT7vIIpExsCde0OaWnL+0DvpxDMK+AS6SnA2qANIAOuEYKSz9JjcU70Atz4zgIPwNFCCzhi2mlvoKb8JNuTgzhpvy+0LpDBzyEHcexNL5dFA5ALmzuUfTgP7jDXbg9VttkQCPM95v+u9kaYWGwuWhffgifRmVr00buW84b5UcROtNP6xwAAAAASUVORK5CYII=",
      },
      'white' : {
        '30': "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAAAgklEQVRIie2WQQrAIAwEs6XfsO/xJT5cH7K91FPVBhWUkrkaMy5EUcRYCUlPMnGcSNKXHKiIo4i4STkSgEtVmY87amz1OUab93JqikqnBoCvtRbLEpv4/2LVVLemVDPBJfZObPfYxCbeWmwvVyaJiJvx73p6vaglDrUNHdIwoY/Rzw1f3Huw0u4jqAAAAABJRU5ErkJggg==",
      },
      'blue-ui-false' : {
        '20' : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAApElEQVQ4je2ToQ6DMBRFzwifMI+uHh+Bnp5mll9BMgkevY+YHnp/MkOT7vIIpExsCde0OaWnL+0DvpxDMK+AS6SnA2qANIAOuEYKSz9JjcU70Atz4zgIPwNFCCzhi2mlvoKb8JNuTgzhpvy+0LpDBzyEHcexNL5dFA5ALmzuUfTgP7jDXbg9VttkQCPM95v+u9kaYWGwuWhffgifRmVr00buW84b5UcROtNP6xwAAAAASUVORK5CYII=",
      },
      'blue-ui-true' : {
        '20' : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAABfElEQVQ4jWM8cOCAJSsr6ytra+u7DBSAo0ePKv/+/VuMcc2aNQtOnjzpq66ufktERGQjGxtb7pUrV34TY4iOjg4rAwND/8uXL32uX7+uaWZmtp2FgYGBYd++fUKXb963YPrzzdzO0eU/n7A00/lHn/EaZijHy3Dp6o1/h/bv6frHwsX4+ul9BjMzMwYWmIK8vlUMT+5cZdy9fCqjuTEXg7FvKl4DvxybzXD2yi2mgLxOBhkVbYbacFMGBgYGBiZkRTIq2gzyGgbE+JaBgYGBQV7DgEFGRRtFjAmHWrLB4DcQHimwQGVgYGCIjMcfITCwf81shv1rZmM3sHnlaQYGBgaGfatnEe0ax5BUBqfQNBQHDf4wHDWQygY+uXOV4eGNC0RrfnjjAsOTO1dRxODpcFJRGAPTn2//7Rxd/nNx8zKd3TwbwwBkYCjHy2Cso/Zvw6Ryxn8sXIwoBjo5Ob1DL2BVufG77svbTwx6Ojqsetoa8AKWgYGBgZHaVQAAFJiHF0SSz3AAAAAASUVORK5CYII=",
      }
    },
    'wind': {
      'white' : {
        '30': "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAABXElEQVRIie2WT0rDQBSH3wgNxj9XsC4FcafQAyS38CytXsJ4DsWdC6W48QTSRrB14za6qWD5XPQFwjBpMwmpCP1tBh7vzTczv0zeiGz01wJ2gEvgFfgGUuACCNsGP+LWU6tw4AUYARGwq+ObwgeO/C6QABM9oXfgGjj0BXeAjhWLFDy24jHwVXJCn0BcZ/NFwL5ONrPizxq/A46BEDgFbjSeAd0m4FgnGlnxHnAOGEdNDk/qAAOF5h73PWrPtGayLGlY4lNRQ2DbA+y0Z6ti/VxEUhEZiEhsjJmtyC/qSMcPj5rmAm51x1frgAXqbQ7NgINlBVU89lUGRDarqse+movIVEQSETkxxty3xPmvaujxD3VbZ0NwUe22TmvRAStaZ9sLcLbOdYCd/2Zbje4xjseCiPR0nDaZexU4fx7FwB41W2cd8EPJV+3VOuuAQxb3NmXxwBsD/VahG/nqF2yQ3hkNq7oAAAAAAElFTkSuQmCC",
      },
      'blue-ui' : {
        '20' : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAACaElEQVQ4ja2SXUhTYRzGn/c9Z+c43WAtMZCO4YZo0kXB1mx2EahXpWVUFHSTXQTRRVdZZiQUkppBeWE3BV51ZwXhtIKuIr+gQV/m5j4szXJO7aw5dzzn7Wql+3BK/e7e//95fvDyvgQZ6HQFjy8sxU9wIHqDqHtn1HSd52oLQ5nyCUjy4O7zLyXhyFL/Tslk2SWZwPMU38JRjHrnZEXVuptqrY0bFva8/LrVJ0fHTu0vzhd1XEp40BPS/DOR1qZay7VMQrr64I/EeursUloZAFSU5FOBpxdbRqdzNyTU67i9ZoOYKQsAsFnNBnl8caTliffRvb7AnmxC87o2AEUFBjRUW8uPOqSTKkfetPcFGlKEna5g1fVe74cd2ww0veYvBECuwMOo1+GIQxKXlZUba/Yd/cFqjrGnhyukXEpSHj0rn6dk5vbPzajAw6uHLM2kpdfz6fQBSxlHNy9bzchEmE1My7eoKU8o+lcZANitZsLAzvCEIv0fSeJ9cAGeGRkAUFpoRLlkSsnkibyZzkeUoKqyrELfjwjqHRLqHRLGp+W0meiyGqJb8nLOPx6ejKna+tI6+/Z194Pjs6CE3ScA0OoK7FNiyoPKsgJJEKjh4+RixmI0rqK00Ai9wMMdmAdhUGOK+p1QdF8+aLmZ7aabZs3z1rQN2Si0YxstMw16AtY1cMXpTcz4P7L217upqlUBmE/bpuzVQKNzOJFVovExPsco8lDOAriTInxxqdINwJ3sqWkbspmKg29/+qR2AMMAIMbJLM0RbwPxFUJZ1+o8nyxIhqgaJ/ukDgb8SsyeNTunAFzI1v0v/AaaF9blbitxWQAAAABJRU5ErkJggg==",
      }
    },
    'rain': {
      'white' : {
        '30': "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAABH0lEQVRIie3WT07CQBTH8d8zLZFjYLyEyrkMG/9cQHceAT0GLkTDEYyUBXIIiYSvmzahZaamdMYY5bdq0pf3mXl5i5H2+e0BToEhMAM+gAXwAPRjgQlwC6zx5w5IQsM3NWAJb4OkwADI8nG+fnPTas52QRNg1ABx5X4X+LIlCrDw9bcaOJN01PjE5XyaWcf146CCJflNpwFQSUqBKXCBb8uBDvAYYLy+jIDUBQ8iokXOC8824JmkXoDx1iUzs+MqvJTkXISAWZrZoVRervfIqCTNi49NePgD8LYBdIHniIs1BrrO4+T4NfAGrAJgq7zXlRf93wEmwEus+rpGAMSqlyTf8+RJ0lYjYCJpbWYnLeubJeQkmj7InDcLWL/PH8oXsnQwNPfis4gAAAAASUVORK5CYII=",
      },
      'blue-ui' : {
        '20' : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAB0klEQVQ4jWNkwAEC+k8ZiPCwhzIwMPJ++P775M93/9dvbjD5hks9DDCiCzi3nRTWkOJZbqkpYqovJyDAysLE8Ozd9/8Hrr669vzd977ZKbrziDbQt+EMl7Iy18F0d1UTDjZmDMVHrr96feDqi+K5KQaLcRnIhMyRlGVtinVUNMZmGAMDA4ONppiotBBPufHMM6xEGSjGz2EnxMOOEQzIwFFbTE3rH/Pq1DmXGv06z0mhy6Nobtt8906kraIyPgP/MzAwfP/5h+HP3/8MW849eXjj0cf4xVlGB1FcGDz5jEbuomtbNKT5hfAZBnMBFzsLAx8XK0OUjaK8pCBXG4p86ITT6noKglsj7RSVmZnw+hYruPbkw6cj195cffnx+4x5qfqLWKSEufrJNYyBgYFBS0aAT0tGwPLEzdfqf2dcZGAS5eeQI9cwZGChLiokKciZyfTr7z8Oik2DAj4uZiGmtx9/3fv95x9VDPz07e9bpmfvP+UvOXiPYkOP3Hj9/sW775MYGRgYGHw7zsgpSHPOFORhU+HjwJkJsIK///7/f//155sXb39OWpCpv4IiVxEFPNqPK6CzCYkhAyZsgjANOyotHxASo6nrcLqQ6q4jVQwZAADlNbqhJTz9lgAAAABJRU5ErkJggg==",
      }
    }
  };

  constructor() {}

  getIcon(name:string, color:string, size:string):string{
    try{
      return this.icons[name][color][size];
    }
    catch{
      return this.icons['default']['white']['20'];
    }
    
  }
}