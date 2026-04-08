import { getPublishedProjects } from "@/lib/notion-projects";
import { ProjectCard } from "@/components/projects/project-card";
import { ScrollReveal } from "@/components/animations/scroll-reveal";

export const revalidate = 1800; // 30 minutes

export const metadata = {
  title: "Works — Monty Singer",
  description: "Things I've built and invested in.",
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <div className="mx-auto max-w-[66ch] px-6 pb-16 pt-24 md:px-0">
      <ScrollReveal delay={0}>
        <h1 className="text-sm font-normal uppercase tracking-widest">
          Works
        </h1>
      </ScrollReveal>

      {projects.length === 0 ? (
        <ScrollReveal delay={0.15}>
          <p className="mt-8 opacity-50">Projects coming soon.</p>
        </ScrollReveal>
      ) : (
        <ScrollReveal delay={0.15}>
          <div className="mt-8 flex flex-col gap-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
