/*** MAIN ***/
//es el programa principal
window.addEventListener('load', load, false);

var WIN_WDT = window.innerWidth;
var WIN_HGT = window.innerHeight;
var TOOLBAR_HGT = 40;
var ctxToolbar;
var ctxCanvas;
var ctxPalette;
var ctxBrushes;
var mousedown = false;
var colorIdx = 16;
var colorTmp = colorIdx;
var bgcolorIdx = 0;
var bgcolorTmp = bgcolorIdx;
var lineWidth = 16;
var lineTmp = lineWidth;
var radius = lineWidth >> 1;
var currX;
var currY;
var lastX;
var lastY;
var img_button;
var buttonIdx = 0;
var BUTTON_WDT = 80;
var BUTTON_HGT = 31;
var MAX_RES = 1;
var countRes = 0;

function load() {
	loadResources();
	img_button = new Image();
	img_button.onload = init;
	img_button.src = 'images/button.png';
}

function loadResources() {
	img_button = new Image();
	img_button.onload = countResources;
	img_button.src = 'images/button.png';
}

function countResources() {
	countRes++;
	if(countRes = MAX_RES) {
		init();
	}
}

function init() {
	BUTTON_WDT = img_button.width;
	BUTTON_HGT = img_button.height;

	WIN_WDT = window.innerWidth;
	WIN_HGT = window.innerHeight;
	initToolbar();
	initCanvas(); 	
	initPalette();
	initBrushes();
}



function drawButton(ctx, x, y, text, hover) {
	var px;
	if(hover) {
		ctx.fillStyle = '#FF8000';
	} else {
		ctx.fillStyle = '#404040';
	}
	ctx.fillRect(x-2, y-2, BUTTON_WDT+4, BUTTON_HGT+4);
	ctx.drawImage(img_button, x, y);
	px = x + ((BUTTON_WDT - ctx.measureText(text).width) >> 1)
	ctx.fillStyle = '#000000';
	ctx.fillText(text,px+1,y+8);
	ctx.fillStyle = '#FFFFFF';
	ctx.fillText(text,px,y+7);
}

function inside( px, py, x, y, wdt, hgt ) {
	if( (px >= x) && (px < (x+wdt)) && (py >= y) && (py < (y+hgt)) ) {
		return true;
	} else {
		return false;
	}
}

function ctxSetColor(ctx) {
	imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
	size = imgData.width * imgData.height;
	pixel = imgData.data;
	pos = 0;
	r = paleta[colorIdx][0];
	g = paleta[colorIdx][1];
	b = paleta[colorIdx][2];
	for(i=0; i < size; i++ ) {
		pixel[pos + 0] = r;
		pixel[pos + 1] = g;
		pixel[pos + 2] = b;
		pos += 4;
	}
	ctx.putImageData(imgData, 0, 0);
}

function ctxSetAlpha(ctx) {
	imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
	size = imgData.width * imgData.height;
	pixel = imgData.data;
	pos = 0;
	for(i=0; i < size; i++ ) {
		gray = (pixel[pos + 0] * 0.299) + (pixel[pos + 1] * 0.587) + (pixel[pos + 2] * 0.114);
		if( pixel[pos + 3] > 0 ) {
			pixel[pos + 3] = 255 - gray;
		}
		pos += 4;
	}
	ctx.putImageData(imgData, 0, 0);
}

