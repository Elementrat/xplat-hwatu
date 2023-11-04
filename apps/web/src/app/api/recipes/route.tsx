
export async function GET(request: Request) {
  const recipes = [
    {name: "Recipe 1"},
    {name: "Recipe 2"},
    {name: "Recipe 3"},
  ]
  return Response.json(recipes)
}