"use client";

import Container from "@/components/ui/Container";
import Counter from "@/components/ui/Counter";
import { StaggerGroup, StaggerItem } from "@/components/ui/StaggerGroup";
import { STATS } from "@/data/stats";

export default function Stats() {
  return (
    <section className="relative py-20">
      <Container>
        <div className="rounded-[2rem] bg-gradient-to-br from-primary-700 via-primary-700 to-primary-800 px-6 py-14 shadow-[0_30px_70px_-25px_rgba(20,102,63,0.5)] sm:px-12">
          <StaggerGroup className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-6">
            {STATS.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="text-center">
                  <p className="font-display text-4xl font-extrabold text-white sm:text-5xl">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-primary-100 sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </Container>
    </section>
  );
}
