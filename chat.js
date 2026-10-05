/* 💬 Obrolan Ophelia — widget chat kecil buat Kantor AI (dipakai index.html, index-iso.html, index-2d.html).
   Sumber pesan:
   1) chat.json di root repo: {"messages":[{"from":"ophelia1","text":"...","at":"2026-10-05T20:05:00+08:00"}]}
      Bot nambah pesan dengan nambah objek baru di AKHIR array "messages" (edit file di GitHub web).
   2) Pesan Han yang belum dipindah ke chat.json: GitHub Issue terbuka berjudul "chat: ..." yang dibuat akun 17hrprimary.
      Kalau bot udah nyalin issue ke chat.json, tambahin field "issue": <nomor> biar gak dobel, lalu issue-nya di-close.
   Dicek ulang tiap 60 detik. Semua error (file belum ada, JSON rusak, rate limit GitHub) ditangani diam-diam. */
(function(){
'use strict';
const REPO='17hrprimary/kantor-ai',OWNER='17hrprimary';
const TZ='Asia/Makassar',POLL=60000,NEW_MS=3*60000,LATE_MS=15*60000,FUTURE_MS=5*60000,SHOW=30;
const DEF_NAMES={ophelia1:'Ophelia 1',lia:'Ophelia 2 (Lia)',han:'Han 👑'};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtHM=d=>new Intl.DateTimeFormat('en-GB',{timeZone:TZ,hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(d);
const fmtFull=d=>new Intl.DateTimeFormat('id-ID',{timeZone:TZ,weekday:'short',day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(d).replace(/\./g,':')+' WITA';
const nowMinWita=()=>{const p=fmtHM(new Date()).split(':');return +p[0]*60+ +p[1];};
const CSS=`
.kc h2{margin:0 0 6px}
.kc .kc-tg{all:unset;cursor:pointer;display:flex;align-items:center;gap:6px;width:100%;font-size:14px;font-weight:800;color:#d6457f}
.kc .kc-tg .kc-n{font-size:10.5px;font-weight:800;color:#fff;background:#f2559a;border-radius:999px;padding:1px 7px}
.kc .kc-tg .kc-ar{margin-left:auto;color:#e58ab4}
.kc.closed .kc-body{display:none}.kc.closed h2{margin:0}
.kc .kc-st{font-size:10.5px;color:#a37a95;margin-bottom:5px;line-height:1.35}
.kc .kc-st .on{color:#2f9e63;font-weight:800}
.kc .kc-list{display:flex;flex-direction:column;gap:6px;max-height:260px;overflow:auto;padding:2px 2px 4px;scrollbar-width:thin}
.kc .kc-m{max-width:90%;align-self:flex-start;background:#fff0f6;border:1.5px solid #ffd2e4;border-radius:12px 12px 12px 4px;padding:4px 8px}
.kc .kc-m.r{align-self:flex-end;background:#f3eeff;border-color:#d8ccfb;border-radius:12px 12px 4px 12px}
.kc .kc-m.han{background:#fff7e0;border-color:#f3d48a}
.kc .kc-m.pend{border-style:dashed}
.kc .kc-meta{font-size:10px;color:#a37a95;display:flex;gap:5px;align-items:baseline;flex-wrap:wrap}
.kc .kc-meta b{color:#c23d76;font-size:10.5px}.kc .kc-m.r .kc-meta b{color:#6f52c9}.kc .kc-m.han .kc-meta b{color:#b07a12}
.kc .kc-t{font-size:12px;color:#5a3a52;line-height:1.35;white-space:pre-wrap;word-break:break-word}
.kc .kc-empty{font-size:11.5px;color:#b39aac;font-style:italic;text-align:center;padding:8px 4px}
.kc .kc-form{display:flex;gap:6px;margin-top:7px}
.kc .kc-in{flex:1;min-width:0;border:2px solid #ffd2e4;border-radius:11px;padding:6px 9px;font:inherit;font-size:12px;color:#5a3a52;background:#fff;outline:none}
.kc .kc-in:focus{border-color:#ff9cc7}
.kc .kc-send{border:none;cursor:pointer;font:inherit;font-weight:800;font-size:12px;color:#fff;padding:6px 12px;border-radius:11px;background:linear-gradient(180deg,#ff7eb6,#f2559a);box-shadow:0 3px 0 #c93a7a;flex:none}
.kc .kc-send:active{transform:translateY(2px);box-shadow:0 1px 0 #c93a7a}
.kc .kc-note{font-size:10px;color:#a37a95;margin-top:4px;line-height:1.35}`;

let el=null,opt={},fileMsgs=[],fileState='loading',issues=[],ghMode='label',ghWait=0,ghBusy=false,fileBusy=false;
let lastCheck=null,lastRenderSig='',primed={file:false,gh:false};
const seen=new Set();

function nameOf(id){let n=null;try{n=opt.nameOf&&opt.nameOf(id);}catch(e){}n=n||DEF_NAMES[id]||id||'?';if(id==='han'&&!/👑/.test(n))n+=' 👑';return String(n);}
const keyOf=m=>m.issue!=null?'i'+m.issue:'m|'+m.from+'|'+m.at+'|'+m.text;
function norm(x,i){
 if(!x||typeof x!=='object')return null;
 const from=String(x.from??'').trim(),text=String(x.text??'').trim();if(!from||!text)return null;
 const t=Date.parse(x.at);const iss=Number(x.issue);
 return{from,text:text.slice(0,2000),at:x.at==null?'':String(x.at),t:isNaN(t)?null:t,issue:Number.isFinite(iss)&&x.issue!==''&&x.issue!=null?iss:null,seq:i};}
function isChatIssue(it){return it&&!it.pull_request&&/^\s*chat\s*:/i.test(it.title||'')&&String(it.user&&it.user.login||'').toLowerCase()===OWNER.toLowerCase();}
function issueMsg(it,i){
 const body=String(it.body||'').replace(/\r\n/g,'\n').trim(),title=String(it.title||'').replace(/^\s*chat\s*:\s*/i,'').trim();
 const t=Date.parse(it.created_at);
 return{from:'han',text:(body||title||'(kosong)').slice(0,2000),at:it.created_at||'',t:isNaN(t)?null:t,issue:it.number,pending:true,url:it.html_url,seq:100000+i};}
function combined(){
 const used=new Set(fileMsgs.filter(m=>m.issue!=null).map(m=>m.issue));
 let lastT=-Infinity;const a=fileMsgs.map(m=>{const st=m.t!=null?m.t:lastT;if(m.t!=null)lastT=m.t;return{...m,st};});
 const b=issues.filter(m=>!used.has(m.issue)).map(m=>({...m,st:m.t!=null?m.t:Date.now()}));
 return a.concat(b).sort((p,q)=>(p.st-q.st)||(p.seq-q.seq));}

function detectNew(src){ // pesan baru -> callback (gelembung di atas kepala + log)
 const now=Date.now(),list=combined(),fresh=[];
 list.forEach(m=>{const k=keyOf(m);if(seen.has(k))return;seen.add(k);if(m.t==null)return;const age=now-m.t;
  if(age<-FUTURE_MS)return;if(age<=NEW_MS||(primed[src]&&age<=LATE_MS))fresh.push(m);});
 primed[src]=true;
 if(opt.onNew)fresh.slice(-6).forEach(m=>{try{opt.onNew({...m,name:nameOf(m.from)});}catch(e){}});}

function render(){
 if(!el)return;
 const list=combined(),show=list.slice(-SHOW),m=nowMinWita(),live=m>=20*60&&m<21*60;
 el.querySelector('.kc-n').textContent=list.length;
 el.querySelector('.kc-st').innerHTML=(live?'<span class="on">🟢 Lagi jam ngobrol (20:00–21:00 WITA)</span>':'Ngobrol harian 20:00–21:00 WITA')+
  ' · dicek '+(lastCheck?fmtHM(lastCheck)+' WITA':'…')+' · tiap 60 detik'+(fileState==='missing'?' · <i>chat.json belum ada</i>':fileState==='bad'?' · <i>chat.json gagal dibaca</i>':'');
 const html=show.length?show.map(x=>{const side=x.from==='lia'?' r':'',cls='kc-m'+side+(x.from==='han'?' han':'')+(x.pending?' pend':'');
  const tm=x.t!=null?`<span title="${esc(fmtFull(new Date(x.t)))}">${fmtHM(new Date(x.t))}</span>`:'';
  const pend=x.pending?`<span title="Masih GitHub Issue #${esc(x.issue)}, nunggu dipindah bot ke chat.json">⏳ #${esc(x.issue)}</span>`:'';
  return `<div class="${cls}"><div class="kc-meta"><b>${esc(nameOf(x.from))}</b>${tm}${pend}</div><div class="kc-t">${esc(x.text)}</div></div>`;}).join('')
  :`<div class="kc-empty">${fileState==='loading'?'Memuat obrolan…':fileState==='ok'?'Belum ada obrolan 💭':'Obrolan belum bisa dimuat, nanti dicoba lagi 🙏'}</div>`;
 if(html!==lastRenderSig){lastRenderSig=html;const box=el.querySelector('.kc-list');box.innerHTML=html;box.scrollTop=box.scrollHeight;}}

async function loadFile(){
 if(fileBusy)return;fileBusy=true;
 try{
  const r=await fetch('chat.json?t='+Date.now(),{cache:'no-store'});
  if(r.status===404){fileMsgs=[];fileState='missing';}
  else if(!r.ok)throw 0;
  else{const j=await r.json();const arr=Array.isArray(j)?j:(j&&Array.isArray(j.messages)?j.messages:null);if(!arr)throw 0;
   fileMsgs=arr.map(norm).filter(Boolean);fileState='ok';}
  detectNew('file');
 }catch(e){if(fileState!=='ok')fileState='bad';} // JSON rusak sementara: pesan terakhir yang valid tetap ditampilkan
 finally{fileBusy=false;lastCheck=new Date();render();}}

async function ghFetch(label){
 const r=await fetch('https://api.github.com/repos/'+REPO+'/issues?state=open&per_page=50'+(label?'&labels=chat':''),{headers:{Accept:'application/vnd.github+json'},cache:'no-store'});
 const rem=r.headers.get('x-ratelimit-remaining'),reset=+r.headers.get('x-ratelimit-reset');
 if(r.status===403||r.status===429||(rem!==null&&+rem<=1))ghWait=reset?reset*1000+3000:Date.now()+15*60000; // rate limit: diam, coba lagi setelah reset
 if(!r.ok)return null;const j=await r.json();return Array.isArray(j)?j:null;}
async function loadIssues(){
 if(ghBusy||document.hidden||Date.now()<ghWait)return;ghBusy=true;
 try{
  let list=null;
  if(ghMode==='label'){list=await ghFetch(true);if(!list||!list.some(isChatIssue)){ghMode='all';list=Date.now()<ghWait?null:await ghFetch(false);}} // label "chat" belum ada/gak kepasang -> tanpa filter label
  else list=await ghFetch(false);
  if(list){issues=list.filter(isChatIssue).map(issueMsg);detectNew('gh');render();}
 }catch(e){}finally{ghBusy=false;}}

function send(text){
 text=String(text||'').trim();if(!text)return false;
 const head=Array.from(text.replace(/\s+/g,' ')),title='chat: '+head.slice(0,40).join('')+(head.length>40?'…':'');
 const url='https://github.com/'+REPO+'/issues/new?title='+encodeURIComponent(title)+'&body='+encodeURIComponent(text)+'&labels=chat';
 const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove();return true;}

function refresh(){loadFile();loadIssues();}
function init(o){
 opt=o||{};el=typeof opt.el==='string'?document.querySelector(opt.el):opt.el;if(!el)return;
 if(!document.getElementById('kc-style')){const st=document.createElement('style');st.id='kc-style';st.textContent=CSS;document.head.appendChild(st);}
 el.classList.add('kc');
 el.innerHTML=`<h2><button class="kc-tg" type="button" title="Buka/tutup obrolan">💬 Obrolan Ophelia <span class="kc-n">0</span><span class="kc-ar">▾</span></button></h2>
 <div class="kc-body"><div class="kc-st"></div><div class="kc-list"></div>
 <form class="kc-form" autocomplete="off"><input class="kc-in" maxlength="1500" placeholder="Tulis pesan buat Ophelia… (Han)"><button class="kc-send" type="submit">Kirim</button></form>
 <div class="kc-note">Kirim = buka GitHub Issue baru (login <b>${esc(OWNER)}</b>), klik <b>Submit</b>. Pesan muncul di sini ±1 menit ⏳</div></div>`;
 let open=true;try{open=localStorage.getItem('kantor-chat-open')!=='0';}catch(e){}
 const setOpen=v=>{el.classList.toggle('closed',!v);el.querySelector('.kc-ar').textContent=v?'▾':'▸';try{localStorage.setItem('kantor-chat-open',v?'1':'0');}catch(e){}
  if(v){const b=el.querySelector('.kc-list');b.scrollTop=b.scrollHeight;}};
 setOpen(open);
 el.querySelector('.kc-tg').onclick=()=>setOpen(el.classList.contains('closed'));
 el.querySelector('.kc-form').onsubmit=e=>{e.preventDefault();const inp=el.querySelector('.kc-in');if(send(inp.value)){inp.value='';el.querySelector('.kc-note').innerHTML='Tab GitHub kebuka ✨ klik <b>Submit new issue</b> ya. Pesan muncul di sini ±1 menit ⏳';}};
 render();refresh();setInterval(refresh,POLL);setInterval(render,20000);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});}
window.KantorChat={init,refresh,send,name:nameOf,messages:combined};
})();
