import Card from "@/components/common/util/Card";

export default function DashboardPage() {
  return (
    <Card className="min-h-full p-8">
      <h1 className="text-2xl font-semibold text-white">
        Dashboard
      </h1>

      <p className="mt-2 text-sm text-white/50">
        Manage your portfolio from here.
      </p>
    </Card>
  );
}