const { createCanvas, loadImage, registerFont } = require('canvas')

registerFont('./assets/fonts/Quicksand-VariableFont_wght.ttf', { family: 'Lato' ,weight:200})

const draw = (offset, icon, temp, wind, city) =>  new Promise((resolve, reject) => {

    
currenttime = calcTime(offset)

const canvas = createCanvas(750, 750)
const ctx = canvas.getContext('2d')
ctx.fillStyle = "white";
ctx.fillRect(0, 0, 750, 750);



ctx.fillStyle = "#3d3c3c";
ctx.font = '90px "Quicksand"'
ctx.fillText(currenttime, 120, 150)


ctx.fillStyle = "#B8B8B8";
ctx.font = '"lighter" 300px "Quicksand"'

ctx.fillText(temp + '°', 60, 450)
ctx.font = '150px "Quicksand"'
ctx.fillText('C', 450, 450)
ctx.font = '60px "Quicksand"'
ctx.fillText(`Wind : ${wind}km/h`, 60, 570)
ctx.font = '120px "Quicksand"'
ctx.fillText(city, 60, 690)

ctx.font = '20px "Quicksand"'
ctx.fillText("Dev Ahzam | Genarated by Node js ", 420, 735)


ctx.strokeRect(0, 0, 750, 750);

// Draw cat with lime helmet
loadImage(`./assets/svg/${icon}.svg`).then((image) => {
  ctx.drawImage(image, 450, 0, 300, 300)

//   console.log('<img src="' + canvas.toDataURL() + '" />')
resolve(canvas.toDataURL('image/jpeg'))
})
.catch(err => reject(err))
   

})

function  calcTime(offset) {
    // create Date object for current location
    var d = new Date();

    // convert to msec
    // subtract local time zone offset
    // get UTC time in msec
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    // create new Date object for different city
    // using supplied offset
    var nd = new Date(utc + (1000 * offset));
    let handm = nd.toLocaleTimeString().split(':');
    let ampm = nd.toLocaleTimeString().split(' ');
    // return time as a string
    return handm[0] + ':' + handm[1] + ' ' + ampm[1]
  }


module.exports = draw;

