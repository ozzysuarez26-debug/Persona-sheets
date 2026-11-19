/* =====================================================================
   PERSONA CHARACTER SHEET  -  LOGIC
   Most changes (positions, colours, rules, EXP table) belong in config.js
   and style.css. Edit this file only to change HOW something is calculated.
   The two formulas you are most likely to want are in calc() below.
   ===================================================================== */
(function(){
  var C = window.SHEET_CONFIG;
  var T = C.expTable, MAXLV = T.length, KEY = C.storageKey;
  var W0 = C.width, H0 = C.height;
  var STATS = C.statBars, AFFS = C.affinityBoxes, STATES = C.affinityStates;
  var ROWS = C.skillRows, COLS = C.skillColumns, SOCIAL = C.socialStats;
  var MAXSOC = C.maxSocialRank, SOCBONUS = C.socialBonusPerRank;
  var GYMBONUS = 'gym'
  var GUTS = 'Guts';
  var HPBOOST = 'hpBoost';
  var SPBOOST = 'spBoost';


  function $(id){ return document.getElementById(id); }
  function num(v,min,max){ v=parseInt(v,10); if(isNaN(v)) v=min; if(v<min) v=min; if(max!==undefined&&v>max) v=max; return v; }
  function fmt(n){ return n.toLocaleString('en-US'); }
  function levelFor(e){ var l=1; for(var i=0;i<MAXLV;i++){ if(e>=T[i]) l=i+1; } return l; }
  function merge(a,b){ for(var k in b){ if(b[k]&&typeof b[k]==='object'&&!Array.isArray(b[k])&&a[k]&&typeof a[k]==='object') a[k]=merge(a[k],b[k]); else a[k]=b[k]; } return a; }
  function stateFor(code){ for(var i=0;i<STATES.length;i++) if(STATES[i].code===(code||'')) return STATES[i]; return STATES[0]; }

  /* ---------- a blank sheet ---------- */
  function fresh(){
    var stats={}; STATS.forEach(function(s){ stats[s.key]=C.rules.startingStats; });
    var aff={}; AFFS.forEach(function(a){ aff[a.key]=''; });
    var sk=[]; ROWS.forEach(function(){ var r={}; COLS.forEach(function(c){ r[c.field]=''; }); sk.push(r); });
    var soc={}; SOCIAL.forEach(function(n){ soc[n]=0; });
    return { arcana:'', signature:'', persona:'', player:'', ac:'', level:1, exp:0, stats:stats,
             baseHP:C.rules.baseHP, baseSP:C.rules.baseSP, hpBoost:C.rules.hpBoost, spBoost:C.rules.spBoost, gym:C.rules.gym, hpCur:null, spCur:null,
             aff:aff, skills:sk, roles:{p:'',s:'',t:''}, social:soc, notes:'', visage:'' };
  }
  var S = fresh();
  try{ var raw=localStorage.getItem(KEY); if(raw) S=merge(fresh(),JSON.parse(raw)); }catch(e){}
  function save(){ try{ localStorage.setItem(KEY,JSON.stringify(S)); }catch(e){} }
  function get(p){ var a=p.split('.'),o=S; for(var i=0;i<a.length;i++) o=o[a[i]]; return o; }
  function set(p,v){ var a=p.split('.'),o=S; for(var i=0;i<a.length-1;i++) o=o[a[i]]; o[a[a.length-1]]=v; }

  /* ---------- THE FORMULAS: change these to change how HP and SP are worked out ---------- */
  function calc(){
   var en=S.stats.EN, ma=S.stats.MA, lv=S.level,
    g=S.social[GUTS]||0, t=S.social[HPBOOST]||0,
    y=S.social[SPBOOST]||0, b=S.social[GYMBONUS]||0;
     
   var hg=Math.floor(en/5)*lv;                          // HP growth from Endurance
   var sg=Math.floor(Math.floor(ma/5)*lv/2);            // SP growth from Magic (half level, rounded down)
    return { hg:hg, sg:sg, g:g, t:t, y:y, b:b,
             hp: Math.floor((S.baseHP + en + hg + b + g*C.rules.gutsHPPerRank) *( t/100 +1)),
             sp: Math.floor((S.baseSP + ma + sg) *(y/100 +1) ) 
            };
  }

  var prev=null;
  function clampV(){
    var c=calc();
    if(S.hpCur===null||isNaN(S.hpCur)) S.hpCur=c.hp;
    if(S.spCur===null||isNaN(S.spCur)) S.spCur=c.sp;
    if(prev){ if(S.hpCur>=prev.hp) S.hpCur=c.hp; if(S.spCur>=prev.sp) S.spCur=c.sp; }   // full stays full when max grows
    S.hpCur=Math.max(0,Math.min(S.hpCur,c.hp)); S.spCur=Math.max(0,Math.min(S.spCur,c.sp));
    prev={hp:c.hp,sp:c.sp};
  }
  function say(t){ $('msg').textContent=t; }

  /* ---------- place fields from config.positions ---------- */
  function place(el,p){
    el.style.left=p.x+'px'; el.style.top=p.y+'px'; el.style.width=p.w+'px'; el.style.height=p.h+'px';
    if(p.r) el.style.transform='rotate('+p.r+'deg)';
  }
  document.querySelectorAll('[data-pos]').forEach(function(el){
    var p=C.positions[el.getAttribute('data-pos')]; if(!p) return;
    if(p.tl){   // slanted frame given by three corners
      var w=Math.hypot(p.tr[0]-p.tl[0],p.tr[1]-p.tl[1]), h=Math.hypot(p.bl[0]-p.tl[0],p.bl[1]-p.tl[1]);
      var a=(p.tr[0]-p.tl[0])/w, b=(p.tr[1]-p.tl[1])/w, c=(p.bl[0]-p.tl[0])/h, d=(p.bl[1]-p.tl[1])/h;
      el.style.left='0'; el.style.top='0'; el.style.width=w+'px'; el.style.height=h+'px';
      el.style.transform='matrix('+a+','+b+','+c+','+d+','+p.tl[0]+','+p.tl[1]+')';
    } else place(el,p);
  });

  /* ---------- build the repeated pieces from config ---------- */
  var h='';
  AFFS.forEach(function(a){
    h+='<div class="f" style="left:'+a.x+'px;top:'+a.y+'px;width:'+C.affinityBoxSize.w+'px;height:'+C.affinityBoxSize.h+'px;transform:rotate('+a.r+'deg)"><button type="button" class="cell aff-btn" data-aff="'+a.key+'" aria-label="'+a.label+' affinity"></button></div>';
  });
  $('affs').innerHTML=h;
  h='';
  STATS.forEach(function(s){
    h+='<div class="f bar" data-stat="'+s.key+'" style="left:'+s.x+'px;top:'+s.y+'px;width:'+s.w+'px;height:'+s.h+'px;transform:rotate('+s.r+'deg)"><button type="button" data-d="-1" aria-label="Lower '+s.label+'">−</button><output aria-live="polite" aria-label="'+s.label+'"></output><button type="button" data-d="1" aria-label="Raise '+s.label+'">+</button></div>';
  });
  $('bars').innerHTML=h;
  h='';
  ROWS.forEach(function(r,i){ COLS.forEach(function(c){
    h+='<div class="f" style="left:'+c.x+'px;top:'+(r[0]+2)+'px;width:'+c.w+'px;height:'+(r[1]-4)+'px"><textarea class="'+(c.style||'')+'" data-sk="'+i+'.'+c.field+'" aria-label="Skill '+(i+1)+' '+c.label+'" spellcheck="false"></textarea></div>';
  }); });
  $('skills').innerHTML=h;

  /* ---------- draw everything from the current data ---------- */
  function render(){
    clampV(); var c=calc();
    if(document.activeElement!==$('lvIn')) $('lvIn').value=S.level;
    if(document.activeElement!==$('expIn')) $('expIn').value=S.exp;
    $('expNext').value=S.level<MAXLV?fmt(T[S.level]):'MAX';
    $('hpMax').textContent=c.hp; $('spMax').textContent=c.sp;
    if(document.activeElement!==$('hpCur')) $('hpCur').value=S.hpCur;
    if(document.activeElement!==$('spCur')) $('spCur').value=S.spCur;
    STATS.forEach(function(s){
      var el=document.querySelector('[data-stat="'+s.key+'"]');
      el.querySelector('output').textContent=S.stats[s.key];
      el.querySelector('[data-d="-1"]').disabled=S.stats[s.key]<=C.rules.startingStats;
    });
    AFFS.forEach(function(a){
      var b=document.querySelector('[data-aff="'+a.key+'"]'), st=stateFor(S.aff[a.key]);
      b.textContent=st.code; b.style.color=st.color||''; b.title=a.label+': '+st.name+' (click to change)';
    });
    var vis=$('visage'), im=vis.querySelector('img');
    if(S.visage){ if(!im){ im=document.createElement('img'); im.alt="Persona's picture"; vis.insertBefore(im,vis.firstChild); } if(im.getAttribute('src')!==S.visage) im.src=S.visage; vis.classList.add('has'); }
    else { if(im) im.remove(); vis.classList.remove('has'); }
    if(document.activeElement!==$('baseHP')) $('baseHP').value=S.baseHP;
    if(document.activeElement!==$('baseSP')) $('baseSP').value=S.baseSP;
    $('guts').value=S.social[GUTS]||0;
    $('hpBoost').value=S.social[HPBOOST]||0;
    $('spBoost').value=S.social[SPBOOST]||0;
    $('gym').value=S.social[GYMBONUS]||0;
    $('hpHow').innerHTML='<span class="hp-t">HP '+c.hp+'</span> = base '+S.baseHP+' + EN '+S.stats.EN+' + (⌊EN ÷ 5⌋ × level = '+c.hg+')'+(c.g?' + Guts '+(c.g*C.rules.gutsHPPerRank):'');
    $('spHow').innerHTML='<span class="sp-t">SP '+c.sp+'</span> = base '+S.baseSP+' + MA '+S.stats.MA+' + (⌊MA ÷ 5⌋ × half level, rounded down = '+c.sg+')';
    SOCIAL.forEach(function(n){ var i=document.querySelector('[data-soc="'+n+'"]'); if(i&&document.activeElement!==i) i.value=S.social[n]; });
    var rows=document.querySelectorAll('#tbl .r'); for(var i=0;i<rows.length;i++) rows[i].classList.toggle('cur',i+1===S.level);
    save();
  }

  /* ---------- level and EXP ---------- */
  function setExp(total,announce){
    var old=S.level; S.exp=Math.max(0,total); S.level=levelFor(S.exp);
    if(announce&&S.level>old) say('Level up! You are now level '+S.level+'. Roll 2d10 for two random stat points and pick one more stat yourself.');
    else if(S.level<old) say('Level changed to '+S.level+'.'); else say('');
  }
  function setLevel(l){ l=num(l,1,MAXLV); if(l===S.level) return; S.level=l; S.exp=T[l-1]; say('Level set to '+l+'. EXP moved to '+fmt(S.exp)+', the minimum for this level.'); }
  $('lvIn').addEventListener('change',function(){ setLevel(this.value); render(); });
  $('expIn').addEventListener('change',function(){ setExp(num(this.value,0),true); render(); });
  $('gainBtn').addEventListener('click',function(){ var g=num($('gain').value,0); if(!g){ say('Enter an amount of EXP to add.'); return; } $('gain').value=''; setExp(S.exp+g,true); render(); });
  $('gain').addEventListener('keydown',function(e){ if(e.key==='Enter') $('gainBtn').click(); });

  /* ---------- HP and SP ---------- */
  [['hp','hpCur'],['sp','spCur']].forEach(function(p){
    var box=document.querySelector('[data-v="'+p[0]+'"]'), hh='';
    [-10,-5,-1,1,5,10].forEach(function(d){ hh+='<button type="button" class="b" data-d="'+d+'">'+(d>0?'+':'−')+Math.abs(d)+'</button>'; });
    box.innerHTML=hh;
    box.addEventListener('click',function(e){ var b=e.target.closest('button'); if(!b) return; S[p[1]]+=parseInt(b.getAttribute('data-d'),10); render(); });
    $(p[1]).addEventListener('input',function(){ S[p[1]]=num(this.value,0); clampV(); save(); });
    $(p[1]).addEventListener('blur',render);
  });
  $('rest').addEventListener('click',function(){ var c=calc(); S.hpCur=c.hp; S.spCur=c.sp; render(); });
  $('baseHP').addEventListener('input',function(){ S.baseHP=num(this.value,0); render(); });
  $('baseSP').addEventListener('input',function(){ S.baseSP=num(this.value,0); render(); });
  $('hpBoost').addEventListener('input',function(){ S.social[HPBOOST]=num(this.value,0,100); render(); });
  $('spBoost').addEventListener('input',function(){ S.social[SPBOOST]=num(this.value,0,100); render(); });
  $('gym').addEventListener('input',function(){ S.social[GYMBONUS]=num(this.value,0,100); render(); });
  var gs=''; for(var g=0;g<=MAXSOC;g++) gs+='<option>'+g+'</option>'; $('guts').innerHTML=gs;
  $('guts').addEventListener('change',function(){ S.social[GUTS]=num(this.value,0,MAXSOC); render(); });
  $('affHelp').textContent='Click an affinity box on the sheet to cycle: '+STATES.filter(function(s){return s.code;}).map(function(s){return s.code+' '+s.name.toLowerCase();}).join(', ')+'.';

  /* ---------- stats, affinities, skills ---------- */
  $('bars').addEventListener('click',function(e){ var b=e.target.closest('button'); if(!b) return; var k=b.closest('[data-stat]').getAttribute('data-stat');
    S.stats[k]=Math.max(C.rules.startingStats,S.stats[k]+parseInt(b.getAttribute('data-d'),10)); render(); });
  $('affs').addEventListener('click',function(e){ var b=e.target.closest('[data-aff]'); if(!b) return; var k=b.getAttribute('data-aff');
    var cur=stateFor(S.aff[k]), i=STATES.indexOf(cur); S.aff[k]=STATES[(i+1)%STATES.length].code; render(); });
  document.querySelectorAll('[data-sk]').forEach(function(t){
    var p=t.getAttribute('data-sk').split('.'); t.value=S.skills[+p[0]][p[1]]||'';
    t.addEventListener('input',function(){ S.skills[+p[0]][p[1]]=t.value; save(); });
  });

  /* ---------- plain text fields, social stats, EXP table ---------- */
  document.querySelectorAll('[data-k]').forEach(function(el){
    el.value=get(el.getAttribute('data-k'))||''; el.addEventListener('input',function(){ set(el.getAttribute('data-k'),el.value); save(); });
  });
  var sh=''; SOCIAL.forEach(function(n){ sh+='<div class="sc"><b>'+n+'</b><input type="number" min="0" max="'+MAXSOC+'" inputmode="numeric" data-soc="'+n+'" aria-label="'+n+' rank"></div>'; });
  $('social').innerHTML=sh;
  $('socLab').textContent='Social stats (rank 0 to '+MAXSOC+', +'+SOCBONUS+' to checks per rank)';
  $('social').addEventListener('input',function(e){ var n=e.target.getAttribute('data-soc'); if(!n) return; S.social[n]=num(e.target.value,0,MAXSOC); render(); });
  var th=''; T.forEach(function(v,i){ th+='<div class="r"><b>Lv '+(i+1)+'</b><span>'+fmt(v)+'</span></div>'; }); $('tbl').innerHTML=th;

  /* ---------- picture upload (resized so it stays small) ---------- */
  var inp=$('visage').querySelector('input[type=file]');
  inp.addEventListener('change',function(){
    var f=inp.files&&inp.files[0]; if(!f) return; var rd=new FileReader();
    rd.onload=function(){ var img=new Image(); img.onload=function(){
      var m=520, k=Math.min(1,m/Math.max(img.width,img.height)), cv=document.createElement('canvas');
      cv.width=Math.round(img.width*k); cv.height=Math.round(img.height*k); cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height);
      S.visage=cv.toDataURL('image/jpeg',0.82); render(); }; img.src=rd.result; };
    rd.readAsDataURL(f); inp.value='';
  });
  $('visRm').addEventListener('click',function(e){ e.preventDefault(); e.stopPropagation(); S.visage=''; render(); });

  /* ---------- theme button and reset ---------- */
  function applyTheme(t){ if(t) document.documentElement.setAttribute('data-theme',t); }
  try{ applyTheme(localStorage.getItem(KEY+'-theme')); }catch(e){}
  $('themeBtn').addEventListener('click',function(){
    var cur=document.documentElement.getAttribute('data-theme');
    if(!cur) cur=(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light';
    var n=cur==='dark'?'light':'dark'; applyTheme(n); try{ localStorage.setItem(KEY+'-theme',n); }catch(e){}
  });
  var armed=false, timer=null;
  $('reset').addEventListener('click',function(){
    if(!armed){ armed=true; this.textContent='Click again to erase this sheet'; timer=setTimeout(function(){ armed=false; $('reset').textContent='Reset sheet'; },4000); return; }
    clearTimeout(timer); armed=false; this.textContent='Reset sheet'; S=fresh(); prev=null;
    document.querySelectorAll('[data-k]').forEach(function(el){ el.value=''; });
    document.querySelectorAll('[data-sk]').forEach(function(t){ t.value=''; });
    say('Sheet cleared.'); render();
  });

  /* ---------- artwork + scaling to the screen ---------- */
  var fit=$('fit'), sheet=$('sheet');
  document.title=C.title;
  sheet.style.width=W0+'px'; sheet.style.height=H0+'px';
  sheet.style.backgroundImage='url("'+C.background+'")'; sheet.style.backgroundSize=W0+'px '+H0+'px';
  function rescale(){ var k=Math.min(1,fit.clientWidth/W0); sheet.style.transform='scale('+k+')'; fit.style.height=Math.round(H0*k)+'px'; }
  window.addEventListener('resize',rescale);
  if(window.ResizeObserver) new ResizeObserver(rescale).observe(fit);
  if(/[?&]debug/.test(location.search)) document.body.classList.add('debug');   // add ?debug to the address to see field outlines

  S.level=num(S.level,1,MAXLV);
  rescale(); render();
})();
