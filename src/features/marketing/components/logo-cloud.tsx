const sources = [
  "3Blue1Brown",
  "Vercel",
  "Figma",
  "ByteByteGo",
  "freeCodeCamp",
  "Fireship",
];

export function LogoCloud() {
  return (
    <section className="border-b">
      <div className="container py-12">
        <p className="text-center text-sm text-muted-foreground">
          Learners turn videos from their favorite creators into structured
          courses
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {sources.map((name) => (
            <span
              key={name}
              className="text-sm font-medium text-muted-foreground/80"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
