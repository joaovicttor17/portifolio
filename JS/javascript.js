/* ======================================================================
   SCRIPT.JS — O COMPORTAMENTO DO PORTFÓLIO ANIMADO
   ----------------------------------------------------------------------
   Este arquivo cuida das três partes "vivas" da página:
     1) [EFEITO 1] Esconder o loader (tela de carregamento);
     2) [EFEITO 2] Revelar as seções conforme entram na tela;
     3) Trocar o visual do cabeçalho quando a página é rolada.
   Tudo em JavaScript puro (sem bibliotecas), didático e comentado.
   ====================================================================== */


/* ======================================================================
   PASSO 0 — REFERÊNCIAS AOS ELEMENTOS DA PÁGINA
   ----------------------------------------------------------------------
   "Pescamos" os elementos UMA única vez e guardamos em variáveis.
   Assim, quando precisarmos deles, não varremos o HTML de novo — e o
   código fica curto e legível.
   ====================================================================== */

const loader = document.getElementById('loader'); // a tela escura com o spinner
const nav    = document.getElementById('nav');    // o cabeçalho fixo do topo

// Marca o corpo como "carregando" → CSS trava a rolagem da página
// (evita que o usuário role para o meio do nada enquanto o loader aparece).
document.body.classList.add('is-loading');


/* ======================================================================
   [EFEITO 1] ESCONDER O LOADER E REVELAR O SITE
   ----------------------------------------------------------------------
   Estratégia:
     • Enquanto carrega: spinner girando no meio da tela escura;
     • Quando termina: adicionamos .hide (que faz fade-out via CSS);
     • Depois do fade (600ms), removemos o elemento da árvore e
       SÓ ENTÃO ligamos as animações de entrada — assim a cascata do
       herói acontece na hora exata em que o site aparece. 😉
   ====================================================================== */

function esconderLoader() {

  if (loader.classList.contains('hide')) return; // proteção: roda só uma vez

  loader.classList.add('hide');                  // dispara o fade no CSS
  document.body.classList.remove('is-loading');  // devolve a rolagem normal

  setTimeout(() => {                             // espera o fade terminar…

    loader.remove();        // tira o loader de cena (destrói de vez)

    iniciarReveals();       // liga as animações de revelação das seções

  }, 600);                                      // …tempo igual ao do CSS (.55s+)
}

// O evento "load" só dispara quando TUDO terminou de carregar
// (imagens, fontes externas, scripts…). Aí damos um tempinho mínimo
// de 500ms para o spinner ser visto pelo aluno (efeito proposital).
window.addEventListener('load', () => setTimeout(esconderLoader, 3000));

// Cinto e suspensório: se algo travar o carregamento (uma fonte que não
// responde, por exemplo), escondemos o loader em, no máximo, 4 segundos.
// Garante que a pessoa NUNCA fique presa numa tela preta.
setTimeout(esconderLoader, 4000);


/* ======================================================================
   [EFEITO 2] REVELAR AS SEÇÕES AO ROLAR (scroll reveal)
   ----------------------------------------------------------------------
   Usamos o IntersectionObserver ("observador de interseção"):
   ele avisa sempre que um elemento entra (ou sai) da área visível
   da tela. Ao entrar, adicionamos .active → o CSS faz o efeito
   suave de subida. Cada elemento é "desobservado" depois de aparecer,
   então a animação acontece UMA ÚNICA VEZ por elemento.
   ====================================================================== */

function iniciarReveals() {

  // Junta todos os elementos marcados com a classe .reveal no HTML.
  const elementos = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {

    // cria o observador com a regra do aviso dentro dele
    const observador = new IntersectionObserver((entradas) => {

      entradas.forEach((entrada) => {              // lista de avisos recebidos

        if (entrada.isIntersecting) {              // o elemento está aparecendo?

          entrada.target.classList.add('active');  // sim → revela (CSS anima)

          observador.unobserve(entrada.target);    // para de observar este item
        }                                          // (ele já fez seu papel)
      });
    }, { threshold: 0.15 });                        /* threshold:0.15 = dispare
                                                       quando 15% do elemento
                                                       estiver visível. */

    // entrega cada elemento ao observador individualmente
    elementos.forEach((el) => observador.observe(el));

  } else {

    // Fallback: navegadores antigos não conhecem o observador.
    // Nesse caso mostramos tudo imediatamente, sem animação nenhuma.
    elementos.forEach((el) => el.classList.add('active'));
  }
}


/* ======================================================================
   BÔNUS — CABEÇALHO QUE MUDA AO ROLAR
   ----------------------------------------------------------------------
   Passando dos 24px de rolagem, o cabeçalho ganha fundo mais sólido,
   borda inferior visível e sombra (classe .scrolled, que existe no CSS).
   O "passive: true" avisa ao navegador que não vamos impedir a rolagem
   nativa — deixa a experiência mais fluida.
   ====================================================================== */

window.addEventListener('scroll', () => {

  // toggle = liga quando passa de 24px, desliga quando volta acima disso
  nav.classList.toggle('scrolled', window.scrollY > 24);

}, { passive: true });


/* ======================================================================
   RESUMÃO PARA A PROVA ORAL 😄
   ----------------------------------------------------------------------
   • loader + fade ................. esconderLoader()
   • revelar ao rolar .............. IntersectionObserver + classe .active
   • atraso em cascata ............. classes .d1…d6 (no CSS)
   • cabeçalho ao rolar ............ classList.toggle('scrolled')
   • tudo desligável ............... prefers-reduced-motion (no CSS)
   ====================================================================== */
