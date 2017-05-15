var namespace = "http://www.w3.org/2000/svg"

initializeLib("canvas")
var canvas = document.getElementById("canvas");

//Capture keyboard events
window.onkeydown = window.onkeyup = function(e){
  keys[e.keyCode] = e.type == 'keydown';
  if (keys[17]){
    console.log("Control key detecting. Not stopping")
  } else {
    return false;
  }
}

// All of your code for the game goes here! This is where you need to create your character, write your animation loop function, implement keyboard control, etc.

var time = 0
var canvasSize = [300,200]
var minx = 0
var miny = 0
var maxx = 300
var maxy = 200
var playerSize = 50
var deathSize = 50
var tsize = 12
var canMove = [true, true, true, true]
var playerX = (canvasSize[0]/2)-(playerSize/2)
var playerY = (canvasSize[1]/2)-(playerSize/2)
var playerZ = 0
var playerZH = 1
var zChange = 0
var zCC = 0
var score=0

var death = [makeBdRect(6, 60, deathSize, deathSize, "#D22"),makeBdRect(220, 40, deathSize, deathSize, "#D22"),makeBdRect(190, 140, deathSize, deathSize, "#D22")]

var collision = [makeBdRect(-50, -60, deathSize, deathSize, "#AAA"),makeBdRect(-140, -40, deathSize, deathSize, "#AAA"),makeBdRect(-130, -100, deathSize, deathSize, "#AAA"),makeBdRect(0, -162, deathSize*5, deathSize, "#AAA")]//,makeBdRect(320, -300, 300, 26, "#ff69b4"),makeBdRect(320, -275, 300, 26, "#f00"),makeBdRect(320, -250, 300, 26, "#ff8e00"),makeBdRect(320, -225, 300, 26, "#ff0"),makeBdRect(320, -200, 300, 26, "#008e00"),makeBdRect(320, -175, 300, 26, "#00c0c0"),makeBdRect(320, -150, 300, 26, "#400098"),makeBdRect(320, -125, 300, 25, "#8e008e")]

var musicCollisions = [2]
var rainbowCollisions = []
var MCN =3
var RCN=4

for (var i = 0; i<300;i=i+25){
  musicCollisions.push(MCN+1)
  rainbowCollisions.push(RCN)
  RCN=RCN+1
  MCN=MCN+1
  if (i<275){
    collision.push(makeBdRect(320+i, -300, 26, 25, "#ff69b4"))
  } else {
    collision.push(makeBdRect(320+i, -300, 25, 25, "#ff69b4"))
  }
}

for (var i = 0; i<300;i=i+25){
  musicCollisions.push(MCN+1)
  rainbowCollisions.push(RCN)
  RCN=RCN+1
  MCN=MCN+1
  if (i<275){
    collision.push(makeBdRect(320+i, -275, 26, 26, "#f00"))
  } else {
    collision.push(makeBdRect(320+i, -275, 25, 26, "#f00"))
  }
}

for (var i = 0; i<300;i=i+25){
  musicCollisions.push(MCN+1)
  rainbowCollisions.push(RCN)
  RCN=RCN+1
  MCN=MCN+1
  if (i<275){
    collision.push(makeBdRect(320+i, -250, 26, 26, "#ff8e00"))
  } else {
    collision.push(makeBdRect(320+i, -250, 25, 26, "#ff8e00"))
  }
}

for (var i = 0; i<300;i=i+25){
  musicCollisions.push(MCN+1)
  rainbowCollisions.push(RCN)
  RCN=RCN+1
  MCN=MCN+1
  if (i<275){
    collision.push(makeBdRect(320+i, -225, 26, 26, "#ff0"))
  } else {
    collision.push(makeBdRect(320+i, -225, 25, 26, "#ff0"))
  }
}

for (var i = 0; i<300;i=i+25){
  musicCollisions.push(MCN+1)
  rainbowCollisions.push(RCN)
  RCN=RCN+1
  MCN=MCN+1
  if (i<275){
    collision.push(makeBdRect(320+i, -200, 26, 26, "#008e00"))
  } else {
    collision.push(makeBdRect(320+i, -200, 25, 26, "#008e00"))
  }
}

for (var i = 0; i<300;i=i+25){
  musicCollisions.push(MCN+1)
  rainbowCollisions.push(RCN)
  RCN=RCN+1
  MCN=MCN+1
  if (i<275){
    collision.push(makeBdRect(320+i, -175, 26, 26, "#00c0c0"))
  } else {
    collision.push(makeBdRect(320+i, -175, 25, 26, "#00c0c0"))
  }
}

