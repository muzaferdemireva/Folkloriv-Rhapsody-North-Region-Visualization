let video, img, icon;

let screenshotCountText;
let screenshotButton;
let downloadButton;
let downloadButton2;
let finalizeButton;

let screenshotBuffer;

let videoLoaded = false, imgLoaded = false, iconLoaded = false;

let tintedIcons = {};


let soundAnalyzer;

let waveOffset1 = 0;
let waveHeight = 0;

let screenshots = [];
let finalized = false;

let scaleFactor = 0.45;
let gridOffsetY = 3200;
let gridOffsetX = 2400;

let isPlaying1 = false;



let finalCombinedImage = null;
let qrImg;
let qrImgElement;
let uploadedImageURL = "";


let sequenceImage = null;
let qrImgElement2;
let uploadedSequenceURL = "";

const imgbbApiKey = 'c769a359cf2a5ade5afed4324d005f58';

let title;


let croppedScreenshots = []; // to hold the cropped layers

let finalizeWarningText;
let finalizeWarningText2;

let sequenceWarningText;
let waitForQR;





function preload() {
  video = createVideo("severnyashkata.mp4", () => { video.hide(); videoLoaded = true; });
  img = loadImage("severnyashka-colours.png", () => imgLoaded = true);
  icon = loadImage("severnyashka-icon.png", () => iconLoaded = true);

  soundFormats("mp3", "wav");
  myFont = loadFont('Anago-Book.ttf');
  myFont2 = loadFont('Anago-Thin.ttf');
  myFont3 = loadFont('Anago-ThinItalic.ttf');
  myFont4 = loadFont('Anago-Bold.ttf');
  myFont5 = loadFont('Anago-BookItalic.ttf');
  myFont6 = loadFont('Anago-BoldItalic.otf');

  title = loadImage("title.png");
  

}






function setup() {
  background(0);



  createCanvas(12700 * scaleFactor, 6200 * scaleFactor);
  document.title = "North Region | Folkloric Rhapsody"; 

  video.size(3540, 2000);
 

  frameRate(30);

  soundAnalyzer = new p5.Amplitude(); soundAnalyzer.setInput(video);

  screenshotButton = createButton("Take Screenshot");
  screenshotButton.position(2050, 2650);
  screenshotButton.size(650, 140);
  screenshotButton.style("font-size", "60px");
  screenshotButton.style("font-family", myFont2);
 
  screenshotButton.mousePressed(takeScreenshot);

  screenshotCountText = createP("SCREENSHOTS TAKEN: 0");
  screenshotCountText.position(4000, 2625);
  screenshotCountText.style("font-size", "63px");
  screenshotCountText.style("font-family", "Anago-Book");
  screenshotCountText.style("color", "#333");

  finalizeButton = createButton("Finalize");
  finalizeButton.position(3000, 2650);
  finalizeButton.size(650, 140);
  finalizeButton.style("font-size", "60px");
  finalizeButton.style("font-family", myFont2);
  finalizeButton.mousePressed(finalizeScreenshots);

  downloadButton = createButton("Download");
  downloadButton.position(2780, 1150);
  downloadButton.size(500, 140);
  downloadButton.style("font-size", "60px");
  downloadButton.style("font-family", myFont2);
  downloadButton.mousePressed(downloadScreenshot);
  downloadButton.hide();

  downloadButton2 = createButton("Download");
  downloadButton2.position(4350, 1150);
  downloadButton2.size(500, 140);
  downloadButton2.style("font-size", "60px");
  downloadButton2.style("font-family",myFont2);
  downloadButton2.mousePressed(downloadSequence);
  downloadButton2.hide();
 
  finalizeWarningText = createP("WARNING!");
  finalizeWarningText.position(4810, 1490); // Adjust Y to appear under the Finalize button
  finalizeWarningText.style("font-size", "60px");
  finalizeWarningText.style("font-family", "Anago-BoldItalic");
  finalizeWarningText.hide();  // Hidden by default

  finalizeWarningText2 = createP("Please take at least 1 screenshot <br>before finalizing!");
  finalizeWarningText2.position(4810, 1570); // Adjust Y to appear under the Finalize button
  finalizeWarningText2.style("font-size", "60px");
  finalizeWarningText2.style("font-family", "Anago-BookItalic");
  finalizeWarningText2.hide();  // Hidden by default


  sequenceWarningText = createP("Take more screenshots to see sequence of screenshots.");
  sequenceWarningText.position(3570, 1370); // Adjust based on your layout
  sequenceWarningText.style("font-size", "65px");
  sequenceWarningText.style("font-family", "Anago-BookItalic");
  sequenceWarningText.hide();

  waitForQR = createP("Wait for QR code to appear in order to open <br> and save on mobile devices.");
  waitForQR.position(3570, 1130); // Adjust based on your layout
  waitForQR.style("font-size", "65px");
  waitForQR.style("font-family", "Anago-BookItalic");
  waitForQR.hide();

  waitForQR2 = createP("*Wait for QR codes to appear in order to open and save on mobile devices.");
  waitForQR2.position(2000, 2530); // Adjust based on your layout
  waitForQR2.style("font-size", "60px");
  waitForQR2.style("font-family", "Anago-ThinItalic");
  waitForQR2.hide();
}






