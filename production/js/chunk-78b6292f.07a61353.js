(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-78b6292f"],{"49d6":function(e,t,i){"use strict";i.r(t);var s=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"orderList"},[i("mt-navbar",{model:{value:e.selected,callback:function(t){e.selected=t},expression:"selected"}},[i("mt-tab-item",{attrs:{id:"0"}},[e._v("全部订单")]),i("mt-tab-item",{attrs:{id:"1"}},[e._v("待支付")]),i("mt-tab-item",{attrs:{id:"2"}},[e._v("已支付")]),i("mt-tab-item",{attrs:{id:"3"}},[e._v("已完成")]),i("mt-tab-item",{attrs:{id:"4"}},[e._v("已退款")])],1),i("mt-tab-container",{model:{value:e.selected,callback:function(t){e.selected=t},expression:"selected"}},[i("ul",{directives:[{name:"infinite-scroll",rawName:"v-infinite-scroll",value:e.shopLoadMore,expression:"shopLoadMore"}],staticClass:"list",attrs:{"infinite-scroll-disabled":"shopLoading","infinite-scroll-distance":"20"}},e._l(e.orderList,function(t){return i("li",{key:t.Pid,on:{click:function(i){return e.orderDetail(t.Pid)}}},[i("div",{staticClass:"price"},[i("p",[e._v(e._s(t.ProductShopName))]),i("p",{class:[1==t.Status?"pay":""]},[i("span",[e._v(e._s(t.OrderAmount))]),i("span",[e._v("元")])])]),i("div",{staticClass:"info"},[i("div",[i("p",[i("span",[e._v("订单编号：")]),i("span",[e._v(e._s(t.OrderCode))])]),i("p",[i("span",[e._v("订单日期：")]),i("span",[e._v(e._s(t.AddDate))])])]),i("div",{staticClass:"operating",class:[1!=t.Status?"finish":""],on:{click:function(i){e.payMoney(t.PayOrderCode,t.Status)}}},[e._v("\n            "+e._s(t.StatusName)+"\n          ")])])])}),0)]),e.isLoading?i("div",{staticClass:"loading-box"},[i("span",{staticClass:"loading-more-txt"},[e._v("加载数据中...")])]):e._e(),e.noMore?i("div",{staticClass:"no-more"},[e._v("没有更多了~\n  ")]):e._e()],1)},n=[],a=i("e814"),r=i.n(a),o=i("4ec3"),c=i("aa2b"),d=i("5f87"),u={name:"orderList",data:function(){return{selected:"0",shopLoading:!1,isLoading:!1,noMore:!1,page:0,morePage:"",orderList:[]}},components:{},filters:{orderType:function(e){var t="";switch(e){case 1:t="待支付";break;case 2:t="已支付";break;case 3:t="已完成";break;case 4:t="已取消";break}return t}},computed:{},created:function(){},updated:function(){},mounted:function(){this.getOrderList()},methods:{getOrderList:function(){var e=this;this.isLoading=!0;var t=null;"0"!==this.selected&&(t=r()(this.selected));var i={customerid:Object(d["a"])(),page:this.page,limit:10,orderType:t};Object(o["f"])(i).then(function(t){1e4===t.Head.ErrorCode?(t.Body&&t.Body.length>0?e.orderList=e.orderList.concat(t.Body):(e.morePage=0,e.noMore=!0),e.isLoading=!1):c["MessageBox"].alert(t.Head.Msg,"提示")})},payMoney:function(e,t){if(1!==t)return!1;event.stopPropagation(),Object(d["b"])(e)},orderDetail:function(e){this.$router.push({name:"orderDetail",query:{orderId:e}})},shopLoadMore:function(){var e=this;return!this.isLoading&&(0===this.morePage?(this.noMore=!0,this.isLoading=!1,!1):(this.page++,this.isMoreLoading=!0,this.isLoading=!0,void setTimeout(function(){e.getOrderList()},500)))}},watch:{selected:function(e){this.morePage="",this.page=0,this.orderList=[],this.getOrderList()}}},l=u,p=(i("b934"),i("2877")),f=Object(p["a"])(l,s,n,!1,null,"7f14d18d",null);t["default"]=f.exports},"5d6b":function(e,t,i){var s=i("e53d").parseInt,n=i("a1ce").trim,a=i("e692"),r=/^[-+]?0[xX]/;e.exports=8!==s(a+"08")||22!==s(a+"0x16")?function(e,t){var i=n(String(e),3);return s(i,t>>>0||(r.test(i)?16:10))}:s},7445:function(e,t,i){var s=i("63b6"),n=i("5d6b");s(s.G+s.F*(parseInt!=n),{parseInt:n})},a1ce:function(e,t,i){var s=i("63b6"),n=i("25eb"),a=i("294c"),r=i("e692"),o="["+r+"]",c="​",d=RegExp("^"+o+o+"*"),u=RegExp(o+o+"*$"),l=function(e,t,i){var n={},o=a(function(){return!!r[e]()||c[e]()!=c}),d=n[e]=o?t(p):r[e];i&&(n[i]=d),s(s.P+s.F*o,"String",n)},p=l.trim=function(e,t){return e=String(n(e)),1&t&&(e=e.replace(d,"")),2&t&&(e=e.replace(u,"")),e};e.exports=l},b934:function(e,t,i){"use strict";var s=i("cf2b"),n=i.n(s);n.a},b9e9:function(e,t,i){i("7445"),e.exports=i("584a").parseInt},cf2b:function(e,t,i){},e692:function(e,t){e.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"},e814:function(e,t,i){e.exports=i("b9e9")}}]);