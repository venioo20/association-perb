const menu=document.querySelector('.menu');
const nav=document.querySelector('.nav');
menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu?.setAttribute('aria-expanded','false')}));

const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();

const helpForm=document.getElementById('help-form');
helpForm?.addEventListener('submit',event=>{
  event.preventDefault();
  const data=new FormData(helpForm);
  const nom=String(data.get('nom')||'').trim();
  const email=String(data.get('email')||'').trim();
  const telephone=String(data.get('telephone')||'').trim();
  const echeance=String(data.get('echeance')||'').trim();
  const message=String(data.get('message')||'').trim();
  const subject='Demande d’accompagnement PERB — '+nom;
  const body=[
    'Bonjour,','',
    'Je souhaite être accompagné(e) par l’association PERB.','',
    'Nom et prénom : '+nom,
    'Adresse e-mail : '+email,
    'Téléphone : '+(telephone||'Non renseigné'),
    'Prochaine audience ou échéance : '+(echeance||'Non renseignée'),'',
    'Ma situation :',message,'',
    'J’accepte que ces informations soient utilisées par PERB pour répondre à ma demande.'
  ].join('\n');
  const status=document.getElementById('form-status');
  if(status) status.textContent='Ouverture de votre messagerie… Si rien ne se passe, écrivez à contact@association-perb.fr.';
  window.location.href='mailto:contact@association-perb.fr?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
});

const copyMailButton=document.getElementById('copy-mail');
copyMailButton?.addEventListener('click',async()=>{
  const email=copyMailButton.dataset.email||'contact@association-perb.fr';
  const status=document.getElementById('form-status');
  try{
    await navigator.clipboard.writeText(email);
    copyMailButton.textContent='Adresse copiée ✓';
    if(status) status.textContent='Adresse copiée : '+email;
  }catch{
    if(status) status.textContent='Adresse e-mail : '+email;
  }
});

// --- PERB : actualités et dons ---
const liveCss=document.createElement('link');
liveCss.rel='stylesheet';
liveCss.href='assets/perb-live.css?v=20260929-1';
document.head.appendChild(liveCss);

const mainNav=document.querySelector('.nav nav');
if(mainNav && !mainNav.querySelector('a[href="#actualites"]')){
  const newsLink=document.createElement('a');
  newsLink.href='#actualites';
  newsLink.className='perb-nav-link';
  newsLink.textContent='Actualités';
  mainNav.appendChild(newsLink);
}

const navActions=document.querySelector('.nav-actions');
if(navActions && !navActions.querySelector('.perb-nav-don')){
  const donateLink=document.createElement('a');
  donateLink.href='#don';
  donateLink.className='nav-cta perb-nav-don';
  donateLink.innerHTML='Faire un don <span>❤</span>';
  navActions.appendChild(donateLink);
}

const aide=document.getElementById('aide');
if(aide){
  const news=document.createElement('section');
  news.id='actualites';
  news.className='perb-news';
  news.innerHTML=`
    <div class="perb-news-inner">
      <div class="perb-section-head">
        <div>
          <p class="section-kicker">Veille PERB</p>
          <h2>Actualités de la protection de l’enfance</h2>
        </div>
        <div>
          <p id="perb-news-intro">Réformes, avancées, défaillances documentées et faits directement liés à la protection des mineurs.</p>
          <p class="perb-source-note">Chaque sujet est daté et renvoie vers sa source d’origine.</p>
        </div>
      </div>
      <div id="perb-news-grid" class="perb-news-grid"><div class="perb-loading">Chargement des dernières actualités…</div></div>
      <p id="perb-news-updated" class="perb-news-foot"></p>
    </div>`;
  aide.insertAdjacentElement('beforebegin',news);

  const donation=document.createElement('section');
  donation.id='don';
  donation.className='perb-don';
  donation.innerHTML=`
    <div class="perb-don-inner">
      <div>
        <p class="section-kicker light">Soutenir l’association</p>
        <h2>Votre don nous aide à continuer d’accompagner les familles.</h2>
        <p>Les dons contribuent aux outils, aux démarches, à l’information des familles et au fonctionnement quotidien de PERB. Ils sont distincts de l’adhésion annuelle nécessaire pour un accompagnement approfondi.</p>
      </div>
      <div class="perb-don-card">
        <strong>Faire un don à PERB</strong>
        <p>Vous choisissez librement le montant. Le paiement est réalisé sur PayPal.</p>
        <a class="perb-don-button" href="https://paypal.me/RaphaelSartori596" target="_blank" rel="noopener noreferrer">Faire un don via PayPal ↗</a>
        <p class="perb-don-note">Un don ne remplace pas l’adhésion annuelle de 50 € lorsqu’un suivi approfondi est demandé.</p>
      </div>
    </div>`;
  aide.insertAdjacentElement('beforebegin',donation);
}