for (var i = 0; i<300;i=i+25){
  musicCollisions.push(MCN+1)
  rainbowCollisions.push(RCN)
  RCN=RCN+1
  MCN=MCN+1
  if (i<275){
    collision.push(makeBdRect(320+i, -150, 26, 26, "#400098"))
  } else {
    collision.push(makeBdRect(320+i, -150, 25, 26, "#400098"))
  }
}

for (var i = 0; i<300;i=i+25){
  musicCollisions.push(MCN+1)
  rainbowCollisions.push(RCN)
  RCN=RCN+1
  MCN=MCN+1
  if (i<275){
    collision.push(makeBdRect(320+i, -125, 26, 25, "#8e008e"))
  } else {
    collision.push(makeBdRect(320+i, -125, 25, 25, "#8e008e"))
  }
}

var rainbowIsBlank=true

var player = makeBdRect((canvasSize[0]/2)-(playerSize/2), (canvasSize[1]/2)-(playerSize/2), playerSize, playerSize, "#999")

var musicCollisionAts = []
var backgroundMusic = new Audio('https://happysmash27.github.io/Music/Funk%20Game%20Loop.mp3')
var monody = new Audio('https://happysmash27.github.io/Music/01%20Monody%20%28feat.%20Laura%20Brehm%29.mp3')
backgroundMusic.play()
var playAudio=true

if (typeof backgroundMusic.loop == 'boolean'){
    backgroundMusic.loop = true;
} else {
  backgroundMusic.addEventListener('ended', function() {
    if (living){
      this.currentTime = 0;
      this.play();
    }
  }, false);
}

if (typeof monody.loop == 'boolean'){
    monody.loop = true;
} else {
  monody.addEventListener('ended', function() {
    if (living){
      this.currentTime = 0;
      this.play();
    }
  }, false);
}

var textBox = makeBdRect(0,0,47,34,"#666")
var scoreTxt = makeText("Score: ", 1, 8, 8, "Noto Sans", "#FFF")
var xTxt = makeText("X: ", 1, 16, 8, "Noto Sans", "#FFF")
var yTxt = makeText("Y: ", 1, 24, 8, "Noto Sans", "#FFF")
var zTxt = makeText("Z: ", 1, 32, 8, "Noto Sans", "#FFF")

var living = true
var keys = []

