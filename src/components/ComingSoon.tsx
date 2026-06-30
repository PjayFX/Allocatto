export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="grid place-items-center py-24 text-center">
      <div>
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-sm text-faint">Coming soon.</p>
      </div>
    </div>
  );
}
