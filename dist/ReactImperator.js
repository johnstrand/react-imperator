(function t(e,n){if(typeof exports==="object"&&typeof module==="object")module.exports=n(require("react"));else if(typeof define==="function"&&define.amd)define("ReactImperator",["react"],n);else if(typeof exports==="object")exports["ReactImperator"]=n(require("react"));else e["ReactImperator"]=n(e["React"])})(window,function(t){return function(t){var e={};function n(r){if(e[r]){return e[r].exports}var o=e[r]={i:r,l:false,exports:{}};t[r].call(o.exports,o,o.exports,n);o.l=true;return o.exports}n.m=t;n.c=e;n.d=function(t,e,r){if(!n.o(t,e)){Object.defineProperty(t,e,{enumerable:true,get:r})}};n.r=function(t){if(typeof Symbol!=="undefined"&&Symbol.toStringTag){Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}Object.defineProperty(t,"__esModule",{value:true})};n.t=function(t,e){if(e&1)t=n(t);if(e&8)return t;if(e&4&&typeof t==="object"&&t&&t.__esModule)return t;var r=Object.create(null);n.r(r);Object.defineProperty(r,"default",{enumerable:true,value:t});if(e&2&&typeof t!="string")for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r};n.n=function(t){var e=t&&t.__esModule?function e(){return t["default"]}:function e(){return t};n.d(e,"a",e);return e};n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)};n.p="";return n(n.s=1)}([function(e,n){e.exports=t},function(t,e,n){"use strict";n.r(e);var r=n(0);var o=function(){return Math.random().toString(36).substring(7)};var u=function(t){var e=t.reduce(function(t,e){t[e]=true;return t},{});return Object.keys(e)};var i=function(t,e){var n=e.reduce(function(t,e){t[e]=true;return t},{});return t.filter(function(t){return!n[t]})};n.d(e,"update",function(){return p});n.d(e,"connect",function(){return s});var c=undefined&&undefined.__extends||function(){var t=function(e,n){t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)if(e.hasOwnProperty(n))t[n]=e[n]};return t(e,n)};return function(e,n){t(e,n);function r(){this.constructor=e}e.prototype=n===null?Object.create(n):(r.prototype=n.prototype,new r)}}();var f=undefined&&undefined.__assign||function(){f=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++){e=arguments[n];for(var o in e)if(Object.prototype.hasOwnProperty.call(e,o))t[o]=e[o]}return t};return f.apply(this,arguments)};var a;var p=(a=function(){var t={};var e={};var n=function(e,n,r){if(!t[e]){t[e]={}}t[e][n]=r};var a=function(e){Object.keys(t).forEach(function(n){return delete t[n][e]})};var s=function(e,n){Object.keys(t[e]).forEach(function(r){var o=t[e][r];if(!o){return}o(n)})};return{update:function(n,r){if(!t[n]){return}var o=r(e[n]);e[n]=o;s(n,o)},connect:function(t,s,l){var d=function(t,e){var n=Object.keys(t);var r=s||[];i(u(n.concat(r)),l||[]).forEach(e)};return function(u){c(i,u);function i(t){var r=u.call(this,t)||this;r.name=o();d(t,function(o){n(o,r.name,function(t){var e;if(!o){return}var n=(e={},e[o]=t,e);r.setState(function(t){return f({},t,n)})});if(t[o]&&!e[o]){var u=t[o];e[o]=u}});return r}i.prototype.render=function(){return r["createElement"](t,f({},this.state))};i.prototype.componentWillMount=function(){d(this.props,function(t){p(t,function(t){return t})})};i.prototype.componentWillReceiveProps=function(t){this.setState(t)};i.prototype.componentWillUnmount=function(){a(this.name)};return i}(r["Component"])}}}(),a.update),s=a.connect}])});