(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0b2d1c"],{2679:function(e,t,n){"use strict";n.r(t);var c=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div")},a=[],o=(n("cadf"),n("551c"),n("f751"),n("097d"),n("4ec3")),d=n("aa2b"),u=n("5f87"),r={name:"payFace",data:function(){return{}},components:{},computed:{},created:function(){this.payFace()},updated:function(){},mounted:function(){},methods:{payFace:function(){var e={customerPid:Object(u["a"])(),id:this.$route.query.i};Object(o["j"])(e).then(function(e){1e4===e.Head.ErrorCode?e.Body&&Object(u["c"])(e.Body):d["MessageBox"].alert(e.Head.Msg,"提示")})}}},i=r,s=n("2877"),f=Object(s["a"])(i,c,a,!1,null,"00d1967f",null);t["default"]=f.exports}}]);