import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// TODO: Ganti data ini dengan data asli dari NextAuth saat sudah terhubung
const FAKE_USER = {
  name: "Andy M.",
  email: "andy.motor@example.com",
  avatarUrl: "https://github.com/shadcn.png", // Placeholder image
};

export function UserNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={FAKE_USER.avatarUrl}
              alt={`Avatar of ${FAKE_USER.name}`}
            />
            <AvatarFallback>{FAKE_USER.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{FAKE_USER.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {FAKE_USER.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profil</DropdownMenuItem>
          <DropdownMenuItem>Riwayat Kupon</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {/* TODO: Hubungkan fungsi logout asli di sini */}
        <DropdownMenuItem>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