function animate(){
  
  var maxZ = 0
  for (var i=0; i < collision.length; i = i+1){
    var collisionX = getX(collision[i])
    var collisionY = getX(collision[i])
    var collisionZ = 0
    collisionWidth = getWidth(collision[i])
    collisionHeight = getHeight(collision[i])
    var collisionZH = 1
    if (playerY+playerSize>=getY(collision[i])&&
             playerY<=getY(collision[i])+collisionHeight&&
             playerX+playerSize>=getX(collision[i])&&
             playerX<=getX(collision[i])+collisionWidth){
              var maxZ = collisionZH
        }
  }
  
  if (playerZ>maxZ){
    zChange = zChange-0.5
  }
  
  playerZ = playerZ+zChange
  
  //if (playerZ>maxZ){
    //zChange = zChange-0.5
  //} else {
    //zChange = 0
  //}
  
  if (playerZ < maxZ){
    playerZ = maxZ
    zChange = 0
  }
  
  canvas.setAttribute("viewBox", minx+" "+miny+" "+canvasSize[0]+" "+canvasSize[1])
  setX(textBox,minx)
  setX(scoreTxt,minx+1)
  setX(xTxt,minx+1)
  setX(yTxt,minx+1)
  setX(zTxt,minx+1)
  setY(textBox,miny)
  setY(scoreTxt,miny+8)
  setY(xTxt,miny+16)
  setY(yTxt,miny+24)
  setY(zTxt,miny+32)
  scoreTxt.innerHTML = "Score: "+score
  xTxt.innerHTML = "X: "+playerX
  yTxt.innerHTML = "Y: "+playerY
  zTxt.innerHTML = "Z: "+playerZ
  if (living){
    var theoreticalPlayerX=playerX
    var theoreticalPlayerY=playerY
    var theoreticalPlayerZ=playerZ
    var theoreticalMinX=minx
    var theoreticalMaxX=maxx
    var theoreticalMinY=miny
    var theoreticalMaxY=maxy
    if (keys[32]&&playerZ==maxZ){
      zChange = 5
    }
    var willCollide=false
    if ((keys[87]||keys[38])&&(playerY>=miny)){
      canMove[3]=true
      for (var i=0; i < collision.length; i = i+1){
        var collisionX = getX(collision[i])
        var collisionY = getX(collision[i])
        var collisionZ = 0
        collisionWidth = getWidth(collision[i])
        collisionHeight = getHeight(collision[i])
        var collisionZH = 1
        if(playerY+playerSize>=getY(collision[i])&&
           playerY<=getY(collision[i])+collisionHeight+1&&
           playerX+playerSize>=getX(collision[i])&&
           playerX<=getX(collision[i])+collisionWidth&&
           playerZ<collisionZ+collisionZH&&
           playerZ+collisionZH>collisionZ&&
           playerY>=getY(collision[i])+collisionHeight){
            canMove[3]=false
        }
      }
      if (canMove[3]){
        theoreticalPlayerY  = theoreticalPlayerY-1
        theoreticalMinY=theoreticalMinY-1
        theoreticalMaxY=theoreticalMaxY-1
      }
    }
    if ((keys[83]||keys[40])&&(playerY+playerSize<=maxy)){
      canMove[2]=true
      for (var i=0; i < collision.length; i = i+1){
        var collisionX = getX(collision[i])
        var collisionY = getX(collision[i])
        var collisionZ = 0
        collisionWidth = getWidth(collision[i])
        collisionHeight = getHeight(collision[i])
        var collisionZH = 1
        if(playerY+playerSize>=getY(collision[i])-1&&
           playerY<=getY(collision[i])+collisionHeight+1&&
           playerX+playerSize>=getX(collision[i])&&
           playerX<=getX(collision[i])+collisionWidth-1&&
           playerZ<collisionZ+collisionZH&&
           playerZ+collisionZH>collisionZ&&
           playerY+playerSize<=getY(collision[i])){
            canMove[2]=false
        }
      }
      if (canMove[2]){
        theoreticalPlayerY = theoreticalPlayerY+1
        theoreticalMinY=theoreticalMinY+1
        theoreticalMaxY=theoreticalMaxY+1
      }
    }
    if ((keys[65]||keys[37])&&(playerX>=minx)){
      canMove[1]=true
      for (var i=0; i < collision.length; i = i+1){
        var collisionX = getX(collision[i])
        var collisionY = getX(collision[i])
        var collisionZ = 0
        collisionWidth = getWidth(collision[i])
        collisionHeight = getHeight(collision[i])
        var collisionZH = 1
        if(playerY+playerSize>=getY(collision[i])&&
           playerY<=getY(collision[i])+collisionHeight&&
           playerX+playerSize>=getX(collision[i])-1&&
           playerX<=getX(collision[i])+collisionWidth+1&&
           playerZ<collisionZ+collisionZH&&
           playerZ+collisionZH>collisionZ&&
           playerX>=getX(collision[i])+collisionWidth){
            canMove[1]=false
        }
      }
      if (canMove[1]){
        theoreticalPlayerX = theoreticalPlayerX-1
        theoreticalMinX=theoreticalMinX-1
        theoreticalMaxX=theoreticalMaxX-1
      }
    }
    if ((keys[68]||keys[39])&&(playerX+playerSize<=maxx)){
      canMove[0]=true
      for (var i=0; i < collision.length; i = i+1){
        var collisionX = getX(collision[i])
        var collisionY = getX(collision[i])
        var collisionZ = 0
        collisionWidth = getWidth(collision[i])
        collisionHeight = getHeight(collision[i])
        var collisionZH = 1
        if(playerY+playerSize>=getY(collision[i])+1&&
           playerY<=getY(collision[i])+collisionHeight&&
           playerX+playerSize>=getX(collision[i])-1&&
           playerX<=getX(collision[i])+collisionWidth+1&&
           playerZ<collisionZ+collisionZH&&
           playerZ+collisionZH>collisionZ&&
           playerX+playerSize<=getX(collision[i])){
            canMove[0]=false
        }
      }
      if (canMove[0]){
        theoreticalPlayerX = theoreticalPlayerX+1
        theoreticalMinX=theoreticalMinX+1
        theoreticalMaxX=theoreticalMaxX+1
      }
    }
    for (var i=0; i < collision.length; i = i+1){
        var collisionX = getX(collision[i])
        var collisionY = getX(collision[i])
        var collisionZ = 0
        collisionWidth = getWidth(collision[i])
        collisionHeight = getHeight(collision[i])
        var collisionZH = 1
        if(theoreticalPlayerY+playerSize>=getY(collision[i])&&
           theoreticalPlayerY<=getY(collision[i])+collisionHeight&&
           theoreticalPlayerX+playerSize>=getX(collision[i])&&
           theoreticalPlayerX<=getX(collision[i])+collisionWidth&&
           theoreticalPlayerZ<collisionZ+collisionZH&&
           theoreticalPlayerZ+collisionZH>collisionZ){
            willCollide=true
        }
    }
    if (!willCollide){
      playerX=theoreticalPlayerX
      playerY=theoreticalPlayerY
      playerZ=theoreticalPlayerZ
      minx=theoreticalMinX
      miny=theoreticalMinY
      maxx=theoreticalMaxX
      maxy=theoreticalMaxY
    }
  }
  
  setX(player,(playerX-(playerZ/4)))
  setY(player,(playerY-(playerZ/4)))
  setWidth(player, playerSize+(playerZ/2))
  setHeight(player,playerSize+(playerZ/2))
  
  for (var i=0; i < death.length; i = i+1){
    var deathX = getX(death[i])
    var deathY = getY(death[i])
    var deathZ = 0
    var deathZH = 1
    if (playerX<=deathX+deathSize&&
        playerX+playerSize>=deathX&&
        playerY<=deathY+deathSize&&
        playerY+playerSize>=deathY&&
        playerZ<deathZ+deathZH&&
        playerZ+playerZH>deathZ){
          if (living){
            console.log("The player is DEAD! DEAD I SAY!!!")
            makeRect(minx-1, miny-1, canvasSize[0]+1, canvasSize[1]+1, "#F00", 0.75)
            makeText("Game Over", ((minx+maxx)/2)-33, ((miny+maxy)/2)-(tsize/2), tsize, "Noto Sans", "#FFF")
            makeText("Score: "+score, ((minx+maxx)/2)-33, ((miny+maxy)/2)-(tsize/2)+tsize, tsize, "Noto Sans", "#FFF")
            //alert("Game Over!")
            backgroundMusic.pause()
            backgroundMusic.currentTime = 0
          }
          living = false;
    }
  }
  for (var i=0; i < death.length; i = i+1){
    var deathX = getX(death[i])
    var deathY = getY(death[i])
    var deathZ = 0
    var deathZH = 1
    if (playerX<=deathX+deathSize&&
        playerX+playerSize>=deathX&&
        playerY<=deathY+deathSize&&
        playerY+playerSize>=deathY){
          if (living){
            score = score+1
          }
    }
  }

  
  if (backgroundMusic.duration<=backgroundMusic.currentTime){
    backgroundMusic.currentTime = 0
  }
  if (monody.duration<=monody.currentTime){
    monody.currentTime = 0
  }
  
  var musicCollisionWith2=false
  var aMusicCollision=false
  var aRainbowCollision=false
  for (var j=0; j < musicCollisions.length; j = j+1){
    var i = musicCollisions[j]
    var collisionX = getX(collision[i])
    var collisionY = getX(collision[i])
    var collisionZ = 0
    collisionWidth = getWidth(collision[i])
    collisionHeight = getHeight(collision[i])
    var collisionZH = 1
    if (playerY+playerSize>=getY(collision[i])+1&&
        playerY<=getY(collision[i])+collisionHeight&&
        playerX+playerSize>=getX(collision[i])&&
        playerX<=getX(collision[i])+collisionWidth){
          aMusicCollision=true
          if (i>=rainbowCollisions[0]&&i<=rainbowCollisions.length){
            aRainbowCollision=true
          }
          musicCollisionAts[j]=true
          if (i==2){
            musicCollisionWith2 = true
          }
          if (!backgroundMusic.paused){
            backgroundMusic.pause()
            backgroundMusic.currentTime = 0
          }
          if (monody.paused){
            monody.play()
          }
          if (time==0&&i==2){
            collision[i].setAttribute("fill",createColor())
          }
          
      } else {
        musicCollisionAts[j]=false
        
        if (!musicCollisionWith2){
          collision[2].setAttribute("fill","#888")
        }
      }
  }
  
  if (aMusicCollision){
    time = time+1
    if (time>60){
      time = 0
    }
  }
  
  if (aRainbowCollision){
    if (time==0){
      rainbowIsBlank=false
      for (i=0;i<=rainbowCollisions.length;i=i+1){
        if (Math.random()<=0.25){
          if (i<12){
            collision[rainbowCollisions[i]].setAttribute("fill","#ff69b4")
          } else if (i<24){
            collision[rainbowCollisions[i]].setAttribute("fill","#f00")
          } else if (i<36){
            collision[rainbowCollisions[i]].setAttribute("fill","#ff8e00")
          } else if (i<48){
            collision[rainbowCollisions[i]].setAttribute("fill","#ff0")
          } else if (i<60){
            collision[rainbowCollisions[i]].setAttribute("fill","#00be00")
          } else if (i<72){
            collision[rainbowCollisions[i]].setAttribute("fill","#00c0c0")
          } else if (i<84){
            collision[rainbowCollisions[i]].setAttribute("fill","#8000d8")
          } else if (i<96){
            collision[rainbowCollisions[i]].setAttribute("fill","#8e008e")
          }
        } else {
          if (i<12){
            collision[rainbowCollisions[i]].setAttribute("fill","#cf3984")
          } else if (i<24){
            collision[rainbowCollisions[i]].setAttribute("fill","#c00")
          } else if (i<36){
            collision[rainbowCollisions[i]].setAttribute("fill","#cf5e00")
          } else if (i<48){
            collision[rainbowCollisions[i]].setAttribute("fill","#cc0")
          } else if (i<60){
            collision[rainbowCollisions[i]].setAttribute("fill","#005e00")
          } else if (i<72){
            collision[rainbowCollisions[i]].setAttribute("fill","#009090")
          } else if (i<84){
            collision[rainbowCollisions[i]].setAttribute("fill","#100068")
          } else if (i<96){
            collision[rainbowCollisions[i]].setAttribute("fill","#5e005e")
          }
        }
      }
    }
  } else if (!rainbowIsBlank) {
    for (i=0;i<=rainbowCollisions.length;i=i+1){
        if (i<12){
          collision[rainbowCollisions[i]].setAttribute("fill","#ff69b4")
        } else if (i<24){
          collision[rainbowCollisions[i]].setAttribute("fill","#f00")
        } else if (i<36){
          collision[rainbowCollisions[i]].setAttribute("fill","#ff8e00")
        } else if (i<48){
          collision[rainbowCollisions[i]].setAttribute("fill","#ff0")
        } else if (i<60){
          collision[rainbowCollisions[i]].setAttribute("fill","#008e00")
        } else if (i<72){
          collision[rainbowCollisions[i]].setAttribute("fill","#00c0c0")
        } else if (i<84){
          collision[rainbowCollisions[i]].setAttribute("fill","#400098")
        } else if (i<96){
          collision[rainbowCollisions[i]].setAttribute("fill","#8e008e")
        }
    }
    rainbowIsBlank=true
  }
  
  if (!monody.paused&&!aMusicCollision){
    monody.pause()
    monody.currentTime = 0
  }
  if (backgroundMusic.paused&&living&&!aMusicCollision){
    backgroundMusic.play()
  }
  if (!aMusicCollision){
    time = 0
  }
  requestAnimationFrame(animate)
}

