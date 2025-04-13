"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define a Zod schema for the article.
const articleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  content: z.string().min(1, "Content is required"),
  author: z.string().min(1, "Author is required"),
  source: z.string().optional(),
  excerpt: z.string().optional(),
  // Here, references is a comma-separated string.
  references: z.string().optional(),
});

export type ArticleFormValues = z.infer<typeof articleSchema>;

// Define a separate type for the submission payload.
export type ArticleSubmission = Omit<ArticleFormValues, "references"> & {
  references: string[];
};

interface EditArticleFormProps {
  defaultValues: ArticleFormValues;
  onSubmit: (data: ArticleSubmission) => Promise<void>;
  isSubmitting: boolean;
}

export function EditArticleForm({ defaultValues, onSubmit, isSubmitting }: EditArticleFormProps) {
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues,
  });

  const handleSubmit = async (data: ArticleFormValues) => {
    // Convert the references field (a comma-separated string) to an array.
    const refs =
      data.references && data.references.trim().length > 0
        ? data.references.split(",").map((r) => r.trim()).filter((r) => r.length > 0)
        : [];
    // Build a submission payload with references as an array.
    const payload: ArticleSubmission = { ...data, references: refs };
    await onSubmit(payload);
    // Optionally, reset the form if needed.
    // form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Article Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Article Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Content */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Article Content (HTML allowed)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Author */}
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input placeholder="Author Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Source */}
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source</FormLabel>
              <FormControl>
                <Input placeholder="Source URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Excerpt */}
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea placeholder="Short Excerpt" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* References */}
        <FormField
          control={form.control}
          name="references"
          render={({ field }) => (
            <FormItem>
              <FormLabel>References</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Reference 1, Reference 2, Reference 3"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter references as a comma-separated list.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
