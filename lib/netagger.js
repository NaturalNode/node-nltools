var net = require('net');

NETagger = function(options,callback){
	var options = options || {};
	this.client = net.createConnection(options.port || 8000)

	var _self = this;
	this.client.on('connect',function(){
		callback(_self)
	});
}

NETagger.prototype.tag = function(pos,callback) {
	pos.neTagged = true;
	
	var getEntities = function(text,p) {
		for (var i = 0;i < pos.tags.length;i++) {
			var ptag = pos.tags[i].token;

			if ([".","?","+"].inArray(ptag)) continue;

			var re = new RegExp(ptag + "\/([A-Z]*)");
			var res = text.match(re);
			if (res[1] != "O") {
				pos.tags[i].ne = res[1] ;
			}	
		}
		
		callback(pos);
	}
	
	this.client.write(pos.toString() + "\r\n");
	this.client.on('data',function(data){
		var results = getEntities(data.toString(),pos)
	});
	
}

Array.prototype.inArray = function(value) {
	for (var i=0; i < this.length; i++) {
		if (this[i] === value)  return true;
	}
	return false;
};

exports.NETagger = NETagger;