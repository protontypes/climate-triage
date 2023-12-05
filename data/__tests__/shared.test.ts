import { Repository } from "@/types/types";
import { getFilteredLanguages, getFilteredTags } from "../shared";
import { dummyRepositories } from "./test-data";

jest.mock("../github");

describe("shared", () => {
  describe("getFilteredLanguages", () => {
    it("returns an empty array when given an empty array of repositories", () => {
      const result = getFilteredLanguages([]);
      expect(result).toEqual([]);
    });

    it("returns an array of CountableLanguage objects when given an array of repositories", () => {
      const result = getFilteredLanguages(dummyRepositories);
      expect(result).toEqual([{ id: "python", display: "Python", count: 3 }]);
    });

    it("filters out languages with less than 3 repositories and sorts the remaining languages alphabetically", () => {
      const repositories = [
        {
          name: "Angular1",
          url: "https://github.com/angular/angular",
          language: { id: "typescript", display: "TypeScript" },
          tags: [{ id: "ui", display: "UI" }]
        },
        {
          name: "Angular2",
          url: "https://github.com/angular/angular",
          language: { id: "typescript", display: "TypeScript" },
          tags: [{ id: "ui", display: "UI" }]
        },
        {
          name: "React",
          url: "https://github.com/facebook/react",
          language: { id: "javascript", display: "JavaScript" },
          tags: [{ id: "ui", display: "UI" }]
        },
        {
          name: "React Dates",
          url: "https://github.com/airbnb/react-dates",
          language: { id: "javascript", display: "JavaScript" },
          tags: [
            { id: "ui", display: "UI" },
            { id: "calendar", display: "Calendar" }
          ]
        },
        {
          name: "Vue.js",
          url: "https://github.com/vuejs/vue",
          language: { id: "javascript", display: "JavaScript" },
          tags: [{ id: "ui", display: "UI" }]
        },
        {
          name: "Angular",
          url: "https://github.com/angular/angular",
          language: { id: "typescript", display: "TypeScript" },
          tags: [{ id: "ui", display: "UI" }]
        }
      ] as Repository[];
      const result = getFilteredLanguages(repositories);
      console.log(result);
      expect(result).toEqual([
        { id: "javascript", display: "JavaScript", count: 3 },
        { id: "typescript", display: "TypeScript", count: 3 }
      ]);
    });
  });

  describe("getFilteredTags", () => {
    it("returns an empty array when given an empty array of repositories", () => {
      const result = getFilteredTags([]);
      expect(result).toEqual([]);
    });

    it("returns an array of CountableTag objects when given an array of repositories", () => {
      const repositories = [
        {
          name: "React",
          url: "https://github.com/facebook/react",
          language: { id: "javascript", display: "JavaScript" },
          tags: [{ id: "ui", display: "UI" }]
        },
        {
          name: "React Dates",
          url: "https://github.com/airbnb/react-dates",
          language: { id: "javascript", display: "JavaScript" },
          tags: [
            { id: "ui", display: "UI" },
            { id: "calendar", display: "Calendar" }
          ]
        },
        {
          name: "Vue.js",
          url: "https://github.com/vuejs/vue",
          language: { id: "javascript", display: "JavaScript" },
          tags: [{ id: "ui", display: "UI" }]
        }
      ] as Repository[];
      const result = getFilteredTags(repositories);
      expect(result).toEqual([{ id: "ui", display: "UI", count: 3 }]);
    });

    it("filters out tags with less than 3 repositories and sorts the remaining tags by count descending", () => {
      const repositories = [
        {
          name: "React",
          url: "https://github.com/facebook/react",
          language: { id: "javascript", display: "JavaScript" },
          tags: [{ id: "ui", display: "UI" }]
        },
        {
          name: "React Dates",
          url: "https://github.com/airbnb/react-dates",
          language: { id: "javascript", display: "JavaScript" },
          tags: [
            { id: "ui", display: "UI" },
            { id: "calendar", display: "Calendar" }
          ]
        },
        {
          name: "Vue.js",
          url: "https://github.com/vuejs/vue",
          language: { id: "javascript", display: "JavaScript" },
          tags: [
            { id: "ui", display: "UI" },
            { id: "calendar", display: "Calendar" }
          ]
        },
        {
          name: "Angular",
          url: "https://github.com/angular/angular",
          language: { id: "typescript", display: "TypeScript" },
          tags: [
            { id: "ui", display: "UI" },
            { id: "calendar", display: "Calendar" },
            { id: "angular", display: "Angular" }
          ]
        }
      ] as Repository[];
      const result = getFilteredTags(repositories);
      expect(result).toEqual([
        { id: "ui", display: "UI", count: 4 },
        { id: "calendar", display: "Calendar", count: 3 }
      ]);
    });
  });
});