requestAnimationFrame(animate)


// /u/happysmash27's SVG library
function initializeLib(id){
  //happysmash27 shape library initialization routine
  console.log("/u/happysmash27 SVG shape library initialized with canvas id "+'"'+id+'"')
  var canvas = document.getElementById(id);
  var defs = document.createElementNS(namespace, "defs");
  defs.setAttribute("id","defs");
  canvas.appendChild(defs);
  var keys = []
}


function makeTextPath(message,d,size,offset,family,color){
  df = df+1
  var pathid = "Path "+df //create one
  
  var path = document.createElementNS(namespace,"path")
  var textPath = document.createElementNS(namespace,"textPath")
  var text = document.createElementNS(namespace,"text")
  var defs = document.getElementById("defs")
  var canvas = document.getElementById("canvas")
  
  defs.appendChild(path)
  path.setAttribute("id",pathid)
  path.setAttribute("d",d)
  
  canvas.appendChild(text)
  text.setAttribute("font-size", size)
  text.setAttribute("font-family",family)
  text.setAttribute("fill",color)
  //text.setAttribute("text-anchor","middle") //text.setAttribute("transform","translate("+x+","+y+")")
  
  text.appendChild(textPath)
  textPath.innerHTML="\n      "+message+"\n    "
  //textPath.setAttribute("text-anchor","middle")
  textPath.setAttributeNS('http://www.w3.org/1999/xlink',"xlink:href","#"+pathid)
  textPath.setAttribute("startOffset", offset)
}

