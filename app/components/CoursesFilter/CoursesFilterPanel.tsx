"use client";
import { useEffect, useState } from "react";
import ClearFiltersIcon from "@/app/components/icons/ClearFiltersIcon";
import CategoryChip from "./CategoryChip";
import TopicChip from "./TopicChip";
import InstructorChip from "./InstructorChip";
import ActiveFiltersBar from "./ActiveFiltersBar";
import { Category, Topic, Instructor } from "@/app/types/filters";
import Spinner from "@/app/components/ui/Spinner";

interface CoursesFilterPanelProps {
  selectedCategories: number[];
  selectedTopics: number[];
  selectedInstructors: number[];
  totalActiveFilters: number;
  onToggleCategory: (id: number) => void;
  onToggleTopic: (id: number) => void;
  onToggleInstructor: (id: number) => void;
  onClearAll: () => void;
}

export default function CoursesFilterPanel({
  selectedCategories,
  selectedTopics,
  selectedInstructors,
  totalActiveFilters,
  onToggleCategory,
  onToggleTopic,
  onToggleInstructor,
  onClearAll,
}: CoursesFilterPanelProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilters = async () => {
      setLoading(true);
      const [catRes, topicRes, instructorRes] = await Promise.all([
        fetch("https://api.redclass.redberryinternship.ge/api/categories"),
        fetch("https://api.redclass.redberryinternship.ge/api/topics"),
        fetch("https://api.redclass.redberryinternship.ge/api/instructors"),
      ]);
      const [catData, topicData, instructorData] = await Promise.all([
        catRes.json(),
        topicRes.json(),
        instructorRes.json(),
      ]);
      setCategories(catData.data ?? []);
      setTopics(topicData.data ?? []);
      setInstructors(instructorData.data ?? []);
      setLoading(false);
    };
    fetchFilters();
  }, []);

  return (
    <div>
      <div className="flex items-center gap-[55px]">
        <p className="text-[#0A0A0A] font-semibold text-[40px] leading-[100%] tracking-[0%] flex w-[121px] h-[48px] justify-center items-center">
          Filters
        </p>
        <div
          className="flex items-center h-[24px] gap-[6px] group cursor-pointer"
          onClick={onClearAll}
        >
          <p className="flex items-center justify-center group-hover:text-[#4F46E5] w-[116px] text-[#8A8A8A] font-medium text-[16px] leading-[24px] tracking-[0%]">
            Clear All Filters
          </p>
          <ClearFiltersIcon />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center w-full mt-[60px]">
          <Spinner size={40} />
        </div>
      ) : (
        <>
          <div className="w-[309px] mt-[32px]">
            <p className="h-[22px] flex items-center text-[#666666] font-medium text-[18px] leading-[100%] tracking-[0%]">
              Categories
            </p>
            <div className="flex items-center w-full mt-[24px] flex-wrap gap-[8px]">
              {categories.map((cat) => (
                <CategoryChip
                  key={cat.id}
                  category={cat}
                  active={selectedCategories.includes(cat.id)}
                  onClick={() => onToggleCategory(cat.id)}
                />
              ))}
            </div>
          </div>

          <div className="w-[309px] mt-[56px]">
            <p className="h-[22px] flex items-center text-[#666666] font-medium text-[18px] leading-[100%] tracking-[0%]">
              Topics
            </p>
            <div className="flex items-center w-full mt-[24px] flex-wrap gap-[8px]">
              {(selectedCategories.length === 0
                ? topics
                : topics.filter((t) => selectedCategories.includes(t.categoryId))
              ).map((topic) => (
                <TopicChip
                  key={topic.id}
                  topic={topic}
                  active={selectedTopics.includes(topic.id)}
                  onClick={() => onToggleTopic(topic.id)}
                />
              ))}
            </div>
          </div>

          <div className="w-[309px] mt-[56px]">
            <p className="h-[22px] flex items-center text-[#666666] font-medium text-[18px] leading-[100%] tracking-[0%]">
              Instructor
            </p>
            <div className="flex items-center w-full mt-[24px] flex-wrap gap-[8px]">
              {instructors.map((instructor) => (
                <InstructorChip
                  key={instructor.id}
                  instructor={instructor}
                  active={selectedInstructors.includes(instructor.id)}
                  onClick={() => onToggleInstructor(instructor.id)}
                />
              ))}
            </div>
          </div>
        </>
      )}

      <ActiveFiltersBar total={totalActiveFilters} />
    </div>
  );
}