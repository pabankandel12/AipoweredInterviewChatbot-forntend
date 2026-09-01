"use client";

import {
  Code2,
  Monitor,
  Server,
  BarChart3,
  Palette,
  Users,
  Brain,
  MessageSquare,
} from "lucide-react";

import Link from "next/link";

export default function CategoriesSection() {
  const categories = [
    {
      title: "Software Engineering",
      icon: Code2,
      color: "from-blue-500 to-blue-700",
    },
    {
      title: "Frontend Developer",
      icon: Monitor,
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Backend Developer",
      icon: Server,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Data Analyst",
      icon: BarChart3,
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "UI/UX Designer",
      icon: Palette,
      color: "from-pink-500 to-rose-500",
    },
    {
      title: "HR Interview",
      icon: Users,
      color: "from-indigo-500 to-blue-600",
    },
    {
      title: "Behavioral Interview",
      icon: Brain,
      color: "from-teal-500 to-cyan-600",
    },
    {
      title: "Technical Interview",
      icon: MessageSquare,
      color: "from-gray-700 to-gray-900",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-4xl font-bold">
          Choose Your Interview Category
        </h2>

        <p className="mt-3 text-center text-gray-500">
          Practice real-world interview scenarios tailored to your role
        </p>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((item) => (
            <Link
              key={item.title}
              href="/interview"
              className="group rounded-3xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${item.color} text-white shadow-md`}
              >
                <item.icon size={26} />
              </div>

              <h3 className="mt-5 text-lg font-semibold group-hover:text-blue-600">
                {item.title}
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Start practicing AI-powered interviews
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}