function makeRefPath(message,ref,size,family,color){
  var textPath = document.createElementNS(namespace,"textPath")
  var text = document.createElementNS(namespace,"text")
  
  text.setAttribute("font-size", size)
  text.setAttribute("font-family",family)
  text.setAttribute("fill",color)
  
  textPath.setAttribute("href",ref)
  textPath.innerHTML=message
  
  var canvas = document.getElementById("canvas")
  text.appendChild(textPath)
  canvas.appendChild(text)
}

function makeCirclePath(message,cx,cy,r,size,family,color){
  df = df+1
  var circleid = "Circle "+df //create one
  var circle = document.createElementNS(namespace, "circle")
  var textPath = document.createElementNS(namespace,"textPath")
  var text = document.createElementNS(namespace,"text")
  
  text.setAttribute("font-size", size)
  text.setAttribute("font-family",family)
  text.setAttribute("fill",color)
  text.setAttribute("transform","translate("+(cx-r)+","+(cy-r)+")")
  
  //circle.setAttribute("cx", cx)
  //circle.setAttribute("cy", cy)
  circle.setAttribute("cx",r)
  circle.setAttribute("cy",r)
  circle.setAttribute("r", r)
  //give a unique id to the circle
  circle.setAttribute("id",circleid)
  var canvas = document.getElementById("canvas")
  
  var defs = document.getElementById("defs")
  defs.appendChild(circle)
  
  textPath.setAttribute("href","#"+circleid)
  textPath.innerHTML=message
  
  var canvas = document.getElementById("canvas")
  text.appendChild(textPath)
  canvas.appendChild(text)
}

