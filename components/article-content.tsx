// import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../components/ui/breadcrumb";
// import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "./ui/card";

// interface ArticleContentProps {
//   article: {
//     id: string;
//     title: string;
//     description: string;
//     content: string;
//   };
// }

// export default function ArticleContent({ article }: ArticleContentProps) {
//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Header with Breadcrumb */}
//       <header className="flex h-16 shrink-0 items-center gap-2">
//         <div className="flex items-center gap-2 px-4">
//           <Breadcrumb>
//             <BreadcrumbList>
//               <BreadcrumbItem>
//                 <BreadcrumbLink href="/curated-contents">
//                   Curated Contents
//                 </BreadcrumbLink>
//               </BreadcrumbItem>
//               <BreadcrumbSeparator />
//               <BreadcrumbItem>
//                 <BreadcrumbPage>{article.title}</BreadcrumbPage>
//               </BreadcrumbItem>
//             </BreadcrumbList>
//           </Breadcrumb>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="flex-1 p-7">
//           <CardHeader>
//             <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
//           </CardHeader>
//           <CardDescription>
//             <p className="text-gray-500 mb-4">{article.description}</p>
//           </CardDescription>
//           {/* <CardContent> */}
//             {/* <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} /> */}
//           {/* </CardContent> */}
//       </main>
//     </div>
//   );
// }