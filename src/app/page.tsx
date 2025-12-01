import { isAuthenticated } from "@/actions/cookies";
import { redirect } from "next/navigation";

export default async function Home() {
  const isLogged = await isAuthenticated()
  if (isLogged){
  redirect('/dashboard/board')
  }
  else{
  redirect('/login')
  }
 
  // return (
  //   <div className="max-w-lg mx-auto flex items-center min-h-screen">
  //     <div className="flex flex-col gap-6">
  //       <div className="flex items-center justify-between">
  //         <h1 className="font-medium text-lg">Yesh Teacher</h1>
  //         <ThemeModeToggle />
  //       </div>
  //       <div className="flex gap-4">
  //         <Button className="text-center w-[212px]">
  //           <Plus className="size-5" />Анги үүсгэх
  //         </Button>
  //         <Button size="icon">
  //           <Plus className="size-5" />
  //         </Button>
  //         <Button size="icon" variant="secondary">
  //           <Plus className="size-5" />
  //         </Button>
  //         <Button size="icon" variant="negative">
  //           <Plus className="size-5" />
  //         </Button>
  //       </div>
  //       <InputGroup>
  //         <InputGroupInput placeholder="Search..." />
  //         <InputGroupAddon>
  //           <Search />
  //         </InputGroupAddon>
  //         <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
  //       </InputGroup>

  //       <InputGroup>
  //         <InputGroupTextarea placeholder="Ask, Search or Chat..." />
  //         <InputGroupAddon align="block-end">
  //           <InputGroupButton
  //             variant="outline"
  //             className="rounded-full"
  //             size="icon-xs"
  //           >
  //             <Plus />
  //           </InputGroupButton>
  //           <InputGroupText className="ml-auto">52% used</InputGroupText>
  //           <Separator orientation="vertical" className="h-4!" />
  //           <InputGroupButton
  //             variant="default"
  //             className="rounded-full"
  //             size="icon-xs"
  //             disabled
  //           >
  //             <ArrowUp />
  //             <span className="sr-only">Send</span>
  //           </InputGroupButton>
  //         </InputGroupAddon>
  //       </InputGroup>
  //       <div className="flex gap-2">
  //         <Input placeholder="Овог нэр" />
  //         <Button size={'sm'}>Илгээх</Button>
  //       </div>
  //     </div>
  //   </div>
  // );
}
