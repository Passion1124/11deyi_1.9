(function(b){var a=b.stm=b.stm||{};a.DefaultContentProtocol={parse:function(e){var d=new a.Response();var c=new DataView(e);d.reqID=c.getUint32(0);d.state=(c.getUint8(4)==0)?a.Response.State.Success:a.Response.State.Failed;d.data=e.slice(5);return d},build:function(c,h,f){c=c||"";if(typeof c!=="string"&&!(c instanceof ArrayBuffer)){return"body type is error, must be string or ArrayBuffer"}h=h||{};if(typeof h!=="object"){return"headers must be a object type, for example {uri: '/location'}"}var g=0;for(var e in h){if(!h.hasOwnProperty(e)){continue}if(typeof e!=="string"||typeof h[e]!=="string"){return"headers' key or property must be string"}if(e.length>255){return"length of headers' key <"+e+"> more than 255"}if(h[e].length>255){return"length of headers' object <"+h[e]+"> more than 255"}if(e.length==0||h[e].length==0){continue}g+=1+1+e.length+h[e].length}c=new StringView(c);var d=new ArrayBuffer(4+c.rawData.byteLength+1+g);(new DataView(d)).setUint32(0,f);var i=4;for(e in h){if(!h.hasOwnProperty(e)){continue}(new DataView(d)).setUint8(i,e.length);i++;(new Uint8Array(d)).set((new StringView(e)).rawData,i);i+=e.length;(new DataView(d)).setUint8(i,h[e].length);i++;(new Uint8Array(d)).set((new StringView(h[e])).rawData,i);i+=h[e].length}(new DataView(d)).setUint8(i,0);i++;(new Uint8Array(d)).set(c.rawData,i);return d},buildFailedMessage:function(d,e){d=new StringView(d);var c=new ArrayBuffer(4+d.rawData.byteLength+1);(new DataView(c)).setUint32(0,e);(new DataView(c)).setUint8(4,a.Response.State.Failed);(new Uint8Array(c)).set(d.rawData,5);return c}}})(this);