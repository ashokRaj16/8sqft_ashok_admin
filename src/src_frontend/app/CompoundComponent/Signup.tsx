import { Button } from "@/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import Image from "next/image";
import Link from "next/link";

export default function SignupComponent() {
  return (
    <Card className="max-w-[450px] w-full rounded-md border-none">
      <CardHeader className="flex flex-col items-center">
        <Image
          src="/assets/logo/8SQFT.svg"
          alt="main-logo"
          width={30}
          height={30}
        />
        <CardTitle className="text-center">Welcome to 8sqft</CardTitle>
        <div className="text-gray text-sm w-full text-center ">
          Create a free account
        </div>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4">
          <div className="flex gap-1">
            <Input
              id="firstname"
              placeholder="First Name"
              className="placeholder:text-sm"
            />
            <Input
              id="lastname"
              placeholder="Last Name"
              className="placeholder:text-sm"
            />
          </div>
          <Input
            id="whatsappmobilenumber"
            placeholder="Whats App Mobile Number"
            className="placeholder:text-sm"
          />
          <Input
            id="EmailID"
            placeholder="Email ID"
            className="placeholder:text-sm"
          />
          <Button className="w-full text-white py-3">Continue</Button>
        </form>
      </CardContent>
      <CardFooter className="">
        <div className="text-gray text-sm w-full text-center ">
          New to 8sqft?
          <Link href="/">
            <span className="text-[#FC6600] ml-1">Signup</span>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
