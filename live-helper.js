/* ============================================================
   LIVE HELPER — Fichier partagé
   À inclure dans toutes les pages qui affichent le live
   <script src="live-helper.js"></script>
   ============================================================ */

// ============================================================
// 1. DÉTECTION DE PLATEFORME (universelle)
// ============================================================
function detecterPlateforme(url) {
  if (!url || typeof url !== 'string') {
    return { nom: 'Inconnu', icone: '🔗', classe: 'btn-yt', lienDirect: '#', embed: url || '' };
  }
  const u = url.toLowerCase().trim();

  // YouTube
  if (u.includes('youtube.com') || u.includes('youtu.be')) {
    const id = url.match(/(?:embed\/|watch\?v=|youtu\.be\/|shorts\/|live\/)([^?&/]+)/);
    const vid = id ? id[1] : '';
    return {
      nom: 'YouTube',
      icone: '▶️',
      classe: 'btn-yt',
      lienDirect: vid ? 'https://www.youtube.com/watch?v=' + vid : 'https://www.youtube.com/',
      embed: vid ? 'https://www.youtube.com/embed/' + vid : ''
    };
  }

  // Google Drive
  if (u.includes('drive.google.com')) {
    const m = url.match(/\/d\/([^/]+)/);
    const id = m ? m[1] : '';
    return {
      nom: 'Google Drive',
      icone: '📁',
      classe: 'btn-drive',
      lienDirect: url,
      embed: id ? 'https://drive.google.com/file/d/' + id + '/preview' : ''
    };
  }

  // TikTok
  if (u.includes('tiktok.com')) {
    return { nom: 'TikTok', icone: '🎵', classe: 'btn-tk', lienDirect: url, embed: url };
  }

  // Facebook
  if (u.includes('facebook.com') || u.includes('fb.watch')) {
    // Facebook : lien d'intégration propre
    let embed = url;
    if (u.includes('facebook.com') && !u.includes('plugins/video')) {
      embed = 'https://www.facebook.com/plugins/video.php?href=' + encodeURIComponent(url);
    }
    return { nom: 'Facebook', icone: '📘', classe: 'btn-fb', lienDirect: url, embed: embed };
  }

  // Vimeo
  if (u.includes('vimeo.com')) {
    const m = url.match(/vimeo\.com\/(\d+)/);
    const id = m ? m[1] : '';
    return {
      nom: 'Vimeo',
      icone: '🎬',
      classe: 'btn-vimeo',
      lienDirect: url,
      embed: id ? 'https://player.vimeo.com/video/' + id : ''
    };
  }

  // Dailymotion
  if (u.includes('dailymotion.com') || u.includes('dai.ly')) {
    return { nom: 'Dailymotion', icone: '🎥', classe: 'btn-dailymotion', lienDirect: url, embed: url };
  }

  // Instagram
  if (u.includes('instagram.com')) {
    return { nom: 'Instagram', icone: '📸', classe: 'btn-fb', lienDirect: url, embed: url };
  }

  // Twitch
  if (u.includes('twitch.tv')) {
    const m = url.match(/twitch\.tv\/([^?&/]+)/);
    const chaine = m ? m[1] : '';
    return {
      nom: 'Twitch',
      icone: '🎮',
      classe: 'btn-vimeo',
      lienDirect: url,
      embed: chaine ? 'https://player.twitch.tv/?channel=' + chaine + '&parent=groupegbemadoyomin.com' : url
    };
  }

  // Twitter / X
  if (u.includes('twitter.com') || u.includes('x.com')) {
    return { nom: 'Twitter/X', icone: '🐦', classe: 'btn-fb', lienDirect: url, embed: url };
  }

  // Par défaut
  return { nom: 'Vidéo', icone: '🔗', classe: 'btn-yt', lienDirect: url, embed: url };
}

// ============================================================
// 2. VALIDATION UNIVERSELLE (par plateforme)
// ============================================================
function validerEmbedURL(url, plateforme) {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return { valide: false, raison: 'URL manquante ou vide' };
  }

  const u = url.toLowerCase().trim();

  // YouTube
  if (plateforme.nom === 'YouTube') {
    const match = url.match(/embed\/([^?&/]+)/);
    if (!match || !match[1] || match[1].length < 5) {
      return { valide: false, raison: 'ID de vidéo YouTube manquant (ex: .../embed/dQw4w9WgXcQ)' };
    }
    return { valide: true };
  }

  // Google Drive
  if (plateforme.nom === 'Google Drive') {
    const match = url.match(/\/d\/([^/]+)/);
    if (!match || !match[1] || match[1].length < 10) {
      return { valide: false, raison: 'ID de fichier Drive manquant' };
    }
    return { valide: true };
  }

  // Vimeo
  if (plateforme.nom === 'Vimeo') {
    const match = url.match(/vimeo\.com\/(\d+)/);
    if (!match || !match[1]) {
      return { valide: false, raison: 'ID de vidéo Vimeo manquant' };
    }
    return { valide: true };
  }

  // TikTok : doit contenir /video/ ou /live/
  if (plateforme.nom === 'TikTok') {
    if (!u.includes('/video/') && !u.includes('/live/')) {
      return { valide: false, raison: 'Lien TikTok invalide (doit contenir /video/ ou /live/)' };
    }
    return { valide: true };
  }

  // Facebook : doit contenir un lien vidéo
  if (plateforme.nom === 'Facebook') {
    if (!u.includes('facebook.com') && !u.includes('fb.watch')) {
      return { valide: false, raison: 'Lien Facebook invalide' };
    }
    return { valide: true };
  }

  // Pour les autres : on laisse passer
  return { valide: true };
}

