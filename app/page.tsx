import Header from "@/components/Header";
import PromotionForm from "@/components/PromotionForm";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center sm:justify-center sm:py-8 sm:px-4">
      <div className="w-full sm:max-w-md bg-white sm:rounded-2xl sm:shadow-lg overflow-hidden flex flex-col min-h-screen sm:min-h-0">
        <Header />
        <main className="flex-1">
          <PromotionForm />
        </main>
      </div>
    </div>
  );
}
