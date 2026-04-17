'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight, MapPin, Users, Zap,
  Home, Bus, UtensilsCrossed, CheckCircle2,
  ArrowUpRight, ChevronDown, Star, Mail,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// --- Config ---
const SIGNUP = '/registro';
const LOGIN = '/login';
const PERGAMINO = '/app/inicio';

// --- Palette (white premium) ---
const C = {
  bg: '#f8faf8',
  surface: '#ffffff',
  text: '#051f20',
  primary: '#163832',
  secondary: '#235347',
  mint: '#daf1de',
  muted: 'rgba(5, 31, 32, 0.4)',
  border: 'rgba(22, 56, 50, 0.08)',
};

// --- CountUp ---
function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let n = 0;
    const step = Math.max(1, Math.ceil(to / 50));
    const t = setInterval(() => {
      n += step;
      if (n >= to) { setVal(to); clearInterval(t); } else setVal(n);
    }, 25);
    return () => clearInterval(t);
  }, [inView, to]);
  return <span ref={ref}>{val.toLocaleString('es-AR')}{suffix}</span>;
}

// --- Feature Card ---
function FeatureCard({
  icon, title, desc, delay = 0,
}: { icon: React.ReactNode; title: string; desc: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl p-7 flex flex-col gap-4"
      style={{ background: C.surface, border: `1px solid ${C.border}` }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: C.mint, color: C.primary }}>
        {icon}
      </div>
      <h3 className="text-lg font-extrabold tracking-tight leading-snug" style={{ color: C.text }}>
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
        {desc}
      </p>
    </motion.div>
  );
}

// --- Step ---
function Step({ n, title, desc, delay = 0 }: { n: string; title: string; desc: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex gap-5 items-start"
    >
      <span className="text-xs font-bold shrink-0 mt-0.5 w-6 text-right" style={{ color: C.muted }}>{n}</span>
      <div className="flex-1 pb-7" style={{ borderBottom: `1px solid ${C.border}` }}>
        <p className="font-bold text-base leading-snug mb-1.5" style={{ color: C.text }}>{title}</p>
        <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{desc}</p>
      </div>
    </motion.div>
  );
}

// --- Testimonial ---
function Testimonial({ quote, name, career, delay = 0 }: {
  quote: string; name: string; career: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="rounded-2xl p-7 flex flex-col gap-5"
      style={{ background: C.surface, border: `1px solid ${C.border}` }}
    >
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={12} className="fill-current" style={{ color: '#235347' }} />
        ))}
      </div>
      <p className="text-sm leading-relaxed flex-1" style={{ color: C.text, opacity: 0.75 }}>
        &ldquo;{quote}&rdquo;
      </p>
      <div>
        <p className="text-xs font-bold" style={{ color: C.text }}>{name}</p>
        <p className="text-[11px] font-medium" style={{ color: C.muted }}>{career}</p>
      </div>
    </motion.div>
  );
}

// --- FAQ Accordion ---
function FaqItem({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(i === 0);
  return (
    <div style={{ borderBottom: `1px solid ${C.border}` }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-6 group"
        aria-expanded={open}
      >
        <span className="text-sm font-bold tracking-tight group-hover:opacity-70 transition-opacity"
          style={{ color: open ? C.primary : C.text }}>
          {q}
        </span>
        <ChevronDown size={14}
          className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          style={{ color: C.secondary }} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{ overflow: 'hidden' }}
      >
        <p className="pb-5 text-sm leading-relaxed" style={{ color: C.muted }}>{a}</p>
      </motion.div>
    </div>
  );
}

// --- Newsletter ---
function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section id="newsletter" className="py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl p-10 md:p-14"
          style={{ background: C.mint, border: `1px solid rgba(22,56,50,0.06)` }}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: C.primary, color: C.mint }}>
            <Mail size={20} />
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3" style={{ color: C.text }}>
            Proximamente en tu ciudad
          </h2>
          <p className="text-sm leading-relaxed mb-8 max-w-md mx-auto" style={{ color: C.muted }}>
            Estamos llegando a Junin, Zarate, Chivilcoy y mas ciudades. Dejanos tu email y te avisamos cuando Recien Llegue este disponible donde estudias.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 py-4"
            >
              <CheckCircle2 size={18} style={{ color: C.secondary }} />
              <p className="text-sm font-semibold" style={{ color: C.primary }}>
                Listo, te vamos a avisar cuando lleguemos.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="flex-1 px-5 py-3 rounded-xl text-sm font-medium outline-none"
                style={{ background: C.surface, color: C.text, border: `1px solid ${C.border}` }}
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] shrink-0"
                style={{ background: C.primary, color: C.mint }}
              >
                Avisarme
              </button>
            </form>
          )}

          <p className="text-[11px] mt-6" style={{ color: C.muted }}>
            Sin spam, solo te escribimos cuando estemos en tu ciudad.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────
