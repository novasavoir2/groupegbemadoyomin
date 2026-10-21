/* ============================================================
   ENGAGEMENT.JS — Likes + Commentaires + Vues + Partage
   Inclure une seule fois par page APRÈS Firebase.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- CSS injecté automatiquement ---------- */
  if (!document.getElementById('engagement-style')) {
    const style = document.createElement('style');
    style.id = 'engagement-style';
    style.textContent = `
      .eng-bar, .eng-inline { display:flex; flex-wrap:wrap; align-items:center; gap:10px; padding:10px 0; margin-top:12px; border-top:1px solid rgba(184,146,46,0.15); font-size:0.82rem; color:#c8c0b0; }
      .eng-inline { padding:8px 0 0; margin-top:10px; font-size:0.75rem; gap:8px; }
      .eng-counter { display:inline-flex; align-items:center; gap:4px; color:#9a9080; white-space:nowrap; cursor:pointer; }
      .eng-counter b { color:#d4af5a; font-weight:700; }
      .eng-btn-like { display:inline-flex; align-items:center; gap:5px; padding:6px 12px; border-radius:18px; background:#161616; border:1px solid rgba(184,146,46,0.2); color:#c8c0b0; font-size:0.78rem; font-weight:700; cursor:pointer; transition:all 0.25s ease; font-family:inherit; }
      .eng-btn-like:hover { border-color:#b8922e; color:#d4af5a; }
      .eng-btn-like.liked { background:rgba(184,146,46,0.15); border-color:#b8922e; color:#d4af5a; }
      .eng-btn-like.liked .ico { animation:engHeart 0.4s ease; }
      @keyframes engHeart { 0%{transform:scale(1)} 50%{transform:scale(1.4)} 100%{transform:scale(1)} }
      .eng-inline .eng-btn-like { padding:4px 9px; font-size:0.7rem; }
      .eng-share { display:flex; flex-wrap:wrap; align-items:center; gap:5px; margin-left:auto; }
      .eng-share-label { font-size:0.72rem; color:#7a7060; margin-right:2px; }
      .eng-share-btn { display:inline-flex; align-items:center; gap:4px; padding:5px 10px; border-radius:4px; font-size:0.7rem; font-weight:700; text-decoration:none; cursor:pointer; background:#161616; border:1px solid rgba(184,146,46,0.15); color:#c8c0b0; transition:all 0.2s ease; font-family:inherit; }
      .eng-share-btn:hover { transform:translateY(-1px); border-color:#b8922e; }
      .eng-share-btn.wa { background:#25D366; border-color:#25D366; color:#fff; }
      .eng-share-btn.fb { background:#1877F2; border-color:#1877F2; color:#fff; }
      .eng-share-btn.tw { background:#000; border-color:#333; color:#fff; }
      .eng-share-btn.tg { background:#0088cc; border-color:#0088cc; color:#fff; }
      .eng-share-btn.tk { background:#000; border-color:#fe2c55; color:#fff; }
      .eng-share-btn.cp { background:#b8922e; border-color:#b8922e; color:#0d0d0d; }
      .eng-inline .eng-share-btn { padding:3px 8px; font-size:0.68rem; }
      .eng-comments { margin-top:32px; padding-top:24px; border-top:1px solid rgba(184,146,46,0.15); }
      .eng-comments-title { font-family:'Cinzel',serif; color:#b8922e; font-size:1.1rem; margin-bottom:16px; }
      .eng-form { background:#111; border:1px solid rgba(184,146,46,0.1); border-radius:6px; padding:16px; margin-bottom:20px; }
      .eng-form input, .eng-form textarea { width:100%; padding:10px 14px; margin-bottom:10px; background:#161616; border:1px solid rgba(184,146,46,0.1); border-radius:4px; color:#f0ebe0; font-family:inherit; font-size:0.9rem; box-sizing:border-box; }
      .eng-form textarea { min-height:90px; resize:vertical; }
      .eng-form input:focus, .eng-form textarea:focus { outline:none; border-color:#b8922e; }
      .eng-submit { background:linear-gradient(135deg,#d4af5a,#8a6a1f); color:#0d0d0d; border:none; font-family:'Cinzel',serif; font-size:0.78rem; font-weight:700; letter-spacing:0.06em; padding:10px 24px; border-radius:4px; cursor:pointer; transition:transform 0.2s ease; }
      .eng-submit:hover:not(:disabled) { transform:translateY(-1px); }
      .eng-submit:disabled { opacity:0.6; cursor:not-allowed; }
      .eng-msg { font-size:0.82rem; margin-top:8px; }
      .eng-list { display:flex; flex-direction:column; gap:10px; }
      .eng-empty { text-align:center; padding:24px; color:#7a7060; font-size:0.88rem; font-style:italic; border:1px dashed rgba(184,146,46,0.15); border-radius:6px; }
      .eng-comment { background:#111; border:1px solid rgba(184,146,46,0.1); border-radius:6px; padding:12px 16px; }
      .eng-comment-head { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:5px; font-size:0.82rem; }
      .eng-comment-head b { color:#d4af5a; }
      .eng-comment-head span { color:#7a7060; font-size:0.72rem; }
      .eng-comment-body { color:#c8c0b0; font-size:0.9rem; }
      .eng-modal { position:fixed; inset:0; z-index:3000; background:rgba(0,0,0,0.9); display:none; align-items:center; justify-content:center; padding:20px; }
      .eng-modal.open { display:flex; }
      .eng-modal-content { background:#111; border:1px solid #b8922e; border-radius:8px; width:100%; max-width:600px; max-height:85vh; overflow:hidden; display:flex; flex-direction:column; }
      .eng-modal-header { padding:14px 20px; background:linear-gradient(135deg,#7a1515,#111); border-bottom:1px solid #b8922e; display:flex; align-items:center; justify-content:space-between; }
      .eng-modal-title { font-family:'Cinzel',serif; color:#f0ebe0; font-size:0.95rem; }
      .eng-modal-close { width:32px; height:32px; border-radius:50%; background:rgba(255,255,255,0.1); color:#f0ebe0; border:none; font-size:1.2rem; cursor:pointer; }
      .eng-modal-body { padding:20px; overflow-y:auto; }
      @media (max-width:640px) { .eng-bar { flex-direction:column; align-items:stretch; } .eng-share { margin-left:0; } }
    `;
    document.head.appendChild(style);
  }

  function getDb() {
    if (typeof firebase === 'undefined' || !firebase.firestore) throw new Error('Firebase non chargé');
    return firebase.firestore();
  }
  function ref(type, id) { return getDb().collection('engagements').doc(type + '_' + id); }
  function inc(n) { return firebase.firestore.FieldValue.increment(n); }
  function srv() { return firebase.firestore.FieldValue.serverTimestamp(); }
  function esc(s) { return String(s||'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function fmt(n) { n=parseInt(n,10)||0; if(n>=1000000) return (n/1000000).toFixed(1).replace('.0','')+'M'; if(n>=1000) return (n/1000).toFixed(1).replace('.0','')+'k'; return String(n); }
  function timeAgo(ts) { if(!ts) return ''; const d=ts.toDate?ts.toDate():new Date(ts); const s=Math.floor((Date.now()-d.getTime())/1000); if(s<60) return "à l'instant"; if(s<3600) return Math.floor(s/60)+' min'; if(s<86400) return Math.floor(s/3600)+' h'; if(s<2592000) return Math.floor(s/86400)+' j'; return d.toLocaleDateString('fr-FR'); }
  function isLiked(type, id) { return localStorage.getItem('gg_l_'+type+'_'+id)==='1'; }
  function shareLinks(url, titre) { const u=encodeURIComponent(url); const t=encodeURIComponent(titre||'Groupe Gbêmadoyomin'); return { whatsapp:'https://wa.me/?text='+t+'%20'+u, facebook:'https://www.facebook.com/sharer/sharer.php?u='+u, twitter:'https://twitter.com/intent/tweet?text='+t+'&url='+u, telegram:'https://t.me/share/url?url='+u+'&text='+t }; }

  async function view(type, id) {
    if (!type || !id) return;
    const k = 'gg_v_'+type+'_'+id;
    if (sessionStorage.getItem(k)) return;
    try {
      await ref(type, id).set({ type, itemId:id, vues:inc(1), updatedAt:srv() }, { merge:true });
      sessionStorage.setItem(k, '1');
    } catch(e) { console.warn('view', e); }
  }

  async function toggleLike(type, id) {
    const k = 'gg_l_'+type+'_'+id;
    const liked = localStorage.getItem(k)==='1';
    try {
      await ref(type, id).set({ type, itemId:id, likes:inc(liked?-1:1), updatedAt:srv() }, { merge:true });
      if (liked) localStorage.removeItem(k); else localStorage.setItem(k, '1');
      return !liked;
    } catch(e) { console.warn('like', e); return liked; }
  }

  function listen(type, id, cb) {
    return ref(type, id).onSnapshot(s => cb(s.exists ? s.data() : {vues:0, likes:0, nbCommentaires:0}), e => console.warn('listen', e));
  }

  async function addComment(type, id, auteur, texte) {
    auteur = (auteur||'Anonyme').trim().slice(0,80);
    texte = (texte||'').trim().slice(0,2000);
    if (!texte) throw new Error('Commentaire vide');
    await ref(type, id).collection('commentaires').add({ auteur, texte, date:srv() });
    await ref(type, id).set({ type, itemId:id, nbCommentaires:inc(1) }, { merge:true });
  }

  function listenComments(type, id, cb) {
    return ref(type, id).collection('commentaires').orderBy('date','desc').limit(100)
      .onSnapshot(s => cb(s.docs.map(d => ({id:d.id, ...d.data()}))), e => console.warn('comments', e));
  }

  async function deleteComment(type, id, cid) {
    await ref(type, id).collection('commentaires').doc(cid).delete();
    await ref(type, id).set({ nbCommentaires:inc(-1) }, { merge:true });
  }

  /* ---------- Barre d'engagement ---------- */
  function buildBar(container, type, id, url, titre, opts) {
    if (!container) return;
    opts = opts || {};
    const compact = opts.compact === true;
    container.classList.add(compact ? 'eng-inline' : 'eng-bar');
    container.innerHTML = `
      <span class="eng-counter" data-cnt-vues>👁️ <b data-v>0</b></span>
      <span class="eng-counter" data-cnt-comments>💬 <b data-c>0</b></span>
      <button type="button" class="eng-btn-like" data-like><span class="ico">🤍</span> <span class="lbl">J'aime</span> <span data-l>0</span></button>
      <div class="eng-share">
        ${compact ? '' : '<span class="eng-share-label">Partager :</span>'}
        <a class="eng-share-btn wa" data-net="whatsapp" target="_blank" rel="noopener">📱 WhatsApp</a>
        <a class="eng-share-btn fb" data-net="facebook" target="_blank" rel="noopener">📘 Facebook</a>
        ${compact ? '' : '<a class="eng-share-btn tw" data-net="twitter" target="_blank" rel="noopener">🐦 X</a>'}
        ${compact ? '' : '<a class="eng-share-btn tg" data-net="telegram" target="_blank" rel="noopener">✈️ Telegram</a>'}
        <button type="button" class="eng-share-btn tk" data-net="tiktok">🎵 TikTok</button>
        <button type="button" class="eng-share-btn cp" data-net="copy">🔗 ${compact?'':'Copier'}</button>
      </div>
    `;
    listen(type, id, d => {
      const v = container.querySelector('[data-v]'); if (v) v.textContent = fmt(d.vues||0);
      const l = container.querySelector('[data-l]'); if (l) l.textContent = fmt(d.likes||0);
      const c = container.querySelector('[data-c]'); if (c) c.textContent = fmt(d.nbCommentaires||0);
    });

    const btnLike = container.querySelector('[data-like]');
    const setUI = liked => {
      btnLike.classList.toggle('liked', liked);
      btnLike.querySelector('.ico').textContent = liked ? '❤️' : '🤍';
      btnLike.querySelector('.lbl').textContent = liked ? 'Aimé' : "J'aime";
    };
    setUI(isLiked(type, id));
    btnLike.addEventListener('click', async e => {
      e.preventDefault(); e.stopPropagation();
      setUI(await toggleLike(type, id));
    });

    const urls = shareLinks(url, titre);
    container.querySelectorAll('[data-net]').forEach(el => {
      const net = el.dataset.net;
      if (net === 'copy' || net === 'tiktok') {
        el.addEventListener('click', async e => {
          e.preventDefault(); e.stopPropagation();
          try { await navigator.clipboard.writeText(url); const o = el.textContent; el.textContent = '✅ Copié !'; setTimeout(() => el.textContent = o, 1500); } catch(e) {}
        });
      } else if (urls[net]) {
        el.href = urls[net];
        el.addEventListener('click', e => e.stopPropagation());
      }
    });

    // Clic sur le compteur de commentaires → ouvre la modale
    const cntC = container.querySelector('[data-cnt-comments]');
    if (cntC) {
      cntC.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        openComments(type, id);
      });
    }
    return container;
  }

  /* ---------- Section commentaires complète ---------- */
  function buildComments(container, type, id) {
    if (!container) return;
    container.classList.add('eng-comments');
    container.innerHTML = `
      <h3 class="eng-comments-title">💬 Commentaires (<span data-count>0</span>)</h3>
      <form class="eng-form">
        <input type="text" name="nom" placeholder="Votre nom (optionnel)" maxlength="80">
        <textarea name="txt" placeholder="Votre commentaire…" maxlength="2000" required></textarea>
        <button type="submit" class="eng-submit">Envoyer</button>
        <div class="eng-msg"></div>
      </form>
      <div class="eng-list"><div class="eng-empty">Soyez le premier à commenter.</div></div>
    `;
    const list = container.querySelector('.eng-list');
    listen(type, id, d => { const c = container.querySelector('[data-count]'); if (c) c.textContent = d.nbCommentaires||0; });
    listenComments(type, id, arr => {
      if (!arr.length) { list.innerHTML = '<div class="eng-empty">Soyez le premier à commenter.</div>'; return; }
      list.innerHTML = arr.map(c => `
        <div class="eng-comment">
          <div class="eng-comment-head"><b>${esc(c.auteur)}</b><span>${timeAgo(c.date)}</span></div>
          <div class="eng-comment-body">${esc(c.texte).replace(/\n/g,'<br>')}</div>
        </div>
      `).join('');
    });
    const form = container.querySelector('.eng-form');
    const msg = container.querySelector('.eng-msg');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const nom = form.nom.value, txt = form.txt.value;
      if (!txt.trim()) return;
      const btn = form.querySelector('.eng-submit');
      btn.disabled = true; btn.textContent = 'Envoi…'; msg.textContent = '';
      try {
        await addComment(type, id, nom, txt);
        form.reset();
        msg.textContent = '✅ Publié !'; msg.style.color = '#4ade80';
        setTimeout(() => msg.textContent = '', 3000);
      } catch (err) {
        msg.textContent = '❌ ' + err.message; msg.style.color = '#ff8888';
      } finally { btn.disabled = false; btn.textContent = 'Envoyer'; }
    });
  }

  /* ---------- Modale de commentaires ---------- */
  let modalBuilt = false;
  function openComments(type, id) {
    let modal = document.getElementById('engCommentModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'engCommentModal';
      modal.className = 'eng-modal';
      modal.innerHTML = `<div class="eng-modal-content"><div class="eng-modal-header"><span class="eng-modal-title">💬 Commentaires</span><button class="eng-modal-close">✕</button></div><div class="eng-modal-body" id="engCommentBody"></div></div>`;
      document.body.appendChild(modal);
      modal.querySelector('.eng-modal-close').addEventListener('click', () => modal.classList.remove('open'));
      modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
    }
    const body = document.getElementById('engCommentBody');
    body.innerHTML = '';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    const closeObs = modal.querySelector('.eng-modal-close');
    closeObs.onclick = () => { modal.classList.remove('open'); document.body.style.overflow = ''; };
    buildComments(body, type, id);
  }

  /* ---------- Auto-traitement des .eng-inline ---------- */
  function autoProcess() {
    document.querySelectorAll('.eng-inline:not([data-ready])').forEach(el => {
      el.setAttribute('data-ready', '1');
      buildBar(el, el.dataset.type, el.dataset.id, el.dataset.url || location.href, el.dataset.titre || '', { compact: true });
    });
  }

  function startAuto() {
    let scheduled = false;
    function schedule() {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => { scheduled = false; autoProcess(); });
    }
    if (typeof MutationObserver !== 'undefined') {
      new MutationObserver(schedule).observe(document.body, { childList:true, subtree:true });
    }
    autoProcess();
  }

  window.Engagement = { view, toggleLike, isLiked, listen, addComment, listenComments, deleteComment, shareLinks, fmt, timeAgo, buildBar, buildComments, openComments, autoProcess, startAuto };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startAuto);
  else startAuto();
})();