// ============================================================
// 3. AFFICHER LE FALLBACK (universel)
// ============================================================
function afficherFallbackLive(plateforme, fallbackEl, btnsContainer, txtContainer, raison) {
  // Cacher l'iframe si présente
  const zone = document.getElementById('liveEmbedZone');
  if (zone) {
    const iframe = zone.querySelector('iframe');
    if (iframe) iframe.style.display = 'none';
  }

  // Texte adapté
  const raisonTxt = raison ? ' (' + raison + ')' : '';
  if (txtContainer) {
    txtContainer.textContent = 'Le direct ne peut pas s\'afficher dans la page' + raisonTxt + '. Rejoignez-le directement sur ' + plateforme.nom + ' :';
  }

  // Vider les boutons
  if (btnsContainer) {
    btnsContainer.innerHTML = '';

    // Bouton principal : plateforme détectée
    const btn1 = document.createElement('a');
    btn1.className = plateforme.classe;
    btn1.href = plateforme.lienDirect || '#';
    btn1.target = '_blank';
    btn1.rel = 'noopener';
    btn1.textContent = plateforme.icone + ' ' + plateforme.nom;
    btnsContainer.appendChild(btn1);

    // Boutons secondaires : autres réseaux du Groupe
    const autresReseaux = [
      { nom: 'Facebook', icone: '📘', classe: 'btn-fb', url: 'https://www.facebook.com/share/1KLJbHgA74/?mibextid=wwXIfr' },
      { nom: 'TikTok', icone: '🎵', classe: 'btn-tk', url: 'https://www.tiktok.com/@bokonon.gbemadoyomin' },
      { nom: 'YouTube', icone: '▶️', classe: 'btn-yt', url: 'https://www.youtube.com/' }
    ];

    autresReseaux.forEach(function (reseau) {
      if (reseau.nom.toLowerCase() !== plateforme.nom.toLowerCase()) {
        const btn = document.createElement('a');
        btn.className = reseau.classe;
        btn.href = reseau.url;
        btn.target = '_blank';
        btn.rel = 'noopener';
        btn.textContent = reseau.icone + ' ' + reseau.nom;
        btnsContainer.appendChild(btn);
      }
    });
  }

  // Afficher le fallback
  if (fallbackEl) fallbackEl.classList.add('visible');
}

// ============================================================
// 4. CHARGER LE LIVE UNIVERSEL
// Usage : chargerLiveUniversel(db);
// ============================================================
async function chargerLiveUniversel(db) {
  if (!db) {
    console.warn('[Live] Base de données non fournie');
    return;
  }

  try {
    const snap = await db.collection('live').get();
    if (snap.empty) return;

    const data = snap.docs[0].data();
    if (!data.actif || !data.embedURL) return;

    // Bandeau
    const banner = document.getElementById('liveBanner');
    if (banner) {
      banner.classList.add('actif');
      const txt = document.getElementById('liveBannerText');
      if (txt) txt.textContent = '🔴 EN DIRECT — ' + (data.titre || 'Live en cours');
    }

    // Section
    const embedSection = document.getElementById('live-embed');
    if (embedSection) embedSection.style.display = 'block';

    const titleEl = document.getElementById('liveEmbedTitle');
    if (titleEl) titleEl.textContent = '🔴 EN DIRECT — ' + (data.titre || 'Live en cours');

    // Zone d'embed
    const zone = document.getElementById('liveEmbedZone');
    const fallback = document.getElementById('liveFallback');
    const fallbackBtns = document.getElementById('liveFallbackBtns');
    const fallbackText = document.getElementById('liveFallbackText');

    if (!zone) return;

    // Nettoyer
    zone.innerHTML = '';
    if (fallback) fallback.classList.remove('visible');

    // Détecter la plateforme
    const plateforme = detecterPlateforme(data.embedURL);

    // Valider l'URL
    const validation = validerEmbedURL(data.embedURL, plateforme);

    if (!validation.valide) {
      console.warn('[Live] URL invalide :', validation.raison);
      afficherFallbackLive(plateforme, fallback, fallbackBtns, fallbackText, validation.raison);
      return;
    }

    // Construire l'URL d'embed (utiliser la version normalisée)
    let embedURL = plateforme.embed || data.embedURL;
    if (plateforme.nom === 'YouTube' && !embedURL.includes('?')) {
      embedURL += '?autoplay=0&rel=0';
    }

    // Créer l'iframe
    const iframe = document.createElement('iframe');
    iframe.src = embedURL;
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.style.cssText = 'width:100%;height:100%;border:none;position:absolute;inset:0;';
    zone.appendChild(iframe);

    // Détection du chargement (6 secondes)
    let liveLoaded = false;
    iframe.onload = function () { liveLoaded = true; };
    iframe.onerror = function () {
      afficherFallbackLive(plateforme, fallback, fallbackBtns, fallbackText);
    };

    setTimeout(function () {
      if (!liveLoaded) {
        afficherFallbackLive(plateforme, fallback, fallbackBtns, fallbackText);
      }
    }, 6000);

  } catch (err) {
    console.error('[Live] Erreur :', err);
  }
}
