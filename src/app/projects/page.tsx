import { getPublishedProjects } from "@/lib/notion-projects";
import { ProjectCard } from "@/components/projects/project-card";
import { ScrollReveal } from "@/components/animations/scroll-reveal";

export const revalidate = 1800; // 30 minutes

export const metadata = {
  title: "Projects — Monty Singer",
  description: "Things I've built and invested in.",
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <div className="mx-auto max-w-3xl px-6 pb-16 pt-24">
      <ScrollReveal delay={0}>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
          Projects
        </h1>
        <p className="mt-4 text-lg text-[var(--fg-muted)]">
          Things I&apos;ve built and invested in.
        </p>
      </ScrollReveal>

      {projects.length === 0 ? (
        <ScrollReveal delay={0.15}>
          <div className="mt-16 text-center">
            <h2 className="text-xl font-semibold">Projects coming soon.</h2>
            <p className="mt-2 text-[var(--fg-muted)]">
              Case studies and build logs being added.
            </p>
          </div>
        </ScrollReveal>
      ) : (
        <ScrollReveal delay={0.15}>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
