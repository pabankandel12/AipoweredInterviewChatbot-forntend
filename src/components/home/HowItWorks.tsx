import { ClipboardCheck, FileUp, MessageCircleMore, Sparkles } from "lucide-react";

const steps = [
  { icon: FileUp, title: "Bring your resume", text: "Upload a PDF or DOCX CV." },
  { icon: ClipboardCheck, title: "Set your target", text: "Paste the job description and choose a difficulty." },
  { icon: MessageCircleMore, title: "Answer naturally", text: "Practice the questions in your interview room." },
  { icon: Sparkles, title: "Review and refine", text: "Use feedback to sharpen your next answer." },
];

export default function HowItWorks() {
  return (
    <section id="how" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl"><p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">A simple routine</p><h2 className="mt-3 text-4xl font-bold tracking-tight text-[#102a43] sm:text-5xl">From CV to confident answer.</h2></div>
          <p className="max-w-sm text-sm leading-6 text-slate-600">No setup maze. Start with the material a real interviewer will care about.</p>
        </div>
        <ol className="mt-14 grid gap-5 md:grid-cols-4">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <li key={title} className="relative rounded-2xl border border-slate-200 p-6">
              <span className="text-xs font-bold tracking-widest text-teal-700">STEP 0{index + 1}</span>
              <Icon className="mt-8 text-[#102a43]" size={28} />
              <h3 className="mt-5 font-bold text-[#102a43]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
