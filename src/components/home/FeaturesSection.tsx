import {
  Bot,
  Video,
  Mic,
  BarChart3,
} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Bot,
      title: "AI Interviewer",
      desc: "Realistic AI interview conversations",
    },
    {
      icon: Mic,
      title: "Voice Interview",
      desc: "Speak naturally with AI",
    },
    {
      icon: Video,
      title: "Video Practice",
      desc: "Improve confidence and presence",
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      desc: "Detailed feedback and scoring",
    },
  ];

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-4xl font-bold">
          Everything You Need
        </h2>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border p-6"
            >
              <feature.icon size={36} />

              <h3 className="mt-4 text-xl font-semibold">
                {feature.title}
              </h3>

              <p className="mt-2 text-gray-500">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}