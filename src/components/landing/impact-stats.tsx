interface StatsProps {
  totalRaised: number;
  totalDelivered: number;
  familiesHelped: number;
}

export function ImpactStats({ totalRaised, totalDelivered, familiesHelped }: StatsProps) {
  return (
    <section className="bg-primary py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-8 text-center md:grid-cols-3">
          <div>
            <p className="text-4xl font-bold text-white md:text-5xl">
              ${Math.floor(totalRaised / 100).toLocaleString()}
            </p>
            <p className="mt-2 text-sm text-white/70">Total Raised</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-white md:text-5xl">
              ${Math.floor(totalDelivered / 100).toLocaleString()}
            </p>
            <p className="mt-2 text-sm text-white/70">Delivered to Families</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-white md:text-5xl">
              {familiesHelped}
            </p>
            <p className="mt-2 text-sm text-white/70">Families Helped</p>
          </div>
        </div>
      </div>
    </section>
  );
}
