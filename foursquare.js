var foursquare = {

	'CLIENT_ID' : '[INSERT CLIENT_ID]',
	'REDIRECT_URI' : '[INSERT REDIRECT URI]',
	'canvasData' : 'none',

	init : function(){
		$('.foursquare-btn').attr('href', "javascript:window.open('" + this.getAuthUrl() + "','Foursquare Checkin','width=500,height=150')");
	},
  setClientID : function(client_id){
    this.CLIENT_ID = client_id;
  }, 
  
	getAuthUrl : function(){
		return 'https://foursquare.com/oauth2/authenticate?client_id=' + this.CLIENT_ID + '&response_type=token&redirect_uri=' + this.REDIRECT_URI;
	},
	setPhoto : function(canvasData){
		this.canvasData = canvasData;
	},
	checkin : function(venueId, shout, broadcast){
  		uri = window.location.href;
  		search = '#access_token=';
  		start = uri.indexOf(search);
  		access_token = false;
    	if (start > 0) {
        	start = start + search.length
        	access_token = uri.slice(start);
    	}
    	if(access_token){
    		var parent = this;
        	$.ajax({
            	url:'https://api.foursquare.com/v2/checkins/add',
            	data: {oauth_token:access_token,
            		   v : '20131016',
            		   venueId : venueId,
            		   shout : shout,
            		   broadcast : broadcast

            	},
            	type : 'post',
            	success:function(data){
              		parent.postImagetoFoursquare(data.response.checkin.id);
            	},
            		error: function(jqXHR, textStatus, errorThrown){
                	console.error(errorThrown);
            	}
        	});
    	}

  	},

	addPhoto : function(checkinId){

    	$.ajax({
        	url:'https://api.foursquare.com/v2/photos/add',
        	data: {oauth_token:access_token,
        		   'v' : '20131016',
        		   'checkinId' : checkinId,
        		   'postText' : 'Bag O Shrimp',
        		   'public' : 1,
        		   'photo' : window.localStorage.getItem('canvasData'),
        		   'broadcast' : 'facebook'

        	},
        	type : 'post',
        	success:function(data){
          		console.log(data.response);
        	},
        		error: function(jqXHR, textStatus, errorThrown){
            	console.error(errorThrown);
        	}
    	});
	},
	
	postImagetoFoursquare : function ( checkinId)
	{

		if ( XMLHttpRequest.prototype.sendAsBinary === undefined ) {
 			   XMLHttpRequest.prototype.sendAsBinary = function(string) {
        var bytes = Array.prototype.map.call(string, function(c) {
            return c.charCodeAt(0) & 0xff;
 	       });
  		      this.send(new Uint8Array(bytes).buffer);
 		   };
		};
		var xhr = new XMLHttpRequest();
		var canvasData = window.localStorage.getItem('canvasData');
		 var encodedPng = canvasData.substring(canvasData.indexOf(',') + 1, canvasData.length);
  		var imageData = this.Base64Binary.decode(encodedPng);
		var mimeType = "image/jpeg";
			uri = window.location.href;
		search = '#access_token=';
		start = uri.indexOf(search);
		access_token = false;
		if (start > 0) {
    		start = start + search.length
    		access_token = uri.slice(start);
		}
	var blob = this.dataURItoBlob(canvasData);


		formData = new FormData();
		formData.append('photo', blob);
		formData.append('checkinId', checkinId);
		formData.append('public', '1');
		formData.append('postText', 'Awesome Food');
		formData.append('broadcast', 'facebook');
    

    // xhr.open( 'POST', 'https://api.foursquare.com/v2/photos/add?oauth_token=' + access_token + '&v=20131016' , false );
    // xhr.onload = xhr.onerror = function() {
    //     console.log( this.xhr.responseText );
    // };
    // xhr.setRequestHeader( "Content-Type", "multipart/form-data; ");
    // xhr.send( formData );

    $.ajax({
	  url: 'https://api.foursquare.com/v2/photos/add?oauth_token=' + access_token + '&v=20131016',
	  type: "POST",
	  data: formData,
	  mimeType : 'image/jpeg',
	  crossDomain : true,
	  processData: false,  // tell jQuery not to process the data
	  contentType: false   // tell jQuery not to set contentType
	});
},
dataURItoBlob : function(dataURI) {
       var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
},	

Base64Binary : {
  _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
  /* will return a  Uint8Array type */
  decodeArrayBuffer: function(input) {
    var bytes = (input.length/4) * 3;
    var ab = new ArrayBuffer(bytes);
    this.decode(input, ab);
 
    return ab;
  },
 
  decode: function(input, arrayBuffer) {
    //get last chars to see if are valid
    var lkey1 = this._keyStr.indexOf(input.charAt(input.length-1));
    var lkey2 = this._keyStr.indexOf(input.charAt(input.length-2));
 
    var bytes = (input.length/4) * 3;
    if (lkey1 == 64) bytes--; //padding chars, so skip
    if (lkey2 == 64) bytes--; //padding chars, so skip
 
    var uarray;
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    var j = 0;
 
    if (arrayBuffer)
      uarray = new Uint8Array(arrayBuffer);
    else
      uarray = new Uint8Array(bytes);
 
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
    for (i=0; i<bytes; i+=3) {
      //get the 3 octects in 4 ascii chars
      enc1 = this._keyStr.indexOf(input.charAt(j++));
      enc2 = this._keyStr.indexOf(input.charAt(j++));
      enc3 = this._keyStr.indexOf(input.charAt(j++));
      enc4 = this._keyStr.indexOf(input.charAt(j++));
 
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
 
      uarray[i] = chr1;
      if (enc3 != 64) uarray[i+1] = chr2;
      if (enc4 != 64) uarray[i+2] = chr3;
    }
 
    return uarray;
  }
}

}