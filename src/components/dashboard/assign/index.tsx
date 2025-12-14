"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import AssignContent from "./assign-content";
import { useContent } from "@/components/providers/content-categories";
import MonsterLottie from "@/components/ui/loader";

const Assignlist = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { content, loading, error } = useContent();

  const currentTab = searchParams.get("tab") || "0";

  const handleTabChange = (tabValue: string) => {
    router.push(`/dashboard/assign?tab=${tabValue}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background rounded-[10px]">
        <MonsterLottie />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!content || content.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-label-paragraph">No content available</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-4 mb-6 border-b border-stroke-border">
        {content.map((item, index) => (
          <button
            key={item.id ?? `tab-${index}`}
            onClick={() => handleTabChange(index.toString())}
            className={`px-4 py-2 ${
              currentTab === index.toString()
                ? "border-b-2 border-primary text-primary"
                : "text-label-paragraph"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div>
        {content[parseInt(currentTab)] && (
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold">
                {content[parseInt(currentTab)].name}
              </p>
              <Button
                className="w-40"
                onClick={() =>
                  router.push(
                    `/dashboard/assign/create-assign?id=${
                      content[parseInt(currentTab)]?.id
                    }`
                  )
                }
              >
                Даалгавар үүсгэх
              </Button>
            </div>
          </div>
        )}
      </div>
      <AssignContent contentName={content[parseInt(currentTab)]?.name} />
    </div>
  );
};

export default Assignlist;
