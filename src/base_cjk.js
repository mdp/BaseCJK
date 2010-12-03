var BaseCJK = {

  // private property
  _start : 0x4E00,
  _paddingStart: 0x8E00,
  _bits : 14,

  // public method for encoding
  encode : function (input) {
    var output = "";
    var enc1, enc2, enc3, enc4;
    var byts = [];
    var i = 0;
    var b = 0;
    var significant_byts;
    var significant_chrs;

    while (i < input.length) {

      byts = [];
      chrs = [];
      for (b=0; b < 7; b++) {
        byts.push(input[i++]);
      }
      chrs[0] = (byts[0] << 6) | (byts[1] >> 2);
      chrs[1] = ((byts[1] & 3) << 12) | (byts[2] << 4) | (byts[3] >> 4);
      chrs[2] = ((byts[3] & 15) << 10) | (byts[4] << 2) | (byts[5] >> 6);
      chrs[3] = ((byts[5] & 63) << 8) | byts[6];

      output +=
        String.fromCharCode(chrs[0] + this._start) +
        String.fromCharCode(chrs[1] + this._start) +
        String.fromCharCode(chrs[2] + this._start) +
        String.fromCharCode(chrs[3] + this._start);
    }

    significant_byts = (byts.indexOf(undefined) > 0) ? byts.indexOf(undefined) : 7;
    significant_chrs = Math.ceil((significant_byts)/2);
    output = output.substr(0, output.length - 4 + significant_chrs);
    output += String.fromCharCode(this._paddingStart + (7 - significant_byts));
    return output;
  },

  // public method for decoding
  decode : function (input) {
    var chrs;
    var byts = [];
    var output = [];
    var extraneous_byts = 0;
    var i = 0;

    if (input.charCodeAt(input.length-1) >= this._paddingStart ) {
      extraneous_byts = (this._paddingStart - 7 - input.charCodeAt(input.length-1));
      input = input.substr(0, input.length-1);
    }

    while (i < input.length) {

      chrs = []
      for (b=0; b < 4; b++) {
        chrs.push(input.charCodeAt(i++) - this._start);
      }

      byts[0] = chrs[0] >> 6;
      byts[1] = ((chrs[0] & 63) << 2) | (chrs[1] >> 12);
      byts[2] = (chrs[1] & 4095) >> 4;
      byts[3] = ((chrs[1] & 15) << 4) | (chrs[2] >> 10);
      byts[4] = (chrs[2] & 1023) >> 2;
      byts[5] = ((chrs[2] & 3) << 6) | (chrs[3] >> 8);
      byts[6] = chrs[3] & 255;
      output = output.concat(byts);

    }
    if (extraneous_byts) {
      output = output.slice(0, output.length - extraneous_byts);
    }
    return output;

  }


}

