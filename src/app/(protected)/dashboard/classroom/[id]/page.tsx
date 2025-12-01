import { ClassroomDetail } from "@/components/classroom/class-room-detail";

export default async function ClassroomDashboardPage({
  params,
}: {
  params: Promise<Record<string, string>>;
}) {
  const { id } = await params;

  return (
    <div>
      <ClassroomDetail classroomId={id} />
    </div>
  );
}
