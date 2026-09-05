import type { Metadata } from "next";
import { requireFamilyContext } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchBox } from "./SearchBox";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage() {
  await requireFamilyContext();
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Search" intro="Find anything across NestWise." />
      <SearchBox />
    </div>
  );
}
