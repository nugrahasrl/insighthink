"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { BookOpen, FileEdit, BookText, Plus, Trash2, FileImage, Save, X, FilePlus2 } from "lucide-react"
import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"

// Dynamically import TextEditor to avoid SSR issues
const TextEditor = dynamic(() => import("@/components/editor-js"), { ssr: false })

const chapterSchema = z.object({
  title: z.string().min(1, "Chapter title is required"),
  content: z.object({ blocks: z.array(z.any()) }).refine((data) => data.blocks.length > 0, {
    message: "Chapter content is required",
  }), // Adjusted for EditorJS
})

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  description: z.any().optional(), // Changed to any for EditorJS
  content: z.string().optional(),
  chapters: z.array(chapterSchema),
  keyTerms: z.array(
    z.object({
      term: z.string().min(1, "Term is required"),
      definition: z.string().min(1, "Definition is required"),
    }),
  ),
  genres: z.string().optional(),
  pageCount: z.string().optional(),
  readingTime: z.string().optional(),
  coverImage: z
    .any()
    .optional()
    .refine((file) => !file || file instanceof File, "Cover image must be a valid file")
    .refine((file) => !file || file.size <= 5000000, "Max file size is 5MB")
    .refine(
      (file) => !file || ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type),
      "Only .jpg, .png, and .webp formats are supported",
    ),
})

export type BookFormValues = z.infer<typeof bookSchema>

type EditBookFormProps = {
  defaultValues: BookFormValues
  onSubmit: (data: BookFormValues) => Promise<void>
  isSubmitting: boolean
}

