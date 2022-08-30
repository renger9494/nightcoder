/*! For license information please see LICENSES */
(window.webpackJsonp=window.webpackJsonp||[]).push([[20],{1164:function(t,o,e){"use strict";e.r(o);var n=e(0),c=e(688),r=e(830),l=e(689),d=e(831),f=n.default.extend({head:function(){return{title:"Pricing"}},layout:"pricing",components:{PlansSection:c.default,CouponsSection:r.default,FaqSection:l.default,AffiliateSection:d.default}}),_=(e(897),e(2)),component=Object(_.a)(f,(function(){var t=this.$createElement,o=this._self._c||t;return o("div",{staticClass:"pricing-component"},[o("plans-section"),this._v(" "),o("coupons-section"),this._v(" "),o("faq-section",{attrs:{id:"faq"}}),this._v(" "),o("affiliate-section")],1)}),[],!1,null,"88c89c70",null);o.default=component.exports;installComponents(component,{PlansSection:e(688).default,CouponsSection:e(830).default,FaqSection:e(689).default,AffiliateSection:e(831).default})},655:function(t,o,e){e(12);var n=e(33),c=e(36);function r(object,t){var o=Object.keys(object);if(Object.getOwnPropertySymbols){var e=Object.getOwnPropertySymbols(object);t&&(e=e.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),o.push.apply(o,e)}return o}t.exports={functional:!0,render:function(t,o){var e=o._c,data=(o._v,o.data),l=o.children,d=void 0===l?[]:l,f=data.class,_=data.staticClass,style=data.style,h=data.staticStyle,m=data.attrs,v=void 0===m?{}:m,x=c(data,["class","staticClass","style","staticStyle","attrs"]);return e("svg",function(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?r(Object(source),!0).forEach((function(o){n(t,o,source[o])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):r(Object(source)).forEach((function(o){Object.defineProperty(t,o,Object.getOwnPropertyDescriptor(source,o))}))}return t}({class:[f,_],style:[style,h],attrs:Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 48 38"},v)},x),d.concat([e("path",{attrs:{d:"M6.5 3.9l-.1-1-.12-.99h.09a16.01 16.01 0 0 1 1.08-.08l.1 2a25.51 25.51 0 0 0-.99.07H6.5zm8.65.23c-.76-.1-1.49-.17-2.17-.22l.15-2c.71.06 1.47.13 2.26.23l-.24 1.99zm7.43 1.57c-.7-.22-1.4-.41-2.09-.59l.49-1.94c.72.18 1.45.39 2.19.61l-.59 1.92zm6.97 2.94c-.64-.36-1.28-.69-1.92-1l.86-1.8c.68.32 1.36.67 2.03 1.05l-.97 1.75zm5.3 3.69l-.83-.7 1.26-1.55a32.61 32.61 0 0 1 1.69 1.46L35.61 13c-.24-.23-.5-.46-.76-.68zm5.32 6.07c-.36-.55-.75-1.1-1.16-1.65l1.6-1.2c.44.58.85 1.17 1.24 1.76l-1.68 1.1zm3.16 6.35a32.1 32.1 0 0 0-.75-1.89l1.83-.8c.3.68.56 1.34.8 2l-1.88.69zm1.72 6.9c-.1-.63-.2-1.3-.35-2l1.96-.4c.15.74.27 1.45.37 2.12l-1.98.28zm.31 5.8l.03-.73 2 .03a21.64 21.64 0 0 1-.04 1.03v.08l-1-.08-1-.1v-.04l.01-.19z"}}),e("path",{attrs:{d:"M.7 4.36a1 1 0 0 1-.17-1.84L4.98.12A1 1 0 0 1 6.45.9l.38 3.9a1 1 0 0 1-1.3 1.06L.7 4.36z"}})]))}}},677:function(t,o,e){"use strict";function n(){return(n=Object.assign||function(t){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var o in source)Object.prototype.hasOwnProperty.call(source,o)&&(t[o]=source[o])}return t}).apply(this,arguments)}var c=function(){function t(t,o){var e=this,n=void 0!==o?o:{};this.version="3.7.8",this.userAgent=window.navigator.userAgent||"no `userAgent` provided by the browser",this.props={customStickyChangeNumber:n.customStickyChangeNumber||null,noStyles:n.noStyles||!1,stickyBitStickyOffset:n.stickyBitStickyOffset||0,parentClass:n.parentClass||"js-stickybit-parent",scrollEl:"string"==typeof n.scrollEl?document.querySelector(n.scrollEl):n.scrollEl||window,stickyClass:n.stickyClass||"js-is-sticky",stuckClass:n.stuckClass||"js-is-stuck",stickyChangeClass:n.stickyChangeClass||"js-is-sticky--change",useStickyClasses:n.useStickyClasses||!1,useFixed:n.useFixed||!1,useGetBoundingClientRect:n.useGetBoundingClientRect||!1,verticalPosition:n.verticalPosition||"top",applyStyle:n.applyStyle||function(t,style){return e.applyStyle(t,style)}},this.props.positionVal=this.definePosition()||"fixed",this.instances=[];var c=this.props,r=c.positionVal,l=c.verticalPosition,d=c.noStyles,f=c.stickyBitStickyOffset,_="top"!==l||d?"":f+"px",h="fixed"!==r?r:"";this.els="string"==typeof t?document.querySelectorAll(t):t,"length"in this.els||(this.els=[this.els]);for(var i=0;i<this.els.length;i++){var m,v=this.els[i],x=this.addInstance(v,this.props);this.props.applyStyle({styles:(m={},m[l]=_,m.position=h,m),classes:{}},x),this.manageState(x),this.instances.push(x)}}var o=t.prototype;return o.definePosition=function(){var t;if(this.props.useFixed)t="fixed";else{for(var o=["","-o-","-webkit-","-moz-","-ms-"],e=document.head.style,i=0;i<o.length;i+=1)e.position=o[i]+"sticky";t=e.position?e.position:"fixed",e.position=""}return t},o.addInstance=function(t,o){var e=this,n={el:t,parent:t.parentNode,props:o};if("fixed"===o.positionVal||o.useStickyClasses){this.isWin=this.props.scrollEl===window;var c=this.isWin?window:this.getClosestParent(n.el,n.props.scrollEl);this.computeScrollOffsets(n),this.toggleClasses(n.parent,"",o.parentClass),n.state="default",n.stateChange="default",n.stateContainer=function(){return e.manageState(n)},c.addEventListener("scroll",n.stateContainer)}return n},o.getClosestParent=function(t,o){var p=o,e=t;if(e.parentElement===p)return p;for(;e.parentElement!==p;)e=e.parentElement;return p},o.getTopPosition=function(t){if(this.props.useGetBoundingClientRect)return t.getBoundingClientRect().top+(this.props.scrollEl.pageYOffset||document.documentElement.scrollTop);var o=0;do{o=t.offsetTop+o}while(t=t.offsetParent);return o},o.computeScrollOffsets=function(t){var o=t,p=o.props,e=o.el,n=o.parent,c=!this.isWin&&"fixed"===p.positionVal,r="bottom"!==p.verticalPosition,l=c?this.getTopPosition(p.scrollEl):0,d=c?this.getTopPosition(n)-l:this.getTopPosition(n),f=null!==p.customStickyChangeNumber?p.customStickyChangeNumber:e.offsetHeight,_=d+n.offsetHeight;o.offset=c?0:l+p.stickyBitStickyOffset,o.stickyStart=r?d-o.offset:0,o.stickyChange=o.stickyStart+f,o.stickyStop=r?_-(e.offsetHeight+o.offset):_-window.innerHeight},o.toggleClasses=function(t,o,a){var e=t,n=e.className.split(" ");a&&-1===n.indexOf(a)&&n.push(a);var c=n.indexOf(o);-1!==c&&n.splice(c,1),e.className=n.join(" ")},o.manageState=function(t){var o=this,e=t,p=e.props,c=e.state,r=e.stateChange,l=e.stickyStart,d=e.stickyChange,f=e.stickyStop,_=p.positionVal,h=p.scrollEl,m=p.stickyClass,v=p.stickyChangeClass,x=p.stuckClass,y=p.verticalPosition,w="bottom"!==y,C=p.applyStyle,k=p.noStyles,S=function(t){t()},O=this.isWin&&(window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame)||S,P=this.isWin?window.scrollY||window.pageYOffset:h.scrollTop,j=w&&P<=l&&("sticky"===c||"stuck"===c),z=P>=f&&"sticky"===c;P>l&&P<f&&("default"===c||"stuck"===c)?e.state="sticky":j?e.state="default":z&&(e.state="stuck");var E=P>=d&&P<=f;P<d/2||P>f?e.stateChange="default":E&&(e.stateChange="sticky"),c===e.state&&r===e.stateChange||O((function(){var c,r,l,d,f,h,w={sticky:{styles:(c={position:_,top:"",bottom:""},c[y]=p.stickyBitStickyOffset+"px",c),classes:(r={},r[m]=!0,r)},default:{styles:(l={},l[y]="",l),classes:{}},stuck:{styles:n((d={},d[y]="",d),"fixed"===_&&!k||!o.isWin?{position:"absolute",top:"",bottom:"0"}:{}),classes:(f={},f[x]=!0,f)}};"fixed"===_&&(w.default.styles.position="");var style=w[e.state];style.classes=((h={})[x]=!!style.classes[x],h[m]=!!style.classes[m],h[v]=E,h),C(style,t)}))},o.applyStyle=function(t,o){var e=t.styles,n=t.classes,c=o,r=c.el,p=c.props,l=r.style,d=p.noStyles,f=r.className.split(" ");for(var _ in n){if(n[_])-1===f.indexOf(_)&&f.push(_);else{var h=f.indexOf(_);-1!==h&&f.splice(h,1)}}if(r.className=f.join(" "),e.position&&(l.position=e.position),!d)for(var m in e)l[m]=e[m]},o.update=function(t){var o=this;return void 0===t&&(t=null),this.instances.forEach((function(e){if(o.computeScrollOffsets(e),t)for(var n in t)e.props[n]=t[n]})),this},o.removeInstance=function(t){var o,e,n=t.el,p=t.props;this.applyStyle({styles:(o={position:""},o[p.verticalPosition]="",o),classes:(e={},e[p.stickyClass]="",e[p.stuckClass]="",e)},t),this.toggleClasses(n.parentNode,p.parentClass)},o.cleanup=function(){for(var i=0;i<this.instances.length;i+=1){var t=this.instances[i];t.stateContainer&&t.props.scrollEl.removeEventListener("scroll",t.stateContainer),this.removeInstance(t)}this.manageState=!1,this.instances=[]},t}();o.a=function(t,o){return new c(t,o)}},707:function(t,o,e){var content=e(892);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,e(9).default)("9eb7ad6a",content,!0,{sourceMap:!1})},709:function(t,o,e){var content=e(896);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,e(9).default)("5121fdb4",content,!0,{sourceMap:!1})},710:function(t,o,e){var content=e(898);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,e(9).default)("532cc336",content,!0,{sourceMap:!1})},830:function(t,o,e){"use strict";e.r(o);var n=[function(){var t=this,o=t.$createElement,n=t._self._c||o;return n("div",{staticClass:"coupons-section"},[n("h2",{staticClass:"coupons-section__title"},[t._v("Coupons")]),t._v(" "),n("div",{staticClass:"coupons-section__coupons-wrapper"},[n("div",{staticClass:"coupons-section__coupon coupons-section__coupon_comet"},[n("div",{staticClass:"coupons-section__coupon-side coupons-section__coupon-side_image"},[n("img",{staticClass:"coupons-section__coupon-image",attrs:{src:e(703),srcset:e(704)+" 2x",alt:""}}),t._v(" "),n("div",{staticClass:"coupons-section__coupon-dot-line"},[n("span"),t._v(" "),n("span"),t._v(" "),n("span"),t._v(" "),n("span"),t._v(" "),n("span"),t._v(" "),n("span")])]),t._v(" "),n("div",{staticClass:"coupons-section__coupon-side coupons-section__coupon-side_content"},[n("h3",{staticClass:"coupons-section__coupon-name"},[t._v("\n          Get amazing $60 off for PRO if you’re maker!\n        ")]),t._v(" "),n("div",{staticClass:"coupons-section__coupon-footer"},[n("span",{staticClass:"coupons-section__coupon-discount"},[t._v("$88")]),t._v(" "),n("a",{staticClass:"coupons-section__coupon-button",attrs:{href:"#"}},[t._v("Save pass")]),t._v(" "),n("span",{staticClass:"coupons-section__coupon-left-count"},[t._v("\n            Left 50 Coupons\n          ")])])])]),t._v(" "),n("div",{staticClass:"coupons-section__coupon coupons-section__coupon_rock-blue"},[n("div",{staticClass:"coupons-section__coupon-side coupons-section__coupon-side_image"},[n("img",{staticClass:"coupons-section__coupon-image",attrs:{src:e(705),srcset:e(706)+" 2x",alt:""}}),t._v(" "),n("div",{staticClass:"coupons-section__coupon-dot-line"},[n("span"),t._v(" "),n("span"),t._v(" "),n("span"),t._v(" "),n("span"),t._v(" "),n("span"),t._v(" "),n("span")])]),t._v(" "),n("div",{staticClass:"coupons-section__coupon-side coupons-section__coupon-side_content"},[n("h3",{staticClass:"coupons-section__coupon-name"},[t._v("\n          Get 50% off for PRO 10 Plan! Only for users with paid plans.\n        ")]),t._v(" "),n("div",{staticClass:"coupons-section__coupon-footer"},[n("span",{staticClass:"coupons-section__coupon-discount"},[t._v("50%")]),t._v(" "),n("a",{staticClass:"coupons-section__coupon-button",attrs:{href:"#"}},[t._v("Save pass")]),t._v(" "),n("span",{staticClass:"coupons-section__coupon-left-count"},[t._v("\n            Left 50 Coupons\n          ")])])])])]),t._v(" "),n("p",{staticClass:"coupons-section__footer-text"},[t._v("\n    How to activate coupon? "),n("a",{attrs:{href:"#"}},[t._v("Learn More")])])])}],c=e(0).default.extend({}),r=(e(891),e(2)),component=Object(r.a)(c,(function(){var t=this.$createElement;this._self._c;return this._m(0)}),n,!1,null,"62649654",null);o.default=component.exports},831:function(t,o,e){"use strict";e.r(o);var n={},c=(e(895),e(2)),component=Object(c.a)(n,(function(){var t=this.$createElement;this._self._c;return this._m(0)}),[function(){var t=this.$createElement,o=this._self._c||t;return o("div",{staticClass:"affiliate-section"},[o("h2",{staticClass:"affiliate-section__title"},[this._v("\n    Start earning right now, join our affiliate program. "),o("a",{attrs:{href:"#"}},[this._v("\n      Join us.\n    ")])]),this._v(" "),o("p",{staticClass:"affiliate-section__text"},[this._v("\n    Surprise your audience and tell about a new amazing project.\n  ")])])}],!1,null,"2265557e",null);o.default=component.exports},891:function(t,o,e){"use strict";e(707)},892:function(t,o,e){(o=e(8)(!1)).push([t.i,".coupons-section[data-v-62649654]{background-color:#f2f2f2;border-radius:16px;padding-top:40px;padding-bottom:40px;margin-bottom:80px}@media only screen and (max-width:1000px){.coupons-section[data-v-62649654]{margin-bottom:40px}}.coupons-section__title[data-v-62649654]{font-size:20px;font-weight:500;line-height:normal;text-align:center;margin-top:0;margin-bottom:40px}.coupons-section__coupons-wrapper[data-v-62649654]{display:flex;justify-content:center;margin-bottom:40px}@media only screen and (max-width:1000px){.coupons-section__coupons-wrapper[data-v-62649654]{display:block}}.coupons-section__coupon[data-v-62649654]{display:flex;width:370px;background-color:#f2f2f2;border-radius:9px;margin-right:16px}@media only screen and (max-width:1000px){.coupons-section__coupon[data-v-62649654]{margin-right:auto;margin-bottom:16px;margin-left:auto}}@media only screen and (max-width:576px){.coupons-section__coupon[data-v-62649654]{width:260px}}.coupons-section__coupon[data-v-62649654]:last-child{margin-bottom:0}.coupons-section__coupon_comet .coupons-section__coupon-side[data-v-62649654]{background-color:#61657e}.coupons-section__coupon_rock-blue .coupons-section__coupon-side[data-v-62649654]{background-color:#9bb7cb}.coupons-section__coupon-side[data-v-62649654]{position:relative;border-radius:9px;box-shadow:0 10px 20px rgba(9,9,9,.15)}.coupons-section__coupon-side_image[data-v-62649654]{flex-shrink:0;display:flex;justify-content:center;align-items:center;width:80px;padding-top:10px}@media only screen and (max-width:576px){.coupons-section__coupon-side_image[data-v-62649654]{width:52px;height:63px;padding-top:10px;padding-bottom:5px}}@media only screen and (max-width:576px){.coupons-section__coupon-side_image img[data-v-62649654]{max-width:100%;max-height:100%}}.coupons-section__coupon-side_content[data-v-62649654]{flex-grow:1;padding-top:17px;padding-bottom:6px;padding-left:22px}@media only screen and (max-width:576px){.coupons-section__coupon-side_content[data-v-62649654]{padding-top:10px;padding-bottom:6px;padding-left:15px}}.coupons-section__coupon-dot-line[data-v-62649654]{position:absolute;top:10px;right:-3px;bottom:10px;z-index:1;display:flex;flex-direction:column;justify-content:space-between}.coupons-section__coupon-dot-line span[data-v-62649654]{width:6px;height:6px;border-radius:50%;background-color:#f2f2f2}@media only screen and (max-width:576px){.coupons-section__coupon-dot-line span[data-v-62649654]{width:4px;height:4px}}.coupons-section__coupon-name[data-v-62649654]{font-size:12px;font-weight:500;letter-spacing:.03em;line-height:normal;color:#fff;margin-top:0;margin-bottom:18px}@media only screen and (max-width:576px){.coupons-section__coupon-name[data-v-62649654]{max-width:170px;font-size:9px;margin-bottom:6px}}@media only screen and (max-width:576px){.coupons-section__coupon-footer[data-v-62649654]{display:flex;align-items:center}}.coupons-section__coupon-discount[data-v-62649654]{font-size:14px;font-weight:700;letter-spacing:.03em;line-height:normal;color:#fff;margin-right:18px}@media only screen and (max-width:576px){.coupons-section__coupon-discount[data-v-62649654]{font-size:9px;margin-right:13px}}.coupons-section__coupon-button[data-v-62649654]{display:inline-block;vertical-align:top;font-size:10px;font-weight:700;letter-spacing:.03em;text-decoration:none;text-transform:uppercase;color:#fff;background-color:rgba(0,0,0,.2);border-radius:4px;padding:6px 10px;margin-right:14px;transition:.3s}@media only screen and (max-width:576px){.coupons-section__coupon-button[data-v-62649654]{font-size:8px;padding:5px;margin-right:13px}}.coupons-section__coupon-button[data-v-62649654]:hover{background-color:rgba(0,0,0,.5)}.coupons-section__coupon-left-count[data-v-62649654]{font-size:10px;font-weight:400;line-height:normal;color:hsla(0,0%,100%,.8)}@media only screen and (max-width:576px){.coupons-section__coupon-left-count[data-v-62649654]{font-size:6px}}.coupons-section__footer-text[data-v-62649654]{font-size:12px;font-weight:400;line-height:normal;text-align:center;color:#555;margin-top:0;margin-bottom:0}.coupons-section__footer-text a[data-v-62649654]{font-weight:400;text-decoration:none;color:#000}",""]),t.exports=o},895:function(t,o,e){"use strict";e(709)},896:function(t,o,e){(o=e(8)(!1)).push([t.i,".affiliate-section[data-v-2265557e]{text-align:center}@media only screen and (max-width:576px){.affiliate-section[data-v-2265557e]{padding-right:15px;padding-left:15px}}.affiliate-section__title[data-v-2265557e]{font-size:20px;font-weight:400;line-height:28px;margin-top:0;margin-bottom:10px}@media only screen and (max-width:1000px){.affiliate-section__title[data-v-2265557e]{max-width:500px;margin-right:auto;margin-left:auto}}.affiliate-section__title a[data-v-2265557e]{font-weight:400;text-decoration:none;color:#2f80ed}.affiliate-section__text[data-v-2265557e]{font-size:14px;font-weight:400;line-height:normal;margin-top:0;margin-bottom:0}",""]),t.exports=o},897:function(t,o,e){"use strict";e(710)},898:function(t,o,e){(o=e(8)(!1)).push([t.i,"",""]),t.exports=o}}]);