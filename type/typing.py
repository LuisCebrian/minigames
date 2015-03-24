import pygame 
import random
import time
import os

pygame.init()
pygame.key.set_repeat(100,50)
pygame.mouse.set_visible(0)
SCREEN_SIZE = (pygame.display.Info().current_w,pygame.display.Info().current_h) 
WINDOWS_HEIGHT = SCREEN_SIZE[1]
WINDOWS_WIDTH = SCREEN_SIZE[0]
FONT_SIZE = int((WINDOWS_WIDTH+WINDOWS_HEIGHT)*0.04)

BLACK = (20,20,20)
GREY = (15,15,15)
WHITE = (255,255,255)
BLUE = (120,120,255)
RED = (200,0,0)
GREEN =(25,139,34)
YELLOW =(235,180,0)

COUNT = 0
SPEED = 1

fire_icon = pygame.image.load(os.path.join('images','fire.png'))
fire_icon = pygame.transform.scale(fire_icon,(350,350))
fire_icon_rect = fire_icon.get_rect()
fire_icon_rect.center = (WINDOWS_WIDTH/2,WINDOWS_HEIGHT/2-100)

ice_icon = pygame.image.load(os.path.join('images','ice.png'))
ice_icon = pygame.transform.scale(ice_icon,(350,350))
ice_icon_rect = ice_icon.get_rect()
ice_icon_rect.center = (WINDOWS_WIDTH/2,WINDOWS_HEIGHT/2-100)
def strip(x):
    l=[]
    for i in x:
        i = i.rstrip()
        l.append(i)
    return l

def sorting(x):
    return len(x)

def displayTextBottom(text):
    font = pygame.font.SysFont('ubuntumono',FONT_SIZE)
    surfaceText = font.render(text,True,WHITE)
    surfaceRect = surfaceText.get_rect()
    surfaceRect.center = (WINDOWS_WIDTH/2,WINDOWS_HEIGHT-surfaceRect.height/2)
    screen.blit(surfaceText,surfaceRect)     
    
def displayText(text,pos=(WINDOWS_WIDTH/2,WINDOWS_HEIGHT/2),color=WHITE,fontsize=FONT_SIZE,font_type='arial'):
    fontsize = int(fontsize)
    font = pygame.font.SysFont(font_type,fontsize)
    surfaceText = font.render(text,True,color)
    surfaceRect = surfaceText.get_rect()
    surfaceRect.top = pos[1]
    surfaceRect.left = pos[0]
    screen.blit(surfaceText,surfaceRect)     

def displayAllText(alltext):
    for i in alltext:
        displayText(i,(alltext[i][0],alltext[i][1]),alltext[i][2],FONT_SIZE/2)
def displayCenterText(text,pos,color,fontsize=FONT_SIZE,font_type='arial'):
    fontsize = int(fontsize)
    font = pygame.font.SysFont(font_type,fontsize)
    surfaceText = font.render(text,True,color)
    surfaceRect = surfaceText.get_rect()
    surfaceRect.center = pos
    screen.blit(surfaceText,surfaceRect)
def test(string,lista):
    success=False
    for i in lista:
        if i.startswith(string):
            color_matches(string,lista[i])
            success = True
    return success 
def color_matches(string,pos):
   displayText(string,(pos[0],pos[1]),YELLOW,FONT_SIZE/2)

def move_text(text,speed):
    d =[] 
    for i in text:
        text[i]=(text[i][0],text[i][1]+speed,text[i][2])
        if text[i][1] > WINDOWS_HEIGHT:
            d.append(i)
    for i in d:
        del text[i]

def newWord(dic):
    word = random.choice(stopwords)
    color_choice = random.randint(1,100)
    if color_choice > 3:
        if color_choice > 6:
            color_choice=WHITE
        else:
            color_choice=RED
    else:
        color_choice=BLUE
    dic[word] = (random.randint(0,WINDOWS_WIDTH-int(FONT_SIZE*3.4)),0,color_choice)

def fire_func(dic,count):
    red = (0,0,0)
    for i in range(1,255):
        red = (i,0,0) 
        screen.fill(red)
        screen.blit(fire_icon,fire_icon_rect)
        displayCenterText('FIRE!',(WINDOWS_WIDTH/2,WINDOWS_HEIGHT/2+fire_icon_rect.height/2),YELLOW,FONT_SIZE*1.5,'ubuntumono')
        pygame.display.update()

    for i in dic:
        count += len(i)
    return count
