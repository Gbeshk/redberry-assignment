import { useState } from "react";

export function useFilters() {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<number[]>([]);
  const [selectedInstructors, setSelectedInstructors] = useState<number[]>([]);

  const toggle = (
    setter: React.Dispatch<React.SetStateAction<number[]>>,
    id: number
  ) =>
    setter((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleCategory = (id: number) => toggle(setSelectedCategories, id);
  const toggleTopic = (id: number) => toggle(setSelectedTopics, id);
  const toggleInstructor = (id: number) => toggle(setSelectedInstructors, id);

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedTopics([]);
    setSelectedInstructors([]);
  };

  const totalActiveFilters =
    selectedCategories.length + selectedTopics.length + selectedInstructors.length;

  return {
    selectedCategories,
    selectedTopics,
    selectedInstructors,
    toggleCategory,
    toggleTopic,
    toggleInstructor,
    clearAllFilters,
    totalActiveFilters,
  };
}