function draw() {


  if (!videoLoaded || !imgLoaded || !iconLoaded) {
    background(50);
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(65);
    text("Loading...", width / 2, height / 2);
    
   
  return;
  }
  


  
  if (finalized) {
    background(255);
  
    image(title, 740,100, 4150, 670);
    fill(210);
    rect(30, 870, 7000, 5);
    rect(30, 2450, 7000, 5);
    fill(0);
    textSize(70);
    textFont(myFont5);
    text("Layered Image", 950, 1140);
  
    // Draw exactly at (0, 0)
    for (let i = 0; i < screenshots.length; i++) {
      tint(255, 255 / (i + 1));
      image(screenshots[i], 0, 0);  // ← No shifting!
    }
  
    noTint();


  
  if (screenshots.length > 1 && sequenceImage) {
    const sequenceX = 3350;
    const sequenceY = 1200;
  
    const maxDisplayHeight = 1050; // or whatever fits your layout
    const actualHeight = sequenceImage.height;
    const actualWidth = sequenceImage.width;
  
    // 🔧 Compute scale factor dynamically
    let scale = 1;
    if (actualHeight > maxDisplayHeight) {
      scale = maxDisplayHeight / actualHeight;
    }
  
    // Draw scaled image
    image(sequenceImage, sequenceX, sequenceY, actualWidth * scale, actualHeight * scale);
    
    fill(0);
    textFont(myFont5);
    textSize(70);
    text("Sequence Image", 3400, 1140);
  }

  fill(0);
  textFont(myFont5);
  textSize(55);
 

  if (screenshots.length > 1) {
  text("         Scan QR code", 2780, 1950);
  text("         Scan QR code", 4350, 1950);
  waitForQR2.show();
}

  if (screenshots.length == 1) {
    text("         Scan QR code", 2825, 1950);
    fill(255);
    stroke(0);
    rect(3500, 1150, 1570, 420);

    stroke(110);
    rect(3500, 1400, 1570, 1);

    }
  

   

    return;
  }
  
  




  background(255);
 
  fill(0);
  textSize(65);
  text("* Click on visualization to stop/play it.",700, 2750);
  
  
  fill(210);
  rect(30, 870, 7000, 5);
  rect(30, 2440, 7000, 5);

  

  image(title, 740,100, 4150, 670);

  
  push();
  
  scale(scaleFactor); 
   
  translate(gridOffsetX, gridOffsetY);
 




  let mX = mouseX / scaleFactor - gridOffsetX;
  let mY = mouseY / scaleFactor - gridOffsetY;

  const v1X = 0, v1Y = 0;

  video.loadPixels(); img.loadPixels();
  
  handlePlayPause(video, isPlaying1);


  drawVisualGrid(video, img, icon, tintedIcons, { value: waveOffset1 }, { value: waveHeight }, soundAnalyzer, v1Y, v1X);

  pop();

  // --- Show the original video on the side (or anywhere you'd like)
  let videoDisplayX = 3000;
  let videoDisplayY = 1230;
  let videoDisplayW = video.width * 0.47;
  let videoDisplayH = video.height * 0.47;

  image(video, videoDisplayX, videoDisplayY, videoDisplayW, videoDisplayH);

  // Optional: Draw a label or border
  noFill();
  stroke(0);
  rect(videoDisplayX - 2, videoDisplayY - 2, videoDisplayW + 4, videoDisplayH + 4);
  noStroke();
  fill(0);
  textSize(70);
  text("Original Video", videoDisplayX-5, videoDisplayY - 90);
  textFont(myFont5);
  text("Visualization", videoDisplayX-2050, videoDisplayY - 90);
  textFont(myFont5);
}






