/* Infine Viagens — main.js */

// ─── NAV SCROLL BEHAVIOR ──────────────────────────────────
const nav = document.getElementById('nav');

function updateNav() {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ─── MOBILE MENU ─────────────────────────────────────────
const burger   = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// ─── FADE-IN ON SCROLL ───────────────────────────────────
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = entry.target.parentElement.querySelectorAll('.fade-in');
        const idx = Array.from(siblings).indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

fadeEls.forEach(el => observer.observe(el));

// ─── SERVIÇOS — SELEÇÃO E PRÉ-PREENCHIMENTO ──────────────
(function () {
  const grid         = document.getElementById('servicosGrid');
  const destacadoBtn = document.querySelector('.servicos__destaque-btn');
  const ctaBtn       = document.getElementById('servicosCta');
  const hint         = document.getElementById('servicosHint');
  const aviso        = document.getElementById('servicosAviso');
  const msgField     = document.getElementById('mensagem');
  const submitBtn    = document.getElementById('formSubmitBtn');

  if (!grid || !ctaBtn) return;

  // null = nunca aplicada; array = última seleção aplicada ao formulário
  let aplicada = null;

  function scrollTo(el) {
    const offset = nav.offsetHeight + 16;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  function getSelecaoAtual() {
    const itens = [];
    if (destacadoBtn && destacadoBtn.classList.contains('selected')) {
      itens.push(destacadoBtn.dataset.servico);
    }
    grid.querySelectorAll('.servico-chip.selected').forEach(c => itens.push(c.dataset.servico));
    return itens;
  }

  function arrayIgual(a, b) {
    if (!a || !b || a.length !== b.length) return false;
    return a.every((v, i) => v === b[i]);
  }

  // Seleção está pendente de aplicação?
  function isPendente() {
    const atual = getSelecaoAtual();
    if (atual.length === 0) return false;
    // Se nunca aplicou: é pendente assim que tiver seleção
    if (aplicada === null) return true;
    // Se aplicou mas mudou depois: também é pendente
    return !arrayIgual(atual, aplicada);
  }

  function atualizarEstado() {
    const atual = getSelecaoAtual();
    const temSelecao = atual.length > 0;
    const pendente   = isPendente();

    // Botão CTA de serviços
    if (!temSelecao) {
      ctaBtn.disabled = true;
      ctaBtn.classList.remove('servicos__cta--ativo');
      hint.textContent = 'Selecione ao menos um serviço acima.';
    } else {
      ctaBtn.disabled = false;
      ctaBtn.classList.add('servicos__cta--ativo'); // estilo pontilhado
      hint.textContent = pendente && aplicada !== null
        ? 'Você alterou a seleção — clique para atualizar a mensagem.'
        : '';
    }

    // Botão de envio do formulário: esmaecido se há seleção pendente
    if (submitBtn) {
      if (pendente) {
        submitBtn.classList.add('btn--bloqueado');
      } else {
        submitBtn.classList.remove('btn--bloqueado');
      }
    }

    // Aviso na seção de serviços
    if (aviso) {
      aviso.hidden = !(pendente && aplicada !== null);
    }
  }

  // Toggle chips regulares
  grid.querySelectorAll('.servico-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
      atualizarEstado();
    });
  });

  // Toggle card destaque
  if (destacadoBtn) {
    destacadoBtn.addEventListener('click', () => {
      const ativo = destacadoBtn.classList.toggle('selected');
      destacadoBtn.textContent = ativo ? '✓ Selecionado' : 'Selecionar este serviço';
      atualizarEstado();
    });
  }

  // CTA — aplica seleção ao formulário e rola até ele
  ctaBtn.addEventListener('click', () => {
    const atual = getSelecaoAtual();
    if (atual.length === 0) return;

    aplicada = [...atual];

    // Pré-preenche o campo mensagem
    if (msgField) {
      const lista = aplicada.map(s => `• ${s}`).join('\n');
      msgField.value = `Olá! Tenho interesse nos seguintes serviços:\n${lista}\n\nGostaria de saber mais.`;
    }

    atualizarEstado();

    // Rola até o formulário
    const contato = document.getElementById('contato');
    if (contato) scrollTo(contato);
  });

  // Formulário: bloquear envio se há seleção pendente de aplicação
  const form = document.getElementById('contatoForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      if (isPendente()) {
        e.preventDefault();
        // Rola de volta para a seção de serviços
        const servicosSection = document.getElementById('servicos');
        if (servicosSection) scrollTo(servicosSection);
        // Garante que o aviso apareça
        if (aviso) aviso.hidden = false;
        atualizarEstado();
      }
    }, true); // capture — roda antes do handler de validação
  }

  // Estado inicial
  atualizarEstado();
})();

// ─── CONTACT FORM — VALIDAÇÃO + WHATSAPP + FORMSPREE ─────
const form = document.getElementById('contatoForm');

if (form) {
  form.addEventListener('submit', (e) => {
    const nome     = form.querySelector('#nome').value.trim();
    const email    = form.querySelector('#email').value.trim();
    const whatsapp = form.querySelector('#whatsapp') ? form.querySelector('#whatsapp').value.trim() : '';
    const mensagem = form.querySelector('#mensagem') ? form.querySelector('#mensagem').value.trim() : '';

    // Validação campos obrigatórios
    if (!nome || !email) {
      e.preventDefault();
      const firstEmpty = !nome
        ? form.querySelector('#nome')
        : form.querySelector('#email');
      firstEmpty.focus();
      firstEmpty.style.borderColor = '#C4826D';
      setTimeout(() => { firstEmpty.style.borderColor = ''; }, 2000);
      return;
    }

    // Envia mensagem via WhatsApp (abre em nova aba)
    let waMsg = `*Nova mensagem — Infine Viagens*\n\n`;
    waMsg += `Nome: ${nome}\n`;
    waMsg += `E-mail: ${email}\n`;
    if (whatsapp) waMsg += `WhatsApp: ${whatsapp}\n`;
    if (mensagem) waMsg += `\nMensagem:\n${mensagem}`;
    window.open(`https://wa.me/5547991118583?text=${encodeURIComponent(waMsg)}`, '_blank');

    // Demo mode: Formspree ID não configurado — mostra sucesso localmente
    if (form.action.includes('SEU_ID_FORMSPREE')) {
      e.preventDefault();
      form.innerHTML = `
        <div class="form-success">
          <h3>Mensagem recebida.</h3>
          <p>Obrigada, ${nome}. A Leila vai entrar em contato em breve.</p>
          <p style="margin-top:.5rem; font-size:.85rem; opacity:.6">
            Enquanto isso, siga a Infine no Instagram para se conectar com o que está por vir.
          </p>
        </div>
      `;
    }
    // else: Formspree real — o POST acontece naturalmente
  });
}

// ─── SMOOTH SCROLL OFFSET (for fixed nav) ────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = nav.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
