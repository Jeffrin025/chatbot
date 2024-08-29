(function () {
  var width, height, largeHeader, canvas, ctx, points, target, animateHeader = true;


  initHeader();
  initAnimation();
  addListeners();

  function initHeader() {
      width = window.innerWidth;
      height = window.innerHeight;
      target = { x: width / 2, y: height / 2 };

      largeHeader = document.getElementById("large-header");
      largeHeader.style.height = height + "px";

      canvas = document.getElementById("demo-canvas");
      canvas.width = width;
      canvas.height = height;
      ctx = canvas.getContext("2d");

    
      points = [];
      for (var x = 0; x < width; x = x + width / 20) {
          for (var y = 0; y < height; y = y + height / 20) {
              var px = x + (Math.random() * width) / 20;
              var py = y + (Math.random() * height) / 20;
              var p = { x: px, originX: px, y: py, originY: py };
              points.push(p);
          }
      }

   
      for (var i = 0; i < points.length; i++) {
          var closest = [];
          var p1 = points[i];
          for (var j = 0; j < points.length; j++) {
              var p2 = points[j];
              if (!(p1 == p2)) {
                  var placed = false;
                  for (var k = 0; k < 5; k++) {
                      if (!placed) {
                          if (closest[k] == undefined) {
                              closest[k] = p2;
                              placed = true;
                          }
                      }
                  }

                  for (var k = 0; k < 5; k++) {
                      if (!placed) {
                          if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
                              closest[k] = p2;
                              placed = true;
                          }
                      }
                  }
              }
          }
          p1.closest = closest;
      }


      for (var i in points) {
          var c = new Circle(
              points[i],
              2 + Math.random() * 2,
              "rgba(255,255,255,0.3)"
          );
          points[i].circle = c;
      }
  }


  function addListeners() {
      if (!("ontouchstart" in window)) {
          window.addEventListener("mousemove", mouseMove);
      }
      window.addEventListener("scroll", scrollCheck);
      window.addEventListener("resize", resize);
  }

  function mouseMove(e) {
      var posx = (posy = 0);
      if (e.pageX || e.pageY) {
          posx = e.pageX;
          posy = e.pageY;
      } else if (e.clientX || e.clientY) {
          posx =
              e.clientX +
              document.body.scrollLeft +
              document.documentElement.scrollLeft;
          posy =
              e.clientY +
              document.body.scrollTop +
              document.documentElement.scrollTop;
      }
      target.x = posx;
      target.y = posy;
  }

  function scrollCheck() {
      if (document.body.scrollTop > height) animateHeader = false;
      else animateHeader = true;
  }

  function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      largeHeader.style.height = height + "px";
      canvas.width = width;
      canvas.height = height;
  }


  function initAnimation() {
      animate();
      for (var i in points) {
          shiftPoint(points[i]);
      }
  }

  function animate() {
      if (animateHeader) {
          ctx.clearRect(0, 0, width, height);
          for (var i in points) {
         
              if (Math.abs(getDistance(target, points[i])) < 4000) {
                  points[i].active = 0.3;
                  points[i].circle.active = 0.6;
              } else if (Math.abs(getDistance(target, points[i])) < 20000) {
                  points[i].active = 0.1;
                  points[i].circle.active = 0.3;
              } else if (Math.abs(getDistance(target, points[i])) < 40000) {
                  points[i].active = 0.02;
                  points[i].circle.active = 0.1;
              } else {
                  points[i].active = 0;
                  points[i].circle.active = 0;
              }

              drawLines(points[i]);
              points[i].circle.draw();
          }
      }
      requestAnimationFrame(animate);
  }

  function shiftPoint(p) {
      gsap.to(p, { x: p.originX - 50 + Math.random() * 100, y: p.originY - 50 + Math.random() * 100, duration: 1 + 1 * Math.random(), ease: "circ.inOut", onComplete: function () { shiftPoint(p); } });
  }


  function drawLines(p) {
      if (!p.active) return;
      for (var i in p.closest) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.closest[i].x, p.closest[i].y);
          ctx.strokeStyle = "rgba(156,217,249," + p.active + ")";
          ctx.stroke();
      }
  }

  function Circle(pos, rad, color) {
      var _this = this;

 
      (function () {
          _this.pos = pos || null;
          _this.radius = rad || null;
          _this.color = color || null;
      })();

      this.draw = function () {
          if (!_this.active) return;
          ctx.beginPath();
          ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
          ctx.fillStyle = "rgba(156,217,249," + _this.active + ")";
          ctx.fill();
      };
  }

  // Util
  function getDistance(p1, p2) {
      return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
  }
})();

const socket = io();

const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const voiceButton = document.getElementById('voice-button');

function appendMessage(type, text) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message ' + type + '-message';
  messageDiv.textContent = text;
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Function to send a message
function sendMessage() {
  const prompt = messageInput.value;
  if (prompt.trim() === '') return;

  appendMessage('user', prompt);
  messageInput.value = '';

  socket.emit('message', prompt);
}

// Send message when the "Send" button is clicked
sendButton.addEventListener('click', sendMessage);

// Send message when the "Enter" key is pressed
messageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

socket.on('message', (data) => {
  appendMessage(data.type, data.text);
});

socket.on('error', (message) => {
  appendMessage('bot', message);
});

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.interimResults = false;

const supportedLanguages = {
  'en': 'en-IN',    
  'hi': 'hi-IN',    
  'ta': 'ta-IN',    
  'ml': 'ml-IN',    
  'te': 'te-IN',  
  'gu': 'gu-IN',   
};


function getLanguageInput() {
  return new Promise((resolve) => {
    const userLang = prompt("Please enter your preferred language (e.g., English, Tamil, Malayalam, Telugu, Gujarati):", "English").toLowerCase();
    
    const langCode = Object.keys(supportedLanguages).find(key => userLang.includes(key));
    
    if (langCode) {
      resolve(supportedLanguages[langCode]);
    } else {
      alert("Unsupported language. Defaulting to English (India).");
      resolve(supportedLanguages['en']);
    }
  });
}

voiceButton.addEventListener('click', async () => {
  try {
    const selectedLang = await getLanguageInput();
    recognition.lang = selectedLang;
    console.log(`Language set to ${recognition.lang}`);
    
    recognition.start();
  } catch (error) {
    console.error('Error setting language for voice recognition:', error);
  }
});

recognition.addEventListener('result', (event) => {
  const speechToText = event.results[0][0].transcript;
  messageInput.value = speechToText;

  appendMessage('user', speechToText);
  socket.emit('message', speechToText);
});

recognition.addEventListener('end', () => {
  recognition.stop();
});

recognition.addEventListener('error', (event) => {
  appendMessage('bot', 'Voice recognition error: ' + event.error);
});