export function EditBookForm({ defaultValues, onSubmit, isSubmitting }: EditBookFormProps) {
  const [mounted, setMounted] = useState(false)
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null)
  const [activeChapter, setActiveChapter] = useState<string | null>("0")

  // Initialize form with default values
  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      ...defaultValues,
      // Ensure description and chapter content are in EditorJS format
      description:
        defaultValues.description && typeof defaultValues.description === "string"
          ? { blocks: [{ type: "paragraph", data: { text: defaultValues.description } }] }
          : defaultValues.description || { blocks: [] },
      chapters:
        defaultValues.chapters?.map((chapter) => ({
          ...chapter,
          content:
            chapter.content && typeof chapter.content === "string"
              ? { blocks: [{ type: "paragraph", data: { text: chapter.content } }] }
              : chapter.content || { blocks: [] },
        })) || [],
    },
  })

  // Set up field arrays for chapters and key terms
  const {
    fields: chapterFields,
    append: appendChapter,
    remove: removeChapter,
  } = useFieldArray({
    name: "chapters",
    control: form.control,
  })

  const {
    fields: keyTermFields,
    append: appendKeyTerm,
    remove: removeKeyTerm,
  } = useFieldArray({
    name: "keyTerms",
    control: form.control,
  })

  // Ensure component has rendered on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Initialize preview from defaultValues.coverImageUrl when form first loads
  useEffect(() => {
    if (defaultValues.coverImage) {
      setCoverImagePreview(defaultValues.coverImage)
    }
  }, [defaultValues.coverImage])

  // Handle file input change for cover image
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue("coverImage", file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Basic Info</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <BookText className="h-4 w-4" />
              <span>Content</span>
            </TabsTrigger>
            <TabsTrigger value="metadata" className="flex items-center gap-2">
              <FileEdit className="h-4 w-4" />
              <span>Metadata</span>
            </TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
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
                        <Input placeholder="Book title" {...field} className="h-10" />
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
                        <Input placeholder="Author name" {...field} className="h-10" />
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
                        <Input placeholder="Fiction, Fantasy, Science Fiction, etc." {...field} className="h-10" />
                      </FormControl>
                      <FormDescription className="text-xs">Separate each genre with a comma.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="coverImage"
                  render={({ field: { value, onChange, ...rest } }) => (
                    <FormItem>
                      <FormLabel className="text-base">Cover Image</FormLabel>
                      <div className="border rounded-lg p-4 flex flex-col items-center justify-center text-center">
                        <div className="mb-4 mt-2">
                          {coverImagePreview ? (
                            <div className="relative w-32 h-40 mx-auto">
                              <img
                                src={coverImagePreview || "/placeholder.svg"}
                                alt="Cover preview"
                                className="object-cover w-full h-full rounded-md shadow-sm"
                                onError={() => setCoverImagePreview("/placeholder.svg?height=300&width=200")}
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
                            onClick={() => document.getElementById("coverImage")?.click()}
                            className="gap-2"
                          >
                            <FileImage className="h-4 w-4" />
                            {coverImagePreview ? "Change Image" : "Upload Image"}
                          </Button>

                          <Input
                            id="coverImage"
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/jpg"
                            className="hidden"
                            onChange={handleCoverImageChange}
                            {...rest}
                          />

                          <p className="text-xs text-muted-foreground">JPG, PNG or WebP, max 5MB</p>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      Book Description <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      {mounted && (
                        <TextEditor
                          data={field.value}
                          onChange={field.onChange}
                          placeholder="Write your book description..."
                        />
                      )}
                    </FormControl>
                    <FormDescription className="text-xs mt-2">
                      Use the formatting tools to style your description
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Additional Content (Optional)</FormLabel>
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
                        const newIndex = chapterFields.length
                        appendChapter({
                          title: `Chapter ${newIndex + 1}`,
                          content: { blocks: [] },
                        })
                        setActiveChapter(newIndex.toString())
                      }}
                      className="h-8 gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Chapter
                    </Button>
                  </CardTitle>
                  <CardDescription>Add chapters and their content to your book</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    value={activeChapter ?? ""}
                    onValueChange={setActiveChapter}
                  >
                    {chapterFields.map((field, index) => (
                      <AccordionItem
                        key={field.id}
                        value={index.toString()}
                        className={cn(
                          "border rounded-md px-1 mb-3",
                          activeChapter === index.toString() ? "border-primary/30 bg-muted/30" : "border-border",
                        )}
                      >
                        <AccordionTrigger className="px-3 py-2 hover:no-underline">
                          <div className="flex items-center gap-2 w-full">
                            <span className="font-medium">{`Chapter ${index + 1}`}</span>
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
                                  e.stopPropagation()
                                  removeChapter(index)
                                  if (activeChapter === index.toString() && index > 0) {
                                    setActiveChapter((index - 1).toString())
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
                                  Chapter Content <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  {mounted && (
                                    <TextEditor
                                      data={field.value}
                                      onChange={field.onChange}
                                      placeholder="Enter chapter content"
                                    />
                                  )}
                                </FormControl>
                                <FormDescription className="text-xs">
                                  Use the formatting tools to style your chapter content
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
                        No chapters added yet. Click the "Add Chapter" button to create your first chapter.
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
                      onClick={() => appendKeyTerm({ term: "", definition: "" })}
                      className="h-8 gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Term
                    </Button>
                  </CardTitle>
                  <CardDescription>Add key terms and their definitions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {keyTermFields.map((field, index) => (
                      <div key={field.id} className="flex flex-col gap-3 p-3 border rounded-md relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`keyTerms.${index}.term`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">
                                  Term <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Enter term" className="h-9" />
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
                                  Definition <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Enter definition" className="h-9" />
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
                          No key terms added yet. Click the "Add Term" button to create your first key term.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Metadata Tab */}
          <TabsContent value="metadata" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="pageCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Page Count</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Number of pages" {...field} className="h-10" />
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
                    <FormLabel className="text-base">Reading Time (minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Estimated reading time" {...field} className="h-10" />
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
          <Button type="button" variant="outline" className="gap-2">
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="gap-2 min-w-[120px]">
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
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
  )
}
