(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{604:function(t,e,r){r(12);var o=r(33),n=r(36);function l(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,r)}return e}t.exports={functional:!0,render:function(t,e){var r=e._c,data=(e._v,e.data),c=e.children,d=void 0===c?[]:c,f=data.class,v=data.staticClass,style=data.style,_=data.staticStyle,m=data.attrs,h=void 0===m?{}:m,y=n(data,["class","staticClass","style","staticStyle","attrs"]);return r("svg",function(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?l(Object(source),!0).forEach((function(e){o(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):l(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}({class:[f,v],style:[style,_],attrs:Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 11 10"},h)},y),d.concat([r("path",{attrs:{d:"M10.29 4.35L8.17 6.42l.5 2.92a.56.56 0 0 1-.82.6L5.23 8.56 2.6 9.94a.56.56 0 0 1-.8-.6l.5-2.92L.16 4.35a.56.56 0 0 1 .31-.95l2.93-.43L4.73.31a.56.56 0 0 1 1 0l1.31 2.66 2.94.43c.2.03.38.18.45.38s.01.42-.14.57z"}})]))}}},605:function(t,e,r){"use strict";r.r(e);r(48),r(62),r(81);var o=r(0).default.extend({props:{category:{type:Object},isNotClickable:Boolean,isReset:{type:Boolean,default:function(){return!1}}},computed:{templateUrl:function(){var t,e=this.$route.params,r=e.projectId,o=e.tagId!=this.category.name?"/tag/".concat(null===(t=this.category.name)||void 0===t?void 0:t.replace(" ","-").toLowerCase()):"";return r?this.isReset?"/projects/templates":"/projects/templates".concat(o):this.isReset?"/templates":"/templates".concat(o)},isActive:function(){var t,e=this.$route.params.tagId;return!(e||!this.isReset)||(null===(t=this.category.name)||void 0===t?void 0:t.replace(" ","-").toLowerCase())==e}}}),n=(r(645),r(2)),component=Object(n.a)(o,(function(){var t=this.$createElement;return(this._self._c||t)("nuxt-link",{staticClass:"category",class:{category_active:this.isActive,"category_not-clickable":this.isNotClickable},attrs:{to:this.templateUrl}},[this._v("\n  "+this._s(this.category.name)+"\n")])}),[],!1,null,"4b67b9b8",null);e.default=component.exports},613:function(t,e,r){"use strict";r.r(e);r(12);var o=r(6),n=r(0),l=r(15),c=r(605),d=r(647),f=r.n(d),v=r(604),_=r.n(v),m=r(50),h=r(632);function y(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,r)}return e}function w(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?y(Object(source),!0).forEach((function(e){Object(o.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):y(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}var j=n.default.extend({components:{Category:c.default,ShoppingCartIcon:f.a,FilledStarIcon:_.a},props:{template:{type:Object},categories:{type:Array,default:[]}},data:function(){return{FileType:m.f}},methods:{getTemplateImageUrl:h.a,startEdit:function(t){if(t.preventDefault(),t.stopPropagation(),this.isUserLoggedIn){var e=this.$store,r=(e.commit,e.dispatch);this.projectId>0?r("project/createPage",{projectId:this.projectId,templateId:this.templateId}):r("project/createProject",{templateId:this.templateId})}else this.$router.push({path:"/login",query:{redirectUrl:this.$route.fullPath}})},goToTemplateDetails:function(t){t.preventDefault(),t.stopPropagation(),this.$router.push(this.templateUrl)}},computed:w(w({},Object(l.c)({user:function(t){return t.auth.user},isUserLoggedIn:function(t){return t.auth.isUserLoggedIn}})),{},{templateId:function(){return+this.template.id},projectId:function(){return+(this.$route.params.projectId||0)},projectPreview:function(){return this.getTemplateImageUrl(this.template,m.f.TemplatePreview)},templateUrl:function(){var t=this.$route.params.projectId,e="/templates/".concat(this.template.id);return t&&(e="/projects/".concat(t).concat(e)),e},isShowStarter:function(){var t;return this.user?(null===(t=this.user.plan)||void 0===t?void 0:t.category)==m.h.Starter:this.template.planName===m.h.Starter.toLowerCase()},isShowPro:function(){var t;return this.user?(null===(t=this.user.plan)||void 0===t?void 0:t.category)==m.h.Pro:this.template.planName===m.h.Pro.toLowerCase()},isShowFree:function(){var t;return this.user?(null===(t=this.user.plan)||void 0===t?void 0:t.category)===m.h.Free:this.template.planName===m.h.Free},isTemplateAvailable:function(){return!0},dominantColor:function(){return this.template.files[0].dominantColor?this.template.files[0].dominantColor:"linear-gradient(90deg, #fdfbfb 0%, #ebedee 100%)"}})}),x=(r(648),r(2)),component=Object(x.a)(j,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"template"},[r("a",{staticClass:"template__poster-wrapper",attrs:{href:t.templateUrl}},[r("div",{staticClass:"template__poster-wrapper-img",style:"background: "+t.dominantColor+";"},[t.projectPreview?r("picture",[t.projectPreview.fullPathWebP?r("source",{attrs:{type:"image/webp",srcset:t.projectPreview.fullPathWebP.replace(" ","%20")}}):t._e(),t._v(" "),t.projectPreview.fullPathJp2?r("source",{attrs:{type:"image/jp2",srcset:t.projectPreview.fullPathJp2.replace(" ","%20")}}):t._e(),t._v(" "),t.projectPreview.fullPath?r("img",{staticClass:"template__poster",attrs:{src:t.projectPreview.fullPath,alt:t.template.name}}):t._e()]):t._e(),t._v(" "),r("div",{staticClass:"template__btn"},[t._m(0),t._v(" "),r("button",{staticClass:"template__btn-edit",on:{click:function(e){return t.startEdit(e)}}},[r("img",{staticClass:"template__btn-edit__plain",attrs:{src:"/img/templates/icons/pencil.svg"}}),t._v(" "),r("img",{staticClass:"template__btn-edit__hover",attrs:{src:"/img/templates/icons/pencil-white.svg"}})])]),t._v(" "),t.isShowStarter?r("div",{staticClass:"template__label template__label_starter"},[r("span",[t._v("Starter")])]):t.isShowPro?r("div",{staticClass:"template__label template__label_pro"},[r("filled-star-icon"),t._v(" "),r("span",[t._v("Pro")])],1):r("div",{staticClass:"template__label template__label_free"},[r("span",[t._v("Free")])])])]),t._v(" "),r("div",{staticClass:"template__footer"},[r("a",{staticClass:"template__name",attrs:{href:t.templateUrl}},[t._v(t._s(t.template.name))]),t._v(" "),r("div",{staticClass:"template__categories-wrapper"},t._l(t.template.categories,(function(t){return r("category",{key:t.id,staticClass:"template__category",attrs:{category:t,theme:"brown"}})})),1)])])}),[function(){var t=this.$createElement,e=this._self._c||t;return e("button",{staticClass:"template__btn-view"},[e("img",{staticClass:"template__btn-view__plain",attrs:{src:"/img/templates/icons/eye.svg"}}),this._v(" "),e("img",{staticClass:"template__btn-view__hover",attrs:{src:"/img/templates/icons/eye-white.svg"}})])}],!1,null,"6760db95",null);e.default=component.exports;installComponents(component,{Button:r(219).default,Category:r(605).default})},623:function(t,e,r){var content=r(646);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(9).default)("e81a6fc4",content,!0,{sourceMap:!1})},624:function(t,e,r){var content=r(649);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(9).default)("62820b70",content,!0,{sourceMap:!1})},632:function(t,e,r){"use strict";r.d(e,"a",(function(){return o}));r(84);function o(template,t){return template.files.find((function(e){return e.type==t}))}},645:function(t,e,r){"use strict";r(623)},646:function(t,e,r){(e=r(8)(!1)).push([t.i,".category[data-v-4b67b9b8]{font-weight:500;font-size:13px;line-height:20px;text-transform:lowercase;color:#000;border:1px solid #dadada;border-radius:4px;padding:8px 10px;transition:.3s;cursor:pointer;text-decoration:none}.category[data-v-4b67b9b8]:first-letter{text-transform:uppercase}.category[data-v-4b67b9b8]:hover,.category_active[data-v-4b67b9b8]{color:#fff;background-color:#000}.category[data-v-4b67b9b8]:hover:hover,.category_active[data-v-4b67b9b8]:hover{background-color:#000;border-color:#000}.category_active[data-v-4b67b9b8]{border-color:#000!important;background-color:#000!important}.category_active[data-v-4b67b9b8]:hover{opacity:.8!important}.category_not-clickable[data-v-4b67b9b8]{cursor:default}.category_not-clickable[data-v-4b67b9b8]:hover{background-color:#f3f3f3}@media screen and (max-width:414px){.category[data-v-4b67b9b8]{font-weight:400;font-size:12px;line-height:18px}}",""]),t.exports=e},647:function(t,e,r){r(12);var o=r(33),n=r(36);function l(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,r)}return e}t.exports={functional:!0,render:function(t,e){var r=e._c,data=(e._v,e.data),c=e.children,d=void 0===c?[]:c,f=data.class,v=data.staticClass,style=data.style,_=data.staticStyle,m=data.attrs,h=void 0===m?{}:m,y=n(data,["class","staticClass","style","staticStyle","attrs"]);return r("svg",function(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?l(Object(source),!0).forEach((function(e){o(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):l(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}({class:[f,v],style:[style,_],attrs:Object.assign({width:"12",height:"12",viewBox:"0 0 12 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},h)},y),d.concat([r("path",{attrs:{d:"M11.8724 3.55656C11.9783 3.68894 12.018 3.8478 11.9916 4.03314L11.4885 6.91914C11.4709 7.06922 11.4024 7.19274 11.2833 7.28982C11.1642 7.3869 11.0296 7.43544 10.8796 7.43544H3.54545L3.39983 8.25623H10.3898C10.5574 8.25623 10.703 8.3158 10.8266 8.43494C10.9502 8.55409 11.0119 8.70192 11.0119 8.87843C11.0119 9.05494 10.9502 9.20277 10.8266 9.32192C10.703 9.44107 10.5574 9.50064 10.3898 9.50064H2.65848C2.47314 9.50064 2.31428 9.42562 2.18189 9.27565C2.05834 9.12557 2.00979 8.95345 2.03627 8.75935L2.36723 6.95892L1.86417 1.90179L0.434419 1.45169C0.266732 1.39873 0.14538 1.29722 0.0703619 1.1472C-0.00465594 0.997144 -0.0201008 0.838305 0.0240274 0.670618C0.0769811 0.502931 0.180682 0.381578 0.335131 0.30656C0.489579 0.231542 0.646234 0.216098 0.805096 0.260226L2.632 0.842717C2.74673 0.87802 2.84161 0.944212 2.91663 1.04129C2.99165 1.13838 3.03798 1.24872 3.05563 1.37228L3.16154 2.3784L11.4488 3.30509C11.6341 3.3315 11.7754 3.41535 11.8724 3.55656ZM3.59843 9.84484C3.8632 9.84484 4.08825 9.93751 4.27359 10.1229C4.45893 10.3082 4.5516 10.5333 4.5516 10.798C4.5516 11.0628 4.45893 11.2901 4.27359 11.4798C4.08825 11.6696 3.8632 11.7645 3.59843 11.7645C3.33366 11.7645 3.10861 11.6696 2.92327 11.4798C2.73793 11.2901 2.64526 11.0628 2.64526 10.798C2.64526 10.5333 2.73793 10.3082 2.92327 10.1229C3.10859 9.93751 3.33364 9.84484 3.59843 9.84484ZM9.25122 9.84484C9.51595 9.84484 9.74107 9.93751 9.92641 10.1229C10.1117 10.3082 10.2044 10.5333 10.2044 10.798C10.2044 11.0628 10.1117 11.2901 9.92641 11.4798C9.74107 11.6696 9.51595 11.7645 9.25122 11.7645C8.98645 11.7645 8.76136 11.6696 8.57608 11.4798C8.39075 11.2901 8.29801 11.0628 8.29801 10.798C8.29801 10.5333 8.3907 10.3082 8.57608 10.1229C8.7614 9.93751 8.98645 9.84484 9.25122 9.84484Z",fill:"white"}})]))}}},648:function(t,e,r){"use strict";r(624)},649:function(t,e,r){(e=r(8)(!1)).push([t.i,'.template *[data-v-6760db95]{box-sizing:border-box}.template__poster-wrapper:hover .template__btn[data-v-6760db95]{display:flex}.template__poster-wrapper:hover~.template__footer>.template__name[data-v-6760db95]{color:#173bef;border-bottom:1px solid #173bef}.template__poster-wrapper-img[data-v-6760db95]{position:relative;border-radius:16px;padding:7% 6% 71.48%}.template__poster[data-v-6760db95]{width:88%;height:86%;border-radius:16px;-o-object-fit:cover;object-fit:cover;-o-object-position:center;object-position:center;background-color:#fff;position:absolute;left:6%;top:7%}.template__btn[data-v-6760db95]{position:absolute;flex-direction:row;top:50%;left:50%;margin-right:-50%;transform:translate(-50%,-50%);grid-gap:16px;gap:16px}.template__btn[data-v-6760db95],.template__btn button[data-v-6760db95]{display:flex;justify-content:center;align-items:center}.template__btn button[data-v-6760db95]{width:60px;height:60px;background:#fff;box-shadow:0 3px 6px rgba(0,0,0,.2);border-radius:60px}.template__btn button img[data-v-6760db95]{width:32x;height:32px}.template__btn-view__hover[data-v-6760db95]{display:none}.template__btn-view[data-v-6760db95]:hover{background-color:#000}.template__btn-view:hover .template__btn-view__hover[data-v-6760db95]{display:block}.template__btn-edit__hover[data-v-6760db95],.template__btn-view:hover .template__btn-view__plain[data-v-6760db95]{display:none}.template__btn-edit[data-v-6760db95]:hover{background-color:#000}.template__btn-edit:hover .template__btn-edit__hover[data-v-6760db95]{display:block}.template__btn-edit:hover .template__btn-edit__plain[data-v-6760db95]{display:none}.template__label[data-v-6760db95]{position:absolute;top:8%;right:8%;display:inline-flex;align-items:center;border-radius:4px;padding:4px 8px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:10}.template__label span[data-v-6760db95]{font-weight:500;font-size:13px;line-height:20px}.template__label_starter[data-v-6760db95]{background-color:#173bef}.template__label_starter span[data-v-6760db95]{color:#fff}.template__label_free[data-v-6760db95]{background-color:#949cad}.template__label_free span[data-v-6760db95]{color:#fff}.template__label_pro[data-v-6760db95]{background-color:#000}.template__label_pro span[data-v-6760db95]{color:#ffc557}.template__category[data-v-6760db95]{margin-left:8px}.template__footer[data-v-6760db95]{display:flex;flex-wrap:wrap;flex-direction:row;justify-content:space-between;margin-top:16px}.template__name[data-v-6760db95]{font-family:"Poppins";font-weight:400;text-decoration:none;outline:none;font-size:16px;line-height:24px;color:#000;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;max-width:90%;border-bottom:1px solid transparent}.template__name[data-v-6760db95]:hover{color:#173bef;border-bottom:1px solid #173bef}',""]),t.exports=e},663:function(t,e,r){"use strict";var o={props:{isVisible:Boolean},created:function(){document.addEventListener("keyup",this.closeModal)},beforeDestroy:function(){document.removeEventListener("keyup",this.closeModal)},methods:{closeModal:function(t){if(t&&(t.preventDefault(),t.key)){if("Escape"!==t.key)return;this.$store.dispatch("ui/closeModal")}this.$store.dispatch("ui/closeModal")}}},n=(r(913),r(2)),component=Object(n.a)(o,(function(){var t=this.$createElement;return(this._self._c||t)("div",{staticClass:"overlay",class:{overlay_visible:this.isVisible},on:{click:this.closeModal}})}),[],!1,null,"f9e3252a",null);e.a=component.exports},719:function(t,e,r){var content=r(914);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(9).default)("a722795a",content,!0,{sourceMap:!1})},913:function(t,e,r){"use strict";r(719)},914:function(t,e,r){(e=r(8)(!1)).push([t.i,".overlay[data-v-f9e3252a]{position:fixed;top:0;right:0;bottom:0;left:0;z-index:998;width:100%;height:100%;background-color:rgba(0,0,0,.3);opacity:0;visibility:hidden;transition:.3s}.overlay_visible[data-v-f9e3252a]{opacity:1;visibility:visible}",""]),t.exports=e}}]);