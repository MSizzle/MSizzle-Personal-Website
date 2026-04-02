export default function Home() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="flex min-h-screen items-center justify-center px-6 pt-16">
        <div className="max-w-2xl text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            Hey, I&apos;m Monty.
          </h1>
          <p className="mt-6 text-lg text-neutral-600 dark:text-neutral-400">
            Investor, builder, and lifelong learner based in NYC.
          </p>
        </div>
      </section>

      {/* Scroll test sections — proves Lenis is working */}
      {[
        { title: "Projects", text: "Things I've built and invested in." },
        { title: "Writing", text: "Ideas, observations, and lessons learned." },
        { title: "About", text: "Georgetown grad. NYC. Investing. Building with AI." },
        { title: "Connect", text: "Let's talk." },
      ].map((section) => (
        <section
          key={section.title}
          className="flex min-h-screen items-center justify-center border-t border-neutral-200 px-6 dark:border-neutral-800"
        >
          <div className="max-w-xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              {section.title}
            </h2>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">
              {section.text}
            </p>
          </div>
        </section>
      ))}
    </div>
  );
}
