"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  BookText,
  Plus,
  Trash2,
  Save,
  X,
  FilePlus2,
  Hash,
  Info,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { htmlToPlainText, editorJsToPlainText } from "@/lib/utils";

// Define the form schema with Zod
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  description: z.string().optional(),
  content: z.string().optional(),
  chapters: z.array(
    z.object({
      title: z.string().min(1, "Chapter title is required"),
      content: z.string().optional(),
    })
  ),
  keyTerms: z.array(
    z.object({
      term: z.string().min(1, "Term is required"),
      definition: z.string().min(1, "Definition is required"),
    })
  ),
  coverImage: z.any().optional(),
  coverImageUrl: z.string().optional(), // Tambahkan properti ini
  pageCount: z.string().optional(),
  readingTime: z.string().optional(),
  genres: z.string().optional(),
});

// Define the form values type
export type BookFormValues = z.infer<typeof formSchema>;

interface EditBookFormProps {
  onSubmit: (data: BookFormValues) => void;
  isSubmitting: boolean;
  defaultValues: BookFormValues;
}

export function EditBookForm({
  onSubmit,
  isSubmitting,
  defaultValues,
}: EditBookFormProps) {
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );
  const [activeChapter, setActiveChapter] = useState<string | null>("0");

  // Konversi data dari EditorJS atau HTML ke teks biasa
  const processedDefaultValues = {
    ...defaultValues,
    // Konversi deskripsi ke teks biasa
    description:
      typeof defaultValues.description === "string"
        ? htmlToPlainText(defaultValues.description)
        : editorJsToPlainText(defaultValues.description),
    // Konversi konten bab ke teks biasa
    chapters: defaultValues.chapters?.map((chapter) => ({
      ...chapter,
      content:
        typeof chapter.content === "string"
          ? htmlToPlainText(chapter.content)
          : editorJsToPlainText(chapter.content),
    })) || [{ title: "Chapter 1", content: "" }],
  };

  // Initialize form with default values
  const form = useForm<BookFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: processedDefaultValues,
  });

  // Set up field arrays for chapters and key terms
  const {
    fields: chapterFields,
    append: appendChapter,
    remove: removeChapter,
  } = useFieldArray({
    name: "chapters",
    control: form.control,
  });

  const {
    fields: keyTermFields,
    append: appendKeyTerm,
    remove: removeKeyTerm,
  } = useFieldArray({
    name: "keyTerms",
    control: form.control,
  });

  // Initialize preview from defaultValues if available
  useEffect(() => {
    if (defaultValues.coverImageUrl) {
      setCoverImagePreview(defaultValues.coverImageUrl);
    }
  }, [defaultValues.coverImageUrl]);

  // Handle file input change for cover image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Set the file object directly to the form value
      form.setValue("coverImage", file);

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span>Basic Info</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <BookText className="h-4 w-4" />
              <span>Content</span>
            </TabsTrigger>
            <TabsTrigger value="metadata" className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              <span>Metadata</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        Title <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter book title"
                          {...field}
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        Author <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter author name"
                          {...field}
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="genres"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Genres</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Fiction, Fantasy, Science Fiction, etc."
                          {...field}
                          className="h-10"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Separate genres with commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <FormItem>
                  <FormLabel className="text-base">Cover Image</FormLabel>
                  <div className="grid gap-4">
                    <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
                      <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <div className="mb-4 mt-2">
                          {coverImagePreview ? (
                            <div className="relative w-32 h-40 mx-auto">
                              <img
                                src={coverImagePreview || "/placeholder.svg"}
                                alt="Cover preview"
                                className="object-cover w-full h-full rounded-md shadow-sm"
                                onError={() =>
                                  setCoverImagePreview(
                                    "/placeholder.svg?height=300&width=200"
                                  )
                                }
                              />
                            </div>
                          ) : (
                            <div className="bg-muted/40 rounded-md p-4 w-32 h-40 mx-auto flex items-center justify-center">
                              <BookOpen className="h-12 w-12 text-muted-foreground/60" />
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document.getElementById("coverImage")?.click()
                            }
                            className="gap-2"
                          >
                            <Upload className="h-4 w-4" />
                            {coverImagePreview
                              ? "Change Image"
                              : "Upload Image"}
                          </Button>

                          <Input
                            id="coverImage"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />

                          <p className="text-xs text-muted-foreground">
                            JPG, PNG or WebP, max 5MB
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </FormItem>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      Book Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Write your book description..."
                        className="min-h-[200px] resize-y"
                      />
                    </FormControl>
                    <FormDescription className="text-xs mt-2">
                      Describe your book in detail. You can use simple
                      formatting.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Optional additional content field */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      Additional Content (Optional)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter additional content if needed"
                        {...field}
                        className="min-h-[100px] resize-y"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Use this for any content that doesn't fit into chapters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Chapters Section */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookText className="h-4 w-4" />
                      Chapters
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newIndex = chapterFields.length;
                        appendChapter({
                          title: `Chapter ${newIndex + 1}`,
                          content: "",
                        });
                        // Set the new chapter as active
                        setActiveChapter(newIndex.toString());
                      }}
                      className="h-8 gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Chapter
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Add chapters and their content to your book
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    value={activeChapter || "0"}
                    onValueChange={setActiveChapter}
                  >
                    {chapterFields.map((field, index) => (
                      <AccordionItem
                        key={field.id}
                        value={index.toString()}
                        className={cn(
                          "border rounded-md px-1 mb-3",
                          activeChapter === index.toString()
                            ? "border-primary/30 bg-muted/30"
                            : "border-border"
                        )}
                      >
                        <AccordionTrigger className="px-3 py-2 hover:no-underline">
                          <div className="flex items-center gap-2 w-full">
                            <span className="font-medium">{`Chapter ${
                              index + 1
                            }`}</span>
                            <FormField
                              control={form.control}
                              name={`chapters.${index}.title`}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  placeholder="Chapter title"
                                  className="h-8 max-w-xs bg-transparent focus-visible:bg-background"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              )}
                            />
                            {chapterFields.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeChapter(index);
                                  if (
                                    activeChapter === index.toString() &&
                                    index > 0
                                  ) {
                                    setActiveChapter((index - 1).toString());
                                  }
                                }}
                                className="ml-auto h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                              </Button>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-3 pb-3">
                          <FormField
                            control={form.control}
                            name={`chapters.${index}.content`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">
                                  Chapter Content
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    placeholder="Enter chapter content"
                                    className="min-h-[200px] resize-y"
                                  />
                                </FormControl>
                                <FormDescription className="text-xs">
                                  Write your chapter content using plain text.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  {chapterFields.length === 0 && (
                    <Alert variant="default" className="bg-muted/30">
                      <AlertDescription className="text-center py-4">
                        No chapters added yet. Click the "Add Chapter" button to
                        create your first chapter.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Key Terms Section */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FilePlus2 className="h-4 w-4" />
                      Key Terms
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        appendKeyTerm({ term: "", definition: "" })
                      }
                      className="h-8 gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Term
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Add key terms and their definitions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {keyTermFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex flex-col gap-3 p-3 border rounded-md relative"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`keyTerms.${index}.term`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Term</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Enter term"
                                    className="h-9"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`keyTerms.${index}.definition`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">
                                  Definition
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Enter definition"
                                    className="h-9"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        {keyTermFields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeKeyTerm(index)}
                            className="absolute top-2 right-2 h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        )}
                      </div>
                    ))}

                    {keyTermFields.length === 0 && (
                      <Alert variant="default" className="bg-muted/30">
                        <AlertDescription className="text-center py-4">
                          No key terms added yet. Click the "Add Term" button to
                          create your first key term.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="metadata" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="pageCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Page Count</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Number of pages"
                        {...field}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="readingTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      Reading Time (minutes)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Estimated reading time"
                        {...field}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
        </Tabs>

        <Separator />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild className="gap-2">
            <Link href="/library">
              <X className="h-4 w-4" />
              Cancel
            </Link>
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="gap-2 min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
