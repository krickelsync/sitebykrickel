import { Display, H1, H2, H3, Tagline, Body, BodyLg, Eyebrow, Meta, Price, spacing, textSize } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

/**
 * /style-guide . internal reference page.
 * Renders every typography token + spacing/textSize scale so we can
 * eyeball consistency across the system.
 */

function Row({ label, sample, code }: { label: string; sample: React.ReactNode; code: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[180px_1fr_220px] gap-4 md:gap-6 py-6 border-b border-border/40">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground pt-1">{label}</div>
      <div className="min-w-0">{sample}</div>
      <code className="font-mono text-[10px] text-muted-foreground/70 self-start break-all">{code}</code>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={spacing.sectionY}>
      <H2 className="mb-2">{title}</H2>
      <div className="h-px w-12 bg-primary mb-6" />
      <div>{children}</div>
    </section>
  );
}

export default function StyleGuide() {
  return (
    <main className="min-h-[100svh] pt-28 md:pt-32 pb-24">
      <div className="container max-w-5xl">
        <header className="mb-12 md:mb-16">
          <Eyebrow>Internal, /style-guide</Eyebrow>
          <Display className="mt-3">Typography System</Display>
          <BodyLg className="mt-4 max-w-xl">
            Syne (display), Plus Jakarta Sans (body), JetBrains Mono (meta).
            Reference for cross-section consistency.
          </BodyLg>
        </header>

        <Section title="Headlines">
          <Row label="Display" sample={<Display>Themes for clothing brands</Display>} code="<Display />" />
          <Row label="H1" sample={<H1>Section title goes here</H1>} code="<H1 />" />
          <Row label="H2" sample={<H2>Sub-section heading</H2>} code="<H2 />" />
          <Row label="H3" sample={<H3>Card / block title</H3>} code="<H3 />" />
        </Section>

        <Section title="Body & Tagline">
          <Row
            label="Tagline"
            sample={<Tagline>An editorial accent line, italic.</Tagline>}
            code="<Tagline />"
          />
          <Row
            label="BodyLg"
            sample={<BodyLg>Lead paragraph for hero blocks and section intros. Plus Jakarta Sans, comfortable reading size.</BodyLg>}
            code="<BodyLg />"
          />
          <Row
            label="Body"
            sample={<Body>Default paragraph text. Used inside cards, descriptions, and dense content areas across the site.</Body>}
            code="<Body />"
          />
        </Section>

        <Section title="Labels & Meta">
          <Row label="Eyebrow" sample={<Eyebrow>Featured, 01</Eyebrow>} code="<Eyebrow />" />
          <Row label="Meta" sample={<Meta>Updated 2 hours ago</Meta>} code="<Meta />" />
          <Row label="Price" sample={<Price>$129.00</Price>} code="<Price />" />
        </Section>

        <Section title="Inline text sizes">
          <Row label="textSize.micro" sample={<span className={`font-mono ${textSize.micro}`}>MICRO, BADGE, TRUST</span>} code="textSize.micro" />
          <Row label="textSize.small" sample={<span className={`font-sans ${textSize.small}`}>Small UI, 1,200 reviews</span>} code="textSize.small" />
          <Row label="textSize.ui" sample={<span className={`font-sans ${textSize.ui}`}>Default UI, button label</span>} code="textSize.ui" />
          <Row label="textSize.lead" sample={<span className={`font-sans ${textSize.lead} font-semibold`}>Lead inline, $129</span>} code="textSize.lead" />
        </Section>

        <Section title="Font families">
          <Row label="font-display" sample={<p className="font-display font-extrabold uppercase text-3xl tracking-tight">Syne Display 800</p>} code="font-display" />
          <Row label="font-sans" sample={<p className="font-sans text-lg">Plus Jakarta Sans . the quick brown fox jumps over the lazy dog.</p>} code="font-sans" />
          <Row label="font-mono" sample={<p className="font-mono text-sm">JetBrains Mono . 0123456789, {`{ code: true }`}</p>} code="font-mono" />
        </Section>

        <Section title="Buttons">
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </Section>

        <Section title="Spacing tokens">
          <ul className="font-mono text-xs space-y-2 text-muted-foreground">
            <li>spacing.section → <span className="text-foreground">mt-16 md:mt-24</span></li>
            <li>spacing.sectionY → <span className="text-foreground">py-12 md:py-20</span></li>
            <li>spacing.sectionYLg → <span className="text-foreground">py-20 md:py-32</span></li>
            <li>spacing.headingGap → <span className="text-foreground">mb-6 md:mb-8</span></li>
            <li>spacing.headingGapLg → <span className="text-foreground">mb-12 md:mb-16</span></li>
            <li>spacing.blockGap → <span className="text-foreground">space-y-5 md:space-y-7</span></li>
            <li>spacing.gridGap → <span className="text-foreground">gap-5 md:gap-7</span></li>
          </ul>
        </Section>
      </div>
    </main>
  );
}