function makeIframe(x,y,width,height,innerwidth, innerheight, src){
    var foreignObject = document.createElementNS(namespace, "foreignObject")
    foreignObject.setAttribute("x",0)
    foreignObject.setAttribute("y",0)
    foreignObject.setAttribute("width",innerwidth)
    foreignObject.setAttribute("height",innerheight)
    var body = document.createElementNS(html,"body")
    var iframe = document.createElementNS(html,"iframe")
    iframe.setAttribute("src", src)
    iframe.setAttribute("width",innerwidth)
    iframe.setAttribute("height",innerheight)
    iframe.setAttribute("marginheight",0)
    iframe.setAttribute("marginwidth",0)
    iframe.setAttribute("frameborder",0)
    var canvas2 = document.createElementNS(namespace,"svg")
    canvas2.setAttribute("viewBox", "-70 -70 " + (innerwidth+130) + " " + (innerheight+120))
    canvas2.setAttribute("width",width+6.5)
    canvas2.setAttribute("height",height+9)
    canvas2.setAttribute("x",x-3.5)
    canvas2.setAttribute("y",y-5)
    var g = document.createElementNS(namespace,"g")
    g.setAttribute("x",x)
    g.setAttribute("y",y)

    body.appendChild(iframe)
    foreignObject.appendChild(body)
    var canvas = document.getElementById("canvas")
    canvas2.appendChild(foreignObject)
    g.appendChild(canvas2)
    canvas.appendChild(g)
}

function makeBdCircle(cx, cy, r, fill, stroke, strokeWidth, opacity) {
  var circle = document.createElementNS(namespace, "circle")
  circle.setAttribute("cx", cx)
  circle.setAttribute("cy", cy)
  circle.setAttribute("r", r)
  circle.setAttribute("fill", fill)
  circle.setAttribute("stroke", stroke)
  circle.setAttribute("stroke-width",strokeWidth)
  circle.setAttribute("opacity", opacity)
  
  var canvas = document.getElementById("canvas")
  canvas.appendChild(circle)
  return circle
}

