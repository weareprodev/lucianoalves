import { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowUpRight, Menu, X, Phone, Mail, MapPin, Plus, MessageCircle, ArrowUp } from 'lucide-react';

// ---------- DATA ----------
const PROJETOS = [
  { tag: 'RESIDENCIAL', nome: 'RESIDÊNCIA HORIZONTE', local: 'Chapadão do Sul — MS', ano: '2024', area: '480 m²',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80&auto=format&fit=crop' },
  { tag: 'COMERCIAL', nome: 'EDIFÍCIO MERIDIANO', local: 'Campo Grande — MS', ano: '2024', area: '3.200 m²',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80&auto=format&fit=crop' },
  { tag: 'INDUSTRIAL', nome: 'GALPÃO LOGÍSTICA SUL', local: 'Dourados — MS', ano: '2023', area: '6.800 m²',
    img: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=1600&q=80&auto=format&fit=crop' },
  { tag: 'ESTRUTURAL', nome: 'PONTE DO RIO VERDE', local: 'Mato Grosso do Sul', ano: '2023', area: '220 m lineares',
    img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=80&auto=format&fit=crop' },
  { tag: 'RESIDENCIAL', nome: 'CONDOMÍNIO ALVORADA', local: 'Chapadão do Sul — MS', ano: '2023', area: '12 unidades',
    img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600&q=80&auto=format&fit=crop' },
  { tag: 'COMERCIAL', nome: 'CENTRO CLÍNICO VÉRTICE', local: 'Campo Grande — MS', ano: '2022', area: '1.450 m²',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80&auto=format&fit=crop' },
];

const SERVICOS = [
  { n: '01', titulo: 'PROJETO ESTRUTURAL', desc: 'Cálculo e dimensionamento de estruturas em concreto armado, aço e madeira. Memórias de cálculo, pranchas executivas e detalhamentos conforme NBR 6118 / NBR 8800.' },
  { n: '02', titulo: 'GERENCIAMENTO DE OBRA', desc: 'Coordenação executiva, cronograma físico-financeiro, controle de custos e fiscalização técnica em canteiro. Prestação de contas transparente ao proprietário.' },
  { n: '03', titulo: 'CONSULTORIA E LAUDOS', desc: 'Vistorias prediais, laudos técnicos, patologia das construções, perícia judicial e parecer técnico para regularização e compra/venda de imóveis.' },
  { n: '04', titulo: 'REGULARIZAÇÃO E ART', desc: 'Emissão de ART, RRT, alvarás, habite-se e regularização junto à Prefeitura, CREA e Corpo de Bombeiros. Documentação completa para averbação em cartório.' },
  { n: '05', titulo: 'ORÇAMENTO E PLANEJAMENTO', desc: 'Orçamento detalhado com curva ABC, planejamento 4D, análise de viabilidade técnico-econômica e suporte à tomada de decisão de investimento.' },
  { n: '06', titulo: 'EXECUÇÃO DE OBRAS', desc: 'Construção completa — residencial, comercial e industrial — com equipe própria, controle tecnológico do concreto e entrega chave-na-mão no prazo contratado.' },
];

const STATS = [
  { n: 14, suffix: '', label: 'ANOS DE EXPERIÊNCIA' },
  { n: 92, suffix: '', label: 'PROJETOS ENTREGUES' },
  { n: 48, suffix: 'K', label: 'M² CONSTRUÍDOS' },
  { n: 100, suffix: '%', label: 'PRAZO CUMPRIDO' },
];

const MARQUEE_ITEMS = [
  'PROJETO ESTRUTURAL', 'GERENCIAMENTO DE OBRA', 'CONSULTORIA TÉCNICA',
  'LAUDOS E PERÍCIA', 'REGULARIZAÇÃO', 'ART ASSINADA',
  'NBR 6118', 'NBR 8800', 'ENGENHARIA CIVIL', 'CREA 123456/D',
];

// ---------- CUSTOM HOOKS ----------
const useReveal = (options = {}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px', ...options }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
};

const useCountUp = (target, visible, duration = 1600) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, target, duration]);
  return value;
};

const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return progress;
};

// ---------- PRIMITIVES ----------
const Container = ({ children, className = '' }) => (
  <div className={`w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 ${className}`}>{children}</div>
);

const Eyebrow = ({ children, className = '' }) => (
  <span className={`la-font-body la-text-dim la-track-eyebrow text-[11px] uppercase font-medium ${className}`}>
    {children}
  </span>
);

const Display = ({ children, className = '', as: As = 'h2' }) => (
  <As className={`la-font-display uppercase la-track-tight leading-[0.92] ${className}`}>
    {children}
  </As>
);

const Button = ({ children, onClick, variant = 'outline', className = '' }) => (
  <button onClick={onClick} className={`la-btn ${variant === 'solid' ? 'la-btn-solid' : 'la-btn-outline'} ${className}`}>
    <span>{children}</span>
    <ArrowRight size={14} strokeWidth={2.5} />
  </button>
);

const Reveal = ({ children, delay = 0, className = '' }) => {
  const [ref, visible] = useReveal();
  const delayClass = delay > 0 ? `la-reveal-delay-${delay}` : '';
  return (
    <div ref={ref} className={`la-reveal ${delayClass} ${visible ? 'is-visible' : ''} ${className}`}>
      {children}
    </div>
  );
};

const MaskReveal = ({ children, delay = 0, className = '' }) => {
  const [ref, visible] = useReveal();
  const delayClass = delay > 0 ? `la-mask-delay-${delay}` : '';
  return (
    <span ref={ref} className={`la-mask-wrap ${delayClass} ${visible ? 'is-visible' : ''} ${className}`}>
      <span className="la-mask-line">{children}</span>
    </span>
  );
};

const NavLink = ({ label, active, onClick, tone = 'default' }) => (
  <button
    onClick={onClick}
    className={`la-font-body relative py-2 text-[11px] la-track-label font-semibold uppercase ${
      tone === 'light'
        ? active
          ? 'la-nav-hero-active la-nav-active-light'
          : 'la-nav-hero'
        : active
          ? 'la-text-ink la-nav-active'
          : 'la-text-ink-70 hover:la-text-ink'
    }`}
  >
    <span className="la-nav-item">
      <span data-text={label}>{label}</span>
    </span>
  </button>
);

// ---------- SCROLL PROGRESS ----------
const ScrollProgress = () => {
  const progress = useScrollProgress();
  return <div className="la-scroll-progress" style={{ width: `${progress}%` }} />;
};

// ---------- FLOATING ACTIONS ----------
const FloatingActions = () => {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      <a
        href="https://wa.me/5567999999999?text=Ol%C3%A1%2C%20gostaria%20de%20conversar%20sobre%20um%20projeto."
        target="_blank"
        rel="noopener noreferrer"
        className="la-float-btn la-float-wa is-visible"
        aria-label="WhatsApp"
      >
        <MessageCircle size={20} strokeWidth={1.75} />
      </a>
      <button
        onClick={scrollTop}
        className={`la-float-btn la-float-top ${showTop ? 'is-visible' : ''}`}
        aria-label="Voltar ao topo"
      >
        <ArrowUp size={18} strokeWidth={1.75} />
      </button>
    </>
  );
};

// ---------- HEADER ----------
const Header = ({ currentPage, setCurrentPage, menuOpen, setMenuOpen }) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const isHeroTop = currentPage === 'inicio' && !hasScrolled;

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const nav = [
    { id: 'inicio', label: 'INÍCIO' },
    { id: 'projetos', label: 'PROJETOS' },
    { id: 'servicos', label: 'SERVIÇOS' },
    { id: 'quemsomos', label: 'QUEM SOMOS' },
    { id: 'contato', label: 'FALE CONOSCO' },
  ];
  const headerLogoSrc = (menuOpen || !isHeroTop)
    ? '/Vector black.png'
    : '/2020-02-03 - 008 2 [Vectorized].png';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${isHeroTop ? 'la-header-hero' : 'la-glass border-b la-border-hairline la-header-scrolled'}`}>
        <Container className="flex items-center justify-between h-16 md:h-20">
          <button
            onClick={() => setCurrentPage('inicio')}
            className="flex items-center group w-[52px] md:w-[64px] h-8 md:h-10 shrink-0"
          >
            <img
              src={headerLogoSrc}
              alt="Luciano Alves Engenharia Civil"
              className="w-full h-full object-contain transition-transform duration-500 group-hover:-translate-x-1"
              style={{ transitionTimingFunction: 'var(--la-ease)' }}
            />
          </button>

          <nav className="hidden lg:flex items-center gap-8">
            {nav.map((item) => (
              <NavLink
                key={item.id}
                label={item.label}
                active={currentPage === item.id}
                tone={isHeroTop ? 'light' : 'default'}
                onClick={() => setCurrentPage(item.id)}
              />
            ))}
          </nav>

          <div className="hidden lg:block">
            <button
              onClick={() => setCurrentPage('contato')}
              className={`la-btn ${isHeroTop ? 'la-btn-hero' : 'la-btn-outline'}`}
              style={{ padding: '10px 18px', fontSize: '11px' }}
            >
              <span>ORÇAMENTO</span>
              <ArrowUpRight size={12} strokeWidth={2.5} />
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`lg:hidden p-2 transition-transform duration-300 hover:rotate-90 ${isHeroTop ? 'la-text-bg' : 'la-text-ink'}`}
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
          </button>
        </Container>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 la-glass-strong pt-20 lg:hidden la-page">
          <Container className="py-8">
            <nav className="flex flex-col">
              {nav.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => { setCurrentPage(item.id); setMenuOpen(false); }}
                  className={`la-font-display text-left py-5 border-b la-border-hairline text-[32px] font-bold la-track-tight uppercase transition-all duration-500 hover:translate-x-2 ${
                    currentPage === item.id ? 'la-text-ink' : 'la-text-dim hover:la-text-ink'
                  }`}
                  style={{
                    animation: `la-fade-up 600ms var(--la-ease-out) ${i * 70}ms both`,
                  }}
                >
                  <span className="la-font-body text-[11px] la-track-wide la-text-faintest font-medium mr-4 align-middle">
                    0{i + 1}
                  </span>
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="mt-10 space-y-3" style={{ animation: 'la-fade-up 600ms var(--la-ease-out) 400ms both' }}>
              <div className="la-font-body text-[11px] la-track-eyebrow la-text-dim uppercase">Contato direto</div>
              <a href="tel:+5567999999999" className="la-font-body block text-[15px] la-text-ink la-link">+55 (67) 99999-9999</a>
              <a href="mailto:contato@lucianoalves.eng.br" className="la-font-body block text-[15px] la-text-ink la-link">contato@lucianoalves.eng.br</a>
            </div>
          </Container>
        </div>
      )}
    </>
  );
};

// ---------- PROJECT CARD ----------
const ProjectCard = ({ p, index = 0 }) => (
  <Reveal delay={Math.min(index + 1, 4)}>
    <div className="la-card la-bg-elevated cursor-pointer">
      <div className="la-card-img-wrap aspect-[4/5]">
        <div className="la-card-img absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${p.img})` }} />
        <div className="la-card-overlay" />
        <div className="absolute top-5 left-5">
          <span
            className="la-card-tag la-font-body inline-block px-2.5 py-1 border text-[10px] la-track-eyebrow uppercase font-semibold"
            style={{ borderColor: 'rgba(232,230,225,0.6)', background: 'rgba(31,30,28,0.45)', backdropFilter: 'blur(6px)', color: 'var(--la-bg)' }}
          >
            {p.tag}
          </span>
        </div>
        <div className="la-card-plus absolute top-5 right-5" style={{ color: 'var(--la-bg)' }}>
          <Plus size={20} strokeWidth={1.5} />
        </div>
      </div>
      <div className="la-card-body">
        <div className="la-card-title la-font-display text-[20px] md:text-[24px] leading-tight uppercase la-text-ink font-bold la-track-tight">
          {p.nome}
        </div>
        <div className="la-font-body mt-4 flex items-center justify-between text-[11px] la-track-label uppercase la-text-muted font-medium">
          <span>{p.local}</span>
          <span>{p.ano} · {p.area}</span>
        </div>
      </div>
    </div>
  </Reveal>
);

