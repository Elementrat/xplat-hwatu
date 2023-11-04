
export async function GET(request: Request) {
  const links = {
    primary: [
      { name: "Home", path: "/wot" },
    ],
    legal: [
      { name: "Privacy" },
    ]
  }
  return Response.json(links)
}

export type NavigationLink = {
  name: string,
  path:string
}