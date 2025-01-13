const availableModels = [
  "users",
  "categories",
  "subcategories",
  "posts",
  "tests",
  "diagrams",
  "files"
]

export const validateModelName = (model: string) => {
  return availableModels.includes(model);
}