// ---------- STAT ITEM ----------
const StatItem = ({ stat, index }) => {
  const [ref, visible] = useReveal();
  const value = useCountUp(stat.n, visible, 1600 + index * 100);
  return (
    <div
      ref={ref}
      className={`py-10 md:py-14 px-4 md:px-8 ${index !== 0 ? 'md:border-l' : ''} ${index !== 0 && index % 2 !== 0 ? 'border-l' : ''} ${index >= 2 ? 'border-t md:border-t-0' : ''} la-border-hairline`}
    >
      <div className="la-font-display text-[48px] md:text-[72px] lg:text-[88px] leading-none la-text-ink font-bold tabular-nums">
        {value}{stat.suffix}
      </div>
      <div
        className="la-font-body mt-3 text-[10px] md:text-[11px] la-track-eyebrow la-text-dim uppercase font-medium"
        style={{
          transition: 'transform 700ms var(--la-ease), opacity 700ms var(--la-ease)',
          transform: visible ? 'translateX(0)' : 'translateX(-8px)',
          opacity: visible ? 1 : 0,
          transitionDelay: `${600 + index * 80}ms`,
        }}
      >
        {stat.label}
      </div>
    </div>
  );
};

// ---------- PAGE: INÍCIO ----------
const PageInicio = ({ setCurrentPage }) => {
  const heroRef = useRef(null);
  const heroBgRef = useRef(null);

  useEffect(() => {
    let raf = 0;

    const updateHeroFrame = () => {
      raf = 0;
      const heroNode = heroRef.current;
      const bgNode = heroBgRef.current;
      if (!heroNode || !bgNode) return;

      if (window.matchMedia('(max-width: 768px)').matches) {
        bgNode.style.backgroundPosition = 'center top';
        return;
      }

      const heroTop = heroNode.offsetTop;
      const heroHeight = heroNode.offsetHeight || window.innerHeight;
      const y = window.scrollY || 0;
      const progress = Math.min(Math.max((y - heroTop) / heroHeight, 0), 1);
      const positionY = `${Math.round(progress * 100)}%`;

      bgNode.style.backgroundPosition = `center ${positionY}`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(updateHeroFrame);
    };

    updateHeroFrame();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="la-page">
    {/* HERO */}
    <section ref={heroRef} className="relative min-h-[100svh] md:min-h-screen flex items-end justify-center overflow-hidden">
      <div
        ref={heroBgRef}
        className="absolute inset-0 la-hero-bg"
        style={{
          backgroundPosition: 'center 0%',
          filter: 'grayscale(0.06) brightness(1.01)',
          animation: 'la-fade-in 2000ms var(--la-ease-out) both',
        }}
      />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: 'linear-gradient(to top, rgba(232,230,225,0.22) 0%, rgba(232,230,225,0.08) 45%, rgba(232,230,225,0.03) 100%)' }}
      />

      <Container className="la-hero-content relative z-10 w-full pb-24 md:pb-20 lg:pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="la-hero-ctas flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button variant="solid" className="la-btn-hero-primary" onClick={() => setCurrentPage('contato')}>AGENDAR CONSULTA</Button>
            <Button className="la-btn-outline-light" onClick={() => setCurrentPage('projetos')}>VER PROJETOS</Button>
          </div>
        </div>
      </Container>
    </section>

    {/* MARQUEE */}
    <section className="border-y la-border-hairline py-5 overflow-hidden">
      <div className="la-marquee">
        {[0, 1].map((dup) => (
          <div className="la-marquee-track" key={dup} aria-hidden={dup === 1}>
            {MARQUEE_ITEMS.map((item, i) => (
              <span
                key={`${dup}-${i}`}
                className="la-font-body text-[11px] la-track-label uppercase la-text-muted font-medium flex items-center gap-12"
              >
                {item}
                <span className="la-text-faintest">—</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>

    {/* STATS */}
    <section className="border-b la-border-hairline">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4">
          {STATS.map((s, i) => <StatItem key={s.label} stat={s} index={i} />)}
        </div>
      </Container>
    </section>

    {/* MANIFESTO */}
    <section className="py-28 md:py-40 border-b la-border-hairline">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12">
          <Reveal className="lg:col-span-4">
            <Eyebrow>01 · MÉTODO</Eyebrow>
          </Reveal>
          <div className="lg:col-span-8">
            <h2 className="la-font-display uppercase la-track-tight leading-[0.92] text-[36px] md:text-[56px] lg:text-[72px] la-text-ink">
              <MaskReveal>ENGENHARIA NÃO É OPINIÃO.</MaskReveal>
              <MaskReveal delay={1}><span className="la-text-ink-40">É CÁLCULO, CRONOGRAMA</span></MaskReveal>
              <MaskReveal delay={2}><span className="la-text-ink-40">E RESPONSABILIDADE TÉCNICA.</span></MaskReveal>
            </h2>
            <Reveal delay={3}>
              <p className="la-font-body mt-10 max-w-2xl text-[16px] leading-[1.7] la-text-body-soft">
                Trabalhamos sob três princípios não-negociáveis: segurança estrutural acima de
                qualquer prazo comercial; transparência total sobre custos reais; e comunicação
                técnica inteligível para quem contrata. Cada projeto é assinado, com ART emitida
                no CREA, e acompanhado por relatórios executivos periódicos.
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>

    {/* PROJETOS */}
    <section className="pb-28 md:pb-40 border-b la-border-hairline">
      <Container className="pt-20 md:pt-28">
        <Reveal>
          <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
            <div>
              <Eyebrow>02 · PORTFÓLIO SELECIONADO</Eyebrow>
              <Display className="mt-4 text-[40px] md:text-[64px] la-text-ink">PROJETOS RECENTES</Display>
            </div>
            <button
              onClick={() => setCurrentPage('projetos')}
              className="la-font-body la-link text-[11px] la-track-eyebrow uppercase la-text-muted inline-flex items-center gap-2 font-semibold"
            >
              VER TODOS
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </button>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px la-bg-hairline">
          {PROJETOS.slice(0, 3).map((p, i) => <ProjectCard key={p.nome} p={p} index={i} />)}
        </div>
      </Container>
    </section>

    {/* CTA FINAL */}
    <section className="border-b la-border-hairline">
      <Container>
        <Reveal>
          <div className="py-20 md:py-28 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            <Display className="text-[40px] md:text-[64px] lg:text-[80px] la-text-ink max-w-3xl">
              VAMOS CONSTRUIR
              <br /><span className="la-text-ink-40">O PRÓXIMO?</span>
            </Display>
            <Button variant="solid" onClick={() => setCurrentPage('contato')}>SOLICITAR ORÇAMENTO</Button>
          </div>
        </Reveal>
      </Container>
    </section>
    </div>
  );
};

// ---------- PAGE: PROJETOS ----------
const PageProjetos = () => {
  const [filtro, setFiltro] = useState('TODOS');
  const tags = ['TODOS', 'RESIDENCIAL', 'COMERCIAL', 'INDUSTRIAL', 'ESTRUTURAL'];
  const list = filtro === 'TODOS' ? PROJETOS : PROJETOS.filter((p) => p.tag === filtro);

  return (
    <div className="la-page">
      <section className="pt-32 md:pt-40 pb-16 md:pb-20 border-b la-border-hairline">
        <Container>
          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <Reveal><Eyebrow>02 · PORTFÓLIO</Eyebrow></Reveal>
              <h1 className="la-font-display uppercase la-track-tight leading-[0.92] mt-4 text-[56px] md:text-[96px] lg:text-[128px] la-text-ink">
                <MaskReveal>PROJETOS</MaskReveal>
              </h1>
            </div>
            <Reveal delay={2} className="lg:col-span-4">
              <p className="la-font-body text-[15px] leading-[1.7] la-text-body-soft">
                Seleção de obras entregues entre 2022 e 2024. Residencial, comercial, industrial
                e estrutural — todos com ART assinada e acompanhamento executivo.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-b la-border-hairline sticky top-16 md:top-20 z-30 la-glass-strong">
        <Container>
          <div className="flex gap-1 overflow-x-auto py-4 la-scrollbar-hide">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setFiltro(t)}
                className={`la-font-body relative px-4 py-2 text-[11px] la-track-label uppercase whitespace-nowrap font-semibold border transition-all duration-500 ${
                  filtro === t ? 'la-border-ink la-text-ink' : 'la-border-default la-text-muted hover:la-text-ink'
                }`}
                style={{ transitionTimingFunction: 'var(--la-ease)' }}
              >
                {t}
              </button>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container>
          <div
            key={filtro}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-px la-bg-hairline la-page"
          >
            {list.map((p, i) => <ProjectCard key={`${filtro}-${p.nome}`} p={p} index={i} />)}
          </div>
          {list.length === 0 && (
            <div className="la-font-body text-center py-20 la-text-dim text-[12px] la-track-eyebrow uppercase">
              Nenhum projeto encontrado nesta categoria.
            </div>
          )}
        </Container>
      </section>
    </div>
  );
};

// ---------- PAGE: SERVIÇOS ----------
const PageServicos = ({ setCurrentPage }) => (
  <div className="la-page">
    <section className="pt-32 md:pt-40 pb-16 md:pb-20 border-b la-border-hairline">
      <Container>
        <div className="grid lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <Reveal><Eyebrow>03 · ESCOPO TÉCNICO</Eyebrow></Reveal>
            <h1 className="la-font-display uppercase la-track-tight leading-[0.92] mt-4 text-[56px] md:text-[96px] lg:text-[128px] la-text-ink">
              <MaskReveal>SERVIÇOS</MaskReveal>
            </h1>
          </div>
          <Reveal delay={2} className="lg:col-span-4">
            <p className="la-font-body text-[15px] leading-[1.7] la-text-body-soft">
              Atuação completa em engenharia civil. Do projeto estrutural à entrega da obra —
              com responsabilidade técnica, ART emitida e documentação regularizada.
            </p>
          </Reveal>
        </div>
      </Container>
    </section>

    <section>
      <Container>
        {SERVICOS.map((s, i) => (
          <Reveal key={s.n} delay={Math.min(i % 4 + 1, 4)}>
            <div className="la-service-row border-b la-border-hairline py-10 md:py-14 cursor-default">
              <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-start">
                <div className="lg:col-span-2">
                  <div className="la-service-num la-font-display text-[48px] md:text-[64px] leading-none font-bold">
                    {s.n}
                  </div>
                </div>
                <div className="lg:col-span-6 flex items-center gap-5">
                  <span className="la-service-title la-font-display uppercase la-track-tight leading-[1] text-[28px] md:text-[40px] lg:text-[48px] la-text-ink">
                    {s.titulo}
                  </span>
                  <ArrowRight className="la-service-arrow" size={28} strokeWidth={1.5} style={{ color: 'var(--la-ink)' }} />
                </div>
                <div className="lg:col-span-4">
                  <p className="la-font-body text-[14px] md:text-[15px] leading-[1.7] la-text-body-soft">
                    {s.desc}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </Container>
    </section>

    <section className="py-20 md:py-28">
      <Container>
        <Reveal>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <Display className="text-[32px] md:text-[48px] la-text-ink max-w-2xl">
              CADA SERVIÇO COM ART
              <br /><span className="la-text-ink-40">E RESPONSABILIDADE ASSINADA.</span>
            </Display>
            <Button variant="solid" onClick={() => setCurrentPage('contato')}>SOLICITAR PROPOSTA</Button>
          </div>
        </Reveal>
      </Container>
    </section>
  </div>
);

// ---------- PAGE: QUEM SOMOS ----------
const PageQuemSomos = ({ setCurrentPage }) => (
  <div className="la-page">
    <section className="pt-32 md:pt-40 pb-16 md:pb-20 border-b la-border-hairline">
      <Container>
        <Reveal><Eyebrow>04 · QUEM SOMOS</Eyebrow></Reveal>
        <h1 className="la-font-display uppercase la-track-tight leading-[0.92] mt-4 text-[56px] md:text-[96px] lg:text-[128px] la-text-ink">
          <MaskReveal>SOBRE</MaskReveal>
        </h1>
      </Container>
    </section>

    <section className="py-16 md:py-24 border-b la-border-hairline">
      <Container>
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <Reveal className="lg:col-span-5">
            <div className="relative aspect-[3/4] overflow-hidden group">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1800ms] group-hover:scale-105"
                style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=85&auto=format&fit=crop)',
                  filter: 'grayscale(1) contrast(0.95) brightness(1.02)',
                  transitionTimingFunction: 'var(--la-ease)',
                }}
              />
              <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to top, rgba(31,30,28,0.5), transparent)' }} />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <div>
                  <div className="la-font-body text-[11px] la-track-eyebrow uppercase" style={{ color: 'rgba(232,230,225,0.75)' }}>Engenheiro responsável</div>
                  <div className="la-font-body text-[18px] mt-1 font-semibold" style={{ color: 'var(--la-bg)' }}>Luciano Alves</div>
                </div>
                <div className="la-font-body text-[10px] la-track-wide uppercase text-right" style={{ color: 'rgba(232,230,225,0.75)' }}>
                  CREA<br />123456/D-MS
                </div>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <h2 className="la-font-display uppercase la-track-tight leading-[1.02] text-[32px] md:text-[44px] lg:text-[56px] la-text-ink">
              <MaskReveal>QUATORZE ANOS</MaskReveal>
              <MaskReveal delay={1}><span className="la-text-ink-40">TRANSFORMANDO PROJETOS</span></MaskReveal>
              <MaskReveal delay={2}><span className="la-text-ink-40">EM ENTREGAS.</span></MaskReveal>
            </h2>
            <Reveal delay={3}>
              <div className="la-font-body mt-10 space-y-5 text-[15px] md:text-[16px] leading-[1.75] la-text-body-soft">
                <p>
                  Luciano Alves é engenheiro civil formado pela Universidade Federal de Mato
                  Grosso do Sul, com MBA em Gerenciamento de Obras e especialização em cálculo
                  estrutural. Atua há mais de 14 anos no mercado regional, com portfólio que
                  soma mais de 48 mil m² construídos entre obras residenciais, comerciais e
                  industriais.
                </p>
                <p>
                  A prática é orientada por rigor técnico, controle de custo e comunicação clara
                  com o cliente. Cada projeto é tratado como um compromisso documentado: ART
                  emitida no CREA, cronograma físico-financeiro compartilhado, relatórios
                  executivos periódicos e portfólio aberto para conferência.
                </p>
                <p>Atendimento em todo o Mato Grosso do Sul, com sede em Chapadão do Sul.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>

    <section className="py-20 md:py-28 border-b la-border-hairline">
      <Container>
        <Reveal><Eyebrow>PRINCÍPIOS</Eyebrow></Reveal>
        <div className="mt-10 grid md:grid-cols-3 gap-px la-bg-hairline">
          {[
            { n: '/01', t: 'RIGOR TÉCNICO', d: 'Cálculo verificado, normas vigentes, ART assinada. Segurança estrutural acima de prazo comercial.' },
            { n: '/02', t: 'TRANSPARÊNCIA', d: 'Orçamento detalhado com curva ABC. Custo real informado antes do contrato — sem surpresas.' },
            { n: '/03', t: 'EXECUÇÃO NO PRAZO', d: 'Cronograma físico-financeiro contratualizado. 100% das obras entregues no prazo acordado.' },
          ].map((v, i) => (
            <Reveal key={v.n} delay={Math.min(i + 1, 4)}>
              <div
                className="la-bg-elevated p-8 md:p-10 h-full transition-all duration-500 hover:-translate-y-1"
                style={{ transitionTimingFunction: 'var(--la-ease)' }}
              >
                <div className="la-font-body text-[13px] la-track-eyebrow la-text-dim uppercase font-semibold">{v.n}</div>
                <Display className="mt-6 text-[28px] md:text-[32px] la-text-ink">{v.t}</Display>
                <p className="la-font-body mt-4 text-[14px] leading-[1.7] la-text-body-soft">{v.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>

    <section className="border-b la-border-hairline">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4">
          {STATS.map((s, i) => <StatItem key={s.label} stat={s} index={i} />)}
        </div>
      </Container>
    </section>

    <section className="py-20 md:py-28">
      <Container>
        <Reveal>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <Display className="text-[32px] md:text-[48px] la-text-ink max-w-2xl">
              TEM UM PROJETO EM MENTE?
            </Display>
            <Button variant="solid" onClick={() => setCurrentPage('contato')}>CONVERSAR AGORA</Button>
          </div>
        </Reveal>
      </Container>
    </section>
  </div>
);

// ---------- CONTACT HELPERS ----------
const ContactLine = ({ icon, label, value, href }) => (
  <div className="la-font-body flex items-start gap-4 group">
    <div
      className="la-text-dim mt-1 transition-all duration-500 group-hover:la-text-ink group-hover:-translate-y-0.5"
      style={{ transitionTimingFunction: 'var(--la-ease)' }}
    >
      {icon}
    </div>
    <div>
      <div className="text-[10px] la-track-eyebrow uppercase la-text-dim font-semibold">{label}</div>
      {href ? (
        <a href={href} className="mt-1 block text-[15px] la-text-ink la-link">{value}</a>
      ) : (
        <div className="mt-1 text-[15px] la-text-ink">{value}</div>
      )}
    </div>
  </div>
);

const FormField = ({ label, name, type = 'text', value, onChange, required }) => (
  <div className="la-field">
    <label className="la-font-body text-[10px] la-track-eyebrow uppercase la-text-dim font-semibold block mb-2">
      {label}
    </label>
    <input type={type} name={name} value={value} onChange={onChange} required={required} className="la-input" />
  </div>
);

// ---------- PAGE: CONTATO ----------
const PageContato = () => {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', tipo: '', mensagem: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ nome: '', email: '', telefone: '', tipo: '', mensagem: '' });
  };

  return (
    <div className="la-page">
      <section className="pt-32 md:pt-40 pb-16 md:pb-20 border-b la-border-hairline">
        <Container>
          <Reveal><Eyebrow>05 · FALE CONOSCO</Eyebrow></Reveal>
          <h1 className="la-font-display uppercase la-track-tight leading-[0.92] mt-4 text-[56px] md:text-[96px] lg:text-[128px] la-text-ink">
            <MaskReveal>CONTATO</MaskReveal>
          </h1>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <div className="space-y-10">
                <div>
                  <Eyebrow>ESCRITÓRIO</Eyebrow>
                  <p className="la-font-body mt-4 text-[18px] leading-[1.6] la-text-ink">
                    Rua das Pitangueiras, 1250<br />
                    Centro · Chapadão do Sul — MS<br />
                    CEP 79560-000
                  </p>
                </div>

                <div className="space-y-5">
                  <ContactLine icon={<Phone size={15} strokeWidth={1.75} />} label="TELEFONE" value="+55 (67) 99999-9999" href="tel:+5567999999999" />
                  <ContactLine icon={<Mail size={15} strokeWidth={1.75} />} label="EMAIL" value="contato@lucianoalves.eng.br" href="mailto:contato@lucianoalves.eng.br" />
                  <ContactLine icon={<MapPin size={15} strokeWidth={1.75} />} label="ATENDIMENTO" value="Todo o Mato Grosso do Sul" />
                </div>

                <div className="pt-8 border-t la-border-hairline">
                  <Eyebrow>HORÁRIO</Eyebrow>
                  <div className="la-font-body mt-4 grid grid-cols-2 gap-y-2 text-[14px] la-text-body-soft">
                    <span className="la-text-dim">SEG — SEX</span><span>08:00 — 18:00</span>
                    <span className="la-text-dim">SÁBADO</span><span>08:00 — 12:00</span>
                    <span className="la-text-dim">DOMINGO</span><span className="la-text-faint">Fechado</span>
                  </div>
                </div>

                <div className="pt-8 border-t la-border-hairline">
                  <Eyebrow>REGISTRO TÉCNICO</Eyebrow>
                  <div className="la-font-body mt-4 text-[14px] la-text-body-soft space-y-1">
                    <div>CREA · 123456/D-MS</div>
                    <div>CNPJ · 00.000.000/0001-00</div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={2} className="lg:col-span-7">
              <div className="mb-10">
                <h2 className="la-font-display uppercase la-track-tight leading-[0.92] text-[32px] md:text-[44px] la-text-ink">
                  SOLICITE
                  <br /><span className="la-text-ink-40">UMA PROPOSTA.</span>
                </h2>
                <p className="la-font-body mt-6 text-[14px] la-text-muted">
                  Resposta em até 24h úteis. Para urgências, ligue diretamente.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <FormField label="NOME COMPLETO" name="nome" value={form.nome} onChange={handleChange} required />
                  <FormField label="EMAIL" name="email" type="email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <FormField label="TELEFONE" name="telefone" value={form.telefone} onChange={handleChange} />
                  <div className="la-field">
                    <label className="la-font-body text-[10px] la-track-eyebrow uppercase la-text-dim font-semibold block mb-2">
                      TIPO DE PROJETO
                    </label>
                    <select name="tipo" value={form.tipo} onChange={handleChange} className="la-input" style={{ cursor: 'pointer' }}>
                      <option value="">Selecione</option>
                      <option value="residencial">Residencial</option>
                      <option value="comercial">Comercial</option>
                      <option value="industrial">Industrial</option>
                      <option value="estrutural">Projeto estrutural</option>
                      <option value="laudo">Laudo / Consultoria</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                </div>
                <div className="la-field">
                  <label className="la-font-body text-[10px] la-track-eyebrow uppercase la-text-dim font-semibold block mb-2">
                    MENSAGEM
                  </label>
                  <textarea
                    name="mensagem"
                    value={form.mensagem}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Conte brevemente sobre o projeto: localização, metragem estimada, prazo desejado..."
                    className="la-input"
                    style={{ resize: 'none' }}
                  />
                </div>

                <div className="flex items-center justify-between flex-wrap gap-4 pt-4">
                  <p className="la-font-body text-[11px] la-track-head uppercase la-text-faint">
                    Ao enviar, você concorda com nossos termos de contato.
                  </p>
                  <Button variant="solid">{sent ? 'ENVIADO ✓' : 'ENVIAR SOLICITAÇÃO'}</Button>
                </div>
              </form>
            </Reveal>
          </div>
        </Container>
      </section>
    </div>
  );
};

// ---------- FOOTER ----------
const Footer = ({ setCurrentPage }) => (
  <footer className="la-bg-sunken border-t la-border-hairline">
    <Container className="py-16 md:py-20">
      <Reveal>
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <img
              src="/2020-02-03 - 008.png"
              alt="Luciano Alves Engenharia Civil"
              className="w-[210px] md:w-[260px] h-auto"
              loading="lazy"
              decoding="async"
            />
            <p className="la-font-body mt-6 max-w-md text-[14px] leading-[1.7] la-text-muted">
              Engenharia de precisão para projetos residenciais, comerciais e industriais. Atendimento em todo o Mato Grosso do Sul.
            </p>
          </div>

          <div className="lg:col-span-3">
            <Eyebrow>NAVEGAÇÃO</Eyebrow>
            <ul className="mt-5 space-y-3">
              {[
                { id: 'inicio', label: 'Início' },
                { id: 'projetos', label: 'Projetos' },
                { id: 'servicos', label: 'Serviços' },
                { id: 'quemsomos', label: 'Quem Somos' },
                { id: 'contato', label: 'Fale Conosco' },
              ].map((it) => (
                <li key={it.id}>
                  <button
                    onClick={() => setCurrentPage(it.id)}
                    className="la-font-body la-link text-[14px] la-text-body-soft"
                  >
                    {it.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <Eyebrow>CONTATO</Eyebrow>
            <ul className="la-font-body mt-5 space-y-3 text-[14px] la-text-body-soft">
              <li><a href="tel:+5567999999999" className="la-link">+55 (67) 99999-9999</a></li>
              <li><a href="mailto:contato@lucianoalves.eng.br" className="la-link">contato@lucianoalves.eng.br</a></li>
              <li>Rua das Pitangueiras, 1250 — Chapadão do Sul — MS</li>
            </ul>
          </div>
        </div>
      </Reveal>

      <div className="la-font-body mt-16 pt-8 border-t la-border-hairline flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="text-[11px] la-track-head uppercase la-text-faint">
          © {new Date().getFullYear()} LUCIANO ALVES ENGENHARIA · TODOS OS DIREITOS RESERVADOS
        </div>
        <div className="text-[11px] la-track-head uppercase la-text-faint">
          DESENVOLVIDO POR WE ARE PRO
        </div>
      </div>
    </Container>
  </footer>
);

// ---------- ROOT ----------
export default function LucianoAlvesSite() {
  const [currentPage, setCurrentPage] = useState('inicio');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);

  const pages = {
    inicio: <PageInicio key="inicio" setCurrentPage={setCurrentPage} />,
    projetos: <PageProjetos key="projetos" />,
    servicos: <PageServicos key="servicos" setCurrentPage={setCurrentPage} />,
    quemsomos: <PageQuemSomos key="quemsomos" setCurrentPage={setCurrentPage} />,
    contato: <PageContato key="contato" />,
  };

  return (
    <div className="la-root min-h-screen">
      <ScrollProgress />
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main>{pages[currentPage]}</main>
      <Footer setCurrentPage={setCurrentPage} />
      <FloatingActions />
    </div>
  );
}
