import type React from 'react'
import { AbsoluteFill, Composition, interpolate, Sequence, useCurrentFrame } from 'remotion'

const C = {
  bg: '#08090A',
  surface: '#16171C',
  text: '#F7F8F8',
  muted: '#9CA3AF',
  accent: '#5E6AD2',
  line: 'rgba(255,255,255,0.08)',
}

const font: React.CSSProperties = {
  fontFamily: 'Inter Tight, Inter, Arial, sans-serif',
}

const Enter: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => {
  const frame = useCurrentFrame()
  const opacity = interpolate(frame, [delay, delay + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const y = interpolate(frame, [delay, delay + 14], [22, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  return <div style={{ opacity, transform: `translateY(${y}px)` }}>{children}</div>
}

const Scene: React.FC<{ children: React.ReactNode; kicker: string }> = ({ children, kicker }) => (
  <AbsoluteFill
    style={{
      ...font,
      background: C.bg,
      color: C.text,
      padding: '90px 110px',
      justifyContent: 'center',
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: 68,
        left: 110,
        color: C.accent,
        fontSize: 18,
        letterSpacing: 4,
        textTransform: 'uppercase',
      }}
    >
      {kicker}
    </div>
    {children}
    <div
      style={{
        position: 'absolute',
        bottom: 56,
        right: 110,
        color: C.muted,
        fontSize: 16,
        fontFamily: 'monospace',
      }}
    >
      tanstack-blog
    </div>
  </AbsoluteFill>
)

const Quickstart: React.FC = () => {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={75}>
        <Scene kicker="The framework">
          <Enter>
            <h1 style={{ margin: 0, fontSize: 92, lineHeight: 1, letterSpacing: -5 }}>
              Docs, blogs and
              <br />
              component libraries.
            </h1>
            <p style={{ marginTop: 28, fontSize: 30, color: C.muted }}>
              Built on TanStack Start and TanStack Markdown.
            </p>
          </Enter>
        </Scene>
      </Sequence>

      <Sequence from={75} durationInFrames={75}>
        <Scene kicker="Step 01 — Scaffold">
          <Enter>
            <h2 style={{ margin: 0, fontSize: 64, letterSpacing: -3 }}>One command.</h2>
            <div
              style={{
                marginTop: 34,
                padding: 28,
                border: `1px solid ${C.line}`,
                borderRadius: 12,
                background: C.surface,
                fontFamily: 'monospace',
                fontSize: 26,
                color: C.text,
              }}
            >
              pnpm dlx @tanstack-blog/cli
            </div>
            <p style={{ marginTop: 26, fontSize: 24, color: C.muted }}>
              A guided TUI asks the six decisions that matter.
            </p>
          </Enter>
        </Scene>
      </Sequence>

      <Sequence from={150} durationInFrames={75}>
        <Scene kicker="Step 02 — Write">
          <Enter>
            <h2 style={{ margin: 0, fontSize: 64, letterSpacing: -3 }}>Markdown in. Site out.</h2>
            <div
              style={{
                marginTop: 34,
                padding: 28,
                border: `1px solid ${C.line}`,
                borderRadius: 12,
                background: C.surface,
                fontFamily: 'monospace',
                fontSize: 22,
                lineHeight: 1.7,
              }}
            >
              <span style={{ color: C.accent }}>---</span>
              <br />
              title: Getting Started
              <br />
              group: Fundamentals
              <br />
              <span style={{ color: C.accent }}>---</span>
              <br /># Hello, docs
            </div>
          </Enter>
        </Scene>
      </Sequence>

      <Sequence from={225} durationInFrames={75}>
        <Scene kicker="Step 03 — Theme">
          <Enter>
            <h2 style={{ margin: 0, fontSize: 64, letterSpacing: -3 }}>
              25 themes. Zero remounts.
            </h2>
            <div style={{ display: 'flex', gap: 14, marginTop: 36 }}>
              {['#5E6AD2', '#C8161D', '#1B4B5A', '#FFA02F', '#0000EE'].map((color, index) => (
                <div
                  key={color}
                  style={{
                    width: 180,
                    height: 200,
                    borderRadius: 12,
                    border: `1px solid ${C.line}`,
                    background: C.surface,
                    padding: 18,
                    transform: `translateY(${Math.sin((frame + index * 8) / 9) * 6}px)`,
                  }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: color }} />
                  <div style={{ marginTop: 26, height: 8, borderRadius: 4, background: C.line }} />
                  <div
                    style={{
                      marginTop: 10,
                      height: 8,
                      width: '70%',
                      borderRadius: 4,
                      background: C.line,
                    }}
                  />
                </div>
              ))}
            </div>
          </Enter>
        </Scene>
      </Sequence>

      <Sequence from={300} durationInFrames={60}>
        <Scene kicker="Step 04 — Ship">
          <Enter>
            <h2 style={{ margin: 0, fontSize: 72, letterSpacing: -3 }}>Search. i18n. Deploy.</h2>
            <p style={{ marginTop: 24, fontSize: 28, color: C.muted }}>
              Orama offline search · bilingual docs · Cloudflare, Vercel, Netlify, Node.
            </p>
            <div
              style={{
                marginTop: 40,
                padding: '16px 26px',
                display: 'inline-block',
                borderRadius: 999,
                background: C.accent,
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              Start building →
            </div>
          </Enter>
        </Scene>
      </Sequence>
    </AbsoluteFill>
  )
}

const palette = [
  { name: 'Linear', bg: '#08090A', accent: '#5E6AD2', text: '#F7F8F8' },
  { name: 'MUJI', bg: '#F4F2EC', accent: '#C8161D', text: '#2A2A28' },
  { name: 'Stripe Press', bg: '#F1ECDE', accent: '#1B4B5A', text: '#1A1A18' },
  { name: 'Bloomberg', bg: '#0A0E1A', accent: '#FFA02F', text: '#E8ECF4' },
  { name: 'Are.na', bg: '#FFFFFF', accent: '#0000EE', text: '#000000' },
]

const Themes: React.FC = () => {
  const frame = useCurrentFrame()
  const index = Math.min(palette.length - 1, Math.floor(frame / 45))
  const p = palette[index]!
  return (
    <AbsoluteFill
      style={{ ...font, background: p.bg, color: p.text, justifyContent: 'center', padding: 110 }}
    >
      <Enter key={p.name}>
        <div
          style={{ color: p.accent, fontSize: 20, letterSpacing: 4, textTransform: 'uppercase' }}
        >
          Theme preview
        </div>
        <h1 style={{ margin: '20px 0', fontSize: 110, lineHeight: 1, letterSpacing: -5 }}>
          {p.name}
        </h1>
        <div style={{ width: 220, height: 10, borderRadius: 5, background: p.accent }} />
        <p style={{ marginTop: 30, fontSize: 26, opacity: 0.7 }}>
          Token-driven · light and dark · installable as a plugin
        </p>
      </Enter>
    </AbsoluteFill>
  )
}

export const RemotionCompositions: React.FC = () => (
  <>
    <Composition
      id="Quickstart"
      component={Quickstart}
      durationInFrames={360}
      fps={30}
      width={1280}
      height={720}
    />
    <Composition
      id="Themes"
      component={Themes}
      durationInFrames={225}
      fps={30}
      width={1280}
      height={720}
    />
  </>
)