function makeBdEllipse(cx, cy, rx, ry, fill, stroke, opacity) {
  var ellipse = document.createElementNS(namespace, "ellipse")
  ellipse.setAttribute("cx", cx)
  ellipse.setAttribute("cy", cy)
  ellipse.setAttribute("rx", rx)
  ellipse.setAttribute("ry", ry)
  ellipse.setAttribute("fill", fill)
  ellipse.setAttribute("stroke",stroke)
  ellipse.setAttribute("opacity", opacity)
  
  var canvas = document.getElementById("canvas")
  canvas.appendChild(ellipse)
  return ellipse
}

function createColor(){
    var select1 = ["D", "E", "F"];
    var select2 = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
    var red = select2[Math.floor(Math.random()*16)] + select2[Math.floor(Math.random()*16)];
    var green = select2[Math.floor(Math.random()*16)] + select2[Math.floor(Math.random()*16)];
    var blue = select2[Math.floor(Math.random()*16)] + select2[Math.floor(Math.random()*16)];
    var color = "#" + red + green + blue;
    return color;
}

function makeBdRect(x, y, width, height, fill, stroke, strokewidth, opacity) {
  var rect = document.createElementNS(namespace, "rect")
  rect.setAttribute("x", x)
  rect.setAttribute("y", y)
  rect.setAttribute("width", width)
  rect.setAttribute("height", height)
  rect.setAttribute("fill", fill)
  rect.setAttribute("opacity", opacity)
  rect.setAttribute("stroke",stroke)
  rect.setAttribute("stroke-width",strokewidth)
  
  var canvas = document.getElementById("canvas")
  canvas.appendChild(rect)
  return rect
}


function makePath(d,stroke,fill,linecap,strokeWidth){
  var path = document.createElementNS(namespace, "path")
  path.setAttribute("d",d);
  path.setAttribute("stroke",stroke);
  path.setAttribute("fill",fill)
  path.setAttribute("stroke-linecap",linecap)
  path.setAttribute("stoke-width",strokeWidth)
  var canvas = document.getElementById("canvas")
  canvas.appendChild(path)
}

function makeGradient(stop1, stop2){
  //I never bothered finishing this, since I never used it
}

function setWidth(shape,width){
  if (shape.hasAttribute("rx")){
    shape.setAttribute("rx",width)
  } else if (shape.hasAttribute("r")){
    shape.setAttribute("r",width)
  } else {
    shape.setAttribute("width",width)
  }
}

function setHeight(shape,height){
  if (shape.hasAttribute("ry")){
    shape.setAttribute("ry",height)
  } else if (shape.hasAttribute("r")){
    shape.setAttribute("r",height)
  } else {
    shape.setAttribute("height",height)
  }
}

function getWidth(shape){
  if (shape.hasAttribute("rx")){
    return parseFloat(shape.getAttribute("rx"))
  } else if (shape.hasAttribute("r")){
    return parseFloat(shape.getAttribute("r"))
  } else {
    return parseFloat(shape.getAttribute("width"))
  }
}

function getHeight(shape){
  if (shape.hasAttribute("ry")){
    return parseFloat(shape.getAttribute("ry"))
  } else if (shape.hasAttribute("r")){
    return parseFloat(shape.getAttribute("r"))
  } else {
    return parseFloat(shape.getAttribute("height"))
  }
}

// DO NOT EDIT CODE BELOW THIS LINE!
function getX(shape) {
  if (shape.hasAttribute("x")) {
    return parseFloat(shape.getAttribute("x"))
  } else {
    return parseFloat(shape.getAttribute("cx"))
  }  
}

function getY(shape) {
  if (shape.hasAttribute("y")) {
    return parseFloat(shape.getAttribute("y"))
  } else {
    return parseFloat(shape.getAttribute("cy"))
  }  
}

function setX(shape, x) {
  if (shape.hasAttribute("x")) {
    shape.setAttribute("x", x)
  } else {
    shape.setAttribute("cx", x)
  } 
}

function setY(shape, y) {
  if (shape.hasAttribute("y")) {
    shape.setAttribute("y", y)
  } else {
    shape.setAttribute("cy", y)
  } 
}

function move(shape, dx, dy) {
  if (shape.hasAttribute("x") && shape.hasAttribute("y")) {
    var x = parseFloat(shape.getAttribute("x"))
    var y = parseFloat(shape.getAttribute("y"))
    shape.setAttribute("x", x + dx)
    shape.setAttribute("y", y + dy)
  } else {
    var cx = parseFloat(shape.getAttribute("cx"))
    var cy = parseFloat(shape.getAttribute("cy"))
    shape.setAttribute("cx", cx + dx)
    shape.setAttribute("cy", cy + dy)
  }
}

