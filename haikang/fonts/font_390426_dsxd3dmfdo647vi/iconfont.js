(function(window){var svgSprite="<svg>"+""+'<symbol id="icon-zhuye" viewBox="0 0 1024 1024">'+""+'<path d="M603.2 936c-10.304 0-18.688-8.384-18.688-18.752L584.512 628.288 437.44 628.288l0 288.96c0 10.368-8.384 18.752-18.816 18.752-10.24 0-18.624-8.384-18.624-18.752L400 609.472c0-10.304 8.384-18.624 18.624-18.624l184.576 0c10.432 0 18.752 8.32 18.752 18.624l0 307.776C621.952 927.616 613.632 936 603.2 936z"  ></path>'+""+'<path d="M212.032 936 212.032 936c-10.368 0-18.752-8.384-18.752-18.752l0.704-399.68L83.072 517.568c-7.808 0-14.848-4.928-17.536-12.352C62.784 497.792 65.024 489.536 71.168 484.48l426.56-352.192c6.976-5.632 16.768-5.696 23.744-0.128l431.488 347.264c6.208 4.992 8.512 13.312 5.888 20.736-2.496 7.552-9.664 12.544-17.536 12.544l-115.264 0 0 404.608c0 10.368-8.384 18.752-18.752 18.752-10.24 0-18.688-8.384-18.688-18.752L788.608 493.952c0-10.304 8.448-18.688 18.688-18.688l80.96 0L509.888 170.816 135.104 480.256l77.504 0c5.056 0 9.856 1.92 13.248 5.376 3.584 3.584 5.44 8.256 5.44 13.248l-0.512 418.368C230.784 927.68 222.4 936 212.032 936z"  ></path>'+""+'<path d="M807.296 936 212.032 936c-10.304 0-18.752-8.384-18.752-18.752 0-10.304 8.448-18.688 18.752-18.688l595.264 0c10.368 0 18.752 8.384 18.752 18.688C826.048 927.616 817.664 936 807.296 936z"  ></path>'+""+"</symbol>"+""+'<symbol id="icon-jiantou-copy" viewBox="0 0 1024 1024">'+""+'<path d="M9.755 282.775h996.972l-498.445 498.445z" fill="#979695" ></path>'+""+"</symbol>"+""+"</svg>";var script=function(){var scripts=document.getElementsByTagName("script");return scripts[scripts.length-1]}();var shouldInjectCss=script.getAttribute("data-injectcss");var ready=function(fn){if(document.addEventListener){if(~["complete","loaded","interactive"].indexOf(document.readyState)){setTimeout(fn,0)}else{var loadFn=function(){document.removeEventListener("DOMContentLoaded",loadFn,false);fn()};document.addEventListener("DOMContentLoaded",loadFn,false)}}else if(document.attachEvent){IEContentLoaded(window,fn)}function IEContentLoaded(w,fn){var d=w.document,done=false,init=function(){if(!done){done=true;fn()}};var polling=function(){try{d.documentElement.doScroll("left")}catch(e){setTimeout(polling,50);return}init()};polling();d.onreadystatechange=function(){if(d.readyState=="complete"){d.onreadystatechange=null;init()}}}};var before=function(el,target){target.parentNode.insertBefore(el,target)};var prepend=function(el,target){if(target.firstChild){before(el,target.firstChild)}else{target.appendChild(el)}};function appendSvg(){var div,svg;div=document.createElement("div");div.innerHTML=svgSprite;svgSprite=null;svg=div.getElementsByTagName("svg")[0];if(svg){svg.setAttribute("aria-hidden","true");svg.style.position="absolute";svg.style.width=0;svg.style.height=0;svg.style.overflow="hidden";prepend(svg,document.body)}}if(shouldInjectCss&&!window.__iconfont__svg__cssinject__){window.__iconfont__svg__cssinject__=true;try{document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>")}catch(e){console&&console.log(e)}}ready(appendSvg)})(window)