
import React, { useState } from "react";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockCategories } from "@/lib/mockData";

interface FilterBarProps {
  onSearch: (term: string) => void;
  onCategoryChange: (category: string | null) => void;
  onSortChange: (sort: string) => void;
  onStatusChange: (status: string | null) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  onSearch,
  onCategoryChange,
  onSortChange,
  onStatusChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState("newest");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  const handleSortSelect = (sort: string) => {
    setSelectedSort(sort);
    onSortChange(sort);
  };

  const handleStatusSelect = (status: string | null) => {
    setSelectedStatus(status);
    onStatusChange(status);
  };

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "most_funded", label: "Most Funded" },
    { value: "least_funded", label: "Least Funded" },
    { value: "ending_soon", label: "Ending Soon" },
    { value: "recently_launched", label: "Recently Launched" },
  ];

  const statusOptions = [
    { value: "active", label: "Active Campaigns" },
    { value: "funded", label: "Funded Campaigns" },
    { value: "ending_soon", label: "Ending Soon" },
    { value: "new", label: "New Campaigns" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
      <form onSubmit={handleSearch} className="flex space-x-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      <div className="flex flex-wrap gap-2">
        {/* Category Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              {selectedCategory || "Categories"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Select Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
              <DropdownMenuItem onClick={() => handleCategorySelect(null)}>
                All Categories
              </DropdownMenuItem>
              {mockCategories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort Order */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              {sortOptions.find((option) => option.value === selectedSort)?.label || "Sort By"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Sort Order</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleSortSelect(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              {selectedStatus ? statusOptions.find((s) => s.value === selectedStatus)?.label : "Status"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Campaign Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleStatusSelect(null)}>
                All Statuses
              </DropdownMenuItem>
              {statusOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleStatusSelect(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear Filters Button */}
        {(selectedCategory || selectedStatus || searchTerm) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory(null);
              setSelectedStatus(null);
              onSearch("");
              onCategoryChange(null);
              onStatusChange(null);
            }}
            className="ml-auto"
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
