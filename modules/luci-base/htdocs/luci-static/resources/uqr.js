// MIT License

// Copyright (c) Project Nayuki
// Copyright (c) 2023 Anthony Fu <https://github.com/antfu>
// Minified and modified/stripped of not useful components
'use strict';
var QrCodeDataType=(t=>(t[t.Border=-1]="Border",t[t.Data=0]="Data",t[t.Function=1]="Function",t[t.Position=2]="Position",t[t.Timing=3]="Timing",t[t.Alignment=4]="Alignment",t))(QrCodeDataType||{}),__defProp=Object.defineProperty,__defNormalProp=(t,e,n)=>e in t?__defProp(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n,__publicField=(t,e,n)=>(__defNormalProp(t,"symbol"!=typeof e?e+"":e,n),n);const LOW=[0,1],MEDIUM=[1,0],QUARTILE=[2,3],HIGH=[3,2],EccMap={L:LOW,M:MEDIUM,Q:QUARTILE,H:HIGH},NUMERIC_REGEX=/^[0-9]*$/,ALPHANUMERIC_REGEX=/^[A-Z0-9 $%*+.\/:-]*$/,ALPHANUMERIC_CHARSET="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:",MIN_VERSION=1,MAX_VERSION=40,PENALTY_N1=3,PENALTY_N2=3,PENALTY_N3=40,PENALTY_N4=10,ECC_CODEWORDS_PER_BLOCK=[[-1,7,10,15,20,26,18,20,24,30,18,20,24,26,30,22,24,28,30,28,28,28,28,30,30,26,28,30,30,30,30,30,30,30,30,30,30,30,30,30,30],[-1,10,16,26,18,24,16,18,22,22,26,30,22,22,24,24,28,28,26,26,26,26,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28],[-1,13,22,18,26,18,24,18,22,20,24,28,26,24,20,30,24,28,28,26,30,28,30,30,30,30,28,30,30,30,30,30,30,30,30,30,30,30,30,30,30],[-1,17,28,22,16,22,28,26,26,24,28,24,28,22,24,24,30,28,28,26,28,30,24,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30]],NUM_ERROR_CORRECTION_BLOCKS=[[-1,1,1,1,1,1,2,2,2,2,4,4,4,4,4,6,6,6,6,7,8,8,9,9,10,12,12,12,13,14,15,16,17,18,19,19,20,21,22,24,25],[-1,1,1,1,2,2,4,4,4,5,5,5,8,9,9,10,10,11,13,14,16,17,17,18,20,21,23,25,26,28,29,31,33,35,37,38,40,43,45,47,49],[-1,1,1,2,2,4,4,6,6,8,8,8,10,12,16,12,17,16,18,21,20,23,23,25,27,29,34,34,35,38,40,43,45,48,51,53,56,59,62,65,68],[-1,1,1,2,4,4,4,5,6,8,8,11,11,16,16,18,16,19,21,25,25,25,34,30,32,35,37,40,42,45,48,51,54,57,60,63,66,70,74,77,81]];class QrCode{constructor(t,e,n,r){if(this.version=t,this.ecc=e,__publicField(this,"size"),__publicField(this,"mask"),__publicField(this,"modules",[]),__publicField(this,"types",[]),t<MIN_VERSION||t>MAX_VERSION)throw new RangeError("Version value out of range");if(r<-1||r>7)throw new RangeError("Mask value out of range");this.size=4*t+17;const o=Array.from({length:this.size},(()=>!1));for(let t=0;t<this.size;t++)this.modules.push(o.slice()),this.types.push(o.map((()=>0)));this.drawFunctionPatterns();const s=this.addEccAndInterleave(n);if(this.drawCodewords(s),-1===r){let t=1e9;for(let e=0;e<8;e++){this.applyMask(e),this.drawFormatBits(e);const n=this.getPenaltyScore();n<t&&(r=e,t=n),this.applyMask(e)}}this.mask=r,this.applyMask(r),this.drawFormatBits(r)}getModule(t,e){return t>=0&&t<this.size&&e>=0&&e<this.size&&this.modules[e][t]}drawFunctionPatterns(){for(let t=0;t<this.size;t++)this.setFunctionModule(6,t,t%2==0,QrCodeDataType.Timing),this.setFunctionModule(t,6,t%2==0,QrCodeDataType.Timing);this.drawFinderPattern(3,3),this.drawFinderPattern(this.size-4,3),this.drawFinderPattern(3,this.size-4);const t=this.getAlignmentPatternPositions(),e=t.length;for(let n=0;n<e;n++)for(let r=0;r<e;r++)0===n&&0===r||0===n&&r===e-1||n===e-1&&0===r||this.drawAlignmentPattern(t[n],t[r]);this.drawFormatBits(0),this.drawVersion()}drawFormatBits(t){const e=this.ecc[1]<<3|t;let n=e;for(let t=0;t<10;t++)n=n<<1^1335*(n>>>9);const r=21522^(e<<10|n);for(let t=0;t<=5;t++)this.setFunctionModule(8,t,getBit(r,t));this.setFunctionModule(8,7,getBit(r,6)),this.setFunctionModule(8,8,getBit(r,7)),this.setFunctionModule(7,8,getBit(r,8));for(let t=9;t<15;t++)this.setFunctionModule(14-t,8,getBit(r,t));for(let t=0;t<8;t++)this.setFunctionModule(this.size-1-t,8,getBit(r,t));for(let t=8;t<15;t++)this.setFunctionModule(8,this.size-15+t,getBit(r,t));this.setFunctionModule(8,this.size-8,!0)}drawVersion(){if(this.version<7)return;let t=this.version;for(let e=0;e<12;e++)t=t<<1^7973*(t>>>11);const e=this.version<<12|t;for(let t=0;t<18;t++){const n=getBit(e,t),r=this.size-11+t%3,o=Math.floor(t/3);this.setFunctionModule(r,o,n),this.setFunctionModule(o,r,n)}}drawFinderPattern(t,e){for(let n=-4;n<=4;n++)for(let r=-4;r<=4;r++){const o=Math.max(Math.abs(r),Math.abs(n)),s=t+r,i=e+n;s>=0&&s<this.size&&i>=0&&i<this.size&&this.setFunctionModule(s,i,2!==o&&4!==o,QrCodeDataType.Position)}}drawAlignmentPattern(t,e){for(let n=-2;n<=2;n++)for(let r=-2;r<=2;r++)this.setFunctionModule(t+r,e+n,1!==Math.max(Math.abs(r),Math.abs(n)),QrCodeDataType.Alignment)}setFunctionModule(t,e,n,r=QrCodeDataType.Function){this.modules[e][t]=n,this.types[e][t]=r}addEccAndInterleave(t){const e=this.version,n=this.ecc;if(t.length!==getNumDataCodewords(e,n))throw new RangeError("Invalid argument");const r=NUM_ERROR_CORRECTION_BLOCKS[n[0]][e],o=ECC_CODEWORDS_PER_BLOCK[n[0]][e],s=Math.floor(getNumRawDataModules(e)/8),i=r-s%r,a=Math.floor(s/r),h=[],l=reedSolomonComputeDivisor(o);for(let e=0,n=0;e<r;e++){const r=t.slice(n,n+a-o+(e<i?0:1));n+=r.length;const s=reedSolomonComputeRemainder(r,l);e<i&&r.push(0),h.push(r.concat(s))}const u=[];for(let t=0;t<h[0].length;t++)h.forEach(((e,n)=>{(t!==a-o||n>=i)&&u.push(e[t])}));return u}drawCodewords(t){if(t.length!==Math.floor(getNumRawDataModules(this.version)/8))throw new RangeError("Invalid argument");let e=0;for(let n=this.size-1;n>=1;n-=2){6===n&&(n=5);for(let r=0;r<this.size;r++)for(let o=0;o<2;o++){const s=n-o,i=0==(n+1&2)?this.size-1-r:r;!this.types[i][s]&&e<8*t.length&&(this.modules[i][s]=getBit(t[e>>>3],7-(7&e)),e++)}}}applyMask(t){if(t<0||t>7)throw new RangeError("Mask value out of range");for(let e=0;e<this.size;e++)for(let n=0;n<this.size;n++){let r;switch(t){case 0:r=(n+e)%2==0;break;case 1:r=e%2==0;break;case 2:r=n%3==0;break;case 3:r=(n+e)%3==0;break;case 4:r=(Math.floor(n/3)+Math.floor(e/2))%2==0;break;case 5:r=n*e%2+n*e%3==0;break;case 6:r=(n*e%2+n*e%3)%2==0;break;case 7:r=((n+e)%2+n*e%3)%2==0;break;default:throw new Error("Unreachable")}!this.types[e][n]&&r&&(this.modules[e][n]=!this.modules[e][n])}}getPenaltyScore(){let t=0;for(let e=0;e<this.size;e++){let n=!1,r=0;const o=[0,0,0,0,0,0,0];for(let s=0;s<this.size;s++)this.modules[e][s]===n?(r++,5===r?t+=3:r>5&&t++):(this.finderPenaltyAddHistory(r,o),n||(t+=40*this.finderPenaltyCountPatterns(o)),n=this.modules[e][s],r=1);t+=40*this.finderPenaltyTerminateAndCount(n,r,o)}for(let e=0;e<this.size;e++){let n=!1,r=0;const o=[0,0,0,0,0,0,0];for(let s=0;s<this.size;s++)this.modules[s][e]===n?(r++,5===r?t+=3:r>5&&t++):(this.finderPenaltyAddHistory(r,o),n||(t+=40*this.finderPenaltyCountPatterns(o)),n=this.modules[s][e],r=1);t+=40*this.finderPenaltyTerminateAndCount(n,r,o)}for(let e=0;e<this.size-1;e++)for(let n=0;n<this.size-1;n++){const r=this.modules[e][n];r===this.modules[e][n+1]&&r===this.modules[e+1][n]&&r===this.modules[e+1][n+1]&&(t+=3)}let e=0;for(const t of this.modules)e=t.reduce(((t,e)=>t+(e?1:0)),e);const n=this.size*this.size;return t+=10*(Math.ceil(Math.abs(20*e-10*n)/n)-1),t}getAlignmentPatternPositions(){if(1===this.version)return[];{const t=Math.floor(this.version/7)+2,e=32===this.version?26:2*Math.ceil((4*this.version+4)/(2*t-2)),n=[6];for(let r=this.size-7;n.length<t;r-=e)n.splice(1,0,r);return n}}finderPenaltyCountPatterns(t){const e=t[1],n=e>0&&t[2]===e&&t[3]===3*e&&t[4]===e&&t[5]===e;return(n&&t[0]>=4*e&&t[6]>=e?1:0)+(n&&t[6]>=4*e&&t[0]>=e?1:0)}finderPenaltyTerminateAndCount(t,e,n){return t&&(this.finderPenaltyAddHistory(e,n),e=0),e+=this.size,this.finderPenaltyAddHistory(e,n),this.finderPenaltyCountPatterns(n)}finderPenaltyAddHistory(t,e){0===e[0]&&(t+=this.size),e.pop(),e.unshift(t)}}function appendBits(t,e,n){if(e<0||e>31||t>>>e!=0)throw new RangeError("Value out of range");for(let r=e-1;r>=0;r--)n.push(t>>>r&1)}function getBit(t,e){return 0!=(t>>>e&1)}class QrSegment{constructor(t,e,n){if(this.mode=t,this.numChars=e,this.bitData=n,e<0)throw new RangeError("Invalid argument");this.bitData=n.slice()}getData(){return this.bitData.slice()}}const MODE_NUMERIC=[1,10,12,14],MODE_ALPHANUMERIC=[2,9,11,13],MODE_BYTE=[4,8,16,16];function numCharCountBits(t,e){return t[Math.floor((e+7)/17)+1]}function makeBytes(t){const e=[];for(const n of t)appendBits(n,8,e);return new QrSegment(MODE_BYTE,t.length,e)}function makeNumeric(t){if(!isNumeric(t))throw new RangeError("String contains non-numeric characters");const e=[];for(let n=0;n<t.length;){const r=Math.min(t.length-n,3);appendBits(Number.parseInt(t.substring(n,n+r),10),3*r+1,e),n+=r}return new QrSegment(MODE_NUMERIC,t.length,e)}function makeAlphanumeric(t){if(!isAlphanumeric(t))throw new RangeError("String contains unencodable characters in alphanumeric mode");const e=[];let n;for(n=0;n+2<=t.length;n+=2){let r=45*ALPHANUMERIC_CHARSET.indexOf(t.charAt(n));r+=ALPHANUMERIC_CHARSET.indexOf(t.charAt(n+1)),appendBits(r,11,e)}return n<t.length&&appendBits(ALPHANUMERIC_CHARSET.indexOf(t.charAt(n)),6,e),new QrSegment(MODE_ALPHANUMERIC,t.length,e)}function makeSegments(t){return""===t?[]:isNumeric(t)?[makeNumeric(t)]:isAlphanumeric(t)?[makeAlphanumeric(t)]:[makeBytes(toUtf8ByteArray(t))]}function isNumeric(t){return NUMERIC_REGEX.test(t)}function isAlphanumeric(t){return ALPHANUMERIC_REGEX.test(t)}function getTotalBits(t,e){let n=0;for(const r of t){const t=numCharCountBits(r.mode,e);if(r.numChars>=1<<t)return Number.POSITIVE_INFINITY;n+=4+t+r.bitData.length}return n}function toUtf8ByteArray(t){t=encodeURI(t);const e=[];for(let n=0;n<t.length;n++)"%"!==t.charAt(n)?e.push(t.charCodeAt(n)):(e.push(Number.parseInt(t.substring(n+1,n+3),16)),n+=2);return e}function getNumRawDataModules(t){if(t<MIN_VERSION||t>MAX_VERSION)throw new RangeError("Version number out of range");let e=(16*t+128)*t+64;if(t>=2){const n=Math.floor(t/7)+2;e-=(25*n-10)*n-55,t>=7&&(e-=36)}return e}function getNumDataCodewords(t,e){return Math.floor(getNumRawDataModules(t)/8)-ECC_CODEWORDS_PER_BLOCK[e[0]][t]*NUM_ERROR_CORRECTION_BLOCKS[e[0]][t]}function reedSolomonComputeDivisor(t){if(t<1||t>255)throw new RangeError("Degree out of range");const e=[];for(let n=0;n<t-1;n++)e.push(0);e.push(1);let n=1;for(let r=0;r<t;r++){for(let t=0;t<e.length;t++)e[t]=reedSolomonMultiply(e[t],n),t+1<e.length&&(e[t]^=e[t+1]);n=reedSolomonMultiply(n,2)}return e}function reedSolomonComputeRemainder(t,e){const n=e.map((t=>0));for(const r of t){const t=r^n.shift();n.push(0),e.forEach(((e,r)=>n[r]^=reedSolomonMultiply(e,t)))}return n}function reedSolomonMultiply(t,e){if(t>>>8!=0||e>>>8!=0)throw new RangeError("Byte out of range");let n=0;for(let r=7;r>=0;r--)n=n<<1^285*(n>>>7),n^=(e>>>r&1)*t;return n}function encodeSegments(t,e,n=1,r=40,o=-1,s=!0){if(!(MIN_VERSION<=n&&n<=r&&r<=MAX_VERSION)||o<-1||o>7)throw new RangeError("Invalid value");let i,a;for(i=n;;i++){const n=8*getNumDataCodewords(i,e),o=getTotalBits(t,i);if(o<=n){a=o;break}if(i>=r)throw new RangeError("Data too long")}for(const t of[MEDIUM,QUARTILE,HIGH])s&&a<=8*getNumDataCodewords(i,t)&&(e=t);const h=[];for(const e of t){appendBits(e.mode[0],4,h),appendBits(e.numChars,numCharCountBits(e.mode,i),h);for(const t of e.getData())h.push(t)}const l=8*getNumDataCodewords(i,e);appendBits(0,Math.min(4,l-h.length),h),appendBits(0,(8-h.length%8)%8,h);for(let t=236;h.length<l;t^=253)appendBits(t,8,h);const u=Array.from({length:Math.ceil(h.length/8)},(()=>0));return h.forEach(((t,e)=>u[e>>>3]|=t<<7-(7&e))),new QrCode(i,e,u,o)}function encode(t,e){const{ecc:n="L",boostEcc:r=!1,minVersion:o=1,maxVersion:s=40,maskPattern:i=-1,border:a=1}=e||{},h="string"==typeof t?makeSegments(t):Array.isArray(t)?[makeBytes(t)]:void 0;if(!h)throw new Error("uqr only supports encoding string and binary data, but got: "+typeof t);const l=encodeSegments(h,EccMap[n],o,s,i,r),u=addBorder({version:l.version,maskPattern:l.mask,size:l.size,data:l.modules,types:l.types},a);return e?.invert&&(u.data=u.data.map((t=>t.map((t=>!t))))),e?.onEncoded?.(u),u}function addBorder(t,e=1){if(!e)return t;const{size:n}=t,r=n+2*e;t.size=r,t.data.forEach((t=>{for(let n=0;n<e;n++)t.unshift(!1),t.push(!1)}));for(let n=0;n<e;n++)t.data.unshift(Array.from({length:r},(t=>!1))),t.data.push(Array.from({length:r},(t=>!1)));const o=QrCodeDataType.Border;t.types.forEach((t=>{for(let n=0;n<e;n++)t.unshift(o),t.push(o)}));for(let n=0;n<e;n++)t.types.unshift(Array.from({length:r},(t=>o))),t.types.push(Array.from({length:r},(t=>o)));return t}
return L.Class.extend({
  renderSVG: function(data, options = {}) {
    const result = encode(data, options);
    const {
      pixelSize = 1,
      whiteColor = "white",
      blackColor = "black"
    } = options;
    const height = result.size * pixelSize;
    const width = result.size * pixelSize;
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">`;
    const pathes = [];
    for (let row = 0; row < result.size; row++) {
      for (let col = 0; col < result.size; col++) {
        const x = col * pixelSize;
        const y = row * pixelSize;
        if (result.data[row][col])
          pathes.push(`M${x},${y}h${pixelSize}v${pixelSize}h-${pixelSize}z`);
      }
    }
    svg += `<rect fill="${whiteColor}" width="${width}" height="${height}"/>`;
    svg += `<path fill="${blackColor}" d="${pathes.join("")}"/>`;
    svg += "</svg>";
    return svg;
  },
});
