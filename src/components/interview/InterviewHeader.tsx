export default function InterviewHeader() {
  return (
    <header className="border-b bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">
          AI Interview Session
        </h1>

        <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
          Live Interview
        </div>
      </div>
    </header>
  );
}