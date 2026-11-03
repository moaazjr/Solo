"use client";

import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { AgentNetwork } from "./agent-network";

const ease = [0.22, 1, 0.36, 1] as const;

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background */}
      <div aria-hidden className="grid-lines absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_70%_40%,black_20%,transparent_70%)]" />
      <div aria-hidden className="absolute -right-40 -top-40 -z-10 size-[640px] rounded-full bg-accent/10 blur-[120px] animate-drift" />
      <div aria-hidden className="absolute -bottom-60 -left-40 -z-10 size-[520px] rounded-full bg-[#c9b79c]/25 blur-[120px] animate-drift [animation-delay:-9s]" />

      <Container className="grid items-center gap-12 pb-20 pt-14 sm:pt-20 lg:grid-cols-[1.15fr_1fr] lg:gap-6 lg:pb-32 lg:pt-24">
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
          <motion.div variants={item}>
            <Eyebrow>A one-human technology company</Eyebrow>
          </motion.div>

          <motion.h1 variants={item} className="display mt-7 text-[3.3rem] sm:text-7xl lg:text-[5.6rem]">
            Software, built by one founder <em className="text-accent">and a team of AI&nbsp;agents.</em>
          </motion.h1>

          <motion.p variants={item} className="mt-8 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
            We design, engineer and grow digital products for ambitious companies. You get the attention of a founder
            and the output of a full studio, with every piece of work reviewed by a human before it ships.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact" size="lg" arrow>
              Let&apos;s Work Together
            </ButtonLink>
            <ButtonLink href="/services" size="lg" variant="secondary">
              Explore Our Services
            </ButtonLink>
          </motion.div>

          <motion.dl variants={item} className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-6">
            {[
              ["Engineering", "ECC"],
              ["Sales", "Harvey"],
              ["Sign-off", "Human"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="eyebrow text-muted">{k}</dt>
                <dd className="display mt-2 text-2xl">{v}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <div className="relative mx-auto w-full max-w-[540px]">
          <AgentNetwork className="h-auto w-full" />
        </div>
      </Container>
    </section>
  );
}
