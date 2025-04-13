import clientPromise from "@/lib/mongodb";
import CuratedContentsClient from "./curated-contents-client";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

interface CuratedContent {
  id: string;
  type: 'articles' | 'videos';
  title: string;
  description: string;
  source: string;
  link: string;
  readTime: string;
  likes: number;
  duration?: string;
  views?: number;
  content: string;
}

async function getCuratedContents(): Promise<CuratedContent[]> {
  const client = await clientPromise;
  const db = client.db("insighthink");
  const curated = await db.collection("curated_content").find({}).toArray();
  return curated.map((doc) => ({
    id: doc._id.toString(),
    type: doc.type || "",
    title: doc.title || "",
    description: doc.description || "",
    source: doc.source || "",
    link: doc.link || "",
    readTime: doc.readTime || "",
    likes: doc.likes ? Number(doc.likes) : 0,
    duration: doc.duration,
    views: doc.views,
    content: doc.content || "",
  }));
}

export default async function CuratedContentsPage() {
  const curatedContent = await getCuratedContents();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Menu
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Curated Contents</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            {curatedContent.map((item) => (
              <CuratedContentsClient key={item.id} item={item} />
            ))}
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}