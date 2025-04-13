"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type KeyTerm = {
  term: string;
  definition: string;
};

type KeyTermsInputProps = {
  defaultKeyTerms?: KeyTerm[];
  onChange: (keyTerms: KeyTerm[]) => void;
};

export function KeyTermsInput({ defaultKeyTerms = [{ term: "", definition: "" }], onChange }: KeyTermsInputProps) {
  const [keyTerms, setKeyTerms] = useState<KeyTerm[]>(defaultKeyTerms);

  const handleTermChange = (index: number, field: keyof KeyTerm, value: string) => {
    const updated = [...keyTerms];
    updated[index][field] = value;
    setKeyTerms(updated);
    onChange(updated);
  };

  const addKeyTerm = () => {
    if (!keyTerms[keyTerms.length - 1]?.term || !keyTerms[keyTerms.length - 1]?.definition) {
      alert("Please complete the current key term and definition first.");
      return;
    }
    const updated = [...keyTerms, { term: "", definition: "" }];
    setKeyTerms(updated);
    onChange(updated);
  };

  const removeKeyTerm = (index: number) => {
    const updated = keyTerms.filter((_, idx) => idx !== index);
    setKeyTerms(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {keyTerms.map((item, index) => (
        <div key={index} className="border p-4 rounded space-y-2">
          <div>
            <label htmlFor={`term-${index}`} className="block text-sm font-medium">Term</label>
            <Input
              id={`term-${index}`}
              type="text"
              value={item.term}
              onChange={(e) => handleTermChange(index, "term", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="Enter term"
            />
          </div>
          <div>
            <label htmlFor={`definition-${index}`} className="block text-sm font-medium">Definition</label>
            <Input
              id={`definition-${index}`}
              type="text"
              value={item.definition}
              onChange={(e) => handleTermChange(index, "definition", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="Enter definition"
            />
          </div>
          {keyTerms.length > 1 && (
            <button
              type="button"
              onClick={() => removeKeyTerm(index)}
              className="text-white text-sm rounded-md border bg-red-500 p-2"
            >
              Remove Term
            </button>
          )}
        </div>
      ))}
      <Button type="button" onClick={addKeyTerm}>
        Add Key Term
      </Button>
    </div>
  );
}
