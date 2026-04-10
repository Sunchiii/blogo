import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About me — a software engineer who writes about building things.",
};

export default function AboutPage() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>About</h1>
      <p>
        Hi! I&apos;m a software engineer passionate about self-hosting, systems
        programming, and building tools that put you in control of your own data.
      </p>
      <p>
        This blog is where I document what I&apos;m building, learning, and
        experimenting with. No paywalls, no tracking, no nonsense.
      </p>
      <h2>What I work on</h2>
      <ul>
        <li>Backend systems and distributed systems</li>
        <li>Self-hosted infrastructure and homelab setups</li>
        <li>Open-source tooling and developer experience</li>
        <li>Machine learning experiments</li>
      </ul>
      <h2>Contact</h2>
      <p>
        Find me on{" "}
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        .
      </p>
    </div>
  );
}
