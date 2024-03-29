/* eslint-disable @next/next/no-img-element */

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
import { useAuth } from "@/context/authContext.js";


export default function ProfileClient() {
  const {user, logOut} = useAuth();

  return (
    user ? (
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage
                src={user.profPic}
                alt="Avatar"
              />
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{user.displayName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>

                <div className="flex flex-row " onClick={logOut()}>
                <IoIosLogOut className="w-6 h-6" />
                <span className="ml-2">Logout</span>
                </div>
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