const formatNewsDate=value=>{
  try{return new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'long',year:'numeric'}).format(new Date(value+'T12:00:00'));}
  catch{return value;}
};

fetch('assets/actualites.json?v='+Date.now(),{cache:'no-store'})
  .then(response=>{if(!response.ok)throw new Error('HTTP '+response.status);return response.json();})
  .then(data=>{
    const grid=document.getElementById('perb-news-grid');
    const intro=document.getElementById('perb-news-intro');
    const updated=document.getElementById('perb-news-updated');
    if(intro && data.intro)intro.textContent=data.intro;
    if(grid){
      grid.innerHTML='';
      (data.items||[]).slice(0,6).forEach(item=>{
        const article=document.createElement('article');
        article.className='perb-news-card';
        const meta=document.createElement('div');
        meta.className='perb-news-meta';
        const tag=document.createElement('span');tag.className='perb-news-tag';tag.textContent=item.tag||'Actualité';
        const date=document.createElement('span');date.className='perb-news-date';date.textContent=formatNewsDate(item.date);
        meta.append(tag,date);
        const title=document.createElement('h3');title.textContent=item.title||'';
        const summary=document.createElement('p');summary.textContent=item.summary||'';
        const source=document.createElement('a');source.href=item.url||'#';source.target='_blank';source.rel='noopener noreferrer';source.textContent='Lire la source — '+(item.source||'Source');
        article.append(meta,title,summary,source);
        grid.appendChild(article);
      });
    }
    if(updated && data.lastUpdated)updated.textContent='Dernière mise à jour PERB : '+formatNewsDate(data.lastUpdated)+'.';
  })
  .catch(()=>{
    const grid=document.getElementById('perb-news-grid');
    if(grid)grid.innerHTML='<div class="perb-news-error">Les actualités sont momentanément indisponibles. Merci de réessayer plus tard.</div>';
  });

// Active aussi le comportement du menu pour les liens injectés après le chargement.
document.querySelectorAll('.perb-nav-link,.perb-nav-don').forEach(a=>a.addEventListener('click',()=>{nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false')}));

// --- PERB : témoignages anonymisés ---
const voicesDisclaimer=document.querySelector('.voices-disclaimer');
if(voicesDisclaimer){
  voicesDisclaimer.innerHTML='<strong>Témoignages anonymisés :</strong> ces textes synthétisent des situations réellement rencontrées par des familles. Les identités et certaines formulations ont été modifiées afin de préserver leur confidentialité.';
}
document.querySelectorAll('.voice-card footer').forEach(footer=>{
  footer.innerHTML='Parent accompagné <span>— identité protégée</span>';
});

// --- PERB : page avis ---
if(mainNav && !mainNav.querySelector('a[href="avis.html"]')){
  const reviewLink=document.createElement('a');
  reviewLink.href='avis.html';
  reviewLink.className='perb-nav-link';
  reviewLink.textContent='Donner son avis';
  mainNav.appendChild(reviewLink);
}
const voicesSection=document.querySelector('.voices');
if(voicesSection && !voicesSection.querySelector('.perb-review-cta')){
  const reviewCta=document.createElement('div');
  reviewCta.className='perb-review-cta reveal';
  reviewCta.style.marginTop='28px';
  reviewCta.innerHTML='<a class="button gold" href="avis.html">Laisser un avis <span>↗</span></a>';
  voicesSection.appendChild(reviewCta);
  io.observe(reviewCta);
}
