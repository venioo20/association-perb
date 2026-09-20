const menu=document.querySelector('.menu');const nav=document.querySelector('.nav');menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu?.setAttribute('aria-expanded','false')}));const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>io.observe(el));document.getElementById('year').textContent=new Date().getFullYear();


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
    'Bonjour,',
    '',
    'Je souhaite être accompagné(e) par l’association PERB.',
    '',
    'Nom et prénom : '+nom,
    'Adresse e-mail : '+email,
    'Téléphone : '+(telephone||'Non renseigné'),
    'Prochaine audience ou échéance : '+(echeance||'Non renseignée'),
    '',
    'Ma situation :',
    message,
    '',
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