function drawVisualGrid(video, img, icon, tintedIcons, waveOffsetRef, waveHeightRef, analyzer, offsetY, offsetX, buffer = null) {
  let gridSize = 250;
  let target = buffer || this;

  let audioLevel = analyzer.getLevel();
  waveOffsetRef.value += 5;
  waveHeightRef.value = map(audioLevel, 0, 1, -50, 50);

  let maxVizWidth = 3700;
  let vizHeight = 2000; 

  for (let y = 0; y < vizHeight; y += gridSize) {
    for (let x = -gridSize; x < maxVizWidth; x += gridSize) {
      let xOffset = x + waveOffsetRef.value;

      let videoX = constrain(floor(map(x, 0, video.width, 0, video.width)), 0, video.width - 1);
      let videoY = constrain(floor(map(y, 0, video.height, 0, video.height)), 0, video.height - 1);
      let videoIndex = (videoY * video.width + videoX) * 4;
      let brightnessValue = video.pixels[videoIndex];

      let imgX = constrain(floor(map(x, 0, video.width, 0, img.width)), 0, img.width - 1);
      let imgY = constrain(floor(map(y, 0, video.height, 0, img.height)), 0, img.height - 1);
      let imgIndex = (imgY * img.width + imgX) * 4;

      let r = img.pixels[imgIndex];
      let g = img.pixels[imgIndex + 1];
      let b = img.pixels[imgIndex + 2];

      let size = map(brightnessValue, 0, 255, gridSize / 5, gridSize * 2);

      let colorKey = `${r},${g},${b}`;
      if (!tintedIcons[colorKey]) {
        let tintedIcon = createGraphics(icon.width, icon.height);
        tintedIcon.tint(r, g, b);
        tintedIcon.image(icon, 0, 0);
        tintedIcons[colorKey] = tintedIcon;
      }

      let yOffset = y + offsetY + waveHeightRef.value * 6;
      target.image(tintedIcons[colorKey], xOffset + offsetX-size*.5, yOffset-size*.5, size, size);
    }
  }
}




function handlePlayPause(video, isPlaying) {
  if (isPlaying) video.play();
  else video.pause();
}




function mousePressed() {
  let mX = mouseX / scaleFactor - gridOffsetX;
  let mY = mouseY / scaleFactor - gridOffsetY;
  if (isInBounds(mX, mY, 0, 0, video)) isPlaying1 = !isPlaying1;
  
}

function isInBounds(x, y, vx, vy, vid) {
  return x > vx && x < vx + vid.width && y > vy && y < vy + vid.height;
}





function takeScreenshot() {
  if (!finalized) {
    const fullW = width / scaleFactor;
    const fullH = height / scaleFactor;

    let buffer = createGraphics(fullW, fullH);
    buffer.clear();

    buffer.push();
    buffer.scale(scaleFactor);                       // 1. Scaling
    buffer.translate(gridOffsetX, gridOffsetY);     // 2. Offset
    waveOffset1 += 5;
    waveHeight = map(soundAnalyzer.getLevel(), 0, 1, -50, 50);
    drawVisualGrid(video, img, icon, tintedIcons, { value: waveOffset1 }, { value: waveHeight }, soundAnalyzer, 0, 0, buffer);
    buffer.pop();

    // No cropping
    screenshots.push(buffer.get());
    screenshotCountText.html("SCREENSHOTS TAKEN: " + screenshots.length);
  
    finalizeWarningText.hide(); 
    finalizeWarningText2.hide();
  }
}










