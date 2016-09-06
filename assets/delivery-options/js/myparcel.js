(function(){var e;"undefined"!=typeof mypajQuery&&null!==mypajQuery&&(e=mypajQuery),null==e&&(e=$),null==e&&(e=jQuery),e(document).ready(function(){var n,a,i,p,t,r,l,o,s,d,m,c,y,u,v,f,h,g,w,b,k,_,C,x,S,B,M,H,I,T,N,O,L,j,z,D,J,Q,E,F,G,P,W;return n=function(n){return e(document.getElementById("myparcel").shadowRoot).find(n)},null==window.mypa&&(window.mypa={}),window.mypa.initialize=function(){var e,n,a;return e=document.getElementById("myparcel"),null!=e?(a=e.createShadowRoot(),a.innerHTML=document.getElementById("myparcel-template").innerHTML,null!=(n=WebComponents.ShadowCSS)?n.shimStyling(a,"myparcel"):void 0):void 0},window.mypa.initialize(),null==(g=window.mypa).fn&&(g.fn={}),null==(w=window.mypa).settings&&(w.settings={}),null==(b=window.mypa.settings).price&&(b.price={}),null==(k=window.mypa.settings).text&&(k.text={}),null==(_=window.mypa.settings).base_url&&(_.base_url="//localhost:8080/api/delivery_options"),l="disabled",s="Handtekening voor ontvangst",a="Alleen geadresseerde",c="NL",i=1,d="morning",r="default",o="night",u="pickup",v="pickup_express",h={morning:"morning",standaard:"default",avond:"night"},p=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],t=["ma","di","wo","do","vr","za","zo"],m="08:30:00",y="16:00:00",H={},H[""+m]="morning",H[""+y]="normal",f=H,x=function(){return n(".mypa-tab-container").toggleClass("mypa-slider-pos-1").toggleClass("mypa-slider-pos-0")},window.mypa.fn.updatePage=window.mypa.updatePage=S=function(a,p,t){var r,l,o,s,d,m;s=window.mypa.settings.price;for(l in s)if(r=s[l],"string"!=typeof r&&"function"!=typeof r)throw new Error("Price needs to be of type string");return d=window.mypa.settings,m=d.base_url,null==p&&(p=d.number),null==a&&(a=d.postal_code),null==t&&(t=d.street),null==t&&null==a&&null==p?(n("#mypa-no-options").html("Geen adres opgegeven"),void n(".mypa-overlay").removeClass("mypa-hidden")):(n("#mypa-no-options").html("Bezig met laden..."),n(".mypa-overlay").removeClass("mypa-hidden"),n(".mypa-location").html(t+" "+p),o={url:m,data:{cc:c,carrier:i,number:p,postal_code:a,delivery_time:null!=d.delivery_time?d.delivery_time:void 0,delivery_date:null!=d.delivery_date?d.delivery_date:void 0,cutoff_time:null!=d.cutoff_time?d.cutoff_time:void 0,dropoff_days:null!=d.dropoff_days?d.dropoff_days:void 0,dropoff_delay:null!=d.dropoff_delay?d.dropoff_delay:void 0,deliverydays_window:null!=d.deliverydays_window?d.deliverydays_window:void 0,exlude_delivery_type:null!=d.exclude_delivery_type?d.exclude_delivery_type:void 0},success:z},e.ajax(o))},z=function(e){return"No results"===e.data.message?(n("#mypa-no-options").html("Geen bezorgopties gevonden voor het opgegevn adres."),void n(".mypa-overlay").removeClass("mypa-hidden")):(n(".mypa-overlay").addClass("mypa-hidden"),n("#mypa-delivery-option-check").bind("click",function(){return L(n("input[name=date]:checked").val())}),O(e.data.delivery),N(e.data.pickup),n("#mypa-delivery-options-title").on("click",function(){var e;return e=n("input[name=date]:checked").val(),L(e),W()}),n("#mypa-pickup-options-title").on("click",function(){return n("#mypa-pickup").prop("checked",!0),W()}),W())},N=function(e){var a,i,p,t,r,l,o,s,d,c,h;if(e.length<1)return void n("#mypa-pickup-row").addClass("mypa-hidden");for(n("#mypa-pickup-row").removeClass("mypa-hidden"),d=window.mypa.settings.price[u],o=window.mypa.settings.price[v],n(".mypa-pickup-price").html(d),n(".mypa-pickup-price").toggleClass("mypa-hidden",null==d),n(".mypa-pickup-express-price").html(o),n(".mypa-pickup-express-price").toggleClass("mypa-hidden",null==o),window.mypa.pickupFiltered=a={},e=G(e),i=0,t=e.length;t>i;i++)for(s=e[i],c=s.time,p=0,r=c.length;r>p;p++)h=c[p],null==a[l=f[h.start]]&&(a[l]=[]),a[f[h.start]].push(s);return null==a[f[m]]&&n("#mypa-pickup-express").parent().css({display:"none"}),Q("#mypa-pickup-address",a[f[y]][0]),Q("#mypa-pickup-express-address",a[f[m]][0]),n("#mypa-pickup-address").off().bind("click",D),n("#mypa-pickup-express-address").off().bind("click",j)},G=function(e){return e.sort(function(e,n){return parseInt(e.distance)-parseInt(n.distance)})},Q=function(e,a){var i;return i=" - "+a.location+", "+a.street+" "+a.number,n(e).html(i),n(e).parent().find("input").val(JSON.stringify(a))},D=function(){return J(window.mypa.pickupFiltered[f[y]]),n(".mypa-location-time").html("- Vanaf 16.00 uur"),n("#mypa-pickup").prop("checked",!0),!1},j=function(){return J(window.mypa.pickupFiltered[f[m]]),n(".mypa-location-time").html("- Vanaf 08.30 uur"),n("#mypa-pickup-express").prop("checked",!0),!1},J=function(e){var a,i,p,r,l,o,s,d,m,c,y,u,v;for(x(),n(".mypa-onoffswitch-checkbox:checked").prop("checked",!1),C(),n("#mypa-location-container").html(""),r=p=0,y=e.length-1;y>=0?y>=p:p>=y;r=y>=0?++p:--p){for(d=e[r],c=T(d.opening_hours),m="",a=l=0;6>=l;a=++l){for(m+="<div>\n  <div class='mypa-day-of-the-week'>\n    "+t[a]+":\n  </div>\n  <div class='mypa-opening-hours-list'>",u=c[a],o=0,s=u.length;s>o;o++)v=u[o],m+="<div>"+v+"</div>";c[a].length<1&&(m+="<div><i>Gesloten</i></div>"),m+="</div></div>"}i="<div for='mypa-pickup-location-"+r+'\' class="mypa-row-lg">\n  <input id="mypa-pickup-location-'+r+'" type="radio" name="mypa-pickup-option" value=\''+JSON.stringify(d)+"'>\n  <label for='mypa-pickup-location-"+r+'\' class=\'mypa-row-title\'>\n    <div class="mypa-checkmark mypa-main">\n      <div class="mypa-circle"></div>\n      <div class="mypa-checkmark-stem"></div>\n      <div class="mypa-checkmark-kick"></div>\n    </div>\n    <span class="mypa-highlight mypa-inline-block">'+d.location+", <b class='mypa-inline-block'>"+d.street+" "+d.number+"</b>,\n    <i class='mypa-inline-block'>"+String(Math.round(d.distance/100)/10).replace(".",",")+" Km</i></span>\n  </label>\n  <i class='mypa-info'>\n  </i>\n  <div class='mypa-opening-hours'>\n    "+m+"\n  </div>\n</div>",n("#mypa-location-container").append(i)}return n("input[name=mypa-pickup-option]").bind("click",function(e){var a,i;return x(),a=JSON.parse(n(e.currentTarget).val()),i="#"+n("input[name=mypa-delivery-time]:checked").parent().find("span.mypa-address").attr("id"),Q(i,a)})},T=function(e){var n,a,i,t;for(n=[],i=0,t=p.length;t>i;i++)a=p[i],n.push(e[a]);return n},O=function(e){var a,i,p,t,r,l,o,s,d;if(e.length<1)return void n("mypa-delivery-row").addClass("mypa-hidden");for(n("mypa-delivery-row").removeClass("mypa-hidden"),e.sort(I),r=window.mypa.sortedDeliverytimes={},a=n("#mypa-tabs").html(""),n("#mypa-delivery-options-container").width(),s=0,o=0,d=e.length;d>o;o++)t=e[o],r[t.date]=t.time,p=moment(t.date),l='<input type="radio" id="mypa-date-'+s+'" class="mypa-date" name="date" checked value="'+t.date+"\">\n<label for='mypa-date-"+s+"' class='mypa-tab active'>\n  <span class='day-of-the-week'>"+p.format("dddd")+"</span>\n  <br>\n  <span class='date'>"+p.format("DD MMMM")+"</span>\n</label>",a.append(l),s++;return i=n(".mypa-tab"),i.length>0&&(i.bind("click",P),i[0].click()),a.width(105*e.length),M()},P=function(e){var a;if(n("#mypa-delivery-option-check").prop("checked")===!0)return a=n("#"+n(e.currentTarget).prop("for"))[0].value,L(a)},L=function(e){var i,p,t,r,m,c,y,u,v,f,g,w,b,k,_,x,S;for(n("#mypa-delivery-options").html(""),m="",r=window.mypa.sortedDeliverytimes[e],v=0,u=0,g=r.length;g>u;u++)S=r[u],"avond"===S.price_comment&&(S.price_comment=o),k=window.mypa.settings.price[h[S.price_comment]],f={date:e,time:[S]},i="","standard"===S.price_comment&&(i="checked"),m+='<label for="mypa-time-'+v+"\" class='mypa-row-subitem'>\n  <input id='mypa-time-"+v+'\' type="radio" name="mypa-delivery-time" value=\''+JSON.stringify(f)+"' "+i+'>\n  <label for="mypa-time-'+v+'" class="mypa-checkmark">\n    <div class="mypa-circle mypa-circle-checked"></div>\n    <div class="mypa-checkmark-stem"></div>\n    <div class="mypa-checkmark-kick"></div>\n  </label>\n  <span class="mypa-highlight">'+moment(S.start,"HH:mm:SS").format("H.mm")+" - "+moment(S.end,"HH:mm:SS").format("H.mm")+" uur</span>",null!=k&&(m+="<span class='mypa-price'>"+k+"</span>"),m+="</label>",v++;return c=window.mypa.settings.price.signed,y=null!=(_=window.mypa.settings.text)?_.signed:void 0,null==y&&(y=s),w=window.mypa.settings.price.only_recipient,b=null!=(x=window.mypa.settings.text)?x.only_recipient:void 0,null==b&&(b=a),p=window.mypa.settings.price.combi_options,t="disabled"!==w&&"disabled"!==c&&null!=p,t&&(m+="<div class='mypa-combination-price'><span class='mypa-price mypa-hidden'>"+p+"</span>"),w!==l&&(m+='<label for="mypa-only-recipient" class=\'mypa-row-subitem\'>\n  <input type="checkbox" name="mypa-only-recipient" class="mypa-onoffswitch-checkbox" id="mypa-only-recipient">\n  <div class="mypa-switch-container">\n    <div class="mypa-onoffswitch">\n      <label class="mypa-onoffswitch-label" for="mypa-only-recipient">\n        <span class="mypa-onoffswitch-inner"></span>\n       <span class="mypa-onoffswitch-switch"></span>\n      </label>\n    </div>\n  </div>\n  <span>'+b,null!=w&&(m+="<span class='mypa-price'>"+w+"</span>"),m+="</span></label>"),c!==l&&(m+='<label for="mypa-signed" class=\'mypa-row-subitem\'>\n  <input type="checkbox" name="mypa-signed" class="mypa-onoffswitch-checkbox" id="mypa-signed">\n  <div class="mypa-switch-container">\n    <div class="mypa-onoffswitch">\n      <label class="mypa-onoffswitch-label" for="mypa-signed">\n        <span class="mypa-onoffswitch-inner"></span>\n      <span class="mypa-onoffswitch-switch"></span>\n      </label>\n    </div>\n  </div>\n  <span>'+y,c&&(m+="<span class='mypa-price'>"+c+"</span>"),m+="</span></label>"),t&&(m+="</div>"),n("#mypa-delivery-options").html(m),n(".mypa-combination-price input").on("DOMSubtreeModified",C),n("#mypa-delivery-options .mypa-row-subitem input[name=mypa-delivery-time]").on("DOMSubtreeModified",function(e){var a;return a=JSON.parse(n(e.currentTarget).val()).time[0].price_comment,a===d||a===o?(n("input#mypa-only-recipient").prop("checked",!0).prop("disabled",!0),n("label[for=mypa-only-recipient] span.mypa-price").html("incl.")):(w=window.mypa.settings.price.only_recipient,n("input#mypa-only-recipient").prop("disabled",!1),n("label[for=mypa-only-recipient] span.mypa-price").html(w)),C()}),n("input[name=mypa-delivery-time]:checked").length<1&&n(n("input[name=mypa-delivery-time]")[0]).prop("checked",!0),n("div#mypa-delivery-row label").bind("click",W)},C=function(){var e,a,i,p;return p=n("#mypa-delivery-options .mypa-row-subitem input[name=mypa-delivery-time]:checked").val(),null!=p&&(a=JSON.parse(p).time[0].price_comment),i=a===d||a===o,e=n("input[name=mypa-only-recipient]").prop("checked")&&n("input[name=mypa-signed]").prop("checked")&&!i,n(".mypa-combination-price").toggleClass("mypa-combination-price-active",e),n(".mypa-combination-price > .mypa-price").toggleClass("mypa-price-active",e),n(".mypa-combination-price > .mypa-price").toggleClass("mypa-hidden",!e),n(".mypa-combination-price label .mypa-price").toggleClass("mypa-hidden",e)},M=function(){var e;return e=window.mypa.slider={},e.barLength=n("#mypa-tabs-container").outerWidth(),e.bars=n("#mypa-tabs").outerWidth()/e.barLength,e.currentBar=0,n("#mypa-date-slider-right").removeClass("mypa-slider-disabled"),n("#mypa-date-slider-left").unbind().bind("click",E),n("#mypa-date-slider-right").unbind().bind("click",F)},E=function(e){var a,i,p;if(p=window.mypa.slider,1===p.currentBar)n(e.currentTarget).addClass("mypa-slider-disabled");else{if(p.currentBar<1)return!1;n(e.currentTarget).removeClass("mypa-slider-disabled")}return n("#mypa-date-slider-right").removeClass("mypa-slider-disabled"),p.currentBar--,a=n("#mypa-tabs"),i=p.currentBar*p.barLength*-1,i=104*parseInt(i/104),a.css({left:i})},F=function(e){var a,i,p;if(p=window.mypa.slider,parseInt(p.currentBar)===parseInt(p.bars-1))n(e.currentTarget).addClass("mypa-slider-disabled");else{if(p.currentBar>=p.bars-1)return!1;n(e.currentTarget).removeClass("mypa-slider-disabled")}return n("#mypa-date-slider-left").removeClass("mypa-slider-disabled"),p.currentBar++,a=n("#mypa-tabs"),i=p.currentBar*p.barLength*-1,i=104*parseInt(i/104),a.css({left:i})},I=function(e,n){var a,i,p;return a=moment(e.date),i=moment(n.date),p=moment.max(a,i),p===a?1:-1},W=function(){var a;return a=n("input[name=mypa-delivery-time]:checked").val(),console.log(n("#mypa-signed").val()),e("#mypa-input").val(a),e("#mypa-signed").prop("checked",n("#mypa-signed").prop("checked")),e("#mypa-recipient-only").prop("checked",n("#mypa-only-recipient").prop("checked"))},B=function(){return moment.locale(c),S(),null},jQuery(document).ready(B)})}).call(this);