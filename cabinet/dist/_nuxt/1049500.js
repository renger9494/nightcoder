(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{1151:function(e,t,r){"use strict";r.r(t);var o=r(0),n=r(627),c=r(220),l=r.n(c),d=r(603),f=r(83),_=o.default.extend({components:{Avatar:f.default,PreviewImage:n.default,EmptyIcon:l.a,Pagination:d.default},props:{userFullName:{type:String,default:""},projects:Array},methods:{likeProject:function(e,t){e.preventDefault(),e.stopPropagation(),this.$emit("likeProject",t)},avatarName:function(e){return e||"itmeo"}}}),h=(r(877),r(2)),component=Object(h.a)(_,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("ul",{staticClass:"feedProjects__list"},e._l(e.projects,(function(t){return r("li",{key:t.id,staticClass:"feedProjects__project"},[r("a",{staticClass:"feedProjects__linkProject",attrs:{href:t.url}},[r("div",{staticClass:"feedProjects__projectPreview",style:{"background-color":t.preview&&t.preview.dominantColor?t.preview.dominantColor:"#1B53C0"}},[t.preview?r("picture",[t.preview.fullPathWebP?r("source",{attrs:{type:"image/webp",srcset:t.preview.fullPathWebP.replace(" ","%20")}}):e._e(),e._v(" "),t.preview.fullPathJp2?r("source",{attrs:{type:"image/jp2",srcset:t.preview.fullPathJp2.replace(" ","%20")}}):e._e(),e._v(" "),t.preview.fullPath?r("img",{staticClass:"feedProjects__previewImg",attrs:{src:t.preview.fullPath}}):e._e()]):r("img",{staticClass:"feedProjects__previewImg",attrs:{src:"https://s3.amazonaws.com/beta.airtap.co/Images/Projects/placeholder.svg",alt:""}}),e._v(" "),e._m(0,!0),e._v(" "),r("button",{staticClass:"feedProjects__projectLike",on:{click:function(r){return e.likeProject(r,t)}}},[t.hasLike?r("img",{staticClass:"feedProjects__projectLike__image",attrs:{src:"/img/profile/activLikeProject.svg"}}):r("img",{staticClass:"feedProjects__projectLike__image",attrs:{src:"/img/profile/grayLike.svg"}}),e._v(" "),r("img",{staticClass:"feedProjects__projectLike__hover",attrs:{src:"/img/profile/dangerLike.svg"}})])])]),e._v(" "),r("div",{staticClass:"feedProjects__projectDescription"},[r("a",{staticClass:"feedProjects__projectName",attrs:{href:t.url}},[e._v(e._s(t.name))]),e._v(" "),r("div",{staticClass:"feedProjects__likeAndView"},[r("span",[r("button",{on:{click:function(r){return e.likeProject(r,t)}}},[t.hasLike?r("img",{attrs:{src:"/img/profile/activLikeProject.svg"}}):r("img",{attrs:{src:"/img/profile/like.svg"}})]),e._v("\n            "+e._s(t.likes))]),e._v(" "),r("span",{style:{"margin-left":"10px"}},[r("img",{style:{"margin-right":"5px"},attrs:{src:"/img/profile/view.svg"}}),e._v("\n            "+e._s(t.views))])])]),e._v(" "),r("div",{staticClass:"feedProjects__user-info"},[r("a",{staticClass:"feedProjects__avatar",attrs:{href:"/"+t.authorUserName}},[t.authorAvatar?r("picture",[t.authorAvatar.fullPathWebP?r("source",{attrs:{type:"image/webp",project:""}}):e._e(),e._v(" "),t.authorAvatar.fullPathJp2?r("source",{attrs:{type:"image/jp2",srcset:t.authorAvatar.fullPathJp2.replace(" ","%20")}}):e._e(),e._v(" "),t.authorAvatar.fullPath?r("img",{attrs:{src:t.authorAvatar.fullPath}}):e._e()]):r("avatar",{attrs:{size:20,name:e.avatarName(t.authorName)}})],1),e._v(" "),r("p",{staticClass:"feedProjects__userName"},[e._v("\n          by\n          "),r("a",{attrs:{href:"/"+t.authorUserName}},[e._v(e._s(t.authorName))])])])])})),0)])}),[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"feedProjects__projectEye"},[t("img",{staticClass:"feedProjects__projectEye__black",attrs:{src:"/img/profile/eye.svg"}}),this._v(" "),t("img",{staticClass:"feedProjects__projectEye__white",attrs:{src:"/img/profile/eye-white.svg"}})])}],!1,null,"07fc9e64",null);t.default=component.exports;installComponents(component,{Button:r(219).default,Avatar:r(83).default})},1161:function(e,t,r){"use strict";r.r(t);r(125),r(159),r(62),r(81);var o=r(6),n=(r(26),r(7)),c=r(0),l=r(15),d=r(18),f=r(603);function _(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,r)}return t}function h(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?_(Object(source),!0).forEach((function(t){Object(o.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):_(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var v=c.default.extend({layout:"profile",components:{Pagination:f.default},data:function(){return{projectsFirst:[],projectsLast:[],allProjects:!0,latestProjects:!1,filter:{pageNumber:1,totalPages:1}}},asyncData:function(e){return Object(n.a)(regeneratorRuntime.mark((function t(){var r,filter,o,n,c,data;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=e.route,t.prev=1,filter=h({Show:"All",SortBy:"Latest",PageSize:12,PageNumber:1},r.query),o="All"==filter.Show,n="Latest"==filter.SortBy,t.next=7,d.a.feed.feedGetProjects(filter);case 7:return c=t.sent,data=c.data,t.abrupt("return",{projectsFirst:data.items.slice(0,6),projectsLast:data.items.slice(6,12),filter:filter,allProjects:o,latestProjects:n});case 12:t.prev=12,t.t0=t.catch(1),console.log(t.t0);case 15:case"end":return t.stop()}}),t,null,[[1,12]])})))()},computed:h({},Object(l.c)({user:function(e){return e.auth.user},isUserLoggedIn:function(e){return e.auth.isUserLoggedIn},visibleMessageName:function(e){return e.ui.visibleMessageName}})),methods:{likeProject:function(e){this.isUserLoggedIn?this.user.userName&&d.a.profiles.profilesToggleProjectLike(e.id,this.user.userName).then((function(){e.hasLike=!e.hasLike,e.likes=e.likes+(e.hasLike?1:-1)})).catch((function(e){})):this.$router.push({path:"/login",query:{redirectUrl:this.$route.fullPath}})},showAllProjects:function(e){this.allProjects=e,this.changeFilter()},changeFilter:function(){this.filter.PageSize=12,this.filter.PageNumber=1,this.filter.Show=this.allProjects?"All":"Following",this.filter.SortBy=this.latestProjects?"Latest":"MostAppreciated",this.changeRouteQuery(),this.showProjects()},showLatestProjects:function(e){this.latestProjects=e,this.changeFilter()},showProjects:function(){var e=this;d.a.feed.feedGetProjects(this.filter).then((function(t){var data=t.data;e.projectsFirst=data.items.slice(0,6),e.projectsLast=data.items.slice(6,11)})).catch((function(e){}))},loadingList:function(e){this.filter.PageNumber=e,window.scrollTo(0,0),this.changeRouteQuery(),this.showProjects()},changeRouteQuery:function(){this.$router.replace({query:{PageNumber:this.filter.PageNumber,Show:this.filter.Show,SortBy:this.filter.SortBy}})}}}),m=(r(875),r(2)),component=Object(m.a)(v,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("div",{staticClass:"feedProjects content"},[r("p",{staticClass:"feedProjects__header-1"},[e._v("\n      Discover inspiring projects from Airtap community\n    ")]),e._v(" "),e._m(0),e._v(" "),r("div",{staticClass:"feedProjects__filter"},[r("div",{staticClass:"feedProjects__filter-show"},[r("span",{style:{visibility:e.isUserLoggedIn?"visible":"hidden"}},[e._v("Show")]),e._v(" "),r("ul",[r("li",{class:{feedProjects__activeSort:e.allProjects},on:{click:function(t){return e.showAllProjects(!0)}}},[e._v("\n            All projects\n          ")]),e._v(" "),e.isUserLoggedIn?r("li",{class:{feedProjects__activeSort:!e.allProjects},on:{click:function(t){return e.showAllProjects(!1)}}},[e._v("\n            Following\n          ")]):e._e()])]),e._v(" "),r("div",{staticClass:"feedProjects__filter-sort"},[r("span",[e._v("Sort by")]),e._v(" "),r("ul",[r("li",{class:{feedProjects__activeSort:!e.latestProjects},on:{click:function(t){return e.showLatestProjects(!1)}}},[e._v("\n            Most appreciated\n          ")]),e._v(" "),r("li",{class:{feedProjects__activeSort:e.latestProjects},on:{click:function(t){return e.showLatestProjects(!0)}}},[e._v("\n            Latest\n          ")])])])]),e._v(" "),r("div",{staticClass:"feedProjects__component"},[r("FeedProjects",{attrs:{projects:e.projectsFirst},on:{likeProject:e.likeProject}}),e._v(" "),r("div",{staticClass:"feedProjects__banner"},[r("div",[r("p",{staticClass:"feedProjects__banner__header"},[e._v("\n            Start to create beautiful projects with our easy-to use builder\n          ")]),e._v(" "),r("p",{staticClass:"feedProjects__banner__text"},[e._v("\n            Simple tools for your big ideas. Start your free website trial\n            today, no credit card required.\n          ")]),e._v(" "),r("div",{staticClass:"feedProjects__banner__interactive"},[r("a",{staticClass:"feedProjects__banner__buttom",attrs:{href:"/projects"}},[e._v("Create website")]),e._v(" "),e.isUserLoggedIn?e._e():r("span",[e._v("\n              or\n              "),r("a",{staticClass:"feedProjects__banner__link",attrs:{href:"/login"}},[e._v("Log in ")]),e._v("\n              into account")])])]),e._v(" "),e._m(1)]),e._v(" "),r("FeedProjects",{attrs:{projects:e.projectsLast},on:{likeProject:e.likeProject}}),e._v(" "),e.filter.totalPages>1?r("pagination",{attrs:{pageNumber:e.filter.pageNumber,totalPages:e.filter.totalPages},on:{loadingList:e.loadingList}}):e._e()],1)]),e._v(" "),r("div",{staticClass:"feedProjects__banner-2"},[r("img",{attrs:{src:"/img/profile/abstract_fluid_background.svg"}}),e._v(" "),r("div",{staticClass:"feedProjects__banner-2__content"},[r("p",{staticClass:"feedProjects__banner-2__header"},[e._v("\n        Showcase your website and get tons of followers and work offers\n      ")]),e._v(" "),r("p",{staticClass:"feedProjects__banner-2__text"},[e._v("\n        Instead of spending your coffee break scrolling through your social\n        feeds, how about a lovely little website instead?\n      ")]),e._v(" "),r("div",{staticClass:"feedProjects__banner-2__interactive"},[r("a",{staticClass:"feedProjects__banner-2__buttom",attrs:{href:"/projects"}},[e._v("Create website")]),e._v(" "),e.isUserLoggedIn?e._e():r("span",[e._v("\n          or\n          "),r("a",{staticClass:"feedProjects__banner-2__link",attrs:{href:"/login"}},[e._v("Log in ")]),e._v("\n          into account")])])])])])}),[function(){var e=this.$createElement,t=this._self._c||e;return t("p",{staticClass:"feedProjects__header-2"},[this._v("\n      Here you can find, follow and like the most inspiring websites. Or\n      "),t("a",{attrs:{href:"/projects"}},[this._v("create your own website now.")])])},function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("ul",[r("li",{staticClass:"feedProjects__banner__li-text"},[r("span",{staticClass:"feedProjects__banner__li-number"},[e._v(" 01")]),e._v("Design\n              website like in your favorite tools, Figma, Sketch, Adobe XD.\n            ")]),e._v(" "),r("li",{staticClass:"feedProjects__banner__li-text"},[r("span",{staticClass:"feedProjects__banner__li-number"},[e._v("02")]),e._v("\n              Use elements and just drag them from one section to another.\n            ")]),e._v(" "),r("li",{staticClass:"feedProjects__banner__li-text"},[r("span",{staticClass:"feedProjects__banner__li-number"},[e._v("03")]),e._v("Adjust\n              your color pallete to website with great color settings.\n            ")])]),e._v(" "),r("p",{staticClass:"feedProjects__banner__text"},[e._v("\n            and much more...\n            "),r("a",{staticClass:"feedProjects__banner__link",attrs:{href:"/pricing"}},[e._v("Explore all Airtap features.")])])])}],!1,null,"22a40c22",null);t.default=component.exports;installComponents(component,{FeedProjects:r(1151).default,Pagination:r(603).default})},603:function(e,t,r){"use strict";r.r(t);r(124);var o=r(0).default.extend({props:{pageNumber:Number,totalPages:Number},methods:{anyPage:function(p){p>0&&p<=this.totalPages&&this.$emit("loadingList",p)}}}),n=(r(635),r(2)),component=Object(n.a)(o,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("ul",{staticClass:"pagination"},[r("li",[r("a",{staticClass:"imgStyle imgLeftStyle",class:{imgLeftStyleBlack:e.pageNumber>1},on:{click:function(t){return e.anyPage(e.pageNumber-1)}}})]),e._v(" "),r("li",[r("a",{staticClass:"pageStyle",class:{current:1==e.pageNumber},on:{click:function(t){return e.anyPage(1)}}},[e._v("1")])]),e._v(" "),e.pageNumber>3&&e.totalPages>4?r("li",[r("span",{staticClass:"pageStyle"},[e._v("...")])]):e._e(),e._v(" "),e._l(e.totalPages,(function(p){return r("li",{key:p},[1!=p&&p!=e.totalPages&&(Math.abs(p-e.pageNumber)<2||e.pageNumber<2&&p<4||e.pageNumber>=e.totalPages-1&&p>=e.totalPages-2)?r("a",{staticClass:"pageStyle",class:{current:p==e.pageNumber},on:{click:function(t){return e.anyPage(p)}}},[e._v("\n      "+e._s(p)+"\n    ")]):e._e()])})),e._v(" "),e.pageNumber<e.totalPages-2&&e.totalPages>4?r("li",[r("span",{staticClass:"pageStyle"},[e._v("...")])]):e._e(),e._v(" "),e.totalPages>1?r("li",[r("a",{staticClass:"pageStyle",class:{current:e.pageNumber==e.totalPages},on:{click:function(t){return e.anyPage(e.totalPages)}}},[e._v(e._s(e.totalPages))])]):e._e(),e._v(" "),r("li",[r("a",{staticClass:"imgStyle imgRightStyle",class:{imgRightStyleBlack:e.pageNumber<e.totalPages},on:{click:function(t){return e.anyPage(e.pageNumber+1)}}})])],2)}),[],!1,null,"64599cc4",null);t.default=component.exports},619:function(e,t,r){var content=r(636);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,r(9).default)("b15f1b62",content,!0,{sourceMap:!1})},627:function(e,t,r){"use strict";r.r(t);var o={name:"PreviewImage",props:{alt:{type:String,default:function(){return""}},href:{type:String},previewImage:{type:Object},imageClassName:{type:String}},computed:{previewImageStyle:function(){var style={};return this.previewImage&&this.previewImage.dominantColor&&(style.backgroundColor=this.previewImage.dominantColor),style}},methods:{redirectTo:function(){location.href=this.href}}},n=r(2),component=Object(n.a)(o,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("a",{class:e.imageClassName+"-wrapper",on:{click:e.redirectTo}},[e.previewImage?r("picture",[e.previewImage.fullPathWebP?r("source",{attrs:{type:"image/webp",srcset:e.previewImage.fullPathWebP.replace(" ","%20")}}):e._e(),e._v(" "),e.previewImage.fullPathJp2?r("source",{attrs:{type:"image/jp2",srcset:e.previewImage.fullPathJp2.replace(" ","%20")}}):e._e(),e._v(" "),r("img",{class:e.imageClassName,style:e.previewImageStyle,attrs:{src:e.previewImage.fullPath,alt:e.alt}})]):r("img",{class:e.imageClassName,style:e.previewImageStyle,attrs:{src:"https://s3.amazonaws.com/beta.airtap.co/Images/Projects/placeholder.svg",alt:""}})])}),[],!1,null,null,null);t.default=component.exports},635:function(e,t,r){"use strict";r(619)},636:function(e,t,r){(t=r(8)(!1)).push([e.i,'.pagination[data-v-64599cc4]{display:flex;justify-content:center;margin-bottom:50px}.pageStyle[data-v-64599cc4]{display:block;width:-webkit-fit-content;width:-moz-fit-content;width:fit-content;height:15px;font-family:"Poppins",sans-serif;font-style:normal;font-weight:500;font-size:13px;line-height:19px;color:#bdbdbd;margin:15px}.pageStyle[data-v-64599cc4]:hover{color:#000}.imgStyle[data-v-64599cc4]{display:block;width:45px;height:45px;border:1px solid #dadada;box-sizing:border-box;border-radius:4px;margin:0 10px}.imgLeftStyle[data-v-64599cc4]{background:url(/img/profile/VectorLeft.svg) no-repeat 50%;cursor:default}.imgRightStyle[data-v-64599cc4]{background:url(/img/profile/VectorRight.svg) no-repeat 50%;cursor:default}.imgRightStyleBlack[data-v-64599cc4]{background:url(/img/profile/VectorRightBlack.svg) no-repeat 50%}.imgRightStyleBlack[data-v-64599cc4]:hover{background:#f3f3f3}.imgLeftStyleBlack[data-v-64599cc4]{background:url(/img/profile/VectorLeftBlack.svg) no-repeat 50%}.imgLeftStyleBlack[data-v-64599cc4]:hover{background:#f3f3f3}.current[data-v-64599cc4]{color:#000}',""]),e.exports=t},696:function(e,t,r){var content=r(876);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,r(9).default)("7f356ff9",content,!0,{sourceMap:!1})},697:function(e,t,r){var content=r(878);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,r(9).default)("20a4e52d",content,!0,{sourceMap:!1})},875:function(e,t,r){"use strict";r(696)},876:function(e,t,r){(t=r(8)(!1)).push([e.i,'.content[data-v-22a40c22]{max-width:1280px;margin:auto}.feedProjects[data-v-22a40c22]{font-family:"Poppins",sans-serif;padding:30px 70px 0}.feedProjects__component[data-v-22a40c22]{margin-bottom:20px;border-top:1px solid #ebebeb;margin-top:-1px;padding-top:30px}.feedProjects__header-1[data-v-22a40c22]{font-weight:500;font-size:45px;max-width:613px;margin-top:80px}.feedProjects__header-2[data-v-22a40c22]{font-weight:400;font-size:16px;line-height:24px;max-width:487px;margin-top:30px;margin-bottom:60px}.feedProjects__header-2 a[data-v-22a40c22]{transition:.3s;text-decoration:none;outline:none;color:#173bef;border-bottom:1px solid transparent}.feedProjects__activeSort[data-v-22a40c22],.feedProjects__header-2 a[data-v-22a40c22]:hover{border-bottom:1px solid #173bef}.feedProjects__activeSort[data-v-22a40c22]{color:#000}.feedProjects__filter[data-v-22a40c22]{display:flex;flex-direction:row;font-weight:500;font-size:13px;line-height:19px;color:#bdc2c7}.feedProjects__filter span[data-v-22a40c22]{font-weight:400;font-size:10px;color:#000}.feedProjects__filter ul[data-v-22a40c22]{display:flex;flex-direction:row;margin-top:4px}.feedProjects__filter ul li[data-v-22a40c22]{font-weight:500;cursor:pointer;padding-bottom:15px;transition:.3s}.feedProjects__filter ul li[data-v-22a40c22]:first-child{margin-right:20px}.feedProjects__filter ul li[data-v-22a40c22]:hover{color:#000;border-bottom:1px solid #173bef}.feedProjects__filter-sort[data-v-22a40c22]{margin-left:auto;display:flex;flex-direction:column}.feedProjects__filter-show[data-v-22a40c22]{display:flex;flex-direction:column;margin-right:10px}.feedProjects__banner[data-v-22a40c22]{background:rgba(173,187,255,.2);box-shadow:0 4px 30px rgba(0,0,0,.07);border-radius:10px;min-height:344px;display:grid;grid-template-columns:50% 50%;grid-gap:30px;padding:73px 55px;margin:100px 0}.feedProjects__banner__header[data-v-22a40c22]{font-size:25px;line-height:38px;color:#000;max-width:410px}.feedProjects__banner__li-text[data-v-22a40c22]{font-size:13px;line-height:20px;color:#333;max-width:492px;padding:12px 16px;margin-bottom:8px;background:#fff;border-radius:4px}.feedProjects__banner__li-text[data-v-22a40c22]:last-child{margin-bottom:0}.feedProjects__banner__text[data-v-22a40c22]{font-size:13px;line-height:20px;color:#333;max-width:354px;margin-top:16px}.feedProjects__banner__interactive[data-v-22a40c22]{display:inline-flex;margin-top:30px;align-items:center}.feedProjects__banner__interactive span[data-v-22a40c22]{font-size:13px;line-height:20px;color:#333;font-weight:500}.feedProjects__banner__interactive span a[data-v-22a40c22]{font-weight:500}.feedProjects__banner__buttom[data-v-22a40c22]{background:#173bef;border-radius:4px;font-weight:500;font-size:13px;line-height:20px;color:#fff;text-align:center;padding:8px 16px;width:-webkit-fit-content;width:-moz-fit-content;width:fit-content;text-decoration:none;margin-right:16px}.feedProjects__banner__li-number[data-v-22a40c22]{font-size:13px;line-height:20px;text-align:center;color:#bdbdbd;width:25px;height:25px;border-radius:25px;position:relative;background:#eff1ff;margin-right:8px;align-items:center;justify-content:center;display:inline-flex}.feedProjects__banner__link[data-v-22a40c22]{font-size:13px;line-height:20px;color:#173bef;text-decoration:none;border-bottom:1px solid transparent}.feedProjects__banner__link[data-v-22a40c22]:hover{border-bottom:1px solid #173bef}.feedProjects__banner-2[data-v-22a40c22]{position:relative;height:377px;display:grid;margin-top:100px}.feedProjects__banner-2 img[data-v-22a40c22]{width:100%;height:100%;position:absolute;-o-object-fit:cover;object-fit:cover;-o-object-position:center;object-position:center}.feedProjects__banner-2__content[data-v-22a40c22]{text-align:center;z-index:2;width:584px;margin:80px auto;display:grid}.feedProjects__banner-2__interactive[data-v-22a40c22]{display:flex;margin-top:30px;align-items:center;justify-content:center}.feedProjects__banner-2__interactive span[data-v-22a40c22]{font-size:13px;line-height:20px;color:#333;font-weight:500}.feedProjects__banner-2__link[data-v-22a40c22]{font-weight:500;font-size:13px;line-height:20px;color:#173bef;text-decoration:none}.feedProjects__banner-2__header[data-v-22a40c22]{font-size:32px;line-height:48px;color:#000;max-width:584px;margin:auto auto 16px}.feedProjects__banner-2__text[data-v-22a40c22]{font-size:13px;line-height:19px;color:#333;max-width:414px;margin:auto}.feedProjects__banner-2__buttom[data-v-22a40c22]{background:#173bef;border-radius:4px;font-weight:500;font-size:13px;line-height:20px;color:#fff;text-align:center;padding:8px 16px;width:-webkit-fit-content;width:-moz-fit-content;width:fit-content;height:-webkit-fit-content;height:-moz-fit-content;height:fit-content;text-decoration:none;margin-right:16px}@media screen and (max-width:825px){.feedProjects__banner[data-v-22a40c22]{min-height:304px;padding:30px 20px;margin:80px 0;grid-template-columns:47% 47%}.feedProjects__banner__header[data-v-22a40c22]{max-width:320px}.feedProjects__banner__li-text[data-v-22a40c22]{max-width:334px}.feedProjects__banner__text[data-v-22a40c22]{max-width:320px}}@media screen and (max-width:768px){.feedProjects[data-v-22a40c22]{padding:30px 20px 0}.feedProjects__header-1[data-v-22a40c22]{margin-top:50px;max-width:-webkit-fit-content;max-width:-moz-fit-content;max-width:fit-content}.feedProjects__header-2[data-v-22a40c22]{max-width:487px;margin-bottom:50px}.feedProjects__banner-2[data-v-22a40c22]{min-height:325px;height:-webkit-fit-content;height:-moz-fit-content;height:fit-content;padding:0 15px}.feedProjects__banner-2__content[data-v-22a40c22]{max-width:530px;margin:60px auto;width:100%}.feedProjects__banner-2__header[data-v-22a40c22]{font-size:28px;line-height:42px;max-width:530px}}@media screen and (max-width:414px){.feedProjects[data-v-22a40c22]{padding:30px 15px 0}.feedProjects__header-2[data-v-22a40c22]{margin-top:16px;margin-bottom:50px}.feedProjects__filter[data-v-22a40c22]{font-size:12px;line-height:18px}.feedProjects__filter ul li[data-v-22a40c22]:first-child{margin-right:15px}.feedProjects__banner[data-v-22a40c22]{min-height:492px;grid-template-columns:100%;grid-gap:50px;padding:30px 15px;margin:50px 0}.feedProjects__banner__header[data-v-22a40c22]{font-size:18px;line-height:27px;text-align:center;max-width:100%}.feedProjects__banner__li-text[data-v-22a40c22]{font-size:12px;line-height:18px;max-width:100%}.feedProjects__banner__li-text[data-v-22a40c22]:last-child{margin-bottom:16px}.feedProjects__banner__text[data-v-22a40c22]{font-size:12px;line-height:18px;text-align:center;max-width:100%;margin-top:8px}.feedProjects__banner__interactive[data-v-22a40c22]{display:flex;margin-top:20px;justify-content:center;align-items:center}.feedProjects__banner__buttom[data-v-22a40c22],.feedProjects__banner__interactive span[data-v-22a40c22]{font-size:12px;line-height:18px}.feedProjects__banner__buttom[data-v-22a40c22]{padding:8px 16px}.feedProjects__banner__li-number[data-v-22a40c22],.feedProjects__banner__link[data-v-22a40c22]{font-size:12px;line-height:18px}__banner-2[data-v-22a40c22]{min-height:325px;margin-top:80px}__banner-2__content[data-v-22a40c22]{width:100%;margin:50px auto}__banner-2__header[data-v-22a40c22]{font-size:22px;line-height:33px;max-width:100%;margin-bottom:8px}__banner-2__text[data-v-22a40c22]{max-width:100%}__banner-2__buttom[data-v-22a40c22],__banner-2__text[data-v-22a40c22]{font-size:12px;line-height:18px}}',""]),e.exports=t},877:function(e,t,r){"use strict";r(697)},878:function(e,t,r){(t=r(8)(!1)).push([e.i,'.content[data-v-07fc9e64]{max-width:1280px;margin:auto}.feedProjects[data-v-07fc9e64]{font-family:"Poppins",sans-serif;margin:30px 70px}.feedProjects__likeAndView[data-v-07fc9e64]{display:flex;font-size:12px;align-items:center}.feedProjects__likeAndView span[data-v-07fc9e64]{margin-left:5px;display:flex;align-items:center}.feedProjects__likeAndView button[data-v-07fc9e64]{width:12px;height:12px;background:#fff;cursor:pointer;margin-right:5px}.feedProjects__likeAndView img[data-v-07fc9e64]{width:12px;height:12px}.feedProjects__list[data-v-07fc9e64]{display:grid;grid-template-columns:47% 47%;grid-gap:50px 40px;justify-content:space-between}.feedProjects__projectPreview[data-v-07fc9e64]{position:relative;border-radius:16px;padding:7% 6% 71.48%}.feedProjects__projectPreview[data-v-07fc9e64]:before{content:"";position:absolute;left:0;top:0;width:100%;height:100%;border-radius:16px;transition:.3s;opacity:0;background:rgba(0,0,0,.4);z-index:1}.feedProjects__linkProject:hover .feedProjects__projectEye[data-v-07fc9e64],.feedProjects__linkProject:hover .feedProjects__projectLike[data-v-07fc9e64],.feedProjects__projectPreview[data-v-07fc9e64]:hover:before{opacity:1}.feedProjects__linkProject:hover~.feedProjects__projectDescription>.feedProjects__projectName[data-v-07fc9e64]{color:#173bef;border-bottom:1px solid #173bef}.feedProjects__previewImg[data-v-07fc9e64]{width:88%;height:86%;border-radius:16px;-o-object-fit:cover;object-fit:cover;-o-object-position:center;object-position:center;background-color:#fff;position:absolute;left:6%;top:7%}.feedProjects__projectLike[data-v-07fc9e64]{width:36px;height:36px;background:#fff;box-shadow:0 3px 6px rgba(0,0,0,.2);border-radius:20px;right:5%;bottom:6%;position:absolute;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.3s;opacity:0;z-index:2}.feedProjects__projectLike__hover[data-v-07fc9e64]{opacity:0;position:absolute;right:0;top:0;bottom:0;left:0;margin:auto}.feedProjects__projectLike img[data-v-07fc9e64]{width:18px;height:18px;transition:.3s}.feedProjects__projectLike:hover .feedProjects__projectLike__hover[data-v-07fc9e64]{opacity:1}.feedProjects__projectLike:hover .feedProjects__projectLike__image[data-v-07fc9e64]{opacity:0}.feedProjects__projectEye[data-v-07fc9e64]{width:80px;height:80px;background:#fff;box-shadow:0 4px 8px rgba(0,0,0,.2);border-radius:80px;top:50%;left:50%;margin-right:-50%;transform:translate(-50%,-50%);position:absolute;display:flex;align-items:center;justify-content:center;transition:.3s;opacity:0;z-index:2}.feedProjects__projectEye img[data-v-07fc9e64]{transition:.3s;width:43x;height:43px}.feedProjects__projectEye__white[data-v-07fc9e64]{position:absolute;left:0;top:0;bottom:0;right:0;margin:auto;opacity:0}.feedProjects__projectEye[data-v-07fc9e64]:hover{background:#000}.feedProjects__projectEye:hover .feedProjects__projectEye__black[data-v-07fc9e64]{opacity:0}.feedProjects__projectEye:hover .feedProjects__projectEye__white[data-v-07fc9e64]{opacity:1}.feedProjects__projectDescription[data-v-07fc9e64]{display:flex;flex-direction:row;color:#000;font-weight:400;font-size:25px;line-height:37px;margin-left:0;margin-top:15px;justify-content:space-between}.feedProjects__projectName[data-v-07fc9e64]{text-decoration:none;outline:none;color:#000;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;max-width:60%;border-bottom:1px solid transparent;transition:.3s}.feedProjects__projectName[data-v-07fc9e64]:hover{color:#173bef;border-bottom:1px solid #173bef}.feedProjects__user-info[data-v-07fc9e64]{margin-top:8px;display:flex;flex-direction:row}.feedProjects__avatar[data-v-07fc9e64]{width:20px;height:20px;display:inline;margin-right:10px}.feedProjects__avatar img[data-v-07fc9e64]{border-radius:20px;width:20px;height:20px}.feedProjects__avatar:hover~.feedProjects__userName>a[data-v-07fc9e64]{color:#173bef;border-bottom:1px solid #173bef}.feedProjects__userName[data-v-07fc9e64]{font-weight:400;font-size:12px}.feedProjects__userName a[data-v-07fc9e64]{transition:.3s;text-decoration:none;outline:none;color:#000;border-bottom:1px solid transparent}.feedProjects__userName a[data-v-07fc9e64]:hover{color:#173bef;border-bottom:1px solid #173bef}@media screen and (max-width:768px){.feedProjects[data-v-07fc9e64]{margin:30px 20px}.feedProjects__projectLike[data-v-07fc9e64]{display:flex}.feedProjects__projectEye[data-v-07fc9e64]{width:60px;height:60px;box-shadow:0 3px 6px rgba(0,0,0,.2);border-radius:60px;display:flex}.feedProjects__projectEye img[data-v-07fc9e64]{width:32x;height:32px}.feedProjects__list[data-v-07fc9e64]{grid-gap:50px 20px}.feedProjects__projectDescription[data-v-07fc9e64]{font-size:22px}.feedProjects__userName[data-v-07fc9e64]{font-size:13px}.feedProjects__likeAndView[data-v-07fc9e64]{font-size:10px}}@media screen and (max-width:414px){.feedProjects[data-v-07fc9e64]{margin:30px 15px}.feedProjects__projectDescription[data-v-07fc9e64]{font-size:18px}.feedProjects__list[data-v-07fc9e64]{display:grid;grid-template-columns:100%}.feedProjects__userName[data-v-07fc9e64]{font-size:12px}.feedProjects__likeAndView[data-v-07fc9e64]{font-size:10px}}',""]),e.exports=t}}]);