export default function GlobalHomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Recien Llegue',
          url: 'https://recienlleguee.com.ar',
          description: 'Portal de recursos para estudiantes universitarios en Argentina.',
          areaServed: 'Argentina',
        })
      }} />

      <div className="min-h-screen overflow-x-hidden" style={{ background: C.bg, color: C.text }}>
        <Navbar />

        {/* ══ HERO ══════════════════════════════════════ */}
        <section className="relative pt-36 pb-20 px-6">
          {/* Gradient blob */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
            style={{ background: `radial-gradient(ellipse at center, ${C.mint} 0%, transparent 70%)`, opacity: 0.5, filter: 'blur(80px)' }} />

          <div className="relative max-w-4xl mx-auto text-center space-y-7">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
              <img src="/logo.png" alt="Recien Llegue" className="h-16 w-auto mx-auto mb-2" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                style={{ background: C.mint, color: C.primary }}>
                <Zap size={10} className="fill-current" /> Disponible en Pergamino
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="font-extrabold tracking-tight leading-[1.08]"
              style={{ fontSize: 'clamp(2.8rem, 8vw, 5rem)', color: C.text }}
            >
              Tu guia para
              <br />
              <span style={{ color: C.secondary }}>llegar</span> y <span style={{ color: C.secondary }}>quedarte</span><span style={{ color: C.muted }}>.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
              style={{ color: C.muted }}
            >
              Recien Llegue reune todo lo que necesitas para instalarte como estudiante universitario: alojamiento verificado, transporte, servicios y comunidad.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-wrap gap-3 justify-center pt-1"
            >
              <a href={SIGNUP}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] hover:shadow-lg"
                style={{ background: C.primary, color: '#fff' }}>
                Crear cuenta gratis <ArrowRight size={15} />
              </a>
              <a href={PERGAMINO}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all"
                style={{ color: C.primary, border: `1px solid ${C.border}`, background: C.surface }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(22,56,50,0.2)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
                Explorar Pergamino
              </a>
            </motion.div>

            {/* Social proof */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="flex items-center gap-3 justify-center pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-semibold"
                style={{ background: C.mint, color: C.secondary }}>
                Recien lanzado — Unite a los primeros
              </span>
            </motion.div>
          </div>
        </section>

        {/* ══ STATS BAR ══════════════════════════════════ */}
        <section className="py-6 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { n: 1, suf: '', label: 'Ciudad disponible' },
              { n: 25, suf: '+', label: 'Servicios en directorio' },
              { n: 8, suf: '', label: 'Barrios mapeados' },
              { n: 100, suf: '%', label: 'Gratuito para vos' },
            ].map(({ n, suf, label }, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="rounded-2xl p-5 text-center"
                style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <p className="text-2xl font-extrabold tracking-tight" style={{ color: C.text }}>
                  <CountUp to={n} suffix={suf} />
                </p>
                <p className="text-[10px] font-medium uppercase tracking-wider mt-1" style={{ color: C.muted }}>{label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ══ QUE ES ══════════════════════════════════ */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="flex-1 space-y-6">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: C.muted }}>
                    Que es Recien Llegue
                  </p>
                  <h2 className="font-extrabold tracking-tight leading-[1.1]"
                    style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: C.text }}>
                    Todo lo que<br />necesitas,<br /><span style={{ color: C.secondary }}>en un lugar</span>.
                  </h2>
                </div>
                <p className="text-sm md:text-base leading-relaxed max-w-md" style={{ color: C.muted }}>
                  Llegar a estudiar a otra ciudad es estresante. Recien Llegue hace que el proceso sea simple: encontras alojamiento verificado, sabes como moverte y conectas con estudiantes que ya vivieron lo mismo.
                </p>
                <a href={SIGNUP}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
                  style={{ background: C.primary, color: '#fff' }}>
                  Empezar ahora <ArrowRight size={14} />
                </a>
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FeatureCard icon={<Home size={16} />} title="Alojamiento"
                  desc="Pensiones, departamentos y habitaciones verificadas con fotos reales, precios actualizados y contacto directo." delay={0} />
                <FeatureCard icon={<Bus size={16} />} title="Transporte"
                  desc="Colectivos, remises 24hs y bicicletas. Todo lo que necesitas para moverte desde el primer dia." delay={0.07} />
                <FeatureCard icon={<UtensilsCrossed size={16} />} title="Vida diaria"
                  desc="Donde comer, lavanderia, farmacias, supermercados baratos y todo lo cotidiano." delay={0.14} />
                <FeatureCard icon={<Users size={16} />} title="Comunidad"
                  desc="Conectate con otros ingresantes, encontra roommates y accede a experiencias reales." delay={0.21} />
              </div>
            </div>
          </div>
        </section>

        {/* ══ BENTO PERGAMINO ══════════════════════════ */}
        <section className="py-8 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Large card */}
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="md:col-span-8 rounded-2xl p-10 md:p-12 flex flex-col justify-between relative overflow-hidden min-h-[320px]"
              style={{ background: C.primary, color: '#fff' }}>
              <div className="relative z-10">
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-4" style={{ opacity: 0.5 }}>Ciudad disponible</p>
                <h3 className="font-extrabold tracking-tight leading-[1.1]"
                  style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
                  Pergamino<br /><span style={{ color: C.mint }}>Sede UNNOBA</span>
                </h3>
                <p className="text-sm mt-4 max-w-md leading-relaxed" style={{ opacity: 0.5 }}>
                  La primera ciudad en nuestra red. Toda la logistica de alojamiento y transporte para estudiantes de la UNNOBA, con +25 categorias de servicios locales.
                </p>
              </div>
              <div className="relative z-10 flex flex-wrap gap-3 mt-8">
                <a href={PERGAMINO}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
                  style={{ background: C.mint, color: C.primary }}>
                  Abrir portal Pergamino <ArrowRight size={13} />
                </a>
                <a href={`${PERGAMINO}/alojamiento-estudiantes`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all"
                  style={{ color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}>
                  Buscar alojamiento
                </a>
              </div>
              {/* Glow */}
              <div className="absolute top-0 right-0 w-72 h-72 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${C.secondary} 0%, transparent 70%)`, opacity: 0.3, filter: 'blur(50px)' }} />
            </motion.div>

            {/* Upcoming */}
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-4 rounded-2xl p-7 flex flex-col gap-5"
              style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: C.muted }}>Proximamente</p>
                <h4 className="text-xl font-extrabold tracking-tight leading-snug" style={{ color: C.text }}>
                  Mas ciudades<br /><span style={{ color: C.muted }}>en camino</span>
                </h4>
              </div>
              <ul className="space-y-2 flex-1">
                {['Junin (UNNOBA)', 'Zarate (UNLZ)', 'Chivilcoy (UNNOBA)', 'Lujan (UNLu)'].map((city, i) => (
                  <li key={i} className="flex items-center gap-2.5 py-2" style={{ borderBottom: `1px solid ${C.border}` }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: C.secondary }} />
                    <span className="text-xs font-medium" style={{ color: C.muted }}>{city}</span>
                  </li>
                ))}
              </ul>
              <a href="#newsletter" className="inline-flex items-center gap-2 text-xs font-semibold transition-colors hover:opacity-70"
                style={{ color: C.primary }}>
                Avisarme cuando llegue <ArrowRight size={11} />
              </a>
            </motion.div>
          </div>
        </section>

        {/* ══ COMO FUNCIONA ══════════════════════════ */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: C.muted }}>Como funciona</p>
                <h2 className="font-extrabold tracking-tight leading-[1.1]"
                  style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: C.text }}>
                  Cuatro pasos,<br /><span style={{ color: C.secondary }}>todo listo</span>.
                </h2>
              </div>
              <div className="pt-4">
                {[
                  { n: '01', title: 'Elegis tu ciudad', desc: 'Entras a Recien Llegue y seleccionas donde vas a estudiar.' },
                  { n: '02', title: 'Buscas lo que necesitas', desc: 'Alojamiento, transporte, servicios. Filtras por barrio, precio y categoria.' },
                  { n: '03', title: 'Contactas directo', desc: 'Te ponemos en contacto con el proveedor sin intermediarios.' },
                  { n: '04', title: 'Te instalas tranquilo', desc: 'Llegas a tu nueva ciudad con todo resuelto.' },
                ].map(({ n, title, desc }, i) => (
                  <Step key={n} n={n} title={title} desc={desc} delay={i * 0.08} />
                ))}
              </div>
            </div>

            {/* Trust */}
            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl p-8 space-y-7 sticky top-24"
              style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: C.muted }}>Por que confiar</p>
                <h3 className="text-xl font-extrabold tracking-tight leading-snug" style={{ color: C.text }}>
                  Hecho por estudiantes,<br />para estudiantes.
                </h3>
              </div>
              <ul className="space-y-3.5">
                {[
                  'Todos los alojamientos son verificados.',
                  'Los precios se actualizan mensualmente.',
                  'El servicio es gratuito para estudiantes.',
                  'Sin publicidad ni contenido patrocinado.',
                  'Datos reales de estudiantes.',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <CheckCircle2 size={15} className="shrink-0 mt-0.5" style={{ color: C.secondary }} />
                    <span className="text-sm leading-relaxed" style={{ color: C.muted }}>{item}</span>
                  </li>
                ))}
              </ul>
              <div style={{ borderTop: `1px solid ${C.border}` }} className="pt-5">
                <a href={SIGNUP}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
                  style={{ background: C.primary, color: '#fff' }}>
                  Crear cuenta gratis <ArrowRight size={14} />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══ TESTIMONIOS ══════════════════════════ */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10">
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: C.muted }}>Lo que dicen</p>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: C.text }}>
                Estudiantes <span style={{ color: C.secondary }}>reales</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Testimonial quote="Llegue a Pergamino sin conocer a nadie y en 48 horas ya tenia alojamiento. Literal me salvo."
                name="Martina L." career="Ing. Informatica - UNNOBA" delay={0} />
              <Testimonial quote="La seccion de remises y colectivos es lo mas. La primera semana no sabia como ir a la facultad."
                name="Sebastian G." career="Administracion - UNNOBA" delay={0.1} />
              <Testimonial quote="Me ayudo a encontrar habitacion compartida con chicos de mi carrera. Ahora somos cuatro."
                name="Romina C." career="Contador Publico - UNNOBA" delay={0.2} />
            </div>
          </div>
        </section>

        {/* ══ FAQ ══════════════════════════ */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-10">
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: C.muted }}>Preguntas frecuentes</p>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: C.text }}>
                Todo lo que <span style={{ color: C.secondary }}>queres saber</span>
              </h2>
            </div>
            <div style={{ borderTop: `1px solid ${C.border}` }}>
              {[
                { q: 'Es gratuito Recien Llegue?', a: 'Si, completamente gratis para estudiantes universitarios. Sin planes de pago, sin trampas.' },
                { q: 'Solo esta disponible en Pergamino?', a: 'Por ahora si. Pergamino es nuestra ciudad inaugural. Proximamente sumaremos Junin, Zarate y mas ciudades universitarias.' },
                { q: 'Como verifican los alojamientos?', a: 'Cada alojamiento pasa por un proceso de verificacion manual. Revisamos fotos, contactamos al propietario y confirmamos que los datos sean reales.' },
                { q: 'Puedo publicar mi alojamiento?', a: 'Si sos propietario, podes registrarte como proveedor desde la app. Es gratuito y toma menos de 48hs.' },
                { q: 'La app tiene comunidad?', a: 'Si. El directorio te ayuda a encontrar servicios, y la comunidad te conecta con otros estudiantes que ya viven en la ciudad.' },
              ].map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} i={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ══ NEWSLETTER ══════════════════════════ */}
        <NewsletterSection />

        {/* ══ CTA FINAL ══════════════════════════ */}
        <section className="py-12 px-6 pb-24">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
              style={{ background: C.primary }}>
              <div className="relative z-10 space-y-6 max-w-2xl mx-auto" style={{ color: '#fff' }}>
                <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.08)' }}>
                  Recien llegaste?
                </span>
                <h2 className="font-extrabold tracking-tight leading-[1.1]"
                  style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}>
                  Deja de buscar<br />en diez lugares.
                </h2>
                <p className="text-sm" style={{ opacity: 0.5 }}>
                  Alojamiento, transporte y servicios -- todo verificado, en un solo lugar, gratis.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <a href={SIGNUP}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
                    style={{ background: C.mint, color: C.primary }}>
                    Crear cuenta gratis <ArrowRight size={15} />
                  </a>
                  <a href={PERGAMINO}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm transition-all"
                    style={{ border: '1px solid rgba(255,255,255,0.15)' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}>
                    Explorar Pergamino
                  </a>
                </div>
                <p className="text-[10px] font-medium uppercase tracking-wider" style={{ opacity: 0.25 }}>
                  Sin tarjeta - Sin costo - Para estudiantes
                </p>
              </div>
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at center, ${C.secondary} 0%, transparent 65%)`, opacity: 0.2, filter: 'blur(40px)' }} />
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}