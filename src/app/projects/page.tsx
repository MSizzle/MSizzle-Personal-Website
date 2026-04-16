import type { Metadata } from "next";
import { getPublishedProjects } from "@/lib/notion-projects";
import { ProjectCard } from "@/components/projects/project-card";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const revalidate = 1800; // 30 minutes

export const metadata: Metadata = {
  title: "Works | Monty Singer",
  description:
    "Projects by Monty Singer: AI tools, bots, and software experiments shipped through Prometheus and independent work.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Works | Monty Singer",
    description:
      "Projects by Monty Singer: AI tools, bots, and software experiments shipped through Prometheus and independent work.",
    url: "/projects",
    type: "website",
  },
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <>
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Works" }]} />
      <div className="mx-auto max-w-[66ch] px-6 pb-16 pt-8 md:px-0">
        <ScrollReveal delay={0}>
          <h1 className="text-sm font-normal uppercase tracking-widest">
            Works
          </h1>
        </ScrollReveal>

        {projects.length === 0 ? (
          <ScrollReveal delay={0.15}>
            <p className="mt-8 opacity-75">Projects coming soon.</p>
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
    </>
  );
}