var paleta = 
[[255,255,255], // white
[245,181,107],
[236,166,92],
[227,151,78],
[217,136,65],
[208,123,53],
[199,108,41],
[192,95,30],
[186,92,28],
[179,87,26],
[173,84,23],
[167,77,22],
[160,72,20],
[154,69,18],
[147,63,16],
[141,59,14],
[135,56,13],
[128,52,11],
[123,47,10],
[116,44,9],
[110,41,7],
[104,38,6],
[97,33,5],
[91,31,4],
[84,28,3],
[78,24,3],
[72,21,2],
[65,19,1],
[59,17,0],
[52,14,0],
[46,12,0],
[0,0,0], // black
[246,161,71],
[237,162,82],
[229,159,92],
[220,159,101],
[202,140,85],
[186,126,71],
[170,114,58],
[154,99,46],
[138,86,35],
[123,73,26],
[107,62,18],
[91,50,11],
[75,41,6],
[59,31,2],
[43,22,0],
[255,214,173],
[241,196,153],
[228,181,134],
[215,163,118],
[202,148,102],
[184,137,100],
[168,128,97],
[152,118,93],
[136,108,88],
[121,97,82],
[106,87,75],
[90,75,67],
[74,63,58],
[58,51,47],
[42,37,35],
[26,24,23],
[16,16,16],
[117,19,0],
[82,7,0],
[46,0,0],
[218,255,255],
[255,198,124],
[245,181,107],
[236,166,92],
[227,151,78],
[217,136,65],
[208,123,53],
[199,108,41],
[192,95,30],
[186,92,28],
[179,87,26],
[173,84,23],
[167,77,22],
[160,72,20],
[154,69,18],
[147,63,16],
[141,59,14],
[135,56,13],
[128,52,11],
[123,47,10],
[116,44,9],
[110,41,7],
[104,38,6],
[97,33,5],
[91,31,4],
[84,28,3],
[78,24,3],
[72,21,2],
[65,19,1],
[59,17,0],
[52,14,0],
[46,12,0],
[255,165,59],
[246,161,71],
[237,162,82],
[229,159,92],
[220,159,101],
[202,140,85],
[186,126,71],
[170,114,58],
[154,99,46],
[138,86,35],
[123,73,26],
[107,62,18],
[91,50,11],
[75,41,6],
[59,31,2],
[43,22,0],
[255,214,173],
[241,196,153],
[228,181,134],
[215,163,118],
[202,148,102],
[184,137,100],
[168,128,97],
[152,118,93],
[136,108,88],
[121,97,82],
[106,87,75],
[90,75,67],
[74,63,58],
[58,51,47],
[42,37,35],
[26,24,23],
[152,39,0],
[117,19,0],
[82,7,0],
[46,0,0],
[218,255,255],
[255,198,124],
[245,181,107],
[236,166,92],
[227,151,78],
[217,136,65],
[208,123,53],
[199,108,41],
[192,95,30],
[186,92,28],
[179,87,26],
[173,84,23],
[167,77,22],
[160,72,20],
[154,69,18],
[147,63,16],
[141,59,14],
[135,56,13],
[128,52,11],
[123,47,10],
[116,44,9],
[110,41,7],
[104,38,6],
[97,33,5],
[91,31,4],
[84,28,3],
[78,24,3],
[72,21,2],
[65,19,1],
[59,17,0],
[52,14,0],
[46,12,0],
[255,165,59],
[246,161,71],
[237,162,82],
[229,159,92],
[220,159,101],
[202,140,85],
[186,126,71],
[170,114,58],
[154,99,46],
[138,86,35],
[123,73,26],
[107,62,18],
[91,50,11],
[75,41,6],
[59,31,2],
[43,22,0],
[255,214,173],
[241,196,153],
[228,181,134],
[215,163,118],
[202,148,102],
[184,137,100],
[168,128,97],
[152,118,93],
[136,108,88],
[121,97,82],
[106,87,75],
[90,75,67],
[74,63,58],
[58,51,47],
[42,37,35],
[26,24,23],
[152,39,0],
[117,19,0],
[82,7,0],
[46,0,0],
[218,255,255],
[255,198,124],
[245,181,107],
[236,166,92],
[227,151,78],
[217,136,65],
[208,123,53],
[199,108,41],
[192,95,30],
[186,92,28],
[179,87,26],
[173,84,23],
[167,77,22],
[160,72,20],
[154,69,18],
[147,63,16],
[141,59,14],
[135,56,13],
[128,52,11],
[123,47,10],
[116,44,9],
[110,41,7],
[104,38,6],
[97,33,5],
[91,31,4],
[84,28,3],
[78,24,3],
[72,21,2],
[65,19,1],
[59,17,0],
[52,14,0],
[46,12,0],
[255,165,59],
[246,161,71],
[237,162,82],
[229,159,92],
[220,159,101],
[202,140,85],
[186,126,71],
[170,114,58],
[154,99,46],
[138,86,35],
[123,73,26],
[107,62,18],
[91,50,11],
[75,41,6],
[59,31,2],
[43,22,0],
[255,214,173],
[241,196,153],
[228,181,134],
[215,163,118],
[202,148,102]];