function makeCircle(cx, cy, r, fill, opacity) {
  var circle = document.createElementNS(namespace, "circle")
  circle.setAttribute("cx", cx)
  circle.setAttribute("cy", cy)
  circle.setAttribute("r", r)
  circle.setAttribute("fill", fill)
  circle.setAttribute("opacity", opacity)
  
  var canvas = document.getElementById("canvas")
  canvas.appendChild(circle)
  return circle
}

function makeRect(x, y, width, height, fill, opacity) {
  var rect = document.createElementNS(namespace, "rect")
  rect.setAttribute("x", x)
  rect.setAttribute("y", y)
  rect.setAttribute("width", width)
  rect.setAttribute("height", height)
  rect.setAttribute("fill", fill)
  rect.setAttribute("opacity", opacity)
  
  var canvas = document.getElementById("canvas")
  canvas.appendChild(rect)
  return rect
}

function makeEllipse(cx, cy, rx, ry, fill, opacity) {
  var ellipse = document.createElementNS(namespace, "ellipse")
  ellipse.setAttribute("cx", cx)
  ellipse.setAttribute("cy", cy)
  ellipse.setAttribute("rx", rx)
  ellipse.setAttribute("ry", ry)
  ellipse.setAttribute("fill", fill)
  ellipse.setAttribute("opacity", opacity)
  
  var canvas = document.getElementById("canvas")
  canvas.appendChild(ellipse)
  return ellipse
}

function makeLine(x1, y1, x2, y2, stroke, strokeWidth, opacity) {
  var line = document.createElementNS(namespace, "line")
  line.setAttribute("x1", x1)
  line.setAttribute("y1", y1)
  line.setAttribute("x2", x2)
  line.setAttribute("y2", y2)
  line.setAttribute("stroke", stroke)
  line.setAttribute("stroke-width", strokeWidth)
  line.setAttribute("opacity", opacity)
  
  var canvas = document.getElementById("canvas")
  canvas.appendChild(line)
  return line
}

function makePolyline(points, stroke, strokeWidth, opacity) {
  var polyline = document.createElementNS(namespace, "polyline")
  polyline.setAttribute("points", points)
  polyline.setAttribute("stroke", stroke)
  polyline.setAttribute("stroke-width", strokeWidth)
  polyline.setAttribute("opacity", opacity)
  polyline.setAttribute("fill", "none")
  
  var canvas = document.getElementById("canvas")
  canvas.appendChild(polyline)
  return polyline
}

function makePolygon(points, fill, opacity) {
  var polygon = document.createElementNS(namespace, "polygon")
  polygon.setAttribute("points", points)
  polygon.setAttribute("opacity", opacity)
  polygon.setAttribute("fill", fill)
  
  var canvas = document.getElementById("canvas")
  canvas.appendChild(polygon)
  return polygon
}

function makeText(message, x, y, fontSize, fontFamily, fill, opacity) {
  var text = document.createElementNS(namespace, "text")
  text.innerHTML = message
  text.setAttribute("x", x)
  text.setAttribute("y", y)
  text.setAttribute("font-size", fontSize)
  text.setAttribute("font-family", fontFamily)
  text.setAttribute("fill", fill)
  text.setAttribute("opacity", opacity)
  
  var canvas = document.getElementById("canvas")
  canvas.appendChild(text)
  return text
}

function makeImage(url, x, y, width, height, opacity) {
  var image = document.createElementNS(namespace, "image")
  image.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", url)
  image.setAttribute("x", x)
  image.setAttribute("y", y)
  image.setAttribute("width", width)
  image.setAttribute("height", height)
  image.setAttribute("opacity", opacity)
  
  var canvas = document.getElementById("canvas")
  canvas.appendChild(image)
  return image
}

function collides(rect1, rect2) {
  var centerX = getX(rect1) + parseFloat(rect1.getAttribute("width"))/2
  var centerY = getY(rect1) + parseFloat(rect1.getAttribute("height"))/2
  return (centerX > getX(rect2) && 
          centerX < getX(rect2) + parseFloat(rect2.getAttribute("width")) &&
         centerY > getY(rect2) &&
         centerY < getY(rect2) + parseFloat(rect2.getAttribute("height")))
}
