/* eslint-disable @next/next/no-img-element */

import { useUser } from "@auth0/nextjs-auth0/client";
import { Avatar, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {IoIosLogOut} from "react-icons/io";
import { Button } from "./ui/button";

export default function ProfileClient() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    user ? (
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage
                src={user.picture ? user.picture : ""}
                alt="Avatar"
              />
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <a href="/api/auth/logout">
                <div className="flex flex-row ">
                <IoIosLogOut className="w-6 h-6" />
                <span className="ml-2">Logout</span>
                </div>
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ) : (
      null
      // <div>
      //   <Button onClick={
      //     () => {
      //       window.location.href = "/api/auth/login";
      //     }
      //   }>Login</Button>
      // </div>
    )
  );
}
