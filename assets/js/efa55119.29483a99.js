"use strict";(self.webpackChunkicare_user_manual=self.webpackChunkicare_user_manual||[]).push([[8686],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return d}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),c=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=c(e.components);return r.createElement(s.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},p=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),p=c(n),d=a,g=p["".concat(s,".").concat(d)]||p[d]||m[d]||i;return n?r.createElement(g,o(o({ref:t},u),{},{components:n})):r.createElement(g,o({ref:t},u))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=p;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:a,o[1]=l;for(var c=2;c<i;c++)o[c]=n[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}p.displayName="MDXCreateElement"},8374:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return l},contentTitle:function(){return s},metadata:function(){return c},assets:function(){return u},toc:function(){return m},default:function(){return d}});var r=n(7462),a=n(3366),i=(n(7294),n(3905)),o=["components"],l={slug:"welcome",title:"Welcome",tags:["udsm","hello","icare"]},s=void 0,c={permalink:"/icare/blog/welcome",editUrl:"https://github.com/facebook/docusaurus/edit/main/website/blog/blog/welcome/index.md",source:"@site/blog/welcome/index.md",title:"Welcome",description:"iCare EMR & Hospital Services System",date:"2022-04-28T11:10:10.054Z",formattedDate:"April 28, 2022",tags:[{label:"udsm",permalink:"/icare/blog/tags/udsm"},{label:"hello",permalink:"/icare/blog/tags/hello"},{label:"icare",permalink:"/icare/blog/tags/icare"}],readingTime:1.205,truncated:!1,authors:[],nextItem:{title:"First Blog Post",permalink:"/icare/blog/first-blog-post"}},u={authorsImageUrls:[]},m=[{value:"iCare EMR &amp; Hospital Services System",id:"icare-emr--hospital-services-system",children:[{value:"Status (Where are we)",id:"status-where-are-we",children:[],level:4}],level:2}],p={toc:m};function d(e){var t=e.components,n=(0,a.Z)(e,o);return(0,i.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h2",{id:"icare-emr--hospital-services-system"},"iCare EMR & Hospital Services System"),(0,i.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("h3",{parentName:"div",id:"introduction"},"Introduction"),(0,i.kt)("p",{parentName:"div"},"iCare is an Electronic Medical Recording and Hospital Services System started October 2020 aiming at addressing common challenges encountered when UDSM   DHIS2 project was providing support to the Ministry of Health on various areas mainly on two areas, integrations between existing hospital systems (Interoperability) and HMIS Data warehouse, also on improving features on the hospital system used by referral hospitals in Tanzania.\nTechnology\niCare is an OpenSource Technology built on top of OPENMRS as an OpenSource EMR system. Going down, iCare is built taking advantage of the AOP programming paradigm under Spring-Boot technology for the backend and using Angular-12 on the frontend."))),(0,i.kt)("p",null,"To simplify the deployment process specifically on setting up the system up and running, which is also a challenge we encountered during deployment of one of MoHCDGEC EMR systems, iCare uses Docker technology. With the iCare Docker image, there is NO need for server expertise when deploying it."),(0,i.kt)("h4",{id:"status-where-are-we"},"Status (Where are we)"),(0,i.kt)("p",null,"iCare so far is being tested in one hospital and one specialized clinic. The following are the iCare features:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Clients Registration"),(0,i.kt)("li",{parentName:"ul"},"Vital signs module"),(0,i.kt)("li",{parentName:"ul"},"Clinic module"),(0,i.kt)("li",{parentName:"ul"},"Nursing module (Observation, Injection etc)"),(0,i.kt)("li",{parentName:"ul"},"IPD module"),(0,i.kt)("li",{parentName:"ul"},"Pharmacy module"),(0,i.kt)("li",{parentName:"ul"},"Billing module (Cash & Insurance)"),(0,i.kt)("li",{parentName:"ul"},"NHIF e-claim module"),(0,i.kt)("li",{parentName:"ul"},"Reports module"),(0,i.kt)("li",{parentName:"ul"},"DHIS2 Integration module"),(0,i.kt)("li",{parentName:"ul"},"Clients Messaging module"),(0,i.kt)("li",{parentName:"ul"},"Automated Monthly emails for selected reports"),(0,i.kt)("li",{parentName:"ul"},"Provider Registration"),(0,i.kt)("li",{parentName:"ul"},"Mortually module")))}d.isMDXComponent=!0}}]);