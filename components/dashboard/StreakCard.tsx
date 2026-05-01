export default function StreakCard({ streak }: { streak: number }) {
  return (
    <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-indigo-700 rounded-2xl p-6 text-white flex flex-col justify-center">
      
      <div className="flex items-start gap-3">
        <div className="text-3xl">🔥</div>

        <div>
          <div className="text-2xl font-bold mb-1">
            {streak} hari berturut-turut!
          </div>

          <div className="text-indigo-200 text-sm">
            Terus jaga konsistensimu!
          </div>
        </div>
      </div>

    </div>
  );
}