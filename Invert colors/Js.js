var xhr = new XMLHttpRequest(); //variabila xhr memoreaza obiect de tip XMLHttpRequest pentru cererea Ajax

xhr.onload = function () {

  if (xhr.status === 200) // se verifica proprietatea status a obiectului (200 - OK)
  {
    var inf = JSON.parse(xhr.responseText);
    console.log(inf);
    //var URL = inf.message; // informatii din fisierul cutu.json (obiect cu atribute message si status)
    //var status = inf.status;
    
   
    var imagine = new Image(); // imagine salveaza un nou obiect de timp Image

    //imagine.src = URL;
    imagine.src = 'n02107683_7104.jpg'; // se stabileste sursa pentru imagine la nivel local 

    imagine.onload = async function () {
      var start = performance.now();
      var width = imagine.naturalWidth; // se preia latimea imaginii sursa
      var height = imagine.naturalHeight; // se preia inaltimea imaginii sursa

      var canvas = document.getElementById("myCanvas");

      canvas.width = width; // se transmit latimea si inaltimea imaginii preluate anterior catre canvas 
      canvas.height = height;

      var context = canvas.getContext("2d", { willReadFrequently: true });
      context.drawImage(imagine, 0, 0);

      var imgData = context.getImageData(0, 0, width, height);
      var data = imgData.data;

      await mirror();

      canvas.style.display = 'block';

      await filtruNegativ();

      async function mirror() {
        return Promise1 = new Promise(function (resolve) {
          setTimeout(function () {
            for (i = 0; i < height; i++)
             {
              //pentru functia de mirror se traverseaza in latime pana la jumatate (width/2) deoarece se pixelii din stanga devin cei din dreapta si invers
              for (j = 0; j < width / 2; j++) 
              {
                var index = (i * 4) * width + (j * 4);
                var mirrorIndex = ((i + 1) * 4) * width - ((j + 1) * 4);

                for (p = 0; p < 4; p++)  //interschimbarea pixelilor
                {
                  var aux = data[index + p];
                  data[index + p] = data[mirrorIndex + p];
                  data[mirrorIndex + p] = aux;
                }
              }
            }
            context.putImageData(imgData, 0, 0, 0, 0, width, height);
            resolve();
          }
            , 1000); //dupa 1 secunda se aplica mirror (1000 milisecunde)
        }
        )
      }

      async function filtruNegativ() {
        return Promise2 = new Promise(function (resolve) {
          setTimeout(function () {
            for (let i = 0; i < width; i++) //se traverseaza pixelii din imagine prin cele 2 for-uri (pe randuri)
             {
              for (let j = 0; j < height; j++) 
              {
                
                let pixel = context.getImageData(i, j, 1, 1); //se preia pozitia pixelului actual

                // preluare date despre culori (r - red , g - green , b - blue ) al patrulea element pixel[3] nu necesita modificari
                let r = pixel.data[0];
                let g = pixel.data[1];
                let b = pixel.data[2];
                
                // se obtin valorile culorilor complementare pentru obtinerea filtrului negativ
                var invertedRed = 255 - r;
                var invertedGreen = 255 - g;
                var invertedBlue = 255 - b;

                pixel.data[0] = invertedRed;
                pixel.data[1] = invertedGreen;
                pixel.data[2] = invertedBlue;
                

                 context.putImageData(pixel, i, j); // reconstruire imagine negativa 
              }
            }
            resolve();
          }
            , 1000);
        }
        )
      }

      var end = performance.now();
      console.log("Timp: " + (end - start) + " milisecunde");
    };

  }
  
};


xhr.open("GET", "cutu.json", true); //pregateste cererea (true -modul asincron)
xhr.send(null); //trimite cererea catre server