function finalizeScreenshots() {
  if (screenshots.length === 0) {
    finalizeWarningText.show();  // Show warning
    finalizeWarningText2.show();
    return;  // Do not finalize
  }

  finalized = true;
  noLoop();

  video.pause(); 

  screenshotButton.hide();
  screenshotCountText.hide();
  finalizeButton.hide();
  downloadButton.show();
  downloadButton2.show();

  finalizeWarningText.hide(); // Just in case

  buildFinalImage();      // Combined fade image


  



  if (screenshots.length === 1) {
    downloadButton2.hide();             // hide download sequence
    sequenceWarningText.show();         // show tip message
    waitForQR.show();
    downloadButton.position(2830, 1150);
    
    generateAndUploadImage(finalCombinedImage, (url) => {
      showQRCode(url, 2855, 1400); // QR 1 (final image)
    });
    

    if (qrImgElement2) qrImgElement2.remove(); // hide QR 2 if it exists
  } else {
    downloadButton2.show();            // show download sequence
    sequenceWarningText.hide();   


  buildSequenceImage();   // Full vertical image

 
  generateAndUploadImage(sequenceImage, (url) => {
    showQRCode(url, 4370, 1400, true); // QR 2 (sequence)
  }); 


  generateAndUploadImage(finalCombinedImage, (url) => {
    showQRCode(url, 2810, 1400); // QR 1 (final image)
  });
}
  
  
}





function buildFinalImage() {
  if (screenshots.length === 0) {
    console.log("No screenshots to combine.");
    return;
  }

  // 🔧 Crop settings — adjust until it matches your icon grid
  const cropX = 800;
  const cropY = 1200;
  const cropW = 2050;
  const cropH = 1100;

  // Reset cropped screenshots array
  croppedScreenshots = [];

  // Create the final composite image (same size as one cropped layer)
  finalCombinedImage = createGraphics(cropW, cropH);
  finalCombinedImage.clear(); // transparent

  for (let i = 0; i < screenshots.length; i++) {
    // Crop the screenshot
    const cropped = screenshots[i].get(cropX, cropY, cropW, cropH);
    croppedScreenshots.push(cropped); // Store for sequence

    // Fade-combine into the final image
    finalCombinedImage.tint(255, 255 / (i + 1));
    finalCombinedImage.image(cropped, 0, 0);
  }

  finalCombinedImage.noTint();
}






function buildSequenceImage() {
  if (croppedScreenshots.length === 0) {
    console.warn("No cropped screenshots available.");
    return;
  }

  const w = croppedScreenshots[0].width;
  const h = croppedScreenshots[0].height;
  const totalHeight = h * croppedScreenshots.length;

  sequenceImage = createGraphics(w, totalHeight);
  sequenceImage.clear(); // keep background transparent

  let y = 0;
  for (let i = 0; i < croppedScreenshots.length; i++) {
    sequenceImage.image(croppedScreenshots[i], 0, y);
    y += h;
  }

  console.log("Sequence image built:", w, totalHeight);
}









function downloadScreenshot() {
  if (!finalCombinedImage) {
    console.warn("No finalized image to download.");
    return;
  }

  // Convert canvas to image and download
  const dataURL = finalCombinedImage.elt.toDataURL("image/png");
  const link = document.createElement('a');
  link.download = 'LayeredImage.png';
  link.href = dataURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}













function downloadSequence() {
  if (!sequenceImage) {
    console.warn("Sequence image not built yet.");
    return;
  }

  // Convert canvas to image and download
  const dataURL = sequenceImage.elt.toDataURL("image/png");
  const link = document.createElement('a');
  link.download = 'SequenceImage.png';
  link.href = dataURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}










function generateAndUploadImage(graphicsObj, callback) {
  if (!graphicsObj) {
    console.error("Image object missing.");
    return;
  }

  graphicsObj.canvas.toBlob((blob) => {
    const formData = new FormData();
    formData.append("image", blob);

    fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
      method: "POST",
      body: formData
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Uploaded URL:", data.data.url);
        if (data && data.data && data.data.url) {
          callback(data.data.url);
        } else {
          console.error("Invalid upload response:", data);
        }
      })
      
      .catch((err) => console.error("Image upload failed:", err));
  }, 'image/png');
}








function showQRCode(url, x, y, isSequence = false) {
  const qrURL = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(url)}&size=350x350`;

  // Remove old first
  if (isSequence) {
    if (qrImgElement2) qrImgElement2.remove();
  } else {
    if (qrImgElement) qrImgElement.remove();
  }

  // Create and position the new QR code
  const imgEl = createImg(qrURL, isSequence ? "Sequence QR Code" : "Final Image QR Code");
  imgEl.size(450, 450);
  imgEl.position(x, y);

  // Assign to proper global
  if (isSequence) {
    qrImgElement2 = imgEl;
  } else {
    qrImgElement = imgEl;
  }
}

 