def ice_func():
    blue = (0,0,0)
    for i in range(1,255):
        blue = (0,0,i)
        screen.fill(blue)
        screen.blit(ice_icon,ice_icon_rect)
        displayCenterText('ICE!',(WINDOWS_WIDTH/2,WINDOWS_HEIGHT/2+fire_icon_rect.height/2),BLUE,FONT_SIZE*1.5,'ubuntumono')
        pygame.display.update()
def displayStatusBar(dic,string,count,speed):
    pygame.draw.rect(screen,(10,10,10),pygame.Rect(0,WINDOWS_HEIGHT-FONT_SIZE*1.1-5,WINDOWS_WIDTH,5))
    if test(string,dic):
        pygame.draw.rect(screen,GREEN,pygame.Rect(0,WINDOWS_HEIGHT-FONT_SIZE*1.1,WINDOWS_WIDTH,FONT_SIZE*1.1))
    else:
        pygame.draw.rect(screen,RED,pygame.Rect(0,WINDOWS_HEIGHT-FONT_SIZE*1.1,WINDOWS_WIDTH,FONT_SIZE*1.1))
    
    pygame.draw.rect(screen,(10,10,10),pygame.Rect(0,WINDOWS_HEIGHT-FONT_SIZE*1.1,5,FONT_SIZE*1.1))
    pygame.draw.rect(screen,(10,10,10),pygame.Rect(WINDOWS_WIDTH-5,WINDOWS_HEIGHT-FONT_SIZE*1.1,5,FONT_SIZE*1.1))
    displayText('SCORE: ' + str(count),(WINDOWS_WIDTH*0.8,WINDOWS_HEIGHT-FONT_SIZE*0.8),GREY,FONT_SIZE/2,'ubuntumono')
    displayText('SPEED: x' + str(round(speed,1)),(WINDOWS_WIDTH*0.01,WINDOWS_HEIGHT-FONT_SIZE*0.8),GREY,FONT_SIZE/2,'ubuntumono')
    displayTextBottom(string) 
    pygame.draw.rect(screen,(10,10,10),pygame.Rect(0,WINDOWS_HEIGHT-5,WINDOWS_WIDTH,5))
def game_loop():
    string = ''
    prueba = {'prueba':(WINDOWS_WIDTH/2,15,WHITE)}
    time_spam = 1200
    pygame.time.set_timer(26,10000)
    pygame.time.set_timer(25,time_spam)
    COUNT = 0 
    SPEED = 1
    FIRE = 0
    ICE = 0
    init_clock = 0
    while True:

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                exit()
            if event.type == 25 and ICE == 0:
                newWord(prueba)
            if event.type == 26:
                time_spam = int(time_spam*0.98)
                pygame.time.set_timer(25,time_spam)
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    exit()
                if event.key == pygame.K_SPACE:
                    if string in prueba:
                        prueba.pop(string)
                        COUNT += len(string)
                        SPEED *= 1.01
                    elif string == 'fire':
                        FIRE = 1
                    elif string == 'ice':
                        ice_func()
                        ICE = 1
                        init_clock = time.time()
                    string = ''
                    break
                if event.key == pygame.K_BACKSPACE:
                    string = string[:-1]
                    break
                string += chr(event.key)
        if prueba == {} and ICE == 0:
            newWord(prueba)

        screen.fill(BLACK)
        displayAllText(prueba)
        
        if FIRE:
            COUNT = fire_func(prueba,COUNT)
            prueba = {}
            FIRE = 0
        elif ICE:
            frame_clock = time.time()
            COUNT_SEC = int(frame_clock-init_clock)
            displayCenterText(str(5-COUNT_SEC),(WINDOWS_WIDTH/2,WINDOWS_HEIGHT*0.8),BLUE,FONT_SIZE)
            if COUNT_SEC < 5:
                move_text(prueba,0)
            else:
                ICE = 0
        else:
            move_text(prueba,SPEED)
        
        displayStatusBar(prueba,string,COUNT,SPEED)
        clock.tick(30)        
        pygame.display.update()


stopwords = open('stopwords.txt','rU')
stopwords = stopwords.readlines()
stopwords = strip(stopwords)
stopwords.sort(key = sorting)

screen = pygame.display.set_mode(SCREEN_SIZE,pygame.FULLSCREEN,32)
clock = pygame.time.Clock()
game_loop()
